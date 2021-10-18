// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract Ownable {
    address public owner;
    
    constructor()  {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(isOwner(), "You are not the owner.");
        _;
    }
    
    function isOwner() public view returns(bool) {
        return (msg.sender == owner);
    }
}