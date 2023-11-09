import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach('0x6c4d4A9CCf42Adb52336872c8AD719dCA557763D');
  // @ts-ignore
  const data = await instance.revoke(
      ethers.toUtf8Bytes("licenseID"),
      ethers.toUtf8Bytes("additionalDataID")
  );
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
