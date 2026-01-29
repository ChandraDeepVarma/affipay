// src/masterLayout/MasterLayout.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import Link from "next/link";
import { TbUsersPlus } from "react-icons/tb";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LiaUserCogSolid } from "react-icons/lia";
import { TfiPowerOff } from "react-icons/tfi";
import { TbServerCog } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { MdApproval, MdOutlineViewCarousel } from "react-icons/md";
import { TbGitPullRequest } from "react-icons/tb";
import { MdOutlineSubscriptions } from "react-icons/md";
import { GrDocumentConfig } from "react-icons/gr";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { AiTwotoneSound } from "react-icons/ai";

const MasterLayout = ({ children }) => {
  const { data: session } = useSession();
  let pathname = usePathname();
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = usePathname(); // Hook to get the current route
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Restore sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebarActive");
    if (savedSidebarState !== null) {
      seSidebarActive(savedSidebarState === "true");
    }

    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
        }
      }
    };

    // Attach click event listeners to all dropdown triggers
    const dropdownTriggers = document.querySelectorAll(
      ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link",
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", handleDropdownClick);
    });

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location ||
            link.getAttribute("to") === location
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    openActiveDropdown();

    // Cleanup event listeners on unmount
    return () => {
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/customers/claimed-gifts");
        const data = await res.json();
        console.log("claimed Gift notification Data: ", data);
        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
    // Save sidebar state to localStorage
    localStorage.setItem("sidebarActive", !sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        {/* <div>
          <Link href="/home" className="sidebar-logo">
            <img
              src="/assets/images/logo2.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="/assets/images/logo2.png"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="/assets/images/favicon2.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div> */}

        <div className="sidebar-logo-wrapper">
          <Link href="/home" className="sidebar-logo">
            <img
              src="/assets/images/logo2.png"
              alt="site logo"
              className="light-logo"
            />
            <img
              src="/assets/images/logo2.png"
              alt="site logo"
              className="dark-logo"
            />
            <img
              src="/assets/images/favicon2.png"
              alt="site logo"
              className="logo-icon"
            />
          </Link>
        </div>

        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            <li className="mb-2">
              <Link
                href="/home"
                className={pathname === "/home" ? "active-page" : ""}
              >
                <Icon
                  icon="solar:home-smile-angle-outline"
                  className="menu-icon"
                />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="dropdown">
              <Link href="#">
                <TbUsersPlus className="menu-icon" />
                <span>Employees</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/all-users"
                    className={pathname === "/all-users" ? "active-page" : ""}
                  >
                    <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />{" "}
                    All Employees
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deleted-users"
                    className={
                      pathname === "/deleted-users" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />{" "}
                    Deleted Employees
                  </Link>
                </li>
                {/* Credit/Debit Amount Section */}
                <li>
                  <Link
                    href="/credit-debit-amount"
                    className={
                      pathname === "/credit-debit-amount" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-success-main w-auto" />{" "}
                    Credit/Debit Amount
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact-messages"
                    className={
                      pathname === "/contact-messages" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-info-main w-auto" />{" "}
                    Contact Messages
                  </Link>
                </li>
              </ul>
            </li>

            {/* Master Data for Captcha2Captcha */}
            <li className="dropdown">
              <Link href="#">
                <LiaUserCogSolid className="menu-icon" />
                <span>Master Data</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  <Link
                    href="/home-sliders"
                    className={
                      pathname === "/home-sliders" ? "active-page" : ""
                    }
                  >
                    <MdOutlineViewCarousel />
                    <span>Home Sliders</span>
                  </Link>
                </li>

                {/* Ad Management */}
                <li>
                  <Link
                    href="/ad-management"
                    className={
                      pathname === "/ad-management" ? "active-page" : ""
                    }
                  >
                    <AiTwotoneSound />
                    <span>Ad Management</span>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Invoice Dropdown */}
            <li className="dropdown">
              <Link href="#">
                <HiOutlineClipboardDocumentList className="menu-icon" />
                <span>Reports</span>
              </Link>
              <ul className="sidebar-submenu">
                {/* all user Transactions - section */}
                <li>
                  <Link
                    href="/all-transactions"
                    className={
                      pathname === "/all-transactions" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-danger-main w-auto" />{" "}
                    All Transactions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscriptions-report"
                    className={
                      pathname === "/subscriptions-report" ? "active-page" : ""
                    }
                  >
                    <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                    Subscriptions
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="/site-config"
                className={pathname === "/site-config" ? "active-page" : ""}
              >
                <GrDocumentConfig className="menu-icon" />
                <span>Site Config</span>
              </Link>
            </li>
            <li className="dropdown">
              <Link href="#">
                <MdOutlinePrivacyTip className="menu-icon" />
                <span>Website CMS</span>
              </Link>
              <ul className="sidebar-submenu">
                <li>
                  {/* <Link
                    href='/site-config'
                    className={pathname === "/site-config" ? "active-page" : ""}
                  >
                    <i className='ri-circle-fill circle-icon text-primary-600 w-auto' />{" "}
                    Site Config
                  </Link> */}
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className={pathname === "/about-us" ? "active-page" : ""}
                  >
                    {/* <i className='ri-circle-fill circle-icon text-warning-main w-auto' />{" "} */}
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms-conditions"
                    className={
                      pathname === "/terms-conditions" ? "active-page" : ""
                    }
                  >
                    {/* <i className="ri-circle-fill circle-icon text-primary w-auto" />{" "} */}
                    Terms-Conditions
                  </Link>
                </li>

                <li>
                  <Link
                    href="/social-media"
                    className={
                      pathname === "/social-media" ? "active-page" : ""
                    }
                  >
                    {/* <i className='ri-circle-fill circle-icon text-success-main w-auto' />{" "} */}
                    Social Media Links
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy-content"
                    className={
                      pathname === "/policy-content" ? "active-page" : ""
                    }
                  >
                    {/* <i className='ri-circle-fill circle-icon text-danger-main w-auto' />{" "} */}
                    All Policy-Content
                  </Link>
                </li>

                <li>
                  <Link
                    href="/manage-faqs"
                    className={pathname === "/manage-faqs" ? "active-page" : ""}
                  >
                    Manage FAQs
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                href="/subscription-plans"
                className={
                  pathname === "/subscription-plans" ? "active-page" : ""
                }
              >
                <MdOutlineSubscriptions className="menu-icon" />
                <span>Subscription Plans</span>
              </Link>
            </li>

            <li>
              <Link
                href="/withdrawal-requests"
                className={
                  pathname === "/withdrawal-requests" ? "active-page" : ""
                }
              >
                <TbGitPullRequest className="menu-icon" />
                <span>Withdraw Requests</span>
              </Link>
            </li>

            <li>
              <Link
                href="/subscription-requests"
                className={
                  pathname === "/subscription-requests" ? "active-page" : ""
                }
              >
                <MdApproval className="menu-icon" />
                <span>Subscription Requests</span>
              </Link>
            </li>

            <li>
              <Link
                href="/login-logs"
                className={pathname === "/login-logs" ? "active-page" : ""}
              >
                <TbServerCog className="menu-icon" />
                <span>Login Logs</span>
              </Link>
            </li>

            <li>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({ callbackUrl: "/login" });
                }}
                className={pathname === "#" ? "active-page" : ""}
              >
                <TfiPowerOff className="menu-icon" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                <ThemeToggleButton />

                <div className="dropdown">
                  <button
                    className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <Icon
                      icon="iconoir:bell"
                      className="text-primary-light text-xl"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                    <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                          Notifications
                        </h6>
                      </div>
                      <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                        {notifications.filter((n) => n.status === "pending")
                          .length || 0}
                      </span>
                    </div>
                    <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                      {notifications.length === 0 ? (
                        <p className="text-center text-secondary-light p-3">
                          No new notifications
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((note, idx) => (
                          <Link
                            key={note.giftId || idx}
                            href="/notifications"
                            className={`px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between ${
                              note.status === "pending" ? "bg-neutral-50" : ""
                            }`}
                          >
                            <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                              <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                                <Icon
                                  icon="mdi:gift-outline"
                                  className="icon text-xxl"
                                />
                              </span>
                              <div>
                                <h6 className="text-md fw-semibold mb-4">
                                  New Claim: {note.giftName}
                                </h6>
                                {/* mobile number */}
                                <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                                  {note.customerName} claimed {note.giftName} (
                                  {note.planName})
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-secondary-light flex-shrink-0">
                              {new Date(note.claimedAt).toLocaleDateString()}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                    <div className="text-center py-12 px-16">
                      <Link
                        href="/notifications"
                        className="text-primary-600 fw-semibold text-md"
                      >
                        See All Notification
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Notification dropdown end */}
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src={session?.user?.image || "/assets/images/user.png"}
                      alt="image_user"
                      className="w-40-px h-40-px object-fit-cover rounded-circle"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          {session?.user?.name || "Admin"}
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          {session?.user?.isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          href="/view-profile"
                        >
                          <Icon
                            icon="solar:user-linear"
                            className="icon text-xl"
                          />{" "}
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                          href="/site-config"
                        >
                          <Icon
                            icon="icon-park-outline:setting-two"
                            className="icon text-xl"
                          />
                          Site Config
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            signOut({ callbackUrl: "/login" });
                          }}
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />
                          LogOut
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">
                <small>
                  © 2025 Cash2Captcha. All Rights Reserved. Developed by{" "}
                  <span className="text-primary-600">Colourmoon</span>
                </small>
              </p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                <small>Build Version (v.120)</small>
              </p>
            </div>
          </div>
        </footer>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </section>
  );
};

export default MasterLayout;
