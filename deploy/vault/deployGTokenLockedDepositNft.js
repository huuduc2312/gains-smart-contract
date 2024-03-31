const { timeout } = require('../../utils/delay');
const { createDeployFunction } = require('../../utils/deploy');
const { grantGNSMinterRole } = require('../../utils/role');
const { afterDeployTradingContract } = require('../../utils/trading');

const constructorContracts = ['GTokenV6_3_2', 'GTokenLockedDepositNftDesign'];

const func = createDeployFunction({
  contractName: 'GTokenLockedDepositNft',
  dependencyNames: constructorContracts,
  getDeployArgs: ({ dependencyContracts }) => [
    'zPerp DAI',
    'ZDAI',
    ...constructorContracts.map(
      (contract) => dependencyContracts[contract].address
    ),
    2,
  ],
});

module.exports = func;
