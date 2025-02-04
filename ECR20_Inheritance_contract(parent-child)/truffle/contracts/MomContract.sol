// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "./DaughterContract.sol";
import "./SonContract.sol";

contract MomContract {

  string public name;
  uint public age;

  DaughterContract public daughter;
  SonContract public son;

  constructor(
    string memory _momsName,
    uint _momsAge, 
    string memory _daughtersName,
    uint _daughtersAge, 
    string memory _sonsName,
    uint _sonsAge
  ) 
    
  {

    daughter = new DaughterContract(_daughtersName, _daughtersAge);
    son = new SonContract(_sonsName, _sonsAge, daughter, address(this));
    name = _momsName;
    age = _momsAge;
  }

  function allowDaughterToDate() public {
    daughter.permissionToDate();
  }

  function allowSonToDate() public {
    son.permissionToDate();
  }

  function getAge() public view returns (uint) {
    return age;
  }
}