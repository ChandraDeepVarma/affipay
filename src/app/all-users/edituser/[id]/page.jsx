// src/app/all-users/edituser/[id]/page.jsx
"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { IoShirtOutline } from "react-icons/io5";
import { BsGenderAmbiguous } from "react-icons/bs";

const EditUserPage = ({ params }) => {
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    phoneVerified: false,
    pinCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    dob: "",
    gender: "",
    tshirtSize: "",
    isActive: true,

    // Bank Information
    upiId: "",
    bankAccount: "",
    ifscCode: "",
    accountHolderName: "",

    // Referral Info
    referralCode: "",
    referralName: "",

    profileImage: { url: "", name: "" },
  });

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/customers/getuser/${id}`);
        const data = await res.json();

        if (!res.ok) {
          Swal.fire("Error", data.error || "Failed to load user", "error");
          return router.push("/all-users");
        }

        const u = data.user;

        setFormData({
          fullName: u.fullName || "",
          email: u.email || "",
          phone: u.phone || "",
          phoneVerified: u.phoneVerified || false,
          pinCode: u.pinCode || "",
          addressLine1: u.addressLine1 || "",
          addressLine2: u.addressLine2 || "",
          city: u.city || "",
          dob: u.dob ? u.dob.split("T")[0] : "",
          gender: u.gender || "",
          tshirtSize: u.tshirtSize || "",
          isActive: u.isActive,

          upiId: u.upiId || "",
          bankAccount: u.bankAccount || "",
          ifscCode: u.ifscCode || "",
          accountHolderName: u.accountHolderName || "",

          referralCode: u.referralCode || "",
          referralName: u.referralName?.fullName || "",

          profileImage: u.profileImage || { url: "", name: "" },
        });

        setLoading(false);
      } catch (err) {
        Swal.fire("Error", "Failed to load user details", "error");
        router.push("/all-users");
      }
    };

    fetchUser();
  }, [id, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: {
            url: reader.result,
            name: file.name,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strict numeric validation for phone and pinCode as per previous instruction for consistency
    if (name === "phone" || name === "pinCode") {
      if (!/^\d*$/.test(value)) return;
      if (name === "phone" && value.length > 10) return;
      if (name === "pinCode" && value.length > 6) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  // Update User
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/customers/updateuser/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const out = await res.json();

      if (!res.ok) {
        Swal.fire("Error", out.error || "Failed to update user", "error");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "User Updated",
        timer: 1800,
        showConfirmButton: false,
      });

      router.push("/all-users");
    } catch (err) {
      Swal.fire("Error", "Unexpected error occurred", "error");
    }
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="p-5 text-center">
          <p>Loading User...</p>
        </div>
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <Breadcrumb title="Edit User" />

      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40">
          <Form onSubmit={handleSubmit}>
            {/* Section 1: Profile Information */}
            <h4 className="mb-3">Profile Information</h4>
            {/* <div className="row mb-4">
              <div className="col-sm-12 text-center">
                <div
                  className="position-relative d-inline-block"
                  style={{ width: "120px", height: "120px" }}
                >
                  <img
                    src={
                      formData.profileImage?.url ||
                      "https://via.placeholder.com/120?text=User"
                    }
                    alt="Profile"
                    className="rounded-circle object-fit-cover w-100 h-100 border"
                  />
                  <div className="position-absolute bottom-0 end-0">
                    <label
                      htmlFor="profileUpload"
                      className="btn btn-sm btn-primary rounded-circle p-2"
                      style={{ cursor: "pointer" }}
                    >
                      <i className="bi bi-camera-fill"></i>+
                      <input
                        type="file"
                        id="profileUpload"
                        accept="image/*"
                        className="d-none"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="row">
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                  />
                </Form.Group>
              </div>
              {/* Profile Images */}
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Profile Photo</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="file"
                      name="profileImage"
                      onChange={handleImageChange}
                      placeholder="Profile Photo"
                    />
                    <img
                      src={
                        formData.profileImage?.url ||
                        "https://placehold.co/10x10/png"
                      }
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginTop: "10px",
                      }}
                      className="mt-0"
                    />
                    <div className="position-absolute bottom-0 end-0">
                      <label
                        htmlFor="profileUpload"
                        className="btn btn-sm btn-primary rounded-circle p-2"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="bi bi-camera-fill"></i>+{" "}
                        <input
                          type="file"
                          id="profileUpload"
                          accept="image/*"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    placeholder="PIN Code"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
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
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                  />
                </Form.Group>
              </div>

              {/* Account Status */}
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Account Status</Form.Label>
                  <Form.Select
                    name="isActive"
                    value={formData.isActive ? "Active" : "Inactive"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "Active",
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* phone Status */}
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Phone Status</Form.Label>
                  <Form.Select
                    name="phoneVerified"
                    value={formData.phoneVerified ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneVerified: e.target.value === "true",
                      })
                    }
                  >
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {/* Referral Info */}
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Referral Code</Form.Label>
                  <Form.Control
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Referral Code"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Referral Name</Form.Label>
                  <Form.Control
                    name="referralName"
                    value={formData.referralName}
                    onChange={handleChange}
                    placeholder="Referral Name"
                  />
                </Form.Group>
              </div>
            </div>

            {/* Section: Gender & T-Shirt Size */}
            <div className="row">
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    T-Shirt Size{" "}
                    <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
                  <div className="input-group">
                    <Form.Select
                      name="tshirtSize"
                      value={formData.tshirtSize}
                      onChange={handleChange}
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="XXXL">XXXL</option>
                    </Form.Select>
                    <span className="input-group-text">
                      <IoShirtOutline />
                    </span>
                  </div>
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <div className="input-group">
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="PREFER_NOT_TO_SAY">
                        Prefer not to say
                      </option>
                    </Form.Select>
                    <span className="input-group-text">
                      <BsGenderAmbiguous />
                    </span>
                  </div>
                </Form.Group>
              </div>
            </div>

            {/* Section 3: Bank Details */}
            <h4 className="mt-4 mb-3">Bank & Payment Details (Optional)</h4>
            <div className="row">
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>UPI ID</Form.Label>
                  <Form.Control
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="example@upi"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Bank Account Number</Form.Label>
                  <Form.Control
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="Bank Account Number"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Account Holder Name</Form.Label>
                  <Form.Control
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="Account Holder Name"
                  />
                </Form.Group>
              </div>
            </div>

            {/* Submit Button */}
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
              <Button className="btn btn-primary px-5 py-3" type="submit">
                Update User
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EditUserPage;
