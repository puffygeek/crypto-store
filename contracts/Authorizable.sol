pragma solidity ^0.4.0;

import './Ownable.sol';

contract Authorizable is Ownable {
    mapping(string => address) permissions;

    modifier onlyIfHasPermission(string namespace) {
        require(msg.sender == owner || permissions[namespace] == msg.sender );
        _;
    }

    function setPermission(string namespace, address adrs) public onlyOwner {
        permissions[namespace] = adrs;
    }
}
