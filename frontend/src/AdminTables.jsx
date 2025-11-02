import React, { useEffect, useState } from "react";
import logo from "./assets/logo.svg";
import { API } from "./_api";

export default function AdminTables() {
  const [list, setList] = useState([]);
  const [toast, setToast] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, number: "", seats: "", status: "free" });
  const [confirmDel, setConfirmDel] = useState(null);

  const notify = (m) => { setToast(m); setTimeout(() => setToast(""), 1600); };

  async function load() {
    try {
      const r = await fetch(`${API}/tables.php`, { credentials: "include" });
      const d = await r.json().catch(() => []);
      setList(Array.isArray(d) ? d : []);
    } catch { setList([]); }
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ id: null, number: "", seats: "", status: "free" });
    setShowForm(true);
  }
  function openEdit(t) {
    setForm({ id: t.id, number: t.number, seats: t.seats, status: t.status });
    setShowForm(true);
  }

  async function saveForm(e) {
    e.preventDefault();
    const payload = {
      number: Number(form.number),
      seats: Number(form.seats),
      status: form.status || "free",
      ...(form.id ? { id: form.id } : {}),
    };
    const method = form.id ? "PATCH" : "POST";

    const r = await fetch(`${API}/tables.php`, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await r.json().catch(() => ({}));
    if (d.ok) {
      setShowForm(false);
      notify(form.id ? "Table updated ✅" : "Table created ✅");
      load();
    } else notify(d.error || "Error");
  }

  async function toggleStatus(id, status) {
    const r = await fetch(`${API}/tables.php`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const d = await r.json().catch(() => ({}));
    if (d.ok) { notify("Status updated ✅"); load(); } else notify(d.error || "Error");
  }

  async function doDelete(id) {
    const r = await fetch(`${API}/tables.php?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const d = await r.json().catch(() => ({}));
    setConfirmDel(null);
    if (d.ok) { notify("Table deleted 🗑️"); load(); } else notify(d.error || "Error");
  }

  const freeCount = list.filter(t => t.status === "free").length;
  const occupiedCount = list.filter(t => t.status === "occupied").length;

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
            Tables Management
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Manage all coffee shop tables
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
          ➕ Add Table
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
            Total Tables
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>
            {list.length}
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #228B22",
          }}
        >
          <p style={{ margin: "0 0 8px 0", color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
            Available
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#228B22" }}>
            {freeCount}
          </p>
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
            Occupied
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#D2691E" }}>
            {occupiedCount}
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {list.map((tab) => (
          <div
            key={tab.id}
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "16px",
              padding: "24px",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#6B4423" }}>
                🪑 Table {tab.number ?? tab.id}
              </h3>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: tab.status === "free" ? "#228B22" : "#D2691E",
                  background: tab.status === "free" ? "#D4EDDA" : "#FFE4C4",
                }}
              >
                {tab.status === "free" ? "✅ Available" : "🔴 Occupied"}
              </span>
            </div>

            <p style={{ margin: "0 0 20px 0", fontSize: "16px", color: "#6B4423", fontWeight: "600" }}>
              👥 {tab.seats} seats
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                onClick={() => openEdit(tab)}
                style={{
                  flex: "1 1 auto",
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
                onMouseOver={(e) => e.target.style.opacity = "0.9"}
                onMouseOut={(e) => e.target.style.opacity = "1"}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => toggleStatus(tab.id, tab.status === "free" ? "occupied" : "free")}
                style={{
                  flex: "1 1 auto",
                  background: tab.status === "free" ? "#D2691E" : "#228B22",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => e.target.style.opacity = "0.9"}
                onMouseOut={(e) => e.target.style.opacity = "1"}
              >
                {tab.status === "free" ? "🔴 Occupy" : "✅ Free"}
              </button>

              <button
                onClick={() => setConfirmDel({ id: tab.id, label: `Table ${tab.number ?? tab.id}` })}
                style={{
                  flex: "0 0 auto",
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
                onMouseOver={(e) => e.target.style.opacity = "0.9"}
                onMouseOut={(e) => e.target.style.opacity = "1"}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
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
          onClick={() => setShowForm(false)}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 24px 0", fontSize: "28px", fontWeight: "800", color: "#6B4423" }}>
              {form.id ? "✏️ Edit Table" : "➕ New Table"}
            </h3>

            <form onSubmit={saveForm}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Table Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
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
                  onFocus={(e) => e.target.style.borderColor = "#8B4513"}
                  onBlur={(e) => e.target.style.borderColor = "#D4A574"}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: e.target.value })}
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
                  onFocus={(e) => e.target.style.borderColor = "#8B4513"}
                  onBlur={(e) => e.target.style.borderColor = "#D4A574"}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
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
                  onFocus={(e) => e.target.style.borderColor = "#8B4513"}
                  onBlur={(e) => e.target.style.borderColor = "#D4A574"}
                >
                  <option value="free">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
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
                  {form.id ? "💾 Save" : "➕ Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
              🗑️ Delete Table
            </h3>
            <p style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#6B4423" }}>
              Are you sure you want to delete <strong>{confirmDel.label}</strong>?
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => doDelete(confirmDel.id)}
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

      {/* Toast */}
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
