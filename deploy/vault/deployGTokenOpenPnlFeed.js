const { timeout } = require('../../utils/delay');
const { createDeployFunction } = require('../../utils/deploy');
const { grantGNSMinterRole } = require('../../utils/role');
const { afterDeployTradingContract } = require('../../utils/trading');

const func = createDeployFunction({
  contractName: 'GTokenOpenPnlFeed',
  dependencyNames: ['GTokenV6_3_2'],
  getDeployArgs: ({ dependencyContracts }) => [
    100,
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    dependencyContracts['GTokenV6_3_2'].address,
    [
      '0x495F8ed5925a0d1Dbb96e306799E60FDE2B5FF70',
      '0x495F8ed5925a0d1Dbb96e306799E60FDE2B5FF70',
    ],
    '0x3236323335663431613834383465356439393537393466383665646534656163',
    1,
  ],
});

module.exports = func;
