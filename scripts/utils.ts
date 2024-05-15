import {ethers} from "hardhat";

export async function productRegistration() {
  const instance = await ethers.deployContract("LicenseProductRegistration", [process.env.ADMIN_ADDRESS]);

  await instance.waitForDeployment();

  console.log(`LicenseProductRegistration contract deployed to ${instance.target}`);
  return instance;
}

export async function keyValue() {
  const instance = await ethers.deployContract("KeyValue", [process.env.ADMIN_ADDRESS, 'KV']);

  await instance.waitForDeployment();

  console.log(`KeyValue contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}


export async function licenseRegistration() {
  const instance = await ethers.deployContract("LicenseRegistration", [process.env.ADMIN_ADDRESS, 'License']);

  await instance.waitForDeployment();

  console.log(`LicenseRegistration contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}

export async function requirementRegistration(license_address = process.env.LICENSE_ADDRESS) {
  const instance = await ethers.deployContract("LicenseRequirementRegistration", [process.env.ADMIN_ADDRESS, 'Requirement', license_address]);

  await instance.waitForDeployment();

  console.log(`LicenseRequirementRegistration contract deployed to ${instance.target} , ${await instance.name()}`);
  return instance;
}
