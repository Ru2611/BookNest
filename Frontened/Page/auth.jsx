import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Login from "./login";
import Signup from "./signup";
import { isLoggedIn } from "../lib/auth";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname === "/signup") setMode("signup");
    if (location.pathname === "/login") setMode("login");
  }, [location.pathname]);

  useEffect(() => {
    const m = (searchParams.get("mode") || "").toLowerCase();
    if (m === "signup") setMode("signup");
    if (m === "login") setMode("login");
  }, [searchParams]);

  useEffect(() => {
    if (isLoggedIn()) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [location.state, navigate]);

  return (
    <div className="px-4 flex justify-center gap-8 mt-24">
      <div className="mx-auto max-w-4xl pt-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-soft backdrop-blur">
            <h2 className="text-2xl font-semibold text-slate-900">
              Welcome to BookNest
            </h2>
            <p className="mt-2 text-slate-600">
              Login or create an account to browse books, save your wishlist,
              and post listings (sell or donate).
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-slate-900">
                  Sell a book
                </p>
                <p className="text-sm text-slate-600">
                  List your book with a price and details.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-1 text-sm font-semibold text-slate-900">
                  Donate for free
                </p>
                <p className="text-sm text-slate-600">
                  Give books a new home—mark as Free.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/70 p-2 shadow-soft backdrop-blur ">
            <div className="flex gap-2 p-2 ">
              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className={
                  mode === "login"
                    ? "flex-1 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    : "flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                }
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate("/signup", { replace: true })}
                className={
                  mode === "signup"
                    ? "flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    : "flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800"
                }
              >
                Sign up
              </button>
            </div>

            <div className="p-3">
              {mode === "login" ? (
                <Login
                  onSwitchToSignup={() => navigate("/signup", { replace: true })}
                  onSuccess={() => {
                    const from = location.state?.from || "/dashboard";
                    navigate(from, { replace: true });
                  }}
                />
              ) : (
                <Signup
                  onSwitchToLogin={() => navigate("/login", { replace: true })}
                  onSuccess={() => navigate("/login", { replace: true })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
