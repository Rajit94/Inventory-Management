const Sidebar = ({ page, setPage }) => {
  const links = [
    { id: "dashboard",  label: "Dashboard",  icon: "▦" },
    { id: "products",   label: "Products",   icon: "⬡" },
    { id: "categories", label: "Categories", icon: "◈" },
    { id: "suppliers",  label: "Suppliers",  icon: "⬢" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>InvenTrack</h1>
        <span>Inventory System</span>
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
    </div>
  );
};

export default Sidebar;