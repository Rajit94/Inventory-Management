import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  low_stock_threshold: 10,
  category_id: "",
  supplier_id: "",
};

const stockBadge = (qty, threshold) => {
  if (qty === 0) return <span className="badge badge-danger">Out of Stock</span>;
  if (qty <= threshold) return <span className="badge badge-warn">Low Stock</span>;
  return <span className="badge badge-green">In Stock</span>;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [stockModal, setStockModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [stockForm, setStockForm] = useState({ change: "", reason: "" });

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold,
      category_id: product.category?.id || "",
      supplier_id: product.supplier?.id || "",
    });
    setModal(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      price: parseFloat(form.price || 0),
      quantity: parseInt(form.quantity || 0, 10),
      low_stock_threshold: parseInt(form.low_stock_threshold || 0, 10),
      category_id: form.category_id || null,
      supplier_id: form.supplier_id || null,
    };

    if (editing) await API.put(`/products/${editing.id}`, payload);
    else await API.post("/products/", payload);

    setModal(false);
    load();
  };

  const del = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      load();
    }
  };

  const updateStock = async () => {
    await API.post(`/products/${stockModal.id}/stock`, {
      product_id: stockModal.id,
      change: parseInt(stockForm.change || 0, 10),
      reason: stockForm.reason,
    });
    setStockModal(null);
    setStockForm({ change: "", reason: "" });
    load();
  };

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="loading">Loading products...</div>;

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
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>
          Add Product
        </button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">PR</div>
            <p>No products found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
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
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td className="strong">{product.name}</td>
                  <td>INR {product.price.toLocaleString()}</td>
                  <td className="strong">{product.quantity}</td>
                  <td>{stockBadge(product.quantity, product.low_stock_threshold)}</td>
                  <td>
                    {product.category ? (
                      <span className="badge badge-blue">{product.category.name}</span>
                    ) : (
                      <span className="muted">N/A</span>
                    )}
                  </td>
                  <td className="muted">{product.supplier?.name || "N/A"}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost compact"
                        onClick={() => {
                          setStockModal(product);
                          setStockForm({ change: "", reason: "" });
                        }}
                      >
                        Stock
                      </button>
                      <button className="btn btn-ghost compact" onClick={() => openEdit(product)}>
                        Edit
                      </button>
                      <button className="btn btn-danger compact" onClick={() => del(product.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Product" : "New Product"} onClose={() => setModal(false)}>
          <div className="form-grid">
            <div className="form-group span-two">
              <label>Product Name</label>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Laptop Pro 14"
              />
            </div>
            <div className="form-group">
              <label>Price (INR)</label>
              <input
                type="number"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Low Stock Threshold</label>
              <input
                type="number"
                value={form.low_stock_threshold}
                onChange={(event) => setForm({ ...form, low_stock_threshold: event.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category_id}
                onChange={(event) => setForm({ ...form, category_id: event.target.value })}
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group span-two">
              <label>Supplier</label>
              <select
                value={form.supplier_id}
                onChange={(event) => setForm({ ...form, supplier_id: event.target.value })}
              >
                <option value="">None</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group span-two">
              <label>Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Optional details..."
              />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={save}>
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </Modal>
      )}

      {stockModal && (
        <Modal title={`Update Stock - ${stockModal.name}`} onClose={() => setStockModal(null)}>
          <p className="helper-text">
            Current stock: <strong>{stockModal.quantity} units</strong>
          </p>
          <div className="form-group">
            <label>Change (+ add / - remove)</label>
            <input
              type="number"
              value={stockForm.change}
              onChange={(event) => setStockForm({ ...stockForm, change: event.target.value })}
              placeholder="50 or -10"
            />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input
              value={stockForm.reason}
              onChange={(event) => setStockForm({ ...stockForm, reason: event.target.value })}
              placeholder="Restock from supplier"
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setStockModal(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={updateStock}>
              Update Stock
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Products;
