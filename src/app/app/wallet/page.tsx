import WalletOverview from "@/features/wallet/WalletOverview";
import TransactionHistory from "@/features/wallet/TransactionHistory";

export default function MobiWalletPage() {
  return (
    <div className="space-y-6 font-sans text-[#121417]">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          MOBI WALLET
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] mt-0.5">
          Balances & Rewards
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dual segregated utility ledger for event discounts and civic chat access.
        </p>
      </div>

      <WalletOverview />
      <TransactionHistory />
    </div>
  );
}
