// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContract is ERC721, Ownable {                 //1
  using Counters for Counters.Counter;                      //3
  using Strings for uint256;
  Counters.Counter _tokenIds;                               //3
  mapping(uint256 => string) _tokenURIs;                    //5

  struct RenderToken {                                      //8
    uint256 id;
    string uri;
  }

  constructor() ERC721("Smart Contract", "SC") {}            //2

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {   //5
    _tokenURIs[tokenId] = _tokenURI;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {                                                                   //7
    require(_exists(tokenId));
    string memory _tokenURI = _tokenURIs[tokenId];
    return _tokenURI;
  }

  function getAllTokens() public view returns (RenderToken[] memory) {                //9
    uint256 lastestId = _tokenIds.current();
    uint256 counter = 0;
    RenderToken[] memory res = new RenderToken[](lastestId);
    for (uint256 i = 0; i < lastestId; i++) {
      if (_exists(counter)) {
        string memory uri = tokenURI(counter);
        res[counter] = RenderToken(counter, uri);
      }
      counter++;
    }
    return res;
  }

  function mint(address recipient, string memory uri) public returns (uint256) {       //4
    uint256 newId = _tokenIds.current();
    _mint(recipient, newId);
    _setTokenURI(newId, uri);                                                       //6
    _tokenIds.increment();
    return newId;
  }
}