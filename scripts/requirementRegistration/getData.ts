import { ethers } from "hardhat";

async function main() {
  const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const instance = LicenseRequirementRegistration.attach('0xf52f8623F3f743Aa16FCFbC452762C83F994c751');
  // @ts-ignore
  const data = await instance.getRequirement(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
