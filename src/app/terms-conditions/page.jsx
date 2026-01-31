import MasterLayout from "@/masterLayout/MasterLayout";
import Breadcrumb from "@/components/Breadcrumb";
import TermsConditionsContent from "@/components/TermsConditionsContent";

export const metadata = {
  title: "Terms & Conditions - Affipay Admin",
  description: "Manage Terms & Conditions content for your website",
};

const TermsConditionsPage = () => {
  return (
    <MasterLayout>
      <div className="main-content-wrap">
        <Breadcrumb title="Terms & Conditions" />

        <div className="row">
          <div className="col-lg-12">
            <TermsConditionsContent />
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default TermsConditionsPage;
