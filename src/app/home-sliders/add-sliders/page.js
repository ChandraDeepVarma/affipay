"use client";
import { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

const FileUpload = dynamic(() => import("@/components/FileUpload/fileUpload"), {
  ssr: false,
});

const CreateHomeSliderPage = () => {
  const router = useRouter();
  const [image, setImage] = useState([]); // Keep using array of images
  const [formData, setFormData] = useState({
    displayOrder: "",
  });
  const fileInputRef = useRef(null);
  const [resetTrigger, setResetTrigger] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const f = new FormData();
      f.append("displayOrder", String(Number(formData.displayOrder || 0)));

      // Handle single image object (take the first one if exists)
      if (image.length > 0 && image[0]?.name && image[0]?.url) {
        f.append("imageUrl", image[0].url);
        f.append("imageName", image[0].name);
      }

      const res = await fetch("/api/home-sliders/createslider", {
        method: "POST",
        body: f,
      });
      console.log("Create Home Slider Page Response", res);

      const out = await res.json();
      console.log("Create Home Slider Page Data", out);
      if (!res.ok)
        throw new Error(out?.error || "Failed to create Home Slider");

      setFormData({
        displayOrder: "",
      });
      setImage([]);
      setResetTrigger(true);
      setTimeout(() => setResetTrigger(false), 200); // allow future resets

      Swal.fire({
        icon: "success",
        title: "Created",
        text: "Home Slider created successfully!",
        timer: 1800,
        showConfirmButton: false,
      });

      router.push("/home-sliders");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Unexpected error occurred", "error");
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Add Home Slider Details" />
      <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              {/* Image Upload */}
              <div className="col-sm-12">
                <Form.Group className="mb-3">
                  <FileUpload
                    ref={fileInputRef}
                    accept=".jpg,.png,.jpeg"
                    label="Home Slider Image"
                    maxFileSizeInBytes={2000000}
                    updateFilesCb={setImage}
                    resetTrigger={resetTrigger}
                  />
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
                Create
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default CreateHomeSliderPage;
