// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./base64.sol";

contract PrettyAwesomeWords is ERC721Enumerable, Ownable {
  using Strings for uint256;
  
  string[] public wordsValues = ["accomplish","accepted","absolutely","admire","achievement","active","adorable","affirmative","appealing","approve","amazing","awesome","beautiful","believe","beneficial","bliss","brave","brilliant","calm","celebrated","champion","charming","congratulation","cool","courageous","creative","dazzling","delightful","divine","effortless","electrifying","elegant","enchanting","energetic","enthusiastic","excellent","exciting","exquisite","fabulous","fantastic","fine","fortunate","friendly","fun","funny","generous","giving","great","happy","harmonious","healthy","heavenly","honest","honorable","impressive","independent","innovative","intelligent","intuitive","kind","knowledgeable","legendary","lucky","lovely","marvelous","motivating","nice","perfect","phenomenal","popular","positive","productive","refreshing","remarkable","skillful","sparkling","stunning","successful","supporting","terrific","tranquil","trusting","vibrant","wholesome","worthy","wonderful"];
  
   struct Word { 
      string name;
      string description;
      string seed;
      string feq;
      string value;
   }
  
  mapping (uint256 => Word) public words;
  
  constructor() ERC721("Pretty Awesome Words", "PWA") {}

  // public
  function mint() public payable {
    uint256 supply = totalSupply();
    require(supply + 1 <= 1000);
    
    Word memory newWord = Word(
        string(abi.encodePacked('EMBRYO #', uint256(supply + 1).toString())), 
        "These NFTs are there to inspire and uplift your spirit.",
         seed().toString(),
         feq().toString(),
        wordsValues[randomNum(wordsValues.length, block.difficulty, supply)]);
    
    if (msg.sender != owner()) {
      require(msg.value >= 0.005 ether);
    }
    
    words[supply + 1] = newWord;
    _safeMint(msg.sender, supply + 1);
  }

  function randomNum(uint256 _mod, uint256 _seed, uint _salt) public view returns(uint256) {
      uint256 num = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, _seed, _salt))) % _mod;
      return num;
  }


  function seed() public view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    return randomHash % 10000;
} 
 function feq() public view returns (uint) {
    uint randomHash = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
    return randomHash % 10;
} 
  
  function buildImage(uint256 _tokenId) public view returns(string memory) {
      Word memory currentWord = words[_tokenId];
      return Base64.encode(bytes(
          abi.encodePacked(
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" style="background: radial-gradient(circle, hsla(61, 91%, 87%, 1) 0%, hsla(31,98%, 76%, 1) 12.5%, hsla(15, 95%, 68%, 1) 25%, hsla(353, 75%, 61%, 1) 37.5%,hsla(329, 54%, 46%, 1) 50%, hsla(301, 56%, 33%, 1) 62.5%, hsla(275, 74%, 28%,1) 75%, hsla(253, 63%, 17%, 1) 87.5%, hsla(240, 100%, 1%, 1) 100%)">',
              '<filter id="a">',
              '<feTurbulence baseFrequency="0.00',currentWord.feq,'"   seed="',currentWord.seed,'"/>',
              '</filter>',
              '<rect width="100%" height="100%" filter="url(#a)"/>',
              '</svg>'
          )
      ));
  }
  
  function buildMetadata(uint256 _tokenId) public view returns(string memory) {
      Word memory currentWord = words[_tokenId];
      return string(abi.encodePacked(
              'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                          '{"name":"', 
                          currentWord.name,
                          '", "description":"', 
                          currentWord.description,
                          '", "image": "', 
                          'data:image/svg+xml;base64,', 
                          buildImage(_tokenId),
                          '"}')))));
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
      require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
      return buildMetadata(_tokenId);
  }

  function withdraw() public payable onlyOwner {
    // This will pay HashLips 5% of the initial sale.
    // You can remove this if you want, or keep it in to support HashLips and his channel.
    // =============================================================================
    (bool hs, ) = payable(msg.sender).call{value: address(this).balance * 5 / 100}("");
    require(hs);
    // =============================================================================
    
    // This will payout the owner 95% of the contract balance.
    // Do not remove this otherwise you will not be able to withdraw the funds.
    // =============================================================================
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
    // =============================================================================
  }
}