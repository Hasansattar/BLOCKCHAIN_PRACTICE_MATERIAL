// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./Token.sol";

contract crowdSale {

    address public admin;             
    TOKEN public tokenContract;   
    uint256 public tokenPrice;          
    uint256 public tokensSold;
    event Sell(address _buyer,uint256 _amount);  

    constructor(address _tokenContractAddress, uint256 _tokenPrice) {
        //assign an admin
        admin =msg.sender;      
        //Token contract
        tokenContract = TOKEN(_tokenContractAddress);   
        //Token Price\
        tokenPrice = _tokenPrice;    
    }

    

    //Buy Tokens
    function buyTokens() public payable {
          uint256    amount =msg.value / tokenPrice;
            //require that the contract has enough tokens or not
        require(tokenContract.balanceOf(address(this)) >=  amount*10**18 ,'smart contract dont hold enough tokens');
        require(msg.sender != admin,'you are admin you cannot buy your token' );
        
        // transfer the tokens to user
        tokenContract.transfer(msg.sender, amount*10**18 );
        //keep track of tokensSold
          tokensSold +=  amount*10**18 ;
        //triger Sell Event
       emit Sell(msg.sender, amount*10**18 );
 

    }
    
    
        function withDrawBNB() public{
        require(msg.sender == admin,'you are not admin');
        require(address(this).balance > 0,'you have not bnb in contract');
        payable(admin).transfer(address(this).balance);
         

    }
        function balanceOf(address account) public view returns(uint){
             return tokenContract.balanceOf(account);
         }
         
     

   function endSale() public   {
        //Require admin ,check if admin has clicked the function
        require(msg.sender == admin,'you are not admin');
         // require(tokenContract.balanceOf(address(this)) > 0 ,'smart contract dont hold enough tokens');
        //Transfer remaining dapp tokens to admin
         tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
        //  selfdestruct(payable(admin));
        
         
        
    }
    
     function tokenPriceUpdate(uint256 _Price)public  returns(bool){
        require(msg.sender == admin, "you are not authorized to change the token price");
        tokenPrice=_Price;
        return true;
    }
         

           function getContractBalance() public view returns(uint) {
        return address(this).balance;
          }
          
            function getContractHT() public view returns(uint256) {
        return tokenContract.balanceOf(address(this));
          }
    
    
       function getContractAddress() public view returns(address) {
        return address(this);
          }
          
        

     
     receive() external payable{
         
     }
    
}