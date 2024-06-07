require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");
require("@typechain/hardhat");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("@matterlabs/hardhat-zksync");
require("@matterlabs/hardhat-zksync-upgradable");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 1,
          },
          viaIR: true,
        },
      },
      {
        version: "0.8.17",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          optimizer: {
            enabled: true,
            runs: 1,
          },
          viaIR: true,
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
          metadata: {
            // do not include the metadata hash, since this is machine dependent
            // and we want all generated code to be deterministic
            // https://docs.soliditylang.org/en/v0.7.6/metadata.html
            bytecodeHash: "none",
          },
        },
      },
    ],
    overrides: {
      "contracts/uniswap/libraries/TickBitmap.sol": { version: "0.7.6" },
      "contracts/GNSTradingCallbacksV6_1": { version: "0.8.14" },
    },
  },
  networks: {
    mumbai: {
      url: "https://polygon-mumbai-pokt.nodies.app",
      chainId: 80001,
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
      allowUnlimitedContractSize: true,
    },
    zkSyncSepoliaTestnet: {
      url: "https://sepolia.era.zksync.dev",
      ethNetwork: "sepolia",
      zksync: true,
      verifyURL:
        "https://explorer.sepolia.era.zksync.dev/contract_verification",
      accounts: [
        "0cc2723ba3127b216c0a65bddec8792a273bd2399686910941e60616a76cd197",
      ],
      forceDeploy: false,
    },
    amoy: {
      url: "https://polygon-amoy.g.alchemy.com/v2/POKcKGGbl_RjN4kuXahDqpVaa7WrAWyD",
      chainId: 80002,
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
      allowUnlimitedContractSize: true,
    },
    fantom: {
      url: "https://rpc.ankr.com/fantom_testnet",
      chainId: 4002,
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
      allowUnlimitedContractSize: true,
    },
    rune: {
      url: "https://testnet.runechain.com/rpc",
      chainId: 22221,
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
      allowUnlimitedContractSize: true,
      // zksync: true,
    },
    nos: {
      url: "https://l2-node.regtest.trustless.computer/",
      chainId: 42070,
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      chainId: 11155111,
      url: "https://eth-sepolia.g.alchemy.com/v2/HS_hSTSr5sRkWNdjOYPKhLj6e9BVgots",
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
    },
    localhost: {
      accounts: process.env.ACCOUNT_KEYS?.split(",") || [],
    },
    hardhat: {
      accounts: [
        {
          privateKey: process.env.ACCOUNT_KEYS?.split(",")[0],
          balance: "5000000000000000000000",
        },
      ],
    },
  },
  zksolc: {
    version: "latest",
    settings: {
      // find all available options in the official documentation
      // https://era.zksync.io/docs/tools/hardhat/hardhat-zksync-solc.html#configuration
      libraries: {
        "contracts/libraries/PackingUtils.sol": {
          "PackingUtils": "0x832A9Fa42bEf98b702347f3B8F5F44c56bCbF50a",
        },
        "contracts/libraries/TradeUtils.sol": {
          "TradeUtils": "0x315311bE819341f29337295048889D26fa3a5D38",
        },
      },
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      hardhat: "0xd7D1dCba2c678ee7e049BD55176354E7C5bBdcCA",
    },
  },
  mocha: {
    timeout: 100000000,
  },
};
