import { ethers } from "hardhat";

async function main() {
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance = KeyValue.attach('0xc3FbbE384009a3Db45AFFDe08eBb6DD278bccde1');
  // @ts-ignore
  const data = await instance.getData(ethers.toUtf8Bytes("key"));
  console.log(ethers.toUtf8String(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
