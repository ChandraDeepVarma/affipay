"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function EmployeeLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarActive, setSidebarActive] = useState(false);

  // 🔴 EXCLUDE LOGIN PAGE FROM LAYOUT
  if (pathname === "/employee/login") {
    return <>{children}</>;
  }

  return (
    <section className="overlay">
      {/* SIDEBAR */}
      <aside className={sidebarActive ? "sidebar active" : "sidebar"}>
        <div className="sidebar-logo-wrapper">
          <Link href="/employee/dashboard" className="sidebar-logo">
            <img src="/assets/images/logo2.png" className="light-logo" />
            <img src="/assets/images/logo2.png" className="dark-logo" />
            <img src="/assets/images/favicon2.png" className="logo-icon" />
          </Link>
        </div>

        <div className="sidebar-menu-area">
          <ul className="sidebar-menu">
            <li>
              <Link
                href="/employee/dashboard"
                className={
                  pathname === "/employee/dashboard" ? "active-page" : ""
                }
              >
                <Icon
                  icon="solar:home-smile-angle-outline"
                  className="menu-icon"
                />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                href="/employee/newSubscription"
                className={
                  pathname === "/employee/newSubscription" ? "active-page" : ""
                }
              >
                <Icon icon="solar:user-linear" className="menu-icon" />
                <span>New Subscription</span>
              </Link>
            </li>

            <li>
              <Link
                href="/employee/mySubscriptions"
                className={
                  pathname === "/employee/mySubscriptions" ? "active-page" : ""
                }
              >
                <Icon icon="solar:user-linear" className="menu-icon" />
                <span>My Subscriptions</span>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/employee/login" });
                }}
              >
                <Icon icon="lucide:power" className="menu-icon" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        {/* TOP BAR */}
        <div className="navbar-header">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarActive(!sidebarActive)}
            >
              <Icon icon="heroicons:bars-3-solid" width="32" height="32" />
            </button>

            <div className="d-flex align-items-center gap-3">
              <span className="fw-medium">{session?.user?.name}</span>
              <img
                src="/assets/images/user.png"
                className="w-40-px h-40-px rounded-circle"
              />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="dashboard-main-body">{children}</div>

        {/* FOOTER */}
        <footer className="d-footer">
          <p className="mb-0">© 2025 AFFIPAY. Employee Portal.</p>
        </footer>
      </main>
    </section>
  );
}
