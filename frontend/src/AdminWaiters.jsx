import React, { useEffect, useState } from "react";
import { API, fetchJSON } from "./_api";
import logo from "./assets/logo.svg";

export default function AdminWaiters() {
  const [list, setList] = useState([]);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState({ id: 0, full_name: "", email: "", phone: "", password: "" });
  const [confirmDel, setConfirmDel] = useState(null);

  const t = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1600);
  };

  const load = async () => {
    const d = await fetchJSON(`${API}/waiters.php`).catch(() => []);
    setList(Array.isArray(d) ? d : []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    const d = await fetchJSON(`${API}/waiters.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (d.ok) {
      setForm({ full_name: "", email: "", password: "", phone: "" });
      t("Waiter created ✅");
      load();
    } else t(d.error || "Error");
  };

  const del = async (id) => {
    const d = await fetchJSON(`${API}/waiters.php?id=${id}`, { method: "DELETE" });
    setConfirmDel(null);
    if (d.ok) {
      t("Waiter deleted 🗑️");
      load();
    } else t(d.error || "Error");
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const d = await fetchJSON(`${API}/waiters.php?id=${edit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    if (d.ok) {
      setEditOpen(false);
      t("Waiter updated ✅");
      load();
    } else t(d.error || "Error");
  };

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
            Waiters Management
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Manage coffee shop staff members
          </p>
        </div>
      </div>

      {/* Stats Card */}
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
            Total Waiters
          </p>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>{list.length}</p>
        </div>
      </div>

      {/* Add Waiter Form */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
          border: "2px solid #F5DEB3",
        }}
      >
        <h3 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "800", color: "#6B4423" }}>
          ➕ Add New Waiter
        </h3>
        <form onSubmit={create}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
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

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                Phone (optional)
              </label>
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          </div>

          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
              color: "#FFEFD5",
              border: "none",
              padding: "14px 32px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(139, 69, 19, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(139, 69, 19, 0.3)";
            }}
          >
            ➕ Create Waiter
          </button>
        </form>
      </div>

      {/* Waiters List */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
          border: "2px solid #F5DEB3",
        }}
      >
        <h3 style={{ margin: "0 0 24px 0", fontSize: "24px", fontWeight: "800", color: "#6B4423" }}>
          📋 Existing Waiters
        </h3>

        {list.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>👥</div>
            <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>No waiters yet</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", padding: "4px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)", color: "#FFEFD5" }}>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      borderTopLeftRadius: "8px",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    Phone
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    Created
                  </th>
                  <th
                    style={{
                      padding: "16px 20px",
                      textAlign: "right",
                      fontWeight: "700",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      borderTopRightRadius: "8px",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((w, idx) => (
                  <tr
                    key={w.id}
                    style={{
                      borderBottom: idx < list.length - 1 ? "1px solid #F5DEB3" : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#FFF8E7";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "20px", color: "#6B4423", fontWeight: "700", fontSize: "16px" }}>
                      {w.full_name}
                    </td>
                    <td style={{ padding: "20px", color: "#6B4423", fontWeight: "600", fontSize: "14px" }}>
                      {w.email}
                    </td>
                    <td style={{ padding: "20px", color: "#A0826D", fontWeight: "600", fontSize: "14px" }}>
                      {w.phone || "-"}
                    </td>
                    <td style={{ padding: "20px", color: "#A0826D", fontWeight: "600", fontSize: "14px" }}>
                      {w.created_at ? new Date(w.created_at).toLocaleDateString() : "-"}
                    </td>
                    <td style={{ padding: "20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => {
                            setEdit({
                              id: w.id,
                              full_name: w.full_name,
                              email: w.email,
                              phone: w.phone || "",
                              password: "",
                            });
                            setEditOpen(true);
                          }}
                          style={{
                            background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
                            color: "#FFEFD5",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
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
                          onClick={() => setConfirmDel({ id: w.id, name: w.full_name })}
                          style={{
                            background: "#DC3545",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                          onMouseOut={(e) => (e.target.style.opacity = "1")}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editOpen && (
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
          onClick={() => setEditOpen(false)}
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
              ✏️ Edit Waiter
            </h3>

            <form onSubmit={saveEdit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={edit.full_name}
                  onChange={(e) => setEdit({ ...edit, full_name: e.target.value })}
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
                  Email
                </label>
                <input
                  type="email"
                  value={edit.email}
                  onChange={(e) => setEdit({ ...edit, email: e.target.value })}
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
                  Phone
                </label>
                <input
                  type="text"
                  value={edit.phone}
                  onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
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

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "700", color: "#6B4423" }}>
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={edit.password}
                  onChange={(e) => setEdit({ ...edit, password: e.target.value })}
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
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
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
              🗑️ Delete Waiter
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
