pragma solidity ^0.4.0;

import './Permission.sol';

contract Store is Permission {
    mapping(string => mapping(string => bytes32)) db;

    function set(string namespace, string key, bytes32 val) public onlyBy(namespace) {
        db[namespace][key] = val;
    }

    function get(string namespace, string key) public view onlyBy(namespace) returns (bytes32) {
        return db[namespace][key];
    }

}
