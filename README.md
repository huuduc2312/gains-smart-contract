# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

# Deploy flow
1. Deploy Chainlink Operator contract
2. Create price aggregate Job on Chainlink node
3. Update config.json
4. Run:

```shell
yarn hardhat compile --network <network>
```
