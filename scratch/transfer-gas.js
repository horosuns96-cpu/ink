const { createWalletClient, http, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { defineChain } = require('viem');

const inkSepiaChain = defineChain({
  id: 763373,
  name: 'Ink Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-gel-sepolia.inkonchain.com'],
    },
    public: {
      http: ['https://rpc-gel-sepolia.inkonchain.com'],
    },
  },
  testnet: true,
});

const PRIVATE_KEY = '0xaf03d7032c778d5d4fcf6a48b5ef7b97f555386af79ec186d4a449e0fdb6db9e';
const DESTINATION = '0xde47eF7f439b445e82dcBb75F94f322d04C1C806';
// Revised amount because factory balance is ~0.0099 ETH
const AMOUNT = '0.007';

async function transfer() {
  const account = privateKeyToAccount(PRIVATE_KEY);
  const client = createWalletClient({
    account,
    chain: inkSepiaChain,
    transport: http(),
  });

  console.log(`Transferring ${AMOUNT} ETH from ${account.address} to ${DESTINATION}...`);
  
  try {
    const hash = await client.sendTransaction({
      to: DESTINATION,
      value: parseEther(AMOUNT),
    });
    console.log(`Transaction sent! Transaction Hash: ${hash}`);
    console.log(`Check it here: https://explorer-sepolia.inkonchain.com/tx/${hash}`);
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}

transfer();
