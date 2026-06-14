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
  Zap,
  Truck,
  Check,
  Award,
  Cloud,
  Droplets,
  Book,
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
            <div key={f.title} className="card-3d p-6 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Categories */}
      <section className="bg-gradient-to-b from-white to-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Wide Range of Agricultural Products</h2>
            <p className="mt-2 text-gray-600">Everything farmers need, all in one marketplace</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { emoji: "🥬", label: "Fresh Vegetables" },
              { emoji: "🌾", label: "Grains & Pulses" },
              { emoji: "🍊", label: "Fruits" },
              { emoji: "🌱", label: "Farm Inputs" },
              { emoji: "🚜", label: "Equipment" },
              { emoji: "🐄", label: "Livestock" },
              { emoji: "☕", label: "Specialty Crops" },
              { emoji: "🤝", label: "Agri-Services" },
            ].map((cat) => (
              <div key={cat.label} className="text-center group">
                <div className="w-full aspect-square bg-white rounded-xl border border-gray-200 flex items-center justify-center text-5xl shadow-sm immersive-hover">
                  {cat.emoji}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-brand-700 transition-colors">{cat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Harvest Festival Days Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8 items-center">
            <div>
              <div className="text-yellow-300 text-lg font-bold mb-2">🌾 SPECIAL PROMOTION</div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
                The Harvest Festival Days
              </h2>
              <p className="text-brand-100 text-lg mb-6">
                Biggest Discounts of the Season! Bumper Harvest Deals!
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white">
                  <Zap className="w-5 h-5" /> Up to 40% off on fresh produce
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Truck className="w-5 h-5" /> Free delivery on orders above ₹500
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Award className="w-5 h-5" /> Exclusive member-only offers
                </div>
              </div>
              <Link to="/marketplace" className="btn bg-yellow-300 text-brand-700 hover:bg-yellow-200 font-semibold px-6 py-3">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-6xl text-center opacity-20">🎉</div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card-3d p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg text-green-700 mb-4 group-hover:scale-110 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Direct from Farms</h3>
            <p className="text-sm text-gray-600 mt-2">Connect directly with farmers. No middlemen. Fair prices for all.</p>
          </div>
          <div className="card-3d p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg text-blue-700 mb-4 group-hover:scale-110 transition-transform">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Quality Guaranteed</h3>
            <p className="text-sm text-gray-600 mt-2">All products verified for quality. Premium selection only.</p>
          </div>
          <div className="card-3d p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg text-purple-700 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Diverse Produce</h3>
            <p className="text-sm text-gray-600 mt-2">Wide variety of crops and products from across India.</p>
          </div>
          <div className="card-3d p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg text-orange-700 mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900">Fast & Reliable Delivery</h3>
            <p className="text-sm text-gray-600 mt-2">Right to your doorstep. Tracked and insured.</p>
          </div>
        </div>
      </section>

      {/* Top Picks */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Top Picks For You</h2>
            <p className="mt-2 text-gray-600">Popular products and deals right now</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: "🥬", name: "Premium Fresh Vegetables", desc: "From ₹1,800/crate", detail: "Farmer Fresh" },
              { emoji: "🌾", name: "High Quality Maize Flour Sack", desc: "From ₹2,500/sack", detail: "Locally Milled" },
              { emoji: "📊", name: "Agri-Data Analysis Service Tablet", desc: "From ₹1,500/session", detail: "Optimize Yield" },
              { emoji: "⚒️", name: "Durable Hand-tilled Jembe", desc: "From ₹500/piece", detail: "Indian Tilled" },
              { emoji: "🏠", name: "Green Soul Agri-Coop Chicken Coop Kit", desc: "From ₹9,000/kit", detail: "Warm & Secure" },
              { emoji: "🥗", name: "Balanced Fertilizer Bag", desc: "From ₹200/bag", detail: "Soil Nutrient" },
            ].map((product) => (
              <div key={product.name} className="card overflow-hidden hover:shadow-md transition">
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">{product.emoji}</div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{product.desc}</p>
                  <p className="text-xs text-brand-700 font-medium mt-2">{product.detail}</p>
                </div>
              </div>
            ))}
          </div>
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
            <Link to="/crops" className="btn bg-white text-brand-700 hover:bg-brand-50 hover:shadow-lg hover:-translate-y-0.5">
              {t("common.viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seedCrops.slice(0, 4).map((c) => (
              <div key={c.id} className="glass-morphism p-4 hover:bg-white/40 hover:shadow-xl transition-all duration-300 transform-gpu group cursor-pointer">
                <div className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</div>
                <div className="mt-2 font-semibold">{c.name}</div>
                <div className="text-brand-100 text-sm">₹{c.marketPricePerKg}/kg</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & Farming Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card-3d p-6 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Weather Forecast</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Get 14-day weather forecasts with farming-specific recommendations for your location.</p>
            <Link to="/weather-report" className="text-brand-700 hover:text-brand-800 font-medium text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              View Weather Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="card-3d p-6 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Book className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Farming Knowledge</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Access expert tips on crop selection, pest management, and seasonal farming practices.</p>
            <Link to="/about" className="text-brand-700 hover:text-brand-800 font-medium text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Learn More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="card-3d p-6 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AgriConnect Club</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Join our club for free delivery, priority booking, and exclusive member offers.</p>
            <Link to="/signup" className="text-brand-700 hover:text-brand-800 font-medium text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              Join Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Club Benefits */}
      <section className="bg-gradient-to-r from-amber-50 to-yellow-50 border-y border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">AgriConnect Club Benefits</h2>
            <p className="text-gray-600 mt-2">Exclusive perks for our members</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-gray-900">Free & Fast Delivery</h3>
              <p className="text-sm text-gray-600 mt-2">Get your orders delivered quickly with no additional charges.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="font-semibold text-gray-900">Priority Booking</h3>
              <p className="text-sm text-gray-600 mt-2">Get priority access to equipment rental and seasonal offers.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-semibold text-gray-900">Exclusive Offers</h3>
              <p className="text-sm text-gray-600 mt-2">Enjoy special discounts and deals available only for members.</p>
            </div>
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
