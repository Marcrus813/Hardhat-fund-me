// SPDX-License-Identifier: MIT

/*
    This is used during the basics
*/

pragma solidity ^0.8.7; //Strict this ver

//pragma solidity ^0.8.7; //Above until 0.8.min
//pragma solidity >=0.8.7 <0.9.0; //Range

contract SimpleStorage {
    uint256 favoriteNumber; //Default as `internal`

    /*
        Similar to Dictionary;
        Init state: every string is mapped to default value of `uint256`
    */
    mapping(string => uint256) public nameToFavNum;

    struct Person {
        //Auto indexed: 0, 1, 2
        uint256 favNum;
        string name;
    }
    //Person public solo = Person({favNum: 99, name: "V"});

    /*
        In view function, `uint256` stands for index;
        No size given -> Dynamic array, Person[6] -> fixed
    */
    Person[] public people;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    /*
        `view` function:
            Only need to view, don't change anything
        `pure` function:
            Cannot read, may be used for some math calculation
        Orange btn makes txn, blue does not, functions cost gas only when called by a gas calling function(contract)
        `Getter` is a `view` function
    */
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    /*function add(uint a, uint b) public pure returns (uint){
        return (a + b);
    }*/

    /*
        `calldata`:
            variable are temp;
            cannot change;
        `memory`: 
            variable are temp
            can change;
            Only used for array(e.g, `string`), struct, mapping
        `storage`:
            default type, not temp;
            can change;
    */
    function addPerson(string memory _name, uint256 _favNumber) public {
        Person memory newPerson = Person(_favNumber, _name);
        people.push(newPerson);
        nameToFavNum[_name] = _favNumber;
    }
}
