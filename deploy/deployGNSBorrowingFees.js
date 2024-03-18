const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const constructorContracts = ['GFarmTradingStorageV5', 'GNSPairInfosV6_1'];

const func = createDeployFunction({
  contractName: 'GNSBorrowingFeesV6_4',
  dependencyNames: [...constructorContracts, 'GNSTradingCallbacksV6_4_1'],
  getProxyConfig: ({ dependencyContracts }) => {
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
    const { get } = deployments;

    const callbacks = await get('GNSTradingCallbacksV6_4_1');
    const callbacksContract = await hre.ethers.getContractAt(
      'GNSTradingCallbacksV6_4_1',
      callbacks.address,
      signer
    );

    const currentValue = await callbacksContract.borrowingFees();
    if (currentValue == deployedContract.address) {
      return;
    }

    console.log('Executing GNSTradingCallbacksV6_4_1.initializeV2...');
    const tx = await callbacksContract.initializeV2(deployedContract.address);
    await hre.ethers.provider.waitForTransaction(tx.hash);
    console.log('Done GNSTradingCallbacksV6_4_1.initializeV2');
  },
});

module.exports = func;
