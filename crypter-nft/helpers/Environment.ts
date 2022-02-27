import { NetworkId } from "../constants/networks";

export class EnvHelper {
    /**
   * @returns `process.env`
   */
    static env = process.env;

    static whitespaceRegex = /\s+/;

    static isNotEmpty(envVariable: string) {
        if (envVariable.length > 10) {
          return true;
        } else {
          return false;
        }
    }

    static getSelfHostedNode(networkId: NetworkId) {
        let URI_LIST: string[] = [];
        return URI_LIST;
    }

    /**
   * in development environment will return the `ethers` community api key so that devs don't need to add elements to their .env
   * @returns Array of Alchemy API URIs or empty set
   */
    static getAlchemyAPIKeyList(networkId: NetworkId): string[] {
        let ALCHEMY_ID_LIST: string[] = [];
        let uriPath: string;

        // If in production, split the provided API keys on whitespace. Otherwise use default.
        switch (networkId) {
        case NetworkId.TESTNET_RINKEBY:
            if (
            EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY &&
            EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY)
            ) {
            ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY.split(EnvHelper.whitespaceRegex);
            } else {
            ALCHEMY_ID_LIST = ["aF5TH9E9RGZwaAUdUd90BNsrVkDDoeaO"];
            }
            uriPath = "https://eth-rinkeby.alchemyapi.io/v2/";
            break;
        }

        return ALCHEMY_ID_LIST.map(alchemyID => uriPath + alchemyID);
    }

    /**
   * NOTE(appleseed): Infura IDs are only used as Fallbacks & are not Mandatory
   * @returns {Array} Array of Infura API Ids
   */
    static getInfuraIdList() {
        let INFURA_ID_LIST: string[];
    
        // split the provided API keys on whitespace
        if (EnvHelper.env.REACT_APP_INFURA_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_INFURA_IDS)) {
          INFURA_ID_LIST = EnvHelper.env.REACT_APP_INFURA_IDS.split(new RegExp(EnvHelper.whitespaceRegex));
        } else {
          INFURA_ID_LIST = [];
        }
    
        // now add the uri path
        if (INFURA_ID_LIST.length > 0) {
          INFURA_ID_LIST = INFURA_ID_LIST.map(infuraID => `https://mainnet.infura.io/v3/${infuraID}`);
        } else {
          INFURA_ID_LIST = [];
        }
        return INFURA_ID_LIST;
    }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
   static getAPIUris(networkId: NetworkId) {
    let ALL_URIs = EnvHelper.getSelfHostedNode(networkId);
    if (ALL_URIs.length === 0) {
      console.warn("API keys must be set in the .env, reverting to fallbacks");
      ALL_URIs = EnvHelper.getFallbackURIs(networkId);
    }
    return ALL_URIs;
  }

  static getFallbackURIs(networkId: NetworkId) {
    const ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(networkId), ...EnvHelper.getInfuraIdList()];
    return ALL_URIs;
  }
}