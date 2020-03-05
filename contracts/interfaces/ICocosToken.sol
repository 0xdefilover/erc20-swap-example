// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICocosToken is IERC20 {
    function addWhiteAccount(address whiteAccount) external;
}