import { useMemo, useState } from "react";
import { seedSchemes } from "../data/mockData";
import { ExternalLink, Landmark, Search } from "lucide-react";

export default function Schemes() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(seedSchemes.map((s) => s.category))).sort(),
    []
  );

  const list = useMemo(() => {
    return seedSchemes.filter((s) => {
      const okQ = q.trim()
        ? s.name.toLowerCase().includes(q.toLowerCase()) ||
          s.benefit.toLowerCase().includes(q.toLowerCase())
        : true;
      const okC = cat === "all" ? true : s.category === cat;
      return okQ && okC;
    });
  }, [q, cat]);

  return (
    <div id="page-schemes" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Schemes for Farmers</h1>
          <p className="text-sm text-gray-500">
            Explore the major central schemes for income support, insurance, credit and infrastructure.
          </p>
        </div>
      </div>

      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search by scheme or benefit"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCat("all")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              cat === "all" ? "bg-brand-600 text-white" : "bg-white border border-gray-200"
            }`}
          >All</button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                cat === c ? "bg-brand-600 text-white" : "bg-white border border-gray-200"
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((s) => (
          <div key={s.id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              <span className="badge bg-brand-50 text-brand-700">{s.category}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{s.ministry}</p>

            <div className="mt-3 space-y-2 text-sm text-gray-700 flex-1">
              <div>
                <span className="font-semibold text-gray-900">Benefit: </span>
                {s.benefit}
              </div>
              <div>
                <span className="font-semibold text-gray-900">Eligibility: </span>
                {s.eligibility}
              </div>
            </div>

            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-4 self-start text-sm"
            >
              Visit official portal <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8">
        Information is indicative. Always confirm eligibility, latest benefits and application steps on the official portals.
      </p>
    </div>
  );
}
