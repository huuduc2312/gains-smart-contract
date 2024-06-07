const { timeout } = require("../utils/delay");
const { createDeployFunction } = require("../utils/deploy");
const { grantGNSMinterRole } = require("../utils/role");
const { afterDeployTradingContract } = require("../utils/trading");
const config = require("../config.json");

const func = createDeployFunction({
  contractName: "GTokenOpenPnlFeed",
  dependencyNames: ["GTokenV6_3_2"],
  getDeployArgs: ({ dependencyContracts, network }) => {
    return [
      100, // _LINK_FEE_BALANCE_DIVIDER
      "0xd78b4E064be897b11bb9ceca47Bd7815ba3d63C6", // _linkToken
      dependencyContracts["GTokenV6_3_2"].address,
      [
        "0x0d9080e677505d29Be4Da1DDd855c6b523F1D38d",
        "0x0d9080e677505d29Be4Da1DDd855c6b523F1D38d",
      ], // _oracles
      "0x3236323335663431613834383465356439393537393466383665646534656163", // _job
      1, // _minAnswers
    ];
  },
});

module.exports = func;
