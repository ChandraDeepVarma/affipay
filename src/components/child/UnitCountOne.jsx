// src/components/child/UnitCountOne.jsx
"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useUserStatus } from "@/context/UserStatusContext";
const UnitCountOne = () => {
  const { refreshFlag } = useUserStatus();

  const [counts, setCounts] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    deletedUsers: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const res = await fetch("/api/users/userstatus");
      console.log("Response of Stastics : ", res);
      const data = await res.json();
      console.log("Data of Stastics : ", data);
      setCounts(data);
    };

    fetchCounts();
  }, [refreshFlag]); // refresh when flag changes
  return (
    <div className="row row-cols-xxxl-4 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-1 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">Total Users</p>
                <h6 className="mb-0">{counts.totalUsers.toLocaleString()}</h6>
              </div>
              <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="gridicons:multiple-users"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
                            <span className="d-inline-flex align-items-center gap-1 text-success-main">
                                <Icon icon="bxs:up-arrow" className="text-xs" /> +5000
                            </span>
                            Last 30 days users
                        </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-4 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Active Users
                </p>
                <h6 className="mb-0">{counts.activeUsers.toLocaleString()}</h6>
              </div>
              <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="gridicons:multiple-users"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="text-xs" /> +1000
              </span>
              Last 30 days users
            </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-2 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Inactive Users
                </p>
                <h6 className="mb-0">
                  {counts.inactiveUsers.toLocaleString()}
                </h6>
              </div>
              <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="gridicons:multiple-users"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="text-xs" /> +100
              </span>
              Last 30 days users
            </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-5 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Deleted Users
                </p>
                <h6 className="mb-0">{counts.deletedUsers.toLocaleString()}</h6>
              </div>
              <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="gridicons:multiple-users"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="text-xs" /> +100
              </span>
              Last 30 days users
            </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-2 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Total Subscriptions
                </p>
                <h6 className="mb-0">
                  {counts.totalSubscriptions.toLocaleString()}
                </h6>
              </div>
              <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="fa-solid:award"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="text-xs" /> +800
              </span>
              Last 30 days subscription
            </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
      <div className="col">
        <div className="card shadow-none border bg-gradient-start-3 h-100">
          <div className="card-body p-20">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <p className="fw-medium text-primary-light mb-1">
                  Active Subscriptions
                </p>
                <h6 className="mb-0">
                  {counts.activeSubscriptions.toLocaleString()}
                </h6>
              </div>
              <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
                <Icon
                  icon="fa-solid:award"
                  className="text-white text-2xl mb-0"
                />
              </div>
            </div>
            {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
              <span className="d-inline-flex align-items-center gap-1 text-success-main">
                <Icon icon="bxs:up-arrow" className="text-xs" /> +200
              </span>
              Last 30 days users
            </p> */}
          </div>
        </div>
        {/* card end */}
      </div>
    </div>
  );
};

export default UnitCountOne;
