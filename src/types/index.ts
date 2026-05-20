export type UserRole = "farmer" | "consumer";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string; // prototype only — plain string
  phone: string;
  location: string;
  bio?: string;
  // Farmers: crops grown; Consumers: products sought
  interests: string[];
  farmSizeAcres?: number;
  avatarColor: string;
  createdAt: string;
  hasCompletedOnboarding?: boolean;
}

export interface Listing {
  id: string;
  farmerId: string;
  title: string;
  cropType: string;
  description: string;
  pricePerKg: number;
  quantityKg: number;
  location: string;
  available: boolean;
  imageEmoji: string;
  createdAt: string;
}

export type EquipmentCategory =
  | "Tractor"
  | "Harvester"
  | "Plough"
  | "Seeder"
  | "Sprayer"
  | "Irrigation";

export interface Equipment {
  id: string;
  ownerId: string; // farmer or rental provider id
  name: string;
  category: EquipmentCategory;
  description: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  imageEmoji: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  consumerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantityKg: number;
  totalAmount: number;
  status: "paid" | "packed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface Review {
  id: string;
  authorId: string;
  targetUserId: string;
  rating: number; // 1-5
  comment: string;
  context: "product" | "equipment" | "general";
  refId?: string; // listing/equipment id
  createdAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  season: "Kharif" | "Rabi" | "Zaid" | "All Year";
  marketPricePerKg: number;
  trend: "up" | "down" | "stable";
  description: string;
  bestPractices: string[];
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  benefit: string;
  eligibility: string;
  link: string;
  category: string;
}

export interface SavedItem {
  id: string;
  userId: string;
  refId: string; // listing id or equipment id
  type: "listing" | "equipment";
  createdAt: string;
}
