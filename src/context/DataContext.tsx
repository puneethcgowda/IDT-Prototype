import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Booking,
  Equipment,
  Listing,
  Message,
  Order,
  Review,
  SavedItem,
  User,
} from "../types";
import { storage, uid } from "../utils/storage";

interface DataContextValue {
  users: User[];
  listings: Listing[];
  equipment: Equipment[];
  bookings: Booking[];
  orders: Order[];
  reviews: Review[];
  messages: Message[];
  saved: SavedItem[];

  refresh: () => void;

  addListing: (l: Omit<Listing, "id" | "createdAt">) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

  addEquipment: (e: Omit<Equipment, "id" | "createdAt">) => Equipment;
  updateEquipment: (id: string, patch: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;

  createOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  createBooking: (b: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;

  addReview: (r: Omit<Review, "id" | "createdAt">) => Review;

  sendMessage: (fromUserId: string, toUserId: string, text: string) => Message;
  markThreadRead: (otherId: string, meId: string) => void;

  toggleSaved: (userId: string, refId: string, type: SavedItem["type"]) => void;
  isSaved: (userId: string, refId: string) => boolean;

  getUserById: (id: string) => User | undefined;
  getAverageRating: (userId: string) => { avg: number; count: number };
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    storage.init();
  }, []);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Re-read from storage on every tick / mount.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = tick;
  const users = storage.getUsers();
  const listings = storage.getListings();
  const equipment = storage.getEquipment();
  const bookings = storage.getBookings();
  const orders = storage.getOrders();
  const reviews = storage.getReviews();
  const messages = storage.getMessages();
  const saved = storage.getSaved();

  const addListing: DataContextValue["addListing"] = useCallback((l) => {
    const item: Listing = { ...l, id: uid("listing"), createdAt: new Date().toISOString() };
    storage.setListings([item, ...storage.getListings()]);
    refresh();
    return item;
  }, [refresh]);

  const updateListing: DataContextValue["updateListing"] = useCallback((id, patch) => {
    storage.setListings(storage.getListings().map((l) => (l.id === id ? { ...l, ...patch } : l)));
    refresh();
  }, [refresh]);

  const deleteListing: DataContextValue["deleteListing"] = useCallback((id) => {
    storage.setListings(storage.getListings().filter((l) => l.id !== id));
    refresh();
  }, [refresh]);

  const addEquipment: DataContextValue["addEquipment"] = useCallback((e) => {
    const item: Equipment = { ...e, id: uid("eq"), createdAt: new Date().toISOString() };
    storage.setEquipment([item, ...storage.getEquipment()]);
    refresh();
    return item;
  }, [refresh]);

  const updateEquipment: DataContextValue["updateEquipment"] = useCallback((id, patch) => {
    storage.setEquipment(
      storage.getEquipment().map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
    refresh();
  }, [refresh]);

  const deleteEquipment: DataContextValue["deleteEquipment"] = useCallback((id) => {
    storage.setEquipment(storage.getEquipment().filter((e) => e.id !== id));
    refresh();
  }, [refresh]);

  const createOrder: DataContextValue["createOrder"] = useCallback((o) => {
    const order: Order = {
      ...o,
      id: uid("order"),
      status: "paid",
      createdAt: new Date().toISOString(),
    };
    storage.setOrders([order, ...storage.getOrders()]);
    // decrement listing quantity
    const ls = storage.getListings().map((l) => {
      if (l.id !== o.listingId) return l;
      const remaining = Math.max(0, l.quantityKg - o.quantityKg);
      return { ...l, quantityKg: remaining, available: remaining > 0 };
    });
    storage.setListings(ls);
    refresh();
    return order;
  }, [refresh]);

  const createBooking: DataContextValue["createBooking"] = useCallback((b) => {
    const booking: Booking = {
      ...b,
      id: uid("bk"),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    storage.setBookings([booking, ...storage.getBookings()]);
    refresh();
    return booking;
  }, [refresh]);

  const updateOrderStatus: DataContextValue["updateOrderStatus"] = useCallback((id, status) => {
    storage.setOrders(
      storage.getOrders().map((o) => (o.id === id ? { ...o, status } : o))
    );
    refresh();
  }, [refresh]);

  const updateBookingStatus: DataContextValue["updateBookingStatus"] = useCallback((id, status) => {
    storage.setBookings(
      storage.getBookings().map((b) => (b.id === id ? { ...b, status } : b))
    );
    refresh();
  }, [refresh]);

  const addReview: DataContextValue["addReview"] = useCallback((r) => {
    const review: Review = { ...r, id: uid("rev"), createdAt: new Date().toISOString() };
    storage.setReviews([review, ...storage.getReviews()]);
    refresh();
    return review;
  }, [refresh]);

  const sendMessage: DataContextValue["sendMessage"] = useCallback((fromUserId, toUserId, text) => {
    const msg: Message = {
      id: uid("msg"),
      fromUserId,
      toUserId,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    storage.setMessages([...storage.getMessages(), msg]);
    refresh();
    return msg;
  }, [refresh]);

  const markThreadRead: DataContextValue["markThreadRead"] = useCallback((otherId, meId) => {
    storage.setMessages(
      storage.getMessages().map((m) =>
        m.fromUserId === otherId && m.toUserId === meId && !m.read ? { ...m, read: true } : m
      )
    );
    refresh();
  }, [refresh]);

  const toggleSaved: DataContextValue["toggleSaved"] = useCallback((userId, refId, type) => {
    const s = storage.getSaved();
    const exists = s.find((x) => x.userId === userId && x.refId === refId);
    if (exists) {
      storage.setSaved(s.filter((x) => x.id !== exists.id));
    } else {
      storage.setSaved([
        ...s,
        { id: uid("sv"), userId, refId, type, createdAt: new Date().toISOString() },
      ]);
    }
    refresh();
  }, [refresh]);

  const isSaved: DataContextValue["isSaved"] = useCallback((userId, refId) => {
    return storage.getSaved().some((x) => x.userId === userId && x.refId === refId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const getUserById = useCallback(
    (id: string) => storage.getUsers().find((u) => u.id === id),
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );

  const getAverageRating = useCallback((userId: string) => {
    const list = storage.getReviews().filter((r) => r.targetUserId === userId);
    if (!list.length) return { avg: 0, count: 0 };
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return { avg: sum / list.length, count: list.length };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const value = useMemo<DataContextValue>(
    () => ({
      users,
      listings,
      equipment,
      bookings,
      orders,
      reviews,
      messages,
      saved,
      refresh,
      addListing,
      updateListing,
      deleteListing,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      createOrder,
      createBooking,
      addReview,
      sendMessage,
      markThreadRead,
      toggleSaved,
      isSaved,
      getUserById,
      getAverageRating,
      updateOrderStatus,
      updateBookingStatus,
    }),
    [
      users,
      listings,
      equipment,
      bookings,
      orders,
      reviews,
      messages,
      saved,
      refresh,
      addListing,
      updateListing,
      deleteListing,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      createOrder,
      createBooking,
      addReview,
      sendMessage,
      markThreadRead,
      toggleSaved,
      isSaved,
      getUserById,
      getAverageRating,
      updateOrderStatus,
      updateBookingStatus,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
