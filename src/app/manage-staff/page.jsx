import Breadcrumb from "@/components/Breadcrumb";
import StaffManagement from "@/components/StaffManagement";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Manage Staff",
  description: "Cash2Captcha- Manage Staff",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Manage Staff" />

        {/* UsersDelLayer */}
        <StaffManagement />
      </MasterLayout>
    </>
  );
};

export default Page;
