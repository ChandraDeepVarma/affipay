// src/app/all-users/adduser/page.jsx
"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
import { IoShirtOutline } from "react-icons/io5";
import { BsGenderAmbiguous } from "react-icons/bs";

const AddUserPage = () => {
  const router = useRouter();

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

    // Bank Details
    upiId: "",
    bankAccount: "",
    ifscCode: "",
    accountHolderName: "",

    profileImage: { url: "", name: "" },
  });

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

  // ---------- Bank Validation Helpers ----------
  const isValidUPI = (upi) => /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi);

  const isValidIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);

  const hasAnyBankField =
    formData.upiId ||
    formData.bankAccount ||
    formData.ifscCode ||
    formData.accountHolderName;

  const isBankSectionValid = () => {
    // If nothing entered → valid (optional)
    if (!hasAnyBankField) return true;

    // UPI-only flow
    if (formData.upiId) {
      return isValidUPI(formData.upiId);
    }

    // Bank-account flow
    return (
      formData.bankAccount.length >= 9 &&
      formData.bankAccount.length <= 18 &&
      isValidIFSC(formData.ifscCode) &&
      formData.accountHolderName.trim() !== ""
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Strict numeric validation for phone and pinCode
    if (name === "phone" || name === "pinCode") {
      if (!/^\d*$/.test(value)) return; // Only allow digits
      if (name === "phone" && value.length > 10) return; // Max 10 digits
      if (name === "pinCode" && value.length > 6) return; // Max 6 digits
    }
    setFormData({ ...formData, [name]: value });
  };

  const canSubmit =
    formData.fullName &&
    formData.email &&
    formData.phone.length === 10 &&
    formData.pinCode.length === 6 &&
    formData.city &&
    formData.dob &&
    formData.tshirtSize;
  // isBankSectionValid();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isBankSectionValid()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Bank Details",
        text: "Please provide a valid UPI ID or complete bank details correctly.",
      });
      return;
    }

    try {
      const res = await fetch("/api/customers/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User created successfully",
          timer: 2000,
          showConfirmButton: false,
        });

        router.push("/all-users");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to add user",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Add New User" />

      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40">
          <Form onSubmit={handleSubmit}>
            {/* Section 1: Personal Details */}
            <h4 className="mb-3">Profile Information</h4>
            <div className="row mb-4">
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Full Name{" "}
                    <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
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
                  <Form.Label>
                    Email <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
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
                  <Form.Label>
                    Phone <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
                  <Form.Control
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Mobile Number"
                  />
                </Form.Group>
              </div>
              {/* profile photo */}
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
                  <Form.Label>
                    PIN Code <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
                  <Form.Control
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                    placeholder="PIN Code"
                  />
                </Form.Group>
              </div>
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    City <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
                  <Form.Control
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>Address Line1</Form.Label>
                  <Form.Control
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Address Line1"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Address Line2"
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Date of Birth{" "}
                    <span className="text-danger fw-bold fs-6">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    min="1901-01-01"
                    // max={new Date().toISOString().split("T")[0]}
                    max={
                      new Date(new Date().setDate(new Date().getDate() - 1))
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                </Form.Group>
              </div>

              {/* Account Status */}
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Account Status</Form.Label>
                  <Form.Select
                    name="isActive"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "Active",
                      })
                    }
                    value={formData.isActive ? "Active" : "Inactive"}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Phone Verification */}
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone Verification</Form.Label>
                  <Form.Select
                    name="phoneVerified"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phoneVerified: e.target.value === "true",
                      })
                    }
                    value={formData.phoneVerified ? "true" : "false"}
                  >
                    <option value="true">Verified</option>
                    <option value="false">Not Verified</option>
                  </Form.Select>
                </Form.Group>
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
            </div>

            {/* Section 2: Bank Details */}
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
                    placeholder="Account Number"
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
                    placeholder="IFSC Code"
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
            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                className="btn btn-primary px-5 py-3 radius-8"
                disabled={!canSubmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default AddUserPage;
