/*
    Contains code and notes for 
        `Library`, API calling, 
        type casting, 
        float and math in Solidity, 
        using library
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
    This way imports from NPM
*/
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    /*
        All functions in a library must be internal
    */
    function getPrice() internal view returns (uint256) {
        // Need ABI and address of the contract being called
        // Address 0x694AA1769357215DE4FAC081bf1f309aDC325306
        // ABI
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        /*
            Full return
                Get all the results the API provides, comment out to ignore certain values, need to keep ',' to specify what is ignored
                Variable names can be customized, value is determined by order
        */
        (, /*uint80 roundId*/ int256 price, , , ) = /*uint256 startedAt*/ /*uint256 updatedAt*/ /*uint80 answeredInRound*/
        priceFeed.latestRoundData();

        /*
            Type casting
        */
        return uint256(price * 1e10); //1^10
    }

    /*
        In library, first variable that gets passed to the function, needs to be the object called on itself, see `FundMe.sol` for example
        Only the first needs to be the object, for example: `function getConversionRate(uint256 ethAmount, bool test)`, when called, it goes: `msg.value.getConversionRate(true)`
    */
    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        uint256 price = getPrice(); //3000_00000000000000000 = ETH / USD, 1_000000000000000000 ETH
        uint256 ethAmountInUsd = (price * ethAmount) / 1e18; // Both price and ethAmout have a 'e18', thus need to divide
        return ethAmountInUsd;
    }
}
