import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Heart, MapPin, MessageCircle, ShieldCheck, Truck, Star } from "lucide-react";
import StarRating from "../components/StarRating";
import PaymentModal from "../components/PaymentModal";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings, getUserById, getAverageRating, reviews, addReview, createOrder, toggleSaved, isSaved } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id === id);
  const farmer = listing ? getUserById(listing.farmerId) : undefined;
  const [qty, setQty] = useState(1);
  const [showPay, setShowPay] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const productReviews = useMemo(
    () => reviews.filter((r) => r.refId === id),
    [reviews, id]
  );

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-gray-600">Listing not found.</p>
        <Link to="/marketplace" className="btn-primary mt-4 inline-flex">Back to marketplace</Link>
      </div>
    );
  }

  const total = qty * listing.pricePerKg;
  const { avg, count } = farmer ? getAverageRating(farmer.id) : { avg: 0, count: 0 };
  const saved = user ? isSaved(user.id, listing.id) : false;

  const handlePaid = () => {
    if (!user || !farmer) return;
    createOrder({
      listingId: listing.id,
      buyerId: user.id,
      sellerId: farmer.id,
      quantityKg: qty,
      totalAmount: total,
    });
    setShowPay(false);
    navigate("/dashboard");
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !farmer) return;
    addReview({
      authorId: user.id,
      targetUserId: farmer.id,
      rating: reviewRating,
      comment: reviewText.trim(),
      context: "product",
      refId: listing.id,
    });
    setReviewText("");
    setReviewRating(5);
  };

  const canBuy = !!user && user.role === "consumer" && listing.available && qty > 0 && qty <= listing.quantityKg;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/marketplace" className="text-sm text-brand-700 hover:underline">
        ← Back to marketplace
      </Link>
      <div className="grid lg:grid-cols-2 gap-8 mt-4">
        <div>
          <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-yellow-50 flex items-center justify-center text-9xl rounded-2xl">
            {listing.imageEmoji}
          </div>
          {farmer && (
            <Link to={`/profile/${farmer.id}`} className="card mt-4 p-4 flex items-center gap-3 hover:shadow-md transition">
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: farmer.avatarColor }}
              >
                {farmer.name.charAt(0)}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{farmer.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {farmer.location} · {farmer.farmSizeAcres ?? "—"} acres
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
            <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
            {user && (
              <button
                onClick={() => toggleSaved(user.id, listing.id, "listing")}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Save"
              >
                <Heart className={`w-5 h-5 ${saved ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {listing.location}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-brand-700">₹{listing.pricePerKg}</span>
            <span className="text-gray-500">/kg</span>
            <span className="ml-3 badge bg-brand-50 text-brand-700">{listing.cropType}</span>
            {listing.available ? (
              <span className="badge bg-green-100 text-green-700">In stock</span>
            ) : (
              <span className="badge bg-gray-200 text-gray-700">Out of stock</span>
            )}
          </div>

          <p className="mt-4 text-gray-700">{listing.description}</p>

          <div className="card p-4 mt-5">
            <label className="label">Quantity (kg)</label>
            <input
              className="input"
              type="number"
              min={1}
              max={listing.quantityKg}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(listing.quantityKg, Number(e.target.value) || 1)))}
            />
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Available</span>
              <span>{listing.quantityKg} kg</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                disabled={!canBuy}
                onClick={() => setShowPay(true)}
                className="btn-primary flex-1"
                title={!user ? "Log in to buy" : ""}
              >
                Buy now · ₹{total.toLocaleString("en-IN")}
              </button>
              {user && farmer && user.id !== farmer.id && (
                <Link to={`/messages?to=${farmer.id}`} className="btn-secondary">
                  <MessageCircle className="w-4 h-4" /> Chat
                </Link>
              )}
            </div>
            {!user && (
              <p className="text-xs text-gray-500 mt-2">
                Please <Link to="/login" className="text-brand-700 underline">log in</Link> as a consumer to purchase.
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-600" /> Secure payment</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-brand-600" /> Direct from farm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Reviews ({productReviews.length})
          </h2>
        </div>
        {user && user.role === "consumer" && farmer && user.id !== farmer.id && (
          <form onSubmit={submitReview} className="card p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium">Your rating:</span>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <textarea
              className="input"
              rows={2}
              placeholder="Share your experience with this product"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
            <div className="mt-2 flex justify-end">
              <button className="btn-primary" type="submit">Post review</button>
            </div>
          </form>
        )}

        {productReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet for this listing.</p>
        ) : (
          <div className="space-y-3">
            {productReviews.map((r) => {
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
        description={`${qty} kg of ${listing.title}`}
        onClose={() => setShowPay(false)}
        onSuccess={handlePaid}
      />
    </div>
  );
}
