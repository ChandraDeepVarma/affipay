// src/app/all-users/edituser/[id]/page.jsx
"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const EditUserPage = ({ params }) => {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // 🔑 EXACT SAME STRUCTURE AS ADD USER
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    dob: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    pinCode: "",

    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    joiningDate: "",
    remarks: "",

    isVerified: false,
    isActive: true,

    profileImage: { url: "", name: "" },
  });

  // ---------------- FETCH USER ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/update/${id}`);
        const data = await res.json();

        if (!res.ok) {
          Swal.fire("Error", data.error || "Failed to load user", "error");
          return router.push("/all-users");
        }

        const u = data.user;

        setFormData({
          fullName: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          password: "",
          confirmPassword: "",

          dob: u.dob ? u.dob.split("T")[0] : "",
          gender: u.gender || "",
          addressLine1: u.addressLine1 || "",
          addressLine2: u.addressLine2 || "",
          city: u.city || "",
          pinCode: u.pinCode || "",

          bloodGroup: u.bloodGroup || "",
          emergencyContactName: u.emergencyContact?.name || "",
          emergencyContactPhone: u.emergencyContact?.phone || "",
          joiningDate: u.joiningDate ? u.joiningDate.split("T")[0] : "",
          remarks: u.remarks || "",

          isVerified: u.isVerified,
          isActive: u.isActive,

          profileImage: u.profileImage || { url: "", name: "" },
        });

        setLoading(false);
      } catch {
        Swal.fire("Error", "Failed to load user details", "error");
        router.push("/all-users");
      }
    };

    fetchUser();
  }, [id, router]);

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: { url: reader.result, name: file.name },
      }));
    };
    reader.readAsDataURL(file);
  };

  // ---------------- CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "emergencyContactPhone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  // -------------------PASSWORD OPTIONAL LOGIC-----------------
  const canSubmit =
    formData.fullName &&
    formData.email &&
    formData.phone.length === 10 &&
    (!formData.password || formData.password === formData.confirmPassword);

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,

      dob: formData.dob,
      gender: formData.gender,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      pinCode: formData.pinCode,

      bloodGroup: formData.bloodGroup,
      emergencyContactName: formData.emergencyContactName,
      emergencyContactPhone: formData.emergencyContactPhone,
      joiningDate: formData.joiningDate,
      remarks: formData.remarks,

      isVerified: formData.isVerified,
      isActive: formData.isActive,
      profileImage: formData.profileImage,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      const res = await fetch(`/api/admin/users/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return Swal.fire("Error", data.error || "Update failed", "error");
      }

      Swal.fire({
        icon: "success",
        title: "Employee Updated",
        timer: 1800,
        showConfirmButton: false,
      });

      router.push("/all-users");
    } catch {
      Swal.fire("Error", "Unexpected error occurred", "error");
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <MasterLayout>
        <div className="p-5 text-center">Loading User...</div>
      </MasterLayout>
    );
  }

  // ---------------- UI (IDENTICAL TO ADD) ----------------
  return (
    <MasterLayout>
      <Breadcrumb title="Edit Employee" />

      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40">
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-4">Profile Information</h4>

            {/* Row 1 */}
            <div className="row g-4">
              <div className="col-sm-6">
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

              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            {/* Row 2 */}
            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Profile Photo</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.profileImage?.url && (
                      <img
                        src={formData.profileImage.url}
                        alt="Profile"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Row 3 */}
            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Confirm Password *</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Blood Group</Form.Label>
                  <Form.Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {/* Row 4 */}
            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mt-20">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mt-20">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Pin Code</Form.Label>
              <Form.Control
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Row 5 */}
            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Emergency Contact Name</Form.Label>
                  <Form.Control
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Emergency Contact Number</Form.Label>
                  <Form.Control
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Row 6 */}
            <div className="row g-4 mt-1">
              <div className="col-sm-12">
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

            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Verified</Form.Label>
                  <Form.Select
                    value={formData.isVerified ? "Yes" : "No"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isVerified: e.target.value === "Yes",
                      })
                    }
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            {/* Status */}
            <div className="row g-4 mt-1">
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.isActive ? "Active" : "Inactive"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "Active",
                      })
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-5">
              <button
                className="btn btn-danger-700 px-5 py-3"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/all-users");
                }}
              >
                Cancel
              </button>

              <Button
                type="submit"
                className="btn btn-primary px-5 py-3 radius-8"
                disabled={!canSubmit}
              >
                Update Employee
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EditUserPage;
