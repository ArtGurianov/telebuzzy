// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import {MyDaogsAbstractProject} from "mydaogs-ecosystem-contracts/src/contracts/MyDaogsAbstractProject.sol";
import {IMyDaogsDividends} from "mydaogs-ecosystem-contracts/src/contracts/IMyDaogsDividends.sol";
import {ITelebuzziesArgs} from "../lib/args/ITelebuzziesArgs.sol";

contract Telebuzzies is ITelebuzziesArgs, MyDaogsAbstractProject {
    error ZeroPrice();

    enum SubscriptionPlan {
        MONTHLY,
        ANNUAL
    }

    struct SubscriptionData {
        uint256 subscriptionStartTimestamp;
        uint256 subscriptionEndTimestamp;
    }

    event SubscriptionUpdated(
        bytes32 indexed userIdHash,
        SubscriptionPlan plan,
        uint256 subscriptionStartTimestamp,
        uint256 subscriptionEndTimestamp
    );
    event MonthlyPriceChanged(uint256 previousPrice, uint256 newPrice);
    event AnnualPriceChanged(uint256 previousPrice, uint256 newPrice);

    uint256 public FEES_TOKEN_MONTHLY_PRICE;
    uint256 public FEES_TOKEN_ANNUAL_PRICE;

    // bytes32 userIdHash => SubscriptionData
    mapping(bytes32 => SubscriptionData) private subscriptions;

    uint256[47] private __gap;

    function initialize(TelebuzziesArgs memory _args) external initializer {
        __MyDaogsAbstractProject_init(AbstractProjectArgs({_dividendsContractAddress: _args._dividendsContractAddress}));

        if (_args._feesTokenMonthlyPrice == 0 || _args._feesTokenAnnualPrice == 0) revert ZeroPrice();
        FEES_TOKEN_MONTHLY_PRICE = _args._feesTokenMonthlyPrice;
        FEES_TOKEN_ANNUAL_PRICE = _args._feesTokenAnnualPrice;
    }

    function getSubscriptionData(bytes32 userIdHash) public view returns (SubscriptionData memory) {
        return subscriptions[userIdHash];
    }

    function updateSubscription(bytes32 userIdHash, SubscriptionPlan plan) external {
        uint256 chargeAmountUSD = plan == SubscriptionPlan.MONTHLY ? FEES_TOKEN_MONTHLY_PRICE : FEES_TOKEN_ANNUAL_PRICE;
        IMyDaogsDividends.FeesTokenDetails memory feesToken = getFeesTokenDetails();

        _charge(msg.sender, address(0), chargeAmountUSD, 10_000, feesToken.tokenAddress, feesToken.decimals);

        uint256 addDays = plan == SubscriptionPlan.MONTHLY ? 30 : 360;
        SubscriptionData memory subscriptionData = subscriptions[userIdHash];

        if (subscriptionData.subscriptionEndTimestamp > block.timestamp) {
            subscriptions[userIdHash].subscriptionEndTimestamp += addDays * 1 days;
        } else {
            subscriptions[userIdHash] = SubscriptionData({
                subscriptionStartTimestamp: block.timestamp,
                subscriptionEndTimestamp: block.timestamp + addDays * 1 days
            });
        }

        emit SubscriptionUpdated(
            userIdHash,
            plan,
            subscriptions[userIdHash].subscriptionStartTimestamp,
            subscriptions[userIdHash].subscriptionEndTimestamp
        );
    }

    function changeMonthlyPrice(uint256 _newPrice) external onlyProjectAdmin {
        if (_newPrice == 0) revert ZeroPrice();
        emit MonthlyPriceChanged(FEES_TOKEN_MONTHLY_PRICE, _newPrice);
        FEES_TOKEN_MONTHLY_PRICE = _newPrice;
    }

    function changeAnnualPrice(uint256 _newPrice) external onlyProjectAdmin {
        if (_newPrice == 0) revert ZeroPrice();
        emit AnnualPriceChanged(FEES_TOKEN_ANNUAL_PRICE, _newPrice);
        FEES_TOKEN_ANNUAL_PRICE = _newPrice;
    }
}
