"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const HomeSlidersPage = () => {
  const [homeSliders, setHomeSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch home sliders on mount
  useEffect(() => {
    const fetchHomeSliders = async () => {
      try {
        const res = await fetch("/api/home-sliders/homesliders");
        console.log("Fetch Home Sliders Response: ", res);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetch Home Sliders Data: ", data);
          setHomeSliders(data.homeSliders || []);
          setLoading(false);
        } else {
          console.error("Failed to fetch home sliders");
        }
      } catch (err) {
        console.error("Error fetching home sliders:", err);
      }
    };
    fetchHomeSliders();
  }, []);

  const handleAddProvider = () => {
    router.push("/home-sliders/add-sliders");
  };

  const handleEdit = (id) => {
    router.push(`/home-sliders/edit-sliders/${id}`);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This home slider will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/home-sliders/deleteslider?id=${id}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            const data = await res.json();
            Swal.fire("Error", data.error || "Failed to delete", "error");
            return;
          }

          setHomeSliders((prev) => prev.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Home Slider has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Something went wrong!", "error");
        }
      }
    });
  };

  if (loading) {
    return <div className="text-center py-24">Loading...</div>;
  }

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddProvider}
        >
          Add Home Slider
        </button>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0 text-center align-middle">
            <thead>
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Image</th>
                <th className="text-center">Display Order</th>
                <th className="text-center">Modified At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {homeSliders.length > 0 ? (
                homeSliders.map((homeSlider, index) => {
                  const img = homeSlider.image || null;

                  return (
                    <tr key={homeSlider._id}>
                      <td>{index + 1}</td>

                      <td>
                        {img?.url ? (
                          <img
                            src={`${img.url}?t=${Date.now()}`}
                            alt={img.name}
                            width="80"
                            height="80"
                            style={{ borderRadius: "6px", objectFit: "cover" }}
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </td>

                      <td>{homeSlider.displayOrder ?? "N/A"}</td>

                      <td>
                        {homeSlider.updatedAt
                          ? new Date(homeSlider.updatedAt).toLocaleString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : "N/A"}
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="px-10 py-2 radius-4 fw-medium text-xs border bg-success-100 text-success-700 border-success-400"
                            onClick={() => handleEdit(homeSlider._id)}
                          >
                            Edit
                          </button>

                          <button
                            className="px-10 py-2 radius-4 fw-medium text-xs border bg-danger-100 text-danger-700 border-danger-400"
                            onClick={() => handleDelete(homeSlider._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No Home Sliders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeSlidersPage;
