// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {MyDaogsAbstractProject} from "mydaogs-ecosystem-contracts/src/contracts/MyDaogsAbstractProject.sol";
import {Telebuzzies} from "../src/contracts/Telebuzzies.sol";
import {ITelebuzziesArgs} from "../src/lib/args/ITelebuzziesArgs.sol";
import {DeployFixture} from "./helpers/DeployFixture.sol";

contract TelebuzziesTest is DeployFixture {
    bytes32 internal testUserId = bytes32(abi.encodePacked("random_string"));

    function _approveAndSubscribe(address _subscriber, Telebuzzies.SubscriptionPlan _plan, bytes32 _userIdHash)
        internal
    {
        uint256 priceUSD = _plan == Telebuzzies.SubscriptionPlan.MONTHLY ? MONTHLY_PRICE_USD : ANNUAL_PRICE_USD;
        uint256 priceUnits = priceUSD * 10 ** usdt.decimals();
        vm.prank(_subscriber);
        usdt.approve(address(telebuzzies), priceUnits);
        vm.prank(_subscriber);
        telebuzzies.updateSubscription(_userIdHash, _plan);
    }

    function test_SubscribeNew() public {
        uint256 timestamp = block.timestamp;

        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzies.SubscriptionData memory subscriptionData = telebuzzies.getSubscriptionData(testUserId);
        assertEq(subscriptionData.subscriptionStartTimestamp, timestamp);
        assertEq(subscriptionData.subscriptionEndTimestamp, timestamp + 30 * 24 * 3600);
    }

    function test_SubscribeAnnual() public {
        uint256 timestamp = block.timestamp;

        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.ANNUAL, testUserId);

        Telebuzzies.SubscriptionData memory subscriptionData = telebuzzies.getSubscriptionData(testUserId);
        assertEq(subscriptionData.subscriptionStartTimestamp, timestamp);
        assertEq(subscriptionData.subscriptionEndTimestamp, timestamp + 360 * 24 * 3600);
    }

    function test_SubscribeExtendsWhileActive() public {
        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);
        Telebuzzies.SubscriptionData memory firstSubscription = telebuzzies.getSubscriptionData(testUserId);

        vm.warp(block.timestamp + 10 days);
        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzies.SubscriptionData memory secondSubscription = telebuzzies.getSubscriptionData(testUserId);
        assertEq(secondSubscription.subscriptionStartTimestamp, firstSubscription.subscriptionStartTimestamp);
        assertEq(secondSubscription.subscriptionEndTimestamp, firstSubscription.subscriptionEndTimestamp + 30 days);
    }

    function test_SubscribeFreshStartAtExactEndBoundary() public {
        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);
        Telebuzzies.SubscriptionData memory firstSubscription = telebuzzies.getSubscriptionData(testUserId);

        vm.warp(firstSubscription.subscriptionEndTimestamp);
        uint256 renewalTimestamp = block.timestamp;
        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);

        Telebuzzies.SubscriptionData memory secondSubscription = telebuzzies.getSubscriptionData(testUserId);
        assertEq(secondSubscription.subscriptionStartTimestamp, renewalTimestamp);
        assertEq(secondSubscription.subscriptionEndTimestamp, renewalTimestamp + 30 days);
    }

    function test_DividendsReceivesFullCharge() public {
        uint256 dividendsBalanceBefore = usdt.balanceOf(address(dividends));

        _approveAndSubscribe(customer, Telebuzzies.SubscriptionPlan.MONTHLY, testUserId);

        assertEq(usdt.balanceOf(address(dividends)), dividendsBalanceBefore + MONTHLY_PRICE_USD * 10 ** usdt.decimals());
        assertEq(usdt.balanceOf(address(telebuzzies)), 0);
    }

    function test_PriceSetters_RevertForRandomAddress() public {
        address randomAddress = makeAddr("random");
        vm.prank(randomAddress);
        vm.expectRevert(MyDaogsAbstractProject.NotProjectAdmin.selector);
        telebuzzies.changeMonthlyPrice(20);
    }

    function test_PriceSetters_SuperAdminAndAdminCanChange() public {
        address superAdmin = makeAddr("superAdmin");
        address admin = makeAddr("admin");

        vm.prank(deployer);
        telebuzzies.addProjectSuperAdmin(superAdmin);

        vm.prank(superAdmin);
        telebuzzies.changeMonthlyPrice(20);
        assertEq(telebuzzies.FEES_TOKEN_MONTHLY_PRICE(), 20);

        vm.prank(superAdmin);
        telebuzzies.addProjectAdmin(admin);

        vm.prank(admin);
        telebuzzies.changeAnnualPrice(200);
        assertEq(telebuzzies.FEES_TOKEN_ANNUAL_PRICE(), 200);
    }

    function test_PriceSetters_RevertOnZero() public {
        vm.prank(deployer);
        telebuzzies.addProjectSuperAdmin(deployer);

        vm.prank(deployer);
        vm.expectRevert(Telebuzzies.ZeroPrice.selector);
        telebuzzies.changeMonthlyPrice(0);
    }

    function test_UpgradeAuth_RevertsForRandomAddress() public {
        Telebuzzies newImplementation = new Telebuzzies();

        address randomAddress = makeAddr("random");
        vm.prank(randomAddress);
        vm.expectRevert(MyDaogsAbstractProject.NotAnEcosystemAdmin.selector);
        telebuzzies.upgradeToAndCall(address(newImplementation), "");
    }

    function test_UpgradeAuth_SucceedsForEcosystemAdmin() public {
        Telebuzzies newImplementation = new Telebuzzies();

        vm.prank(deployer);
        telebuzzies.upgradeToAndCall(address(newImplementation), "");
    }

    function test_InitializeOnce_RevertsOnProxy() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        telebuzzies.initialize(
            ITelebuzziesArgs.TelebuzziesArgs({
                _dividendsContractAddress: address(dividends),
                _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                _feesTokenAnnualPrice: ANNUAL_PRICE_USD
            })
        );
    }

    function test_InitializeOnce_RevertsOnBareImplementation() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        implementation.initialize(
            ITelebuzziesArgs.TelebuzziesArgs({
                _dividendsContractAddress: address(dividends),
                _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                _feesTokenAnnualPrice: ANNUAL_PRICE_USD
            })
        );
    }
}
