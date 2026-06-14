import { useState } from "react";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import type { Listing } from "../types";

interface ProductCartProps {
  product: Listing;
  onAddToCart?: (quantity: number) => void;
  onClose?: () => void;
}

export default function ProductCart({
  product,
  onAddToCart,
  onClose,
}: ProductCartProps) {
  const [quantity, setQuantity] = useState(100);
  const [cartAdded, setCartAdded] = useState(false);

  const handleQuantityChange = (value: number) => {
    if (value >= 100 && value <= Math.floor(product.quantityKg * 1000)) {
      setQuantity(value);
    }
  };

  const increment = () => {
    handleQuantityChange(quantity + 100);
  };

  const decrement = () => {
    handleQuantityChange(quantity - 100);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(quantity);
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const maxGrams = Math.floor(product.quantityKg * 1000);
  const pricePerGram = product.pricePerKg / 1000;
  const totalPrice = (quantity * pricePerGram).toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="label">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            onClick={decrement}
            disabled={quantity <= 100}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              className="input text-center"
              step={100}
              min={100}
              max={maxGrams}
            />
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
              grams
            </span>
          </div>

          <button
            onClick={increment}
            disabled={quantity >= maxGrams}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Available: {maxGrams.toLocaleString()} grams ({product.quantityKg} kg)
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="bg-brand-50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price per gram</span>
          <span className="font-medium">₹{pricePerGram.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Quantity</span>
          <span className="font-medium">{quantity} g</span>
        </div>
        <div className="pt-2 border-t border-brand-200 flex justify-between">
          <span className="font-semibold text-gray-900">Total Price</span>
          <span className="text-lg font-bold text-brand-700">₹{totalPrice}</span>
        </div>
      </div>

      {/* Availability Status */}
      {!product.available && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">
          This product is currently out of stock.
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!product.available}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
          product.available
            ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-95"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {cartAdded ? "Added to cart!" : "Add to cart"}
      </button>

      {/* Buyer Benefits */}
      <div className="bg-green-50 rounded-lg p-3 text-sm space-y-1">
        <p className="font-semibold text-green-900">Why buy from farmers?</p>
        <ul className="text-green-800 text-xs space-y-1">
          <li>✓ Fresh produce direct from farmers</li>
          <li>✓ Guaranteed organic & pesticide-free</li>
          <li>✓ Better prices than retail markets</li>
          <li>✓ Support local farmers directly</li>
        </ul>
      </div>
    </div>
  );
}
