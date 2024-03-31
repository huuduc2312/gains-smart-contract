const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const func = createDeployFunction({
  contractName: 'GTokenLockedDepositNftDesign',
});

module.exports = func;
