//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol"; 
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC1155Practice is Ownable, ERC1155
{
    uint256 private constant POSEIDON_TRIDENT = 0;
    uint256 private constant THOR_HAMMER = 1;
    uint256 private constant SWORD = 2;
    
    constructor() ERC1155("https://paamaalsmozr.grandmoralis.com/{id}.json")
    {
        _mint(_msgSender(), POSEIDON_TRIDENT, 1, "");
        _mint(_msgSender(), THOR_HAMMER, 1, "");
        _mint(_msgSender(), SWORD, 10, "");
    }
    
    function mint(address account, uint256 id, uint256 amount) public onlyOwner
    {
        _mint(account, id, amount, "");
    }
    
    function burn(address account, uint256 id, uint256 amount) public
    {
        require(_msgSender() == account, "You can only burn your own tokens");
        _burn(account, id, amount);
    }
}