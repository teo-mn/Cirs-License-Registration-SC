import { ethers } from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach('0x522Be02bAd15aa95a42A1e79372ef1d1C26857fE');
  // @ts-ignore
  const data = await instance.getLicense(ethers.toUtf8Bytes("licenseID"));
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
