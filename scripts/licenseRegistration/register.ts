import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach(process.env.LICENSE_ADDRESS);
  // @ts-ignore
  const data = await instance.register(
      ethers.toUtf8Bytes("licenseID"),
      ethers.toUtf8Bytes("licenseName"),
      ethers.toUtf8Bytes("ownerID"),
      ethers.toUtf8Bytes("ownerName"),
      1699089253,
      1730711653,
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
