import { ethers } from "hardhat";

async function main() {
  const instance = await ethers.deployContract("LicenseProductRegistration", [process.env.ADMIN_ADDRESS]);

  await instance.waitForDeployment();

  console.log(`LicenseProductRegistration contract deployed to ${instance.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
