// src/pages/AdminDashboard.jsx
import React, { useMemo } from "react";
import AdminSidebar from "../components/AdminSlidebar";
import { Link } from "react-router-dom";

function AdminDashboard() {
  // --- Mock metrics (replace with real data/API) ---
  const metrics = useMemo(
    () => ({
      totalArtworks: 128,
      activeExhibitions: 4,
      pendingPayments: 7,
      openBids: 9,
      revenueMonth: "LKR 1,240,000",
      growthMoM: "+12.4%",
    }),
    []
  );

  const recentOrders = useMemo(
    () => [
      {
        id: "ORD-10238",
        artCode: "ART042",
        customer: "Kasun Perera",
        amount: "LKR 120,000",
        status: "Payment Confirmed",
        date: "2025-09-01",
      },
      {
        id: "ORD-10237",
        artCode: "ART019",
        customer: "Sithumi De Silva",
        amount: "LKR 95,000",
        status: "Out for Delivery",
        date: "2025-08-31",
      },
      {
        id: "ORD-10236",
        artCode: "ART077",
        customer: "Nimal Silva",
        amount: "LKR 150,000",
        status: "Payment Verifying",
        date: "2025-08-31",
      },
      {
        id: "ORD-10235",
        artCode: "ART011",
        customer: "Priya Fernando",
        amount: "LKR 75,000",
        status: "Ready for Pickup",
        date: "2025-08-30",
      },
    ],
    []
  );

  const statusBadge = (status) => {
    const map = {
      "Payment Pending": "bg-red-100 text-red-700",
      "Payment Verifying": "bg-yellow-100 text-yellow-700",
      "Payment Confirmed": "bg-blue-100 text-blue-700",
      Processing: "bg-purple-100 text-purple-700",
      "Ready for Pickup": "bg-indigo-100 text-indigo-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
      Delivered: "bg-green-100 text-green-700",
      "Picked Up": "bg-green-100 text-green-700",
      Cancelled: "bg-gray-100 text-gray-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            A quick overview of gallery operations and performance.
          </p>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <KpiCard
            title="Total Artworks"
            value={metrics.totalArtworks}
            hint="+6 this week"
            icon={
              <IconFrame>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M4 5h16v14H4zM8 9h8M8 13h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            }
          />
          <KpiCard
            title="Active Exhibitions"
            value={metrics.activeExhibitions}
            hint="2 opening this month"
            icon={
              <IconFrame>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M4 7h16M6 11h12M8 15h8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            }
          />
          <KpiCard
            title="Pending Payments"
            value={metrics.pendingPayments}
            hint="Follow up required"
            icon={
              <IconFrame>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M12 8v5m0 3h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            }
          />
          <KpiCard
            title="Open Bids"
            value={metrics.openBids}
            hint="3 end this week"
            icon={
              <IconFrame>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M4 17l6-6 4 4 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            }
          />
          <KpiCard
            title="Revenue (This Month)"
            value={metrics.revenueMonth}
            hint={metrics.growthMoM + " MoM"}
            icon={
              <IconFrame>
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M4 16l4-4 3 3 6-6M4 20h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            }
          />
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Operations Health</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  Stable
                </p>
              </div>
              <IconFrame variant="indigo">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconFrame>
            </div>
            <div className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
              No outages reported. Courier delays: none.
            </div>
          </div>
        </section>

        {/* Two-column: Trends + Quick Actions */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trends / Simple Sparkline-style blocks (no external charts) */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Weekly Trends
              </h3>
              <span className="text-xs text-gray-500">Last 7 days</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TrendBlock label="Orders" value="32" delta="+8%" />
              <TrendBlock label="Bids Placed" value="57" delta="+12%" />
              <TrendBlock label="Visitors" value="1,420" delta="+4%" />
            </div>

            {/* Faux chart: bars for quick visual (accessible) */}
            <div className="mt-6">
              <div className="flex items-end gap-2 h-28">
                {[40, 55, 48, 62, 70, 66, 74].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-md bg-gray-900/80"
                    style={{ height: `${h}%` }}
                    aria-label={`Day ${i + 1} value ${h}`}
                    title={`Day ${i + 1}: ${h}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-4 space-y-3">
              <LinkBtn to="/admin/art-management">Add New Artwork</LinkBtn>
              <LinkBtn to="/admin/exhibition-management">Create Exhibition</LinkBtn>
              <LinkBtn to="/admin/order-management">Verify Payments</LinkBtn>
              <LinkBtn to="/admin/bidding-management">Review Bids</LinkBtn>
            </div>
            <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
              Tip: Use <span className="font-medium">Generate PDF</span> in each
              section to export reports for your records.
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <Link
              to="/admin/order-management"
              className="text-sm text-gray-700 hover:text-black underline"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-left text-sm text-gray-700">
                <tr>
                  {["Order ID", "Art Code", "Customer", "Amount", "Status", "Date", "Action"].map(
                    (h) => (
                      <th key={h} className="px-4 py-3 border-b">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b font-medium">{o.id}</td>
                    <td className="px-4 py-3 border-b text-blue-700 font-mono">
                      {o.artCode}
                    </td>
                    <td className="px-4 py-3 border-b">{o.customer}</td>
                    <td className="px-4 py-3 border-b">{o.amount}</td>
                    <td className="px-4 py-3 border-b">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusBadge(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">{o.date}</td>
                    <td className="px-4 py-3 border-b">
                      <Link
                        to="/admin/order-management"
                        className="text-xs text-white bg-black hover:bg-gray-800 rounded px-3 py-1"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500"
                      colSpan={7}
                    >
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

function KpiCard({ title, value, hint, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        {icon}
      </div>
    </div>
  );
}

function IconFrame({ children, variant = "gray" }) {
  const variants = {
    gray: "bg-gray-100 text-gray-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl ${variants[variant]}`}
    >
      {children}
    </div>
  );
}

function TrendBlock({ label, value, delta }) {
  const isUp = delta?.trim().startsWith("+");
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <span
          className={`text-xs font-medium ${
            isUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {delta}
        </span>
      </div>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function LinkBtn({ to, children }) {
  return (
    <Link
      to={to}
      className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}

export default AdminDashboard;
