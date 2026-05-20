import { Link } from "react-router-dom";
import {
  Leaf,
  ShoppingBasket,
  Tractor,
  TrendingUp,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { seedCrops } from "../data/mockData";

const features = [
  {
    icon: ShoppingBasket,
    title: "Direct Marketplace",
    desc: "Farmers sell produce straight to consumers — no middlemen, fair prices.",
  },
  {
    icon: Tractor,
    title: "Equipment on Demand",
    desc: "Book tractors, harvesters, sprayers and more — by the day, online.",
  },
  {
    icon: TrendingUp,
    title: "Live Crop Prices",
    desc: "Track market prices and trends so you sell at the right time.",
  },
  {
    icon: Landmark,
    title: "Government Schemes",
    desc: "Eligibility, benefits and direct links to PM-KISAN, PMFBY, KCC and more.",
  },
  {
    icon: MessageCircle,
    title: "Direct Messaging",
    desc: "Chat with farmers and buyers without leaving the platform.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    desc: "All transactions are processed via a secure simulated payment gateway.",
  },
];

export default function Home() {
  const { listings, equipment, users } = useData();
  const farmers = users.filter((u) => u.role === "farmer").length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-yellow-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-brand-200 rounded-full px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Agriculture as Livelihood — Student Project
            </div>
            <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              From <span className="text-brand-700">small farms</span>
              <br /> to <span className="text-brand-700">smart livelihoods.</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              AgriConnect helps small landholders increase productivity, sell directly to
              consumers, rent the equipment they need, and access the schemes they deserve.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary text-base px-5 py-3">
                Get started — it's free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/marketplace" className="btn-secondary text-base px-5 py-3">
                Browse marketplace
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label="Farmers" value={farmers.toString()} icon={Users} />
              <Stat label="Listings" value={listings.length.toString()} icon={ShoppingBasket} />
              <Stat label="Equipment" value={equipment.length.toString()} icon={Tractor} />
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card emoji="🍅" title="Fresh Tomatoes" sub="₹28/kg · Anand" />
              <Card emoji="🌾" title="Sharbati Wheat" sub="₹35/kg · Gujarat" />
              <Card emoji="🚜" title="Tractor Rental" sub="₹1,800/day" />
              <Card emoji="🌱" title="Ragi Millet" sub="₹60/kg · Mysuru" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-w-xs hidden lg:block">
              <div className="flex items-center gap-2 text-brand-700 text-sm font-semibold">
                <Leaf className="w-4 h-4" /> Direct from farmer
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Every order helps a small landholder earn a fairer price for their hard work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900">Why this exists</h2>
              <p className="mt-2 text-sm text-gray-500">
                The problem we're tackling.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <ProblemCard
                stat="86%"
                title="Small & marginal farmers in India"
                desc="hold less than 2 hectares — making productivity per acre critical."
              />
              <ProblemCard
                stat="40-50%"
                title="Of farmer income lost"
                desc="to middlemen and inefficient supply chains in many regions."
              />
              <ProblemCard
                stat="< 50%"
                title="Mechanisation in small farms"
                desc="due to high upfront cost of buying equipment outright."
              />
              <ProblemCard
                stat="₹6,000+"
                title="Per year in govt. support"
                desc="under PM-KISAN alone — but awareness remains low."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900">Everything a small farm needs, in one place.</h2>
          <p className="mt-2 text-gray-600">
            A digital cooperative — built for farmers, with consumers in mind.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crop strip */}
      <section className="bg-gradient-to-r from-brand-700 to-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Today's market prices</h2>
              <p className="text-brand-100 text-sm mt-1">
                Indicative wholesale prices · updated daily
              </p>
            </div>
            <Link to="/crops" className="btn bg-white text-brand-700 hover:bg-brand-50">
              View all crops <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seedCrops.slice(0, 4).map((c) => (
              <div key={c.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-2 font-semibold">{c.name}</div>
                <div className="text-brand-100 text-sm">₹{c.marketPricePerKg}/kg</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Ready to grow with us?</h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Join AgriConnect as a farmer or a consumer and be part of a fairer agricultural economy.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/signup" className="btn-primary px-5 py-3">
            Create your free account
          </Link>
          <Link to="/about" className="btn-secondary px-5 py-3">
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-brand-700">
        <Icon className="w-4 h-4" />
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function Card({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="text-4xl">{emoji}</div>
      <div className="mt-3 font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function ProblemCard({ stat, title, desc }: { stat: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5">
      <div className="text-3xl font-extrabold text-brand-700">{stat}</div>
      <div className="mt-1 font-semibold text-gray-900 text-sm">{title}</div>
      <p className="text-sm text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
