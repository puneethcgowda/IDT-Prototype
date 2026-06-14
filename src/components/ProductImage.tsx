import React from "react";

interface ProductImageProps {
  emoji?: string;
  cropType?: string;
  title?: string;
  size?: "small" | "medium" | "large";
  inStock?: boolean;
}

export default function ProductImage({
  emoji = "🌾",
  cropType = "Product",
  title = "Farm Fresh Produce",
  size = "medium",
  inStock = true,
}: ProductImageProps) {
  const sizeClasses = {
    small: "w-full aspect-square",
    medium: "aspect-[4/3]",
    large: "aspect-[16/9]",
  };

  const emojiSizes = {
    small: "text-4xl",
    medium: "text-7xl",
    large: "text-9xl",
  };

  const gradients: Record<string, string> = {
    Tomato: "from-red-100 via-orange-50 to-red-50",
    Onion: "from-yellow-100 via-orange-50 to-yellow-50",
    Wheat: "from-amber-100 via-yellow-50 to-amber-50",
    Mango: "from-amber-100 via-orange-50 to-red-50",
    Carrot: "from-orange-100 via-orange-50 to-yellow-50",
    Leafy: "from-green-100 via-emerald-50 to-green-50",
    Capsicum: "from-green-100 via-lime-50 to-yellow-50",
    Brinjal: "from-purple-100 via-pink-50 to-purple-50",
    Cucumber: "from-green-100 via-cyan-50 to-blue-50",
    Banana: "from-yellow-100 via-amber-50 to-yellow-50",
    Papaya: "from-orange-100 via-red-50 to-orange-50",
    Orange: "from-orange-100 via-yellow-50 to-orange-50",
    "Tur Dal": "from-orange-100 via-amber-50 to-yellow-50",
    Ragi: "from-red-100 via-orange-50 to-amber-50",
    Maize: "from-yellow-100 via-amber-50 to-orange-50",
    Rice: "from-yellow-100 via-white to-yellow-50",
    Spices: "from-amber-100 via-orange-50 to-red-50",
    Honey: "from-amber-100 via-yellow-50 to-orange-50",
    "Cow Milk": "from-blue-50 via-white to-blue-50",
    Ghee: "from-yellow-100 via-amber-50 to-orange-50",
    Paneer: "from-white via-yellow-50 to-orange-50",
    Eggs: "from-yellow-100 via-amber-50 to-white",
  };

  const getGradient = (type: string) => {
    return gradients[type] || "from-brand-50 to-yellow-50";
  };

  const gradientClass = getGradient(cropType);

  return (
    <div
      className={`relative ${sizeClasses[size]} bg-gradient-to-br ${gradientClass} rounded-2xl overflow-hidden flex items-center justify-center`}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-2 w-20 h-20 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main emoji with shine effect */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative">
          <div className={`${emojiSizes[size]} drop-shadow-lg animate-bounce`}>
            {emoji}
          </div>
          {/* Shine effect */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full opacity-30 blur-sm"></div>
        </div>

        {/* Product Label */}
        {size === "large" && (
          <div className="mt-4 text-center z-20">
            <p className="text-sm font-semibold text-gray-700">{cropType}</p>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
        )}
      </div>

      {/* Status Badge */}
      {!inStock && (
        <div className="absolute top-3 left-3 z-20 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Out of Stock
        </div>
      )}

      {/* Fresh Badge */}
      {inStock && (
        <div className="absolute top-3 right-3 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          ✓ Fresh
        </div>
      )}

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/20 to-transparent rounded-full -mr-16 -mb-16"></div>
    </div>
  );
}
