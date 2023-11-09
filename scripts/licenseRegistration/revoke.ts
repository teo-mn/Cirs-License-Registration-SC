import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const instance = LicenseRegistration.attach('0xA90DFA44238c4FF26b48109E0BE155F511B781a0');
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
