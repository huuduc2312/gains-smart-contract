const { deployments, getNamedAccounts } = require('hardhat');

async function addPair() {
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  console.info('Executing addGroup...');
  await execute('GNSPairsStorageV6', { from: deployer }, 'addGroup', [
    'crypto',
    '0x3235656562353536636165343464366561303166623233363466616363613131',
    2,
    150,
    15,
  ]);
  console.info('Done addGroup');

  console.info('Executing addFee...');
  await execute('GNSPairsStorageV6', { from: deployer }, 'addFee', [
    'crypto',
    300000000,
    600000000,
    60000000,
    200000000,
    1,
    '1500000000000000000000',
  ]);
  console.info('Done addFee');

  console.info('Executing addPair...');
  await execute('GNSPairsStorageV6', { from: deployer }, 'addPair', [
    'BTC',
    'USD',
    [
      '0x007A22900a3B98143368Bd5906f8E17e9867581b',
      '0x0000000000000000000000000000000000000000',
      0,
      200000000000,
    ],
    400000000,
    0,
    0,
  ]);
  console.info('Done addPair');
}

module.exports = addPair;
