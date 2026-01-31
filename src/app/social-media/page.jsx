import Breadcrumb from "@/components/Breadcrumb";
import SocialMediaContent from "@/components/SocialMediaContent";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Social Media Links",
  description: "Affipay- Social Media Links Management",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Social Media Links" />

        {/* SocialMediaContent */}
        <SocialMediaContent />
      </MasterLayout>
    </>
  );
};

export default Page;
