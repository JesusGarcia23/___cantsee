import { NetworkId } from "../constants/networks";
import { EnvHelper } from "./Environment";

export class NodeHelper {
    static _invalidNodesKey = "invalidNodes";

    // use sessionStorage so that we don't have to worry about resetting the invalidNodes list
    static _storage =  typeof window === "undefined" ? null  : window.sessionStorage;

    static currentRemovedNodes = NodeHelper._storage ? JSON.parse(NodeHelper._storage.getItem(NodeHelper._invalidNodesKey) || "{}") : null;
    static currentRemovedNodesURIs = NodeHelper.currentRemovedNodes ? Object.keys(NodeHelper.currentRemovedNodes) : null;

    /**
   * "intelligently" loadbalances production API Keys
   * @returns string
   */
    static getNetURI = (networkId: NetworkId): string => {
        // Shuffles the URIs for "intelligent" loadbalancing
        const allURIs = NodeHelper.getNodesUris(networkId);

        // There is no lightweight way to test each URL. so just return a random one.
        // if (workingURI !== undefined || workingURI !== "") return workingURI as string;
        const randomIndex = Math.floor(Math.random() * allURIs.length);
        return allURIs[randomIndex];
    };

    /**
   * returns Array of APIURIs where NOT on invalidNodes list
   */
    static getNodesUris = (networkId: NetworkId) => {
        let allURIs = EnvHelper.getAPIUris(networkId);
        const invalidNodes = NodeHelper.currentRemovedNodesURIs;
        // filter invalidNodes out of allURIs
        // this allows duplicates in allURIs, removes both if invalid, & allows both if valid
        allURIs = invalidNodes ? allURIs.filter(item => !invalidNodes.includes(item)) : [];

        // return the remaining elements
        if (allURIs.length === 0) {
            // NodeHelper._emptyInvalidNodesList(networkId);
            // allURIs = EnvHelper.getAPIUris(networkId);
            // In the meantime use the fallbacks
            allURIs = EnvHelper.getFallbackURIs(networkId);
        }
    return allURIs;
    };
}