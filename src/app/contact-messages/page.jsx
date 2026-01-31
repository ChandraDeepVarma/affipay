import Breadcrumb from "@/components/Breadcrumb";
import ContactMessagesPage from "@/components/ContactMessagesPage";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Affipay- Contact Messages",
  description: "Affipay- Contact Messages Management",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        <div className="main-content-wrap">
          {/* Breadcrumb */}
          <Breadcrumb title="CONTACT MESSAGE LIST" />

          <div className="row">
            <div className="col-lg-12">
              {/* ContactMessagesPage */}
              <ContactMessagesPage />
            </div>
          </div>
        </div>
      </MasterLayout>
    </>
  );
};

export default Page;
