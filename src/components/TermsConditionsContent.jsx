"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Import SunEditor dynamically to avoid SSR issues in Next.js
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

const TermsConditionsContent = () => {
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing content
  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        const response = await fetch("/api/site-settings/terms-conditions");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.termsConditions) {
            setTermsContent(data.termsConditions);
          }
        }
      } catch (error) {
        console.error("Error fetching Terms & Conditions content:", error);
      }
    };

    fetchTermsContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/site-settings/terms-conditions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ termsConditions: termsContent }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message || "Terms & Conditions content updated successfully");
        } else {
          toast.error(data.message || "Failed to update Terms & Conditions content");
        }
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update Terms & Conditions content");
      }
    } catch (error) {
      console.error("Error updating Terms & Conditions content:", error);
      toast.error("An error occurred while updating Terms & Conditions content");
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
                  <strong>Terms & Conditions Content</strong>
                </p>

                {/* SunEditor */}
                <div className="mb-20">
                  {/* <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                    Terms & Conditions Content
                  </label> */}
                  <SunEditor
                    setContents={termsContent}
                    onChange={(content) => setTermsContent(content)}
                    height="300px"
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["bold", "underline", "italic", "strike"],
                        ["font", "fontSize"],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "table"],
                        ["link", "image", "video"],
                        ["removeFormat"]
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

export default TermsConditionsContent;
