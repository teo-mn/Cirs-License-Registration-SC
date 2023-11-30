import { ethers } from "hardhat";
import {productRegistration} from "./productRegistration/deploy";
import {keyValue} from "./keyValue/deploy";
import {requirementRegistration} from "./requirementRegistration/deploy";
import {licenseRegistration} from "./licenseRegistration/deploy";

async function main() {
  const pr = await productRegistration();
  const kv = await keyValue();
  const lr = await licenseRegistration();
  const rr = await requirementRegistration((lr.target as string) || process.env.LICENSE_ADDRESS);
  console.log(pr.target)
  console.log(kv.target)
  console.log(rr.target)
  console.log(lr.target)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
