"use client";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const FileUpload = dynamic(() => import("@/components/FileUpload/fileUpload"), {
  ssr: false,
});

const EditHomeSliderPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [image, setImage] = useState([]);
  const [formData, setFormData] = useState({
    displayOrder: "",
  });

  // Fetch existing home slider
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/home-sliders/gethomeslider/${id}`);
        console.log("Edit Home Slider Response ", res);
        if (!res.ok) throw new Error("Failed to fetch Home Slider");
        const data = await res.json();
        const slider = data.homeSlider;
        console.log("Edit Home Slider data", slider);

        setFormData({
          displayOrder: slider.displayOrder || "",
        });
        // Handle image
        const img = slider.image;

        if (img && typeof img === "object" && img.url) {
          setImage([
            {
              name: img.name || "image",
              url: img.url,
            },
          ]);
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load Home Slider", "error");
      }
    })();
  }, [id]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const f = new FormData();
      f.append("id", id);
      f.append("displayOrder", String(Number(formData.displayOrder || 0)));

      // Send S3 image URL & name instead of actual file
      if (image[0]?.name && image[0]?.url) {
        // treat as current/new image
        f.append("imageUrl", image[0].url);
        f.append("imageName", image[0].name);
      } else if (image[0]?.url) {
        // fallback if only URL present
        f.append("existingImageUrl", image[0].url);
      }

      const res = await fetch("/api/home-sliders/updateslider", {
        method: "PUT",
        body: f,
      });

      const out = await res.json();
      if (!res.ok) throw new Error(out?.error || "Update failed");

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Home Slider updated successfully!",
        timer: 1800,
        showConfirmButton: false,
      });

      router.push("/home-sliders");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Unexpected error", "error");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Edit Home Slider" />
      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              {/* Image Upload */}
              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <FileUpload
                    accept=".jpg,.png,.jpeg"
                    label="Home Slider Image"
                    maxFileSizeInBytes={2000000}
                    updateFilesCb={setImage}
                    preSelectedFiles={image}
                  />
                  {image[0]?.url && (
                    <div className="mt-2">
                      <small>Current Image:</small>
                      <img
                        src={`${image[0].url}?t=${Date.now()}`}
                        alt="Home Slider"
                        style={{ width: 120, height: "auto", borderRadius: 8 }}
                      />
                    </div>
                  )}
                </Form.Group>
              </div>

              {/* Display Order */}
              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4 gap-4">
              <Button
                type="button"
                className="btn btn-secondary px-5 py-3 radius-8"
                onClick={() => router.push("/home-sliders")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn btn-primary px-5 py-3 radius-8"
                disabled={!formData.displayOrder}
              >
                Update
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EditHomeSliderPage;
