import { Link, NavLink, useNavigate } from "react-router-dom";
import { Leaf, LogOut, MessageCircle, Menu, X, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { messages } = useData();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/marketplace", label: t("nav.marketplace"), id: "nav-marketplace" },
    { to: "/equipment", label: t("nav.equipment"), id: "nav-equipment" },
    { to: "/crops", label: t("nav.crops"), id: "nav-crops" },
    { to: "/schemes", label: t("nav.schemes"), id: "nav-schemes" },
  ];

  const unread = user
    ? messages.filter((m) => m.toUserId === user.id && !m.read).length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-700">
          <Leaf className="w-6 h-6" />
          <span>AgriConnect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              id={l.id}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link
                id="nav-messages"
                to="/messages"
                className="relative p-2 rounded-md hover:bg-gray-100"
                aria-label="Messages"
              >
                <MessageCircle className="w-5 h-5 text-gray-700" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </Link>
              <Link id="nav-dashboard" to="/dashboard" className="btn-secondary text-sm">
                {t("nav.dashboard")}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 pl-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: user.avatarColor }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-ghost text-sm"
                aria-label={t("nav.logout")}
                title={t("nav.logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">
                {t("nav.login")}
              </Link>
              <Link to="/signup" className="btn-primary text-sm">
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher compact />
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-brand-50 text-brand-700" : "text-gray-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="border-t pt-2 mt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    {t("nav.dashboard")}
                  </Link>
                  <Link to="/messages" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    {t("nav.messages")} {unread > 0 && <span className="badge bg-red-100 text-red-700 ml-1">{unread}</span>}
                  </Link>
                  <Link to="/profile" onClick={() => setOpen(false)} className="px-3 py-2 text-sm flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> {t("nav.profile")}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      navigate("/");
                    }}
                    className="px-3 py-2 text-sm text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm">
                    {t("nav.login")}
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-semibold text-brand-700">
                    {t("nav.signup")}
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
