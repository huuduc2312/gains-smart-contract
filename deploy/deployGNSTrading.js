const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');
const { grantGNSMinterRole } = require('../utils/role');
const { afterDeployTradingContract } = require('../utils/trading');

const constructorContracts = [
  'GFarmTradingStorageV5',
  'GNSOracleRewardsV6_4_1',
  'GNSPairInfosV6_1',
  'GNSReferralsV6_2',
  'GNSBorrowingFeesV6_4',
];

const func = createDeployFunction({
  contractName: 'GNSTradingV6_4_1',
  dependencyNames: constructorContracts,
  libraryNames: ['PackingUtils', 'TradeUtils'],
  afterDeploy: async ({ deployments, signer, deployedContract }) => {
    const setContract = async (tradingStorage) => {
      console.log('Executing TradingStorage.setTrading...');
      const tx = await tradingStorage.setTrading(deployedContract.address);
      await hre.ethers.provider.waitForTransaction(tx.hash);
      console.info('TradingStorage.setTrading done');
    };

    return afterDeployTradingContract(
      deployments,
      setContract,
      signer,
      'GNSTradingV6_4_1',
      deployedContract.address
    );
  },
  getDeployArgs: ({ dependencyContracts }) => [
    ...constructorContracts.map(
      (contract) => dependencyContracts[contract].address
    ),
    // dependencyContracts['GFarmTradingStorageV5'].address,
    // dependencyContracts['GNSOracleRewardsV6_4_1'].address,
    // dependencyContracts['GNSPairInfosV6_1'].address,
    // dependencyContracts['GNSReferralsV6_2'].address,
    // dependencyContracts['GNSBorrowingFeesV6_4'].address,
    '100000000000000000000000',
    // 2500000000,
    30,
  ],
});

module.exports = func;
