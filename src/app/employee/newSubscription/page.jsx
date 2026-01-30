"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { FaUser, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";

export default function NewSubscription() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    gender: "",
    address: "",
    city: "",
    pincode: "",
    planId: "",
    price: "",
    paymentUTR: "",
    paymentDate: "",
    remarks: "",
  });

  /* ---------------- FETCH PLANS ---------------- */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans/list");
        const data = await res.json();

        if (!data.success) throw new Error("Failed to fetch plans");

        setPlans(data.plans.filter((p) => p.isActive));
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to load subscription plans",
        });
      }
    };

    fetchPlans();
  }, []);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- PLAN CHANGE ---------------- */
  const handlePlanChange = (e) => {
    const planId = e.target.value;
    const plan = plans.find((p) => p._id === planId);

    setSelectedPlan(plan);

    setFormData((prev) => ({
      ...prev,
      planId,
      price: plan?.price || "",
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.planId) {
      return Swal.fire({
        icon: "warning",
        title: "Plan Required",
        text: "Please select a subscription plan",
      });
    }

    const confirm = await Swal.fire({
      title: "Submit Subscription?",
      text: "This will be sent to admin for approval.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    try {
      const res = await fetch(
        "/api/employee/subscription/customerSubscriptions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Submitted",
        text: "Subscription submitted for admin approval",
      });

      // Reset form
      setFormData({
        fullName: "",
        mobile: "",
        gender: "",
        address: "",
        city: "",
        pincode: "",
        planId: "",
        price: "",
        paymentUTR: "",
        paymentDate: "",
        remarks: "",
      });

      setSelectedPlan(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb title="Register New Customer" />

      <Card className="radius-12 shadow-sm">
        <Card.Body className="p-40">
          <Form onSubmit={handleSubmit}>
            {/* CUSTOMER INFO */}
            <div className="mb-32">
              <h5 className="d-flex align-items-center gap-2 mb-20">
                <FaUser className="text-primary" />
                Customer Information
              </h5>

              <div className="row g-4">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Mobile Number *</Form.Label>
                    <Form.Control
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <hr />

            {/* SUBSCRIPTION */}
            <div className="mt-32">
              <h5 className="d-flex align-items-center gap-2 mb-20">
                <FaCreditCard className="text-primary" />
                Subscription & Payment Details
              </h5>

              <div className="row g-4">
                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Subscription Plan *</Form.Label>
                    <Form.Select
                      value={formData.planId}
                      onChange={handlePlanChange}
                      required
                    >
                      <option value="">Select Plan</option>
                      {plans.map((plan) => (
                        <option key={plan._id} value={plan._id}>
                          {plan.planName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Payment Amount (INR)</Form.Label>
                    <Form.Control value={formData.price} disabled />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Payment UTR Number *</Form.Label>
                    <Form.Control
                      name="paymentUTR"
                      value={formData.paymentUTR}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group>
                    <Form.Label>Payment Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </div>

                <div className="col-md-12">
                  <Form.Group>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-40">
              <Button
                type="submit"
                className="btn btn-primary px-24 py-12"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" /> Submitting...
                  </>
                ) : (
                  "Submit for Approval"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
