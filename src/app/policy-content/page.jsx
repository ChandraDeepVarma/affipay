import Breadcrumb from "@/components/Breadcrumb";
import PolicyContent from "@/components/PolicyContent";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Policy Content",
  description: "Affipay- Policy Content Management",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        <div className="main-content-wrap">
          {/* Breadcrumb */}
          <Breadcrumb title="POLICY CONTENT" />

          <div className="row">
            <div className="col-lg-12">
              {/* PolicyContent */}
              <PolicyContent />
            </div>
          </div>
        </div>
      </MasterLayout>
    </>
  );
};

export default Page;
