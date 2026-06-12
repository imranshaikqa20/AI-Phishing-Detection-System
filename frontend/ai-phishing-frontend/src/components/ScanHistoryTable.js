"use client";

export default function ScanHistoryTable({ history = [], dark = true, limit = 15 }) {

  // RISK HELPERS
  const getRiskLevel = (score) => {
    if (score >= 80) return "Critical";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case "Critical": return dark ? "bg-red-600/20 text-red-300" : "bg-red-100 text-red-700";
      case "High": return dark ? "bg-red-500/20 text-red-300" : "bg-orange-100 text-orange-700";
      case "Medium": return dark ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700";
      default: return dark ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700";
    }
  };

  // THEME TOKENS
  const wrapper = dark
    ? "bg-zinc-900/80 backdrop-blur-md rounded-2xl p-6"
    : "bg-white rounded-2xl p-6 shadow-sm border border-gray-100";

  const emptyText = dark ? "text-sm text-white/30" : "text-sm text-gray-400";

  const row = dark
    ? "flex flex-col md:flex-row md:items-center gap-3 bg-black/30 rounded-xl p-4"
    : "flex flex-col md:flex-row md:items-center gap-3 bg-gray-50 rounded-xl p-4";

  const typeBadge = dark
    ? "text-xs font-semibold px-2 py-0.5 rounded text-cyan-400 bg-cyan-500/10"
    : "text-xs font-semibold px-2 py-0.5 rounded text-cyan-600 bg-cyan-50";

  const timeText = dark ? "text-xs text-white/30" : "text-xs text-gray-400";
  const monoText = dark ? "text-white/70 text-sm font-mono truncate" : "text-gray-700 text-sm font-mono truncate";
  const scoreNum = dark ? "text-yellow-500 font-bold text-lg leading-none" : "text-yellow-600 font-bold text-lg leading-none";
  const scoreSub = dark ? "text-xs text-white/30" : "text-xs text-gray-400";

  const verdictBadge = (verdict) =>
    verdict === "PHISHING"
      ? "text-sm font-bold px-3 py-1 rounded-lg bg-red-500/20 text-red-400"
      : "text-sm font-bold px-3 py-1 rounded-lg bg-green-500/20 text-green-500";

  // EMPTY STATE
  if (!history.length) {
    return (
      <div className={wrapper}>
        <p className={emptyText}>No scan history found. Run your first scan above!</p>
      </div>
    );
  }

  const visible = history.slice(0, limit);

  // UI
  return (
    <div className={wrapper}>
      <div className="space-y-3">
        {visible.map((scan) => {
          const riskLevel = getRiskLevel(scan.overallRiskScore);
          const truncated =
            scan.rawContent?.length > 80
              ? scan.rawContent.slice(0, 80) + "…"
              : scan.rawContent;

          return (
            <div key={scan.id} className={row}>

              {/* LEFT — type + timestamp + content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={typeBadge}>{scan.inputType}</span>
                  <span className={timeText}>
                    {scan.scannedAt
                      ? new Date(scan.scannedAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <p className={monoText}>{truncated}</p>
              </div>

              {/* RIGHT — risk badge + score + verdict */}
              <div className="flex items-center gap-3 flex-shrink-0">

                {/* RISK BADGE */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getRiskBadge(riskLevel)}`}>
                  {riskLevel}
                </span>

                {/* SCORE */}
                <div className="text-center w-10">
                  <div className={scoreNum}>{scan.overallRiskScore}</div>
                  <div className={scoreSub}>score</div>
                </div>

                {/* VERDICT */}
                <span className={verdictBadge(scan.verdict)}>
                  {scan.verdict}
                </span>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}