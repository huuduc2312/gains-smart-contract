const { timeout } = require('../utils/delay');
const { createDeployFunction } = require('../utils/deploy');

const func = createDeployFunction({
  contractName: 'GTokenV6_3_2',
  afterDeploy: async ({ deployedContract, signer, deployments }) => {
    const { get } = deployments;

    const tradingStorageAddr = (await get('GFarmTradingStorageV5')).address;
    const tradingStorage = await hre.ethers.getContractAt(
      'GFarmTradingStorageV5',
      tradingStorageAddr,
      signer
    );

    console.info('Executing setVault...');
    const tx = await tradingStorage.setVault(deployedContract.address);
    await hre.ethers.provider.waitForTransaction(tx.hash);
    console.info('Done setVault');
  },
});

module.exports = func;
