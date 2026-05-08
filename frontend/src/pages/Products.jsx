import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const emptyForm = { name: "", description: "", price: "", quantity: "", low_stock_threshold: 10, category_id: "", supplier_id: "" };

const stockBadge = (qty, threshold) => {
  if (qty === 0)        return <span className="badge badge-danger">Out of Stock</span>;
  if (qty <= threshold) return <span className="badge badge-warn">Low Stock</span>;
  return                       <span className="badge badge-green">In Stock</span>;
};

const Products = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers,  setSuppliers]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(false);
  const [stockModal, setStockModal] = useState(null); // holds product for stock update
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(emptyForm);
  const [stockForm,  setStockForm]  = useState({ change: "", reason: "" });

  const load = async () => {
    const [p, c, s] = await Promise.all([
      API.get("/products/"),
      API.get("/categories/"),
      API.get("/suppliers/"),
    ]);
    setProducts(p.data);
    setCategories(c.data);
    setSuppliers(s.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || "",
      price: p.price, quantity: p.quantity,
      low_stock_threshold: p.low_stock_threshold,
      category_id: p.category?.id || "",
      supplier_id: p.supplier?.id || "",
    });
    setModal(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      low_stock_threshold: parseInt(form.low_stock_threshold),
      category_id: form.category_id || null,
      supplier_id: form.supplier_id || null,
    };
    if (editing) await API.put(`/products/${editing.id}`, payload);
    else         await API.post("/products/", payload);
    setModal(false);
    load();
  };

  const del = async (id) => {
    if (confirm("Delete this product?")) { await API.delete(`/products/${id}`); load(); }
  };

  const updateStock = async () => {
    await API.post(`/products/${stockModal.id}/stock`, {
      product_id: stockModal.id,
      change: parseInt(stockForm.change),
      reason: stockForm.reason,
    });
    setStockModal(null);
    setStockForm({ change: "", reason: "" });
    load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">⟳ Loading products...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <p>{products.length} products in inventory</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">⬡</div>
            <p>No products found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "var(--subtle)" }}>{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>{p.quantity}</td>
                  <td>{stockBadge(p.quantity, p.low_stock_threshold)}</td>
                  <td>{p.category ? <span className="badge badge-blue">{p.category.name}</span> : <span style={{color:"var(--subtle)"}}>—</span>}</td>
                  <td style={{ color: "var(--subtle)" }}>{p.supplier?.name || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="btn btn-ghost" style={{fontSize:"11px", padding:"5px 10px"}} onClick={() => { setStockModal(p); setStockForm({ change: "", reason: "" }); }}>Stock</button>
                      <button className="btn btn-ghost" style={{fontSize:"11px", padding:"5px 10px"}} onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger" style={{fontSize:"11px", padding:"5px 10px"}} onClick={() => del(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modal && (
        <Modal title={editing ? "Edit Product" : "New Product"} onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label>Product Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. iPhone 15" />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input type="number" value={form.low_stock_threshold} onChange={(e) => setForm({ ...form, low_stock_threshold: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">— None —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label>Supplier</label>
              <select value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}>
                <option value="">— None —</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label>Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional..." />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? "Update" : "Create"}</button>
          </div>
        </Modal>
      )}

      {/* Stock Update Modal */}
      {stockModal && (
        <Modal title={`Update Stock — ${stockModal.name}`} onClose={() => setStockModal(null)}>
          <p style={{ color: "var(--subtle)", marginBottom: "16px", fontSize: "12px" }}>
            Current stock: <strong style={{ color: "var(--text)" }}>{stockModal.quantity} units</strong>
          </p>
          <div className="form-group">
            <label>Change (+ to add, - to remove)</label>
            <input type="number" value={stockForm.change} onChange={(e) => setStockForm({ ...stockForm, change: e.target.value })} placeholder="e.g. 50 or -10" />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input value={stockForm.reason} onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })} placeholder="e.g. Restocked from supplier" />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setStockModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={updateStock}>Update Stock</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Products;