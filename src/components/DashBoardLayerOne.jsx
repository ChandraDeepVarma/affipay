import SubscriptionBarChart from "./child/SubscriptionBarChart";
import UnitCountOne from "@/components/child/UnitCountOne";
import StorageStat from "./child/StorageStat";

const DashBoardLayerOne = () => {
  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      <section className="row gy-4 mt-1">
        {/* TotalSubscriberOne */}
        <SubscriptionBarChart />
      </section>
    </>
  );
};

export default DashBoardLayerOne;
