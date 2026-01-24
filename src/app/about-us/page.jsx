import Breadcrumb from "@/components/Breadcrumb";
import AboutUsContent from "@/components/AboutUsContent";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- About Us",
  description: "Cash2Captcha- About Us Content Management",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        <div className="main-content-wrap">
          {/* Breadcrumb */}
          <Breadcrumb title="About Us" />

          <div className="row">
            <div className="col-lg-12">
              {/* AboutUsContent */}
              <AboutUsContent />
            </div>
          </div>
        </div>
      </MasterLayout>
    </>
  );
};

export default Page;
