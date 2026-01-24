import Breadcrumb from "@/components/Breadcrumb";
import CreditDebitAmount from "@/components/CreditDebitAmount";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Credit/Debit Amount",
  description: "Cash2Captcha- Credit/Debit Amount",
};

const page = () => {
  return (
    <>
      {/* Master Layout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Users Manage Wallet" />

        {/* CreditDebitAmount Component */}
        <CreditDebitAmount />
      </MasterLayout>
    </>
  );
};

export default page;
