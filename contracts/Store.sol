pragma solidity ^0.4.0;

import './Authorizable.sol';

contract Store is Authorizable {
    mapping(string => mapping(string => string)) db;

    function set(string namespace, string key, string val) public onlyIfHasPermission(namespace) {
        db[namespace][key] = val;
    }

    function get(string namespace, string key) public view onlyIfHasPermission(namespace) returns (string) {
        return db[namespace][key];
    }

}
