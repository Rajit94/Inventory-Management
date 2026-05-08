import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const empty = { name: "", description: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);

  const load = () =>
    API.get("/categories/").then((r) => { setCategories(r.data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || "" }); setModal(true); };

  const save = async () => {
    if (editing) await API.put(`/categories/${editing.id}`, form);
    else         await API.post("/categories/", form);
    setModal(false);
    load();
  };

  const del = async (id) => {
    if (confirm("Delete this category?")) { await API.delete(`/categories/${id}`); load(); }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">⟳ Loading categories...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Categories</h2>
        <p>{categories.length} categories total</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>+ Add Category</button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">◈</div>
            <p>No categories found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--subtle)" }}>{c.id}</td>
                  <td><span className="badge badge-blue">{c.name}</span></td>
                  <td style={{ color: "var(--subtle)" }}>{c.description || "—"}</td>
                  <td style={{ color: "var(--subtle)" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(c)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => del(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Category" : "New Category"} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electronics" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? "Update" : "Create"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;