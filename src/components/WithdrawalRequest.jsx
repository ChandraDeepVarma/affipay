// src/components/WithdrawalRequest.jsx
"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const WithdrawalRequest = () => {
  const router = useRouter();
  const [withdrawalRequest, setWithdrawalRequest] = useState([]);
  // Filters state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Show 10 users per page

  useEffect(() => {
    const fetchWithdrawalRequest = async () => {
      try {
        const res = await fetch(`/api/requests/withdrawalrequest`, {
          cache: "no-store",
        });
        if (!res.ok) {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: `Unable to fetch withdrawal request. (Status: ${res.status})`,
          });
          return;
        }
        const data = await res.json();
        console.log(data);
        setWithdrawalRequest(Array.isArray(data) ? data : []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Failed to connect to the server. Please check your internet connection or try again later.",
        });
        console.error("Fetch error:", error);
      }
    };
    fetchWithdrawalRequest();
  }, []);

  // Filter for table display (search + date filter)
  const filteredUsers = withdrawalRequest.filter((user) => {
    const searchMatch =
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const dateMatch = (() => {
      if (!fromDate && !toDate) return true;
      if (!user.createdAt) return false;
      const userDate = new Date(user.createdAt).setHours(0, 0, 0, 0);
      const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
      const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
      return (!from || userDate >= from) && (!to || userDate <= to);
    })();

    return searchMatch && dateMatch;
  });
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate]);

  //Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Dynamic page range sliding window
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleexportToExcel = () => {
    let exportList = filteredUsers;
    if (!exportList.length) {
      Swal.fire("No Data", "There is no data to export", "warning");
      return;
    }
    // Apply date filtering for export
    if (fromDate || toDate) {
      exportList = withdrawalRequest.filter((user) => {
        if (!user.createdAt) return false;
        const userDate = new Date(user.createdAt).setHours(0, 0, 0, 0);
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
        return (!from || userDate >= from) && (!to || userDate <= to);
      });
    }

    const exportData = exportList.map((user, index) => ({
      "S.No": index + 1,
      Username: user.name,
      Email: user.email,
      Phone: user.phone,
      TransactionID: user.transactionId,
      Amount: user.amount,
      "UTR Number": user.utrNumber || "N/A",
      Status: user.status,
      "Created At": user.createdAt
        ? new Date(user.createdAt)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .replace("am", "AM")
            .replace("pm", "PM")
        : "N/A",
    }));

    // Create a worksheet from JSON
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Export as Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "withdrawalRequest_data.xlsx");
  };

  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Withdrawal?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/requests/withdrawal-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        withdrawalId: id,
        action: "approve",
      }),
    });
    console.log("handleApprove Response", res);
    const data = await res.json();
    console.log("handleApprove Data", data);
    Swal.fire(
      data.success ? "Success" : "Error",
      data.msg,
      data.success ? "success" : "error"
    );

    if (data.success) {
      setWithdrawalRequest((prev) =>
        prev.map((w) =>
          w._id === id
            ? {
                ...w,
                status: "approved",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Withdrawal?",
      text: "Amount will be refunded to wallet",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch("/api/requests/withdrawal-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        withdrawalId: id,
        action: "reject",
      }),
    });
    console.log("handleReject Response", res);

    const data = await res.json();
    console.log("handleReject Data", data);
    Swal.fire(
      data.success ? "Success" : "Error",
      data.msg,
      data.success ? "success" : "error"
    );

    if (data.success) {
      setWithdrawalRequest((prev) =>
        prev.map((w) =>
          w._id === id
            ? {
                ...w,
                status: "rejected",
                processedAt: new Date().toISOString(),
              }
            : w
        )
      );
    }
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="px-5 d-flex flex-wrap gap-3 mt-5">
        <div style={{ width: "200px" }}>
          <Form.Control
            type="text"
            value={fromDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
            className="w-100"
          />
        </div>
        <div style={{ width: "200px" }}>
          <Form.Control
            type="text"
            value={toDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => (e.target.type = "text")}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
            className="w-100"
          />
        </div>
        <div style={{ flex: 1, minWidth: "250px" }}>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Phone or Email"
            className="w-100"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          className="!bg-blue-300 !text-white px-4 rounded hover:!bg-blue-600 transition-colors"
          onClick={handleexportToExcel}
        >
          Export Data
        </Button>
      </div>

      <hr className="mx-5 mt-3" />

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Cutomers Details</th>
                <th className="text-center">Transaction Id</th>
                <th className="text-center">UTR Number</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Requested At</th>
                <th className="text-center">Status</th>
                <th className="text-center">Modified At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td>
                    <div className="text-start">
                      <div>
                        <span className="fw-bold">Name:</span> {user.FullName}
                      </div>
                      <div>
                        <span className="fw-bold">Email:</span> {user.email}
                      </div>
                    </div>
                  </td>
                  {/* <td>{user.phone}</td> */}
                  <td>{user.transactionId}</td>
                  <td>{user.utrNumber || "N/A"}</td>
                  <td>{user.amount}</td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace("am", "AM")
                          .replace("pm", "PM")
                      : "N/A"}
                  </td>
                  <td
                    className={
                      user.status === "pending"
                        ? "text-warning fw-semibold fs-6"
                        : user.status === "approved"
                        ? "text-success fw-semibold fs-6"
                        : "text-danger fw-semibold fs-6"
                    }
                  >
                    {user.status?.toUpperCase()}
                  </td>
                  <td>
                    {user.processedAt
                      ? new Date(user.processedAt)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace("am", "AM")
                          .replace("pm", "PM")
                      : "N/A"}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        size="sm"
                        className="me-2"
                        // onClick={() => handleApprove(user._id)}
                        onClick={() =>
                          router.push(
                            `/withdrawal-requests/approve/${user._id}`
                          )
                        }
                        disabled={user.status !== "pending"}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(user._id)}
                        disabled={user.status !== "pending"}
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Logic */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
          <span>
            Showing {filteredUsers.length > 0 ? indexOfFirstUser + 1 : 0} to{" "}
            {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
            {filteredUsers.length} entries
          </span>
          <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
            <li className="page-item">
              <Link
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <Icon icon="ep:d-arrow-left" className="" />
              </Link>
            </li>
            {/* Page Numbers */}
            {pageNumbers.map((num) => (
              <li className="page-item" key={num}>
                <Link
                  href="#"
                  onClick={() => handlePageChange(num)}
                  className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                    num === currentPage
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-200 text-secondary-light"
                  }`}
                >
                  {num}
                </Link>
              </li>
            ))}
            <li className="page-item">
              <Link
                className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px  text-md"
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {" "}
                <Icon icon="ep:d-arrow-right" className="" />{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequest;
