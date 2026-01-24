"use client";

import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const AdForm = ({ editMode = false, adData = null }) => {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("image_banner"); // image_banner or script_code
  const [placement, setPlacement] = useState("top"); // top, left, right
  const [imageUrl, setImageUrl] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [scriptCode, setScriptCode] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (editMode && adData) {
      setTitle(adData.title || "");
      setType(adData.type || "image_banner");
      setPlacement(adData.placement || "top");
      setImageUrl(adData.imageUrl || "");
      setWebsiteLink(adData.websiteLink || "");
      setScriptCode(adData.scriptCode || "");
    }
  }, [editMode, adData]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "File size too large. Max 5MB allowed.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setIsUploading(true);
    reader.onload = () => {
      setImageUrl(reader.result);
      setIsUploading(false);
      Swal.fire("Success", "Banner preview generated", "success");
    };
    reader.onerror = () => {
      Swal.fire("Error", "Failed to read file", "error");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !type || !placement) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    if (type === "image_banner" && !imageUrl) {
      Swal.fire("Warning", "Please upload a banner image", "warning");
      return;
    }

    if (type === "script_code" && !scriptCode) {
      Swal.fire("Warning", "Please enter the script code", "warning");
      return;
    }

    const payload = {
      title,
      type,
      placement,
      imageUrl: type === "image_banner" ? imageUrl : "",
      websiteLink: type === "image_banner" ? websiteLink : "",
      scriptCode: type === "script_code" ? scriptCode : "",
    };

    try {
      const url = editMode ? `/api/ads/${adData._id}` : "/api/ads";
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        Swal.fire(
          "Success",
          `Ad ${editMode ? "updated" : "created"} successfully`,
          "success"
        );
        router.push("/ad-management");
      } else {
        Swal.fire("Error", data.error || "Operation failed", "error");
      }
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire("Error", "Internal server error", "error");
    }
  };

  const handleCancel = () => {
    router.push("/ad-management");
  };

  return (
    <div className="card h-100 p-0 radius-12 overflow-hidden">
      <div className="card-body p-40">
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold fs-14">Ad Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. Summer Promotion Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-light-50 border-secondary-10"
              required
            />
          </Form.Group>

          <div className="mt-3">
            <Form.Label className="fw-bold fs-14 text-uppercase">
              Ad Type
            </Form.Label>
            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className={`card cursor-pointer p-3 border-2 h-100 ${
                    type === "image_banner"
                      ? "border-primary bg-primary-50"
                      : "border-secondary-10"
                  }`}
                  onClick={() => setType("image_banner")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`p-2 rounded-2 ${
                        type === "image_banner"
                          ? "bg-primary text-white"
                          : "bg-light text-muted"
                      }`}
                    >
                      <Icon icon="lucide:image" size={24} />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Image Banner</h6>
                      <small className="text-muted">
                        Upload an image file (JPG, PNG)
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className={`card cursor-pointer p-3 border-2 h-100 ${
                    type === "script_code"
                      ? "border-primary bg-primary-50"
                      : "border-secondary-10"
                  }`}
                  onClick={() => setType("script_code")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`p-2 rounded-2 ${
                        type === "script_code"
                          ? "bg-primary text-white"
                          : "bg-light text-muted"
                      }`}
                    >
                      <Icon icon="lucide:code" size={24} />
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">Script Code</h6>
                      <small className="text-muted">
                        Paste HTML/JS ad code directly
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-secondary-10" />

          <div className="mt-3">
            <Form.Label className="fw-bold fs-14">Ad Placement</Form.Label>
            <div className="d-flex gap-4">
              <Form.Check
                type="radio"
                label="Top (1000 x 150)"
                name="placement"
                id="placement-top"
                checked={placement === "top"}
                onChange={() => setPlacement("top")}
              />
              <Form.Check
                type="radio"
                label="Left (720 x 250)"
                name="placement"
                id="placement-left"
                checked={placement === "left"}
                onChange={() => setPlacement("left")}
              />
              <Form.Check
                type="radio"
                label="Right (720 x 250)"
                name="placement"
                id="placement-right"
                checked={placement === "right"}
                onChange={() => setPlacement("right")}
              />
            </div>
          </div>

          {type === "image_banner" ? (
            <>
              <Form.Group className="mt-3">
                <Form.Label className="fw-bold fs-14">Choose Banner</Form.Label>
                <div className="border-2 border-dashed border-secondary-20 rounded-3 p-4 text-center bg-light-50 position-relative">
                  {imageUrl ? (
                    <div className="position-relative d-inline-block">
                      <img
                        src={imageUrl}
                        alt="Banner Preview"
                        className="img-fluid rounded-2"
                        style={{ maxHeight: "150px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle p-1"
                        onClick={() => setImageUrl("")}
                      >
                        <Icon icon="lucide:x" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Icon
                        icon="lucide:upload-cloud"
                        className="fs-1 text-muted mb-2"
                      />
                      <p className="mb-1 fw-medium text-primary cursor-pointer">
                        Upload a file{" "}
                        <span className="text-muted fw-normal">
                          or drag and drop
                        </span>
                      </p>
                      <small className="text-muted">
                        PNG, JPG, GIF up to 5MB
                      </small>
                      <input
                        type="file"
                        className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </>
                  )}
                  {isUploading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-3">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="fw-bold fs-14">Website Link</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://www.example.com"
                  value={websiteLink}
                  onChange={(e) => setWebsiteLink(e.target.value)}
                  className="bg-light-50 border-secondary-10"
                />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold fs-14">
                Script Entry Field
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="<script>...</script>"
                value={scriptCode}
                onChange={(e) => setScriptCode(e.target.value)}
                className="bg-light-50 border-secondary-10 font-monospace"
              />
              <small className="text-muted">
                Paste the full advertisement script provided by the ad network.
              </small>
            </Form.Group>
          )}

          <div className="d-flex justify-content-end mt-5">
            <Button
              type="button"
              variant="outline-secondary"
              className="px-5 py-3 radius-8 me-3"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-5 py-3 radius-8"
              disabled={isUploading}
            >
              <Icon icon="lucide:save" className="m-1" />{" "}
              {editMode ? "Update Ad" : "Save Ad"}
            </Button>
          </div>
        </Form>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .bg-primary-50 {
          background-color: rgba(13, 110, 253, 0.05);
        }
        .bg-light-50 {
          background-color: #f8f9fa;
        }
        .border-secondary-10 {
          border-color: rgba(0, 0, 0, 0.1);
        }
        .border-secondary-20 {
          border-color: rgba(0, 0, 0, 0.2);
        }
        .border-dashed {
          border-style: dashed;
        }
        .fs-14 {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default AdForm;
