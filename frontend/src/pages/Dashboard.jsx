import { useEffect, useState } from "react";
import API from "../api/axios";

const statConfig = [
  { key: "total_products", label: "Total Products", color: "#136f63" },
  { key: "total_categories", label: "Categories", color: "#31572c" },
  { key: "total_suppliers", label: "Suppliers", color: "#bc6c25" },
  { key: "low_stock_count", label: "Low Stock", color: "#b23a48" },
  { key: "out_of_stock_count", label: "Out of Stock", color: "#7f1d1d" },
  { key: "total_stock_value", label: "Stock Value (INR)", color: "#1d4ed8", format: true },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard/")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of inventory activity and stock health</p>
      </div>

      <div className="stats-grid">
        {statConfig.map(({ key, label, color, format }) => (
          <div className="stat-card" key={key}>
            <div className="label">{label}</div>
            <div className="value" style={{ color }}>
              {format ? `INR ${Number(stats[key]).toLocaleString()}` : stats[key]}
            </div>
            <div className="accent-bar" style={{ background: color }} />
          </div>
        ))}
      </div>

      <div className="table-wrap dashboard-tip">
        <p>Use the sidebar to manage products, categories, and suppliers in one place.</p>
      </div>
    </div>
  );
};

export default Dashboard;
