const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');
const { grantGNSMinterRole } = require('../utils/role');
const {
  afterDeployTradingContract,
  setTradingStorageParam,
  addTradingContract,
} = require('../utils/trading');

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
  afterDeploy: async ({ deployments, deployedContract, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts();

    return addTradingContract(
      deployments,
      deployer,
      'GNSTradingV6_4_1',
      deployedContract.address,
      {
        param: 'trading',
        method: 'setTrading',
      }
    );
  },
  getDeployArgs: ({ dependencyContracts }) => [
    ...constructorContracts.map(
      (contract) => dependencyContracts[contract].address
    ),
    '100000000000000000000000',
    30,
  ],
});

module.exports = func;
