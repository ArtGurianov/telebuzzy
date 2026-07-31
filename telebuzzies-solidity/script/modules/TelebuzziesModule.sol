// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "mydaogs-ecosystem-contracts/script/modules/MyDaogsIsolatedDividendsModule.sol";
import "../../src/contracts/Telebuzzies.sol";
import {ITelebuzziesArgs} from "../../src/lib/args/ITelebuzziesArgs.sol";
import {console} from "forge-std/console.sol";

contract TelebuzziesModule is MyDaogsIsolatedDividendsModule {
    struct TelebuzziesModuleArgs {
        IsolatedDividendsArgs _dividendsArgs;
        uint256 _feesTokenMonthlyPrice;
        uint256 _feesTokenAnnualPrice;
    }

    address public CONTRACT_ADDRESS_TELEBUZZIES;
    address public IMPLEMENTATION_ADDRESS_TELEBUZZIES;

    function initializeTelebuzzies(TelebuzziesModuleArgs memory _args) public {
        initializeIsolatedDividends(_args._dividendsArgs);

        Telebuzzies implementation = new Telebuzzies();
        IMPLEMENTATION_ADDRESS_TELEBUZZIES = address(implementation);

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                Telebuzzies.initialize,
                (ITelebuzziesArgs.TelebuzziesArgs({
                        _dividendsContractAddress: CONTRACT_ADDRESS_DIVIDENDS,
                        _feesTokenMonthlyPrice: _args._feesTokenMonthlyPrice,
                        _feesTokenAnnualPrice: _args._feesTokenAnnualPrice
                    }))
            )
        );
        CONTRACT_ADDRESS_TELEBUZZIES = address(proxy);

        console.log("Telebuzzies implementation address:");
        console.log(IMPLEMENTATION_ADDRESS_TELEBUZZIES);
        console.log("Telebuzzies proxy address:");
        console.log(CONTRACT_ADDRESS_TELEBUZZIES);
    }
}
