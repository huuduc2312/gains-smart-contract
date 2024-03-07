const { expect } = require('chai');
const { waffle, ethers } = require('hardhat');
const { deployMockContract, provider } = waffle;

describe('Price aggregator', function () {
  it('test getPrice', async function () {
    const [owner] = await ethers.getSigners();

    const tradeStorage = await ethers.deployContract('GFarmTradingStorageV5');
    const oracleReward = await ethers.deployContract('GNSOracleRewardsV6_4_1');
    const pairInfo = await ethers.deployContract('GNSPairInfosV6_1');
    const referral = await ethers.deployContract('GNSReferralsV6_2', []);

    GNSReferralsV6_2;

    const contract = await contractFactory.deploy(
      '0xfBD96A40c94a9d165E1Af988701127E89DD37d3C',
      '0xaBBAac949F8075Bb65C1d5482DFe991772CF5f7a',
      '0xe3E8d23df4dE648f9230c05AdDB87fEabdD53d75',
      '0x2A86E740f6d86dF2d083E9A0290f425b07854EC6',
      '0x7bF3E227a87526601F35423F310D28AbEFbD6eD9',
      2500000000,
      30
    );

    await contract.openTrade(
      [
        owner.address,
        0,
        0,
        0,
        100000000000000000000n,
        650000000000000,
        true,
        29,
        851724137931034,
        0,
      ],
      1,
      10000000000,
      '0x0000000000000000000000000000000000000000'
    );
  });
});
