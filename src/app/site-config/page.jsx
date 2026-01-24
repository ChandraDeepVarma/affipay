import Breadcrumb from "@/components/Breadcrumb";
import Sitesettings from "@/components/Sitesettings";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Site Settings",
  description: "Cash2Captcha- Site Settings",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Site Settings" />

        {/* CompanyLayer */}
        <Sitesettings />
      </MasterLayout>
    </>
  );
};

export default Page;
