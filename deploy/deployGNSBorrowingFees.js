const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const constructorContracts = ['GFarmTradingStorageV5', 'GNSPairInfosV6_1'];

const func = createDeployFunction({
  contractName: 'GNSBorrowingFeesV6_4',
  dependencyNames: [...constructorContracts, 'GNSTradingCallbacksV6_4_1'],
  getProxyConfig: ({ dependencyContracts }) => {
    console.log(
      'borrow',
      constructorContracts.map(
        (dependencyName) => dependencyContracts[dependencyName].address
      )
    );
    return {
      execute: {
        init: {
          methodName: 'initialize',
          args: constructorContracts.map(
            (dependencyName) => dependencyContracts[dependencyName].address
          ),
        },
      },
      proxyContract: 'OpenZeppelinTransparentProxy',
    };
  },
  afterDeploy: async ({
    deployedContract,
    getNamedAccounts,
    deployments,
    signer,
  }) => {
    const { execute, read } = deployments;
    const { deployer } = await getNamedAccounts();

    const currentValue = await read(
      'GNSTradingCallbacksV6_4_1',
      'borrowingFees'
    );
    if (currentValue == deployedContract.address) {
      return;
    }

    console.log('Executing GNSTradingCallbacksV6_4_1.initializeV2...');
    await execute(
      'GNSTradingCallbacksV6_4_1',
      { from: deployer },
      'initializeV2',
      deployedContract.address
    );
    console.log('Done GNSTradingCallbacksV6_4_1.initializeV2');
  },
});

module.exports = func;
