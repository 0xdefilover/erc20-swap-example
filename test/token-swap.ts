import { ethers } from "hardhat";
import hre from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TokenSwap } from "../typechain/TokenSwap";

chai.use(solidity);
const { expect } = chai;

export const unlockAccount = async (address: string) => {
  await hre.network.provider.send("hardhat_impersonateAccount", [address]);
  return address;
};

describe("Token Swap", () => {
  let tokenSwap: TokenSwap;
  let erc20: any;
  let signers: any;
  beforeEach(async () => {

    signers = await ethers.getSigners();

    const cocosToken = await ethers.getContractAt(
      "ICocosToken",
      "0x0C6f5F7D555E7518f6841a79436BD2b1Eef03381"
    );
    const cocosOwner = "0x2c3febbd385467da7fedb88ca6dbfa317dc492f7";

    await signers[0].sendTransaction({
      to: cocosOwner,
      value: ethers.utils.parseEther("10"),
    });
    await unlockAccount(cocosOwner);

    const cocosOwnerSigner = await ethers.provider.getSigner(cocosOwner);

    await cocosToken
      .connect(cocosOwnerSigner)
      .addWhiteAccount("0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE");

    const tokenSwapFactory = await ethers.getContractFactory(
      "TokenSwap",
      signers[0]
    );
    tokenSwap = (await tokenSwapFactory.deploy()) as TokenSwap;
    await tokenSwap.deployed();

    await cocosToken
      .connect(cocosOwnerSigner)
      .addWhiteAccount(tokenSwap.address);

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

  it("swap PUNDIX into WETH", async () => {
    const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const whale = "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE";

    const pundix = "0x0FD10b9899882a6f2fcb5c371E17e70FdEe00C38";

    const AMOUNT_IN = ethers.utils.parseEther("10");
    const AMOUNT_OUT_MIN = 1;
    
    const TO = signers[0].address;
    const tokenIn = await erc20.attach(pundix);
    const tokenOut = await erc20.attach(weth);

    await unlockAccount(whale);
    const whaleSigner = await ethers.provider.getSigner(whale);

    await signers[0].sendTransaction({
      to: whale,
      value: ethers.utils.parseEther("100"),
    });

    await tokenIn
      .connect(whaleSigner)
      .approve(tokenSwap.address, ethers.utils.parseUnits("100", 18));

    const amountOutMin = await tokenSwap
      .connect(whaleSigner)
      .getAmountOutMin(tokenIn.address, tokenOut.address, AMOUNT_IN);
    
    console.log('amountOutMin', amountOutMin.toString());

    await tokenSwap
      .connect(whaleSigner)
      .swap(tokenIn.address, tokenOut.address, AMOUNT_IN, AMOUNT_OUT_MIN, TO);

    const balance = await tokenOut.balanceOf(TO);
    console.log('swapped amount', balance.toString());
  });
});
