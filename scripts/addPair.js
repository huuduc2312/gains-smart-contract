const hre = require('hardhat');
const contractAddr =
  require('../deployments/mumbai/GNSPairsStorageV6.json').address;

async function addPair() {
  const [owner] = await hre.ethers.getSigners();
  const contract = await hre.ethers.getContractAt(
    'GNSPairsStorageV6',
    contractAddr,
    owner
  );

  console.info('Executing addGroup...');
  const addGroupTx = await contract.addGroup([
    'crypto',
    '0x3235656562353536636165343464366561303166623233363466616363613131',
    2,
    150,
    15,
  ]);
  await ethers.provider.waitForTransaction(addGroupTx.hash);
  console.info('Done addGroup');

  console.info('Executing addFee...');
  const addFeeTx = await contract.addFee([
    'crypto',
    300000000,
    600000000,
    60000000,
    200000000,
    1,
    '1500000000000000000000',
  ]);
  await ethers.provider.waitForTransaction(addFeeTx.hash);
  console.info('Done addFee');

  console.info('Executing addPair...');
  const addPairTx = await contract.addPair([
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
  await ethers.provider.waitForTransaction(addPairTx.hash);
  console.info('Done addPair');
}

module.exports = addPair;
