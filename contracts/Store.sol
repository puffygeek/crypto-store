pragma solidity ^0.4.0;

import './Ownable.sol';

contract Store is Ownable {
    mapping(string => mapping(string => bytes32)) db;
    mapping(string => address) permissions;

    modifier onlyBy(string namespace) {
        require(msg.sender == owner || permissions[namespace] == msg.sender );
        _;
    }

    function set(string namespace, string key, bytes32 val) public onlyBy(namespace) {
        db[namespace][key] = val;
    }

    function get(string namespace, string key) public view onlyBy(namespace) returns (bytes32) {
        return db[namespace][key];
    }

    function setPermission(string namespace, address adrs) public onlyOwner {
        permissions[namespace] = adrs;
    }
}
