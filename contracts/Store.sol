pragma solidity ^0.4.0;

import './Authorizable.sol';

contract Store is Authorizable {
    mapping(string => mapping(string => bytes32)) db;

    function set(string namespace, string key, bytes32 val) public onlyIfHasPermission(namespace) {
        db[namespace][key] = val;
    }

    function get(string namespace, string key) public view onlyIfHasPermission(namespace) returns (bytes32) {
        return db[namespace][key];
    }

}
