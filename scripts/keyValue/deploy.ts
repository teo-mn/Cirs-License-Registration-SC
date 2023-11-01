import { ethers } from "hardhat";

async function main() {
  const instance = await ethers.deployContract("KeyValue", [process.env.ADMIN_ADDRESS, 'TestName']);

  await instance.waitForDeployment();

  console.log(`KeyValue contract deployed to ${instance.target}, ${await instance.name()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
