import { useState, useMemo } from "react";
import {
  Target,
  Plus,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Zap,
  X,
  Check,
  AlertCircle,
  Wallet,
  BarChart2,
  RotateCcw,
  Pencil,
} from "lucide-react";

// ─── Keyword Maps ─────────────────────────────────────────────────────────────
const WANT_KEYWORDS = [
  "zomato",
  "swiggy",
  "uber",
  "ola",
  "rapido",
  "starbucks",
  "café",
  "cafe",
  "coffee",
  "boba",
  "bubble tea",
  "movie",
  "cinema",
  "netflix",
  "amazon prime",
  "hotstar",
  "game",
  "gadget",
  "amazon",
  "flipkart",
  "myntra",
  "alcohol",
  "beer",
  "wine",
  "whiskey",
  "pub",
  "bar",
  "club",
  "pizza",
  "burger",
  "kfc",
  "mcdonalds",
  "dominos",
  "ice cream",
  "dessert",
  "cake",
  "pastry",
  "bakery",
  "biscuit",
  "chocolate",
  "chips",
  "candy",
  "snack",
  "salon",
  "spa",
  "makeup",
  "clothes",
  "shirt",
  "sneakers",
  "shoes",
  "party",
  "cigarette",
  "tobacco",
  "shopping",
  "mall",
  "eat out",
  "restaurant",
  "dinner out",
  "lunch out",
  "biryani",
  "chinese",
  "sushi",
  "juice",
  "cold drink",
  "soda",
  "redbull",
  "energy drink",
  "panipuri",
  "chaat",
  "pani puri",
  "vada pav",
  "samosa",
  "maggi",
  "noodles",
  "ramen",
  "waffles",
  "pancake",
  "donut",
  "popcorn",
  "milkshake",
  "smoothie",
];
const NEED_KEYWORDS = [
  "metro",
  "bus",
  "auto",
  "train",
  "flight",
  "grocery",
  "vegetables",
  "fruits",
  "medicine",
  "doctor",
  "hospital",
  "electricity",
  "water",
  "rent",
  "school",
  "college",
  "fees",
  "fuel",
  "petrol",
  "milk",
  "rice",
  "dal",
  "ration",
  "insurance",
  "emi",
  "phone bill",
  "wifi",
  "internet",
  "transport",
  "commute",
  "recharge",
  "maintenance",
  "laundry",
  "repair",
  "stationary",
  "notebook",
  "textbook",
  "lab",
  "hostel",
];

// Category-specific alternatives
const ALTERNATIVES = {
  coffee: { saving: 280, tip: "Darshini filter coffee — ₹15 vs ₹300+" },
  zomato: { saving: 220, tip: "Tiffin service nearby: ₹80 vs ₹300+" },
  swiggy: { saving: 200, tip: "Batch cook Sunday — saves ₹200/order" },
  uber: { saving: 180, tip: "Auto/Rapido cuts cab cost 60–70%" },
  ola: { saving: 160, tip: "Namma Metro/BMTC — fraction of cab fare" },
  movie: { saving: 250, tip: "Matinee + B-tier multiplex = ₹100 vs ₹400" },
  shopping: { saving: 0, tip: "48h cart rule — delete and revisit tomorrow" },
  chocolate: { saving: 80, tip: "Dark chocolate bar from DMart: ₹20 vs ₹100+" },
  snack: { saving: 60, tip: "Home-packed snack or DMart brand — 70% cheaper" },
  drink: { saving: 70, tip: "Carry a bottle — skip the ₹80 cold drink" },
  icecream: { saving: 60, tip: "Kwality Walls from kirana vs café dessert" },
  biryani: { saving: 150, tip: "MTR/home-cooked biryani: ₹60 vs ₹220" },
  alcohol: { saving: 300, tip: "Skip the round — saves ₹300+ per outing" },
  salon: {
    saving: 200,
    tip: "Local barber / home kit — same result, ₹200 less",
  },
  default: {
    saving: 100,
    tip: "Check local market or kirana for cheaper option",
  },
};

function getAltKey(d) {
  if (d.includes("chocolate")) return "chocolate";
  if (
    d.includes("chips") ||
    d.includes("biscuit") ||
    d.includes("snack") ||
    d.includes("samosa") ||
    d.includes("vada") ||
    d.includes("chaat") ||
    d.includes("panipuri") ||
    d.includes("popcorn") ||
    d.includes("waffle") ||
    d.includes("pancake") ||
    d.includes("donut") ||
    d.includes("candy") ||
    d.includes("cake") ||
    d.includes("pastry") ||
    d.includes("maggi") ||
    d.includes("noodle")
  )
    return "snack";
  if (
    d.includes("ice cream") ||
    d.includes("icecream") ||
    d.includes("milkshake") ||
    d.includes("smoothie")
  )
    return "icecream";
  if (
    d.includes("soda") ||
    d.includes("cold drink") ||
    d.includes("redbull") ||
    d.includes("energy drink") ||
    d.includes("juice") ||
    d.includes("boba") ||
    d.includes("bubble tea")
  )
    return "drink";
  if (
    d.includes("biryani") ||
    d.includes("chinese") ||
    d.includes("sushi") ||
    d.includes("ramen") ||
    d.includes("pizza") ||
    d.includes("burger") ||
    d.includes("kfc") ||
    d.includes("mcdonalds") ||
    d.includes("dominos")
  )
    return "biryani";
  if (
    d.includes("coffee") ||
    d.includes("starbucks") ||
    d.includes("café") ||
    d.includes("cafe")
  )
    return "coffee";
  if (d.includes("zomato")) return "zomato";
  if (d.includes("swiggy")) return "swiggy";
  if (d.includes("uber")) return "uber";
  if (d.includes("ola") || d.includes("rapido")) return "ola";
  if (d.includes("movie") || d.includes("cinema")) return "movie";
  if (
    d.includes("shop") ||
    d.includes("mall") ||
    d.includes("myntra") ||
    d.includes("flipkart") ||
    d.includes("amazon")
  )
    return "shopping";
  if (
    d.includes("alcohol") ||
    d.includes("beer") ||
    d.includes("wine") ||
    d.includes("whiskey") ||
    d.includes("pub") ||
    d.includes("bar")
  )
    return "alcohol";
  if (d.includes("salon") || d.includes("spa") || d.includes("makeup"))
    return "salon";
  return "default";
}

function evaluateExpense(desc, userIntent) {
  const d = desc.toLowerCase();
  const isWant = WANT_KEYWORDS.some((k) => d.includes(k));
  const isNeed = NEED_KEYWORDS.some((k) => d.includes(k));
  let aiLabel = userIntent;
  if (isWant && !isNeed) aiLabel = "Want";
  if (isNeed && !isWant) aiLabel = "Need";
  const altData = aiLabel === "Want" ? ALTERNATIVES[getAltKey(d)] : null;
  return { aiLabel, conflict: aiLabel !== userIntent, altData };
}

const INSTRUMENTS = [
  {
    name: "Nifty 50 SIP",
    rate: 0.13,
    icon: "📈",
    type: "Long term",
    horizon: 12,
  },
  {
    name: "Liquid MF",
    rate: 0.065,
    icon: "💧",
    type: "Short term",
    horizon: 3,
  },
  {
    name: "Digital Gold",
    rate: 0.09,
    icon: "✨",
    type: "Medium term",
    horizon: 6,
  },
  { name: "RD / FD", rate: 0.072, icon: "🏦", type: "Safe", horizon: 12 },
];

function project(p, r, m) {
  return p * Math.pow(1 + r / 12, m);
}
const fmt = (n) => `₹${Number(Math.round(n)).toLocaleString("en-IN")}`;

// ─── Inline Editable Field ────────────────────────────────────────────────────
function EditableAmount({ label, value, onChange, color = "text-slate-100" }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState("");
  function start() {
    setTmp(String(value));
    setEditing(true);
  }
  function commit() {
    const v = parseFloat(tmp);
    if (!isNaN(v) && v >= 0) onChange(v);
    setEditing(false);
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500 text-xs">{label}</span>
      {editing ? (
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-xs">₹</span>
          <input
            autoFocus
            value={tmp}
            onChange={(e) => setTmp(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            className="bg-slate-800 border border-indigo-500 rounded-lg px-2 py-0.5 text-sm text-slate-100 outline-none w-28"
          />
        </div>
      ) : (
        <button
          onClick={start}
          className={`flex items-center gap-1 font-semibold text-sm ${color} hover:opacity-80 transition-opacity`}
        >
          {fmt(value)} <Pencil size={10} className="text-slate-600" />
        </button>
      )}
    </div>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ pct }) {
  const r = 54,
    circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="#1e293b"
        strokeWidth="10"
      />
      <circle
        cx="64"
        cy="64"
        r={r}
        fill="none"
        stroke="url(#grd)"
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <defs>
        <linearGradient id="grd" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <text
        x="64"
        y="60"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="20"
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {Math.min(Math.round(pct), 100)}%
      </text>
      <text
        x="64"
        y="78"
        textAnchor="middle"
        fill="#64748b"
        fontSize="11"
        fontFamily="sans-serif"
      >
        saved
      </text>
    </svg>
  );
}

// ─── Transaction Item ─────────────────────────────────────────────────────────
function TransactionItem({ tx, remaining }) {
  const [open, setOpen] = useState(false);
  const isWant = tx.aiLabel === "Want";
  const pctCloser =
    tx.altData && remaining > 0
      ? Math.min(Math.round((tx.altData.saving / remaining) * 100), 100)
      : 0;
  return (
    <div
      className={`rounded-xl border mb-2 overflow-hidden ${isWant ? "border-rose-800/50 bg-rose-950/20" : "border-emerald-800/40 bg-emerald-950/20"}`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => isWant && setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${isWant ? "bg-rose-900/60 text-rose-300" : "bg-emerald-900/60 text-emerald-300"}`}
          >
            {tx.aiLabel}
          </span>
          <div>
            <p className="text-slate-200 text-sm font-medium leading-tight">
              {tx.desc}
            </p>
            <p className="text-slate-500 text-xs">{tx.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-100 font-semibold text-sm">
            {fmt(tx.amount)}
          </span>
          {isWant &&
            (open ? (
              <ChevronUp size={14} className="text-slate-500" />
            ) : (
              <ChevronDown size={14} className="text-slate-500" />
            ))}
        </div>
      </div>
      {isWant && open && tx.altData && (
        <div className="px-4 pb-3 border-t border-rose-800/30 pt-3 space-y-2">
          <div className="flex items-start gap-2 bg-slate-800/60 rounded-lg p-3">
            <Zap size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-amber-300 text-xs font-semibold mb-0.5">
                Cheaper Alternative
              </p>
              <p className="text-slate-300 text-xs">{tx.altData.tip}</p>
              {tx.altData.saving > 0 && (
                <p className="text-emerald-400 text-xs mt-1 font-medium">
                  Save ~{fmt(tx.altData.saving)}
                </p>
              )}
            </div>
          </div>
          {pctCloser > 0 && (
            <p className="text-slate-400 text-xs pl-1">
              ⚡ Skipping this = goal {pctCloser}% closer
            </p>
          )}
          {tx.conflict && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <AlertCircle size={11} /> You marked "{tx.userIntent}" — AI
              disagrees
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Investment Nudge ─────────────────────────────────────────────────────────
function InvestmentNudge({ wantSaved }) {
  if (wantSaved <= 0) return null;
  return (
    <div
      style={{ background: "#0d1627", border: "1px solid #1e3a5f" }}
      className="rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <BarChart2 size={14} className="text-indigo-400" />
        <p className="text-slate-300 text-xs font-semibold tracking-wide uppercase">
          Accelerate Your Goal
        </p>
      </div>
      <p className="text-slate-400 text-xs mb-3">
        Invest{" "}
        <span className="text-emerald-300 font-semibold">{fmt(wantSaved)}</span>{" "}
        (your Want savings) instead:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {INSTRUMENTS.map((inst) => {
          const future = project(wantSaved, inst.rate, inst.horizon);
          const gain = future - wantSaved;
          return (
            <div
              key={inst.name}
              style={{ background: "#0f1f38", border: "1px solid #1e3a5f" }}
              className="rounded-xl p-3"
            >
              <p className="text-lg mb-1">{inst.icon}</p>
              <p className="text-slate-200 text-xs font-semibold leading-tight">
                {inst.name}
              </p>
              <p className="text-slate-500 text-xs mb-1">
                {inst.type} · {inst.horizon}mo
              </p>
              <p className="text-emerald-400 text-xs font-bold">
                {fmt(future)}
              </p>
              <p className="text-slate-500 text-xs">+{fmt(gain)} gain</p>
            </div>
          );
        })}
      </div>
      <p className="text-slate-600 text-xs mt-2 text-center">
        Indicative only. Past returns ≠ future.
      </p>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [goal, setGoal] = useState(50000);
  const [balance, setBalance] = useState(0);
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({ amount: "", desc: "", intent: "Need" });
  const [showForm, setShowForm] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [showReset, setShowReset] = useState(false);

  const totalSpent = useMemo(
    () => txns.reduce((s, t) => s + t.amount, 0),
    [txns],
  );
  const wantSaved = useMemo(
    () =>
      txns
        .filter((t) => t.aiLabel === "Want")
        .reduce((s, t) => s + (t.altData?.saving || 0), 0),
    [txns],
  );
  const pct = goal > 0 ? Math.min((balance / goal) * 100, 100) : 0;
  const remaining = Math.max(0, goal - balance);

  function handleAdd() {
    const amt = parseFloat(form.amount);
    if (!amt || !form.desc.trim()) return;
    const { aiLabel, conflict, altData } = evaluateExpense(
      form.desc,
      form.intent,
    );
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const tx = {
      id: Date.now(),
      desc: form.desc,
      amount: amt,
      userIntent: form.intent,
      aiLabel,
      conflict,
      altData,
      date: timeStr,
    };
    setTxns((t) => [tx, ...t]);
    setLastAdded(tx);
    setForm({ amount: "", desc: "", intent: "Need" });
    setShowForm(false);
  }

  function handleReset() {
    setTxns([]);
    setBalance(0);
    setGoal(50000);
    setLastAdded(null);
    setShowForm(false);
    setShowReset(false);
  }

  return (
    <div
      style={{
        background: "#0a0f1e",
        minHeight: "100vh",
        fontFamily: "'Inter',system-ui,sans-serif",
      }}
      className="flex justify-center py-6 px-3"
    >
      <div
        style={{ width: "100%", maxWidth: 390 }}
        className="flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Savings Tracker
            </p>
            <div className="flex items-center gap-1.5">
              <Target size={13} className="text-indigo-400 shrink-0" />
              <EditableAmount
                label="Goal:"
                value={goal}
                onChange={setGoal}
                color="text-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              style={{ border: "1px solid #1e3a5f" }}
              className="bg-slate-800/60 rounded-xl px-3 py-2 space-y-0.5"
            >
              <EditableAmount
                label="Balance"
                value={balance}
                onChange={setBalance}
                color="text-emerald-300"
              />
            </div>
            <button
              onClick={() => setShowReset(true)}
              className="w-8 h-8 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center hover:border-rose-700 transition-colors"
            >
              <RotateCcw size={13} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Reset confirm */}
        {showReset && (
          <div
            style={{ border: "1px solid #4c1d1d" }}
            className="bg-rose-950/30 rounded-xl px-4 py-3 flex items-center justify-between"
          >
            <p className="text-rose-300 text-xs font-semibold">
              Reset everything?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReset(false)}
                className="text-slate-400 text-xs px-3 py-1 rounded-lg bg-slate-800 border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="text-white text-xs px-3 py-1 rounded-lg bg-rose-700 border border-rose-600"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Progress Card */}
        <div
          style={{
            background: "linear-gradient(135deg,#0f172a 0%,#131f35 100%)",
            border: "1px solid #1e2d4a",
          }}
          className="rounded-2xl p-5 flex items-center gap-5"
        >
          <ProgressRing pct={pct} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-slate-500 text-xs mb-0.5">Current Balance</p>
              <p className="text-2xl font-bold text-slate-100">
                {fmt(balance)}
              </p>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-slate-500 text-xs">Remaining</p>
                <p className="text-slate-200 text-sm font-semibold">
                  {fmt(remaining)}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Total Spent</p>
                <p className="text-rose-300 text-sm font-semibold">
                  {fmt(totalSpent)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flash result */}
        {lastAdded && (
          <div
            style={{
              border:
                lastAdded.aiLabel === "Want"
                  ? "1px solid #4c1d1d"
                  : "1px solid #14532d",
            }}
            className={`rounded-xl px-4 py-3 flex items-start gap-3 ${lastAdded.aiLabel === "Want" ? "bg-rose-950/30" : "bg-emerald-950/30"}`}
          >
            {lastAdded.aiLabel === "Want" ? (
              <AlertCircle
                size={16}
                className="text-rose-400 shrink-0 mt-0.5"
              />
            ) : (
              <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-200">
                AI tagged:{" "}
                <span
                  className={
                    lastAdded.aiLabel === "Want"
                      ? "text-rose-300"
                      : "text-emerald-300"
                  }
                >
                  {lastAdded.aiLabel}
                </span>
                {lastAdded.conflict && (
                  <span className="text-amber-400">
                    {" "}
                    (you said {lastAdded.userIntent})
                  </span>
                )}
              </p>
              {lastAdded.altData && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {lastAdded.altData.tip}
                </p>
              )}
            </div>
            <button onClick={() => setLastAdded(null)}>
              <X size={13} className="text-slate-600" />
            </button>
          </div>
        )}

        {/* Investment nudge — live */}
        <InvestmentNudge wantSaved={wantSaved} />

        {/* Add expense */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: "linear-gradient(135deg,#4f46e5,#6366f1)",
              boxShadow: "0 0 24px #4f46e540",
            }}
            className="w-full rounded-2xl py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-sm"
          >
            <Plus size={18} /> Log Expense
          </button>
        ) : (
          <div
            style={{ background: "#0d1627", border: "1px solid #1e2d4a" }}
            className="rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-300 text-sm font-semibold">
                New Expense
              </p>
              <button onClick={() => setShowForm(false)}>
                <X size={15} className="text-slate-500" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-7 pr-4 py-2.5 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <input
              placeholder="What did you spend on?"
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
            />
            <div>
              <p className="text-slate-500 text-xs mb-1.5">You think it's a…</p>
              <div className="flex gap-2">
                {["Need", "Want"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setForm((f) => ({ ...f, intent: v }))}
                    className={`flex-1 rounded-xl py-2 text-sm font-semibold border transition-all ${
                      form.intent === v
                        ? v === "Need"
                          ? "bg-emerald-900/50 border-emerald-600 text-emerald-300"
                          : "bg-rose-900/50 border-rose-600 text-rose-300"
                        : "bg-slate-800/40 border-slate-700 text-slate-500"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAdd}
              style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}
              className="w-full rounded-xl py-2.5 text-white font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Check size={15} /> Add & Evaluate
            </button>
          </div>
        )}

        {/* History */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-slate-500" />
            <p className="text-slate-500 text-xs tracking-widest uppercase">
              Transactions
            </p>
          </div>
          {txns.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">
              No expenses yet. Log your first one.
            </p>
          ) : (
            txns.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} remaining={remaining} />
            ))
          )}
        </div>

        {txns.length > 0 && (
          <p className="text-slate-700 text-xs text-center pb-2">
            Tap any Want to expand AI insights
          </p>
        )}
      </div>
    </div>
  );
}
