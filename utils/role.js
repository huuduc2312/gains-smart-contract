// GNSToken::addMinterRole: (add mint GNS role for trading contract)
const hre = require('hardhat');

async function addMinterRole(address, tradingContractAddress) {
  const { deployments, getNamedAccounts } = hre;
  const { read, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();

  try {
    await execute(
      'GainsNetworkToken',
      { from: deployer, log: true },
      'addMinterRole',
      address,
      tradingContractAddress
    );
  } catch (err) {
    console.log(
      `🚀 ~ file: role.js:19 ~ addMinterRole at contract ${address} ~ error: ${err}`
    );
  }
}

async function grantGNSMinterRole(gnsContract, contractName, address) {
  console.info(`grantRole MINTER_ROLE to ${contractName}...`);
  const tx = await gnsContract.grantRole(
    // @TODO: get MINTER_ROLE value from .env
    '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
    address
  );
  await hre.ethers.provider.waitForTransaction(tx.hash);
  console.info(`grantRole MINTER_ROLE to ${contractName} done`);
}

module.exports = {
  addMinterRole,
  grantGNSMinterRole,
};
