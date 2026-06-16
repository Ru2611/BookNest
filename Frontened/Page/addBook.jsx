import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiPostJson } from "../lib/api";

const AddBook = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetType = (searchParams.get("type") || "").toLowerCase();

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    image: "",
    genre: "",
    type: presetType === "sell" || presetType === "donate" ? presetType : "",
    condition: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const canSubmit = useMemo(() => {
    if (!form.title.trim() || !form.author.trim() || !form.type) return false;
    if (!form.genre.trim() || !form.description.trim()) return false;
    if (form.type === "sell" && String(form.price).trim() === "") return false;
    return true;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: "", message: "" });
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: form.type === "donate" ? 0 : Number(form.price || 0),
      };

      await apiPostJson("/books", payload);

      setStatus({ type: "success", message: "Book uploaded successfully." });
      setForm({
        title: "",
        author: "",
        price: "",
        description: "",
        image: "",
        genre: "",
        type: presetType === "sell" || presetType === "donate" ? presetType : "",
        condition: "",
      });
      setTimeout(() => navigate("/browse"), 600);
    } catch {
      setStatus({
        type: "error",
        message:
          "Could not upload. Make sure the backend is running on http://localhost:8000.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4">
      <div className="mx-auto max-w-3xl pt-6">
        <div className="rounded-3xl bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-slate-900">Add a book</h2>
            <p className="text-sm text-slate-600">
              Fill in details and publish your listing.
            </p>
          </div>

          {status.message ? (
            <div
              className={
                status.type === "success"
                  ? "mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                  : "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              }
            >
              {status.message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Atomic Habits"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Author
              </label>
              <input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="e.g. James Clear"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="sell">Sell</option>
                <option value="donate">Donate</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Genre
              </label>
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                placeholder="e.g. fiction, self-help"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Condition (optional)
              </label>
              <input
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
                placeholder="e.g. Like New"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Price
              </label>
              <input
                value={form.type === "donate" ? "0" : form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="₹"
                disabled={form.type === "donate"}
                inputMode="numeric"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 disabled:opacity-60"
              />
              {form.type === "donate" ? (
                <p className="mt-1 text-xs text-slate-500">
                  Donation listings are automatically set to free.
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Image URL (optional)
              </label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
              {form.image ? (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-56 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                placeholder="Write a short description…"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/browse")}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Publish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
