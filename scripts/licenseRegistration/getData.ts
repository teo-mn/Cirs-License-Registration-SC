import { ethers } from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach('0x6c4d4A9CCf42Adb52336872c8AD719dCA557763D');
  // @ts-ignore
  const data = await instance.getLicense(ethers.toUtf8Bytes("license_id"));
  console.log(data);
  console.log(data[0])
  console.log(ethers.toUtf8String(data[0]))
  console.log(await instance.queryFilter("*", 532193, 532293));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
