import React, { useEffect, useMemo, useState } from "react";
import { API, fetchJSON } from "./_api";
import { useAuth } from "./App.jsx";

function iso(d) {
  return d.toISOString().slice(0, 10);
}

export default function WaiterHome() {
  const [date, setDate] = useState(iso(new Date()));
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState("");
  const { user } = useAuth();

  const t = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 1600);
  };

  async function load() {
    const d = await fetchJSON(
      `${API}/orders.php?scope=today_waiter&date=${date}`
    ).catch(() => []);
    setRows(Array.isArray(d) ? d : []);
  }

  useEffect(() => {
    load();
  }, [date]);

  const totalToRemit = useMemo(
    () =>
      rows
        .filter((r) => r.status === "paid")
        .reduce((s, r) => s + Number(r.total || 0), 0),
    [rows]
  );

  const pendingOrders = rows.filter(
    (r) => r.status === "pending" || r.status === "preparing"
  ).length;
  const completedOrders = rows.filter((r) => r.status === "paid").length;
  const totalOrders = rows.length;

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Hero Section - Coffee Theme */}
      <div
        style={{
          background: "linear-gradient(135deg, #8B4513 0%, #6B4423 100%)",
          color: "#FFEFD5",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "24px",
          boxShadow: "0 12px 30px rgba(139, 69, 19, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", bottom: "20px", right: "20px", fontSize: "100px", opacity: 0.1 }}>
          ☕
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "42px", fontWeight: "800", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
              Waiter Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: "20px", opacity: 0.95, color: "#D4A574" }}>
              Welcome, {user?.full_name || user?.username || "Waiter"}
            </p>
          </div>
          <div style={{ textAlign: "right", background: "rgba(255, 239, 213, 0.15)", padding: "20px 32px", borderRadius: "12px", border: "2px solid rgba(255, 239, 213, 0.3)" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "16px", opacity: 0.9, fontWeight: "600" }}>
              💰 To Remit Today
            </p>
            <p style={{ margin: 0, fontSize: "48px", fontWeight: "900", textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
              €{totalToRemit.toFixed(2)}
            </p>
          </div>
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
            <div style={{ fontSize: "32px" }}>📋</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Total Orders
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#8B4513" }}>
            {totalOrders}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Today
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
            <div style={{ fontSize: "32px" }}>⏳</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Pending
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#D2691E" }}>
            {pendingOrders}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            To serve
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 8px 20px rgba(107, 68, 35, 0.15)",
            borderLeft: "6px solid #228B22",
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
            <div style={{ fontSize: "32px" }}>✅</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Completed
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#228B22" }}>
            {completedOrders}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Paid
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
            <div style={{ fontSize: "32px" }}>💵</div>
            <p style={{ margin: 0, color: "#6B4423", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>
              Total to Remit
            </p>
          </div>
          <p style={{ margin: 0, fontSize: "36px", fontWeight: "800", color: "#CD853F" }}>
            €{totalToRemit.toFixed(2)}
          </p>
          <p style={{ margin: "8px 0 0 0", color: "#A0826D", fontSize: "13px" }}>
            Daily revenue
          </p>
        </div>
      </div>

      {/* Date Selector */}
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
        <label style={{ fontWeight: "700", color: "#6B4423", fontSize: "16px" }}>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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

      {/* Orders Table */}
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
          <div style={{ fontSize: "36px" }}>📊</div>
          <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#6B4423" }}>
            Daily Summary
          </h3>
        </div>

        {rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>☕</div>
            <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>
              No orders for this day
            </p>
          </div>
        ) : (
          <>
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
                      ⏰ Time
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      🪑 Table
                    </th>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontWeight: "700",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      📌 Status
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
                      💰 Amount (€)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    let statusColor = "#6B4423";
                    let statusBg = "#F5DEB3";
                    let statusEmoji = "⏳";

                    if (r.status === "paid") {
                      statusColor = "#228B22";
                      statusBg = "#D4EDDA";
                      statusEmoji = "✅";
                    } else if (r.status === "preparing") {
                      statusColor = "#D2691E";
                      statusBg = "#FFE4C4";
                      statusEmoji = "🍳";
                    } else if (r.status === "pending") {
                      statusColor = "#CD853F";
                      statusBg = "#FFEFD5";
                      statusEmoji = "⏳";
                    }

                    return (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom: idx < rows.length - 1 ? "1px solid #F5DEB3" : "none",
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
                          {(r.created_at || "").slice(11, 16)}
                        </td>
                        <td style={{ padding: "20px", color: "#6B4423", fontWeight: "600", fontSize: "16px" }}>
                          Table {r.table_number ?? r.table_id}
                        </td>
                        <td style={{ padding: "20px" }}>
                          <span
                            style={{
                              padding: "8px 16px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "700",
                              color: statusColor,
                              background: statusBg,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span>{statusEmoji}</span>
                            <span>
                              {r.status === "paid"
                                ? "Paid"
                                : r.status === "preparing"
                                ? "Preparing"
                                : r.status === "pending"
                                ? "Pending"
                                : r.status}
                            </span>
                          </span>
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
                          {Number(r.total || 0).toFixed(2)} €
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%)" }}>
                    <th
                      colSpan={3}
                      style={{
                        padding: "20px",
                        textAlign: "right",
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#6B4423",
                      }}
                    >
                      💰 Total to remit
                    </th>
                    <th
                      style={{
                        padding: "20px",
                        textAlign: "right",
                        fontSize: "28px",
                        fontWeight: "900",
                        color: "#8B4513",
                      }}
                    >
                      {totalToRemit.toFixed(2)} €
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
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
            padding: "20px 32px",
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
