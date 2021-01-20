import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
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
    hardhat: {
      chainId: chainIds.hardhat,
      forking: { // mainnet fork
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: 13718340
      }
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
        version: "0.6.12", 
        settings: {} 
      }
    ],
  },
  mocha: {
    timeout: 80000
  }
};

export default config;