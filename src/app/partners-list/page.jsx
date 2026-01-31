import Breadcrumb from "@/components/Breadcrumb";
import PartnersList from "@/components/PartnersList";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Partners List",
  description: "Affipay- Partners List",
};

const page = () => {
  return (
    <>
      {/* MastrLayout */}
      <MasterLayout>
        {/* BrradCrump */}
        <Breadcrumb title="Add Partners" />

        {/* PartnersList compoenent */}
        <PartnersList />
      </MasterLayout>
    </>
  );
};

export default page;
