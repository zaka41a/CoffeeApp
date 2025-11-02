import React, { useEffect, useState } from "react";
import logo from "./assets/logo.svg";
import { API, IMG } from "./_api";

export default function OrdersPage() {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [tableId, setTableId] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");

  const toastify = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1800);
  };

  useEffect(() => {
    async function load() {
      try {
        const [rT, rM] = await Promise.all([
          fetch(`${API}/tables.php`, { credentials: "include" }),
          fetch(`${API}/menu.php`, { credentials: "include" }),
        ]);
        const t = await rT.json().catch(() => []);
        const m = await rM.json().catch(() => []);
        setTables(Array.isArray(t) ? t : []);
        setMenu(Array.isArray(m) ? m : []);
      } catch {
        setTables([]);
        setMenu([]);
      }
    }
    load();
  }, []);

  function addItem(m) {
    setCart((cs) => {
      const i = cs.findIndex((x) => x.id === m.id);
      if (i >= 0) {
        const copy = [...cs];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...cs, { id: m.id, name: m.name, price: Number(m.price), qty: 1 }];
    });
  }

  const dec = (id) => setCart((cs) => cs.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c)));
  const remove = (id) => setCart((cs) => cs.filter((c) => c.id !== id));
  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);

  async function submit() {
    if (!tableId) {
      toastify("⚠️ Please choose a table");
      return;
    }
    if (cart.length === 0) {
      toastify("⚠️ Cart is empty");
      return;
    }
    const r = await fetch(`${API}/orders.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_id: Number(tableId),
        items: cart.map((c) => ({ menu_item_id: c.id, qty: c.qty })),
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (d.ok) {
      setCart([]);
      toastify("✅ Order placed successfully");
    } else {
      toastify(d.error || "Error");
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1600px", margin: "0 auto" }}>
      {/* Hero Section with Logo */}
      <div
        style={{
          background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
          color: "#FFEFD5",
          borderRadius: "16px",
          padding: "32px 40px",
          marginBottom: "24px",
          boxShadow: "0 12px 30px rgba(139, 69, 19, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <img src={logo} alt="CoffeApp Logo" style={{ width: "80px", height: "80px" }} />
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "36px", fontWeight: "800" }}>
            🧾 Create Order
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Take new orders for tables
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
        {/* ---------------- Left: Menu ---------------- */}
        <div>
          {/* Table Selector */}
          <div
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
              border: "2px solid #F5DEB3",
            }}
          >
            <label style={{ display: "block", marginBottom: "12px", fontSize: "16px", fontWeight: "700", color: "#6B4423" }}>
              🪑 Select Table
            </label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "2px solid #D4A574",
                fontSize: "16px",
                fontWeight: "600",
                color: "#6B4423",
                outline: "none",
                background: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8B4513")}
              onBlur={(e) => (e.target.style.borderColor = "#D4A574")}
            >
              <option value="">— Choose table —</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.number} ({t.seats} seats) — {t.status}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Items */}
          {menu.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>☕</div>
              <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>No menu items available</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "20px",
              }}
            >
              {menu.map((m) => (
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
                    e.currentTarget.style.transform = "translateY(-2px)";
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
                        height: "140px",
                        objectFit: "cover",
                        borderBottom: "2px solid #F5DEB3",
                        display: "block",
                      }}
                    />
                  )}
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontSize: "11px", color: "#8B4513", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>
                      {m.category || "Uncategorized"}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#6B4423" }}>{m.name}</h3>
                      <strong style={{ fontSize: "18px", color: "#8B4513" }}>€{Number(m.price).toFixed(2)}</strong>
                    </div>
                    {m.description && <p style={{ margin: "0 0 12px 0", color: "#A0826D", fontSize: "13px" }}>{m.description}</p>}
                    <button
                      onClick={() => addItem(m)}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #228B22 0%, #1a6b1a 100%)",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                      onMouseOut={(e) => (e.target.style.opacity = "1")}
                    >
                      ➕ Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- Right: Cart ---------------- */}
        <aside style={{ position: "sticky", top: "20px", height: "fit-content" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
              border: "2px solid #F5DEB3",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "28px" }}>🧺</span>
              <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#6B4423" }}>Cart</h3>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.3 }}>🧺</div>
                <p style={{ margin: 0, color: "#A0826D", fontSize: "16px" }}>Cart is empty</p>
              </div>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                {cart.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: "#FFF8E7",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "12px",
                      border: "2px solid #F5DEB3",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#6B4423", marginBottom: "4px" }}>{c.name}</div>
                        <div style={{ fontSize: "13px", color: "#A0826D" }}>
                          {c.qty} × €{c.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontSize: "18px", fontWeight: "900", color: "#8B4513" }}>€{(c.price * c.qty).toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => dec(c.id)}
                        style={{
                          flex: 1,
                          background: "#E5E7EB",
                          color: "#6B4423",
                          border: "none",
                          padding: "8px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <button
                        onClick={() => addItem({ id: c.id, name: c.name, price: c.price })}
                        style={{
                          flex: 1,
                          background: "#E5E7EB",
                          color: "#6B4423",
                          border: "none",
                          padding: "8px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(c.id)}
                        style={{
                          flex: 1,
                          background: "#DC3545",
                          color: "white",
                          border: "none",
                          padding: "8px",
                          borderRadius: "8px",
                          fontSize: "16px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              style={{
                borderTop: "2px solid #F5DEB3",
                paddingTop: "16px",
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <strong style={{ fontSize: "20px", color: "#6B4423" }}>Total:</strong>
              <strong style={{ fontSize: "28px", color: "#8B4513" }}>€{total.toFixed(2)}</strong>
            </div>

            <button
              onClick={submit}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
                color: "#FFEFD5",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "18px",
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
              ✅ Validate Order
            </button>
          </div>
        </aside>
      </div>

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
