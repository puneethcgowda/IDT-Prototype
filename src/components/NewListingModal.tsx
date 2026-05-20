import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { seedCrops } from "../data/mockData";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMOJI_BY_CROP: Record<string, string> = {
  Tomato: "🍅",
  Wheat: "🌾",
  Onion: "🧅",
  Ragi: "🌱",
  "Tur Dal": "🫘",
  Maize: "🌽",
  Sugarcane: "🎋",
  Cotton: "☁️",
};

export default function NewListingModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const { addListing } = useData();
  const [title, setTitle] = useState("");
  const [crop, setCrop] = useState("Tomato");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  if (!open || !user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      farmerId: user.id,
      title: title.trim(),
      cropType: crop,
      description: desc.trim(),
      pricePerKg: Number(price),
      quantityKg: Number(qty),
      location: user.location,
      available: true,
      imageEmoji: EMOJI_BY_CROP[crop] ?? "🌿",
    });
    setTitle(""); setDesc(""); setPrice(""); setQty("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold">Add a new listing</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Fresh Organic Tomatoes" />
          </div>
          <div>
            <label className="label">Crop</label>
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
              {seedCrops.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹/kg)</label>
              <input className="input" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="label">Quantity (kg)</label>
              <input className="input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button className="btn-primary" type="submit">Publish listing</button>
          </div>
        </form>
      </div>
    </div>
  );
}
