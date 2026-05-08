import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const empty = { name: "", email: "", phone: "", address: "" };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(empty);

  const load = () =>
    API.get("/suppliers/").then((r) => { setSuppliers(r.data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, email: s.email || "", phone: s.phone || "", address: s.address || "" }); setModal(true); };

  const save = async () => {
    if (editing) await API.put(`/suppliers/${editing.id}`, form);
    else         await API.post("/suppliers/", form);
    setModal(false);
    load();
  };

  const del = async (id) => {
    if (confirm("Delete this supplier?")) { await API.delete(`/suppliers/${id}`); load(); }
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">⟳ Loading suppliers...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Suppliers</h2>
        <p>{suppliers.length} suppliers total</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>+ Add Supplier</button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">⬢</div>
            <p>No suppliers found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td style={{ color: "var(--subtle)" }}>{s.id}</td>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td style={{ color: "var(--subtle)" }}>{s.email || "—"}</td>
                  <td style={{ color: "var(--subtle)" }}>{s.phone || "—"}</td>
                  <td style={{ color: "var(--subtle)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.address || "—"}</td>
                  <td style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => del(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? "Edit Supplier" : "New Supplier"} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Supplier name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address..." />
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

export default Suppliers;