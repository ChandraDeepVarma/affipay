"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FaqManagement = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/faqs");
        const data = await response.json();

        if (data.success) {
          setFaqs(data.faqs);
        } else {
          setError(data.message || "Failed to fetch FAQs");
          toast.error(data.message || "Failed to fetch FAQs");
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError("Failed to fetch FAQs. Please try again later.");
        toast.error("Failed to fetch FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (data.success) {
        setFaqs(faqs.filter((faq) => faq._id !== id));
        toast.success(data.message || "FAQ deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again later.");
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3"></div>
        <div>
          <Link
            href="#"
            className="btn btn-primary radius-8"
            onClick={() => {
              setCurrentFaq(null);
              setShowEditModal(true);
            }}
          >
            <Icon icon="mdi:plus" className="m-1" />
            Add Faq
          </Link>
        </div>
      </div>
      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  S.No
                </th>
                <th scope="col" className="text-center">
                  Question
                </th>
                <th scope="col" className="text-center">
                  Answer
                </th>
                <th scope="col" className="text-center">
                  Created at
                </th>
                <th scope="col" className="text-center">
                  Status
                </th>
                <th scope="col" className="text-center">
                  Display order
                </th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading FAQs...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-danger">
                    {error}
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No FAQs found. Add your first FAQ!
                  </td>
                </tr>
              ) : (
                faqs.map((faq, idx) => (
                  <tr key={faq._id}>
                    <td>{idx + 1}</td>
                    <td>{faq.question}</td>
                    <td>
                      <div
                        className="text-truncate"
                        style={{ maxWidth: "300px" }}
                      >
                        {faq.answer}
                      </div>
                    </td>
                    <td>{new Date(faq.createdAt).toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          faq.status === "Active" ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {faq.status}
                      </span>
                    </td>
                    <td>{faq.display_order}</td>
                    <td>
                      <div className="d-flex align-items-center gap-10 justify-content-center">
                        <button
                          type="button"
                          className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleEdit(faq)}
                        >
                          <Icon icon="lucide:edit" className="menu-icon" />
                        </button>
                        <button
                          type="button"
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(faq._id)}
                        >
                          <Icon
                            icon="fluent:delete-24-regular"
                            className="menu-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit FAQ Modal */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentFaq ? "Edit Faq" : "Add Faq"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label
                      htmlFor="question"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Question
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="question"
                      defaultValue={currentFaq?.question || ""}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="answer"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Answer
                    </label>
                    <textarea
                      className="form-control radius-8"
                      id="answer"
                      rows="4"
                      defaultValue={currentFaq?.answer || ""}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Status
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input m-1"
                          type="radio"
                          name="status"
                          id="statusYes"
                          defaultChecked={currentFaq?.status === "Active"}
                        />
                        <label className="form-check-label" htmlFor="statusYes">
                          Yes
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input m-1"
                          type="radio"
                          name="status"
                          id="statusNo"
                          defaultChecked={currentFaq?.status !== "Active"}
                        />
                        <label className="form-check-label" htmlFor="statusNo">
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="displayOrder"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Display order
                    </label>
                    <input
                      type="number"
                      className="form-control radius-8"
                      id="displayOrder"
                      defaultValue={currentFaq?.display_order || 1}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const question = document.getElementById("question").value;
                    const answer = document.getElementById("answer").value;
                    const status = document.getElementById("statusYes").checked
                      ? "Active"
                      : "Inactive";
                    const display_order = parseInt(
                      document.getElementById("displayOrder").value
                    );

                    if (!question || !answer) {
                      toast.error("Question and answer are required");
                      return;
                    }

                    try {
                      if (currentFaq) {
                        // Update existing FAQ
                        const response = await fetch(
                          `/api/faqs/${currentFaq._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              question,
                              answer,
                              status,
                              display_order,
                            }),
                          }
                        );

                        const data = await response.json();

                        if (data.success) {
                          setFaqs(
                            faqs.map((faq) =>
                              faq._id === currentFaq._id ? data.faq : faq
                            )
                          );
                          toast.success(
                            data.message || "FAQ updated successfully"
                          );
                        } else {
                          toast.error(data.message || "Failed to update FAQ");
                        }
                      } else {
                        // Add new FAQ
                        const response = await fetch("/api/faqs", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            question,
                            answer,
                            status,
                            display_order,
                          }),
                        });

                        const data = await response.json();

                        if (data.success) {
                          setFaqs([...faqs, data.faq]);
                          toast.success(
                            data.message || "FAQ added successfully"
                          );
                        } else {
                          toast.error(data.message || "Failed to add FAQ");
                        }
                      }

                      setShowEditModal(false);
                    } catch (error) {
                      console.error("Error saving FAQ:", error);
                      toast.error(
                        "Failed to save FAQ. Please try again later."
                      );
                    }
                  }}
                >
                  {currentFaq ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqManagement;
