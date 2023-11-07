import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const RequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance1 = LicenseRegistration.attach('0x1cd8F973172460B1BFdBf76eb5430Dc00a4866E4');
  const instance2 = RequirementRegistration.attach('0x7b5f6eEf1205aC0a578CF6442B79bD8937AAabfd');
  const instance3 = KeyValue.attach('0x13C75Dac152781F22A23d2B8E40fCA81035bD658');
  // @ts-ignore
  // const data1 = await instance1.grantRole(await instance1.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  // console.log(data1);
  // // @ts-ignore
  // const data2 = await instance2.grantRole(await instance2.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  // console.log(data2);
  // // @ts-ignore
  // const data3 = await instance3.grantRole(await instance3.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  // console.log(data3);
  const res = await instance1.hasRole(await instance1.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4')
  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
