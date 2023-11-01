import { ethers } from "hardhat";

async function main() {
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance = KeyValue.attach('0x13C75Dac152781F22A23d2B8E40fCA81035bD658');
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
