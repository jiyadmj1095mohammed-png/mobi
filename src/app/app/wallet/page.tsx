import WalletOverview from "@/features/wallet/WalletOverview";
import TransactionHistory from "@/features/wallet/TransactionHistory";

export default function MobiWalletPage() {
  return (
    <div className="space-y-6 font-sans text-[#181514]">
      {/* Header Banner */}
      <div className="bg-[#FAF3E0] border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#EEA827] text-black border border-black shadow-[1.5px_1.5px_0px_#000]">
              MOBI WALLET
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1D838F] text-white border border-black">
              ✦ DUAL UTILITY LEDGER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Balances & Rewards
          </h1>
          <p className="text-xs sm:text-sm font-bold text-stone-600 mt-1">
            Dual segregated student utility balances for event discounts and civic chat access.
          </p>
        </div>
      </div>

      <WalletOverview />
      <TransactionHistory />
    </div>
  );
}
