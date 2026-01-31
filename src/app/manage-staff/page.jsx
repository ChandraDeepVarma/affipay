import Breadcrumb from "@/components/Breadcrumb";
import StaffManagement from "@/components/StaffManagement";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Manage Staff",
  description: "Affipay- Manage Staff",
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
