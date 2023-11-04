import {ethers} from "hardhat";

async function main() {
  const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const instance = LicenseRequirementRegistration.attach('0x7b5f6eEf1205aC0a578CF6442B79bD8937AAabfd');
  // @ts-ignore
  const data = await instance.register(
      ethers.toUtf8Bytes("licenseID"),
      ethers.toUtf8Bytes("requirementID"),
      ethers.toUtf8Bytes("requirementName"),
      ethers.toUtf8Bytes("additionalDataID"),
  );
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
