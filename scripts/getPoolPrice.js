const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Fetching price with the account:", deployer.address);

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  // Uniswap V3 Pool ABI
  const IUniswapV3PoolABI =
    require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json").abi;

  // Uniswap V3 Pool address
  const poolAddress = "0xeA4eFC71C1b73A643d6f710477efD9c59f9EeDE9"; // Replace with actual pool address
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    deployer
  );

  // Fetch the slot0 data from the pool which contains the current tick and other information
  const slot0 = await poolContract.slot0();

  // Get the current tick from the slot0 data
  const currentTick = slot0.tick;

  // Formula to convert tick to price: price = 1.0001 ^ tick
  const price = Math.pow(1.0001, currentTick);

  console.log(`Current tick: ${currentTick}`);
  console.log(`Price of token0 in terms of token1: ${price}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
