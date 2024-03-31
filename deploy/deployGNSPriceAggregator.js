const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const constructorContracts = [
  'GFarmTradingStorageV5',
  'GNSPairsStorageV6',
  // 'Operator',
];

const func = createDeployFunction({
  contractName: 'GNSPriceAggregatorV6_4',
  libraryNames: ['PackingUtils'],
  dependencyNames: constructorContracts,
  getDeployArgs: ({ dependencyContracts }) => [
    '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', // _linkToken
    '0x675100252429daD22115cE217F69FFda6dA40A52', // uniswapV3Pool
    900, // _twapInterval
    dependencyContracts['GFarmTradingStorageV5'].address,
    dependencyContracts['GNSPairsStorageV6'].address,
    '0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408', // _linkPriceFeed
    1, // _minAnswers
    ['0x495F8ed5925a0d1Dbb96e306799E60FDE2B5FF70'], // _nodes
    [
      '0x3236323335663431613834383465356439393537393466383665646534656163',
      '0x3236323335663431613834383465356439393537393466383665646534656163',
    ], // _jobIds
  ],
  afterDeploy: async ({
    deployedContract,
    signer,
    deployments,
    getNamedAccounts,
    network,
  }) => {
    const { get, execute, read } = deployments;

    const tradingStorageAddr = (await get('GFarmTradingStorageV5')).address;
    const tradingStorage = await hre.ethers.getContractAt(
      'GFarmTradingStorageV5',
      tradingStorageAddr,
      signer
    );

    const { deployer } = await getNamedAccounts();
    const priceAggregator = await read(
      'GFarmTradingStorageV5',
      'priceAggregator'
    );
    if (priceAggregator == deployedContract.address) {
      console.log('check priceAggregator', priceAggregator);
      return;
    }
    console.info('Executing setPriceAggregator...');

    await execute(
      'GFarmTradingStorageV5',
      { from: deployer },
      'setPriceAggregator',
      deployedContract.address
    );

    console.log(
      'double check -----',
      await read('GFarmTradingStorageV5', 'priceAggregator')
    );

    // tradingStorage.setPriceAggregator(deployedContract.address);
    // await hre.ethers.provider.waitForTransaction(tx.hash);
    console.info('Done setPriceAggregator');
  },
});

module.exports = func;
