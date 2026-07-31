// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {TestUSDT} from "mydaogs-ecosystem-contracts/test/contracts/TestUSDT.sol";
import {MyDaogsIsolatedDividends} from "mydaogs-ecosystem-contracts/src/contracts/MyDaogsIsolatedDividends.sol";
import {Telebuzzies} from "../../src/contracts/Telebuzzies.sol";
import {ITelebuzziesArgs} from "../../src/lib/args/ITelebuzziesArgs.sol";

contract DeployFixture is Test {
    uint256 internal constant MONTHLY_PRICE_USD = 10;
    uint256 internal constant ANNUAL_PRICE_USD = 100;

    address internal deployer = makeAddr("deployer");
    address internal customer = makeAddr("customer");

    TestUSDT internal usdt;
    MyDaogsIsolatedDividends internal dividends;
    Telebuzzies internal implementation;
    Telebuzzies internal telebuzzies;

    function setUp() public virtual {
        vm.prank(deployer);
        usdt = new TestUSDT();

        // publicMint1000USDT()'s 24h cooldown is waived only in the test env's first block
        // (timestamp == 1) -- mint for both parties here while that still holds.
        vm.prank(deployer);
        usdt.publicMint1000USDT();
        vm.prank(customer);
        usdt.publicMint1000USDT();

        vm.prank(deployer);
        dividends = new MyDaogsIsolatedDividends(address(usdt));

        vm.prank(deployer);
        implementation = new Telebuzzies();

        vm.prank(deployer);
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                Telebuzzies.initialize,
                (ITelebuzziesArgs.TelebuzziesArgs({
                        _dividendsContractAddress: address(dividends),
                        _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                        _feesTokenAnnualPrice: ANNUAL_PRICE_USD
                    }))
            )
        );
        telebuzzies = Telebuzzies(address(proxy));
    }
}
