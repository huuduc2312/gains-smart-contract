// GNSToken::addMinterRole: (add mint GNS role for trading contract)
const hre = require("hardhat");
const config = require("../config.json");

async function addMinterRole(address, tradingContractAddress) {
  const { deployments, getNamedAccounts } = hre;
  const { read, execute, log } = deployments;
  const { deployer } = await getNamedAccounts();

  try {
    await execute(
      "GainsNetworkToken",
      { from: deployer, log: true },
      "addMinterRole",
      address,
      tradingContractAddress
    );
  } catch (err) {
    console.log(
      `🚀 ~ file: role.js:19 ~ addMinterRole at contract ${address} ~ error: ${err}`
    );
  }
}

async function grantGNSMinterRole(deployments, deployer, name, address) {
  const { read, execute } = deployments;
  const [signer] = await hre.ethers.getSigners();

  const networkName = hre.network.name;
  const networkConfig = config[networkName];

  if (!networkConfig) {
    throw new Error(`Network configuration not found for: ${networkName}`);
  }

  const { gns } = networkConfig;

  const gnsContract = new hre.ethers.Contract(
    gns,
    [
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32",
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address",
          },
        ],
        "name": "hasRole",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "role",
            "type": "bytes32",
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address",
          },
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      },
    ],
    signer
  );

  const hasRole = await gnsContract.hasRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    address
  );
  if (hasRole) {
    console.info(`Contract has MINTER_ROLE: ${name}, address ${address}`);
    return;
  }

  console.info(`Executing grantRole MINTER_ROLE to ${name}...`);
  const tx = await gnsContract.grantRole(
    "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
    address
  );
  await tx.wait();
  console.info(`Done grantRole MINTER_ROLE to ${name}. Tx: ${tx.hash}`);
}

module.exports = {
  addMinterRole,
  grantGNSMinterRole,
};
