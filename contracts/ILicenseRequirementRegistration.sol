// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "./SharedStructs.sol";

interface ILicenseRequirementRegistration {
    event LicenseRequirementRegistered(bytes indexed licenseID, bytes indexed requirementID, bytes requirementName);
    event LicenseRequirementRevoked(bytes indexed licenseID, bytes indexed requirementID, bytes description);
    event EvidenceRegistered(bytes indexed licenseID, bytes indexed requirementID, bytes evidenceID);
    event EvidenceRevoked(bytes indexed licenseID, bytes indexed requirementID, bytes evidenceID, bytes description);

    function register(bytes memory licenseID, bytes memory requirementID, bytes memory requirementName, bytes memory additionalDataID) external returns (bool);

    function revoke(bytes memory licenseID, bytes memory requirementID, bytes memory description) external returns (bool);

    function registerEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID) external returns (bool);

    function revokeEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID, bytes memory description) external returns (bool);
    function getRequirement(bytes memory licenseID, bytes memory requirementID) external view returns (SharedStructs.RequirementStructBase memory);
    function getEvidences(bytes memory licenseID, bytes memory requirementID) external view returns (bytes[] memory);
}
