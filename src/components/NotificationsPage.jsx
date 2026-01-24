// src/components/NotificationsPage.jsx
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const NotificationsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await fetch("/api/customers/claimed-gifts");
      const data = await res.json();
      if (data.success) {
        setClaims(data.data);
      } else {
        toast.error(data.message || "Failed to fetch claims");
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Error fetching claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleMarkDelivered = async (claim) => {
    if (claim.status === "delivered") return;

    // Optimistic update
    const originalClaims = [...claims];
    setClaims((prev) =>
      prev.map((c) =>
        c.giftId === claim.giftId ? { ...c, status: "delivered" } : c
      )
    );

    try {
      const res = await fetch("/api/customers/claimed-gifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: claim.customerId,
          giftId: claim.giftId,
          status: "delivered",
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Gift marked as delivered");
      } else {
        toast.error(data.message || "Update failed");
        setClaims(originalClaims); // Revert on failure
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
      setClaims(originalClaims); // Revert on failure
    }
  };

  return (
    <>
      {/* <Breadcrumb title="Claimed Gifts / Notifications" /> */}
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">Referral Bonus Claims</h6>
        </div>
        <div className="card-body p-24">
          <div className="table-responsive">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th scope="col">User Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Plan</th>
                  <th scope="col">Milestone</th>
                  <th scope="col">Gift Name</th>
                  <th scope="col">Claimed Date</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : claims.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No claimed gifts found.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim, index) => (
                    <tr key={index}>
                      <td>
                        <span className="text-lg text-secondary-light fw-semibold">
                          {claim.customerName}
                        </span>
                      </td>
                      <td>
                        <span className="text-lg text-secondary-light fw-semibold">
                          {claim.customerPhone || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className="text-lg text-secondary-light fw-semibold">
                          {claim.planName}
                        </span>
                      </td>
                      <td>
                        <span className="text-lg text-secondary-light fw-semibold">
                          {claim.milestoneCount} Users
                        </span>
                      </td>
                      <td>
                        <span className="text-lg text-primary-600 fw-semibold">
                          {claim.giftName}
                        </span>
                      </td>
                      <td>{new Date(claim.claimedAt).toLocaleDateString()}</td>
                      <td>
                        {claim.status === "delivered" ? (
                          <span className="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">
                            Delivered
                          </span>
                        ) : (
                          <span className="bg-danger-focus text-danger-main px-24 py-4 rounded-pill fw-medium text-sm">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          className={`btn btn-sm ${
                            claim.status === "delivered"
                              ? "btn-secondary"
                              : "btn-primary"
                          } d-inline-flex align-items-center gap-2`}
                          onClick={() => handleMarkDelivered(claim)}
                          disabled={claim.status === "delivered"}
                        >
                          {claim.status === "delivered" ? (
                            <>
                              <Icon icon="akar-icons:check" /> Done
                            </>
                          ) : (
                            <>Mark Delivered</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
