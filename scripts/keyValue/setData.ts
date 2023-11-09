import { ethers } from "hardhat";

async function main() {
  const KeyValue = await ethers.getContractFactory("KeyValue");
  const instance = KeyValue.attach('0x8806d258F92f17A0117dF14493153e74ebD15588');
  // @ts-ignore
  const res = await instance.setData(ethers.toUtf8Bytes("key"), ethers.toUtf8Bytes("value"));
  console.log(await res.wait());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
