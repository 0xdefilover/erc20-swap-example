import { ethers } from "hardhat";
async function main() {
  const factory = await ethers.getContractFactory("TokenSwap");
  // If we had constructor arguments, they would be passed into deploy()
  const contract = await factory.deploy();
  await contract.deployed();
  // The address the Contract WILL have once mined
  console.log("TokenSwap deployed to: ", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });