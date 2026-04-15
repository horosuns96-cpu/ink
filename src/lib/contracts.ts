export const INK_FACTORY_ADDRESS = "0x0BEb9438A24d119d600158F2CB829F461f5eFf5C";

export const FACTORY_ADDRESSES: Record<number, `0x${string}` | null> = {
  763373: "0x0BEb9438A24d119d600158F2CB829F461f5eFf5C", // Ink Sepolia
  84532: "0xe584C914413457cd7b6a310a17A449135415F1c3", // Base Sepolia
};

export const CHAIN_EXPLORERS: Record<number, string> = {
  763373: 'https://explorer-sepolia.inkonchain.com',
  84532: 'https://sepolia.basescan.org',
};

export const SUPPORTED_CHAIN_IDS = [763373, 84532] as const;

export function getFactoryAddress(chainId: number): `0x${string}` | null {
  return FACTORY_ADDRESSES[chainId] ?? null;
}

export function getExplorerUrl(chainId: number): string {
  return CHAIN_EXPLORERS[chainId] ?? 'https://explorer-sepolia.inkonchain.com';
}

export const INK_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "TokenCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeployedTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deployedTokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
