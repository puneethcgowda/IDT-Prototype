import { CreditCard, Lock, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  amount: number;
  description: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ open, amount, description, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/28");
  const [cvv, setCvv] = useState("123");
  const [upi, setUpi] = useState("farmer@upi");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        onSuccess();
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <h3 className="font-semibold">Secure Checkout</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 mb-4">
            <p className="text-xs uppercase tracking-wide text-brand-700 font-semibold">
              Amount payable
            </p>
            <p className="text-2xl font-bold text-brand-800">₹{amount.toLocaleString("en-IN")}</p>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(["card", "upi", "netbanking"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`px-3 py-2 rounded-lg border text-sm capitalize ${
                  method === m
                    ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m === "netbanking" ? "Net Banking" : m === "upi" ? "UPI" : "Card"}
              </button>
            ))}
          </div>

          {done ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-brand-100 mx-auto flex items-center justify-center text-brand-600 text-3xl">
                ✓
              </div>
              <p className="mt-3 font-semibold text-gray-800">Payment successful</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              {method === "card" && (
                <>
                  <div>
                    <label className="label">Card number</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        className="input pl-9"
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Expiry</label>
                      <input className="input" value={exp} onChange={(e) => setExp(e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input className="input" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
                    </div>
                  </div>
                </>
              )}
              {method === "upi" && (
                <div>
                  <label className="label">UPI ID</label>
                  <input className="input" value={upi} onChange={(e) => setUpi(e.target.value)} required />
                </div>
              )}
              {method === "netbanking" && (
                <div>
                  <label className="label">Select your bank</label>
                  <select className="input">
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                  </select>
                </div>
              )}

              <button type="submit" disabled={processing} className="btn-primary w-full mt-2">
                <Lock className="w-4 h-4" />
                {processing ? "Processing…" : `Pay ₹${amount.toLocaleString("en-IN")}`}
              </button>

              <p className="text-[11px] text-gray-500 text-center">
                This is a simulated payment gateway for the prototype. No real charge is made.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
