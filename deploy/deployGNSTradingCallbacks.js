const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');
const { afterDeployTradingContract } = require('../utils/trading');

const constructorContracts = [
  'GFarmTradingStorageV5',
  'GNSOracleRewardsV6_4_1',
  'GNSPairInfosV6_1',
  'GNSReferralsV6_2',
  'GNSStakingV6_4_1',
  'GTokenV6_3_2',
];

const func = createDeployFunction({
  contractName: 'GNSTradingCallbacksV6_4_1',
  dependencyNames: constructorContracts,
  getProxyConfig: ({ dependencyContracts }) => ({
    execute: {
      init: {
        methodName: 'initialize',
        args: [
          ...constructorContracts.map(
            (dependencyName) => dependencyContracts[dependencyName].address
          ),
          50,
          0,
          50,
          2,
        ],
      },
    },
    proxyContract: 'OpenZeppelinTransparentProxy',
  }),
  afterDeploy: async ({ deployments, signer, deployedContract }) => {
    const setContract = async (tradingStorage) => {
      console.log('Executing TradingStorage.setCallbacks...');
      const tx = await tradingStorage.setCallbacks(deployedContract.address);
      await hre.ethers.provider.waitForTransaction(tx.hash);
      console.info('TradingStorage.setCallbacks done');
    };

    return afterDeployTradingContract(
      deployments,
      setContract,
      signer,
      'GNSBorrowingFeesV6_4',
      deployedContract.address
    );
  },
});

module.exports = func;
