import { NodeHelper } from "../helpers/NodeHelper";

interface INativeCurrency {
    name: string;
    symbol: string;
    decimals?: number;
}

interface INetwork {
    chainName: string;
    chainId: number;
    nativeCurrency: INativeCurrency;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    image: SVGImageElement | string;
    imageAltText: string;
    uri: () => string;
}

export enum NetworkId {
    TESTNET_RINKEBY = 4,
    Localhost = 1337,
}

export const NETWORKS: { [key: number]: INetwork } = {
    [NetworkId.TESTNET_RINKEBY]: {
        chainName: "Rinkeby Testnet",
        chainId: 4,
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: [""],
        blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
        image: "",
        imageAltText: "Ethereum Logo",
        uri: () => NodeHelper.getNetURI(NetworkId.TESTNET_RINKEBY),
    }
}