"use client";

import { useSession } from "next-auth/react";
import { Icon } from "@iconify/react";

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="p-24">Loading...</div>;
  }

  if (!session) {
    return <div className="p-24">Unauthorized</div>;
  }

  const user = session.user;

  return (
    <div className="dashboard-main-body">
      {/* PAGE HEADER */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h4 className="mb-4">Employee Dashboard</h4>
          <p className="text-secondary-light mb-0">
            Welcome back, <strong>{user.name}</strong>
          </p>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="row gy-4">
        {/* PROFILE CARD */}
        <div className="col-xl-4 col-md-6">
          <div className="card radius-12">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-16">
                <span className="w-48-px h-48-px bg-primary-50 text-primary-main rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="solar:user-linear" className="text-xl" />
                </span>
                <div>
                  <h6 className="mb-1">{user.name}</h6>
                  <span className="text-secondary-light text-sm">Employee</span>
                </div>
              </div>

              <ul className="list-unstyled mb-0">
                <li className="mb-8">
                  <span className="text-secondary-light">Email:</span>
                  <span className="ms-2 fw-medium">{user.email}</span>
                </li>
                {user.phone && (
                  <li className="mb-8">
                    <span className="text-secondary-light">Phone:</span>
                    <span className="ms-2 fw-medium">{user.phone}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* STATUS CARD */}
        <div className="col-xl-4 col-md-6">
          <div className="card radius-12">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-16">
                <span className="w-48-px h-48-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="mdi:check-circle-outline" className="text-xl" />
                </span>
                <div>
                  <h6 className="mb-1">Account Status</h6>
                  <span className="text-secondary-light text-sm">Active</span>
                </div>
              </div>

              <p className="mb-0 text-secondary-light">
                Your account is active and in good standing.
              </p>
            </div>
          </div>
        </div>

        {/* ROLE / PERMISSIONS */}
        <div className="col-xl-4 col-md-12">
          <div className="card radius-12">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3 mb-16">
                <span className="w-48-px h-48-px bg-warning-subtle text-warning-main rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon="mdi:shield-account-outline" className="text-xl" />
                </span>
                <div>
                  <h6 className="mb-1">Role</h6>
                  <span className="text-secondary-light text-sm">
                    {user.role || "Employee"}
                  </span>
                </div>
              </div>

              <p className="mb-0 text-secondary-light">
                Access is limited to employee features only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
