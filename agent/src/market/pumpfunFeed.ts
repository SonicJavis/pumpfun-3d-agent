/**
 * Simulated pump.fun market data feed.
 * In a real deployment this would connect to the pump.fun WebSocket API
 * and/or poll the Solana RPC for on-chain token data.
 */
import type { PumpToken } from "../types";

const BASE_TOKENS: PumpToken[] = [
  {
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "BONK Killer",
    symbol: "BKILL",
    priceUsd: 0.0000842,
    marketCap: 84200,
    volume24h: 45600,
    priceChange1h: 23.4,
    priceChange24h: 187.2,
    holders: 312,
    bondingCurveProgress: 62,
    isGraduated: false,
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    mint: "3HZvHwmYRrYCvtASeFyqxBExaZBCMy1NJWM5L7SqM9Ps",
    name: "Moon Rabbit",
    symbol: "MRAB",
    priceUsd: 0.000212,
    marketCap: 212000,
    volume24h: 98100,
    priceChange1h: -4.1,
    priceChange24h: 64.8,
    holders: 891,
    bondingCurveProgress: 88,
    isGraduated: false,
    createdAt: Date.now() - 1000 * 60 * 34,
  },
  {
    mint: "5PV2hFbeHdCtJdUb8uFhBfuJhsEqYYRrPuFHqEfrmjUB",
    name: "Solana Cat",
    symbol: "SCAT",
    priceUsd: 0.0000098,
    marketCap: 9800,
    volume24h: 12300,
    priceChange1h: 112.3,
    priceChange24h: 112.3,
    holders: 47,
    bondingCurveProgress: 8,
    isGraduated: false,
    createdAt: Date.now() - 1000 * 60 * 3,
  },
  {
    mint: "9pTGMhYfEroNSQbYFXXDvBN3MSFMNE3SXtTpgd9fmpVh",
    name: "DegenApe Revival",
    symbol: "DAPE",
    priceUsd: 0.0014,
    marketCap: 1400000,
    volume24h: 320000,
    priceChange1h: 1.2,
    priceChange24h: -12.4,
    holders: 4200,
    bondingCurveProgress: 100,
    isGraduated: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    mint: "BgRGY9D7sUVhPL7SnCcJJK9c2Ky8E3iN4pUqVeJwfVwQ",
    name: "Pepe Classic",
    symbol: "PEPEC",
    priceUsd: 0.00051,
    marketCap: 510000,
    volume24h: 178000,
    priceChange1h: 8.7,
    priceChange24h: 38.5,
    holders: 2134,
    bondingCurveProgress: 95,
    isGraduated: false,
    createdAt: Date.now() - 1000 * 60 * 47,
  },
];

/** Apply a small random walk to each token's price on every tick. */
function tickToken(token: PumpToken): PumpToken {
  const pctChange = (Math.random() - 0.48) * 2.5; // slight upward bias
  const newPrice = Math.max(token.priceUsd * (1 + pctChange / 100), 1e-10);
  const newMcap = token.marketCap * (1 + pctChange / 100);
  const newVolume = token.volume24h * (0.98 + Math.random() * 0.04);
  const newProgress = Math.min(
    100,
    token.bondingCurveProgress + (Math.random() < 0.1 ? Math.random() * 2 : 0)
  );
  return {
    ...token,
    priceUsd: newPrice,
    marketCap: newMcap,
    volume24h: newVolume,
    priceChange1h: token.priceChange1h * 0.9 + pctChange * 0.1,
    bondingCurveProgress: newProgress,
    isGraduated: newProgress >= 100 ? true : token.isGraduated,
    holders: token.holders + (Math.random() < 0.15 ? Math.floor(Math.random() * 5) : 0),
  };
}

export class MarketFeed {
  private tokens: PumpToken[];
  private listeners: ((tokens: PumpToken[]) => void)[] = [];
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.tokens = [...BASE_TOKENS];
  }

  getTokens(): PumpToken[] {
    return this.tokens;
  }

  getToken(mint: string): PumpToken | undefined {
    return this.tokens.find((t) => t.mint === mint);
  }

  onUpdate(cb: (tokens: PumpToken[]) => void): void {
    this.listeners.push(cb);
  }

  start(tickMs = 3000): void {
    this.intervalId = setInterval(() => {
      this.tokens = this.tokens.map(tickToken);
      for (const cb of this.listeners) cb(this.tokens);
    }, tickMs);
    console.log(`[MarketFeed] Started — ticking every ${tickMs}ms`);
  }

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
