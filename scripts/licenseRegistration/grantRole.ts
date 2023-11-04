import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach('0x1cd8F973172460B1BFdBf76eb5430Dc00a4866E4');
  // @ts-ignore
  const data = await instance.grantRole(await instance.ISSUER_ROLE(), '0x7b5f6eEf1205aC0a578CF6442B79bD8937AAabfd');
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
