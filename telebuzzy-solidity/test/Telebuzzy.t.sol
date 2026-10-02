// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {MyDaogsAbstractProject} from "mydaogs-ecosystem-contracts/src/contracts/MyDaogsAbstractProject.sol";
import {Telebuzzy} from "../src/contracts/Telebuzzy.sol";
import {ITelebuzzyArgs} from "../src/lib/args/ITelebuzzyArgs.sol";
import {DeployFixture} from "./helpers/DeployFixture.sol";

contract TelebuzzyTest is DeployFixture {
    bytes32 internal testUserId = bytes32(abi.encodePacked("random_string"));

    function _approveAndSubscribe(address _subscriber, Telebuzzy.SubscriptionPlan _plan, bytes32 _userIdHash)
        internal
    {
        uint256 priceUSD = _plan == Telebuzzy.SubscriptionPlan.MONTHLY ? MONTHLY_PRICE_USD : ANNUAL_PRICE_USD;
        uint256 priceUnits = priceUSD * 10 ** usdt.decimals();
        vm.prank(_subscriber);
        usdt.approve(address(telebuzzy), priceUnits);
        vm.prank(_subscriber);
        telebuzzy.updateSubscription(_userIdHash, _plan);
    }

    function test_SubscribeNew() public {
        uint256 timestamp = block.timestamp;

        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzy.SubscriptionData memory subscriptionData = telebuzzy.getSubscriptionData(testUserId);
        assertEq(subscriptionData.subscriptionStartTimestamp, timestamp);
        assertEq(subscriptionData.subscriptionEndTimestamp, timestamp + 30 * 24 * 3600);
    }

    function test_SubscribeAnnual() public {
        uint256 timestamp = block.timestamp;

        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.ANNUAL, testUserId);

        Telebuzzy.SubscriptionData memory subscriptionData = telebuzzy.getSubscriptionData(testUserId);
        assertEq(subscriptionData.subscriptionStartTimestamp, timestamp);
        assertEq(subscriptionData.subscriptionEndTimestamp, timestamp + 360 * 24 * 3600);
    }

    function test_SubscribeExtendsWhileActive() public {
        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);
        Telebuzzy.SubscriptionData memory firstSubscription = telebuzzy.getSubscriptionData(testUserId);

        vm.warp(block.timestamp + 10 days);
        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzy.SubscriptionData memory secondSubscription = telebuzzy.getSubscriptionData(testUserId);
        assertEq(secondSubscription.subscriptionStartTimestamp, firstSubscription.subscriptionStartTimestamp);
        assertEq(secondSubscription.subscriptionEndTimestamp, firstSubscription.subscriptionEndTimestamp + 30 days);
    }

    function test_SubscribeFreshStartAtExactEndBoundary() public {
        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);
        Telebuzzy.SubscriptionData memory firstSubscription = telebuzzy.getSubscriptionData(testUserId);

        vm.warp(firstSubscription.subscriptionEndTimestamp);
        uint256 renewalTimestamp = block.timestamp;
        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzy.SubscriptionData memory secondSubscription = telebuzzy.getSubscriptionData(testUserId);
        assertEq(secondSubscription.subscriptionStartTimestamp, renewalTimestamp);
        assertEq(secondSubscription.subscriptionEndTimestamp, renewalTimestamp + 30 days);
    }

    function test_DividendsReceivesFullCharge() public {
        uint256 dividendsBalanceBefore = usdt.balanceOf(address(dividends));

        _approveAndSubscribe(customer, Telebuzzy.SubscriptionPlan.MONTHLY, testUserId);

        assertEq(usdt.balanceOf(address(dividends)), dividendsBalanceBefore + MONTHLY_PRICE_USD * 10 ** usdt.decimals());
        assertEq(usdt.balanceOf(address(telebuzzy)), 0);
    }

    function test_PriceSetters_RevertForRandomAddress() public {
        address randomAddress = makeAddr("random");
        vm.prank(randomAddress);
        vm.expectRevert(MyDaogsAbstractProject.NotProjectAdmin.selector);
        telebuzzy.changeMonthlyPrice(20);
    }

    function test_PriceSetters_SuperAdminAndAdminCanChange() public {
        address superAdmin = makeAddr("superAdmin");
        address admin = makeAddr("admin");

        vm.prank(deployer);
        telebuzzy.addProjectSuperAdmin(superAdmin);

        vm.prank(superAdmin);
        telebuzzy.changeMonthlyPrice(20);
        assertEq(telebuzzy.FEES_TOKEN_MONTHLY_PRICE(), 20);

        vm.prank(superAdmin);
        telebuzzy.addProjectAdmin(admin);

        vm.prank(admin);
        telebuzzy.changeAnnualPrice(200);
        assertEq(telebuzzy.FEES_TOKEN_ANNUAL_PRICE(), 200);
    }

    function test_PriceSetters_RevertOnZero() public {
        vm.prank(deployer);
        telebuzzy.addProjectSuperAdmin(deployer);

        vm.prank(deployer);
        vm.expectRevert(Telebuzzy.ZeroPrice.selector);
        telebuzzy.changeMonthlyPrice(0);
    }

    function test_UpgradeAuth_RevertsForRandomAddress() public {
        Telebuzzy newImplementation = new Telebuzzy();

        address randomAddress = makeAddr("random");
        vm.prank(randomAddress);
        vm.expectRevert(MyDaogsAbstractProject.NotAnEcosystemAdmin.selector);
        telebuzzy.upgradeToAndCall(address(newImplementation), "");
    }

    function test_UpgradeAuth_SucceedsForEcosystemAdmin() public {
        Telebuzzy newImplementation = new Telebuzzy();

        vm.prank(deployer);
        telebuzzy.upgradeToAndCall(address(newImplementation), "");
    }

    function test_InitializeOnce_RevertsOnProxy() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        telebuzzy.initialize(
            ITelebuzzyArgs.TelebuzzyArgs({
                _dividendsContractAddress: address(dividends),
                _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                _feesTokenAnnualPrice: ANNUAL_PRICE_USD
            })
        );
    }

    function test_InitializeOnce_RevertsOnBareImplementation() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        implementation.initialize(
            ITelebuzzyArgs.TelebuzzyArgs({
                _dividendsContractAddress: address(dividends),
                _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                _feesTokenAnnualPrice: ANNUAL_PRICE_USD
            })
        );
    }
}
