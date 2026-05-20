import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password);
    if (!r.ok) setErr(r.error || "Login failed");
    else navigate("/dashboard");
  };

  const quickFill = (e: string) => {
    setEmail(e);
    setPassword("demo1234");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="flex items-center justify-center gap-2 text-brand-700 mb-6">
        <Leaf className="w-6 h-6" />
        <span className="font-bold text-xl">AgriConnect</span>
      </div>
      <div className="card p-6">
        <h1 className="text-xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to continue.</p>
        {err && <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-3">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
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
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary w-full" type="submit">
            Log in
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600 text-center">
          New here?{" "}
          <Link to="/signup" className="text-brand-700 font-medium hover:underline">
            Create an account
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Demo accounts</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => quickFill("ramesh@farm.in")}
              className="text-left text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <div className="font-medium">Farmer · Ramesh Patel</div>
              <div className="text-xs text-gray-500">ramesh@farm.in / demo1234</div>
            </button>
            <button
              type="button"
              onClick={() => quickFill("anita@buyer.in")}
              className="text-left text-sm px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <div className="font-medium">Consumer · Anita Sharma</div>
              <div className="text-xs text-gray-500">anita@buyer.in / demo1234</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
