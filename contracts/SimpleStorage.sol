// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    mapping(string => uint256) public nameToFavNum;

    struct Person {
        uint256 favNum;
        string name;
    }
    Person[] public people;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favNumber) public {
        Person memory newPerson = Person(_favNumber, _name);
        people.push(newPerson);
        nameToFavNum[_name] = _favNumber;
    }
}
