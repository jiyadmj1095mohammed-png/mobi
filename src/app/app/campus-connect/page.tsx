import AnnouncementsFeed from "@/features/campus-connect/AnnouncementsFeed";

export default function CampusConnectPage() {
  return (
    <div className="space-y-6 font-sans text-[#121417]">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          CAMPUS NOTICES
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121417] mt-0.5">
          Campus Bulletin
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Official circulars, bus schedules, and campus facility notices.
        </p>
      </div>

      <AnnouncementsFeed />
    </div>
  );
}
