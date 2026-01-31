import Breadcrumb from "@/components/Breadcrumb";
import AdManagement from "@/components/AdManagement";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Ad Management",
  description: "Affipay- Ad Management",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="AD MANAGEMENT" />

        {/* AdManagement */}
        <AdManagement />
      </MasterLayout>
    </>
  );
};

export default Page;
