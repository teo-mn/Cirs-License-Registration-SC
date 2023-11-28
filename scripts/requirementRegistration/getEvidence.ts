import { ethers } from "hardhat";

async function main() {
  const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const instance = LicenseRequirementRegistration.attach(process.env.REQUIREMENT_ADDRESS);
  // @ts-ignore
  const data = await instance.getEvidences(ethers.toUtf8Bytes("licenseID"), ethers.toUtf8Bytes("requirementID"));
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
