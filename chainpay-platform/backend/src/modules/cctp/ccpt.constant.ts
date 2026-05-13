export const CCTP_ROUTES: Record<string, string[]> = {
  "MATIC-AMOY": ["ETH-SEPOLIA", "AVAX-FUJI"],
  "ETH-SEPOLIA": ["MATIC-AMOY", "AVAX-FUJI"],
  "AVAX-FUJI": ["MATIC-AMOY", "ETH-SEPOLIA"],
};

export const USDC_ADDRESSES: Record<string, string> = {
  "MATIC-AMOY": "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582",
  "ETH-SEPOLIA": "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  "AVAX-FUJI": "0x5425890298aed601595a70ab815c96711a31bc65",
};
