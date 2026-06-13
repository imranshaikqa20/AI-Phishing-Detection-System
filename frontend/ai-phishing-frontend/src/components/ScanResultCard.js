"use client";

export default function ScanResultCard({ result, metrics, dark = true }) {

  if (!result) return null;

  // RISK HELPERS
  const getRiskLevel = (score) => {
    if (score >= 80) return "Critical";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    return "Low";
  };

  const riskTextColor = (score) => {
    if (score >= 80) return "text-red-400";
    if (score >= 50) return "text-orange-400";
    if (score >= 30) return "text-yellow-400";
    return "text-green-400";
  };

  const riskBarGradient = (score) => {
    if (score >= 80) return "from-red-600 to-red-500";
    if (score >= 50) return "from-orange-600 to-orange-400";
    if (score >= 30) return "from-yellow-600 to-yellow-400";
    return "from-green-600 to-green-400";
  };

  const riskBadge = (level) => {
    switch (level) {
      case "Critical": return dark ? "bg-red-600/20 text-red-300" : "bg-red-100 text-red-700";
      case "High": return dark ? "bg-red-500/20 text-red-300" : "bg-orange-100 text-orange-700";
      case "Medium": return dark ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700";
      default: return dark ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700";
    }
  };

  const score = result.overallRiskScore ?? 0;
  const riskLevel = getRiskLevel(score);

  // THEME TOKENS
  const card = dark
    ? "bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl space-y-6"
    : "bg-white border border-gray-200 rounded-3xl p-7 shadow-xl space-y-6";

  const verdictLabel = dark
    ? "text-white/40 text-xs uppercase tracking-widest mb-1"
    : "text-gray-400 text-xs uppercase tracking-widest mb-1";

  const metaCard = dark
    ? "bg-black/30 rounded-2xl p-4 text-center"
    : "bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center";

  const metaLabel = dark ? "text-white/40 text-xs mb-1" : "text-gray-400 text-xs mb-1";

  const riskBarBg = dark
    ? "bg-white/10 rounded-full h-2 overflow-hidden"
    : "bg-gray-200 rounded-full h-2 overflow-hidden";

  const summaryToggle = dark
    ? "cursor-pointer text-xs text-cyan-400 hover:text-cyan-300 transition font-medium select-none"
    : "cursor-pointer text-xs text-cyan-600 hover:text-cyan-500 transition font-medium select-none";

  const summaryText = dark
    ? "whitespace-pre-wrap text-white/60 text-xs leading-relaxed font-sans"
    : "whitespace-pre-wrap text-gray-600 text-xs leading-relaxed font-sans";

  const summaryBg = dark
    ? "mt-3 bg-black/30 rounded-xl p-4"
    : "mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100";

  return (
    <div className={card}>

      {/* VERDICT + SCORE */}
      <div className="flex items-center justify-between">
        <div>
          <p className={verdictLabel}>Verdict</p>
          <h2 className={`text-4xl font-bold ${result.verdict === "PHISHING" ? "text-red-400" : "text-green-400"}`}>
            {result.verdict}
          </h2>
        </div>
        <div className="text-right">
          <p className={verdictLabel}>Risk Score</p>
          <div className={`text-5xl font-bold ${riskTextColor(score)}`}>
            {score}
          </div>
        </div>
      </div>

      {/* RISK BAR */}
      <div className={riskBarBg}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${riskBarGradient(score)} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* META ROW */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Scan Type", value: result.inputType || "TEXT", color: "text-cyan-400" },
          { label: "AI Engine", value: "Gemini AI", color: "text-purple-400" },
          { label: "Threat Level", value: riskLevel, color: riskTextColor(score) },
        ].map((m) => (
          <div key={m.label} className={metaCard}>
            <p className={metaLabel}>{m.label}</p>
            <p className={`font-bold text-sm ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* RISK BADGE */}
      <div>
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${riskBadge(riskLevel)}`}>
          {riskLevel} Risk
        </span>
      </div>

      {/* AI SUMMARY */}
      {result.aiSummary && (
        <details>
          <summary className={summaryToggle}>
            View Full AI Analysis ▸
          </summary>
          <div className={summaryBg}>
            <pre className={summaryText}>{result.aiSummary}</pre>
          </div>
        </details>
      )}

      {/* SUBSCRIPTION METRICS */}
      {metrics && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Plan",
              value: metrics.isPro ? "PRO" : "FREE",
              color: metrics.isPro ? "text-yellow-400" : dark ? "text-white" : "text-gray-900",
            },
            { label: "Scans Today", value: metrics.scansToday, color: "text-cyan-400"  },
            { label: "Remaining", value: metrics.isPro ? "∞" : metrics.remainingScans, color: "text-green-400" },
          ].map((m) => (
            <div key={m.label} className={metaCard}>
              <p className={metaLabel}>{m.label}</p>
              <p className={`font-bold text-lg ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}