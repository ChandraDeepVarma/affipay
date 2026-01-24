// src/app/withdrawal-requests/approve/[id]/page.jsx
"use client";

import { useRouter } from "next/navigation";
import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import React from "react";

const ApprovePage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);

  const [data, setData] = useState(null);
  const [utr, setUtr] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetch(`/api/requests/withdrawal/${id}`)
      .then((res) => res.json())
      .then((out) => {
        if (out.success) setData(out.data);
      });
  }, [id]);

  const markAsSettled = async () => {
    if (!utr.trim()) {
      Swal.fire("UTR Required", "Enter UTR reference number", "warning");
      return;
    }

    const res = await fetch("/api/requests/withdrawal-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        withdrawalId: id,
        action: "approve",
        utrNumber: utr,
        remarks,
      }),
    });
    console.log("Approve res", res);

    const out = await res.json();
    console.log("Approve out", out);

    Swal.fire(
      out.success ? "Approved" : "Error",
      out.msg,
      out.success ? "success" : "error"
    );

    if (out.success) {
      router.push("/withdrawal-requests");
    }
  };

  if (!data) return null;

  const p = data.paymentDetails;
  const c = data.customerId;

  return (
    <MasterLayout>
      <Breadcrumb title="Approve Withdrawal" />

      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 align-items-center flex-wrap gap-3 justify-content-between">
          <div>
            <p>
              Customer Name :{" "}
              <span className="text-md fw-bold">{c.fullName || "N/A"}</span>
            </p>
            <p>
              Email :{" "}
              <span className="text-md fw-bold">{c.email || "N/A"}</span>
            </p>
            <p>
              Phone :{" "}
              <span className="text-md fw-bold">{c.phone || "N/A"}</span>
            </p>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <p>
              Payout Requested Date :{" "}
              <span className="text-md fw-bold">
                {new Date(data.requestedAt)
                  .toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace("am", "AM")
                  .replace("pm", "PM")}
              </span>
            </p>
          </div>
        </div>

        <div className="card-body p-24">
          <h6 className="mt-3">Bank Details</h6>
          <div className="table-responsive scroll-sm">
            <table className="table bordered-table sm-table mb-0">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{p.accountHolderName}</td>
                </tr>
                <tr>
                  <th>Account</th>
                  <td>{p.bankAccount}</td>
                </tr>
                <tr>
                  <th>Bank</th>
                  <td>{p.bankName}</td>
                </tr>
                <tr>
                  <th>IFSC</th>
                  <td>{p.ifscCode}</td>
                </tr>
                <tr>
                  <th>UPI</th>
                  <td>{p.upiId || "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <label>
              Amount <span className="text-danger">*</span>
            </label>
            <input className="form-control" value={data.amount} disabled />
          </div>

          <div>
            <label>
              UTR Number <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Enter UTR Number"
            />

            {/* <div>
              <label>Remarks (optional)</label>
              <textarea
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div> */}

            <div className="mt-3">
              <button
                className="btn btn-info"
                onClick={markAsSettled}
                style={{ width: "200px" }}
              >
                Mark as Approved
              </button>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default ApprovePage;
