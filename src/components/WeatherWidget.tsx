import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Droplets,
  ThermometerSun,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { resolveLocation } from "../data/cityCoords";

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
}

// Map WMO weather codes -> icon + short label
function weatherInfo(code: number): { Icon: any; label: string; color: string } {
  if (code === 0) return { Icon: Sun, label: "Clear", color: "text-yellow-500" };
  if (code <= 3) return { Icon: Cloud, label: "Cloudy", color: "text-gray-500" };
  if (code <= 48) return { Icon: CloudFog, label: "Fog", color: "text-gray-400" };
  if (code <= 57) return { Icon: CloudDrizzle, label: "Drizzle", color: "text-blue-400" };
  if (code <= 67) return { Icon: CloudRain, label: "Rain", color: "text-blue-600" };
  if (code <= 77) return { Icon: CloudSnow, label: "Snow", color: "text-cyan-300" };
  if (code <= 82) return { Icon: CloudRain, label: "Showers", color: "text-blue-500" };
  if (code <= 86) return { Icon: CloudSnow, label: "Snow showers", color: "text-cyan-400" };
  if (code <= 99) return { Icon: CloudLightning, label: "Thunder", color: "text-purple-600" };
  return { Icon: Cloud, label: "—", color: "text-gray-400" };
}

function dayLabel(dateStr: string, idx: number, todayLbl: string) {
  if (idx === 0) return todayLbl;
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: "short" });
}

function pickAdvisoryKey(forecast: DailyForecast[]): string {
  if (!forecast.length) return "weather.advisoryNormal";
  const week = forecast.slice(0, 7);
  const totalRain = week.reduce((s, d) => s + d.precipitation, 0);
  const maxTemp = Math.max(...week.map((d) => d.tempMax));
  const rainyDays = week.filter((d) => d.precipitation >= 5).length;

  if (rainyDays >= 3) return "weather.advisoryRain";
  if (maxTemp >= 38) return "weather.advisoryHeat";
  if (totalRain < 2) return "weather.advisoryDry";
  return "weather.advisoryNormal";
}

interface Props {
  location: string;
}

export default function WeatherWidget({ location }: Props) {
  const { t } = useTranslation();
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coords = resolveLocation(location);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Network error");
        return r.json() as Promise<OpenMeteoResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        const days: DailyForecast[] = data.daily.time.map((d, i) => ({
          date: d,
          weatherCode: data.daily.weathercode[i],
          tempMax: data.daily.temperature_2m_max[i],
          tempMin: data.daily.temperature_2m_min[i],
          precipitation: data.daily.precipitation_sum[i],
        }));
        setForecast(days);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(t("weather.error"));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lng]);

  const todayLbl = t("weather.today");
  const today = forecast?.[0];
  const todayInfo = today ? weatherInfo(today.weatherCode) : null;
  const advisoryKey = forecast ? pickAdvisoryKey(forecast) : "weather.advisoryNormal";

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-90">
              {t("weather.title")}
            </div>
            <div className="text-sm opacity-90">
              {t("weather.subtitle", { location })}
            </div>
          </div>
          {todayInfo && <todayInfo.Icon className="w-12 h-12 opacity-90" />}
        </div>

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("weather.loading")}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-sm bg-white/10 rounded-md px-3 py-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}

        {today && (
          <div className="mt-4 flex items-end gap-4">
            <div>
              <div className="text-4xl font-bold leading-none">
                {Math.round(today.tempMax)}°
                <span className="text-xl font-normal opacity-75 ml-1">
                  / {Math.round(today.tempMin)}°
                </span>
              </div>
              <div className="text-sm opacity-90 mt-1">{todayInfo?.label}</div>
            </div>
            <div className="ml-auto text-right text-xs opacity-90 space-y-0.5">
              <div className="flex items-center gap-1 justify-end">
                <ThermometerSun className="w-3.5 h-3.5" /> {t("weather.high")}{" "}
                {Math.round(today.tempMax)}°C
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Droplets className="w-3.5 h-3.5" />
                {t("weather.rain")} {today.precipitation.toFixed(1)} mm
              </div>
            </div>
          </div>
        )}
      </div>

      {forecast && (
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1.5">
            {forecast.map((d, i) => {
              const info = weatherInfo(d.weatherCode);
              return (
                <div
                  key={d.date}
                  className={`flex flex-col items-center text-center rounded-lg p-2 ${
                    i === 0 ? "bg-brand-50 border border-brand-100" : "bg-gray-50"
                  }`}
                >
                  <div className="text-[10px] font-medium text-gray-600 uppercase">
                    {dayLabel(d.date, i, todayLbl)}
                  </div>
                  <info.Icon className={`w-5 h-5 my-1 ${info.color}`} />
                  <div className="text-xs font-semibold text-gray-900">
                    {Math.round(d.tempMax)}°
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {Math.round(d.tempMin)}°
                  </div>
                  {d.precipitation >= 1 && (
                    <div className="text-[9px] text-blue-600 mt-0.5">
                      {d.precipitation.toFixed(0)}mm
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                {t("weather.advisory")}
              </div>
              <div className="text-sm text-amber-900 mt-0.5">
                {t(advisoryKey)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
