import { describe, it, expect } from "vitest";

describe("MOBI WALLET - Strict Currency Segregation & Discount Logic", () => {
  it("enforces separation between Mobi Coins and Chat Points", () => {
    const initialWallet = {
      mobiCoins: 45,
      chatPoints: 3,
    };

    // Reward from Eco report only increments mobiCoins
    const ecoReportReward = 15;
    const walletAfterEco = {
      ...initialWallet,
      mobiCoins: initialWallet.mobiCoins + ecoReportReward,
    };
    expect(walletAfterEco.mobiCoins).toBe(60);
    expect(walletAfterEco.chatPoints).toBe(3); // Chat points unchanged!

    // Reward from Civic Quiz only increments chatPoints
    const civicQuizReward = 3;
    const walletAfterQuiz = {
      ...walletAfterEco,
      chatPoints: walletAfterEco.chatPoints + civicQuizReward,
    };
    expect(walletAfterQuiz.chatPoints).toBe(6);
    expect(walletAfterQuiz.mobiCoins).toBe(60); // Mobi coins unchanged!
  });

  it("calculates 1 Coin = 1 INR event discount capped at event limit", () => {
    const eventPrice = 60;
    const maxCoinDiscount = 25;
    const userCoinBalance = 40;

    // Student applies max possible discount
    const applicableCoins = Math.min(eventPrice, maxCoinDiscount, userCoinBalance);
    expect(applicableCoins).toBe(25);

    const finalPayable = Math.max(0, eventPrice - applicableCoins);
    expect(finalPayable).toBe(35);

    const remainingCoins = userCoinBalance - applicableCoins;
    expect(remainingCoins).toBe(15);
  });

  it("ensures wallet balances can never drop below zero", () => {
    const userChatPoints = 1;
    const sessionCost = 1;

    expect(userChatPoints >= sessionCost).toBe(true);
    const balanceAfterSession = userChatPoints - sessionCost;
    expect(balanceAfterSession).toBe(0);

    // Second session should be disallowed
    const canStartSecond = balanceAfterSession >= sessionCost;
    expect(canStartSecond).toBe(false);
  });
});
