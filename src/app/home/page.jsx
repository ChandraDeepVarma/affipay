import Breadcrumb from "@/components/Breadcrumb";
import DashBoardLayerOne from "@/components/DashBoardLayerOne";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Admin Dashboard",
  description: "Cash2Captcha- Admin Dashboard",
};
const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Home" />

        {/* DashBoardLayerTwo */}
        <DashBoardLayerOne />
      </MasterLayout>
    </>
  );
};

export default Page;
