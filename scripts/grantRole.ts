import {ethers} from "hardhat";

async function main() {
  const LicenseRegistration = await ethers.getContractFactory("LicenseRegistration");
  const RequirementRegistration = await ethers.getContractFactory("LicenseRequirementRegistration");
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance1 = LicenseRegistration.attach('0x6c4d4A9CCf42Adb52336872c8AD719dCA557763D');
  const instance2 = RequirementRegistration.attach('0xff68A90c6A3D7F9FCdBEAe043167fBB4171d5e64');
  const instance3 = KeyValue.attach('0xA76D11E077FE691Cf9e27639c1AFf96a15B3D9EE');

  // @ts-ignore
  console.log(await instance1.name())
  // @ts-ignore
  const data = await instance1.grantRole(await instance1.ISSUER_ROLE(), '0xff68A90c6A3D7F9FCdBEAe043167fBB4171d5e64');
  console.log(data);
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
