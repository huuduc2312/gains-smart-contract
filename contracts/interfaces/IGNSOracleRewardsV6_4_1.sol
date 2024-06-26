// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {StorageInterfaceV5} from "./StorageInterfaceV5.sol";

interface IGNSOracleRewardsV6_4_1 {
    struct TriggeredLimitId {
        address trader;
        uint pairIndex;
        uint index;
        StorageInterfaceV5.LimitOrder order;
    }
    enum OpenLimitOrderType {
        LEGACY,
        REVERSAL,
        MOMENTUM
    }

    function storeTrigger(TriggeredLimitId calldata) external;

    function unregisterTrigger(TriggeredLimitId calldata) external;

    function distributeOracleReward(TriggeredLimitId calldata, uint) external;

    function openLimitOrderTypes(
        address,
        uint,
        uint
    ) external view returns (OpenLimitOrderType);

    function setOpenLimitOrderType(
        address,
        uint,
        uint,
        OpenLimitOrderType
    ) external;

    function triggered(TriggeredLimitId calldata) external view returns (bool);

    function timedOut(TriggeredLimitId calldata) external view returns (bool);
}
