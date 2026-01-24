"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

const AdManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Ads
  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ads");
      const data = await res.json();
      if (data.success) {
        setAds(data.ads);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          Swal.fire("Deleted!", "Ad has been deleted.", "success");
          fetchAds();
        } else {
          Swal.fire("Error", data.error || "Delete failed", "error");
        }
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Internal server error", "error");
      }
    }
  };

  const toggleStatus = async (ad) => {
    try {
      const res = await fetch(`/api/ads/${ad._id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setAds((prev) =>
          prev.map((a) =>
            a._id === ad._id ? { ...a, isActive: data.isActive } : a
          )
        );
        Swal.fire(
          "Success",
          `Ad ${data.isActive ? "activated" : "deactivated"}`,
          "success"
        );
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
        <Link
          href="/ad-management/create-ad"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <Icon icon="lucide:plus" /> Add New Ad
        </Link>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table bordered-table sm-table mb-0 text-center align-middle">
            <thead className="table-light text-uppercase small fw-bold">
              <tr>
                <th className="text-center">S.No</th>
                <th className="text-center">Title</th>
                <th className="text-center">Type</th>
                <th className="text-center">Placement</th>
                <th className="text-center">Status</th>
                <th className="text-center">Modified At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Loading...
                  </td>
                </tr>
              ) : ads.length > 0 ? (
                ads.map((ad, index) => (
                  <tr key={ad._id}>
                    <td>{index + 1}</td>
                    <td>{ad.title}</td>
                    <td>
                      <span
                        className={`badge px-3 py-4 ${
                          ad.type === "image_banner" ? "bg-info" : "bg-purple"
                        }`}
                      >
                        {ad.type === "image_banner"
                          ? "Image Banner"
                          : "Script Code"}
                      </span>
                    </td>
                    <td className="text-capitalize">{ad.placement}</td>
                    <td>
                      <span
                        className={`badge cursor-pointer ${
                          ad.isActive
                            ? "bg-success-focus text-success-600"
                            : "bg-danger-focus text-danger-600"
                        }`}
                        onClick={() => toggleStatus(ad)}
                        style={{ cursor: "pointer" }}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {ad.updatedAt
                        ? new Date(ad.updatedAt)
                            .toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                            .replace("am", "AM")
                            .replace("pm", "PM")
                        : "N/A"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link
                          href={`/ad-management/edit-ad/${ad._id}`}
                          className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        >
                          <Icon icon="lucide:edit" className="menu-icon" />
                        </Link>
                        <button
                          className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => handleDelete(ad._id)}
                        >
                          <Icon
                            icon="fluent:delete-24-regular"
                            className="menu-icon"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No ads found
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

export default AdManagement;
