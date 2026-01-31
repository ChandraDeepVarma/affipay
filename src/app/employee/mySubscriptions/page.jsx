"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import Breadcrumb from "@/components/Breadcrumb";

export default function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(
          "/api/employee/subscription/customerSubscriptions",
        );
        const data = await res.json();

        if (!data.success) throw new Error();

        setSubscriptions(data.data);
      } catch (err) {
        console.error("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const statusVariant = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      case "EXPIRED":
        return "secondary";
      default:
        return "warning";
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning text-dark";
      case "APPROVED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      case "EXPIRED":
        return "bg-secondary";
      case "RENEWED":
        return "bg-primary";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div>
      <Breadcrumb title="My Subscriptions" />

      {subscriptions.length === 0 ? (
        <p className="text-center text-muted mt-5">No subscriptions found</p>
      ) : (
        <div className="row">
          {subscriptions.map((sub) => (
            <div key={sub._id} className="col-12 mb-4">
              <Card className="radius-12 shadow-sm">
                <Card.Body className="p-24">
                  <h5 className="mb-16">{sub.fullName}</h5>

                  {/* CONTENT */}
                  <div className="row text-sm">
                    <div className="col-md-6">
                      <p>
                        <strong>Mobile:</strong> {sub.mobile}
                      </p>
                      <p>
                        <strong>Plan:</strong> {sub.planName}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{sub.price}
                      </p>
                    </div>

                    <div className="col-md-6">
                      <p>
                        <strong>UTR:</strong> {sub.paymentUTR}
                      </p>
                      <p>
                        <strong>Payment Date:</strong>{" "}
                        {new Date(sub.paymentDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Submitted On:</strong>{" "}
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* STATUS — ALWAYS BOTTOM LEFT */}
                  <div className="mt-12">
                    <span
                      className={`badge ${getStatusBadgeClass(
                        sub.status,
                      )} px-12 py-8 radius-6`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
