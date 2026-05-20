import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { MapPin, Mail, Phone, MessageCircle, Save, Pencil } from "lucide-react";
import StarRating from "../components/StarRating";
import { seedCrops } from "../data/mockData";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user: me, updateProfile } = useAuth();
  const { getUserById, getAverageRating, reviews, listings, equipment } = useData();

  const targetId = id ?? me?.id;
  const profile = targetId ? getUserById(targetId) : undefined;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    bio: profile?.bio ?? "",
    farmSizeAcres: profile?.farmSizeAcres?.toString() ?? "",
    interests: profile?.interests ?? [],
  });

  const myReviews = useMemo(
    () => (profile ? reviews.filter((r) => r.targetUserId === profile.id) : []),
    [profile, reviews]
  );
  const myListings = useMemo(
    () => (profile ? listings.filter((l) => l.farmerId === profile.id) : []),
    [profile, listings]
  );
  const myEquipment = useMemo(
    () => (profile ? equipment.filter((e) => e.ownerId === profile.id) : []),
    [profile, equipment]
  );

  if (!profile) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-gray-600">Profile not found.</div>;
  }

  const isMe = me?.id === profile.id;
  const { avg, count } = getAverageRating(profile.id);

  const save = () => {
    if (!isMe) return;
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      bio: form.bio.trim(),
      farmSizeAcres: form.farmSizeAcres ? Number(form.farmSizeAcres) : undefined,
      interests: form.interests,
    });
    setEditing(false);
  };

  const toggleInterest = (c: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(c)
        ? f.interests.filter((x) => x !== c)
        : [...f.interests, c],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <span
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl"
            style={{ background: profile.avatarColor }}
          >
            {profile.name.charAt(0)}
          </span>
          <div className="flex-1">
            {editing ? (
              <input
                className="input text-lg font-bold"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="badge bg-brand-50 text-brand-700 capitalize">{profile.role}</span>
              {count > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <StarRating value={avg} readOnly size={14} />
                  <span className="text-gray-500 text-xs">{avg.toFixed(1)} ({count})</span>
                </div>
              )}
              <span className="text-xs text-gray-500">
                Member since {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {isMe ? (
              editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                  <button onClick={save} className="btn-primary">
                    <Save className="w-4 h-4" /> Save
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  <Pencil className="w-4 h-4" /> Edit profile
                </button>
              )
            ) : me ? (
              <Link to={`/messages?to=${profile.id}`} className="btn-primary">
                <MessageCircle className="w-4 h-4" /> Message
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <Field icon={Mail} label="Email" value={profile.email} />
          <Field
            icon={Phone}
            label="Phone"
            editing={editing}
            value={editing ? form.phone : profile.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field
            icon={MapPin}
            label="Location"
            editing={editing}
            value={editing ? form.location : profile.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />
          {profile.role === "farmer" && (
            <Field
              icon={MapPin}
              label="Farm size (acres)"
              editing={editing}
              value={editing ? form.farmSizeAcres : (profile.farmSizeAcres?.toString() ?? "—")}
              onChange={(v) => setForm({ ...form, farmSizeAcres: v })}
              type="number"
            />
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">About</h3>
          {editing ? (
            <textarea
              className="input"
              rows={2}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          ) : (
            <p className="text-sm text-gray-700">{profile.bio || <em className="text-gray-400">No bio yet.</em>}</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {profile.role === "farmer" ? "Crops grown" : "Products sought"}
          </h3>
          {editing ? (
            <div className="flex flex-wrap gap-2">
              {seedCrops.map((c) => {
                const on = form.interests.includes(c.name);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleInterest(c.name)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      on ? "border-brand-500 bg-brand-100 text-brand-800" : "border-gray-200"
                    }`}
                  >
                    {c.emoji} {c.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.interests.length ? (
                profile.interests.map((i) => (
                  <span key={i} className="badge bg-brand-50 text-brand-700">{i}</span>
                ))
              ) : (
                <em className="text-sm text-gray-400">No interests selected.</em>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Listings/Equipment if farmer */}
      {profile.role === "farmer" && (myListings.length > 0 || myEquipment.length > 0) && (
        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Marketplace listings ({myListings.length})</h3>
            {myListings.length === 0 ? (
              <p className="text-sm text-gray-500">No active listings.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {myListings.map((l) => (
                  <li key={l.id}>
                    <Link to={`/marketplace/${l.id}`} className="py-2 flex items-center justify-between hover:bg-gray-50 px-2 -mx-2 rounded">
                      <span className="flex items-center gap-2 text-sm">
                        <span>{l.imageEmoji}</span>
                        <span>{l.title}</span>
                      </span>
                      <span className="text-sm font-semibold">₹{l.pricePerKg}/kg</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Equipment for rent ({myEquipment.length})</h3>
            {myEquipment.length === 0 ? (
              <p className="text-sm text-gray-500">No equipment listed.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {myEquipment.map((e) => (
                  <li key={e.id}>
                    <Link to={`/equipment/${e.id}`} className="py-2 flex items-center justify-between hover:bg-gray-50 px-2 -mx-2 rounded">
                      <span className="flex items-center gap-2 text-sm">
                        <span>{e.imageEmoji}</span>
                        <span>{e.name}</span>
                      </span>
                      <span className="text-sm font-semibold">₹{e.pricePerDay.toLocaleString("en-IN")}/day</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-3">Reviews ({myReviews.length})</h2>
        {myReviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {myReviews.map((r) => {
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
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  icon: any;
  label: string;
  value: string;
  editing?: boolean;
  onChange?: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs uppercase text-gray-500 font-semibold">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      {editing && onChange ? (
        <input className="input mt-1" value={value} onChange={(e) => onChange(e.target.value)} type={type} />
      ) : (
        <div className="mt-1 text-sm text-gray-800">{value || "—"}</div>
      )}
    </div>
  );
}
