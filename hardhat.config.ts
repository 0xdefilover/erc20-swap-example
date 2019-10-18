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
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        // url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}` 
      }
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      chainId: chainIds.kovan,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      chainId: chainIds.ropsten,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  solidity: {
    compilers: [
      { 
        version: "0.8.3", 
        settings: {} 
      }
    ],
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