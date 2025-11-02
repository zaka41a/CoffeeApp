import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Home,
  Table2,
  Menu as MenuIcon,
  Users,
  ShoppingBag,
  LogOut,
  User,
  X,
  ChevronDown
} from "lucide-react";

export default function TopBar({ me, onLogout }) {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isWaiter = pathname.startsWith("/waiter") || (!isAdmin && me?.role === "waiter");

  const adminLinks = [
    { to: "/admin", label: "Home", icon: Home, end: true },
    { to: "/admin/tables", label: "Tables", icon: Table2 },
    { to: "/admin/menu", label: "Menu", icon: MenuIcon },
    { to: "/admin/waiters", label: "Waiters", icon: Users },
  ];

  const waiterLinks = [
    { to: "/waiter", label: "Home", icon: Home, end: true },
    { to: "/waiter/tables", label: "Tables", icon: Table2 },
    { to: "/waiter/menu", label: "Menu", icon: MenuIcon },
    { to: "/orders", label: "Orders", icon: ShoppingBag },
  ];

  const links = isAdmin ? adminLinks : waiterLinks;
  const userName = me?.full_name || me?.name || "User";
  const userRole = isAdmin ? "Admin" : "Waiter";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-coffee-700 to-espresso-800 shadow-coffee"
              >
                <Coffee className="w-6 h-6 text-cream-50" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold text-gradient">
                  CoffeeApp
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">
                  {userRole} Dashboard
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-coffee-700 to-espresso-700 text-white shadow-coffee"
                        : "text-gray-700 hover:bg-cream-100 hover:text-coffee-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon className={`w-4 h-4 ${isActive ? "text-cream-100" : "text-gray-500 group-hover:text-coffee-700"}`} />
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-coffee-700 to-espresso-700 rounded-xl -z-10"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* User Info - Desktop */}
              <div className="hidden lg:block text-right mr-2">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>

              {/* User Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200 hover:border-coffee-300 transition-all bg-white hover:shadow-md"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cream-300 to-cream-400 text-coffee-800 font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-espresso border border-gray-200 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-cream-50 to-white">
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">{me?.email || "No email"}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-coffee-100 text-coffee-800 text-xs font-bold rounded-full">
                          {userRole}
                        </span>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 bg-cream-50 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-coffee-700 to-espresso-700 text-white shadow-coffee"
                          : "text-gray-700 hover:bg-white hover:shadow-sm"
                      }`
                    }
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Click Outside to Close */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  );
}
