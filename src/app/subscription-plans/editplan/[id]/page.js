"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
// Import SunEditor dynamically to avoid SSR issues in Next.js
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

export default function EditPlan({ params }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    earningType: "limited",
    captchaPerDay: "",
    minimumEarningPerDay: "",
    referralPerLogin: "",
    manualPaymentQrCode: "",
    manualPaymentInstructions: "",
  });

  const [slabs, setSlabs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [settingsData, setSettingsData] = useState({});

  // 🔥 Fetch existing plan
  const fetchPlan = async () => {
    try {
      const res = await fetch(`/api/plans/get/${id}`);
      const out = await res.json();
      if (!res.ok) throw new Error(out.error);

      setFormData({
        planName: out.data.planName,
        price: out.data.price,
        earningType: out.data.earningType,
        captchaPerDay: out.data.captchaPerDay,
        minimumEarningPerDay: out.data.minimumEarningPerDay,
        referralPerLogin: out.data.referralPerLogin,
        manualPaymentQrCode: out.data.manualPaymentQrCode || "",
        manualPaymentInstructions: out.data.manualPaymentInstructions || "",
      });

      setSlabs(out.data.slabs);
      setReferrals(out.data.referrals);

      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
      router.push("/plans");
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  // -----------------------
  // 🔧 HANDLERS
  // -----------------------
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsRes = await fetch("/api/site-settings");
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setSettingsData(settingsData.settings);

        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // SLABS
  const addSlab = () => setSlabs([...slabs, { from: "", to: "", reward: "" }]);

  const removeSlab = (i) => setSlabs(slabs.filter((_, index) => index !== i));

  const updateSlab = (i, field, val) => {
    const updated = [...slabs];
    updated[i][field] = val;
    setSlabs(updated);
  };

  // REFERRALS
  const addReferral = () =>
    setReferrals([...referrals, { count: "", amount: "", gift: "" }]);

  const removeReferral = (i) =>
    setReferrals(referrals.filter((_, index) => index !== i));

  const updateReferral = (i, field, val) => {
    const updated = [...referrals];
    updated[i][field] = val;
    setReferrals(updated);
  };

  // -----------------------
  // 🔥 SUBMIT UPDATE
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CONDITIONAL VALIDATION
    if (
      settingsData.buyButtonMode === "manual" &&
      (!formData.manualPaymentQrCode || !formData.manualPaymentInstructions)
    ) {
      Swal.fire(
        "Validation Error",
        "Manual payment QR Code and instructions are required in Manual mode.",
        "warning"
      );
      return;
    }


    try {
      const payload = { ...formData, slabs, referrals };

      const res = await fetch(`/api/plans/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional size check (500KB)
    if (file.size > 500 * 1024) {
      Swal.fire("Error", "QR image must be below 500KB", "error");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        manualPaymentQrCode: reader.result, // base64
      }));
    };

    reader.readAsDataURL(file);
  };


  if (loading)
    return (
      <MasterLayout>
        <div className="p-5 text-center">
          <h4>Loading...</h4>
        </div>
      </MasterLayout>
    );

  return (
    <MasterLayout>
      <Breadcrumb title="Edit Subscription Plan" />

      <div className="card radius-12 overflow-hidden">
        <div className="card-body p-40">

          <h5><mark>Note : Your current settings of Buy Button Mode is "<b>{settingsData.buyButtonMode}</b>"</mark></h5>
          <hr />

          <Form onSubmit={handleSubmit}>
            {/* BASIC INFORMATION */}
            <h4 className="mb-3">Plan Information</h4>

            <div className="row">
              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Plan Name</Form.Label>
                  <Form.Control
                    name="planName"
                    value={formData.planName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
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

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Earning Type</Form.Label>
                  <Form.Select
                    name="earningType"
                    value={formData.earningType}
                    onChange={handleChange}
                  >
                    <option value="limited">Limited</option>
                    <option value="unlimited">Unlimited</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Captcha Per Day</Form.Label>
                  <Form.Control
                    type="number"
                    name="captchaPerDay"
                    value={formData.captchaPerDay}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Earning Per Day (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="minimumEarningPerDay"
                    value={formData.minimumEarningPerDay}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-sm-6">
                <Form.Group className="mb-3">
                  <Form.Label>Referral Earning Per Login (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="referralPerLogin"
                    value={formData.referralPerLogin}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>


            <div className="row">
              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Manual Payment QR Code{" "}
                    {settingsData.buyButtonMode === "manual" && (
                      <span className="text-danger">*</span>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleQrUpload}
                    required={settingsData.buyButtonMode === "manual" && !formData.manualPaymentQrCode}
                    disabled={settingsData.buyButtonMode !== "manual"}
                  />
                  {formData.manualPaymentQrCode && (
                    <div className="mt-3">
                      <small className="text-muted">Current QR Code:</small>
                      <br />
                      <img
                        src={formData.manualPaymentQrCode}
                        alt="QR Code"
                        style={{
                          width: 180,
                          border: "1px solid #ddd",
                          padding: 5,
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>
                    Manual Payment Instructions{" "}
                    {settingsData.buyButtonMode === "manual" && (
                      <span className="text-danger">*</span>
                    )}
                  </Form.Label>

                  <SunEditor
                    setContents={formData.manualPaymentInstructions}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        manualPaymentInstructions: content,
                      }))
                    }
                    height="300px"
                    disable={settingsData.buyButtonMode !== "manual"}
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["bold", "underline", "italic", "strike"],
                        ["font", "fontSize"],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "table"],
                        ["link", "image", "video"],
                        ["removeFormat"],
                      ],
                    }}
                  />
                </Form.Group>
              </div>
            </div>


            {/* SLABS */}
            <h4 className="mt-4 mb-3">Captcha Slabs</h4>
            <div className="row mb-2" key="header">
              <div className="col-sm-3">
                <b>From</b>
              </div>
              <div className="col-sm-3">
                <b>To</b>
              </div>
              <div className="col-sm-4">
                <b>Reward (₹)</b>
              </div>
              <div className="col-sm-2 d-flex align-items-center">
                <b>Action</b>
              </div>
            </div>
            {slabs.map((slab, i) => (
              <div className="row mb-2" key={i}>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="From"
                    value={slab.from}
                    onChange={(e) => updateSlab(i, "from", e.target.value)}
                  />
                </div>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="To"
                    value={slab.to}
                    onChange={(e) => updateSlab(i, "to", e.target.value)}
                  />
                </div>
                <div className="col-sm-4">
                  <Form.Control
                    type="number"
                    placeholder="Reward (₹)"
                    value={slab.reward}
                    onChange={(e) => updateSlab(i, "reward", e.target.value)}
                  />
                </div>
                <div className="col-sm-2 d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => removeSlab(i)}
                    disabled={slabs.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="secondary" onClick={addSlab} className="mb-4">
              + Add Slab
            </Button>

            {/* REFERRALS */}
            <h4 className="mt-4 mb-3">Referral Benefits (Additionaly we are giving as bonus)</h4>

            <div className="row mb-2" key="header">
              <div className="col-sm-3">
                <b>Bonus for X referrals</b>
              </div>

              <div className="col-sm-3">
                <b>Amount (₹)</b>
              </div>

              <div className="col-sm-4">
                <b>Gift (Only time will be given)</b>
              </div>

              <div className="col-sm-2 d-flex align-items-center">
                <b>Action</b>
              </div>
            </div>

            {referrals.map((ref, i) => (
              <div className="row mb-2" key={i}>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="Every X referrals"
                    value={ref.count}
                    onChange={(e) => updateReferral(i, "count", e.target.value)}
                  />
                </div>

                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="Amount (₹)"
                    value={ref.amount}
                    onChange={(e) =>
                      updateReferral(i, "amount", e.target.value)
                    }
                  />
                </div>

                <div className="col-sm-4">
                  <Form.Control
                    placeholder="Gift"
                    value={ref.gift}
                    onChange={(e) => updateReferral(i, "gift", e.target.value)}
                  />
                </div>

                <div className="col-sm-2 d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => removeReferral(i)}
                    disabled={referrals.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="secondary" onClick={addReferral} className="mb-4">
              + Add Referral Rule
            </Button>

            {/* ACTION BUTTONS */}
            <div className="d-flex justify-content-center mt-4 gap-4">
              <Button
                type="button"
                className="btn btn-secondary px-5 py-3 radius-8"
                onClick={() => router.push("/subscription-plans")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="btn btn-primary px-5 py-3 radius-8"
              >
                Update Plan
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
}
