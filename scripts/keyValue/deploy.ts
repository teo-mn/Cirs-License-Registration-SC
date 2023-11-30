import { ethers } from "hardhat";

export async function keyValue() {
  const instance = await ethers.deployContract("KeyValue", [process.env.ADMIN_ADDRESS, 'TestName']);

  await instance.waitForDeployment();

  console.log(`KeyValue contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
keyValue().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
