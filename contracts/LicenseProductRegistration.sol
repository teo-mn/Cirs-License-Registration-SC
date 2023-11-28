// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./IKeyValue.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract LicenseProductRegistration is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
    }

    event Register(bytes name, address license_address, address requirement_address, address kv_address);
    event Revoke(bytes name, address license_address, address requirement_address, address kv_address);

    function register(bytes memory name, address license_address, address requirement_address, address kv_address) external onlyRole(ISSUER_ROLE) returns (bool) {
        emit Register(name, license_address, requirement_address, kv_address);
        return true;
    }

    function revoke(bytes memory name, address license_address, address requirement_address, address kv_address) external onlyRole(ISSUER_ROLE) returns (bool) {
        // TODO: validation?
        emit Revoke(name, license_address, requirement_address, kv_address);
        return true;
    }
}
