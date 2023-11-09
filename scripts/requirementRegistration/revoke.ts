import {ethers} from "hardhat";

async function main() {
  const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const instance = LicenseRequirementRegistration.attach('0x8d5E6b1555538Ba046BEC03dC716aDd960a6508c');
  // @ts-ignore
  const data = await instance.revoke(
      ethers.toUtf8Bytes("licenseID"),
      ethers.toUtf8Bytes("requirementID"),
      ethers.toUtf8Bytes("additionalData")
  );
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
