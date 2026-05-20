import type {
  Booking,
  Listing,
  Message,
  Order,
  Review,
  SavedItem,
  User,
  Equipment,
} from "../types";
import {
  seedEquipment,
  seedListings,
  seedReviews,
  seedUsers,
} from "../data/mockData";

const KEYS = {
  users: "agri.users",
  listings: "agri.listings",
  equipment: "agri.equipment",
  bookings: "agri.bookings",
  orders: "agri.orders",
  reviews: "agri.reviews",
  messages: "agri.messages",
  saved: "agri.saved",
  currentUser: "agri.currentUser",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  init() {
    if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
    if (!localStorage.getItem(KEYS.listings)) write(KEYS.listings, seedListings);
    if (!localStorage.getItem(KEYS.equipment))
      write(KEYS.equipment, seedEquipment);
    if (!localStorage.getItem(KEYS.reviews)) write(KEYS.reviews, seedReviews);
    if (!localStorage.getItem(KEYS.bookings)) write(KEYS.bookings, []);
    if (!localStorage.getItem(KEYS.orders)) write(KEYS.orders, []);
    if (!localStorage.getItem(KEYS.messages)) write(KEYS.messages, []);
    if (!localStorage.getItem(KEYS.saved)) write(KEYS.saved, []);
  },

  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (v: User[]) => write(KEYS.users, v),

  getListings: () => read<Listing[]>(KEYS.listings, []),
  setListings: (v: Listing[]) => write(KEYS.listings, v),

  getEquipment: () => read<Equipment[]>(KEYS.equipment, []),
  setEquipment: (v: Equipment[]) => write(KEYS.equipment, v),

  getBookings: () => read<Booking[]>(KEYS.bookings, []),
  setBookings: (v: Booking[]) => write(KEYS.bookings, v),

  getOrders: () => read<Order[]>(KEYS.orders, []),
  setOrders: (v: Order[]) => write(KEYS.orders, v),

  getReviews: () => read<Review[]>(KEYS.reviews, []),
  setReviews: (v: Review[]) => write(KEYS.reviews, v),

  getMessages: () => read<Message[]>(KEYS.messages, []),
  setMessages: (v: Message[]) => write(KEYS.messages, v),

  getSaved: () => read<SavedItem[]>(KEYS.saved, []),
  setSaved: (v: SavedItem[]) => write(KEYS.saved, v),

  getCurrentUserId: () => read<string | null>(KEYS.currentUser, null),
  setCurrentUserId: (id: string | null) => write(KEYS.currentUser, id),

  reset() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(
    36
  )}`;
}
