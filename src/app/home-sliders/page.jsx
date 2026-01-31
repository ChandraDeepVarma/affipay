import Breadcrumb from "@/components/Breadcrumb";
import HomeSlidersPage from "@/components/HomeSlidersPage";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Home Sliders",
  description: "Affipay- Home Sliders",
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
