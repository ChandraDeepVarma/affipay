"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdLockPerson } from "react-icons/md";
import { GoShieldLock } from "react-icons/go";
import { Icon } from "@iconify/react";

export default function EmployeeLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      userType: "employee",
    });

    setLoading(false);

    if (res?.error) {
      setApiError("Invalid employee credentials");
      return;
    }

    // ✅ get session AFTER successful login
    const session = await getSession();

    if (session?.user?.isAdmin) {
      router.replace("/home");
    } else {
      router.replace("/employee/dashboard");
    }
  };

  return (
    <section className="auth bg-base d-flex flex-wrap">
      {/* LEFT PANEL */}
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="/assets/images/logo2.png" alt="AFFIPAY" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <h4 className="mb-3">
              <MdLockPerson /> Employee Login
            </h4>
          </div>

          {apiError && (
            <div className="alert alert-danger text-sm py-2 mb-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* EMAIL */}
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:user" />
              </span>
              <input
                type="email"
                name="email"
                className="form-control h-56-px bg-neutral-50 radius-12"
                value={form.email}
                onChange={handleChange}
                placeholder="Email ID"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control h-56-px bg-neutral-50 radius-12"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <span
                className={`toggle-password ${
                  showPassword ? "ri-eye-line" : "ri-eye-off-line"
                } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-2"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <GoShieldLock /> Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
