import {licenseRegistration} from "../utils";


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
licenseRegistration().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
