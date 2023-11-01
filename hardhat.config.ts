require("dotenv").config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  // defaultNetwork: 'teo_test',
  networks: {
    teo_test: {
      url: process.env.TEO_TEST_URL || "",
      accounts:
          process.env.TEST_PRIVATE_KEY !== undefined ? [process.env.TEST_PRIVATE_KEY] : [],
    },
    teo: {
      url: process.env.TEO_URL || "",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  }
};

export default config;
