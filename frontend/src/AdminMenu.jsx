import React, { useEffect, useMemo, useState } from "react";
import { API, IMG, fetchJSON } from "./_api";
import logo from "./assets/logo.svg";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ id: null, name: "", category_id: "", price: "", description: "", photo: null });
  const [confirmDel, setConfirmDel] = useState(null);

  const t = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1600);
  };

  async function load() {
    const a = await fetchJSON(`${API}/menu.php`).catch(() => []);
    const b = await fetchJSON(`${API}/categories.php`).catch(() => []);
    setItems(Array.isArray(a) ? a : []);
    setCats(Array.isArray(b) ? b : []);
  }

  useEffect(() => {
    load();
  }, []);

  const isEditing = useMemo(() => !!form.id, [form.id]);

  const openAdd = () => {
    setForm({ id: null, name: "", category_id: "", price: "", description: "", photo: null });
    setOpen(true);
  };

  const openEdit = (m) => {
    setForm({
      id: m.id,
      name: m.name || "",
      category_id: String(m.category_id || ""),
      price: String(m.price ?? ""),
      description: m.description || "",
      photo: null,
    });
    setOpen(true);
  };

  const del = async (id) => {
    const d = await fetchJSON(`${API}/menu.php?id=${id}`, { method: "DELETE" });
    setConfirmDel(null);
    if (d.ok) {
      t("Item deleted 🗑️");
      load();
    } else t(d.error || "Error");
  };

  const save = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category_id", form.category_id);
    fd.append("price", form.price);
    fd.append("description", form.description);
    if (form.photo) {
      fd.append("photo", form.photo);
      fd.append("image", form.photo);
    }
    const url = isEditing ? `${API}/menu.php?id=${form.id}&_method=PUT` : `${API}/menu.php`;
    const r = await fetch(url, { method: "POST", credentials: "include", body: fd });
    const d = await r.json().catch(() => ({}));
    if (d.ok) {
      setOpen(false);
      t(isEditing ? "Menu item updated ✅" : "Menu item created ✅");
      load();
    } else t(d.error || "Error");
  };

  // Group items by category for stats
  const itemsByCategory = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      const catName = item.category || "Uncategorized";
      if (!grouped[catName]) grouped[catName] = 0;
      grouped[catName]++;
    });
    return grouped;
  }, [items]);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Section with Logo */}
      <div
        style={{
          background: "linear-gradient(135deg, #6B4423 0%, #3E2723 100%)",
          color: "#FFEFD5",
          borderRadius: "16px",
          padding: "32px 40px",
          marginBottom: "24px",
          boxShadow: "0 12px 30px rgba(107, 68, 35, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <img src={logo} alt="CoffeApp Logo" style={{ width: "80px", height: "80px" }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "36px", fontWeight: "800" }}>
            Menu Management
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Manage coffee shop menu items and categories
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            background: "#FFEFD5",
            color: "#6B4423",
            border: "none",
            padding: "14px 28px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          ➕ Add Item
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #8B4513",
          }}
        >
          <p style={{ margin: "0 0 8px 0", color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            Total Items
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>{items.length}</p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #D2691E",
          }}
        >
          <p style={{ margin: "0 0 8px 0", color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            Categories
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#D2691E" }}>{cats.length}</p>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {items.map((m) => (
          <div
            key={m.id}
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
              border: "2px solid #F5DEB3",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(107, 68, 35, 0.25)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(107, 68, 35, 0.15)";
            }}
          >
            {m.image_path && (
              <img
                src={IMG + m.image_path}
                alt={m.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderBottom: "2px solid #F5DEB3",
                }}
              />
            )}
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#8B4513",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                {m.category || "Uncategorized"}
              </div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "800", color: "#6B4423" }}>
                {m.name}
              </h3>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#8B4513", marginBottom: "12px" }}>
                €{Number(m.price).toFixed(2)}
              </div>
              {m.description && (
                <p style={{ margin: "0 0 16px 0", color: "#A0826D", fontSize: "14px", lineHeight: "1.5" }}>
                  {m.description}
                </p>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => openEdit(m)}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
                    color: "#FFEFD5",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => setConfirmDel({ id: m.id, name: m.name })}
                  style={{
                    flex: 0,
                    background: "#DC3545",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>☕</div>
            <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>No menu items yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(107, 68, 35, 0.4)",
              border: "3px solid #F5DEB3",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 24px 0", fontSize: "28px", fontWeight: "800", color: "#6B4423" }}>
              {isEditing ? "✏️ Edit Menu Item" : "➕ Add Menu Item"}
            </h3>

            <form onSubmit={save}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Item Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #D4A574",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6B4423",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
                  onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #D4A574",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6B4423",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
                  onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
                >
                  <option value="">— Choose category —</option>
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Price (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #D4A574",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6B4423",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
                  onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #D4A574",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#6B4423",
                    outline: "none",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
                  onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((f) => ({ ...f, photo: e.target.files?.[0] || null }))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "2px solid #D4A574",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6B4423",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
                  onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
                    color: "#FFEFD5",
                    border: "none",
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {isEditing ? "💾 Save Changes" : "➕ Create Item"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{
                    flex: 1,
                    background: "#E5E7EB",
                    color: "#6B4423",
                    border: "none",
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDel && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setConfirmDel(null)}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(107, 68, 35, 0.4)",
              border: "3px solid #F5DEB3",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: "800", color: "#DC3545" }}>
              🗑️ Delete Menu Item
            </h3>
            <p style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#6B4423" }}>
              Are you sure you want to delete <strong>{confirmDel.name}</strong>?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => del(confirmDel.id)}
                style={{
                  flex: 1,
                  background: "#DC3545",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
              <button
                onClick={() => setConfirmDel(null)}
                style={{
                  flex: 1,
                  background: "#E5E7EB",
                  color: "#6B4423",
                  border: "none",
                  padding: "14px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
            color: "#FFEFD5",
            padding: "16px 28px",
            borderRadius: "12px",
            boxShadow: "0 12px 30px rgba(139, 69, 19, 0.4)",
            fontWeight: "700",
            fontSize: "16px",
            zIndex: 1000,
            border: "2px solid #D4A574",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
