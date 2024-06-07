// GNSToken::addMinterRole: (add mint GNS role for trading contract)
const hre = require("hardhat");
const { grantGNSMinterRole } = require("./role");

// async function addTradingContract(address) {
//   const { deployments, getNamedAccounts } = hre;
//   const { read, execute, log } = deployments;
//   const { deployer } = await getNamedAccounts();

//   try {
//     await execute(
//       'GFarmTradingStorageV5',
//       { from: deployer, log: true },
//       'addTradingContract',
//       address
//     );
//   } catch (err) {
//     console.log(
//       `🚀 ~ file: trading.js:19 ~ addTradingContract at contract ${address} ~ error: ${err}`
//     );
//   }
// }

async function addTradingContract(deployments, deployer, name, setParam) {
  const { read, execute, get } = deployments;
  const deployedContract = await get(name);
  const address = deployedContract.address;

  await grantGNSMinterRole(deployments, deployer, name, address);

  if (setParam) {
    const { param, method } = setParam;
    if ((await read("GFarmTradingStorageV5", param)) != address) {
      await execute(
        "GFarmTradingStorageV5",
        { from: deployer },
        method,
        address
      );
    }
  }

  if (await read("GFarmTradingStorageV5", "isTradingContract", address)) {
    console.info(`Contract ${name} is tradingContract`);
    return;
  }

  console.info(`Executing addTradingContract: ${name}, address ${address}`);
  await execute(
    "GFarmTradingStorageV5",
    { from: deployer },
    "addTradingContract",
    address
  );
  console.info(`Done addTradingContract: ${name}`);
}

module.exports = {
  addTradingContract,
};
