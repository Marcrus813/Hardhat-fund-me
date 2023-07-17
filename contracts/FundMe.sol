/*
    Contains code and notes on `payable` keyword, NPM importing, `require` keyword and revert
    Basic for loop
    Sending ETH from contract
    Constructor
    Immutable and constant
    Custom exeption
        Revert
    Receive and fallback

*/

// Get funds from users
// Withdraw funds
// Set minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/*
    This way imports from NPM
*/
//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error NotOwner();

contract FundMe {
    using PriceConverter for uint256;

    // `constant` saves gas -> does not take storage space(i.e `memory`, etc)
    // 1e18 = 1 * 10 ^ 18 == 1000000000000000000, the key is in conversion between eth and wei
    uint256 public constant MIN_USD = 50 * 1e18; 

    address[] public funders;
    mapping (address => uint256) public addressToAmountFunded;

    /*
        Constant
            Value set at declare
        immutable
            Value set at first `set`
    */
    address public immutable i_owner;

    /*
        Basically the same as other lans, called when instance creating
    */
    constructor() {
        i_owner = msg.sender;
    }
    
    function fund() public payable{
        // Able to set min fund amount in USD

        /* Problems
            1. How to send ETH to this contract
                Functions can hold native funds like wallets(has an address)

        */

        /*
            `require`
                As the name suggests, `require(condition, revertAnd"Msg")`
                Revert
                    Undo action before, send *remaining* gas back, e.g.: gas sent for `fund()`, actions above `require` computed but got reverted, gas already spent,
                    the gas sent for further computations will be returned
            `msg`
                Info of funds, `msg.value` -> how many value(eth) is sending
        */

        //require(getConversionRate(msg.value) > MIN_USD, "Failed! not enough"); 
        require(msg.value.getConversionRate() > MIN_USD, "Failed! Not enough paid");//See `PriceConverter.sol` for why this line works not the line above.
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    
    function withdraw() public onlyOwner/*Custom modifier, this function go first, then the `_` in the function*/{
        /*Limit, commented cuz using `Modifiers below`*/
        //require(msg.sender == owner, "Sender is not owner");

        /*
            for(`startIndex(condition)`, `endIndex(condition)`, `step`)

        */
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) 
        {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        //Another way to reset
        funders = new address[](0);  //0: length

        /*
            Transfering funds
                Three ways:
                    transfer
                    send
                    call
        */
        /*
            Transfer
                msg.sender Type of `address`, cast to payable
                Typical transfer cost 2100 gas, `transfer` is capped at 2300, if more than 2300 used, throws error, then revert
            Send
                Typical transfer cost 2100 gas, `transfer` is capped at 2300, if more than 2300 used, return false
                Still need `require` to revert
            call
                Lower level command
                Recommended
                
        */
        payable(msg.sender).transfer(address(this).balance);
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner {
        //require(msg.sender == i_owner, NotOwner());
        require(msg.sender == i_owner, "Sender is not owner"); //Every letter takes space -> not gas efficient
        if(msg.sender != i_owner){
            revert NotOwner();
        }
        
        _;/*Do the rest of the code(from function modified)*/
    }

    /*
        Sending ETH without calling `fund`?
            `receive`
            `fallback`
        Whenever no data associated with txn(e.g: send eth directly through contract address, even when value = 0), `receive` will be triggered
        In 'Low level interactions', 'CALLDATA' can be used to call functions, no data means txn to the contract -> `receive` triggered, if has data(data sent with txn), look for functions, no function match found -> `fallback`
        msg.data is empty?
            no -> fallback()
            yes -> there's receive()?
                    yes -> receive()
                    no -> fallback()
    */

    /*
        No `function` keyword for `receive` and `fallback`
    */
    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
}
