"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { isAuthenticated, isAdmin } from "../../../services/api";
import AdminNavbar from "../../../components/AdminNavbar";

export default function AdminUsersPage() {
  const router = useRouter();

  // STATES
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageOk, setMessageOk] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");

  // THEME SYNC
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setDark(saved === null ? true : saved === "dark");
    const interval = setInterval(() => {
      const t = localStorage.getItem("theme");
      setDark(t === null ? true : t === "dark");
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // AUTH + LOAD
  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth/login"); return; }
    if (!isAdmin()) { router.push("/dashboard");  return; }
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.log(error);
      showMessage("Failed to load users", false);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, ok = true) => {
    setMessage(msg);
    setMessageOk(ok);
    setTimeout(() => setMessage(""), 3000);
  };

  const disableUser = async (id) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/admin/disable/${id}`);
      showMessage(response.data.message, true);
      fetchUsers();
    } catch { showMessage("Failed to disable user", false); }
    finally { setActionLoading(false); }
  };

  const enableUser = async (id) => {
    try {
      setActionLoading(true);
      const response = await api.put(`/admin/enable/${id}`);
      showMessage(response.data.message, true);
      fetchUsers();
    } catch { showMessage("Failed to enable user", false); }
    finally { setActionLoading(false); }
  };

  const deleteUser = async (id, role) => {
    if (role === "ROLE_ADMIN") { showMessage("Admin accounts cannot be deleted", false); return; }
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setActionLoading(true);
      const response = await api.delete(`/admin/delete/${id}`);
      showMessage(response.data.message, true);
      fetchUsers();
    } catch { showMessage("Failed to delete user", false); }
    finally  { setActionLoading(false); }
  };

  // FILTERED USERS
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // THEME TOKENS
  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-black via-slate-950 to-gray-900 text-white"
    : "min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  const card = dark
    ? "bg-white/5 rounded-2xl shadow-xl overflow-hidden"
    : "bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden";

  const subText = dark ? "text-white/40 text-sm" : "text-gray-500 text-sm";
  const theadRow = dark ? "border-b border-white/8" : "border-b border-gray-100";
  const thClass = dark
    ? "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/35 text-left"
    : "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-left";
  const tbodyRow = dark
    ? "border-b border-white/5 hover:bg-white/3 transition"
    : "border-b border-gray-50 hover:bg-gray-50 transition";
  const tdClass = dark
    ? "px-4 py-3.5 text-sm text-white/70"
    : "px-4 py-3.5 text-sm text-gray-600";

  const searchInput = dark
    ? "w-full md:w-64 px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/25 outline-none focus:border-cyan-500/50 text-sm transition"
    : "w-full md:w-64 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 outline-none focus:border-cyan-400 text-sm transition";

  const summaryPill = dark
    ? "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/5 border border-white/8"
    : "flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white border border-gray-100 shadow-sm";

  const summaryLabelText = dark ? "text-white/35 text-xs" : "text-gray-400 text-xs";

  if (loading) {
    return (
      <div className={`${bg} flex items-center justify-center`}>
        <div className={`text-sm font-medium ${dark ? "text-white/40" : "text-gray-400"}`}>
          Loading Users...
        </div>
      </div>
    );
  }

  return (
    <div className={bg}>

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>
              User Management
            </h1>
            <p className={subText}>
              Manage platform users, roles, permissions, and account activity.
            </p>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className={searchInput}
          />
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
            messageOk
              ? dark
                ? "bg-green-500/15 border border-green-500/30 text-green-300"
                : "bg-green-50 border border-green-200 text-green-700"
              : dark
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}>
            {message}
          </div>
        )}

        {/* SUMMARY PILLS */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Total", value: users.length, color: dark ? "text-white/70" : "text-gray-700" },
            { label: "Active", value: users.filter((u) => u.active).length, color: "text-green-400" },
            { label: "Disabled", value: users.filter((u) => !u.active).length, color: "text-red-400" },
            { label: "Admins", value: users.filter((u) => u.role === "ROLE_ADMIN").length, color: "text-yellow-400"                        },
          ].map((s) => (
            <div key={s.label} className={summaryPill}>
              <span className={summaryLabelText}>{s.label}</span>
              <span className={`font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className={card}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">

              <thead>
                <tr className={theadRow}>
                  <th className={thClass}>ID</th>
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Email</th>
                  <th className={thClass}>Role</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Logins</th>
                  <th className={thClass}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={`${tdClass} text-center py-12`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">👤</span>
                        <span className={dark ? "text-white/25" : "text-gray-400"}>
                          No users found.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} className={tbodyRow}>

                      {/* ID */}
                      <td className={`${tdClass} font-mono text-xs ${dark ? "text-white/30" : "text-gray-400"}`}>
                        {user.id}
                      </td>

                      {/* NAME */}
                      <td className={`${tdClass} font-medium ${dark ? "text-white/85" : "text-gray-800"}`}>
                        {user.name}
                      </td>

                      {/* EMAIL */}
                      <td className={`${tdClass} break-all`}>{user.email}</td>

                      {/* ROLE */}
                      <td className={tdClass}>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === "ROLE_ADMIN"
                            ? dark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-50 text-yellow-700"
                            : dark ? "bg-cyan-500/15 text-cyan-400"    : "bg-cyan-50 text-cyan-700"
                        }`}>
                          {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className={tdClass}>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.active
                            ? dark ? "bg-green-500/15 text-green-400" : "bg-green-50 text-green-700"
                            : dark ? "bg-red-500/15 text-red-400" : "bg-red-50 text-red-700"
                        }`}>
                          {user.active ? "Active" : "Disabled"}
                        </span>
                      </td>

                      {/* LOGIN COUNT */}
                      <td className={`${tdClass} font-mono`}>{user.loginCount || 0}</td>

                      {/* ACTIONS */}
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          {user.active ? (
                            <button
                              disabled={actionLoading}
                              onClick={() => disableUser(user.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/15 text-orange-400 hover:bg-orange-500/25 transition disabled:opacity-50"
                            >
                              Disable
                            </button>
                          ) : (
                            <button
                              disabled={actionLoading}
                              onClick={() => enableUser(user.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 text-green-400 hover:bg-green-500/25 transition disabled:opacity-50"
                            >
                              Enable
                            </button>
                          )}
                          <button
                            disabled={actionLoading}
                            onClick={() => deleteUser(user.id, user.role)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}