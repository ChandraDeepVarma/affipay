// // src/components/child/UnitCountOne.jsx

"use client";

import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Icon } from "@iconify/react";

export default function AdminHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch("/api/adminDashboard/overview");
        const json = await res.json();
        setStats(json.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading dashboard…</p>;
  if (!stats) return <p className="text-center mt-5">No data available</p>;

  return (
    <div className="container-fluid px-3 px-md-4">
      {/* ================= KPI SECTION ================= */}
      <div className="row g-4 mt-2 mb-5">
        <Metric
          title="Total Customers"
          value={stats.totalCustomers}
          icon="gridicons:multiple-users"
          color="bg-cyan"
        />
        <Metric
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon="fa-solid:award"
          color="bg-success"
        />
        <Metric
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon="mdi:clock-alert"
          color="bg-warning"
        />
        <Metric
          title="Expiring in 15 Days"
          value={stats.expiringSoon}
          icon="mdi:calendar-alert"
          color="bg-info"
        />
        <Metric
          title="Expired Subscriptions"
          value={stats.expiredSubscriptions}
          icon="mdi:close-circle"
          color="bg-danger"
        />
      </div>

      {/* ================= PLAN SECTION ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="fw-semibold mb-0">Subscriptions by Plan</p>
        {/* <span className="text-muted text-sm">
          Total Plans: {stats.plans.length}
        </span> */}
      </div>

      <div className="row g-4">
        {stats.plans.map((plan) => (
          <div
            key={plan.planId}
            className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12"
          >
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-20 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="fw-semibold mb-1 text-dark">
                    {plan.planName}
                  </h6>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-4">
                  <h4 className="fw-bold mb-0">{plan.subscriberCount}</h4>
                  <div className="w-40-px h-40-px bg-primary-light rounded-circle d-flex justify-content-center align-items-center">
                    <Icon
                      icon="gridicons:multiple-users"
                      className="text-primary text-lg"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function Metric({ title, value, icon, color }) {
  return (
    <div className="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
      <Card className="h-100 shadow-sm border-0">
        <Card.Body className="p-24 d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1 text-sm">{title}</p>
            <h4 className="fw-bold mb-0">{value}</h4>
          </div>
          <div
            className={`w-48-px h-48-px ${color} rounded-circle d-flex justify-content-center align-items-center`}
          >
            <Icon icon={icon} className="text-white text-xl" />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

// "use client";
// import React, { useEffect, useState } from "react";
// import { Icon } from "@iconify/react";
// import { useUserStatus } from "@/context/UserStatusContext";
// const UnitCountOne = () => {
//   const { refreshFlag } = useUserStatus();

//   const [counts, setCounts] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     inactiveUsers: 0,
//     deletedUsers: 0,
//     totalSubscriptions: 0,
//     activeSubscriptions: 0,
//   });

//   useEffect(() => {
//     const fetchCounts = async () => {
//       const res = await fetch("/api/users/userstatus");
//       console.log("Response of Stastics : ", res);
//       const data = await res.json();
//       console.log("Data of Stastics : ", data);
//       setCounts(data);
//     };

//     fetchCounts();
//   }, [refreshFlag]); // refresh when flag changes
//   return (
//     <div className="row row-cols-xxxl-4 row-cols-lg-4 row-cols-sm-2 row-cols-1 gy-4">
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-1 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">Total Users</p>
//                 <h6 className="mb-0">{counts.totalUsers.toLocaleString()}</h6>
//               </div>
//               <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="gridicons:multiple-users"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//                             <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                                 <Icon icon="bxs:up-arrow" className="text-xs" /> +5000
//                             </span>
//                             Last 30 days users
//                         </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-4 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">
//                   Active Users
//                 </p>
//                 <h6 className="mb-0">{counts.activeUsers.toLocaleString()}</h6>
//               </div>
//               <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="gridicons:multiple-users"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//               <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                 <Icon icon="bxs:up-arrow" className="text-xs" /> +1000
//               </span>
//               Last 30 days users
//             </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-2 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">
//                   Inactive Users
//                 </p>
//                 <h6 className="mb-0">
//                   {counts.inactiveUsers.toLocaleString()}
//                 </h6>
//               </div>
//               <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="gridicons:multiple-users"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//               <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                 <Icon icon="bxs:up-arrow" className="text-xs" /> +100
//               </span>
//               Last 30 days users
//             </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-5 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">
//                   Deleted Users
//                 </p>
//                 <h6 className="mb-0">{counts.deletedUsers.toLocaleString()}</h6>
//               </div>
//               <div className="w-50-px h-50-px bg-red rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="gridicons:multiple-users"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//               <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                 <Icon icon="bxs:up-arrow" className="text-xs" /> +100
//               </span>
//               Last 30 days users
//             </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-2 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">
//                   Total Subscriptions
//                 </p>
//                 <h6 className="mb-0">
//                   {counts.totalSubscriptions.toLocaleString()}
//                 </h6>
//               </div>
//               <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="fa-solid:award"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//               <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                 <Icon icon="bxs:up-arrow" className="text-xs" /> +800
//               </span>
//               Last 30 days subscription
//             </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//       <div className="col">
//         <div className="card shadow-none border bg-gradient-start-3 h-100">
//           <div className="card-body p-20">
//             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
//               <div>
//                 <p className="fw-medium text-primary-light mb-1">
//                   Active Subscriptions
//                 </p>
//                 <h6 className="mb-0">
//                   {counts.activeSubscriptions.toLocaleString()}
//                 </h6>
//               </div>
//               <div className="w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center">
//                 <Icon
//                   icon="fa-solid:award"
//                   className="text-white text-2xl mb-0"
//                 />
//               </div>
//             </div>
//             {/* <p className="fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2">
//               <span className="d-inline-flex align-items-center gap-1 text-success-main">
//                 <Icon icon="bxs:up-arrow" className="text-xs" /> +200
//               </span>
//               Last 30 days users
//             </p> */}
//           </div>
//         </div>
//         {/* card end */}
//       </div>
//     </div>
//   );
// };

// export default UnitCountOne;
