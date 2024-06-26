const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");

const constructorContracts = ["GFarmTradingStorageV5"];
const configConstructorContracts = ["CurrentOrderID"];

const func = createDeployFunction({
  contractName: "GNSPairsStorageV6",
  dependencyNames: constructorContracts,
  getDeployArgs: async ({ dependencyContracts }) =>
    // {
    //   return configConstructorContracts
    //     .map((dependencyName) => dependencyContracts[dependencyName].value)
    //     .concat(
    //       constructorContracts.map(
    //         (dependencyName) => dependencyContracts[dependencyName].address
    //       )
    //     );
    // },
    [1, dependencyContracts["GFarmTradingStorageV5"].address],
  afterDeploy: async ({
    deployedContract,
    getNamedAccounts,
    deployments,
    network,
  }) => {
    await timeout(1500);
  },
});

module.exports = func;
