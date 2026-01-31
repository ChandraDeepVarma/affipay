import Breadcrumb from "@/components/Breadcrumb";
import UsersDelLayer from "@/components/UsersDelLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Deleted Users",
  description: "Affipay- Deleted Users",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Deleted Users" />

        {/* UsersDelLayer */}
        <UsersDelLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
