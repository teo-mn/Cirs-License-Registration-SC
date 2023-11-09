import {ethers} from "hardhat";

async function main() {
  const LicenseRequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const instance = LicenseRequirementRegistration.attach('0xff68A90c6A3D7F9FCdBEAe043167fBB4171d5e64');
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
