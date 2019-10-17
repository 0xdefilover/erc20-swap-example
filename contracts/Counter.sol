//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface UniswapV2Factory {
    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);
}

interface UniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );
}

interface ICocosToken is IERC20 {
    function addWhiteAccount(address whiteAccount) external;
}

contract Counter {
    uint256 count = 0;
    address private factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    event CountedTo(uint256 number);

    function getCount() public view returns (uint256) {
        return count;
    }

    function countUp() public returns (uint256) {
        console.log("countUp: count =", count);
        uint256 newCount = count + 1;
        require(newCount > count, "Uint256 overflow");
        count = newCount;
        emit CountedTo(count);
        return count;
    }

    function countDown() public returns (uint256) {
        console.log("countDown: count =", count);
        uint256 newCount = count - 1;
        require(newCount < count, "Uint256 underflow");
        count = newCount;
        emit CountedTo(count);
        return count;
    }

    function getUniswapV2PairAddress(address token0, address token1)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        address pair = UniswapV2Factory(factory).getPair(token0, token1);
        console.log(pair);
        (uint256 reserve0, uint256 reserve1, uint256 timest) = UniswapV2Pair(
            pair
        ).getReserves();
        console.log(reserve0, reserve1, timest);
        return (reserve0, reserve1, timest);
    }

    function getTokenReserves(address token0, address token1)
        public
        view
        returns (address)
    {
        address pair = UniswapV2Factory(factory).getPair(token0, token1);
        console.log(pair);
        return pair;
    }
}
