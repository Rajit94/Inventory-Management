import { useEffect, useState } from "react";
import API from "../api/axios";

const statConfig = [
  { key: "total_products",    label: "Total Products",   color: "#4f8ef7" },
  { key: "total_categories",  label: "Categories",       color: "#34d39a" },
  { key: "total_suppliers",   label: "Suppliers",        color: "#a78bfa" },
  { key: "low_stock_count",   label: "Low Stock",        color: "#f7b84f" },
  { key: "out_of_stock_count",label: "Out of Stock",     color: "#f75f5f" },
  { key: "total_stock_value", label: "Stock Value (₹)",  color: "#4f8ef7", format: true },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">⟳ Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your inventory system</p>
      </div>

      <div className="stats-grid">
        {statConfig.map(({ key, label, color, format }) => (
          <div className="stat-card" key={key}>
            <div className="label">{label}</div>
            <div className="value" style={{ color }}>
              {format ? `₹${Number(stats[key]).toLocaleString()}` : stats[key]}
            </div>
            <div className="accent-bar" style={{ background: color }} />
          </div>
        ))}
      </div>

      <div className="table-wrap" style={{ padding: "28px", textAlign: "center" }}>
        <p style={{ color: "var(--subtle)", fontFamily: "var(--font-head)", fontSize: "13px" }}>
          ✦ Use the sidebar to manage your Products, Categories, and Suppliers
        </p>
      </div>
    </div>
  );
};

export default Dashboard;