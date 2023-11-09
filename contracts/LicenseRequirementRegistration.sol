// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./ILicenseRequirementRegistration.sol";
import "./LicenseRegistration.sol";
import "./SharedStructs.sol";

contract LicenseRequirementRegistration is ILicenseRequirementRegistration, AccessControl, Pausable {
    string private _name;
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    address public _licenseAddress;

    LicenseRegistration private license;
    mapping(bytes => mapping(bytes => bytes[])) evidences;
    mapping(bytes => mapping(bytes => mapping(bytes => uint))) evidenceIndexMap;

    mapping(bytes => mapping(bytes => SharedStructs.RequirementStructBase)) data;

    constructor(address admin, string memory name, address licenseAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _name = name;
        _licenseAddress = licenseAddress;
        license = LicenseRegistration(licenseAddress);
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function register(bytes memory licenseID, bytes memory requirementID, bytes memory requirementName, bytes memory additionalData)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        license.registerRequirement(licenseID, requirementID);
        SharedStructs.RequirementStructBase memory req = data[licenseID][requirementID];
        req.requirementID = requirementID;
        req.requirementName = requirementName;
        req.additionalData = additionalData;
        req.state = bytes("REGISTERED");
        data[licenseID][requirementID] = req;
        emit LicenseRequirementRegistered(licenseID, requirementID, requirementName);
        return true;
    }

    function revoke(bytes memory licenseID, bytes memory requirementID, bytes memory additionalData)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        license.revokeRequirement(licenseID, requirementID, additionalData);
        SharedStructs.RequirementStructBase memory req = data[licenseID][requirementID];
        req.state = bytes("REVOKED");
        data[licenseID][requirementID] = req;
        emit LicenseRequirementRevoked(licenseID, requirementID, additionalData);
        return true;
    }

    function registerEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID, bytes memory additionalData)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        evidences[licenseID][requirementID].push(evidenceID);
        evidenceIndexMap[licenseID][requirementID][evidenceID] = evidences[licenseID][requirementID].length;
        emit EvidenceRegistered(licenseID, requirementID, evidenceID, additionalData);
        return true;
    }

    function revokeEvidence(bytes memory licenseID, bytes memory requirementID, bytes memory evidenceID, bytes memory additionalData)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        uint index = evidenceIndexMap[licenseID][requirementID][evidenceID];
        if (index > 0) {
            require(keccak256(evidences[licenseID][requirementID][index - 1]) == keccak256(evidenceID));
            evidences[licenseID][requirementID][index - 1] = bytes('');
            evidenceIndexMap[licenseID][requirementID][evidenceID] = 0;
            emit EvidenceRevoked(licenseID, requirementID, evidenceID, additionalData);
            return true;
        }
        return false;
    }


    function getRequirement(bytes memory licenseID, bytes memory requirementID)
    external view returns (SharedStructs.RequirementStructBase memory) {
        return data[licenseID][requirementID];
    }

    function getEvidences(bytes memory licenseID, bytes memory requirementID)
    external view returns (bytes[] memory) {
        return evidences[licenseID][requirementID];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

}
