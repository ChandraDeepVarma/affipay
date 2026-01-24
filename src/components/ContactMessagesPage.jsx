"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { Icon } from "@iconify/react";
import { Form, Modal, Button } from "react-bootstrap";

const ContactMessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const limit = 10;
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const openModal = (msg) => {
    setSelectedMessage(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Fetch Messages
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/customers/contact-messageslist");
      const out = await res.json();

      if (out.success) setMessagesData(out.messages);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete this contact message?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await fetch("/api/customers/contact-messageslist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const out = await res.json();
        if (out.success) {
          Swal.fire("Deleted", out.message, "success");
          fetchMessages();
        }
      } catch {
        Swal.fire("Error", "Unable to delete", "error");
      }
    });
  };

  // SEARCH
  const filteredList = messagesData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLogs = filteredList.length;
  const totalPages = Math.ceil(totalLogs / limit);
  const paginatedList = filteredList.slice((page - 1) * limit, page * limit);

  // PAGINATION (always show 5 slots)
  const visiblePages = 5;
  let start = Math.max(1, page - Math.floor(visiblePages / 2));
  let end = Math.min(totalPages, start + visiblePages - 1);

  if (end - start < visiblePages - 1) {
    start = Math.max(1, end - visiblePages + 1);
  }

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(messagesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contact Messages");
    XLSX.writeFile(wb, "contact_messages.xlsx");
  };

  return (
    <div className="card h-100 p-0 radius-12">
      {/* Header */}
      <div className="card-header d-flex justify-content-between align-items-center border-bottom">
        <Form className="d-flex align-items-center" style={{ width: "50%" }}>
          <Form.Group className="flex-grow-1 me-2">
            <Form.Control
              type="search"
              placeholder="Search by name, email, phone & subject"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </Form.Group>
        </Form>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={exportExcel}
        >
          Export
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-40">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0 text-center">
            <thead>
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Customer Details</th>
                <th className="text-center">Phone</th>
                <th className="text-center">Subject</th>
                <th className="text-center">Message</th>
                <th className="text-center">Contacted At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-center align-middle">
              {!loading &&
                paginatedList.map((msg, index) => (
                  <tr key={msg._id}>
                    <td>{(page - 1) * limit + index + 1}</td>

                    <td>
                      <div>
                        <strong>{msg.name}</strong>
                      </div>
                      <div>{msg.email}</div>
                    </td>

                    <td>{msg.phone}</td>

                    <td>{msg.subject}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openModal(msg)}
                      >
                        View
                      </button>
                    </td>

                    <td>{new Date(msg.createdAt).toLocaleString()}</td>

                    <td>
                      <button
                        className="remove-item-btn bg-danger-focus text-danger-600 fw-medium w-40-px h-40-px rounded-circle"
                        onClick={() => handleDelete(msg._id)}
                      >
                        <Icon
                          icon="material-symbols:delete-outline"
                          width="20"
                        />
                      </button>
                    </td>
                  </tr>
                ))}

              {loading && (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {paginatedList.length} of {totalLogs} entries
          </span>

          <ul className="pagination d-flex align-items-center gap-2">
            {/* First */}
            {page > 1 && (
              <li>
                <button className="page-link" onClick={() => setPage(1)}>
                  &laquo;
                </button>
              </li>
            )}

            {/* Prev */}
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                <Icon icon="ep:d-arrow-left" />
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: end - start + 1 }).map((_, i) => {
              const number = start + i;
              return (
                <li key={number} className="page-item">
                  <button
                    onClick={() => setPage(number)}
                    className={`page-link ${
                      number === page
                        ? "bg-primary-600 text-white border-2 radius-8"
                        : ""
                    }`}
                  >
                    {number}
                  </button>
                </li>
              );
            })}

            {/* Next */}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                <Icon icon="ep:d-arrow-right" />
              </button>
            </li>

            {/* Last */}
            {page < totalPages && (
              <li>
                <button
                  className="page-link"
                  onClick={() => setPage(totalPages)}
                >
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* View Message Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Message Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <p>
                <strong>Name:</strong> {selectedMessage.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedMessage.phone}
              </p>
              <p>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <div className="border p-2 rounded bg-light">
                {selectedMessage.message}
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContactMessagesPage;
