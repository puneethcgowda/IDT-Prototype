import { useMemo, useState } from "react";
import { seedCrops } from "../data/mockData";
import { Search, TrendingDown, TrendingUp, Minus, MapPin } from "lucide-react";
import type { Crop } from "../types";
import { useData } from "../context/DataContext";

const SEASONS: Crop["season"][] = ["Kharif", "Rabi", "Zaid", "All Year"];

function TrendIcon({ trend }: { trend: Crop["trend"] }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
}

export default function Crops() {
  const { listings } = useData();
  const [q, setQ] = useState("");
  const [season, setSeason] = useState<string>("all");
  const [active, setActive] = useState<Crop | null>(null);

  const list = useMemo(() => {
    return seedCrops.filter((c) => {
      const okQ = q.trim() ? c.name.toLowerCase().includes(q.toLowerCase()) : true;
      const okS = season === "all" ? true : c.season === season;
      return okQ && okS;
    });
  }, [q, season]);

  return (
    <div id="page-crops" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Crops & Market Prices</h1>
        <p className="text-sm text-gray-500">
          Indicative wholesale prices, season info and best-practice tips for higher yield.
        </p>
      </div>

      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search crops"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSeason("all")}
            className={`px-3 py-1.5 rounded-md text-sm ${
              season === "all" ? "bg-brand-600 text-white" : "bg-white border border-gray-200"
            }`}
          >All seasons</button>
          {SEASONS.map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                season === s ? "bg-brand-600 text-white" : "bg-white border border-gray-200"
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c)}
            className="card p-5 text-left hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="text-5xl">{c.emoji}</div>
              <span className="badge bg-brand-50 text-brand-700">{c.season}</span>
            </div>
            <h3 className="mt-3 font-semibold text-gray-900">{c.name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{c.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase text-gray-500">Market price</div>
                <div className="text-lg font-bold text-brand-700">
                  ₹{c.marketPricePerKg}<span className="text-xs text-gray-500">/kg</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <TrendIcon trend={c.trend} />
                <span className="capitalize text-gray-600">{c.trend}</span>
              </div>
            </div>
          </button>
        ))}

        {/* Marketplace Listings */}
        {listings.map((listing) => (
          <div key={listing.id} className="card p-5 text-left hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="text-5xl">{listing.imageEmoji}</div>
              <span className="badge bg-green-50 text-green-700">Available</span>
            </div>
            <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{listing.cropType}</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{listing.location}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase text-gray-500">Price</div>
                <div className="text-lg font-bold text-brand-700">
                  ₹{listing.pricePerKg}<span className="text-xs text-gray-500">/kg</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase text-gray-500">Stock</div>
                <div className="text-sm font-semibold text-gray-900">{listing.quantityKg} kg</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="card max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{active.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold">{active.name}</h2>
                  <span className="badge bg-brand-50 text-brand-700">{active.season} season</span>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="btn-ghost">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-brand-50 p-3">
                <div className="text-xs uppercase text-brand-700 font-semibold">Market price</div>
                <div className="text-xl font-bold text-brand-800">
                  ₹{active.marketPricePerKg}<span className="text-sm text-gray-600">/kg</span>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 flex items-center gap-2">
                <TrendIcon trend={active.trend} />
                <div>
                  <div className="text-xs uppercase text-gray-600 font-semibold">Trend</div>
                  <div className="text-sm capitalize text-gray-800">{active.trend}</div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-700">{active.description}</p>
            <h4 className="mt-4 font-semibold text-sm">Best practices</h4>
            <ul className="mt-1 space-y-1 text-sm text-gray-700 list-disc list-inside">
              {active.bestPractices.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
