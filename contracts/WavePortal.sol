// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint totalWaves;
    uint private seed;

    event NewWave(address indexed from, uint timestamp, string message);
    
    struct Wave {
        address waver;
        string message; 
        uint timestamp;
    }

    Wave[] waves;

    mapping(address => uint) public lastWavedAt;


    constructor() payable {
        console.log("Constructed");
    }

    function wave(string memory _message) public {
        //require(lastWavedAt[msg.sender] + 1 seconds < block.timestamp, "Wait 15 min");
        //lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s posted and said %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message,block.timestamp));

        uint randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random int: %s", randomNumber);

        seed = randomNumber;

        if(randomNumber < 50){
            console.log("%s is winner!",msg.sender);
            uint prizeAmount = 0.0001 ether;
            require(prizeAmount <=  address(this).balance, "Contract isn't funded :(");
            (bool success,) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to send the money");
        }
//0x5FbDB2315678afecb367f032d93F642f64180aa3
       emit NewWave(msg.sender, block.timestamp, _message);
    }
    
    function getAllWaves() view public returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() view public returns(uint) {
        console.log("We have %d total waves", totalWaves);
        return totalWaves;
    }
}