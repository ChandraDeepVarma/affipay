import Breadcrumb from "@/components/Breadcrumb";
import UsersDelLayer from "@/components/UsersDelLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Deleted Users",
  description: "Cash2Captcha- Deleted Users",
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
