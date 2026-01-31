import Breadcrumb from "@/components/Breadcrumb";
import PlansList from "@/components/PlansList";
import UsersListLayer from "@/components/UsersListLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Subscription Plans",
  description: "Affipay- Subscription Plans",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Subscription Plans" />

        {/* Storage Providers */}
        <PlansList />
      </MasterLayout>
    </>
  );
};

export default Page;
