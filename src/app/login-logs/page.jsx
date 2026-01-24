import Breadcrumb from "@/components/Breadcrumb";
import Loginlog from "@/components/Loginlog";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Login Logs",
  description: "Cash2Captcha- Login Logs",
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
