import Web3Modal from "web3modal";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { idFromHexString, initNetworkFunc } from "../helpers/NetworkHelper";
import { NETWORKS } from '../constants/networks';

type onChainProvider = {
    connect: () => Promise<Web3Provider | undefined>;
    disconnect: () => void;
    hasCachedProvider: () => boolean;
    address: string;
    connected: boolean;
    provider: JsonRpcProvider | null;
    web3Modal: Web3Modal | null;
    networkId: number;
    networkName: string;
    providerUri: string;
    providerInitialized: boolean;
};

export type Web3ContextData = {
    onChainProvider: onChainProvider;
} | null;

const Web3Context = React.createContext<Web3ContextData>(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);

    if (!web3Context) {
        throw new Error(
            "useWeb3Context() can only be used inside of <Web3ContextProvider />, " + "please declare it at a higher level.",
        );
    }

    const { onChainProvider } = web3Context;
    return useMemo<onChainProvider>(() => {
      return { ...onChainProvider };
    }, [web3Context]);
};

export const useAddress = () => {
    const { address } = useWeb3Context();
    return address;
}

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
    const [connected, setConnected] = useState<boolean>(false);
    const [address, setAddress] = useState("");
    const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
    const [networkId, setNetworkId] = useState(1);
    const [networkName, setNetworkName] = useState("");
    const [providerUri, setProviderUri] = useState("");
    const [providerInitialized, setProviderInitialized] = useState(false);
    const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const initModal = new Web3Modal({
                // network: "mainnet", // optional
                cacheProvider: true, // optional
                providerOptions: {
                    walletconnect: {
                        package: WalletConnectProvider,
                        options: {
                            rpc: {
                               4: NETWORKS[4].uri(),
                            }
                        }
                    }
                }
            });
            setWeb3Modal(initModal);
        }
    })

    const hasCachedProvider = (): boolean => {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    };

    // connect
    const connect = useCallback(async () => {
        let rawProvider;
        if (!web3Modal) {
            return;
        }
        rawProvider = await web3Modal.connect();
        const connectedProvider = new Web3Provider(rawProvider, "any");
        setProvider(connectedProvider);
        const connectedAddress = await connectedProvider.getSigner().getAddress();

        // Save everything after we've validated the right network.
        setAddress(connectedAddress);
        const networkHash = await initNetworkFunc({ provider: connectedProvider });
        console.log("networkHash", networkHash);
        setNetworkId(networkHash.networkId);
        setNetworkName(networkHash.networkName);
        setProviderUri(networkHash.uri);
        setProviderInitialized(networkHash.initialized);
        // Keep this at the bottom of the method, to ensure any repaints have the data we need
        setConnected(true);

        return connectedProvider;
    }, [provider, web3Modal, connected]);

    const disconnect = useCallback(async () => {
        if (!web3Modal) {
            return;
        }
        web3Modal.clearCachedProvider();
        setConnected(false);
    
        setTimeout(() => {
            const ISSERVER = typeof window === "undefined";

            if(!ISSERVER) {
                window.location.reload();
            }
        }, 1);
    }, [provider, web3Modal, connected]);

    const onChainProvider = useMemo(
        () => ({
          connect,
          disconnect,
          hasCachedProvider,
          provider,
          connected,
          address,
          web3Modal,
          networkId,
          networkName,
          providerUri,
          providerInitialized,
        }),
        [
          connect,
          disconnect,
          hasCachedProvider,
          provider,
          connected,
          address,
          web3Modal,
          networkId,
          networkName,
          providerUri,
          providerInitialized,
        ],
    );

    return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
}

