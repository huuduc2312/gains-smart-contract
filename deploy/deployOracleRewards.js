const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');
const { afterDeployTradingContract } = require('../utils/trading');

const func = createDeployFunction({
  contractName: 'GNSOracleRewardsV6_4_1',
  dependencyNames: ['GFarmTradingStorageV5'],
  afterDeploy: async ({ deployments, deployedContract, signer }) => {
    return afterDeployTradingContract(
      deployments,
      null,
      signer,
      'GNSOracleRewardsV6_4_1',
      deployedContract.address
    );
  },
});

module.exports = func;
