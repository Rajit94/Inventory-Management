import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const empty = { name: "", email: "", phone: "", address: "" };

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () =>
    API.get("/suppliers/").then((response) => {
      setSuppliers(response.data);
      setLoading(false);
    });

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setModal(true);
  };

  const openEdit = (supplier) => {
    setEditing(supplier);
    setForm({
      name: supplier.name,
      email: supplier.email || "",
      phone: supplier.phone || "",
      address: supplier.address || "",
    });
    setModal(true);
  };

  const save = async () => {
    if (editing) await API.put(`/suppliers/${editing.id}`, form);
    else await API.post("/suppliers/", form);

    setModal(false);
    load();
  };

  const del = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      await API.delete(`/suppliers/${id}`);
      load();
    }
  };

  const filtered = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="loading">Loading suppliers...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Suppliers</h2>
        <p>{suppliers.length} suppliers connected</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search suppliers..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>
          Add Supplier
        </button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">SP</div>
            <p>No suppliers found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="muted">{supplier.id}</td>
                  <td className="strong">{supplier.name}</td>
                  <td className="muted">{supplier.email || "N/A"}</td>
                  <td className="muted">{supplier.phone || "N/A"}</td>
                  <td className="ellipsis muted">{supplier.address || "N/A"}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost compact" onClick={() => openEdit(supplier)}>
                        Edit
                      </button>
                      <button className="btn btn-danger compact" onClick={() => del(supplier.id)}>
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
        <Modal title={editing ? "Edit Supplier" : "New Supplier"} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Supplier name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="+91 9876543210"
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              placeholder="Full address..."
            />
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
    </div>
  );
};

export default Suppliers;
