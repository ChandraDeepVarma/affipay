"use client";
import { signIn, useSession } from "next-auth/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoShieldLock } from "react-icons/go";
import { MdLockPerson } from "react-icons/md";
const SignInLayer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (status !== "loading") return;
    if (status === "authenticated" && session?.user?.isAdmin) {
      router.replace("/home");
    }
  }, [status, session, router]);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        setApiError("");

        const result = await signIn("credentials", {
          redirect: false, // don’t auto-redirect, handle manually
          email: form.email,
          password: form.password,
          callbackUrl: "/home",
        });

        if (result?.error) {
          setApiError(result.error);
          setSubmitted(false);
        } else {
          setErrors({});
          setSubmitted(true);
          router.push("/home");
        }
      } catch (error) {
        setApiError(error.message);
        setSubmitted(false);
      } finally {
        setLoading(false);
      }
    }
  };
  // While checking session, show a loader (optional)
  if (status === "loading") {
    return <div className="text-center p-5">Checking session...</div>;
  }
  return (

    <section className="auth bg-base d-flex flex-wrap">
      <div className="auth-left d-lg-block d-none">
        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
          <img src="/assets/images/logo2.png" alt="" />
        </div>
      </div>
      <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
        <div className="max-w-464-px mx-auto w-100">
          <div>
            <h4 className="mb-3">
              <MdLockPerson /> Login
            </h4>
          </div>

          {apiError && (
            <div className="alert alert-danger text-sm py-2 mb-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="icon-field mb-16">
              <span className="icon top-50 translate-middle-y">
                <Icon icon="mage:user" />
              </span>
              <input
                type="email"
                name="email"
                className={`form-control h-56-px bg-neutral-50 radius-12${errors.email ? " is-invalid" : ""
                  }`}
                value={form.email}
                onChange={handleChange}
                id="your-email"
                placeholder="Email ID"
              />
              {errors.email && (
                <div className="text-danger text-xs mt-1">{errors.email}</div>
              )}
            </div>

            <div className="position-relative mb-20">
              <div className="icon-field">
                <span className="icon top-50 translate-middle-y">
                  <Icon icon="solar:lock-password-outline" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control h-56-px bg-neutral-50 radius-12${errors.password ? " is-invalid" : ""
                    }`}
                  id="your-password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-danger text-xs mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              <span
                className={`toggle-password ${showPassword ? "ri-eye-line" : "ri-eye-off-line"
                  } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              />
            </div>

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
};

export default SignInLayer;
