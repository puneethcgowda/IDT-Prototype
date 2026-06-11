import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
  Wind,
  Gauge,
  Eye,
  AlertCircle,
} from "lucide-react";
import { resolveLocation } from "../data/cityCoords";

interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
}

interface OpenMeteoResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    relative_humidity_2m_max: number[];
    uv_index_max: number[];
  };
}

function weatherInfo(code: number): { Icon: any; label: string; color: string; advice: string } {
  if (code === 0) return { Icon: Sun, label: "Clear", color: "text-yellow-500", advice: "Clear skies - optimal for most farming activities" };
  if (code <= 3) return { Icon: Cloud, label: "Cloudy", color: "text-gray-500", advice: "Cloud cover may reduce UV exposure" };
  if (code <= 48) return { Icon: CloudFog, label: "Fog", color: "text-gray-400", advice: "Reduce pesticide spraying due to low visibility" };
  if (code <= 57) return { Icon: CloudDrizzle, label: "Drizzle", color: "text-blue-400", advice: "Light rain - good for germination" };
  if (code <= 67) return { Icon: CloudRain, label: "Rain", color: "text-blue-600", advice: "Heavy rain expected - avoid field work" };
  if (code <= 77) return { Icon: CloudSnow, label: "Snow", color: "text-cyan-300", advice: "Freezing conditions - protect sensitive crops" };
  if (code <= 82) return { Icon: CloudRain, label: "Showers", color: "text-blue-500", advice: "Rain showers - plan irrigation accordingly" };
  if (code <= 86) return { Icon: CloudSnow, label: "Snow showers", color: "text-cyan-400", advice: "Snow showers - high frost risk" };
  if (code <= 99) return { Icon: CloudLightning, label: "Thunder", color: "text-purple-600", advice: "Thunderstorm - severe risk, stay indoors" };
  return { Icon: Cloud, label: "—", color: "text-gray-400", advice: "Check conditions before planning" };
}

function getAdvisory(forecast: DailyForecast[]): { title: string; message: string; color: string; severity: "high" | "medium" | "low" } {
  if (!forecast.length) return { title: "Normal Conditions", message: "Proceed with regular farming operations", color: "text-green-800", severity: "low" };
  
  const week = forecast.slice(0, 7);
  const totalRain = week.reduce((s, d) => s + d.precipitation, 0);
  const maxTemp = Math.max(...week.map((d) => d.tempMax));
  const minTemp = Math.min(...week.map((d) => d.tempMin));
  const rainyDays = week.filter((d) => d.precipitation >= 5).length;
  const maxWind = Math.max(...week.map((d) => d.windSpeed));

  if (rainyDays >= 4) return { 
    title: "Heavy Rainfall Alert", 
    message: "Multiple rainy days expected. Ensure proper drainage. Avoid pesticide application.",
    color: "text-blue-800",
    severity: "high"
  };
  if (maxTemp >= 38) return { 
    title: "Heat Wave Alert", 
    message: "Very high temperatures expected. Increase irrigation frequency and mulch fields.",
    color: "text-red-800",
    severity: "high"
  };
  if (minTemp <= 4) return { 
    title: "Frost Risk Alert", 
    message: "Frost expected. Protect young plants with covers. Avoid frost-sensitive crops.",
    color: "text-blue-800",
    severity: "high"
  };
  if (totalRain < 2 && minTemp > 25) return { 
    title: "Drought Warning", 
    message: "Dry conditions ahead. Plan irrigation carefully. Consider drought-resistant crops.",
    color: "text-orange-800",
    severity: "medium"
  };
  if (maxWind >= 40) return {
    title: "Strong Wind Alert",
    message: "High winds expected. Secure loose structures. Delay spraying activities.",
    color: "text-orange-800",
    severity: "medium"
  };
  return { title: "Normal Conditions", message: "Conditions are favorable for farming operations", color: "text-green-800", severity: "low" };
}

function dayLabel(dateStr: string, idx: number) {
  if (idx === 0) return "Today";
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: "short" });
}

interface Props {
  location?: string;
}

export default function WeatherReport({ location: propLocation }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = propLocation || user?.location || "Mumbai";
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coords = resolveLocation(location);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max,relative_humidity_2m_max,uv_index_max&timezone=auto&forecast_days=14`;

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
          windSpeed: data.daily.windspeed_10m_max[i] || 0,
          humidity: data.daily.relative_humidity_2m_max[i] || 0,
          uvIndex: data.daily.uv_index_max[i] || 0,
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
  }, [coords.lat, coords.lng, t]);

  const today = forecast?.[0];
  const todayInfo = today ? weatherInfo(today.weatherCode) : null;
  const advisory = forecast ? getAdvisory(forecast) : { title: "Loading", message: "", color: "text-gray-800", severity: "low" as const };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Weather Forecast Report</h1>
        <p className="text-gray-600 mt-2">
          Detailed weather forecast for farmers in <span className="font-semibold">{location}</span>
        </p>
      </div>

      {/* Alert Banner */}
      {forecast && (
        <div className={`card mb-6 border-l-4 ${advisory.severity === "high" ? "border-l-red-500 bg-red-50" : advisory.severity === "medium" ? "border-l-orange-500 bg-orange-50" : "border-l-green-500 bg-green-50"} p-6`}>
          <div className="flex items-start gap-4">
            <AlertCircle className={`w-6 h-6 flex-shrink-0 ${advisory.color} mt-0.5`} />
            <div>
              <h3 className={`text-lg font-bold ${advisory.color}`}>{advisory.title}</h3>
              <p className={`mt-1 ${advisory.color}`}>{advisory.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Overview */}
      {today && todayInfo && (
        <div className="card mb-6 overflow-hidden">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm uppercase tracking-wide opacity-90">Today's Weather</div>
                <div className="text-xl opacity-90">{location}</div>
              </div>
              <todayInfo.Icon className="w-20 h-20 opacity-90" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold">{Math.round(today.tempMax)}°</div>
                <div className="text-sm opacity-90">{todayInfo.label}</div>
                <div className="text-xs opacity-75 mt-1">High / Low: {Math.round(today.tempMax)}° / {Math.round(today.tempMin)}°</div>
              </div>
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Rainfall</div>
                  <div className="text-lg font-semibold">{today.precipitation.toFixed(1)} mm</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Wind Speed</div>
                  <div className="text-lg font-semibold">{today.windSpeed.toFixed(1)} km/h</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5" />
                <div>
                  <div className="text-sm opacity-90">Humidity</div>
                  <div className="text-lg font-semibold">{Math.round(today.humidity)}%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border-t border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-900">{todayInfo.advice}</div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="card p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-700 mb-4" />
          <p className="text-gray-600">Loading forecast data...</p>
        </div>
      )}

      {error && (
        <div className="card p-6 bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {forecast && (
        <>
          {/* 7-Day Forecast */}
          <div className="card mb-6 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">7-Day Forecast</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.slice(0, 7).map((d, i) => {
                const info = weatherInfo(d.weatherCode);
                return (
                  <div
                    key={d.date}
                    className={`flex flex-col items-center text-center rounded-lg p-4 border-2 ${
                      i === 0 ? "bg-brand-50 border-brand-200" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">{dayLabel(d.date, i)}</div>
                    <div className="text-xs text-gray-500 mb-2">{new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                    <info.Icon className={`w-8 h-8 my-2 ${info.color}`} />
                    <div className="text-lg font-bold text-gray-900">{Math.round(d.tempMax)}°</div>
                    <div className="text-sm text-gray-500">{Math.round(d.tempMin)}°</div>
                    {d.precipitation >= 1 && (
                      <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> {d.precipitation.toFixed(0)}mm
                      </div>
                    )}
                    <div className="text-xs text-gray-600 mt-2">{info.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Forecast Cards */}
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">14-Day Detailed Forecast</h2>
            <div className="space-y-4">
              {forecast.map((d, i) => {
                const info = weatherInfo(d.weatherCode);
                return (
                  <div key={d.date} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="font-semibold text-gray-900">
                            {dayLabel(d.date, i)} - {new Date(d.date).toLocaleDateString()}
                          </div>
                          <info.Icon className={`w-5 h-5 ${info.color}`} />
                          <span className="text-sm font-medium text-gray-700">{info.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{info.advice}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Temperature</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {Math.round(d.tempMax)}° / {Math.round(d.tempMin)}°
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase">
                          <Droplets className="w-3 h-3" /> Rainfall
                        </div>
                        <div className="text-lg font-semibold text-gray-900">{d.precipitation.toFixed(1)} mm</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase">
                          <Wind className="w-3 h-3" /> Wind
                        </div>
                        <div className="text-lg font-semibold text-gray-900">{d.windSpeed.toFixed(0)} km/h</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 uppercase">
                          <Gauge className="w-3 h-3" /> Humidity
                        </div>
                        <div className="text-lg font-semibold text-gray-900">{Math.round(d.humidity)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farming Tips */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Farming Recommendations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Irrigation</h3>
                <p className="text-sm text-blue-800">
                  {forecast[0].precipitation >= 5 ? "Reduce irrigation frequency due to expected rainfall." : "Plan irrigation based on forecast. Consider recent rainfall trends."}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Pesticide Application</h3>
                <p className="text-sm text-green-800">
                  {forecast.slice(0, 7).some((d) => d.precipitation >= 5 || d.windSpeed > 30) ? "Avoid spraying during rainy/windy days." : "Conditions are favorable for pesticide application this week."}
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Harvesting</h3>
                <p className="text-sm text-orange-800">
                  {forecast[0].weatherCode === 0 || forecast[0].weatherCode <= 3 ? "Good window for harvesting in next 2-3 days." : "Wait for clear weather before harvesting."}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">Frost Protection</h3>
                <p className="text-sm text-red-800">
                  {forecast.some((d) => d.tempMin <= 5) ? "Frost risk detected. Prepare frost protection measures." : "No immediate frost risk detected."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
