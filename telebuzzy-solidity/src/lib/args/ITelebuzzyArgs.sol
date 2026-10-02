// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

interface ITelebuzzyArgs {
    struct TelebuzzyArgs {
        address _dividendsContractAddress;
        uint256 _feesTokenMonthlyPrice;
        uint256 _feesTokenAnnualPrice;
    }
}
