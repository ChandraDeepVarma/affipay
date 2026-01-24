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
      if (!formData.RAZORPAY_TEST_KEY_ID || !formData.RAZORPAY_TEST_KEY_SECRET) {
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

            {/* SMTP Section */}
            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>SMTP Details</strong>
                </p>
                <div className="row">
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">SMTP Host</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="smtpHost"
                      value={formData.smtpHost}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">SMTP Username</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="smtpUser"
                      value={formData.smtpUser}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">SMTP Password</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="smtpPass"
                      value={formData.smtpPass}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">SMTP Port</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="smtpPort"
                      value={formData.smtpPort}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Youtube Link</strong>
                </p>
                <div className="row">
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">Youtube Url</label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Withdrawal Settings</strong>
                </p>
                <div className="row">
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">
                      Minimum Withdrawal Limit
                    </label>
                    <input
                      type="number"
                      className="form-control radius-8"
                      id="minWithdrawalLimit"
                      value={formData.minWithdrawalLimit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Login OTP Mode Settings</strong>
                </p>
                <div className="row">
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">
                      OTP Mode
                    </label>
                    <select
                      className="form-control radius-8"
                      id="otpMode"
                      value={formData.otpMode}
                      onChange={handleChange}
                    >
                      <option value="static">Static (123456)</option>
                      <option value="dynamic">Dynamic (Random)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Subscription Buy Button Settings</strong>
                </p>
                <div className="row">
                  <div className="col-sm-6 mb-20">
                    <label className="form-label">
                      Buy Button Mode
                    </label>
                    <select
                      className="form-control radius-8"
                      id="buyButtonMode"
                      value={formData.buyButtonMode}
                      onChange={handleChange}
                    >
                      <option value="gateway">Connect to Payment Gateway</option>
                      <option value="manual">Manual Request After Payment</option>
                    </select>
                  </div>
                  {formData.buyButtonMode === "manual" && (
                    <div className="col-sm-6 mb-20">
                      <label className="form-label">
                        UTR Verification Mode for QR Payments
                      </label>
                      <select
                        className="form-control radius-8"
                        id="qrPaymentVerficationMode"
                        value={formData.qrPaymentVerficationMode}
                        onChange={handleChange}
                      >
                        <option value="manual">Manually By Admin</option>
                        <option value="auto">Auto By System</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Razor Payment Gateway Settings</strong>
                </p>
                <div className="row">
                  <div className="col-sm-12 mb-20">
                    <label className="form-label">
                      Razorpay Payment Mode
                    </label>
                    <select
                      className="form-control radius-8"
                      id="RAZORPAY_PAYMENT_MODE"
                      value={formData.RAZORPAY_PAYMENT_MODE}
                      onChange={handleChange}
                    >
                      <option value="live">Live</option>
                      <option value="test">Test</option>
                    </select>
                  </div>

                  {formData.RAZORPAY_PAYMENT_MODE === "live" && (
                    <>
                      <div className="col-sm-6 mb-20">
                        <label className="form-label">Razorpay Live Key ID *</label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="RAZORPAY_KEY_ID"
                          value={formData.RAZORPAY_KEY_ID}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-sm-6 mb-20">
                        <label className="form-label">Razorpay Live Key Secret *</label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="RAZORPAY_KEY_SECRET"
                          value={formData.RAZORPAY_KEY_SECRET}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}


                  {formData.RAZORPAY_PAYMENT_MODE === "test" && (
                    <>
                      <div className="col-sm-6 mb-20">
                        <label className="form-label">Razorpay Test Key ID *</label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="RAZORPAY_TEST_KEY_ID"
                          value={formData.RAZORPAY_TEST_KEY_ID}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-sm-6 mb-20">
                        <label className="form-label">Razorpay Test Key Secret *</label>
                        <input
                          type="text"
                          className="form-control radius-8"
                          id="RAZORPAY_TEST_KEY_SECRET"
                          value={formData.RAZORPAY_TEST_KEY_SECRET}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

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
