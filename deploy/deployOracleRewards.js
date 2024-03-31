const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');
const {
  afterDeployTradingContract,
  setTradingStorageParam,
  addTradingContract,
} = require('../utils/trading');

const func = createDeployFunction({
  contractName: 'GNSOracleRewardsV6_4_1',
  dependencyNames: ['GFarmTradingStorageV5', 'GNSPriceAggregatorV6_4'],
  getProxyConfig: ({ dependencyContracts }) => ({
    execute: {
      init: {
        methodName: 'initialize',
        args: [dependencyContracts['GFarmTradingStorageV5'].address, 4, 1],
      },
    },
    proxyContract: 'OpenZeppelinTransparentProxy',
  }),
  afterDeploy: async ({ deployments, deployedContract, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();
    return addTradingContract(
      deployments,
      deployer,
      'GNSOracleRewardsV6_4_1',
      deployedContract.address
    );
  },
});

module.exports = func;
