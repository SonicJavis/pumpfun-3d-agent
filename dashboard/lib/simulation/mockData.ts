import type {
  PumpToken,
  Trade,
  Portfolio,
  PortfolioPosition,
  SimulationStats,
  EquityPoint,
} from "@/types";

// ─── Tokens ──────────────────────────────────────────────────────────────────

export const MOCK_TOKENS: PumpToken[] = [
  {
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "BONK Killer",
    symbol: "BKILL",
    description: "The ultimate BONK killer. 100x incoming.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 12,
    marketCap: 84200,
    priceUsd: 0.0000842,
    volume24h: 45600,
    priceChange1h: 23.4,
    priceChange24h: 187.2,
    holders: 312,
    bondingCurveProgress: 62,
    isGraduated: false,
  },
  {
    mint: "3HZvHwmYRrYCvtASeFyqxBExaZBCMy1NJWM5L7SqM9Ps",
    name: "Moon Rabbit",
    symbol: "MRAB",
    description: "Rabbits go to the moon. LFG.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 34,
    marketCap: 212000,
    priceUsd: 0.000212,
    volume24h: 98100,
    priceChange1h: -4.1,
    priceChange24h: 64.8,
    holders: 891,
    bondingCurveProgress: 88,
    isGraduated: false,
  },
  {
    mint: "5PV2hFbeHdCtJdUb8uFhBfuJhsEqYYRrPuFHqEfrmjUB",
    name: "Solana Cat",
    symbol: "SCAT",
    description: "Cats love Solana. Solana loves cats.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 3,
    marketCap: 9800,
    priceUsd: 0.0000098,
    volume24h: 12300,
    priceChange1h: 112.3,
    priceChange24h: 112.3,
    holders: 47,
    bondingCurveProgress: 8,
    isGraduated: false,
  },
  {
    mint: "9pTGMhYfEroNSQbYFXXDvBN3MSFMNE3SXtTpgd9fmpVh",
    name: "DegenApe Revival",
    symbol: "DAPE",
    description: "DegenApes never die.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    marketCap: 1400000,
    priceUsd: 0.0014,
    volume24h: 320000,
    priceChange1h: 1.2,
    priceChange24h: -12.4,
    holders: 4200,
    bondingCurveProgress: 100,
    isGraduated: true,
  },
  {
    mint: "BgRGY9D7sUVhPL7SnCcJJK9c2Ky8E3iN4pUqVeJwfVwQ",
    name: "Pepe Classic",
    symbol: "PEPEC",
    description: "The original Pepe. Not the frog.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 47,
    marketCap: 510000,
    priceUsd: 0.00051,
    volume24h: 178000,
    priceChange1h: 8.7,
    priceChange24h: 38.5,
    holders: 2134,
    bondingCurveProgress: 95,
    isGraduated: false,
  },
  {
    mint: "CqV5hRQpKmDPYhTe1JpnFi3c6x7TRwKbGmAtNDRbsmMj",
    name: "Wojak Finance",
    symbol: "WOJAK",
    description: "For the wojaks who bought the top.",
    imageUri: "",
    createdAt: Date.now() - 1000 * 60 * 90,
    marketCap: 67000,
    priceUsd: 0.000067,
    volume24h: 23400,
    priceChange1h: -18.3,
    priceChange24h: -44.2,
    holders: 289,
    bondingCurveProgress: 53,
    isGraduated: false,
  },
];

// ─── Trades ──────────────────────────────────────────────────────────────────

export const MOCK_TRADE_HISTORY: Trade[] = [
  {
    id: "trade-001",
    tokenMint: "9pTGMhYfEroNSQbYFXXDvBN3MSFMNE3SXtTpgd9fmpVh",
    tokenSymbol: "DAPE",
    tokenName: "DegenApe Revival",
    direction: "buy",
    amountSol: 0.5,
    amountUsd: 75,
    priceUsd: 0.00112,
    status: "simulated",
    timestamp: Date.now() - 1000 * 60 * 90,
    pnlUsd: 24.5,
    pnlPercent: 32.6,
    reasoning: "High volume spike with strong bonding curve progress. Holder count growing rapidly.",
    confidence: 0.78,
    riskScore: 5.2,
  },
  {
    id: "trade-002",
    tokenMint: "BgRGY9D7sUVhPL7SnCcJJK9c2Ky8E3iN4pUqVeJwfVwQ",
    tokenSymbol: "PEPEC",
    tokenName: "Pepe Classic",
    direction: "buy",
    amountSol: 0.3,
    amountUsd: 45,
    priceUsd: 0.00038,
    status: "simulated",
    timestamp: Date.now() - 1000 * 60 * 60,
    pnlUsd: 16.2,
    pnlPercent: 36.0,
    reasoning: "Meme meta alignment strong. Bonding curve at 95%, graduation likely imminent.",
    confidence: 0.71,
    riskScore: 6.1,
  },
  {
    id: "trade-003",
    tokenMint: "CqV5hRQpKmDPYhTe1JpnFi3c6x7TRwKbGmAtNDRbsmMj",
    tokenSymbol: "WOJAK",
    tokenName: "Wojak Finance",
    direction: "buy",
    amountSol: 0.2,
    amountUsd: 30,
    priceUsd: 0.000091,
    status: "simulated",
    timestamp: Date.now() - 1000 * 60 * 45,
    pnlUsd: -8.4,
    pnlPercent: -28.0,
    reasoning: "Volume pattern matched entry criteria but sentiment turned negative.",
    confidence: 0.62,
    riskScore: 7.4,
  },
  {
    id: "trade-004",
    tokenMint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    tokenSymbol: "BKILL",
    tokenName: "BONK Killer",
    direction: "buy",
    amountSol: 0.4,
    amountUsd: 60,
    priceUsd: 0.0000612,
    status: "pending_approval",
    timestamp: Date.now() - 1000 * 60 * 2,
    reasoning: "1h price up 23.4%, holder growth rate 42/hr. Bonding curve momentum positive.",
    confidence: 0.74,
    riskScore: 5.8,
  },
];

// ─── Portfolio ────────────────────────────────────────────────────────────────

export const MOCK_PORTFOLIO: Portfolio = {
  solBalance: 9.1,
  usdBalance: 1365,
  startingUsd: 1500,
  positions: [
    {
      tokenMint: "9pTGMhYfEroNSQbYFXXDvBN3MSFMNE3SXtTpgd9fmpVh",
      tokenSymbol: "DAPE",
      tokenName: "DegenApe Revival",
      amountTokens: 66964,
      costBasisUsd: 75,
      currentValueUsd: 99.5,
      unrealizedPnlUsd: 24.5,
      unrealizedPnlPercent: 32.6,
      entryPrice: 0.00112,
      currentPrice: 0.001485,
    },
    {
      tokenMint: "BgRGY9D7sUVhPL7SnCcJJK9c2Ky8E3iN4pUqVeJwfVwQ",
      tokenSymbol: "PEPEC",
      tokenName: "Pepe Classic",
      amountTokens: 118421,
      costBasisUsd: 45,
      currentValueUsd: 61.2,
      unrealizedPnlUsd: 16.2,
      unrealizedPnlPercent: 36.0,
      entryPrice: 0.00038,
      currentPrice: 0.000517,
    },
  ],
  totalValueUsd: 1525.7,
  totalPnlUsd: 25.7,
  totalPnlPercent: 1.71,
};

// ─── Simulation Stats ─────────────────────────────────────────────────────────

export const MOCK_STATS: SimulationStats = {
  totalTrades: 3,
  winningTrades: 2,
  losingTrades: 1,
  winRate: 0.667,
  totalPnlUsd: 32.3,
  totalPnlPercent: 2.15,
  maxDrawdownPercent: 1.87,
  sharpeRatio: 1.42,
  avgTradeReturnPercent: 13.5,
  bestTradeUsd: 24.5,
  worstTradeUsd: -8.4,
  avgHoldTimeSeconds: 1800,
};

// ─── Equity Curve ─────────────────────────────────────────────────────────────

function generateEquityCurve(): EquityPoint[] {
  const points: EquityPoint[] = [];
  let value = 1500;
  const now = Date.now();
  const intervals = 48; // 48 half-hour ticks = 24 hours
  for (let i = intervals; i >= 0; i--) {
    const change = (Math.random() - 0.45) * 15;
    value = Math.max(value + change, 1200);
    points.push({
      timestamp: now - i * 30 * 60 * 1000,
      valueUsd: parseFloat(value.toFixed(2)),
      pnlUsd: parseFloat((value - 1500).toFixed(2)),
    });
  }
  return points;
}

export const MOCK_EQUITY_CURVE: EquityPoint[] = generateEquityCurve();
