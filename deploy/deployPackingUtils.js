const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const func = createDeployFunction({
  contractName: ['PackingUtils'],
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
