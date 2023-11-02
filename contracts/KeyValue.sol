// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./IKeyValue.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract KeyValue is IKeyValue, AccessControl, Pausable {

    string private _name;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    mapping(bytes => bytes) private data;

    constructor(address admin, string memory name) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ISSUER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _name = name;
    }


    function name() external view returns (string memory) {
        return _name;
    }

    function setData(bytes memory key, bytes memory value) whenNotPaused external onlyRole(ISSUER_ROLE) returns (bool) {
        data[key] = value;
        emit SetData(key, value);
        return true;
    }

    function getData(bytes memory key) external view returns (bytes memory) {
        return data[key];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}
