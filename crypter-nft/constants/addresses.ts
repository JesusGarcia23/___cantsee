import { NetworkId } from './networks';

interface IAddresses {
    [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
    [NetworkId.TESTNET_RINKEBY]: {
        MARKETPLACE: '0000'
    }
}