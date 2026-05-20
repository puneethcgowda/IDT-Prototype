import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Heart, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import StarRating from "../components/StarRating";
import { seedCrops } from "../data/mockData";

type Availability = "all" | "available" | "out";

export default function Marketplace() {
  const { listings, getUserById, getAverageRating, isSaved, toggleSaved } = useData();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [crop, setCrop] = useState<string>("all");
  const [loc, setLoc] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [availability, setAvailability] = useState<Availability>("all");
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const cropOptions = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.cropType))).sort();
  }, [listings]);
  const locationOptions = useMemo(() => {
    return Array.from(new Set(listings.map((l) => l.location))).sort();
  }, [listings]);

  const filtered = useMemo(() => {
    let data = [...listings];
    if (q.trim()) {
      const t = q.toLowerCase();
      data = data.filter(
        (l) =>
          l.title.toLowerCase().includes(t) ||
          l.description.toLowerCase().includes(t) ||
          l.cropType.toLowerCase().includes(t)
      );
    }
    if (crop !== "all") data = data.filter((l) => l.cropType === crop);
    if (loc !== "all") data = data.filter((l) => l.location === loc);
    const minP = minPrice ? Number(minPrice) : 0;
    const maxP = maxPrice ? Number(maxPrice) : Infinity;
    data = data.filter((l) => l.pricePerKg >= minP && l.pricePerKg <= maxP);
    if (availability === "available") data = data.filter((l) => l.available);
    if (availability === "out") data = data.filter((l) => !l.available);
    if (sort === "price-asc") data.sort((a, b) => a.pricePerKg - b.pricePerKg);
    else if (sort === "price-desc") data.sort((a, b) => b.pricePerKg - a.pricePerKg);
    else data.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return data;
  }, [listings, q, crop, loc, minPrice, maxPrice, availability, sort]);

  const clearFilters = () => {
    setQ(""); setCrop("all"); setLoc("all"); setMinPrice(""); setMaxPrice(""); setAvailability("all"); setSort("newest");
  };

  return (
    <div id="page-marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-sm text-gray-500">Buy fresh produce directly from farmers.</p>
        </div>
        {seedCrops.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1.5">
            <button
              onClick={() => setCrop("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                crop === "all" ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-700"
              }`}
            >All crops</button>
            {cropOptions.map((c) => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  crop === c ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-700"
                }`}
              >{c}</button>
            ))}
          </div>
        )}
      </div>

      {/* Search bar + filter toggle */}
      <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="input pl-9"
            placeholder="Search produce, farmers, or descriptions"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className="input sm:w-44" value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-secondary sm:w-auto"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? "Hide filters" : "More filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="label">Crop type</label>
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="all">All</option>
              {cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
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
            <label className="label">Min price (₹/kg)</label>
            <input className="input" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="label">Max price (₹/kg)</label>
            <input className="input" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" />
          </div>
          <div>
            <label className="label">Availability</label>
            <select className="input" value={availability} onChange={(e) => setAvailability(e.target.value as Availability)}>
              <option value="all">All</option>
              <option value="available">Available now</option>
              <option value="out">Out of stock</option>
            </select>
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <button onClick={clearFilters} className="btn-ghost text-sm">
              <X className="w-4 h-4" /> Clear filters
            </button>
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-3">{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</p>

      {/* Listings grid */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No listings match your filters.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l) => {
            const farmer = getUserById(l.farmerId);
            const { avg, count } = farmer ? getAverageRating(farmer.id) : { avg: 0, count: 0 };
            const saved = user ? isSaved(user.id, l.id) : false;
            return (
              <div key={l.id} className="card overflow-hidden hover:shadow-md transition group">
                <Link to={`/marketplace/${l.id}`} className="block relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-yellow-50 flex items-center justify-center text-7xl">
                    {l.imageEmoji}
                  </div>
                  {!l.available && (
                    <span className="absolute top-2 left-2 badge bg-gray-900/80 text-white">Out of stock</span>
                  )}
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link to={`/marketplace/${l.id}`} className="font-semibold text-gray-900 hover:text-brand-700">
                      {l.title}
                    </Link>
                    {user && (
                      <button
                        onClick={() => toggleSaved(user.id, l.id, "listing")}
                        className="p-1 rounded-full hover:bg-gray-100"
                        aria-label={saved ? "Unsave" : "Save"}
                      >
                        <Heart className={`w-4 h-4 ${saved ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {l.location}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <span className="text-lg font-bold text-brand-700">₹{l.pricePerKg}</span>
                      <span className="text-xs text-gray-500">/kg</span>
                    </div>
                    <div className="text-xs text-gray-500">{l.quantityKg} kg available</div>
                  </div>
                  {farmer && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <Link to={`/profile/${farmer.id}`} className="flex items-center gap-2 text-xs">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[10px]"
                          style={{ background: farmer.avatarColor }}
                        >
                          {farmer.name.charAt(0)}
                        </span>
                        <span className="text-gray-700 font-medium">{farmer.name}</span>
                      </Link>
                      {count > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <StarRating value={avg} readOnly size={12} /> ({count})
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400">No reviews yet</span>
                      )}
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
