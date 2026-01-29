import Breadcrumb from "@/components/Breadcrumb";
import UsersListLayer from "@/components/UsersListLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "affipay- All Employees",
  description: "affipay- All Employees",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="All Employees" />

        {/* UsersListLayer */}
        <UsersListLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
