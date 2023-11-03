// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./ILicenseRegistration.sol";
import "./SharedStructs.sol";


contract LicenseRegistration is ILicenseRegistration, AccessControl, Pausable {
    string private _name;
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    mapping(bytes => SharedStructs.LicenseStructBase) data;
    mapping(bytes => bytes[]) requirements;
    mapping(bytes => mapping(bytes => uint)) reqIndexMap;

    constructor(address admin, string memory name) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _name = name;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function register(bytes memory licenseID, bytes memory licenseName, bytes memory ownerID, bytes memory ownerName, uint startDate, uint endDate, bytes memory additionalDataID)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        // TODO validate
        SharedStructs.LicenseStructBase memory license = data[licenseID];
        license.licenseID = licenseID;
        license.licenseName = licenseName;
        license.ownerID = ownerID;
        license.ownerName = ownerName;
        license.startDate = startDate;
        license.endDate = endDate;
        license.additionalDataID = additionalDataID;
        license.state = bytes("REGISTERED");
        data[licenseID] = license;

        emit LicenseRegistered(licenseID, licenseName, ownerID, ownerName, startDate, endDate);
        return true;
    }

    function revoke(bytes memory licenseID, bytes memory description)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        // TODO validate
        SharedStructs.LicenseStructBase memory license = data[licenseID];
        license.state = bytes("REVOKED");
        data[licenseID] = license;
        emit LicenseRevoked(licenseID, description);
        return true;
    }

    function registerRequirement(bytes memory licenseID, bytes memory requirementID)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        requirements[licenseID].push(requirementID);
        reqIndexMap[licenseID][requirementID] = requirements[licenseID].length;
        emit LicenseRequirementRegistered(licenseID, requirementID);
        return true;
    }

    function revokeRequirement(bytes memory licenseID, bytes memory requirementID, bytes memory description)
    whenNotPaused onlyRole(ISSUER_ROLE) external returns (bool) {
        uint index = reqIndexMap[licenseID][requirementID];
        if (index > 0) {
            require(keccak256(requirements[licenseID][index - 1]) == keccak256(requirementID));
            requirements[licenseID][index - 1] = bytes('');
            reqIndexMap[licenseID][requirementID] = 0;
            emit LicenseRequirementRevoked(licenseID, requirementID, description);
            return true;
        }
        return false;
    }

    function getLicense(bytes memory licenseID)
    external view returns (SharedStructs.LicenseStructBase memory) {
        return data[licenseID];
    }

    function getLicenseRequirements(bytes memory licenseID)
    external view returns (bytes[] memory) {
        return requirements[licenseID];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

}
