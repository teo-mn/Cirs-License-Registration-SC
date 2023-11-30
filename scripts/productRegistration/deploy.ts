import { ethers } from "hardhat";

export async function productRegistration() {
  const instance = await ethers.deployContract("LicenseProductRegistration", [process.env.ADMIN_ADDRESS]);

  await instance.waitForDeployment();

  console.log(`LicenseProductRegistration contract deployed to ${instance.target}`);
  return instance;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
productRegistration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
