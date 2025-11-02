// frontend/src/AdminHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { API, fetchJSON } from "./_api";
import logo from "./assets/logo.svg";

function iso(d) {
  return d.toISOString().slice(0, 10);
}

export default function AdminHome() {
  const [day, setDay] = useState(iso(new Date()));
  const [rows, setRows] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);

  async function load() {
    const url = `${API}/orders.php?scope=totals_by_waiter&from=${day}&to=${day}`;
    const d = await fetchJSON(url).catch(() => []);
    setRows(Array.isArray(d) ? d : []);

    const tablesData = await fetchJSON(`${API}/tables.php`).catch(() => []);
    setTables(Array.isArray(tablesData) ? tablesData : []);

    const ordersData = await fetchJSON(`${API}/orders.php`).catch(() => []);
    setOrders(Array.isArray(ordersData) ? ordersData : []);
  }

  useEffect(() => {
    load();
  }, [day]);

  const byDay = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => {
      const d = r.day;
      const total = Number(r.total_paid || 0);
      if (!m.has(d)) m.set(d, { rows: [], total: 0 });
      m.get(d).rows.push({
        waiter_id: r.waiter_id,
        full_name: r.full_name,
        total,
      });
      m.get(d).total += total;
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  const grandTotal = rows.reduce((s, r) => s + Number(r.total_paid || 0), 0);
  const activeTables = tables.filter(
    (t) => t.status === "occupied" || t.status === "reserved"
  ).length;
  const totalOrders = orders.length;
  const activeWaiters = new Set(rows.map((r) => r.waiter_id)).size;

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Section - Coffee Theme */}
      <div
        style={{
          background: "linear-gradient(135deg, #6B4423 0%, #3E2723 100%)",
          color: "#FFEFD5",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "24px",
          boxShadow: "0 12px 30px rgba(107, 68, 35, 0.3)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <img src={logo} alt="CoffeApp Logo" style={{ width: "100px", height: "100px" }} />
        <div>
          <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "80px", opacity: 0.1 }}>
            ☕
          </div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "42px", fontWeight: "800", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: "20px", opacity: 0.95, color: "#D4A574" }}>
            Coffee Shop Management - Overview & Daily Totals
          </p>
        </div>
      </div>

      {/* Stats Cards - Coffee Colors */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #8B4513",
            transition: "transform 0.3s ease",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "32px" }}>💰</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Daily Revenue
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>
            €{grandTotal.toFixed(2)}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Total collected
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #D2691E",
            transition: "transform 0.3s ease",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "32px" }}>📋</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Total Orders
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#D2691E" }}>
            {totalOrders}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Orders served
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #CD853F",
            transition: "transform 0.3s ease",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "32px" }}>🪑</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Active Tables
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#CD853F" }}>
            {activeTables}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Currently in service
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #A0522D",
            transition: "transform 0.3s ease",
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ fontSize: "32px" }}>👨‍🍳</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Waiters on Duty
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#A0522D" }}>
            {activeWaiters}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Active team
          </p>
        </div>
      </div>

      {/* Date Picker and Refresh */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          border: "2px solid #F5DEB3",
        }}
      >
        <div style={{ fontSize: "28px" }}>📅</div>
        <label style={{ fontWeight: "700", color: "#6B4423", fontSize: "16px" }}>Select Date:</label>
        <input
          type="date"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          style={{
            padding: "12px 20px",
            borderRadius: "12px",
            border: "2px solid #D4A574",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.3s",
            background: "#FFFFFF",
            color: "#6B4423",
            fontWeight: "600",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#8B4513";
            e.target.style.boxShadow = "0 0 0 4px rgba(139, 69, 19, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#D4A574";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={load}
          style={{
            background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
            color: "#FFEFD5",
            border: "none",
            padding: "12px 32px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(139, 69, 19, 0.3)";
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Waiter Totals */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
          border: "2px solid #F5DEB3",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ fontSize: "36px" }}>👨‍🍳</div>
          <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#6B4423" }}>
            Daily Totals per Waiter
          </h3>
        </div>

        {byDay.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>☕</div>
            <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>
              No data for {day}
            </p>
          </div>
        ) : (
          byDay.map(([d, group]) => (
            <div key={d} style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                  padding: "16px 24px",
                  background: "linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(107, 68, 35, 0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ fontSize: "28px" }}>📅</div>
                  <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#6B4423" }}>{d}</h4>
                </div>
                <div style={{ fontSize: "24px", fontWeight: "800", color: "#8B4513" }}>
                  Day Total: {group.total.toFixed(2)} €
                </div>
              </div>

              <div style={{ overflowX: "auto", background: "#FFFFFF", borderRadius: "12px", padding: "4px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr style={{ background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)", color: "#FFEFD5" }}>
                      <th
                        style={{
                          padding: "16px 20px",
                          textAlign: "left",
                          fontWeight: "700",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderTopLeftRadius: "8px",
                        }}
                      >
                        👨‍🍳 Waiter
                      </th>
                      <th
                        style={{
                          padding: "16px 20px",
                          textAlign: "right",
                          fontWeight: "700",
                          fontSize: "14px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderTopRightRadius: "8px",
                        }}
                      >
                        💰 Total to Remit (€)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows
                      .sort((a, b) => a.full_name.localeCompare(b.full_name))
                      .map((w, idx) => (
                        <tr
                          key={w.waiter_id}
                          style={{
                            borderBottom: idx < group.rows.length - 1 ? "1px solid #F5DEB3" : "none",
                            transition: "background 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#FFF8E7";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <td style={{ padding: "20px", color: "#6B4423", fontWeight: "600", fontSize: "16px" }}>
                            {w.full_name}
                          </td>
                          <td
                            style={{
                              padding: "20px",
                              textAlign: "right",
                              fontWeight: "800",
                              color: "#8B4513",
                              fontSize: "18px",
                            }}
                          >
                            {w.total.toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        <hr style={{ border: "none", borderTop: "3px solid #F5DEB3", margin: "32px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "24px",
            background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(139, 69, 19, 0.3)",
          }}
        >
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#FFEFD5", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "36px" }}>💰</span>
            <span>Grand Total: {grandTotal.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
