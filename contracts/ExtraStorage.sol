// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/*
    This is for override and inheritance
*/

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {
    /*
        Overriding:
            `override`
            `virtual override`
            Need to add `virtual` to parent function
    */
    function store(uint256 _favNum) public override {
        favoriteNumber = _favNum + 5;
    }
}
