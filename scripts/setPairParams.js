const { deployments, getNamedAccounts } = require('hardhat');

async function setPairParams() {
  const { deployer } = await getNamedAccounts();
  const { execute } = deployments;

  await execute('GNSPairInfosV6_1', { from: deployer }, 'setManager', deployer);

  console.info('Executing GNSPairInfosV6_1.setManager...');
  await execute('GNSPairInfosV6_1', { from: deployer }, 'setManager', deployer);
  console.info('Done GNSPairInfosV6_1.setManager');

  console.info('Executing GNSPairInfosV6_1.setPairParams...');
  await execute(
    'GNSPairInfosV6_1',
    { from: deployer },
    'setPairParams',
    0,
    [0, 0, 0, 0]
  );
  console.info('Done GNSPairInfosV6_1.setPairParams');

  console.info('Executing GNSBorrowingFeesV6_4.setPairParams...');
  await execute(
    'GNSBorrowingFeesV6_4',
    { from: deployer },
    'setPairParams',
    0,
    [0, 0, 1, '13156490000000000']
  );
  console.info('Done GNSBorrowingFeesV6_4.setPairParams');
}

module.exports = setPairParams;
