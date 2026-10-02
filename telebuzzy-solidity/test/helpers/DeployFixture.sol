// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {TestUSDT} from "mydaogs-ecosystem-contracts/test/contracts/TestUSDT.sol";
import {MyDaogsIsolatedDividends} from "mydaogs-ecosystem-contracts/src/contracts/MyDaogsIsolatedDividends.sol";
import {Telebuzzy} from "../../src/contracts/Telebuzzy.sol";
import {ITelebuzzyArgs} from "../../src/lib/args/ITelebuzzyArgs.sol";

contract DeployFixture is Test {
    uint256 internal constant MONTHLY_PRICE_USD = 10;
    uint256 internal constant ANNUAL_PRICE_USD = 100;

    address internal deployer = makeAddr("deployer");
    address internal customer = makeAddr("customer");

    TestUSDT internal usdt;
    MyDaogsIsolatedDividends internal dividends;
    Telebuzzy internal implementation;
    Telebuzzy internal telebuzzy;

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
        implementation = new Telebuzzy();

        vm.prank(deployer);
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                Telebuzzy.initialize,
                (ITelebuzzyArgs.TelebuzzyArgs({
                        _dividendsContractAddress: address(dividends),
                        _feesTokenMonthlyPrice: MONTHLY_PRICE_USD,
                        _feesTokenAnnualPrice: ANNUAL_PRICE_USD
                    }))
            )
        );
        telebuzzy = Telebuzzy(address(proxy));
    }
}
