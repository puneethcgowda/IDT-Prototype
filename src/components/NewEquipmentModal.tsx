import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import type { EquipmentCategory } from "../types";

const CATEGORIES: EquipmentCategory[] = [
  "Tractor", "Harvester", "Plough", "Seeder", "Sprayer", "Irrigation",
];

const EMOJI_BY_CAT: Record<EquipmentCategory, string> = {
  Tractor: "🚜",
  Harvester: "🌾",
  Plough: "⚙️",
  Seeder: "🌱",
  Sprayer: "💦",
  Irrigation: "💧",
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewEquipmentModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const { addEquipment } = useData();
  const [name, setName] = useState("");
  const [cat, setCat] = useState<EquipmentCategory>("Tractor");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  if (!open || !user) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment({
      ownerId: user.id,
      name: name.trim(),
      category: cat,
      description: desc.trim(),
      pricePerDay: Number(price),
      location: user.location,
      available: true,
      imageEmoji: EMOJI_BY_CAT[cat],
    });
    setName(""); setDesc(""); setPrice("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold">List new equipment for rent</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Mahindra 575 DI" />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={cat} onChange={(e) => setCat(e.target.value as EquipmentCategory)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </div>
          <div>
            <label className="label">Price (₹/day)</label>
            <input className="input" type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
            <button className="btn-primary" type="submit">Publish equipment</button>
          </div>
        </form>
      </div>
    </div>
  );
}
