// Lightweight keyword-based knowledge base for AgriBot.
// Each entry has a list of keywords (any-of match), an answer (string or function
// returning a string given the matched query) and a category label.

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  category: "crops" | "schemes" | "platform" | "general";
  answer: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // --- Platform / how-to ---
  {
    id: "platform-buy",
    keywords: ["how to buy", "buy produce", "purchase", "order produce", "how do i buy"],
    category: "platform",
    answer:
      "Browse the Marketplace, open any listing, choose the quantity in kg, and click **Buy now**. You'll be guided through a secure checkout (Card / UPI / Net Banking).",
  },
  {
    id: "platform-sell",
    keywords: ["how to sell", "list produce", "create listing", "add listing", "sell my crop"],
    category: "platform",
    answer:
      "Sign up as a **Farmer**, then on your Dashboard click **'New listing'**. Add a title, crop type, price/kg, available quantity and a short description. Your produce shows up in the Marketplace immediately.",
  },
  {
    id: "platform-rent-equipment",
    keywords: ["rent equipment", "book tractor", "book harvester", "rent machinery", "equipment booking"],
    category: "platform",
    answer:
      "Open the **Equipment** page, filter by category/location/price, click any item, pick start & end dates and complete the simulated payment. The booking appears on your dashboard instantly.",
  },
  {
    id: "platform-list-equipment",
    keywords: ["list equipment", "rent out tractor", "rent out machinery", "earn from equipment"],
    category: "platform",
    answer:
      "Farmers can earn by renting out idle equipment. Go to Dashboard → My listings tab → **Add equipment**, pick a category (Tractor, Harvester, Sprayer, etc.) and set a price per day.",
  },
  {
    id: "platform-payment",
    keywords: ["payment", "is it safe", "how do payments", "checkout", "secure payment"],
    category: "platform",
    answer:
      "All payments go through a simulated secure gateway supporting Card, UPI and Net Banking. In a real deployment, this would be backed by Razorpay, PayU or a similar PCI-DSS compliant provider.",
  },
  {
    id: "platform-language",
    keywords: ["change language", "hindi", "kannada", "language", "भाषा"],
    category: "platform",
    answer:
      "Click the 🌐 language icon in the top navigation bar to switch between English, हिन्दी and ಕನ್ನಡ.",
  },
  {
    id: "platform-account",
    keywords: ["sign up", "create account", "register", "signup"],
    category: "platform",
    answer:
      "Click **Get started** in the top right. Choose your role (Farmer or Consumer), then fill in contact details and the crops you grow / products you're looking for.",
  },
  {
    id: "platform-message",
    keywords: ["message", "contact farmer", "chat", "talk to farmer", "talk to seller"],
    category: "platform",
    answer:
      "On any listing, equipment or profile page click **Chat / Message** — or open the 'Messages' tab in the navbar. All conversations stay inside AgriConnect.",
  },

  // --- Crops ---
  {
    id: "crop-tomato",
    keywords: ["tomato", "tomatoes", "टमाटर"],
    category: "crops",
    answer:
      "🍅 **Tomato:** All-year crop, current indicative price ~₹28/kg. Best practices: use disease-resistant hybrid seeds, drip irrigation (saves up to 40% water), and mulching to retain soil moisture. Stake plants for higher yield.",
  },
  {
    id: "crop-wheat",
    keywords: ["wheat", "गेहूं", "godhi"],
    category: "crops",
    answer:
      "🌾 **Wheat:** Major Rabi crop, MSP-backed. Sow between Nov 1–25 for best yield. Use zero-till drill to save costs and apply nitrogen in 3 split doses. Current indicative price ~₹35/kg.",
  },
  {
    id: "crop-ragi",
    keywords: ["ragi", "finger millet", "ರಾಗಿ", "रागी"],
    category: "crops",
    answer:
      "🌱 **Ragi (Finger Millet):** Climate-resilient nutri-cereal, ideal for rain-fed small farms. Line transplanting boosts yield ~25%, intercrop with pigeon pea. Minimal pest pressure — perfect organic crop. Indicative price ~₹60/kg.",
  },
  {
    id: "crop-onion",
    keywords: ["onion", "प्याज", "ಈರುಳ್ಳಿ"],
    category: "crops",
    answer:
      "🧅 **Onion:** Rabi crop, prices volatile. Cure bulbs for ~10 days before storage, avoid waterlogging (use raised beds). Early planting fetches premium price.",
  },
  {
    id: "crop-tur",
    keywords: ["tur", "pigeon pea", "arhar", "tur dal", "तूर"],
    category: "crops",
    answer:
      "🫘 **Tur Dal (Pigeon Pea):** Kharif pulse, fixes nitrogen and improves soil. Sow with monsoon onset, use wide spacing for branching, spray for pod borer at flowering.",
  },
  {
    id: "crop-maize",
    keywords: ["maize", "corn", "मक्का"],
    category: "crops",
    answer:
      "🌽 **Maize:** Versatile Kharif crop. Use single-cross hybrids, maintain 60×20 cm spacing, side-dress urea at knee-high stage. Strong demand from poultry sector.",
  },

  // --- Sowing / general advice ---
  {
    id: "advice-sowing",
    keywords: ["when to sow", "best time to sow", "sowing season", "kharif", "rabi"],
    category: "crops",
    answer:
      "**Kharif** (Jun–Oct, monsoon): paddy, maize, bajra, tur, cotton, sugarcane.\n**Rabi** (Oct–Mar, winter): wheat, mustard, gram, peas, barley.\n**Zaid** (Mar–Jun, summer): watermelon, cucumber, fodder.",
  },
  {
    id: "advice-water",
    keywords: ["save water", "drip irrigation", "water saving", "water management"],
    category: "crops",
    answer:
      "Drip and sprinkler systems can save 30–50% water vs flood irrigation. PMKSY offers up to **55% subsidy** for small/marginal farmers on drip kits. Combine with mulching and early-morning watering for best results.",
  },
  {
    id: "advice-soil",
    keywords: ["soil test", "soil health", "npk", "fertilizer", "fertiliser"],
    category: "crops",
    answer:
      "Get a free Soil Health Card every 3 years (soilhealth.dac.gov.in). The card gives crop-wise NPK recommendations and prevents over-application of fertilisers — saving cost and protecting yields.",
  },

  // --- Schemes ---
  {
    id: "scheme-pmkisan",
    keywords: ["pm kisan", "pm-kisan", "pmkisan", "income support", "₹6000", "6000 rupees"],
    category: "schemes",
    answer:
      "🏛️ **PM-KISAN:** ₹6,000 per year direct income support paid in 3 equal instalments of ₹2,000 to all eligible landholding farmer families. Apply at **pmkisan.gov.in** with your Aadhaar and land records.",
  },
  {
    id: "scheme-pmfby",
    keywords: ["pmfby", "fasal bima", "crop insurance", "insurance"],
    category: "schemes",
    answer:
      "🛡️ **PMFBY (Pradhan Mantri Fasal Bima Yojana):** Crop insurance against natural calamities, pests and diseases. Premiums are subsidised — only **1.5–5%** paid by farmer. Covers all notified crops, including for tenant farmers and sharecroppers.",
  },
  {
    id: "scheme-kcc",
    keywords: ["kisan credit card", "kcc", "loan", "credit", "agri loan"],
    category: "schemes",
    answer:
      "💳 **Kisan Credit Card (KCC):** Short-term credit up to ₹3 lakh at **4% effective interest** (after 3% subvention if repaid on time). Covers crop, dairy, fishery and allied activities. Apply at any commercial/cooperative bank or via myscheme.gov.in.",
  },
  {
    id: "scheme-pmksy",
    keywords: ["pmksy", "irrigation subsidy", "drip subsidy", "sprinkler subsidy", "micro irrigation"],
    category: "schemes",
    answer:
      "💧 **PM Krishi Sinchayee Yojana:** Up to **55% subsidy** for small/marginal farmers on micro-irrigation systems (drip & sprinkler). Other farmers get up to 45%. Apply through your state agriculture department.",
  },
  {
    id: "scheme-enam",
    keywords: ["enam", "e-nam", "national agriculture market", "online mandi"],
    category: "schemes",
    answer:
      "📈 **e-NAM:** Pan-India electronic trading platform for agricultural commodities. Get better price discovery by auctioning produce online to traders across states. Register at **enam.gov.in**.",
  },
  {
    id: "scheme-aif",
    keywords: ["aif", "infrastructure fund", "cold storage", "warehouse loan", "agri infrastructure"],
    category: "schemes",
    answer:
      "🏗️ **Agriculture Infrastructure Fund:** Loans up to ₹2 crore at **3% interest subvention** for cold storage, warehouses, primary processing units. Apply via agriinfra.dac.gov.in.",
  },
  {
    id: "scheme-eligibility",
    keywords: ["am i eligible", "eligible for", "qualify for", "eligibility"],
    category: "schemes",
    answer:
      "Most central schemes (PM-KISAN, KCC, PMFBY, PMKSY) are open to all landholding farmers, with priority for small & marginal farmers (<2 ha). Visit the **Govt. Schemes** page on AgriConnect for scheme-specific eligibility and official portal links.",
  },

  // --- General ---
  {
    id: "general-help",
    keywords: ["help", "what can you do", "menu", "options"],
    category: "general",
    answer:
      "I can help with:\n• 🌾 Crop info & best practices (tomato, wheat, ragi, tur, maize, onion…)\n• 🏛️ Government schemes (PM-KISAN, PMFBY, KCC, PMKSY, e-NAM, AIF…)\n• 🛒 Using AgriConnect (buying, selling, renting equipment, payments)\n• 🌧️ Sowing seasons and general farming advice",
  },
  {
    id: "general-thanks",
    keywords: ["thanks", "thank you", "thx", "धन्यवाद", "ಧನ್ಯವಾದಗಳು"],
    category: "general",
    answer: "You're welcome! 🌱 Happy to help. Anything else?",
  },
  {
    id: "general-greeting",
    keywords: ["hi", "hello", "hey", "namaste", "namaskara", "नमस्ते", "ನಮಸ್ಕಾರ"],
    category: "general",
    answer:
      "Hello! 👋 I'm AgriBot. Ask me about crops, government schemes, prices, or how to use AgriConnect.",
  },
];

export const SUGGESTED_QUESTIONS = [
  "How do I list my produce?",
  "Tell me about PM-KISAN",
  "Best time to sow wheat?",
  "How to book a tractor?",
  "What is Kisan Credit Card?",
  "How to save water in farming?",
];

export interface ChatAnswer {
  text: string;
  matched: boolean;
  category?: string;
}

/**
 * Score a knowledge entry against a user query. Higher score = better match.
 */
function scoreEntry(entry: KnowledgeEntry, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q === k) score += 100;
    else if (q.includes(k)) score += 10 + k.length; // longer keywords win
    else {
      // word-boundary match
      const words = q.split(/\s+/);
      if (words.includes(k)) score += 8 + k.length;
    }
  }
  return score;
}

export function answerQuery(query: string): ChatAnswer {
  if (!query.trim()) {
    return { text: "Please type a question 🌱", matched: false };
  }
  let best: { entry: KnowledgeEntry; score: number } | null = null;
  for (const e of KNOWLEDGE_BASE) {
    const s = scoreEntry(e, query);
    if (s > 0 && (!best || s > best.score)) best = { entry: e, score: s };
  }
  if (best && best.score >= 8) {
    return { text: best.entry.answer, matched: true, category: best.entry.category };
  }
  return { text: "", matched: false };
}
