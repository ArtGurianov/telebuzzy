// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "mydaogs-ecosystem-contracts/script/modules/MyDaogsIsolatedDividendsModule.sol";
import "../../src/contracts/Telebuzzy.sol";
import {ITelebuzzyArgs} from "../../src/lib/args/ITelebuzzyArgs.sol";
import {console} from "forge-std/console.sol";

contract TelebuzzyModule is MyDaogsIsolatedDividendsModule {
    struct TelebuzzyModuleArgs {
        IsolatedDividendsArgs _dividendsArgs;
        uint256 _feesTokenMonthlyPrice;
        uint256 _feesTokenAnnualPrice;
    }

    address public CONTRACT_ADDRESS_TELEBUZZY;
    address public IMPLEMENTATION_ADDRESS_TELEBUZZY;

    function initializeTelebuzzy(TelebuzzyModuleArgs memory _args) public {
        initializeIsolatedDividends(_args._dividendsArgs);

        Telebuzzy implementation = new Telebuzzy();
        IMPLEMENTATION_ADDRESS_TELEBUZZY = address(implementation);

        ERC1967Proxy proxy = new ERC1967Proxy(
            address(implementation),
            abi.encodeCall(
                Telebuzzy.initialize,
                (ITelebuzzyArgs.TelebuzzyArgs({
                        _dividendsContractAddress: CONTRACT_ADDRESS_DIVIDENDS,
                        _feesTokenMonthlyPrice: _args._feesTokenMonthlyPrice,
                        _feesTokenAnnualPrice: _args._feesTokenAnnualPrice
                    }))
            )
        );
        CONTRACT_ADDRESS_TELEBUZZY = address(proxy);

        console.log("Telebuzzy implementation address:");
        console.log(IMPLEMENTATION_ADDRESS_TELEBUZZY);
        console.log("Telebuzzy proxy address:");
        console.log(CONTRACT_ADDRESS_TELEBUZZY);
    }
}
