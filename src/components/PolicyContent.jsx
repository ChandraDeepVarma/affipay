"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Import SunEditor dynamically (avoids SSR issues in Next.js)
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

const PolicyContent = () => {
  const [privacyContent, setPrivacyContent] = useState("");
  const [refundContent, setRefundContent] = useState("");
  const [disclaimerContent, setDisclaimerContent] = useState("");
  const [cookiesContent, setCookiesContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing content when component mounts
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch("/api/site-settings/all-policies");
        const data = await res.json();

        if (data.success) {
          setPrivacyContent(data.data.privacyPolicy || "");
          setRefundContent(data.data.refundPolicy || "");
          setCookiesContent(data.data.cookiesPolicy || "");
          setDisclaimerContent(data.data.disclaimer || "");
        }
      } catch (e) {
        console.error("Error fetching policies:", e);
      }
    };

    fetchPolicies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/site-settings/all-policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          privacyPolicy: privacyContent,
          refundPolicy: refundContent,
          cookiesPolicy: cookiesContent,
          disclaimer: disclaimerContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message || "Policies updated successfully");
        } else {
          toast.error(data.message || "Failed to update policies");
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update policies");
      }
    } catch (error) {
      console.error("Error updating policies:", error);
      toast.error("An error occurred while updating policies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-40">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Privacy Policy Content</strong>
                </p>

                {/* SunEditor */}
                <div className="mb-20">
                  {/* <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Privacy Policy Content
                  </label> */}
                  <SunEditor
                    setContents={privacyContent}
                    onChange={(content) => setPrivacyContent(content)}
                    height="300px"
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
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Refund Policy Content</strong>
                </p>

                {/* SunEditor */}
                <div className="mb-20">
                  {/* <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Privacy Policy Content
                  </label> */}
                  <SunEditor
                    setContents={refundContent}
                    onChange={(content) => setRefundContent(content)}
                    height="300px"
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
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Cookies Policy Content</strong>
                </p>

                {/* SunEditor */}
                <div className="mb-20">
                  {/* <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Privacy Policy Content
                  </label> */}
                  <SunEditor
                    setContents={cookiesContent}
                    onChange={(content) => setCookiesContent(content)}
                    height="300px"
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
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="border p-3 rounded mb-3">
                <p className="text-primary border-bottom">
                  <strong>Shipping & Delivery Policy Content</strong>
                </p>

                {/* SunEditor */}
                <div className="mb-20">
                  {/* <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Privacy Policy Content
                  </label> */}
                  <SunEditor
                    setContents={disclaimerContent}
                    onChange={(content) => setDisclaimerContent(content)}
                    height="300px"
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
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mt-24">
              <button
                type="submit"
                className="btn btn-primary border border-primary-600 text-md px-24 py-12 radius-8"
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

export default PolicyContent;
