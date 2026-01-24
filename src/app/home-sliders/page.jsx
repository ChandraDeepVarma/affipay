import Breadcrumb from "@/components/Breadcrumb";
import HomeSlidersPage from "@/components/HomeSlidersPage";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Home Sliders",
  description: "Cash2Captcha- Home Sliders",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="HOME SLIDERS" />

        {/* HomeSlidersPage */}
        <HomeSlidersPage />
      </MasterLayout>
    </>
  );
};

export default Page;
