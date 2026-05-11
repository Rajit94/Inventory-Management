import { useEffect, useState } from "react";
import API from "../api/axios";
import Modal from "../components/Modal";

const empty = { name: "", description: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () =>
    API.get("/categories/").then((response) => {
      setCategories(response.data);
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

  const openEdit = (category) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description || "" });
    setModal(true);
  };

  const save = async () => {
    if (editing) await API.put(`/categories/${editing.id}`, form);
    else await API.post("/categories/", form);

    setModal(false);
    load();
  };

  const del = async (id) => {
    if (window.confirm("Delete this category?")) {
      await API.delete(`/categories/${id}`);
      load();
    }
  };

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Categories</h2>
        <p>{categories.length} categories available</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search categories..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button className="btn btn-primary" onClick={openAdd}>
          Add Category
        </button>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="icon">CT</div>
            <p>No categories found</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((category) => (
                <tr key={category.id}>
                  <td className="muted">{category.id}</td>
                  <td>
                    <span className="badge badge-blue">{category.name}</span>
                  </td>
                  <td className="muted">{category.description || "N/A"}</td>
                  <td className="muted">{new Date(category.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost compact" onClick={() => openEdit(category)}>
                        Edit
                      </button>
                      <button className="btn btn-danger compact" onClick={() => del(category.id)}>
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
        <Modal title={editing ? "Edit Category" : "New Category"} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Electronics"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Optional category details..."
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

export default Categories;
