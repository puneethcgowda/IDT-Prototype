import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Heart, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import StarRating from "../components/StarRating";
import type { EquipmentCategory } from "../types";

const CATEGORIES: EquipmentCategory[] = [
  "Tractor",
  "Harvester",
  "Plough",
  "Seeder",
  "Sprayer",
  "Irrigation",
];

export default function Equipment() {
  const { equipment, getUserById, getAverageRating, isSaved, toggleSaved } = useData();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [loc, setLoc] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [availability, setAvailability] = useState<"all" | "available" | "booked">("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const locationOptions = useMemo(
    () => Array.from(new Set(equipment.map((e) => e.location))).sort(),
    [equipment]
  );

  const filtered = useMemo(() => {
    let data = [...equipment];
    if (q.trim()) {
      const t = q.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(t) ||
          e.description.toLowerCase().includes(t) ||
          e.category.toLowerCase().includes(t)
      );
    }
    if (cat !== "all") data = data.filter((e) => e.category === cat);
    if (loc !== "all") data = data.filter((e) => e.location === loc);
    const minP = minPrice ? Number(minPrice) : 0;
    const maxP = maxPrice ? Number(maxPrice) : Infinity;
    data = data.filter((e) => e.pricePerDay >= minP && e.pricePerDay <= maxP);
    if (availability === "available") data = data.filter((e) => e.available);
    if (availability === "booked") data = data.filter((e) => !e.available);
    if (sort === "price-asc") data.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sort === "price-desc") data.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return data;
  }, [equipment, q, cat, loc, minPrice, maxPrice, availability, sort]);

  const clearFilters = () => {
    setQ(""); setCat("all"); setLoc("all"); setMinPrice(""); setMaxPrice(""); setAvailability("all"); setSort("newest");
  };

  return (
    <div id="page-equipment" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipment Rental</h1>
          <p className="text-sm text-gray-500">
            Rent farm machinery on-demand — by the day. Ideal for small landholders.
          </p>
        </div>
        <div className="hidden md:flex flex-wrap gap-1.5">
          <button
            onClick={() => setCat("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              cat === "all" ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-700"
            }`}
          >All categories</button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                cat === c ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-700"
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search tractors, harvesters, sprayers..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary sm:w-auto">
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Hide filters" : "More filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="all">All</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <select className="input" value={loc} onChange={(e) => setLoc(e.target.value)}>
              <option value="all">All locations</option>
              {locationOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Min price (₹/day)</label>
            <input className="input" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="label">Max price (₹/day)</label>
            <input className="input" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" />
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={availability} onChange={(e) => setAvailability(e.target.value as any)}>
              <option value="all">All</option>
              <option value="available">Available now</option>
              <option value="booked">Currently booked</option>
            </select>
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <button onClick={clearFilters} className="btn-ghost text-sm">
              <X className="w-4 h-4" /> Clear filters
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-3">{filtered.length} equipment item{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No equipment matches your filters.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => {
            const owner = getUserById(e.ownerId);
            const { avg, count } = owner ? getAverageRating(owner.id) : { avg: 0, count: 0 };
            const saved = user ? isSaved(user.id, e.id) : false;
            return (
              <div key={e.id} className="card overflow-hidden hover:shadow-md transition">
                <Link to={`/equipment/${e.id}`} className="block relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-yellow-50 to-brand-50 flex items-center justify-center text-7xl">
                    {e.imageEmoji}
                  </div>
                  {!e.available && (
                    <span className="absolute top-2 left-2 badge bg-gray-900/80 text-white">Booked</span>
                  )}
                  <span className="absolute top-2 right-2 badge bg-white/90 text-gray-800">{e.category}</span>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/equipment/${e.id}`} className="font-semibold text-gray-900 hover:text-brand-700">
                      {e.name}
                    </Link>
                    {user && (
                      <button
                        onClick={() => toggleSaved(user.id, e.id, "equipment")}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label={saved ? "Unsave" : "Save"}
                      >
                        <Heart className={`w-4 h-4 ${saved ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {e.location}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <span className="text-lg font-bold text-brand-700">₹{e.pricePerDay.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-gray-500">/day</span>
                    </div>
                    {count > 0 && <StarRating value={avg} readOnly size={12} />}
                  </div>
                  {owner && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <Link to={`/profile/${owner.id}`} className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px]"
                          style={{ background: owner.avatarColor }}
                        >
                          {owner.name.charAt(0)}
                        </span>
                        <span className="text-gray-700 font-medium">{owner.name}</span>
                      </Link>
                      <Link to={`/equipment/${e.id}`} className="text-brand-700 font-medium">Book →</Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
