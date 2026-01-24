"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { AiOutlineExclamation } from "react-icons/ai";

const timeAgo = (date) => {
  if (!date) return "Never";

  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;

  return new Date(date).toLocaleString("en-GB");
};


const UsersListLayer = () => {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loginFilter, setLoginFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [plans, setPlans] = useState([]);



  // =============================
  // Fetch users (server pagination)
  // =============================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        search,
        fromDate,
        toDate,
        loginFilter,
        planFilter,
      });

      const res = await fetch(`/api/customers/getuser?${params}`);
      const out = await res.json();

      if (res.ok) {
        setUsers(out.users || []);
        setPlans(out.distinctPlanNames || []);
        setTotalPages(out.pagination?.totalPages || 1);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search, fromDate, toDate, pageSize, loginFilter, planFilter]);

  // =============================
  // Utils
  // =============================
  const formatDOB = (dob) => {
    if (!dob) return "N/A";
    try {
      return new Date(dob).toISOString().split("T")[0];
    } catch {
      return dob;
    }
  };

  // =============================
  // CSV Export (server)
  // =============================
  const exportCSV = () => {
    const params = new URLSearchParams({
      search,
      fromDate,
      toDate,
    });

    window.open(`/api/customers/export-csv?${params}`, "_blank");
  };

  // =============================
  // Delete user
  // =============================
  const handleDelete = async (u) => {
    const result = await Swal.fire({
      title: "Confirm Delete",
      input: "text",
      inputPlaceholder: "type delete",
      showCancelButton: true,
      preConfirm: (val) => {
        if (val !== "delete")
          Swal.showValidationMessage("Type delete to confirm");
      },
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/customers/deleteuser/${u._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      Swal.fire("Deleted!", "User removed successfully", "success");
      fetchUsers();
    } else {
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  // =============================
  // Toggle status
  // =============================
  const toggleStatus = async (u) => {
    const res = await fetch(`/api/customers/toggle-status/${u._id}`, {
      method: "PATCH",
    });

    const out = await res.json();

    if (res.ok) {
      setUsers((prev) =>
        prev.map((x) =>
          x._id === u._id ? { ...x, isActive: out.isActive } : x
        )
      );
      Swal.fire("Success", out.message, "success");
    }
  };

  // =============================
  // Pagination helpers
  // =============================
  const changePage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="card radius-12">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center gap-2">
        <div className="d-flex gap-2 align-items-center">
          <input
            type="text"
            placeholder="Search name / email / phone"
            className="form-control"
            style={{ width: "240px" }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Form.Select
            size="sm"
            style={{ width: "120px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </Form.Select>
        </div>

        <div>
          <Button
            size="sm"
            className="btn-primary me-2"
            onClick={() => router.push("/all-users/adduser")}
          >
            Add User
          </Button>
          <Button size="sm" variant="outline-primary" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 d-flex gap-3 align-items-center">
        <Form.Control
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Form.Control
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Form.Select
          style={{ width: "220px" }}
          value={loginFilter}
          onChange={(e) => {
            setLoginFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Users</option>
          <option value="last1h">Logged in last 1 hour</option>
          <option value="last24h">Logged in last 24 hours</option>
          <option value="last7d">Logged in last 7 days</option>
          <option value="last30d">Logged in last 1 month</option>
          <option value="never">Never logged in</option>
        </Form.Select>

        <Form.Select
          style={{ width: "220px" }}
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Members</option>
          <option value="purchased">Plan Purchased Members</option>
          <option value="not_purchased">Non Purchased Members</option>
          {plans.length > 0 && (
            <optgroup label="──────── Plans ────────">
              {plans.map((plan) => (
                <option key={plan} value={`plan:${plan}`}>
                  {plan}
                </option>
              ))}
            </optgroup>
          )}
        </Form.Select>

      </div>

      {/* Table */}
      <div className="card-body">
        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>DOB</th>
                  <th>Wallet</th>
                  <th>Plan</th>
                  <th>Purchased Date</th>
                  <th>Status</th>
                  <th>Modified At</th>
                  <th>Last Login</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>
                      {(currentPage - 1) * pageSize + i + 1}
                    </td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      {u.phone}{" "}
                      {u.phoneVerified ? (
                        <RiVerifiedBadgeFill className="text-success" />
                      ) : (
                        <AiOutlineExclamation className="text-danger" />
                      )}
                    </td>
                    <td>{formatDOB(u.dob)}</td>
                    <td>{u.walletAmount?.toFixed(2) || "0.00"}</td>
                    <td>{u.planName || "N/A"}</td>

                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`badge ${u.isActive ? "bg-success" : "bg-danger"
                          }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleStatus(u)}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {u.updatedAt
                        ? new Date(u.updatedAt).toLocaleString("en-GB")
                        : "N/A"}
                    </td>

                    <td>
                      {u.lastLoginAt ? (
                        <div style={{ fontSize: "12px", textAlign: "left" }}>
                          <div><b>{timeAgo(u.lastLoginAt)}</b></div>
                          <div>{new Date(u.lastLoginAt).toLocaleString("en-GB")}</div>
                          <div>{u.lastLoginInfo?.city || "N/A"}</div>
                        </div>
                      ) : (
                        "Never"
                      )}
                    </td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleOpenModal(u)}
                        >
                          <Icon icon="lucide:eye" />
                        </button>

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            router.push(`/all-users/edituser/${u._id}`)
                          }
                        >
                          <Icon icon="lucide:edit" />
                        </button>

                        {/* <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(u)}
                        >
                          <Icon icon="fluent:delete-24-regular" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}

                {!users.length && (
                  <tr>
                    <td colSpan={10}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3 align-items-center">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div className="d-flex gap-1">
            <Button
              size="sm"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Prev
            </Button>

            {getPageNumbers().map((num) => (
              <Button
                key={num}
                size="sm"
                variant={num === currentPage ? "primary" : "outline-primary"}
                onClick={() => changePage(num)}
              >
                {num}
              </Button>
            ))}

            <Button
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Customer Full Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="container-fluid">
              {/* PROFILE SECTION */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-3 text-center">
                  {selectedUser.profileImage?.url ? (
                    <img
                      src={selectedUser.profileImage.url}
                      className="img-thumbnail rounded-circle"
                      style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                      style={{ width: 120, height: 120, fontSize: 40 }}
                    >
                      {selectedUser.fullName?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="col-md-9">
                  <h5>{selectedUser.fullName}</h5>
                  <p className="mb-1"><b>Email:</b> {selectedUser.email}</p>
                  <p className="mb-1">
                    <b>Phone:</b> {selectedUser.phone}{" "}
                    {selectedUser.phoneVerified ? (
                      <RiVerifiedBadgeFill className="text-success" />
                    ) : (
                      <AiOutlineExclamation className="text-danger" />
                    )}
                  </p>
                  <span className={`badge ${selectedUser.isActive ? "bg-success" : "bg-danger"}`}>
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <hr />

              {/* PERSONAL DETAILS */}
              <h6 className="text-primary">Personal Details</h6>
              <div className="row mb-3">
                <div className="col-md-4"><b>Gender:</b> {selectedUser.gender || "N/A"}</div>
                <div className="col-md-4"><b>DOB:</b> {formatDOB(selectedUser.dob)}</div>
                <div className="col-md-4"><b>T-Shirt Size:</b> {selectedUser.tshirtSize || "N/A"}</div>
              </div>

              {/* ADDRESS DETAILS */}
              <h6 className="text-primary">Address Details</h6>
              <div className="row mb-3">
                <div className="col-md-12">
                  <b>Address:</b>{" "}
                  {`${selectedUser.addressLine1 || ""} ${selectedUser.addressLine2 || ""}`.trim() || "N/A"}
                </div>
                <div className="col-md-4"><b>City:</b> {selectedUser.city || "N/A"}</div>
                <div className="col-md-4"><b>Pin Code:</b> {selectedUser.pinCode || "N/A"}</div>
              </div>

              {/* BANK DETAILS */}
              <h6 className="text-primary">Bank / UPI Details</h6>
              <div className="row mb-3">
                <div className="col-md-4"><b>UPI ID:</b> {selectedUser.upiId || "N/A"}</div>
                <div className="col-md-4"><b>Account No:</b> {selectedUser.bankAccount || "N/A"}</div>
                <div className="col-md-4"><b>IFSC:</b> {selectedUser.ifscCode || "N/A"}</div>
                <div className="col-md-4"><b>Account Holder:</b> {selectedUser.accountHolderName || "N/A"}</div>
              </div>

              {/* SUBSCRIPTION DETAILS */}
              <h6 className="text-primary">Subscription Details</h6>
              <div className="row mb-3">
                <div className="col-md-4"><b>Plan:</b> {selectedUser.planName || "N/A"}</div>
                <div className="col-md-4">
                  <b>Purchased Date:</b>{" "}
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString("en-GB")
                    : "N/A"}
                </div>
                <div className="col-md-4"><b>Price:</b> ₹{selectedUser.planPrice || 0}</div>
                <div className="col-md-4"><b>Status:</b> {selectedUser.subscriptionStatus || "N/A"}</div>
                <div className="col-md-4"><b>Earning Type:</b> {selectedUser.earningType || "N/A"}</div>
              </div>

              {/* WALLET & REFERRAL */}
              <h6 className="text-primary">Wallet & Referral</h6>
              <div className="row mb-3">
                <div className="col-md-4"><b>Wallet:</b> ₹{selectedUser.walletAmount || 0}</div>
                <div className="col-md-4"><b>On Hold:</b> ₹{selectedUser.onHoldWalletAmount || 0}</div>
                <div className="col-md-4"><b>Total Withdrawn:</b> ₹{selectedUser.totalWithdrawnAmount || 0}</div>
                <div className="col-md-4"><b>Referral Code:</b> {selectedUser.referralCode || "N/A"}</div>
                <div className="col-md-4"><b>Referral Locked:</b> {selectedUser.referralLocked ? "Yes" : "No"}</div>
                <div className="col-md-4"><b>Current Level:</b> {selectedUser.currentLevel || 0}</div>
              </div>

              {/* SYSTEM INFO */}
              <h6 className="text-primary">System Info</h6>

              <div className="row mb-3">
                <div className="col-md-12">
                  <h6 className="text-secondary">Last Login Details</h6>

                  {selectedUser.lastLoginAt ? (
                    <div className="border rounded p-2 bg-light">
                      <p className="mb-1">
                        <b>Time:</b>{" "}
                        {new Date(selectedUser.lastLoginAt).toLocaleString("en-GB")}
                      </p>

                      <p className="mb-1">
                        <b>City:</b>{" "}
                        {selectedUser.lastLoginInfo?.city || "N/A"}
                      </p>

                      <p className="mb-1">
                        <b>IP Address:</b>{" "}
                        {selectedUser.lastLoginInfo?.ip || "N/A"}
                      </p>

                      <p className="mb-1">
                        <b>Device:</b>{" "}
                        {selectedUser.lastLoginInfo?.device || "N/A"}
                      </p>
                    </div>
                  ) : (
                    <p>No login history available</p>
                  )}
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-6">
                  <b>Created At:</b>{" "}
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString("en-GB")
                    : "N/A"}
                </div>
                <div className="col-md-6">
                  <b>Updated At:</b>{" "}
                  {selectedUser.updatedAt
                    ? new Date(selectedUser.updatedAt).toLocaleString("en-GB")
                    : "N/A"}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>

      </Modal>
    </div>
  );
};

export default UsersListLayer;
