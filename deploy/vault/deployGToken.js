const { timeout } = require('../../utils/delay');
const { createDeployFunction } = require('../../utils/deploy');
const { getContractAddress } = require('@ethersproject/address');
const fs = require('fs');

const func = createDeployFunction({
  contractName: 'GTokenV6_3_2',
  dependencyNames: ['GNSPriceAggregatorV6_4'],
  getProxyConfig: async ({ dependencyContracts }) => {
    const [owner] = await ethers.getSigners();
    let transactionCount = await owner.getTransactionCount();

    console.log(
      'next addresses',
      getContractAddress({
        from: owner.address,
        nonce: transactionCount,
      }),
      getContractAddress({
        from: owner.address,
        nonce: transactionCount + 1,
      }),
      getContractAddress({
        from: owner.address,
        nonce: transactionCount + 2,
      }),
      getContractAddress({
        from: owner.address,
        nonce: transactionCount + 3,
      }),
      getContractAddress({
        from: owner.address,
        nonce: transactionCount + 4,
      }),
      getContractAddress({
        from: owner.address,
        nonce: transactionCount + 5,
      })
    );

    transactionCount += 3; // skip implementation + proxy deployment + setVault tx
    transactionCount++; // skip nft design
    const nft = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log('GToken.lockedDepositNft:', nft);

    transactionCount++;
    const pnlFeed = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log('GToken.openTradesPnlFeed:', pnlFeed);

    transactionCount += 2; // skip implementation deployment
    const callbacks = getContractAddress({
      from: owner.address,
      nonce: transactionCount,
    });
    console.log('GToken.pnlHandler:', callbacks);

    return {
      execute: {
        init: {
          methodName: 'initialize',
          args: [
            'zPerp DAI',
            'ZDAI',
            [
              '0x04B2A6E51272c82932ecaB31A5Ab5aC32AE168C3',
              '0xd7D1dCba2c678ee7e049BD55176354E7C5bBdcCA',
              '0x126961F4BB5ebea2aD5EE202d09489c4518eA1F0',
              '0xf8f4E87d7a8E3aeddaf88dc952b54F484CCe6740',
              '0x469Cd2AE37BC3d579eE2c4F0B5e31eA212Fa405E',
              nft,
              callbacks,
              pnlFeed,
              [
                dependencyContracts['GNSPriceAggregatorV6_4'].address,
                '0x3c88e882',
              ],
            ],
            1209600,
            '1134419645953891016',
            '500000000000000000',
            ['10000000000000000000', '20000000000000000000'],
            '2000000000000000000',
            0,
            '50000000000000000',
            '5000000000000000000',
            '150000000000000000000',
          ],
        },
      },
      proxyContract: 'OpenZeppelinTransparentProxy',
    };
  },
  afterDeploy: async ({
    deployedContract,
    signer,
    deployments,
    getNamedAccounts,
  }) => {
    const { get, read, execute } = deployments;

    const tradingStorageAddr = (await get('GFarmTradingStorageV5')).address;
    const tradingStorage = await hre.ethers.getContractAt(
      'GFarmTradingStorageV5',
      tradingStorageAddr,
      signer
    );

    const vault = await read('GFarmTradingStorageV5', 'vault');
    if (vault == deployedContract.address) {
      return;
    }
    const { deployer } = await getNamedAccounts();
    console.info('Executing setVault...');
    await execute(
      'GFarmTradingStorageV5',
      { from: deployer },
      'setVault',
      deployedContract.address
    );
    // await hre.ethers.provider.waitForTransaction(tx.hash);
    console.info('Done setVault');
  },
});

module.exports = func;
