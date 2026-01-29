// // src/app/all-users/adduser/page.jsx

"use client";

import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";

const AddUserPage = () => {
  const router = useRouter();

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

    profileImage: {
      url: "",
      name: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "emergencyContactPhone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({ ...formData, [name]: value });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: {
          url: reader.result,
          name: file.name,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const canSubmit =
    formData.fullName &&
    formData.email &&
    formData.phone.length === 10 &&
    formData.password &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,

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
      profileImage: formData.profileImage,

      isVerified: formData.isVerified,
      isActive: formData.isActive,
    };

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Employee created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/all-users");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to add employee",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong",
      });
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Add New Employee" />

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

              {/* Profile Photo */}
              <div className="col-sm-6">
                <Form.Group>
                  <Form.Label>Profile Photo</Form.Label>

                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <img
                      src={
                        formData.profileImage?.url ||
                        "https://placehold.co/50x50/png"
                      }
                      alt="Profile"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
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
                    required
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
                    required
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

            <div className="d-flex justify-content-center mt-5">
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

// "use client";

// import MasterLayout from "@/masterLayout/MasterLayout";
// import Breadcrumb from "@/components/Breadcrumb";
// import { useRouter } from "next/navigation";
// import { Form, Button } from "react-bootstrap";
// import { useState } from "react";
// import Swal from "sweetalert2";
// import { BsGenderAmbiguous } from "react-icons/bs";

// const AddUserPage = () => {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     phoneVerified: false,
//     pinCode: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     dob: "",
//     gender: "",
//     isActive: true,

//     profileImage: { url: "", name: "" },
//   });

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData({
//           ...formData,
//           profileImage: {
//             url: reader.result,
//             name: file.name,
//           },
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Strict numeric validation for phone and pinCode
//     if (name === "phone" || name === "pinCode") {
//       if (!/^\d*$/.test(value)) return; // Only allow digits
//       if (name === "phone" && value.length > 10) return; // Max 10 digits
//       if (name === "pinCode" && value.length > 6) return; // Max 6 digits
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   const canSubmit =
//     formData.fullName &&
//     formData.email &&
//     formData.phone.length === 10 &&
//     formData.pinCode.length === 6 &&
//     formData.city &&
//     formData.dob;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch("/api/customers/adduser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "User created successfully",
//           timer: 2000,
//           showConfirmButton: false,
//         });

//         router.push("/all-users");
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: data.message || "Failed to add user",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Unexpected Error",
//         text: "Something went wrong!",
//       });
//     }
//   };

//   return (
//     <MasterLayout>
//       <Breadcrumb title="Add New Employee" />

//       <div className="card h-100 p-0 radius-12 overflow-hidden">
//         <div className="card-body p-40">
//           <Form onSubmit={handleSubmit}>
//             {/* Section 1: Personal Details */}
//             <h4 className="mb-3">Profile Information</h4>
//             <div className="row mb-4">
//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     Full Name{" "}
//                     <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleChange}
//                     required
//                     placeholder="Full Name"
//                   />
//                 </Form.Group>
//               </div>

//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     Email <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     placeholder="Email"
//                   />
//                 </Form.Group>
//               </div>

//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     Phone <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                     placeholder="Mobile Number"
//                   />
//                 </Form.Group>
//               </div>
//               {/* profile photo */}
//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Profile Photo</Form.Label>
//                   <div className="d-flex align-items-center gap-2">
//                     <Form.Control
//                       type="file"
//                       name="profileImage"
//                       onChange={handleImageChange}
//                       placeholder="Profile Photo"
//                     />

//                     <img
//                       src={
//                         formData.profileImage?.url ||
//                         "https://placehold.co/10x10/png"
//                       }
//                       alt="Profile"
//                       style={{
//                         width: "50px",
//                         height: "50px",
//                         objectFit: "cover",
//                         borderRadius: "50%",
//                         marginTop: "10px",
//                       }}
//                       className="mt-0"
//                     />
//                     <div className="position-absolute bottom-0 end-0">
//                       <label
//                         htmlFor="profileUpload"
//                         className="btn btn-sm btn-primary rounded-circle p-2"
//                         style={{ cursor: "pointer" }}
//                       >
//                         <i className="bi bi-camera-fill"></i>+{" "}
//                         <input
//                           type="file"
//                           id="profileUpload"
//                           accept="image/*"
//                           className="d-none"
//                           onChange={handleImageChange}
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 </Form.Group>
//               </div>

//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     PIN Code <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     name="pinCode"
//                     value={formData.pinCode}
//                     onChange={handleChange}
//                     required
//                     placeholder="PIN Code"
//                   />
//                 </Form.Group>
//               </div>
//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     City <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     name="city"
//                     value={formData.city}
//                     onChange={handleChange}
//                     required
//                     placeholder="City"
//                   />
//                 </Form.Group>
//               </div>

//               <div className="col-sm-12">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Address Line1</Form.Label>
//                   <Form.Control
//                     name="addressLine1"
//                     value={formData.addressLine1}
//                     onChange={handleChange}
//                     placeholder="Address Line1"
//                   />
//                 </Form.Group>
//               </div>

//               <div className="col-sm-12">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Address Line 2</Form.Label>
//                   <Form.Control
//                     name="addressLine2"
//                     value={formData.addressLine2}
//                     onChange={handleChange}
//                     placeholder="Address Line2"
//                   />
//                 </Form.Group>
//               </div>

//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     Date of Birth{" "}
//                     <span className="text-danger fw-bold fs-6">*</span>
//                   </Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="dob"
//                     value={formData.dob}
//                     onChange={handleChange}
//                     min="1901-01-01"
//                     // max={new Date().toISOString().split("T")[0]}
//                     max={
//                       new Date(new Date().setDate(new Date().getDate() - 1))
//                         .toISOString()
//                         .split("T")[0]
//                     }
//                   />
//                 </Form.Group>
//               </div>

//               {/* Account Status */}
//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Account Status</Form.Label>
//                   <Form.Select
//                     name="isActive"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         isActive: e.target.value === "Active",
//                       })
//                     }
//                     value={formData.isActive ? "Active" : "Inactive"}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </Form.Select>
//                 </Form.Group>
//               </div>

//               {/* Phone Verification */}
//               <div className="col-sm-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Phone Verification</Form.Label>
//                   <Form.Select
//                     name="phoneVerified"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         phoneVerified: e.target.value === "true",
//                       })
//                     }
//                     value={formData.phoneVerified ? "true" : "false"}
//                   >
//                     <option value="true">Verified</option>
//                     <option value="false">Not Verified</option>
//                   </Form.Select>
//                 </Form.Group>
//               </div>

//               {/* Section: Gender & T-Shirt Size */}
//               <div className="row">
//                 <div className="col-sm-6">
//                   <Form.Group className="mb-3">
//                     <Form.Label>Gender</Form.Label>
//                     <div className="input-group">
//                       <Form.Select
//                         name="gender"
//                         value={formData.gender}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="MALE">Male</option>
//                         <option value="FEMALE">Female</option>
//                         <option value="OTHER">Other</option>
//                         <option value="PREFER_NOT_TO_SAY">
//                           Prefer not to say
//                         </option>
//                       </Form.Select>
//                       <span className="input-group-text">
//                         <BsGenderAmbiguous />
//                       </span>
//                     </div>
//                   </Form.Group>
//                 </div>
//               </div>
//             </div>

//             <div className="col-sm-6">
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Emergency Contact Details{" "}
//                   <span className="text-danger fw-bold fs-6">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="emergencyContactDetails"
//                   value={formData.emergencyContactDetails}
//                   // onChange={handleChange}
//                   // required
//                   placeholder="Contact Name"
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   Emergency Contact Number{" "}
//                   <span className="text-danger fw-bold fs-6">*</span>
//                 </Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="emergencyContactNumber"
//                   value={formData.emergencyContactDetails}
//                   // onChange={handleChange}
//                   // required
//                   placeholder="Contact Number"
//                 />
//               </Form.Group>
//             </div>

//             {/* Submit Button */}
//             <div className="d-flex justify-content-center mt-4">
//               <Button
//                 type="submit"
//                 className="btn btn-primary px-5 py-3 radius-8"
//                 disabled={!canSubmit}
//               >
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         </div>
//       </div>
//     </MasterLayout>
//   );
// };

// export default AddUserPage;
