// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

struct LicenseStructBase {
    bytes licenseID;
    bytes licenseName;
    bytes ownerID;
    bytes ownerName;
    uint startDate;
    uint endDate;
    bytes[] requirements;
    bytes state;
    bytes additionalDataID;
}

interface ILicenseRegistration {
    event LicenseRegistered(bytes indexed licenseID, bytes licenseName, bytes indexed ownerID, bytes ownerName, uint startDate, uint expireDate);

    event LicenseRevoked(bytes indexed licenseID, bytes description);

    event LicenseRequirementRegistered(bytes indexed licenseID, bytes indexed requirementID);
    event LicenseRequirementRevoked(bytes indexed licenseID, bytes indexed requirementID);

    function register(bytes memory licenseID, bytes memory licenseName, bytes memory ownerID, bytes memory ownerName, uint startDate, uint expireDate, bytes memory additionalDataID) external returns (bool);
    function revoke(bytes memory licenseID, bytes memory description) external returns (bool);
    function registerRequirement(bytes memory licenseID, bytes memory requirementID) external returns (bool);
    function revokeRequirement(bytes memory licenseID, bytes memory requirementID, bytes memory description) external returns (bool);

    function getLicense(bytes memory licenseID) external returns (LicenseStructBase memory);
}
