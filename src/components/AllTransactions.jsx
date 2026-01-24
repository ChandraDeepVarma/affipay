"use client";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("All");
  const [scenarios, setScenarios] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [deliveryRemarks, setDeliveryRemarks] = useState({});


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  const fetchTransactions = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page,
        limit: usersPerPage,
        search: searchText,
        scenario: scenarioFilter,
        status: statusFilter,
        deliveryStatus: deliveryStatusFilter,
        fromDate,
        toDate,
      });

      const res = await fetch(`/api/reports/alltransactions?${params}`);
      const result = await res.json();

      setTransactions(result.data || []);
      setFiltered(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);

      if (result.scenarios) {
        setScenarios(result.scenarios);
      }
      if (result.statuses) {
        setStatuses(result.statuses);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchTransactions(1);
  }, [searchText, scenarioFilter, fromDate, toDate, statusFilter, deliveryStatusFilter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const exportCSV = () => {
    const params = new URLSearchParams({
      search: searchText,
      scenario: scenarioFilter,
      status: statusFilter,
      deliveryStatus: deliveryStatusFilter,
      fromDate,
      toDate,
    });

    window.open(`/api/reports/alltransactions-csv?${params}`, "_blank");
  };

  // Pagination numbers (sliding window)
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);


  const recheckStatus = async (transactionId) => {
    try {
      const res = await fetch("/api/reports/recheck-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Status updated to: " + data.status);
        fetchTransactions(currentPage); // refresh table
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to recheck payment");
    }
  };

  const updateDeliveryStatus = async (transactionId, nextStatus) => {
    const remarks = deliveryRemarks[transactionId];

    if (!remarks || !remarks.trim()) {
      alert("Please enter delivery remarks");
      return;
    }

    try {
      const res = await fetch("/api/reports/update-delivery-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          status: nextStatus,
          remarks,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Marked as ${nextStatus}`);
        fetchTransactions(currentPage);
      } else {
        alert(data.message || "Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };




  return (
    <>
      {/* Filters */}
      <div className="mb-3 d-flex gap-2 pb-2">
        <Form.Control
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          placeholder="From Date"
          style={{ width: "180px" }}
        />
        <Form.Control
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          placeholder="To Date"
          style={{ width: "180px" }}
        />
        <Form.Select
          value={scenarioFilter}
          onChange={(e) => setScenarioFilter(e.target.value)}
          style={{ width: "220px" }}
        >
          <option value="All">All Scenarios</option>

          {scenarios.map((sc) => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="All">All Txn Status</option>

          {statuses.map((sc) => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={deliveryStatusFilter}
          onChange={(e) => setDeliveryStatusFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="All">All Delivery Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Search by Mobile / Username / RefId"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />

        <Button
          type="button"
          variant="primary"
          className="px-3 rounded"
          onClick={exportCSV}
        >
          Export CSV
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-left py-3">
        <p className="fw-bold mb-3">
          Total Pages: {totalPages} | Current Page: {currentPage}
        </p>
      </div>

      {/* Table */}
      <div className="card-body p-30 pt-4">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Ref Id</th>
                <th className="text-center">Customer</th>
                <th className="text-center">Amount (₹)</th>
                <th className="text-center">Type</th>
                <th className="text-center">Scenario</th>
                <th className="text-center">Remarks</th>
                <th className="text-center">Created At</th>
                <th className="text-center">Txn Status</th>
                <th className="text-center">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="12">No records found</td>
                </tr>
              )}
              {filtered.map((transaction, index) => (
                <tr key={transaction._id || index}>
                  <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td>{transaction.refId || "N/A"}</td>
                  <td>{transaction.name || "N/A"} <br /> {transaction.phone || "N/A"}</td>
                  <td>{Number(transaction.amount || 0).toFixed(2)}</td>
                  <td>
                    <span
                      className={`text-capitalize px-10 py-2 radius-4 fw-medium text-xs ${transaction.type === "debit"
                        ? "bg-danger-focus text-danger-600"
                        : "bg-primary-100 text-primary-700"
                        }`}
                    >
                      {transaction.type || "N/A"}
                    </span>
                  </td>
                  <td>{transaction.scenario || "N/A"}</td>
                  <td>{transaction.remarks || "N/A"}</td>
                  <td>
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleString(
                        "en-IN",
                        { timeZone: "Asia/Kolkata" }
                      )
                      : "N/A"}
                  </td>
                  <td>
                    <span className={`badge ${transaction.status === "success"
                      ? "bg-success"
                      : transaction.status === "failed"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                      }`}>
                      {transaction.status || "pending"}

                    </span>
                    <br />
                    {transaction.orderId}<br />
                    {transaction.status === "success" ? transaction.paymentId : ""}


                    {transaction.scenario === "subscription" &&
                      transaction.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => recheckStatus(transaction._id)}
                        >
                          Recheck
                        </Button>
                      )}

                  </td>
                  <td>
                    {transaction.scenario === "gift_claim" && (
                      <>
                        <span
                          className={`badge ${transaction.giftDeliveryStatus === "delivered"
                            ? "bg-success"
                            : transaction.giftDeliveryStatus === "shipped"
                              ? "bg-info"
                              : "bg-warning text-dark"
                            }`}
                        >
                          {transaction.giftDeliveryStatus || "pending"}
                        </span>

                        <br />

                        {transaction.giftDeliveryDetails && (
                          <small>{transaction.giftDeliveryDetails}</small>
                        )}

                        {transaction.giftShippedAt && (
                          <div className="text-xs">
                            Shipped: {new Date(transaction.giftShippedAt).toLocaleString("en-IN")}
                          </div>
                        )}

                        {transaction.giftDeliveredAt && (
                          <div className="text-xs">
                            Delivered: {new Date(transaction.giftDeliveredAt).toLocaleString("en-IN")}
                          </div>
                        )}

                        {(transaction.giftDeliveryStatus === "pending" ||
                          transaction.giftDeliveryStatus === "shipped") && (
                            <div className="mt-2">
                              <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter delivery remarks"
                                value={deliveryRemarks[transaction._id] || ""}
                                onChange={(e) =>
                                  setDeliveryRemarks((prev) => ({
                                    ...prev,
                                    [transaction._id]: e.target.value,
                                  }))
                                }
                              />

                              {transaction.giftDeliveryStatus === "pending" && (
                                <Button
                                  size="sm"
                                  variant="info"
                                  className="mt-1"
                                  onClick={() => updateDeliveryStatus(transaction._id, "shipped")}
                                >
                                  Mark Shipped
                                </Button>
                              )}

                              {transaction.giftDeliveryStatus === "shipped" && (
                                <Button
                                  size="sm"
                                  variant="success"
                                  className="mt-1"
                                  onClick={() => updateDeliveryStatus(transaction._id, "delivered")}
                                >
                                  Mark Delivered
                                </Button>
                              )}
                            </div>
                          )}
                        {transaction.giftDeliveryHistory?.map((h, i) => (
                          <div key={i} className="text-xs text-muted">
                            {h.status} – {h.remarks} – {new Date(h.at).toLocaleString("en-IN")}
                          </div>
                        ))}
                      </>
                    )}

                  </td>



                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li className="page-item">
              <Link
                href="#"
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <Icon icon="ep:d-arrow-left" />
              </Link>
            </li>

            {pageNumbers.map((num) => (
              <li className="page-item" key={num}>
                <Link
                  href="#"
                  onClick={() => handlePageChange(num)}
                  className={`page-link ${num === currentPage ? "bg-primary text-white" : ""
                    }`}
                >
                  {num}
                </Link>
              </li>
            ))}

            <li className="page-item">
              <Link
                href="#"
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <Icon icon="ep:d-arrow-right" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AllTransactions;
