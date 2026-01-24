"use client";
import useReactApexChart from "@/hook/useReactApexChart";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const StorageStat = () => {
  let { donutChartSeries, donutChartOptions } = useReactApexChart();
  return (
    <div className='col-xxl-6 col-xl-6'>
      <div className='card h-100 radius-8 border-0 overflow-hidden'>
        <div className='card-body p-24'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg'>Storage Stats</h6>
          </div>
          <ReactApexChart
            options={donutChartOptions}
            series={donutChartSeries}
            type='donut'
            height={344}
          />
        </div>
      </div>
    </div>
  );
};

export default StorageStat;
