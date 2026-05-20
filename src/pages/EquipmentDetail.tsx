import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { CalendarRange, Heart, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import StarRating from "../components/StarRating";
import PaymentModal from "../components/PaymentModal";

function daysBetween(a: string, b: string) {
  const A = new Date(a);
  const B = new Date(b);
  const ms = B.getTime() - A.getTime();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days + 1); // inclusive
}

const today = () => new Date().toISOString().slice(0, 10);
const plus = (d: string, days: number) => {
  const dt = new Date(d);
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
};

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { equipment, bookings, getUserById, getAverageRating, reviews, addReview, createBooking, toggleSaved, isSaved, updateEquipment } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const item = equipment.find((e) => e.id === id);
  const owner = item ? getUserById(item.ownerId) : undefined;

  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(plus(today(), 1));
  const [showPay, setShowPay] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const equipReviews = useMemo(
    () => reviews.filter((r) => r.refId === id),
    [reviews, id]
  );
  const myBookings = useMemo(
    () => bookings.filter((b) => b.equipmentId === id),
    [bookings, id]
  );

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-gray-600">Equipment not found.</p>
        <Link to="/equipment" className="btn-primary mt-4 inline-flex">Back</Link>
      </div>
    );
  }

  const days = daysBetween(start, end);
  const total = days * item.pricePerDay;
  const { avg, count } = owner ? getAverageRating(owner.id) : { avg: 0, count: 0 };
  const saved = user ? isSaved(user.id, item.id) : false;

  const canBook = !!user && item.available && new Date(end) >= new Date(start);

  const handlePaid = () => {
    if (!user) return;
    createBooking({
      equipmentId: item.id,
      consumerId: user.id,
      startDate: start,
      endDate: end,
      totalAmount: total,
    });
    // mark equipment temporarily booked
    updateEquipment(item.id, { available: false });
    setShowPay(false);
    navigate("/dashboard");
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !owner) return;
    addReview({
      authorId: user.id,
      targetUserId: owner.id,
      rating: reviewRating,
      comment: reviewText.trim(),
      context: "equipment",
      refId: item.id,
    });
    setReviewText("");
    setReviewRating(5);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/equipment" className="text-sm text-brand-700 hover:underline">← Back to equipment</Link>

      <div className="grid lg:grid-cols-2 gap-8 mt-4">
        <div>
          <div className="aspect-[4/3] bg-gradient-to-br from-yellow-50 to-brand-50 flex items-center justify-center text-9xl rounded-2xl">
            {item.imageEmoji}
          </div>
          {owner && (
            <Link to={`/profile/${owner.id}`} className="card mt-4 p-4 flex items-center gap-3 hover:shadow-md transition">
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: owner.avatarColor }}
              >
                {owner.name.charAt(0)}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{owner.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {owner.location}
                </div>
              </div>
              {count > 0 && (
                <div className="text-right">
                  <StarRating value={avg} readOnly size={14} />
                  <div className="text-xs text-gray-500">({count} reviews)</div>
                </div>
              )}
            </Link>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="badge bg-brand-50 text-brand-700">{item.category}</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{item.name}</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {item.location}
              </p>
            </div>
            {user && (
              <button
                onClick={() => toggleSaved(user.id, item.id, "equipment")}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Save"
              >
                <Heart className={`w-5 h-5 ${saved ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} />
              </button>
            )}
          </div>

          <p className="mt-4 text-gray-700">{item.description}</p>

          <div className="card p-4 mt-5">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-brand-700">₹{item.pricePerDay.toLocaleString("en-IN")}</span>
              <span className="text-gray-500 text-sm">/ day</span>
              {item.available ? (
                <span className="ml-auto badge bg-green-100 text-green-700">Available</span>
              ) : (
                <span className="ml-auto badge bg-gray-200 text-gray-700">Currently booked</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start date</label>
                <input
                  type="date"
                  className="input"
                  min={today()}
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                    if (new Date(e.target.value) > new Date(end)) setEnd(e.target.value);
                  }}
                />
              </div>
              <div>
                <label className="label">End date</label>
                <input
                  type="date"
                  className="input"
                  min={start}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <CalendarRange className="w-4 h-4" /> {days} day{days > 1 ? "s" : ""}
              </span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <button
              disabled={!canBook}
              onClick={() => setShowPay(true)}
              className="btn-primary w-full mt-4"
              title={!user ? "Log in to book" : ""}
            >
              {item.available ? `Book now · ₹${total.toLocaleString("en-IN")}` : "Currently unavailable"}
            </button>
            {!user && (
              <p className="text-xs text-gray-500 mt-2">
                Please <Link to="/login" className="text-brand-700 underline">log in</Link> to book this equipment.
              </p>
            )}

            {user && owner && user.id !== owner.id && (
              <Link to={`/messages?to=${owner.id}`} className="btn-secondary w-full mt-2">
                <MessageCircle className="w-4 h-4" /> Message owner
              </Link>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Damage protection & secure payment
            </div>
          </div>

          {myBookings.length > 0 && (
            <div className="card p-4 mt-4">
              <h3 className="font-semibold text-sm mb-2">Recent bookings on this equipment</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                {myBookings.slice(0, 3).map((b) => (
                  <li key={b.id} className="flex justify-between">
                    <span>{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</span>
                    <span className="capitalize">{b.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-3">Reviews ({equipReviews.length})</h2>
        {user && owner && user.id !== owner.id && (
          <form onSubmit={submitReview} className="card p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium">Your rating:</span>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              className="input"
              rows={2}
              placeholder="Was the equipment well-maintained? On time?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <div className="mt-2 flex justify-end">
              <button className="btn-primary" type="submit">Post review</button>
            </div>
          </form>
        )}

        {equipReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet for this equipment.</p>
        ) : (
          <div className="space-y-3">
            {equipReviews.map((r) => {
              const author = getUserById(r.authorId);
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center gap-2">
                    {author && (
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                        style={{ background: author.avatarColor }}
                      >
                        {author.name.charAt(0)}
                      </span>
                    )}
                    <div className="text-sm font-medium">{author?.name ?? "Unknown"}</div>
                    <StarRating value={r.rating} readOnly size={14} />
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PaymentModal
        open={showPay}
        amount={total}
        description={`${item.name} · ${days} day${days > 1 ? "s" : ""}`}
        onClose={() => setShowPay(false)}
        onSuccess={handlePaid}
      />
    </div>
  );
}
