import Breadcrumb from "@/components/Breadcrumb";
import AdManagement from "@/components/AdManagement";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Ad Management",
  description: "Cash2Captcha- Ad Management",
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
