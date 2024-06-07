const { ethers, network } = require("hardhat");
const BN = require("bn.js");
const { BigNumber } = require("@ethersproject/bignumber");
const config = require("../config.json");
const BigNumberJs = require("bignumber.js");

const {
  abi: IUniswapV3FactoryABI,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

function encodePriceSqrt(price) {
  // Convert the float price to a BigNumber with 18 decimals
  const priceBN = ethers.utils.parseUnits(price.toString(), 18);

  // Convert the BigNumber to a BigNumber.js instance
  const priceBigNumberJs = new BigNumberJs(priceBN.toString());

  // Calculate the square root of the price and multiply by 2^96
  const sqrtPriceX96 = priceBigNumberJs
    .times(new BigNumberJs(2).pow(96))
    .sqrt();

  // Convert back to ethers BigNumber
  return ethers.BigNumber.from(sqrtPriceX96.toFixed(0));
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Get the current network name
  const networkName = network.name;
  const networkConfig = config[networkName];

  if (!networkConfig) {
    throw new Error(`Network configuration not found for: ${networkName}`);
  }

  const { uniswapV3Factory, uniswapV3Router, gns, dai } = networkConfig;

  const factory = new ethers.Contract(
    uniswapV3Factory,
    IUniswapV3FactoryABI,
    deployer
  );
  const positionManager = new ethers.Contract(
    uniswapV3Router,
    INonfungiblePositionManagerABI,
    deployer
  );

  const fee = 3000; // 0.3%
  let poolAddress;

  // Check if the pool already exists
  try {
    poolAddress = await factory.getPool(gns, dai, fee);
    if (poolAddress === ethers.constants.AddressZero) {
      // Pool does not exist, create a new one
      const tx = await factory.createPool(gns, dai, fee);
      console.log(`Creating new pool. Tx hash: ${tx.hash}`);
      await tx.wait();
      poolAddress = await factory.getPool(gns, dai, fee);
      console.log(`New pool created at address: ${poolAddress}`);
    } else {
      console.log(`Using existing pool at address: ${poolAddress}`);
    }
  } catch (error) {
    console.error("Error checking or creating pool:", error);
    return;
  }

  const pool = new ethers.Contract(poolAddress, IUniswapV3PoolABI, deployer);

  // Initialize the pool (provide initial price) if it hasn't been initialized yet
  try {
    const slot0 = await pool.slot0();
    if (slot0.sqrtPriceX96.toString() === "0") {
      const initialPrice = 0.5; // GNS/DAI price of 0.5 DAI per GNS
      const sqrtPriceX96 = encodePriceSqrt(initialPrice);
      const tx = await pool.initialize(sqrtPriceX96);
      console.log(`Pool initialized with price: ${price}. Tx hash: ${tx.hash}`);
      await tx.wait();
    } else {
      console.log("Pool already initialized");
    }
  } catch (error) {
    console.error("Error initializing pool: ", error);
    return;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
