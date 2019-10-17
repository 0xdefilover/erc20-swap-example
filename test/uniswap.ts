import { ethers } from "hardhat";
const hre = require("hardhat");
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TestUniswap } from "../typechain/TestUniswap";
const { BN } = require("@openzeppelin/test-helpers");
chai.use(solidity);
const { expect } = chai;
import { BigNumber } from "@ethersproject/bignumber";

export const ether = (amount: number | string): BigNumber => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

export const unlockAccount = async (address: string) => {
  await hre.network.provider.send("hardhat_impersonateAccount", [address]);
  return address;
};

describe("Uniswap", () => {
  let testUniswap: TestUniswap;
  let erc20: any;
  let signers: any;
  beforeEach(async () => {
    // 1
    signers = await ethers.getSigners();
    // 2

    const cocosToken = await ethers.getContractAt(
      "ICocosToken",
      "0x0C6f5F7D555E7518f6841a79436BD2b1Eef03381"
    );
    const cocosOwner = "0x2c3febbd385467da7fedb88ca6dbfa317dc492f7";
    await signers[0].sendTransaction({
      to: cocosOwner,
      value: ether(10),
    });
    await unlockAccount(cocosOwner);
    const cocosOwnerSigner = await ethers.provider.getSigner(cocosOwner);

    await cocosToken
      .connect(cocosOwnerSigner)
      .addWhiteAccount("0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE");

    const uniswapFactory = await ethers.getContractFactory(
      "TestUniswap",
      signers[0]
    );
    testUniswap = (await uniswapFactory.deploy()) as TestUniswap;
    await testUniswap.deployed();

    await cocosToken
      .connect(cocosOwnerSigner)
      .addWhiteAccount(testUniswap.address);

    await cocosToken
      .connect(cocosOwnerSigner)
      .addWhiteAccount("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");

    await cocosToken
    .connect(cocosOwnerSigner)
    .addWhiteAccount(signers[0].address);

    erc20 = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      ethers.constants.AddressZero
    );
  });

  describe("uniswap swap", async () => {
    it("swap successed", async () => {
      const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      const whale = "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE";
      // const whale = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
      const cocos = "0x0C6f5F7D555E7518f6841a79436BD2b1Eef03381";
      const pundix = "0x0FD10b9899882a6f2fcb5c371E17e70FdEe00C38";
      const dai = "0x6b175474e89094c44da98b954eedeac495271d0f";

      // const AMOUNT_IN = ethers.utils.parseUnits("10", 18);
      const AMOUNT_IN = ether(10);
      const AMOUNT_OUT_MIN = 1;
      const TOKEN_IN = pundix;
      const TOKEN_OUT = weth;
      const TO = signers[0].address;
      const tokenIn = await erc20.attach(TOKEN_IN);
      const tokenOut = await erc20.attach(TOKEN_OUT);

      // const pairAddress = await testUniswap.getUniswapV2PairAddress(TOKEN_IN, TOKEN_OUT);
      // console.log(pairAddress);
      //   const tokenWhale = await erc20.attach(whale);

      // await hre.network.provider.request({
      //   method: "hardhat_impersonateAccount",
      //   params: [whale],
      // });
      await unlockAccount(whale);
      const whaleSigner = await ethers.provider.getSigner(whale);

      // console.log(await whaleSigner.getBalance());
      await signers[0].sendTransaction({
        to: whale,
        value: ethers.utils.parseEther("100"),
      });
      // await ethers.provider.send("hardhat_setBalance", [whale, ethers.utils.parseEther("10")]);
      await tokenIn
        .connect(whaleSigner)
        .approve(testUniswap.address, ethers.utils.parseUnits("100", 18));
      const allowBalance = await tokenIn
        .connect(whaleSigner)
        .allowance(whale, testUniswap.address);
      console.log('allowance', allowBalance);
      await testUniswap
        .connect(whaleSigner)
        .swap(tokenIn.address, tokenOut.address, AMOUNT_IN, AMOUNT_OUT_MIN, TO);

      const balance = await tokenOut.balanceOf(TO);
      console.log(balance);
    });
  });
});
