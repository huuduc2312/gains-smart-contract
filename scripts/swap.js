const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Removing liquidity with the account:", deployer.address);

  // Set up your Uniswap V3 Nonfungible Position Manager contract and other necessary contracts
  const positionManagerAddress = "0x1238536071E1c677A632429e3655c799b22cDA52"; // Replace with the actual address of the Nonfungible Position Manager contract
  const positionManagerABI = [
    "function collect(address recipient, int24 tickLower, int24 tickUpper, uint128 amount0Requested, uint128 amount1Requested) external",
  ];

  const positionManagerContract = new ethers.Contract(
    positionManagerAddress,
    positionManagerABI,
    deployer
  );

  // Replace with the details of your liquidity position (tickLower, tickUpper, liquidity)
  const tickLower = -887220;
  const tickUpper = 887220;
  // Set up your Uniswap V3 pool contract and other necessary contracts
  const uniswapV3PoolAddress = "0xeA4eFC71C1b73A643d6f710477efD9c59f9EeDE9"; // Replace with the actual address of the Uniswap V3 pool
  const uniswapV3PoolABI = [
    "function slot0() view returns (int24 tick, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
  ];

  const uniswapV3PoolContract = new ethers.Contract(
    uniswapV3PoolAddress,
    uniswapV3PoolABI,
    ethers.provider
  );

  // Retrieve slot0 data from the Uniswap V3 pool contract
  const slot0 = await uniswapV3PoolContract.slot0();

  // Extract liquidity from slot0
  const liquidity = slot0.liquidity.toString(); // Liquidity in the pool

  // Call the burn function of the position manager contract to withdraw liquidity from the pool
  const burnTx = await positionManagerContract.burn(
    tickLower,
    tickUpper,
    liquidity
  );

  // Wait for the transaction to be mined
  await burnTx.wait();

  console.log("Liquidity removed from the pool.");

  // Call the collect function of the position manager contract to collect any fees accrued by your liquidity position
  const collectTx = await positionManagerContract.collect(
    deployer.address,
    tickLower,
    tickUpper,
    0,
    0
  );

  // Wait for the transaction to be mined
  await collectTx.wait();

  console.log("Fees collected.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
