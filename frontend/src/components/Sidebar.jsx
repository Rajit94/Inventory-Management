const Sidebar = ({ page, setPage, user, onLogout }) => {
  const links = [
    { id: "dashboard", label: "Dashboard", icon: "DB" },
    { id: "products", label: "Products", icon: "PR" },
    { id: "categories", label: "Categories", icon: "CT" },
    { id: "suppliers", label: "Suppliers", icon: "SP" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>InvenTrack</h1>
        <span>Inventory Control Center</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <button
            key={link.id}
            className={`nav-item ${page === link.id ? "active" : ""}`}
            onClick={() => setPage(link.id)}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-name">{user?.full_name}</div>
        <div className="user-email">{user?.email}</div>
        <button className="btn btn-ghost sidebar-logout" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
