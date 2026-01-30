"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState({});
  const router = useRouter();

  // FETCH PLANS
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans/list");
        const data = await res.json();

        if (res.ok) {
          setPlans(data.plans || []);
          setLoading(false);
        } else {
          Swal.fire("Error", data.error || "Failed to fetch plans", "error");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        Swal.fire("Error", "Unable to load plans", "error");
      }
    };
    fetchPlans();
  }, []);

  // NAVIGATION HANDLERS
  const handleAddPlan = () => {
    router.push("/subscription-plans/addplan");
  };

  const handleEdit = (id) => {
    router.push(`/subscription-plans/editplan/${id}`);
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

  // DELETE PLAN
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This plan will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await fetch(`/api/plans/delete/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          Swal.fire("Error", data.error || "Failed to delete plan", "error");
          return;
        }

        setPlans((prev) => prev.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Plan has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/plans/toggle-status/${id}`, {
        method: "PATCH",
      });

      const out = await res.json();
      if (!res.ok) {
        Swal.fire("Error", out.error || "Failed to update status", "error");
        return;
      }

      setPlans((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: out.isActive } : p)),
      );

      Swal.fire({
        icon: "success",
        title: out.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  if (loading)
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <>
      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddPlan}
          >
            Add Plan
          </button>
        </div>

        {/* <h5>
          <mark>
            Note : Your current settings of Buy Button Mode is "
            <b>{settingsData.buyButtonMode}</b>"
          </mark>
        </h5> */}
        <hr />
        <div className="card-body p-24">
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <thead>
                <tr>
                  <th className="text-center">S.No</th>
                  <th>Plan Name</th>
                  <th className="text-center">Price (₹)</th>
                  <th className="text-center">Validity</th>
                  <th>Benefits</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Last Updated</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No plans found
                    </td>
                  </tr>
                ) : (
                  plans.map(
                    (plan, index) => (
                      console.log(plan._id, plan.validityDays),
                      (
                        <tr key={plan._id} style={{ verticalAlign: "top" }}>
                          {/* S.No */}
                          <td className="text-center">{index + 1}</td>
                          {/* Plan Name */}
                          <td>
                            <div className="fw-semibold">{plan.planName}</div>
                          </td>
                          {/* Price */}
                          <td className="text-center">₹{plan.price}</td>
                          {/* Validity */}
                          <td className="text-center">
                            {plan.validityDays} days
                          </td>
                          {/* Benefits */}
                          <td>
                            {plan.benefits && plan.benefits.length > 0 ? (
                              <ul className="mb-0 ps-3">
                                {plan.benefits.slice(0, 3).map((b, i) => (
                                  <li key={i} className="text-sm">
                                    {b}
                                  </li>
                                ))}
                                {plan.benefits.length > 3 && (
                                  <li className="text-muted text-xs">
                                    +{plan.benefits.length - 3} more
                                  </li>
                                )}
                              </ul>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          {/* Status */}
                          <td className="text-center">
                            <span
                              className={`px-8 py-1 radius-4 fw-medium text-xs border ${
                                plan.isActive
                                  ? "bg-success-100 text-success-700 border-success-400"
                                  : "bg-danger-100 text-danger-700 border-danger-400"
                              }`}
                            >
                              {plan.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          {/* Created At
                      <td className="text-center">
                        {plan.createdAt
                          ? new Date(plan.createdAt).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "N/A"}
                      </td> */}
                          {/* Updated At */}
                          <td className="text-center">
                            {plan.updatedAt
                              ? new Date(plan.updatedAt).toLocaleString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )
                              : "N/A"}
                          </td>
                          {/* Actions */}
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              {/* EDIT */}
                              <button
                                className="px-10 py-2 radius-4 fw-medium text-xs border bg-success-100 text-success-700 border-success-400"
                                onClick={() => handleEdit(plan._id)}
                              >
                                Edit
                              </button>

                              {/* TOGGLE STATUS */}
                              <button
                                className={`px-10 py-2 radius-4 fw-medium text-xs border ${
                                  plan.isActive
                                    ? "bg-warning-100 text-warning-700 border-warning-400"
                                    : "bg-info-100 text-info-700 border-info-400"
                                }`}
                                onClick={() =>
                                  handleToggleStatus(plan._id, plan.isActive)
                                }
                              >
                                {plan.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlansList;
