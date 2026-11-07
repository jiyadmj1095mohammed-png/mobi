import Link from "next/link";
import { Leaf, MapPin, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#06251D] text-emerald-100/80 border-t border-emerald-500/20 font-sans pt-12 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                <Leaf className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">MOBI</span>
              <span className="text-xs text-emerald-400 font-semibold">Evergreen Future Campus</span>
            </div>

            <p className="text-xs text-emerald-200/70 max-w-md leading-relaxed">
              MOBI is a student-powered digital campus ecosystem uniting interactive 3D navigation, verified waste segregation, ticket coin discounts, and respectful peer communication for MEA Engineering College.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>MEA Engineering College, Perinthalmanna, Kerala</span>
            </div>
          </div>

          {/* Six Integrated Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Campus Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/app/eco" className="hover:text-emerald-300 transition-colors">
                  MOBI ECO (Waste Management)
                </Link>
              </li>
              <li>
                <Link href="/app/map" className="hover:text-emerald-300 transition-colors">
                  MOBI MAP (3D Campus Nav)
                </Link>
              </li>
              <li>
                <Link href="/app/events" className="hover:text-emerald-300 transition-colors">
                  MOBI EVENTS (Registrations & Discounts)
                </Link>
              </li>
              <li>
                <Link href="/app/connect" className="hover:text-emerald-300 transition-colors">
                  MOBI CONNECT (Random Peer Chat)
                </Link>
              </li>
              <li>
                <Link href="/app/wallet" className="hover:text-emerald-300 transition-colors">
                  MOBI WALLET (Segregated Ledger)
                </Link>
              </li>
              <li>
                <Link href="/app/campus-connect" className="hover:text-emerald-300 transition-colors">
                  CAMPUS CONNECT (Notices & News)
                </Link>
              </li>
            </ul>
          </div>

          {/* Principles & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Governance & Safety
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/70">
              <li>Made by Students. For Students.</li>
              <li>Strict Currency Segregation</li>
              <li>Civic Courtesy Gatekeeping</li>
              <li>Ground Truth Geographical Survey</li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/60 gap-4">
          <div>
            © {new Date().getFullYear()} MOBI — Evergreen Future Campus. One Campus. One Community. A Better Tomorrow.
          </div>
          <div className="flex items-center gap-1 text-emerald-300/80">
            <span>Built with care for MEA Engineering College</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
