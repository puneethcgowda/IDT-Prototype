import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Boxes,
  CalendarDays,
  Heart,
  Package,
  Plus,
  ShoppingBasket,
  Tractor,
  Wallet,
} from "lucide-react";
import StarRating from "../components/StarRating";
import NewListingModal from "../components/NewListingModal";
import NewEquipmentModal from "../components/NewEquipmentModal";

type Tab = "overview" | "listings" | "bookings" | "orders" | "saved";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    listings,
    equipment,
    bookings,
    orders,
    saved,
    getUserById,
    getAverageRating,
    deleteListing,
    deleteEquipment,
    updateListing,
    updateEquipment,
    toggleSaved,
  } = useData();

  const [tab, setTab] = useState<Tab>("overview");
  const [openListingModal, setOpenListingModal] = useState(false);
  const [openEquipModal, setOpenEquipModal] = useState(false);

  if (!user) return null;
  const isFarmer = user.role === "farmer";

  const myListings = useMemo(
    () => listings.filter((l) => l.farmerId === user.id),
    [listings, user.id]
  );
  const myEquipment = useMemo(
    () => equipment.filter((e) => e.ownerId === user.id),
    [equipment, user.id]
  );
  const myOrdersAsBuyer = useMemo(
    () => orders.filter((o) => o.buyerId === user.id),
    [orders, user.id]
  );
  const myOrdersAsSeller = useMemo(
    () => orders.filter((o) => o.sellerId === user.id),
    [orders, user.id]
  );
  const myBookingsAsRenter = useMemo(
    () => bookings.filter((b) => b.consumerId === user.id),
    [bookings, user.id]
  );
  const myBookingsAsOwner = useMemo(
    () =>
      bookings.filter((b) =>
        myEquipment.some((e) => e.id === b.equipmentId)
      ),
    [bookings, myEquipment]
  );
  const mySaved = useMemo(
    () => saved.filter((s) => s.userId === user.id),
    [saved, user.id]
  );
  const { avg, count } = getAverageRating(user.id);

  const upcoming = (isFarmer ? myBookingsAsOwner : myBookingsAsRenter).filter(
    (b) => new Date(b.endDate) >= new Date()
  );

  const totalEarnings = isFarmer
    ? myOrdersAsSeller.reduce((s, o) => s + o.totalAmount, 0) +
      myBookingsAsOwner.reduce((s, b) => s + b.totalAmount, 0)
    : 0;
  const totalSpent = !isFarmer
    ? myOrdersAsBuyer.reduce((s, o) => s + o.totalAmount, 0) +
      myBookingsAsRenter.reduce((s, b) => s + b.totalAmount, 0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-start gap-4">
        <span
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
          style={{ background: user.avatarColor }}
        >
          {user.name.charAt(0)}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <span className="badge bg-brand-50 text-brand-700 capitalize">
              {user.role}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {user.location} · {user.email}
          </p>
          {count > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating value={avg} readOnly size={14} />
              <span className="text-xs text-gray-500">
                {avg.toFixed(1)} from {count} review{count > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <Link to="/profile" className="btn-secondary text-sm">
          Edit profile
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {isFarmer ? (
          <>
            <StatCard icon={ShoppingBasket} label="My listings" value={myListings.length} />
            <StatCard icon={Tractor} label="My equipment" value={myEquipment.length} />
            <StatCard icon={CalendarDays} label="Upcoming bookings" value={upcoming.length} />
            <StatCard icon={Wallet} label="Total earnings" value={`₹${totalEarnings.toLocaleString("en-IN")}`} />
          </>
        ) : (
          <>
            <StatCard icon={Package} label="Orders placed" value={myOrdersAsBuyer.length} />
            <StatCard icon={Tractor} label="Equipment booked" value={myBookingsAsRenter.length} />
            <StatCard icon={Heart} label="Saved items" value={mySaved.length} />
            <StatCard icon={Wallet} label="Total spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} />
          </>
        )}
      </div>

      {/* Tabs */}
      <div id="dashboard-tabs" className="flex flex-wrap gap-1 border-b border-gray-200 mb-4">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>Overview</TabBtn>
        <TabBtn active={tab === "listings"} onClick={() => setTab("listings")}>
          {isFarmer ? "My listings" : "My orders"}
        </TabBtn>
        <TabBtn active={tab === "bookings"} onClick={() => setTab("bookings")}>
          {isFarmer ? "Equipment bookings" : "My bookings"}
        </TabBtn>
        <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>
          {isFarmer ? "Sales history" : "Order history"}
        </TabBtn>
        <TabBtn active={tab === "saved"} onClick={() => setTab("saved")}>
          Saved
        </TabBtn>
      </div>

      {tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Recent activity" icon={Boxes}>
            {(isFarmer ? myOrdersAsSeller : myOrdersAsBuyer).slice(0, 4).length === 0 ? (
              <p className="text-sm text-gray-500">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {(isFarmer ? myOrdersAsSeller : myOrdersAsBuyer).slice(0, 4).map((o) => {
                  const l = listings.find((x) => x.id === o.listingId);
                  return (
                    <li key={o.id} className="py-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{l?.imageEmoji ?? "📦"}</span>
                        <span>{l?.title ?? "Listing"} · {o.quantityKg} kg</span>
                      </span>
                      <span className="font-semibold">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card title="Upcoming bookings" icon={CalendarDays}>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming bookings.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.slice(0, 4).map((b) => {
                  const eq = equipment.find((e) => e.id === b.equipmentId);
                  return (
                    <li key={b.id} className="py-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{eq?.imageEmoji ?? "🚜"}</span>
                        <span>{eq?.name ?? "Equipment"}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      )}

      {tab === "listings" && (
        <>
          {isFarmer ? (
            <>
              <div className="flex justify-end mb-3 gap-2">
                <button onClick={() => setOpenEquipModal(true)} className="btn-secondary">
                  <Plus className="w-4 h-4" /> Add equipment
                </button>
                <button onClick={() => setOpenListingModal(true)} className="btn-primary">
                  <Plus className="w-4 h-4" /> New listing
                </button>
              </div>

              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-2">Crop listings</h3>
              {myListings.length === 0 ? (
                <p className="text-sm text-gray-500 mb-6">You haven't listed any produce yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {myListings.map((l) => (
                    <div key={l.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{l.imageEmoji}</div>
                        <div className="flex-1">
                          <Link to={`/marketplace/${l.id}`} className="font-semibold hover:text-brand-700">
                            {l.title}
                          </Link>
                          <div className="text-xs text-gray-500">{l.cropType} · ₹{l.pricePerKg}/kg · {l.quantityKg} kg</div>
                          {l.available ? (
                            <span className="badge bg-green-100 text-green-700 mt-1">Available</span>
                          ) : (
                            <span className="badge bg-gray-200 text-gray-700 mt-1">Out of stock</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => updateListing(l.id, { available: !l.available })}
                          className="btn-secondary text-xs flex-1"
                        >
                          {l.available ? "Mark out of stock" : "Mark available"}
                        </button>
                        <button onClick={() => deleteListing(l.id)} className="btn-danger text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="font-semibold text-sm uppercase text-gray-500 mb-2">Equipment for rent</h3>
              {myEquipment.length === 0 ? (
                <p className="text-sm text-gray-500">You haven't listed any equipment yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myEquipment.map((e) => (
                    <div key={e.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{e.imageEmoji}</div>
                        <div className="flex-1">
                          <Link to={`/equipment/${e.id}`} className="font-semibold hover:text-brand-700">{e.name}</Link>
                          <div className="text-xs text-gray-500">{e.category} · ₹{e.pricePerDay.toLocaleString("en-IN")}/day</div>
                          {e.available ? (
                            <span className="badge bg-green-100 text-green-700 mt-1">Available</span>
                          ) : (
                            <span className="badge bg-gray-200 text-gray-700 mt-1">Booked</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => updateEquipment(e.id, { available: !e.available })}
                          className="btn-secondary text-xs flex-1"
                        >
                          {e.available ? "Mark booked" : "Mark available"}
                        </button>
                        <button onClick={() => deleteEquipment(e.id)} className="btn-danger text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <OrdersList orders={myOrdersAsBuyer} side="buyer" />
          )}
        </>
      )}

      {tab === "bookings" && (
        <BookingsList bookings={isFarmer ? myBookingsAsOwner : myBookingsAsRenter} />
      )}

      {tab === "orders" && (
        <OrdersList orders={isFarmer ? myOrdersAsSeller : myOrdersAsBuyer} side={isFarmer ? "seller" : "buyer"} />
      )}

      {tab === "saved" && (
        <>
          {mySaved.length === 0 ? (
            <p className="text-sm text-gray-500">You haven't saved anything yet. Tap the ❤ on any listing or equipment to save it for later.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySaved.map((s) => {
                const item =
                  s.type === "listing"
                    ? listings.find((l) => l.id === s.refId)
                    : equipment.find((e) => e.id === s.refId);
                if (!item) return null;
                const isList = s.type === "listing";
                const owner = getUserById(isList ? (item as any).farmerId : (item as any).ownerId);
                return (
                  <div key={s.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{(item as any).imageEmoji}</div>
                      <div className="flex-1">
                        <Link
                          to={isList ? `/marketplace/${item.id}` : `/equipment/${item.id}`}
                          className="font-semibold hover:text-brand-700"
                        >
                          {isList ? (item as any).title : (item as any).name}
                        </Link>
                        <div className="text-xs text-gray-500">
                          {isList ? `₹${(item as any).pricePerKg}/kg` : `₹${(item as any).pricePerDay.toLocaleString("en-IN")}/day`}
                          {owner && ` · ${owner.name}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaved(user.id, s.refId, s.type)}
                      className="btn-ghost text-xs mt-3 w-full"
                    >
                      Remove from saved
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <NewListingModal open={openListingModal} onClose={() => setOpenListingModal(false)} />
      <NewEquipmentModal open={openEquipModal} onClose={() => setOpenEquipModal(false)} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-brand-700">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase font-semibold">{label}</span>
      </div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm border-b-2 -mb-px ${
        active ? "border-brand-600 text-brand-700 font-semibold" : "border-transparent text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-brand-600" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function OrdersList({ orders, side }: { orders: any[]; side: "buyer" | "seller" }) {
  const { listings, getUserById } = useData();
  if (orders.length === 0) {
    return <p className="text-sm text-gray-500">No orders yet.</p>;
  }
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Listing</th>
            <th className="text-left px-4 py-2">{side === "seller" ? "Buyer" : "Seller"}</th>
            <th className="text-left px-4 py-2">Qty</th>
            <th className="text-left px-4 py-2">Total</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const l = listings.find((x) => x.id === o.listingId);
            const counter = getUserById(side === "seller" ? o.buyerId : o.sellerId);
            return (
              <tr key={o.id} className="border-t border-gray-100">
                <td className="px-4 py-2 flex items-center gap-2">
                  <span>{l?.imageEmoji ?? "📦"}</span>
                  <span>{l?.title ?? "Listing"}</span>
                </td>
                <td className="px-4 py-2">{counter?.name ?? "—"}</td>
                <td className="px-4 py-2">{o.quantityKg} kg</td>
                <td className="px-4 py-2 font-semibold">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 capitalize">
                  <span className="badge bg-brand-50 text-brand-700">{o.status}</span>
                </td>
                <td className="px-4 py-2 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BookingsList({ bookings }: { bookings: any[] }) {
  const { equipment, getUserById } = useData();
  if (bookings.length === 0) {
    return <p className="text-sm text-gray-500">No bookings yet.</p>;
  }
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-2">Equipment</th>
            <th className="text-left px-4 py-2">Renter</th>
            <th className="text-left px-4 py-2">From</th>
            <th className="text-left px-4 py-2">To</th>
            <th className="text-left px-4 py-2">Total</th>
            <th className="text-left px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const eq = equipment.find((e) => e.id === b.equipmentId);
            const renter = getUserById(b.consumerId);
            return (
              <tr key={b.id} className="border-t border-gray-100">
                <td className="px-4 py-2 flex items-center gap-2">
                  <span>{eq?.imageEmoji ?? "🚜"}</span>
                  <span>{eq?.name ?? "Equipment"}</span>
                </td>
                <td className="px-4 py-2">{renter?.name ?? "—"}</td>
                <td className="px-4 py-2">{new Date(b.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(b.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 font-semibold">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-2 capitalize">
                  <span className="badge bg-brand-50 text-brand-700">{b.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
