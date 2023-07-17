// SPDX-License-Identifier: MIT

/*
    This is for `import`, address, ABI, calling functions
*/

pragma solidity ^0.8.7;

import "./SimpleStorage.sol"; //Relative dir

contract StorageFactory {
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    /*
        Always need:
            `Address of the contract`
            `ABI`:
                Appication Binary Interface;
    */
    function sfStore(
        uint256 _simpleStorageIndex,
        uint256 _simpleStorageNumber
    ) public {
        /*
            //If `simpleStorageArray` is of address
            SimpleStorage simpleStorage = SimpleStorage(simpleStorageArray[_simpleStorageIndex]);
        */
        //If `simpleStorageArray` is of object
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfStore(
        uint256 _simpleStorageIndex
    ) public view returns (uint256) {
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}
