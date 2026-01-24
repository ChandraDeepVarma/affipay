import Breadcrumb from "@/components/Breadcrumb";
import UsersListLayer from "@/components/UsersListLayer";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- All Users",
  description: "Cash2Captcha- All Users",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="All Users" />

        {/* UsersListLayer */}
        <UsersListLayer />
      </MasterLayout>
    </>
  );
};

export default Page;
