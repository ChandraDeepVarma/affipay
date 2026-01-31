"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Sitesettings = () => {
  const [formData, setFormData] = useState({
    contact_email: "",
    contact_phone: "",
    office_address: "",
    smtpHost: "",
    smtpUser: "",
    smtpPass: "",
    smtpPort: "",
    youtube: "",
    bonusAmount: 0,
    bonusUserLimit: 0,
    minWithdrawalLimit: 0,
    otpMode: "static",
    RAZORPAY_KEY_ID: "",
    RAZORPAY_KEY_SECRET: "",
    RAZORPAY_TEST_KEY_ID: "",
    RAZORPAY_TEST_KEY_SECRET: "",
    RAZORPAY_PAYMENT_MODE: "live",
    buyButtonMode: "gateway",
    qrPaymentVerficationMode: "manual",
  });
  const [loading, setLoading] = useState(false);

  // Fetch data on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setFormData((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Razorpay validation
    if (formData.RAZORPAY_PAYMENT_MODE === "live") {
      if (!formData.RAZORPAY_KEY_ID || !formData.RAZORPAY_KEY_SECRET) {
        toast.error("Live Razorpay Key ID & Secret are required");
        return;
      }
    }

    if (formData.RAZORPAY_PAYMENT_MODE === "test") {
      if (
        !formData.RAZORPAY_TEST_KEY_ID ||
        !formData.RAZORPAY_TEST_KEY_SECRET
      ) {
        toast.error("Test Razorpay Key ID & Secret are required");
        return;
      }
    }
    setLoading(true);
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-40">
        <form onSubmit={handleSubmit}>
          <div className="col-lg-12">
            <div className="border p-3 rounded mb-3">
              <p className="text-primary border-bottom">
                <strong>Contact Details</strong>
              </p>
              <div className="row">
                <div className="col-sm-6">
                  <div className="mb-20">
                    <label className="form-label">Contact Emails</label>
                    <textarea
                      className="form-control radius-8"
                      id="contact_email"
                      name="contact_email"
                      rows={3}
                      placeholder="email1@example.com, email2@example.com"
                      value={formData.contact_email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-20">
                    <label className="form-label">Contact Phone Number</label>
                    <textarea
                      className="form-control radius-8"
                      id="contact_phone"
                      rows={3}
                      name="contact_phone"
                      placeholder="Mobile 1, Mobile 2.."
                      value={formData.contact_phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="mb-20">
                    <label className="form-label">Office Address</label>
                    <textarea
                      className="form-control radius-8"
                      id="office_address"
                      name="office_address"
                      rows={3}
                      value={formData.office_address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-24">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sitesettings;
