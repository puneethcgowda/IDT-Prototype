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
import { useTranslation } from "react-i18next";

export default function Home() {
  const { listings, equipment, users } = useData();
  const { t } = useTranslation();
  const farmers = users.filter((u) => u.role === "farmer").length;

  const features = [
    { icon: ShoppingBasket, title: t("home.f1Title", "Direct Marketplace"), desc: t("home.f1Desc", "Farmers sell produce straight to consumers — no middlemen, fair prices.") },
    { icon: Tractor, title: t("home.f2Title", "Equipment on Demand"), desc: t("home.f2Desc", "Book tractors, harvesters, sprayers and more — by the day, online.") },
    { icon: TrendingUp, title: t("home.f3Title", "Live Crop Prices"), desc: t("home.f3Desc", "Track market prices and trends so you sell at the right time.") },
    { icon: Landmark, title: t("home.f4Title", "Government Schemes"), desc: t("home.f4Desc", "Eligibility, benefits and direct links to PM-KISAN, PMFBY, KCC and more.") },
    { icon: MessageCircle, title: t("home.f5Title", "Direct Messaging"), desc: t("home.f5Desc", "Chat with farmers and buyers without leaving the platform.") },
    { icon: ShieldCheck, title: t("home.f6Title", "Secure Payments"), desc: t("home.f6Desc", "All transactions are processed via a secure simulated payment gateway.") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-yellow-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-brand-200 rounded-full px-3 py-1 text-xs font-medium text-brand-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> {t("home.tagline")}
            </div>
            <h1 className="mt-4 text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
              <span className="text-brand-700">{t("home.heroTitle1")}</span>
              <br /> <span className="text-brand-700">{t("home.heroTitle2")}</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              {t("home.heroDesc")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary text-base px-5 py-3">
                {t("home.ctaStart")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/marketplace" className="btn-secondary text-base px-5 py-3">
                {t("home.ctaBrowse")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              <Stat label={t("home.statsFarmers")} value={farmers.toString()} icon={Users} />
              <Stat label={t("home.statsListings")} value={listings.length.toString()} icon={ShoppingBasket} />
              <Stat label={t("home.statsEquipment")} value={equipment.length.toString()} icon={Tractor} />
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
              <h2 className="text-2xl font-bold text-gray-900">{t("home.whyTitle")}</h2>
              <p className="mt-2 text-sm text-gray-500">
                {t("home.whySubtitle")}
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
          <h2 className="text-3xl font-bold text-gray-900">{t("home.featuresTitle")}</h2>
          <p className="mt-2 text-gray-600">
            {t("home.featuresSubtitle")}
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
              <h2 className="text-2xl font-bold">{t("home.pricesTitle")}</h2>
              <p className="text-brand-100 text-sm mt-1">
                {t("home.pricesSubtitle")}
              </p>
            </div>
            <Link to="/crops" className="btn bg-white text-brand-700 hover:bg-brand-50">
              {t("common.viewAll")} <ArrowRight className="w-4 h-4" />
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
        <h2 className="text-3xl font-bold text-gray-900">{t("home.ctaTitle")}</h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          {t("home.ctaDesc")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/signup" className="btn-primary px-5 py-3">
            {t("home.ctaCreate")}
          </Link>
          <Link to="/about" className="btn-secondary px-5 py-3">
            {t("home.ctaLearn")}
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
