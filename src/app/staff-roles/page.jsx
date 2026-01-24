import Breadcrumb from "@/components/Breadcrumb";
import RolesStaff from "@/components/RolesStaff";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Staff Roles",
  description: "Cash2Captcha- Staff Roles",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Staff Roles" />

        {/* UsersDelLayer */}
        <RolesStaff />
      </MasterLayout>
    </>
  );
};

export default Page;
