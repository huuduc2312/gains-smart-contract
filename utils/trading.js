// GNSToken::addMinterRole: (add mint GNS role for trading contract)
const hre = require('hardhat');
const { grantGNSMinterRole } = require('./role');

async function addTradingContract(address) {
  const { deployments, getNamedAccounts } = hre;
  const { read, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();

  try {
    await execute(
      'GFarmTradingStorageV5',
      { from: deployer, log: true },
      'addTradingContract',
      address
    );
  } catch (err) {
    console.log(
      `🚀 ~ file: trading.js:19 ~ addTradingContract at contract ${address} ~ error: ${err}`
    );
  }
}

async function afterDeployTradingContract(
  deployments,
  setContract,
  signer,
  contractName,
  address
) {
  const { get } = deployments;

  const tradingStorageAddr = (await get('GFarmTradingStorageV5')).address;
  const tradingStorage = await hre.ethers.getContractAt(
    'GFarmTradingStorageV5',
    tradingStorageAddr,
    signer
  );

  const gnsContract = await hre.ethers.getContractAt(
    'GainsNetworkToken',
    '0x469Cd2AE37BC3d579eE2c4F0B5e31eA212Fa405E',
    signer
  );
  await grantGNSMinterRole(gnsContract, contractName, address);

  if (setContract) await setContract(tradingStorage);

  console.info(`Executing addTradingContract: ${contractName}`);
  const addTradingContractTx = await tradingStorage.addTradingContract(address);
  await hre.ethers.provider.waitForTransaction(addTradingContractTx.hash);
  console.info(`Done addTradingContract: ${contractName}`);
}

module.exports = {
  addTradingContract,
  afterDeployTradingContract,
};
