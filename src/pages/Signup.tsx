import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, Sprout, ShoppingBasket } from "lucide-react";
import type { UserRole } from "../types";
import { seedCrops } from "../data/mockData";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>("farmer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [farmSizeAcres, setFarmSizeAcres] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const toggleInterest = (c: string) => {
    setInterests((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (interests.length === 0) {
      setErr(
        role === "farmer"
          ? "Please select at least one crop you grow."
          : "Please select at least one product you're looking for."
      );
      return;
    }
    const r = signup({
      role,
      name,
      email,
      password,
      phone,
      location,
      bio,
      farmSizeAcres: role === "farmer" && farmSizeAcres ? Number(farmSizeAcres) : undefined,
      interests,
    });
    if (!r.ok) setErr(r.error || "Could not sign up");
    else navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-center gap-2 text-brand-700 mb-6">
        <Leaf className="w-6 h-6" />
        <span className="font-bold text-xl">AgriConnect</span>
      </div>
      <div className="card p-6">
        <h1 className="text-xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Step {step} of 2 — {step === 1 ? "Choose your role" : "Tell us a bit about you"}
        </p>

        {err && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{err}</div>}

        {step === 1 ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("farmer")}
                className={`p-5 rounded-xl border-2 text-left transition ${
                  role === "farmer"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Sprout className="w-7 h-7 text-brand-600 mb-2" />
                <h3 className="font-semibold">I'm a Farmer</h3>
                <p className="text-sm text-gray-600">
                  Sell produce directly to consumers, list equipment, and access schemes.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRole("consumer")}
                className={`p-5 rounded-xl border-2 text-left transition ${
                  role === "consumer"
                    ? "border-brand-500 bg-brand-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <ShoppingBasket className="w-7 h-7 text-brand-600 mb-2" />
                <h3 className="font-semibold">I'm a Consumer</h3>
                <p className="text-sm text-gray-600">
                  Buy fresh produce direct from farmers and rent equipment.
                </p>
              </button>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full">
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Full name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  required
                />
              </div>
              <div>
                <label className="label">Location (City, State)</label>
                <input
                  className="input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {role === "farmer" && (
                <div>
                  <label className="label">Farm size (acres)</label>
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    placeholder="e.g. 1.5"
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="label">Short bio (optional)</label>
                <textarea
                  className="input"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    role === "farmer"
                      ? "Tell consumers about your farm..."
                      : "What kind of produce are you looking for?"
                  }
                />
              </div>
            </div>

            <div>
              <label className="label">
                {role === "farmer" ? "Crops you grow" : "Products you're looking for"}
              </label>
              <div className="flex flex-wrap gap-2">
                {seedCrops.map((c) => {
                  const on = interests.includes(c.name);
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => toggleInterest(c.name)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        on
                          ? "border-brand-500 bg-brand-100 text-brand-800"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mr-1">{c.emoji}</span>
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                Back
              </button>
              <button className="btn-primary flex-1" type="submit">
                Create account
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-700 font-medium hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
