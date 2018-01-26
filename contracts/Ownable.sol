pragma solidity ^0.4.0;

contract Ownable {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Ownable() public {
        owner = msg.sender;
    }

    function setOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
