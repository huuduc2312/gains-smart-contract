const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const [deployer] = await ethers.getSigners();

  // Uniswap V3 Factory, Position Manager and Pool ABI
  const IUniswapV3FactoryABI =
    require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json").abi;
  const INonfungiblePositionManagerABI =
    require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi;

  // Uniswap V3 Factory, Position Manager, and Pool addresses
  const factoryAddress = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"; // Mainnet factory address
  const positionManagerAddress = "0x1238536071E1c677A632429e3655c799b22cDA52"; // Mainnet position manager address

  const factoryContract = new ethers.Contract(
    factoryAddress,
    IUniswapV3FactoryABI,
    deployer
  );
  const positionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    deployer
  );

  // Tokens and pool details
  const token0 = "0x0d9080e677505d29be4da1ddd855c6b523f1d38d";
  const token1 = "0x20f16aad14b69fb7aeab936060bc71de2b202a31";
  const fee = 3000; // Pool fee (3000 = 0.3%)

  // Amounts to add
  const amount0Desired = ethers.utils.parseUnits("0", 18); // 1000 token0
  const amount1Desired = ethers.utils.parseUnits("100", 18); // 1000 token1

  // Get the pool address
  const poolAddress = await factoryContract.getPool(token0, token1, fee);
  if (poolAddress === ethers.constants.AddressZero) {
    console.error("Pool does not exist");
    return;
  }

  console.log("Pool address:", poolAddress);

  // Approve the position manager to spend the tokens
  const token0Contract = new ethers.Contract(
    token0,
    [
      "function balanceOf(address owner) view returns (uint256)",
      "function approve(address spender, uint256 amount) public returns (bool)",
    ],
    deployer
  );
  const token1Contract = new ethers.Contract(
    token1,
    [
      "function balanceOf(address owner) view returns (uint256)",
      "function approve(address spender, uint256 amount) public returns (bool)",
    ],
    deployer
  );

  const balance0 = await token0Contract.balanceOf(deployer.address);
  const balance1 = await token1Contract.balanceOf(deployer.address);

  if (balance0.lt(amount0Desired)) {
    console.error(`Insufficient balance of token0: ${balance0.toString()}`);
    return;
  }
  if (balance1.lt(amount1Desired)) {
    console.error(`Insufficient balance of token1: ${balance1.toString()}`);
    return;
  }

  console.log("Check balance ok");

  // const maxUint256 = ethers.constants.MaxUint256;
  // const tx1 = await token0Contract.approve(positionManagerAddress, maxUint256);
  // await tx1.wait();
  // const tx2 = await token1Contract.approve(positionManagerAddress, maxUint256);
  // await tx2.wait();

  // console.log("approve ok");

  // Add liquidity
  const tx = await positionManagerContract.mint({
    token0: token0,
    token1: token1,
    fee: fee,
    tickLower: -887220, // example tickLower, adjust based on your pool
    tickUpper: 887220, // example tickUpper, adjust based on your pool
    amount0Desired: amount0Desired,
    amount1Desired: amount1Desired,
    amount0Min: 0,
    amount1Min: 0,
    recipient: deployer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
  });

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  console.log("Liquidity added");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
