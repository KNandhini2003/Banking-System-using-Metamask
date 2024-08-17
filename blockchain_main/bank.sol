// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

contract banktry {
    struct User {
        string name;
        int balance;
        bool exists;
    }
    
    mapping (address => User) public users;

    function createAccount(string memory _name) public {
        require(!users[msg.sender].exists, "Account already exists");
        users[msg.sender] = User(_name, 0, true);
    }

    function getBalance() public view returns(int) {
        return users[msg.sender].balance;
    }

    function withdraw(int _amt) public {
        require(_amt <= users[msg.sender].balance, "Insufficient balance");
        users[msg.sender].balance -= _amt;
    }

    function deposit(int _amt) public {
        users[msg.sender].balance += _amt;
    }
}
