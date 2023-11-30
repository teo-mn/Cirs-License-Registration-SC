import { ethers } from "hardhat";

export async function licenseRegistration() {
  const instance = await ethers.deployContract("LicenseRegistration", [process.env.ADMIN_ADDRESS, 'TestName']);

  await instance.waitForDeployment();

  console.log(`LicenseRegistration contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
licenseRegistration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
