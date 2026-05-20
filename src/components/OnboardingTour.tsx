import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Leaf,
  ShoppingBasket,
  Tractor,
  TrendingUp,
  Landmark,
  LayoutDashboard,
  MessageCircle,
  CheckCircle2,
  X,
} from "lucide-react";

interface Step {
  title: string;
  body: string;
  icon: any;
  cta?: { label: string; to: string };
}

export default function OnboardingTour() {
  const { user, markOnboardingComplete } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);

  const isFarmer = user?.role === "farmer";

  const steps = useMemo<Step[]>(() => {
    if (!user) return [];
    return [
      {
        title: `Welcome to AgriConnect, ${user.name.split(" ")[0]}! 🌱`,
        body: isFarmer
          ? "We help small farmers grow productivity and earnings. Let's take a quick tour of what you can do."
          : "Get fresh produce direct from farmers and rent equipment in seconds. Quick tour?",
        icon: Leaf,
      },
      {
        title: "Marketplace — direct from farm",
        body: isFarmer
          ? "List your produce, set your own price, and sell directly to consumers — no middlemen."
          : "Browse fresh, transparently-priced produce from verified small farmers. Filter by crop, location and price.",
        icon: ShoppingBasket,
        cta: { label: "Open Marketplace", to: "/marketplace" },
      },
      {
        title: "Equipment Rental — by the day",
        body: isFarmer
          ? "List under-utilised tractors, sprayers and tools to earn extra income."
          : "Book tractors, harvesters and tools by the day. Filter by category, location, price and availability.",
        icon: Tractor,
        cta: { label: "Open Equipment", to: "/equipment" },
      },
      {
        title: "Crops & live market prices",
        body: "Track wholesale prices, season info and best-practice tips for higher yield on small holdings.",
        icon: TrendingUp,
        cta: { label: "View Crops", to: "/crops" },
      },
      {
        title: "Government schemes — at a glance",
        body: "Eligibility, benefits and direct links to PM-KISAN, PMFBY, KCC, PMKSY and more.",
        icon: Landmark,
        cta: { label: "View Schemes", to: "/schemes" },
      },
      {
        title: "Your dashboard",
        body: isFarmer
          ? "Manage listings, see upcoming bookings, track sales and saved items — all in one place."
          : "See your orders, upcoming equipment bookings, saved items and total spend.",
        icon: LayoutDashboard,
        cta: { label: "Open Dashboard", to: "/dashboard" },
      },
      {
        title: "Chat directly, leave reviews",
        body: "Message farmers/consumers without leaving the app. After a transaction, leave a star rating to help the community.",
        icon: MessageCircle,
        cta: { label: "Open Messages", to: "/messages" },
      },
      {
        title: "You're all set! 🎉",
        body: "Explore at your own pace. You can re-open this tour anytime from the dashboard.",
        icon: CheckCircle2,
      },
    ];
  }, [user, isFarmer]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!user || !open || steps.length === 0) return null;
  const s = steps[step];
  const Icon = s.icon;
  const last = step === steps.length - 1;

  const close = () => {
    setOpen(false);
    markOnboardingComplete();
  };

  const goToCta = () => {
    if (s.cta) navigate(s.cta.to);
  };

  return (
    <div className="onboarding-overlay flex items-center justify-center p-4">
      <div className="card max-w-md w-full overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white p-6 relative">
          <button
            onClick={close}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/20"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="mt-3 text-xl font-bold">{s.title}</h2>
          <p className="mt-2 text-brand-50 text-sm">{s.body}</p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 py-3 bg-gray-50">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "bg-brand-600 w-6" : "bg-gray-300 w-1.5"
              }`}
            />
          ))}
        </div>

        <div className="p-4 flex items-center justify-between gap-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            {s.cta && !last && (
              <button onClick={goToCta} className="btn-secondary text-sm">
                {s.cta.label} <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {last ? (
              <button onClick={close} className="btn-primary text-sm">
                Get started <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="btn-primary text-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 text-center">
          <button onClick={close} className="text-xs text-gray-500 hover:text-gray-700">
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
