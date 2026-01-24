// src/components/child/SubscriptionBarChart.jsx
"use client";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import useReactApexChart from "@/hook/useReactApexChart";
import { useEffect, useState } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SubscriptionBarChart = () => {
  const { barChartOptionsTwo } = useReactApexChart();
  const [series, setSeries] = useState([
    {
      name: "Subscriptions",
      data: [],
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/reports/subscription-stats");
        const data = await res.json();
        console.log("Response data of subscription stats chart", data);
        setSeries([
          {
            name: "Subscriptions",
            data: data,
          },
        ]);
      } catch (error) {
        console.error("Error fetching subscription stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="col-xxl-12">
      <div className="card h-100 radius-8 border-0">
        <div className="card-body p-24">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <div>
              <h6 className="mb-2 fw-bold text-lg">Subscriptions</h6>
              <span className="text-sm fw-medium text-secondary-light">
                Yearly earning overview
              </span>
            </div>
            <div className="">
              <select
                className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Yearly">Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Today">Today</option>
              </select>
            </div>
          </div>
          <div id="barChart">
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "310px" }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <ReactApexChart
                options={barChartOptionsTwo}
                series={series}
                type="bar"
                height={310}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBarChart;
