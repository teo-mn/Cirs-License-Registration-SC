import {ethers} from "hardhat";

async function main() {
  const LicenseProductRegistration = await ethers.getContractFactory("LicenseProductRegistration");
  const instance = LicenseProductRegistration.attach(process.env.PRODUCT_ADDRESS || '');
  // @ts-ignore
  const data = await instance.register(
      ethers.toUtf8Bytes("Барилгын тусгай зөвшөөрөл **ШИНЭ"),
      process.env.LICENSE_ADDRESS,
      process.env.REQUIREMENT_ADDRESS,
      process.env.KV_ADDRESS
  );
  console.log(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
