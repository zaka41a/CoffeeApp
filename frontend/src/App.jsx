import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import TopBar from "./TopBarNew.jsx";
import Login from "./LoginNew.jsx";
import { API as API_BASE } from "./_api";

// Admin
import AdminHome from "./AdminHome.jsx";
import AdminTables from "./AdminTables.jsx";
import AdminMenu from "./AdminMenu.jsx";
import AdminWaiters from "./AdminWaiters.jsx";

// Waiter
import WaiterHome from "./WaiterHome.jsx";
import WaiterMenu from "./WaiterMenu.jsx";
import WaiterTables from "./WaiterTables.jsx";

// Shared (utilisé par waiter uniquement dans la nav)
import OrdersPage from "./OrdersPage.jsx";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function ProtectedRoute({ children, allow = ["admin", "waiter"] }) {
  const { user, loading } = useAuth();
  if (loading) return null;

  const role =
    user?.role || (Number(user?.role_id) === 1 ? "admin" : "waiter");

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/login" replace />;

  return children;
}

function AppShell({ children }) {
  const { user, logout } = useAuth();
  return (
    <>
      <TopBar me={user} onLogout={logout} />
      <div className="container">{children}</div>
    </>
  );
}

function AppInner() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/auth/me.php`, {
          credentials: "include",
        });
        const data = await r.json().catch(() => ({}));
        // me.php renvoie { auth: true, user: {...} }
        if (data && data.user) setUser(data.user);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (u) => setUser(u);
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout.php`, { credentials: "include" });
    } catch {}
    setUser(null);
  };

  const ctx = { user, loading, login, logout };

  return (
    <AuthCtx.Provider value={ctx}>
      <Routes>
        {/* Redirection racine selon le rôle */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={
                  (user.role ||
                    (Number(user.role_id) === 1 ? "admin" : "waiter")) ===
                  "admin"
                    ? "/admin"
                    : "/waiter"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login onLoggedIn={login} />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AppShell>
                <AdminHome />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tables"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AppShell>
                <AdminTables />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AppShell>
                <AdminMenu />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/waiters"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AppShell>
                <AdminWaiters />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* WAITER */}
        <Route
          path="/waiter"
          element={
            <ProtectedRoute allow={["waiter"]}>
              <AppShell>
                <WaiterHome />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/menu"
          element={
            <ProtectedRoute allow={["waiter"]}>
              <AppShell>
                <WaiterMenu />
              </AppShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/tables"
          element={
            <ProtectedRoute allow={["waiter"]}>
              <AppShell>
                <WaiterTables />
              </AppShell>
            </ProtectedRoute>
          }
        />

        {/* ORDERS : accessible au waiter uniquement */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allow={["waiter"]}>
              <AppShell>
                <OrdersPage />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthCtx.Provider>
  );
}

export default function App() {
  return <AppInner />;
}
