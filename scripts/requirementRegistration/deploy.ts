import { ethers } from "hardhat";

async function main() {
  const instance = await ethers.deployContract("LicenseRequirementRegistration", [process.env.ADMIN_ADDRESS, 'TestName', '0x1cd8F973172460B1BFdBf76eb5430Dc00a4866E4']);

  await instance.waitForDeployment();

  console.log(`LicenseRequirementRegistration contract deployed to ${instance.target}, ${await instance.name()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
