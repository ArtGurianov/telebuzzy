export const bleadContractAbi = [
  {
    type: "function",
    name: "getFeesTokenDetails",
    inputs: [],
    outputs: [
      {
        name: "_feesTokenDetails",
        type: "tuple",
        internalType: "struct IMyDaogsDividends.FeesTokenDetails",
        components: [
          { name: "tokenAddress", type: "address", internalType: "address" },
          { name: "decimals", type: "uint8", internalType: "uint8" },
          { name: "symbol", type: "string", internalType: "string" },
          { name: "name", type: "string", internalType: "string" },
          {
            name: "minClaimableUnitsAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "FEES_TOKEN_MONTHLY_PRICE",
    stateMutability: "view",
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "FEES_TOKEN_ANNUAL_PRICE",
    stateMutability: "view",
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getSubscriptionData",
    inputs: [{ name: "userIdHash", type: "bytes32", internalType: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Blead.SubscriptionData",
        components: [
          {
            name: "subscriptionStartTimestamp",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "subscriptionEndTimestamp",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateSubscription",
    inputs: [
      { name: "userEmailHash", type: "bytes32", internalType: "bytes32" },
      {
        name: "plan",
        type: "uint8",
        internalType: "enum Blead.SubscriptionPlan",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const usdContractAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;
