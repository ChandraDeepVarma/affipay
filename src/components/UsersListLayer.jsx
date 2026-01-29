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

      // const res = await fetch(`/api/customers/getuser?${params}`);
      const res = await fetch(`/api/admin/users/list`);

      const out = await res.json();

      if (res.ok) {
        // setUsers(out.users || []);
        setUsers(out.data || []);

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
  }, [
    currentPage,
    search,
    fromDate,
    toDate,
    pageSize,
    loginFilter,
    planFilter,
  ]);

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
          x._id === u._id ? { ...x, isActive: out.isActive } : x,
        ),
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

        {/* <Form.Select
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
        </Form.Select> */}
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
                  <th>Blood Group</th>
                  <th>Emergency Contact</th>
                  <th>Joining Date</th>
                  <th>Remarks</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>

                    <td>{u.name || "—"}</td>

                    <td>{u.email || "—"}</td>

                    <td>{u.phone || "—"}</td>

                    <td>{u.bloodGroup || "—"}</td>

                    <td>
                      {u.emergencyContact?.name
                        ? `${u.emergencyContact.name} (${u.emergencyContact.phone || "—"})`
                        : "—"}
                    </td>

                    <td>
                      {u.joiningDate
                        ? new Date(u.joiningDate).toLocaleDateString("en-GB")
                        : "—"}
                    </td>

                    <td
                      style={{
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={u.remarks}
                    >
                      {u.remarks || "—"}
                    </td>

                    <td>
                      <span
                        className={`badge ${u.isActive ? "bg-success" : "bg-danger"}`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleString("en-GB")
                        : "—"}
                    </td>

                    <td>
                      {u.updatedAt
                        ? new Date(u.updatedAt).toLocaleString("en-GB")
                        : "—"}
                    </td>

                    <td>
                      <div className="d-flex gap-2 justify-content-center">
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
                      </div>
                    </td>
                  </tr>
                ))}

                {!users.length && (
                  <tr>
                    <td colSpan={12} className="text-center">
                      No employees found
                    </td>
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Employee Full Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="container-fluid">
              {/* BASIC INFO */}
              <div className="row mb-3 align-items-center">
                <div className="col-md-3 text-center">
                  {/* <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                    style={{ width: 120, height: 120, fontSize: 40 }}
                  >
                    {selectedUser.name?.charAt(0) || "?"}
                  </div> */}
                  {selectedUser.profileImage?.url ? (
                    <img
                      src={selectedUser.profileImage.url}
                      alt={selectedUser.name}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                      style={{ width: 120, height: 120, fontSize: 40 }}
                    >
                      {selectedUser.name?.charAt(0) || "?"}
                    </div>
                  )}
                </div>

                <div className="col-md-9">
                  <h5>{selectedUser.name || "—"}</h5>
                  <p className="mb-1">
                    <b>Email:</b> {selectedUser.email || "—"}
                  </p>
                  <p className="mb-1">
                    <b>Phone:</b> {selectedUser.phone || "—"}
                  </p>

                  <span
                    className={`badge ${
                      selectedUser.isActive ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {selectedUser.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <hr />

              {/* PERSONAL DETAILS */}
              <h6 className="text-primary">Personal Details</h6>
              <div className="row mb-3">
                <div className="col-md-4">
                  <b>Date of Birth:</b>{" "}
                  {selectedUser.dob
                    ? new Date(selectedUser.dob).toLocaleDateString("en-GB")
                    : "—"}
                </div>

                <div className="col-md-4">
                  <b>Gender:</b>{" "}
                  {selectedUser.gender
                    ? selectedUser.gender.replace(/_/g, " ")
                    : "—"}
                </div>

                <div className="col-md-4">
                  <b>Verified:</b> {selectedUser.isVerified ? "Yes" : "No"}
                </div>
              </div>

              {/* ADDRESS DETAILS */}
              <h6 className="text-primary">Address Details</h6>
              <div className="row mb-3">
                <div className="col-md-12">
                  <b>Address:</b>{" "}
                  {[selectedUser.addressLine1, selectedUser.addressLine2]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>

                <div className="col-md-6">
                  <b>City:</b> {selectedUser.city || "—"}
                </div>

                <div className="col-md-6">
                  <b>Pin Code:</b> {selectedUser.pinCode || "—"}
                </div>
              </div>

              {/* EMPLOYEE DETAILS */}
              <h6 className="text-primary">Employee Details</h6>
              <div className="row mb-3">
                <div className="col-md-4">
                  <b>Blood Group:</b> {selectedUser.bloodGroup || "—"}
                </div>

                <div className="col-md-4">
                  <b>Joining Date:</b>{" "}
                  {selectedUser.joiningDate
                    ? new Date(selectedUser.joiningDate).toLocaleDateString(
                        "en-GB",
                      )
                    : "—"}
                </div>

                <div className="col-md-4">
                  <b>Role:</b> {selectedUser.role || "employee"}
                </div>
              </div>

              {/* EMERGENCY CONTACT */}
              <h6 className="text-primary">Emergency Contact</h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <b>Name:</b> {selectedUser.emergencyContact?.name || "—"}
                </div>
                <div className="col-md-6">
                  <b>Phone:</b> {selectedUser.emergencyContact?.phone || "—"}
                </div>
              </div>

              {/* REMARKS */}
              {selectedUser.remarks && (
                <>
                  <h6 className="text-primary">Remarks</h6>
                  <div className="row mb-3">
                    <div className="col-md-12">{selectedUser.remarks}</div>
                  </div>
                </>
              )}

              <hr />

              {/* SYSTEM INFO */}
              <h6 className="text-primary">System Info</h6>
              <div className="row mb-2">
                <div className="col-md-6">
                  <b>Created At:</b>{" "}
                  {new Date(selectedUser.createdAt).toLocaleString("en-GB")}
                </div>
                <div className="col-md-6">
                  <b>Updated At:</b>{" "}
                  {new Date(selectedUser.updatedAt).toLocaleString("en-GB")}
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
