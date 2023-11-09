// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "./SharedStructs.sol";

interface ILicenseRequirementRegistration {
    event LicenseRequirementRegistered(bytes licenseID, bytes requirementID, bytes requirementName);
    event LicenseRequirementRevoked(bytes licenseID, bytes requirementID, bytes additionalData);
    event EvidenceRegistered(bytes licenseID, bytes requirementID, bytes evidenceID, bytes additionalData);
    event EvidenceRevoked(bytes licenseID, bytes requirementID, bytes evidenceID, bytes additionalData);

    function register(bytes memory licenseID, bytes memory requirementID, bytes memory requirementName, bytes memory additionalData) external returns (bool);

    function revoke(bytes memory licenseID, bytes memory requirementID, bytes memory additionalData) external returns (bool);

    function registerEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID, bytes memory additionalData) external returns (bool);

    function revokeEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID, bytes memory additionalData) external returns (bool);
    function getRequirement(bytes memory licenseID, bytes memory requirementID) external view returns (SharedStructs.RequirementStructBase memory);
    function getEvidences(bytes memory licenseID, bytes memory requirementID) external view returns (bytes[] memory);
}
