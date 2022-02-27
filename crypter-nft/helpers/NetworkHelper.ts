import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { EnvHelper } from "../helpers/Environment";
import { NodeHelper } from "../helpers/NodeHelper";

interface IGetCurrentNetwork {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const initNetworkFunc = async ({ provider }: IGetCurrentNetwork) => {
    try {
      let networkName: string;
      let uri: string;
      let supported = true;
      const id: number = await provider.getNetwork().then(network => network.chainId);
      switch (id) {
        case 4:
          networkName = "Rinkeby Testnet";
          uri = NodeHelper.getNetURI(id);
          break;
        default:
          supported = false;
          networkName = "Unsupported Network";
          uri = "";
          break;
      }
  
      return {
        networkId: id,
        networkName: networkName,
        uri: uri,
        initialized: supported,
      };
    } catch (e) {
      console.log(e);
      return {
        networkId: -1,
        networkName: "",
        uri: "",
        initialized: false,
      };
    }
};

export const idToHexString = (id: number) => {
    return "0x" + id.toString(16);
};
  
export const idFromHexString = (hexString: string) => {
    return parseInt(hexString, 16);
};