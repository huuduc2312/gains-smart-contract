const { ethers, network } = require("hardhat");
const BigNumberJs = require("bignumber.js");
const config = require("../config.json"); // Adjust the path as needed

const {
  abi: IUniswapV3FactoryABI,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

// Helper function to decode sqrtPriceX96 to a human-readable number
function decodePriceSqrt(sqrtPriceX96) {
  const sqrtPriceBigNumberJs = new BigNumberJs(sqrtPriceX96.toString());
  const priceBigNumberJs = sqrtPriceBigNumberJs
    .pow(2)
    .div(new BigNumberJs(2).pow(192));
  return priceBigNumberJs.toFixed(18); // Return the price as a string with 18 decimal places
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Fetching current price with the account: ${deployer.address}`);

  // Get the current network name
  const networkName = network.name;
  const networkConfig = config[networkName];

  if (!networkConfig) {
    throw new Error(`Network configuration not found for: ${networkName}`);
  }

  const { uniswapV3Factory, gns, dai } = networkConfig;

  const factory = new ethers.Contract(
    uniswapV3Factory,
    IUniswapV3FactoryABI,
    deployer
  );

  const fee = 3000; // 0.3%
  let poolAddress;

  // Get the pool address
  try {
    poolAddress = await factory.getPool(gns, dai, fee);
    if (poolAddress === ethers.constants.AddressZero) {
      console.log("Pool does not exist.");
      return;
    } else {
      console.log(`Pool address: ${poolAddress}`);
    }
  } catch (error) {
    console.error("Error getting pool address: ", error);
    return;
  }

  const pool = new ethers.Contract(poolAddress, IUniswapV3PoolABI, deployer);

  // Get the current price from the pool
  try {
    const slot0 = await pool.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const currentPrice = decodePriceSqrt(sqrtPriceX96);
    console.log(
      `Current price of the pool (GNS/DAI): ${currentPrice} DAI per GNS`
    );
  } catch (error) {
    console.error("Error getting current price: ", error);
    return;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
