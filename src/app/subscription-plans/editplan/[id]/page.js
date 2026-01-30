"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

export default function EditPlan({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    validityDays: 30,
    overview: "",
  });

  const [benefits, setBenefits] = useState([""]);

  // 🔥 FETCH PLAN
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(`/api/plans/get/${id}`);
        const out = await res.json();
        if (!res.ok) throw new Error(out.error);

        setFormData({
          planName: out.data.planName,
          price: out.data.price,
          validityDays: out.data.validityDays,
          overview: out.data.overview || "",
        });

        setBenefits(out.data.benefits?.length ? out.data.benefits : [""]);

        setLoading(false);
      } catch (err) {
        Swal.fire("Error", err.message, "error");
        router.push("/subscription-plans");
      }
    };

    fetchPlan();
  }, [id, router]);

  // 🔧 HANDLERS
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const updateBenefit = (i, value) => {
    const updated = [...benefits];
    updated[i] = value;
    setBenefits(updated);
  };

  const addBenefit = () => setBenefits([...benefits, ""]);

  const removeBenefit = (i) =>
    setBenefits(benefits.filter((_, index) => index !== i));

  // 🔥 UPDATE PLAN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.validityDays < 30 || formData.validityDays > 360) {
      Swal.fire(
        "Validation Error",
        "Validity must be between 30 and 360 days",
        "warning",
      );
      return;
    }

    try {
      const res = await fetch(`/api/plans/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: formData.planName,
          price: formData.price,
          validityDays: formData.validityDays,
          benefits: benefits.filter((b) => b.trim() !== ""),
          overview: formData.overview,
        }),
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out.error);

      Swal.fire({
        icon: "success",
        title: "Plan Updated",
        timer: 1500,
        showConfirmButton: false,
      });

      router.push("/subscription-plans");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="p-5 text-center">Loading...</div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <Breadcrumb title="Edit Subscription Plan" />

      <div className="bg-white rounded-3 border p-4">
        <Form onSubmit={handleSubmit}>
          {/* PLAN DETAILS */}
          <h5 className="mb-3">Plan Details</h5>

          <div className="row g-4">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Plan Name</Form.Label>
                <Form.Control
                  name="planName"
                  value={formData.planName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Validity (Days)</Form.Label>
                <Form.Control
                  type="number"
                  name="validityDays"
                  min={30}
                  max={360}
                  value={formData.validityDays}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>

          {/* BENEFITS */}
          <h5 className="mt-4 mb-3">Benefits</h5>

          {benefits.map((b, i) => (
            <div key={i} className="d-flex align-items-center gap-3 mb-2">
              <Form.Control
                value={b}
                onChange={(e) => updateBenefit(i, e.target.value)}
                placeholder="Eg: Unlimited doctor consultations"
              />
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeBenefit(i)}
                disabled={benefits.length === 1}
              >
                ✕
              </Button>
            </div>
          ))}

          <Button variant="outline-primary" size="sm" onClick={addBenefit}>
            + Add Benefit
          </Button>

          {/* OVERVIEW */}
          <h5 className="mt-4 mb-3">Plan Overview</h5>

          <SunEditor
            height="300px"
            setContents={formData.overview}
            onChange={(content) =>
              setFormData((p) => ({ ...p, overview: content }))
            }
          />

          {/* ACTIONS */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button
              variant="light"
              onClick={() => router.push("/subscription-plans")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Plan
            </Button>
          </div>
        </Form>
      </div>
    </MasterLayout>
  );
}
