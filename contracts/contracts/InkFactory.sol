// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./InkERC20.sol";

contract InkFactory {
    event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 initialSupply, address owner);

    address[] public deployedTokens;

    function createToken(string memory name, string memory symbol, uint256 initialSupply) public returns (address) {
        InkERC20 newToken = new InkERC20(name, symbol, initialSupply, msg.sender);
        deployedTokens.push(address(newToken));
        
        emit TokenCreated(address(newToken), name, symbol, initialSupply, msg.sender);
        
        return address(newToken);
    }

    function getDeployedTokens() public view returns (address[] memory) {
        return deployedTokens;
    }
}
