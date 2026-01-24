"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ViewProfileLayer = () => {
  const { data: session, update } = useSession();
  const [imagePreview, setImagePreview] = useState(
    "/assets/images/profileimg.webp"
  );
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: { url: "", name: "" },
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Populate profile data from session
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        profileImage: { url: session.user.image || "", name: "" },
      });
      if (session.user.image) {
        setImagePreview(session.user.image);
      }
    }
  }, [session]);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Toggle function for current password field
  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Reset states
    setPasswordErrors({});
    setPasswordSuccess("");

    // Validate inputs
    const errors = {};

    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (newPassword && newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/auth/updatePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          if (data.message.includes("Current password")) {
            setPasswordErrors({ currentPassword: data.message });
          } else {
            setPasswordErrors({ general: data.message });
          }
        } else {
          setPasswordErrors({ general: "Failed to update password" });
        }
        return;
      }

      // Success
      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Update the token in localStorage if it was returned
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }
    } catch (error) {
      console.error("Password update error:", error);
      setPasswordErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/updateProfile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        setProfileSuccess("Profile updated successfully");

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setProfileSuccess("");
        }, 3000);

        // Update local session if possible
        if (update) {
          await update({
            ...session,
            user: {
              ...session.user,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
              image: profileData.profileImage?.url || null,
            },
          });
        }
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setProfileError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const readURL = (input) => {
    if (input.target.files && input.target.files[0]) {
      const file = input.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProfileData((prev) => ({
          ...prev,
          profileImage: { url: e.target.result, name: file.name },
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
          <div className="pb-24 ms-16 mb-24 me-16 mt-5">
            <div className="text-center border border-top-0 border-start-0 border-end-0">
              <img
                src={
                  imagePreview ||
                  session?.user?.image ||
                  "/assets/images/profileimg.webp"
                }
                alt=""
                className="border br-white border-width-2-px w-120-px h-120-px rounded-circle object-fit-cover"
              />
              <h6 className="mb-0 mt-16">
                {profileData.name || "Jacob Jones"}
              </h6>
              <span className="text-secondary-light mb-16">
                {profileData.email || "ifrandom@gmail.com"}
              </span>
            </div>
            <div className="mt-24">
              <h6 className="text-xl mb-16">Personal Info</h6>
              <ul>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-sm fw-semibold text-primary-light">
                    Full Name
                  </span>
                  <span className="w-70 text-secondary-light fw-medium text-sm">
                    : {profileData.name || "Will Jonto"}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-sm fw-semibold text-primary-light">
                    {" "}
                    Email
                  </span>
                  <span className="w-70 text-secondary-light fw-medium text-sm">
                    : {profileData.email || "willjontoax@gmail.com"}
                  </span>
                </li>
                <li className="d-flex align-items-center gap-1 mb-12">
                  <span className="w-30 text-sm fw-semibold text-primary-light text-sm">
                    {" "}
                    Phone Number
                  </span>
                  <span className="w-70 text-secondary-light fw-medium text-sm">
                    : {profileData.phone || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-body p-24">
            <ul
              className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24 active"
                  id="pills-edit-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-edit-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-edit-profile"
                  aria-selected="true"
                >
                  Edit Profile
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link d-flex align-items-center px-24"
                  id="pills-change-passwork-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-change-passwork"
                  type="button"
                  role="tab"
                  aria-controls="pills-change-passwork"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  Change Password
                </button>
              </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-edit-profile"
                role="tabpanel"
                aria-labelledby="pills-edit-profile-tab"
                tabIndex={0}
              >
                <h6 className="text-md text-primary-light mb-16">
                  Profile Image
                </h6>
                {/* Upload Image Start */}
                <div className="mb-24 mt-16">
                  <div className="avatar-upload">
                    <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        hidden
                        onChange={readURL}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                      >
                        <Icon
                          icon="solar:camera-outline"
                          className="icon"
                        ></Icon>
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: `url(${imagePreview})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Upload Image End */}
                {profileSuccess && (
                  <div className="alert alert-success mb-20">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="alert alert-danger mb-20">{profileError}</div>
                )}

                <form onSubmit={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="name"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Full Name
                          <span className="text-danger-600">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="name"
                          placeholder="Enter Full Name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="email"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Email <span className="text-danger-600">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control radius-8"
                          id="email"
                          placeholder="Enter email address"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="mb-20">
                        <label
                          htmlFor="number"
                          className="form-label fw-semibold text-primary-light text-sm mb-8"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="number"
                          placeholder="Enter phone number"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
              <div
                className="tab-pane fade"
                id="pills-change-passwork"
                role="tabpanel"
                aria-labelledby="pills-change-passwork-tab"
                tabIndex="0"
              >
                {passwordSuccess && (
                  <div className="alert alert-success mb-20">
                    {passwordSuccess}
                  </div>
                )}
                {passwordErrors.general && (
                  <div className="alert alert-danger mb-20">
                    {passwordErrors.general}
                  </div>
                )}

                <form onSubmit={handlePasswordUpdate}>
                  <div className="mb-20">
                    <label
                      htmlFor="current-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Current Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={currentPasswordVisible ? "text" : "password"}
                        className={`form-control radius-8 ${
                          passwordErrors.currentPassword ? "is-invalid" : ""
                        }`}
                        id="current-password"
                        placeholder="Enter Current Password*"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          currentPasswordVisible
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleCurrentPasswordVisibility}
                      ></span>
                    </div>
                    {passwordErrors.currentPassword && (
                      <div className="text-danger text-xs mt-1">
                        {passwordErrors.currentPassword}
                      </div>
                    )}
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="your-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      New Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className={`form-control radius-8 ${
                          passwordErrors.newPassword ? "is-invalid" : ""
                        }`}
                        id="your-password"
                        placeholder="Enter New Password*"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                    {passwordErrors.newPassword && (
                      <div className="text-danger text-xs mt-1">
                        {passwordErrors.newPassword}
                      </div>
                    )}
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="confirm-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Confirm Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className={`form-control radius-8 ${
                          passwordErrors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirm-password"
                        placeholder="Confirm Password*"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          confirmPasswordVisible
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></span>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <div className="text-danger text-xs mt-1">
                        {passwordErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;
