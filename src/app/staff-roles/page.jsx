import Breadcrumb from "@/components/Breadcrumb";
import RolesStaff from "@/components/RolesStaff";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Staff Roles",
  description: "Affipay- Staff Roles",
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
