import Breadcrumb from "@/components/Breadcrumb";
import WithdrawalRequest from "@/components/WithdrawalRequest";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

export const metadata = {
  title: "Affipay- Withdrawal Requests",
  description: "Affipay- Withdrawal Requests",
};

const page = () => {
  return (
    <>
      {/* MasterLayout comonent */}
      <MasterLayout>
        {/* Bread crump */}
        <Breadcrumb title="WITHDRAWAL REQUESTS" />

        {/* wait list users */}
        <WithdrawalRequest />
      </MasterLayout>
    </>
  );
};

export default page;
