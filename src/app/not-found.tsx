import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#B8C4B8] p-4 sm:p-8 flex items-center justify-center font-sans antialiased text-[#121417]">
      <div className="w-full max-w-lg bg-white rounded-[36px] shadow-canvas border border-black/5 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E8F876] text-[#121417] flex items-center justify-center font-extrabold text-2xl shadow-sm">
          ✦
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Error 404
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121417]">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            The campus facility or destination you were looking for doesn't exist or has moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/app"
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-full bg-[#121417] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Campus Dashboard</span>
          </Link>
          <Link
            href="/offline"
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-full bg-[#F4F5F2] hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span>Offline Screen</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
