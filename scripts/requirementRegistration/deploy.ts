import {requirementRegistration} from "../utils";



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
requirementRegistration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
