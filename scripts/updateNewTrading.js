const setTradingStorageParams = require('./setTradingStorageParams');
const gnsAddr = require('../deployments/mumbai/GainsNetworkToken.json').address;
const tradingAddr =
  require('../deployments/mumbai/GNSTradingV6_4_1.json').address;
const callbacksAddr =
  require('../deployments/mumbai/GNSTradingCallbacksV6_4_1_Proxy.json').address;
const oracleAddr =
  require('../deployments/mumbai/GNSOracleRewardsV6_4_1.json').address;
const tradingStorageAddr =
  require('../deployments/mumbai/GFarmTradingStorageV5.json').address;

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    'GainsNetworkToken',
    gnsAddr,
    owner
  );

  console.info('Submitting grantRole trading transaction...');
  const tx = await contract.grantRole(
    '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
    tradingAddr
  );

  console.info('Waiting grantRole to complete...');
  await hre.ethers.provider.waitForTransaction(tx.hash);
  console.info('grantRole completed.');

  console.info('Submitting grantRole callbacks transaction...');
  const callbacksTx = await contract.grantRole(
    '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
    callbacksAddr
  );

  console.info('Waiting grantRole oracle to complete...');
  await hre.ethers.provider.waitForTransaction(callbacksTx.hash);
  console.info('grantRole completed.');

  console.info('Submitting grantRole oracle transaction...');
  const oracleTx = await contract.grantRole(
    '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
    oracleAddr
  );

  console.info('Waiting grantRole to complete...');
  await hre.ethers.provider.waitForTransaction(oracleTx.hash);
  console.info('grantRole completed.');

  const tradingStorage = await hre.ethers.getContractAt(
    'GFarmTradingStorageV5',
    tradingStorageAddr,
    owner
  );

  console.info('Submitting setTrading transaction...');
  const setTradingTx = await tradingStorage.setTrading(tradingAddr);

  console.info('Waiting setTrading to complete...');
  await hre.ethers.provider.waitForTransaction(setTradingTx.hash);
  console.info('setTrading completed.');

  console.info('Submitting addTradingContract transaction...');
  const addTradingContractTx = await tradingStorage.addTradingContract(
    tradingAddr
  );

  console.info('Waiting addTradingContract to complete...');
  await hre.ethers.provider.waitForTransaction(addTradingContractTx.hash);
  console.info('addTradingContract completed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
