import { ethers } from "hardhat";

async function main() {
  const instance = await ethers.deployContract("LicenseRequirementRegistration", [process.env.ADMIN_ADDRESS, 'TestName', '0x6c4d4A9CCf42Adb52336872c8AD719dCA557763D']);

  await instance.waitForDeployment();

  console.log(`LicenseRequirementRegistration contract deployed to ${instance.target} , ${await instance.name()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
