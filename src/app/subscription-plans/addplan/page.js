"use client";
import dynamic from "next/dynamic";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
// Import SunEditor dynamically to avoid SSR issues in Next.js
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

const CreatePlan = () => {
  const router = useRouter();

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

  const [settingsData, setSettingsData] = useState({});

  // ⭐ DYNAMIC CAPTCHA SLABS
  const [slabs, setSlabs] = useState([{ from: "", to: "", reward: "" }]);

  const addSlab = () => {
    setSlabs([...slabs, { from: "", to: "", reward: "" }]);
  };

  const removeSlab = (index) => {
    setSlabs(slabs.filter((_, i) => i !== index));
  };

  const updateSlab = (index, field, value) => {
    const updated = [...slabs];
    updated[index][field] = value;
    setSlabs(updated);
  };

  // ⭐ DYNAMIC REFERRAL RULES
  const [referrals, setReferrals] = useState([
    { count: "", amount: "", gift: "" },
  ]);

  const addReferral = () => {
    setReferrals([...referrals, { count: "", amount: "", gift: "" }]);
  };

  const removeReferral = (index) => {
    setReferrals(referrals.filter((_, i) => i !== index));
  };

  const updateReferral = (index, field, value) => {
    const updated = [...referrals];
    updated[index][field] = value;
    setReferrals(updated);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  // ⭐ SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      settingsData.buyButtonMode === "manual" &&
      (!formData.manualPaymentQrCode || !formData.manualPaymentInstructions)
    ) {
      Swal.fire(
        "Validation Error",
        "Manual payment link and instructions are required in Manual mode.",
        "warning"
      );
      return;
    }


    try {
      const payload = {
        ...formData,
        slabs,
        referrals,
      };

      const res = await fetch("/api/plans/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Error creating plan");

      Swal.fire({
        icon: "success",
        title: "Plan Created",
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

    if (file.size > 500 * 1024) {
      Swal.fire("Error", "QR image must be below 500KB", "error");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        manualPaymentQrCode: reader.result, // base64 string
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Create Subscription Plan" />
      <div className="card radius-12 overflow-hidden">
        <div className="card-body p-40">

          <h5><mark>Note : Your current settings of Buy Button Mode is "<b>{settingsData.buyButtonMode}</b>"</mark></h5>
          <hr />
          <Form onSubmit={handleSubmit}>
            {/* BASIC DETAILS */}
            <h4 className="mb-3">Plan Details</h4>
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
                    required={settingsData.buyButtonMode === "manual"}
                    disabled={settingsData.buyButtonMode !== "manual"}
                  />
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


            {/* CAPTCHA SLABS */}
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

            {slabs.map((s, i) => (
              <div className="row mb-2" key={i}>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="From"
                    value={s.from}
                    onChange={(e) => updateSlab(i, "from", e.target.value)}
                  />
                </div>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="To"
                    value={s.to}
                    onChange={(e) => updateSlab(i, "to", e.target.value)}
                  />
                </div>
                <div className="col-sm-4">
                  <Form.Control
                    type="number"
                    placeholder="Reward (₹)"
                    value={s.reward}
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
              + Add More Slab
            </Button>

            {/* REFERRAL RULES */}
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
            {referrals.map((r, i) => (
              <div className="row mb-2" key={i}>
                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="Every X referrals"
                    value={r.count}
                    onChange={(e) => updateReferral(i, "count", e.target.value)}
                  />
                </div>

                <div className="col-sm-3">
                  <Form.Control
                    type="number"
                    placeholder="Amount (₹)"
                    value={r.amount}
                    onChange={(e) =>
                      updateReferral(i, "amount", e.target.value)
                    }
                  />
                </div>

                <div className="col-sm-4">
                  <Form.Control
                    placeholder="Gift (Cap, T-shirt, etc)"
                    value={r.gift}
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
              + Add More Referral Rule
            </Button>

            {/* SUBMIT BUTTON */}
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
                Create Plan
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default CreatePlan;
