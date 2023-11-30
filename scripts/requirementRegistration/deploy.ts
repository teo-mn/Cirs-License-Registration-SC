import { ethers } from "hardhat";

export async function requirementRegistration(license_address = process.env.LICENSE_ADDRESS) {
  const instance = await ethers.deployContract("LicenseRequirementRegistration", [process.env.ADMIN_ADDRESS, 'TestName', license_address]);

  await instance.waitForDeployment();

  console.log(`LicenseRequirementRegistration contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
requirementRegistration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
