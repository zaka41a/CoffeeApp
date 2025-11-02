import React, { useEffect, useState } from "react";
import logo from "./assets/logo.svg";
import { API, IMG } from "./_api";

export default function WaiterMenu() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetch(`${API}/menu.php`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []));

    fetch(`${API}/categories.php`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCats(Array.isArray(data) ? data : []));
  }, []);

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
            Menu (View Only)
          </h1>
          <p style={{ margin: 0, fontSize: "18px", opacity: 0.9, color: "#D4A574" }}>
            Browse our coffee shop menu
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
            Menu Items
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
                  display: "block",
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
                <p style={{ margin: 0, color: "#A0826D", fontSize: "14px", lineHeight: "1.5" }}>
                  {m.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}>☕</div>
          <p style={{ color: "#A0826D", fontSize: "18px", fontWeight: "500" }}>No menu items available</p>
        </div>
      )}
    </div>
  );
}
