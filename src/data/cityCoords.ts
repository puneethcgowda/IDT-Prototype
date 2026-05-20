// Approximate lat/lng for known cities — used for the weather widget
// and the marketplace/equipment map. Falls back to centre of India if unknown.
export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Gujarat
  "anand, gujarat": { lat: 22.5645, lng: 72.9289 },
  "ahmedabad, gujarat": { lat: 23.0225, lng: 72.5714 },
  "rajkot, gujarat": { lat: 22.3039, lng: 70.8022 },
  "surat, gujarat": { lat: 21.1702, lng: 72.8311 },
  "vadodara, gujarat": { lat: 22.3072, lng: 73.1812 },

  // Karnataka
  "mysuru, karnataka": { lat: 12.2958, lng: 76.6394 },
  "mysore, karnataka": { lat: 12.2958, lng: 76.6394 },
  "bengaluru, karnataka": { lat: 12.9716, lng: 77.5946 },
  "bangalore, karnataka": { lat: 12.9716, lng: 77.5946 },
  "hubli, karnataka": { lat: 15.3647, lng: 75.124 },
  "mangaluru, karnataka": { lat: 12.9141, lng: 74.856 },
  "belagavi, karnataka": { lat: 15.8497, lng: 74.4977 },

  // Maharashtra
  "mumbai, maharashtra": { lat: 19.076, lng: 72.8777 },
  "pune, maharashtra": { lat: 18.5204, lng: 73.8567 },
  "nashik, maharashtra": { lat: 19.9975, lng: 73.7898 },
  "nagpur, maharashtra": { lat: 21.1458, lng: 79.0882 },

  // Punjab
  "ludhiana, punjab": { lat: 30.901, lng: 75.8573 },
  "amritsar, punjab": { lat: 31.634, lng: 74.8723 },

  // Tamil Nadu
  "chennai, tamil nadu": { lat: 13.0827, lng: 80.2707 },
  "coimbatore, tamil nadu": { lat: 11.0168, lng: 76.9558 },
  "madurai, tamil nadu": { lat: 9.9252, lng: 78.1198 },

  // UP / Bihar / WB
  "lucknow, uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  "varanasi, uttar pradesh": { lat: 25.3176, lng: 82.9739 },
  "patna, bihar": { lat: 25.5941, lng: 85.1376 },
  "kolkata, west bengal": { lat: 22.5726, lng: 88.3639 },

  // Other
  "hyderabad, telangana": { lat: 17.385, lng: 78.4867 },
  "delhi": { lat: 28.6139, lng: 77.209 },
  "new delhi": { lat: 28.6139, lng: 77.209 },
  "jaipur, rajasthan": { lat: 26.9124, lng: 75.7873 },
  "bhopal, madhya pradesh": { lat: 23.2599, lng: 77.4126 },
};

export const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };

/**
 * Resolve a "City, State" string to lat/lng. Tries case-insensitive exact match,
 * then partial (city only), and finally falls back to the centre of India with a
 * small jitter so multiple unknown locations don't all stack on the same pin.
 */
export function resolveLocation(location: string): { lat: number; lng: number; resolved: boolean } {
  const key = location.trim().toLowerCase();
  if (CITY_COORDS[key]) return { ...CITY_COORDS[key], resolved: true };

  // Try matching just the city portion before the comma
  const cityOnly = key.split(",")[0].trim();
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (k.startsWith(cityOnly + ",") || k === cityOnly) {
      return { ...v, resolved: true };
    }
  }

  // Stable jitter from string hash so unknown locations spread out a bit
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = (hash * 31 + location.charCodeAt(i)) | 0;
  }
  const jitterLat = ((hash & 0xff) / 255 - 0.5) * 6;
  const jitterLng = (((hash >> 8) & 0xff) / 255 - 0.5) * 6;
  return {
    lat: INDIA_CENTER.lat + jitterLat,
    lng: INDIA_CENTER.lng + jitterLng,
    resolved: false,
  };
}
