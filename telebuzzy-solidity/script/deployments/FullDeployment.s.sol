// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import "../modules/TelebuzzyModule.sol";

error EnvValueNotProvided();

contract FullDeployment is Script, TelebuzzyModule {
    function run() public {
        bytes32 network = bytes32(abi.encodePacked(vm.envString("NETWORK")));
        uint256 deployerPrivateKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        address predeployedAddressUSD = vm.envOr("PREDEPLOYED_ADDRESS_USD", address(0));
        address predeployedAddressDividends = vm.envOr("PREDEPLOYED_ADDRESS_DIVIDENDS", address(0));
        uint256 monthlyPriceUSD = vm.envUint("MONTHLY_PRICE_USD");
        uint256 annualPriceUSD = vm.envUint("ANNUAL_PRICE_USD");

        if (deployerPrivateKey == 0 || network == bytes32(0)) {
            revert EnvValueNotProvided();
        }

        vm.startBroadcast(deployerPrivateKey);

        initializeTelebuzzy(
            TelebuzzyModuleArgs({
                _dividendsArgs: IsolatedDividendsArgs({
                    _network: network,
                    _predeployedAddressUSDT: predeployedAddressUSD,
                    _predeployedAddressDividends: predeployedAddressDividends
                }),
                _feesTokenMonthlyPrice: monthlyPriceUSD,
                _feesTokenAnnualPrice: annualPriceUSD
            })
        );

        vm.stopBroadcast();

        console.log("Deployment complete.");
        console.log("Telebuzzy implementation address:");
        console.log(IMPLEMENTATION_ADDRESS_TELEBUZZY);
        console.log("Telebuzzy PROXY address -- set NEXT_PUBLIC_CONTRACT_ADDRESS to this:");
        console.log(CONTRACT_ADDRESS_TELEBUZZY);
    }
}
