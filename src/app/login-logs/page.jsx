import Breadcrumb from "@/components/Breadcrumb";
import Loginlog from "@/components/Loginlog";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Login Logs",
  description: "Affipay- Login Logs",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Login Logs" />

        {/* UsersDelLayer */}
        <Loginlog />
      </MasterLayout>
    </>
  );
};

export default Page;
