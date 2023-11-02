// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface INameable {
    function name() external view returns (string memory);
}
