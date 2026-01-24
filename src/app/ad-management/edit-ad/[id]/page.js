"use client";

import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import React, { useEffect, useState } from "react";
import AdForm from "@/components/AdForm";
import { useParams } from "next/navigation";

const EditAdPage = () => {
  const { id } = useParams();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchAd = async () => {
        try {
          const res = await fetch(`/api/ads/${id}`);
          const data = await res.json();
          if (data.success) {
            setAdData(data.ad);
          }
        } catch (err) {
          console.error("Failed to fetch ad:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAd();
    }
  }, [id]);

  return (
    <MasterLayout>
      <Breadcrumb title="Edit Advertisement" />
      {/* <h4 className="mt-3 mx-3">Edit Advertisement</h4> */}
      <p className="my-3 text-muted">Update your ad campaign details below.</p>
      {loading ? (
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : adData ? (
        <AdForm editMode={true} adData={adData} />
      ) : (
        <div className="alert alert-danger m-4">Ad not found</div>
      )}
    </MasterLayout>
  );
};

export default EditAdPage;
