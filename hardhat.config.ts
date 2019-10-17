import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-dependency-compiler";
import * as dotenv from 'dotenv';
dotenv.config();

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat :{
      // blockGasLimit: 10000000,
      forking: {
        // url: "https://eth-mainnet.alchemyapi.io/v2/nKqhgMRUZJSw0baczgK177tpL59bae_j"
        url: "https://mainnet.infura.io/v3/c2ae77c81c9b4473812760afa0c33374"
      }
    },
    // kovan: {
    //   // url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
    //   url: 'https://eth-kovan.alchemyapi.io/v2/nKqhgMRUZJSw0baczgK177tpL59bae_j',
    //   chainId: 42,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   gasMultiplier: 1.25
    // },
    // ropsten: {
    //   // url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
    //   url: 'https://eth-ropsten.alchemyapi.io/v2/nKqhgMRUZJSw0baczgK177tpL59bae_j',
    //   // chainId: 42,
    //   chainId: 3,
    //   accounts: [`0x${PRIVATE_KEY}`],
    //   gasMultiplier: 1.25
    // }
  },
  solidity: {
    compilers: [{ version: "0.8.3", settings: {} }],
  },
  mocha: {
    timeout: 80000
  },
  dependencyCompiler: {
    paths: [
      '@openzeppelin/contracts/token/ERC20/IERC20.sol',
    ],
  }
};

export default config;