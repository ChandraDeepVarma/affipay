"use client";
import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";

const USERS_PER_PAGE = 10;

export default function SubscriptionActivationRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/requests/manual-subscription-requests", { cache: "no-store" });
      const json = await res.json();
      setRequests(json.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filtering logic
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const textMatch =
        r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user.phone.includes(searchTerm) ||
        r.utrNumber.includes(searchTerm);

      const statusMatch = statusFilter === "all" || r.status === statusFilter;

      const created = new Date(r.createdAt);
      const fromMatch = fromDate ? created >= new Date(fromDate) : true;
      const toMatch = toDate ? created <= new Date(toDate + "T23:59:59") : true;

      return textMatch && statusMatch && fromMatch && toMatch;
    });
  }, [requests, searchTerm, statusFilter, fromDate, toDate]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / USERS_PER_PAGE);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Approve
  const approveRequest = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve subscription?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    await updateStatus(id, "approved");
  };

  // Reject with remarks
  const rejectRequest = async (id) => {
    const result = await Swal.fire({
      title: "Reject Request",
      input: "textarea",
      inputLabel: "Remarks",
      inputPlaceholder: "Enter rejection reason...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) return "Remarks required!";
      },
    });

    if (!result.isConfirmed) return;

    await updateStatus(id, "rejected", result.value);
  };

  const updateStatus = async (id, status, remarks) => {
    try {
      const res = await fetch("/api/requests/manual-subscription-update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id,
          status,
          remarks,
        }),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.message);

      Swal.fire("Success", `Request ${status}`, "success");
      fetchRequests();
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to update", "error");
    }
  };

  return (
    <div className="container py-4">
      <h3>Manual Subscription Requests</h3>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Search name / phone / UTR"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-2">
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div className="col-md-2">
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Phone</th>
            <th>Plan</th>
            <th>Price</th>
            <th>UTR</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((r) => (
            <tr key={r.id}>
              <td>{r.user.name}</td>
              <td>{r.user.phone}</td>
              <td>{r.plan.name}</td>
              <td>₹{r.plan.price}</td>
              <td>{r.utrNumber}</td>
              <td>
                <span className={`badge bg-${r.status === "pending" ? "warning" : r.status === "approved" ? "success" : "danger"}`}>
                  {r.status}
                </span>
              </td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td>
                {r.status === "pending" && (
                  <>
                    <button className="btn btn-sm btn-success me-1" onClick={() => approveRequest(r.id)}>
                      Approve
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => rejectRequest(r.id)}>
                      Reject
                    </button>
                  </>
                )}
                {r.status !== "pending" && "-"}
              </td>
            </tr>
          ))}

          {!loading && paginatedData.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>

        <div>
          <button
            className="btn btn-sm btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
