import React, { useEffect, useState } from "react";
import logo from "./assets/logo.svg";
import { API } from "./_api";

export default function WaiterTables() {
  const [tables, setTables] = useState([]);
  const [openMap, setOpenMap] = useState({});
  const [toast, setToast] = useState("");

  const t = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1700);
  };

  async function load() {
    try {
      // 1) Get all tables
      const r1 = await fetch(`${API}/tables.php`, { credentials: "include" });
      const list = await r1.json().catch(() => []);
      setTables(Array.isArray(list) ? list : []);

      // 2) Get open orders
      const r2 = await fetch(`${API}/orders.php?scope=open_tables`, { credentials: "include" });
      const rows = await r2.json().catch(() => []);

      // 3) Aggregate by table -> sum totals + list of IDs
      const map = {};
      (Array.isArray(rows) ? rows : []).forEach((r) => {
        const tid = r.table_id;
        if (!tid) return;
        if (!map[tid]) map[tid] = { order_ids: [], total: 0 };
        map[tid].order_ids.push(r.order_id);
        map[tid].total += Number(r.total || 0);
      });
      setOpenMap(map);
    } catch {
      setTables([]);
      setOpenMap({});
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Change status (free/occupied)
  async function toggleStatus(id, next) {
    const r = await fetch(`${API}/tables.php`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    const d = await r.json().catch(() => ({}));
    if (d.ok) {
      t("Status updated ✅");
      load();
    } else {
      t(d.error || "Error");
    }
  }

  // Close all open orders for a table
  async function markFree(orderIds) {
    const ids = Array.isArray(orderIds) ? orderIds : orderIds ? [orderIds] : [];
    if (ids.length === 0) return;

    try {
      const results = await Promise.all(
        ids.map((id) =>
          fetch(`${API}/orders.php?id=${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "paid" }),
          }).then((r) => r.json().catch(() => ({})))
        )
      );

      const ok = results.every((r) => r && r.ok);
      if (ok) {
        t("Table marked free ✅");
      } else {
        t("Some bills failed to close ⚠️");
      }
      load();
    } catch {
      t("Error");
    }
  }

  const freeCount = tables.filter((t) => t.status === "free").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
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
            Tables Overview
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Manage table status and bills
          </p>
        </div>
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
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>{tables.length}</p>
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
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#228B22" }}>{freeCount}</p>
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
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#D2691E" }}>{occupiedCount}</p>
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
        {tables.map((tb) => {
          const open = openMap[tb.id] || null;
          const next = tb.status === "free" ? "occupied" : "free";
          return (
            <div
              key={tb.id}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#6B4423" }}>
                  🪑 Table {tb.number ?? tb.id}
                </h3>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: tb.status === "free" ? "#228B22" : "#D2691E",
                    background: tb.status === "free" ? "#D4EDDA" : "#FFE4C4",
                  }}
                >
                  {tb.status === "free" ? "✅ Available" : "🔴 Occupied"}
                </span>
              </div>

              <p style={{ margin: "0 0 16px 0", color: "#A0826D", fontSize: "14px", fontWeight: "600" }}>
                👥 {tb.seats} seats
              </p>

              {open ? (
                <>
                  <div
                    style={{
                      background: "#FFF8E7",
                      padding: "16px",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      border: "2px solid #F5DEB3",
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#8B4513", fontWeight: "700", marginBottom: "8px" }}>
                      💰 Open Bill
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "900", color: "#6B4423" }}>
                      €{open.total.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#A0826D", marginTop: "4px" }}>
                      ({open.order_ids.length} order{open.order_ids.length > 1 ? "s" : ""} open)
                    </div>
                  </div>
                  <button
                    onClick={() => markFree(open.order_ids)}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #228B22 0%, #1a6b1a 100%)",
                      color: "white",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: "pointer",
                      marginBottom: "8px",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => (e.target.style.opacity = "0.9")}
                    onMouseOut={(e) => (e.target.style.opacity = "1")}
                  >
                    ✅ Close & Mark Free
                  </button>
                </>
              ) : (
                <div
                  style={{
                    background: "#F5F5F5",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                    color: "#A0826D",
                    fontSize: "14px",
                  }}
                >
                  No open bill
                </div>
              )}

              <button
                onClick={() => toggleStatus(tb.id, next)}
                style={{
                  width: "100%",
                  background: "#E5E7EB",
                  color: "#6B4423",
                  border: "2px solid #D4A574",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#D4A574";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#E5E7EB";
                  e.target.style.color = "#6B4423";
                }}
              >
                {next === "free" ? "✅ Set Available" : "🔴 Set Occupied"}
              </button>
            </div>
          );
        })}
      </div>

      {tables.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>🪑</div>
          <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>No tables available</p>
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
