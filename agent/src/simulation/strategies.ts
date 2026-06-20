/**
 * Scoring strategies used by the simulation agent to evaluate tokens.
 * Each strategy returns a score 0–1 and a human-readable rationale.
 */
import type { PumpToken } from "../types";

export interface SignalResult {
  score: number; // 0–1
  rationale: string;
}

/**
 * Momentum strategy: rewards high 1h price change + growing bonding curve.
 */
export function momentumStrategy(token: PumpToken): SignalResult {
  const momentumScore = Math.min(token.priceChange1h / 100, 1);
  const bondingScore = token.bondingCurveProgress / 100;
  const score = Math.max(0, momentumScore * 0.6 + bondingScore * 0.4);
  return {
    score,
    rationale: `1h momentum +${token.priceChange1h.toFixed(1)}%, bonding curve at ${token.bondingCurveProgress}%`,
  };
}

/**
 * Volume strategy: rewards high volume relative to market cap.
 */
export function volumeStrategy(token: PumpToken): SignalResult {
  const ratio = token.marketCap > 0 ? token.volume24h / token.marketCap : 0;
  const score = Math.min(ratio / 2, 1); // ratio of 2x = full score
  return {
    score,
    rationale: `Volume/MCap ratio ${ratio.toFixed(2)}x (vol ${token.volume24h.toFixed(0)}, mcap ${token.marketCap.toFixed(0)})`,
  };
}

/**
 * Holder growth strategy: rewards tokens with high holder count growth.
 */
export function holderStrategy(token: PumpToken): SignalResult {
  // Normalise: 1000 holders = full score
  const score = Math.min(token.holders / 1000, 1);
  return {
    score,
    rationale: `${token.holders} holders (${score >= 0.5 ? "strong" : "early"} community)`,
  };
}

/**
 * Risk score (0–10): higher = riskier. Penalises very new tokens, low holders.
 */
export function computeRiskScore(token: PumpToken): number {
  const ageMs = Date.now() - token.createdAt;
  const ageMins = ageMs / 1000 / 60;
  const agePenalty = Math.max(0, 5 - ageMins / 10); // penalty fades after 50 min
  const holderBonus = Math.min(token.holders / 500, 2);
  return Math.min(10, Math.max(1, 8 - holderBonus + agePenalty));
}

/**
 * Combined entry signal: weighted average of all strategies.
 */
export function evaluateToken(token: PumpToken): {
  confidence: number;
  riskScore: number;
  reasoning: string;
} {
  const momentum = momentumStrategy(token);
  const volume = volumeStrategy(token);
  const holders = holderStrategy(token);

  const confidence = momentum.score * 0.5 + volume.score * 0.3 + holders.score * 0.2;
  const riskScore = computeRiskScore(token);

  const reasoning = [
    momentum.rationale,
    volume.rationale,
    holders.rationale,
  ].join(". ");

  return { confidence, riskScore, reasoning };
}
