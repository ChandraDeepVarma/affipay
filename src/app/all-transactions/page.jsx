import AllTransactions from "@/components/AllTransactions";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- All-Transactions",
  description: "Cash2Captcha- All-Transactions",
};

const page = () => {
  return (
    <>
      {/* Master Layout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="All Transactions" />

        {/* All user transctions */}
        <AllTransactions />
      </MasterLayout>
    </>
  );
};

export default page;
