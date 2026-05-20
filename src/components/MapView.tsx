import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { resolveLocation, INDIA_CENTER } from "../data/cityCoords";

// We rely on Leaflet loaded via CDN in index.html (window.L is the global).
declare global {
  interface Window {
    L: any;
  }
}

export interface MapPoint {
  id: string;
  type: "listing" | "equipment";
  title: string;
  subtitle: string; // price + unit
  emoji: string;
  location: string;
  available: boolean;
  href: string;
  ownerName?: string;
}

interface Props {
  points: MapPoint[];
  height?: string;
}

export default function MapView({ points, height = "560px" }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const layerRef = useRef<any>(null);

  // Resolve lat/lng for each point once
  const enriched = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        coords: resolveLocation(p.location),
      })),
    [points]
  );

  // Initialise map once Leaflet is available
  useEffect(() => {
    let cancelled = false;
    let pollId: number | undefined;

    const init = () => {
      if (cancelled) return;
      const L = window.L;
      if (!L || !mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        center: [INDIA_CENTER.lat, INDIA_CENTER.lng],
        zoom: 5,
        scrollWheelZoom: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;
      layerRef.current = L.layerGroup().addTo(map);
    };

    if (window.L) {
      init();
    } else {
      // Wait for the CDN script (in index.html) to load
      pollId = window.setInterval(() => {
        if (window.L) {
          window.clearInterval(pollId);
          init();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers whenever enriched points change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstance.current || !layerRef.current) return;

    layerRef.current.clearLayers();

    if (enriched.length === 0) return;

    const bounds: [number, number][] = [];

    enriched.forEach((p) => {
      const html = `
        <div style="
          background:${p.available ? "#16a34a" : "#9ca3af"};
          color:white;
          width:38px;
          height:38px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:18px;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          border:2px solid white;
        ">
          <span style="transform:rotate(45deg);">${p.emoji}</span>
        </div>
      `;
      const icon = L.divIcon({
        className: "agri-marker",
        html,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([p.coords.lat, p.coords.lng], { icon });

      const popupHtml = `
        <div style="font-family:Inter,system-ui,sans-serif;min-width:180px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#16a34a;font-weight:600;">
            ${p.type === "listing" ? "Marketplace" : "Equipment"}
          </div>
          <div style="font-size:14px;font-weight:600;color:#111827;margin-top:2px;">
            ${p.emoji} ${escapeHtml(p.title)}
          </div>
          <div style="font-size:12px;color:#16a34a;font-weight:600;margin-top:2px;">
            ${escapeHtml(p.subtitle)}
          </div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">
            📍 ${escapeHtml(p.location)}${
              p.ownerName ? ` · ${escapeHtml(p.ownerName)}` : ""
            }
          </div>
          <div style="margin-top:8px;">
            <a href="${p.href}" data-spa-link="1"
              style="display:inline-block;background:#16a34a;color:white;text-decoration:none;
                     padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;">
              View details →
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      marker.addTo(layerRef.current);
      bounds.push([p.coords.lat, p.coords.lng]);
    });

    if (bounds.length === 1) {
      mapInstance.current.setView(bounds[0], 8);
    } else if (bounds.length > 1) {
      mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [enriched]);

  // Intercept popup link clicks to use SPA navigation instead of full reload
  useEffect(() => {
    if (!mapRef.current) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[data-spa-link]");
      if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          // Trigger react-router navigation by dispatching a popstate event
          // — simpler: use a hidden Link click. We just push to history & dispatch event.
          window.history.pushState({}, "", href);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
    };
    const el = mapRef.current;
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, []);

  return (
    <div className="card overflow-hidden">
      <div ref={mapRef} style={{ height, width: "100%" }} className="bg-gray-100" />
      {enriched.some((p) => !p.coords.resolved) && (
        <div className="px-3 py-2 text-[11px] text-gray-500 bg-gray-50 border-t border-gray-100">
          Some locations are approximate (city not in our coordinate database).{" "}
          <Link to="/about" className="text-brand-700 hover:underline">Learn more</Link>
        </div>
      )}
    </div>
  );
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}
