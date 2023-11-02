// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

library SharedStructs {
    struct LicenseStructBase {
        bytes licenseID;
        bytes licenseName;
        bytes ownerID;
        bytes ownerName;
        uint startDate;
        uint endDate;
        bytes state;
        bytes additionalDataID;
    }
}
