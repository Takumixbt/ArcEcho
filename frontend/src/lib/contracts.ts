export const ACCESS_GATE_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ACCESS_GATE_ABI = [
  {
    type: "function",
    name: "buy",
    inputs: [{ name: "contentId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rent",
    inputs: [{ name: "contentId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasAccess",
    inputs: [
      { name: "contentId", type: "uint256", internalType: "uint256" },
      { name: "user", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "nextContentId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "contents",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "creator", type: "address", internalType: "address" },
      { name: "buyPrice", type: "uint256", internalType: "uint256" },
      { name: "rentPrice", type: "uint256", internalType: "uint256" },
      { name: "rentDuration", type: "uint256", internalType: "uint256" },
      { name: "contentURI", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "list",
    inputs: [
      { name: "buyPrice", type: "uint256", internalType: "uint256" },
      { name: "rentPrice", type: "uint256", internalType: "uint256" },
      { name: "rentDuration", type: "uint256", internalType: "uint256" },
      { name: "contentURI", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "contentId", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "boughtAccess",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rentExpiry",
    inputs: [
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Bought",
    inputs: [
      { name: "contentId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "buyer", type: "address", indexed: true, internalType: "address" },
      { name: "amountPaid", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Rented",
    inputs: [
      { name: "contentId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "renter", type: "address", indexed: true, internalType: "address" },
      { name: "amountPaid", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "expiresAt", type: "uint256", indexed: false, internalType: "uint256" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ContentListed",
    inputs: [
      { name: "contentId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "creator", type: "address", indexed: true, internalType: "address" },
      { name: "buyPrice", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "rentPrice", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "rentDuration", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "contentURI", type: "string", indexed: false, internalType: "string" },
    ],
    anonymous: false,
  },
] as const;
