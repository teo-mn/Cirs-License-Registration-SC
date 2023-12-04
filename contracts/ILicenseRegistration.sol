// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./SharedStructs.sol";
import "./INameable.sol";

interface ILicenseRegistration is INameable {
    event LicenseRegistered(bytes licenseID, bytes licenseName, bytes ownerID, bytes ownerName, uint startDate, uint endDate, bytes additionalData);
    event LicenseRevoked(bytes licenseID, bytes additionalData);

    event LicenseRequirementRegistered(bytes licenseID, bytes requirementID, bytes additionalData);
    event LicenseRequirementRevoked(bytes licenseID, bytes requirementID, bytes additionalData);

    function register(bytes memory licenseID, bytes memory licenseName, bytes memory ownerID, bytes memory ownerName, uint startDate, uint endDate, bytes memory additionalData) external returns (bool);
    function revoke(bytes memory licenseID, bytes memory additionalData) external returns (bool);
    function registerRequirement(bytes memory licenseID, bytes memory requirementID, bytes memory additionalData) external returns (bool);
    function revokeRequirement(bytes memory licenseID, bytes memory requirementID, bytes memory additionalData) external returns (bool);

    function getLicense(bytes memory licenseID) external view returns (SharedStructs.LicenseStructBase memory);
    function getLicenseRequirements(bytes memory licenseID) external view returns (bytes[] memory);
}
