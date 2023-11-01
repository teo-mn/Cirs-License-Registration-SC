// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./INameable.sol";


interface IKeyValue is INameable {
    event SetData(bytes key, bytes value);
    function setData(bytes memory key, bytes memory value) external returns (bool);
    function getData(bytes memory key) external view returns (bytes  memory);
}
