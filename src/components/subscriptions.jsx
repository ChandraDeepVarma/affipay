// src/components/subscriptions.jsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/api/users/allsubscriptions");
        setSubscriptions(response.data);
        console.log("Subscriptions data:", response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div className="p-24 text-center">Loading subscriptions...</div>;
  }

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-24">
        <div className="table-responsive">
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr>
                <th scope="col">Customer Details</th>
                <th scope="col">Plan</th>
                <th scope="col">Amount</th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Date</th>
                <th scope="col" className="text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="text-md mb-0 fw-medium">
                            {sub.userId?.fullName || "N/A"}
                          </h6>
                          <span className="text-sm text-secondary-light">
                            {sub.userId?.phone || ""}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light">
                        {sub.planId?.planName || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light">
                        ₹ {sub.planId?.price || 0}
                      </span>
                    </td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light text-break">
                        {sub.razorpaySubscriptionId || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="text-md mb-0 fw-normal text-secondary-light">
                        {new Date(sub.startDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          sub.status === "active"
                            ? "bg-success-focus text-success-600"
                            : "bg-warning-focus text-warning-600"
                        } px-24 py-4 radius-4 fw-medium text-xs text-capitalize`}
                      >
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
