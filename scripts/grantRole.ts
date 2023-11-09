import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const RequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance1 = LicenseRegistration.attach('0x522Be02bAd15aa95a42A1e79372ef1d1C26857fE');
  const instance2 = RequirementRegistration.attach('0x8d5E6b1555538Ba046BEC03dC716aDd960a6508c');
  const instance3 = KeyValue.attach('0xc3FbbE384009a3Db45AFFDe08eBb6DD278bccde1');

  // @ts-ignore
  console.log(await instance1.name())
  // @ts-ignore
  const data1 = await instance1.grantRole(await instance1.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  console.log(data1);
  // @ts-ignore
  const data2 = await instance2.grantRole(await instance2.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  console.log(data2);
  // @ts-ignore
  const data3 = await instance3.grantRole(await instance3.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4');
  console.log(data3);
  // @ts-ignore
  const res = await instance1.hasRole(await instance1.ISSUER_ROLE(), '0x85F5c799e1edEe7Fc042638D5c00da3a5cC8c7a4')
  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
