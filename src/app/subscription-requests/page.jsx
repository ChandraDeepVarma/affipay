import Breadcrumb from "@/components/Breadcrumb";
import SubscriptionRequests from "@/components/SubscriptionRequests";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";

export const metadata = {
  title: "Cash2Captcha- Subscription Requests",
  description: "Cash2Captcha- Subscription Requests",
};

const page = () => {
  return (
    <>
      {/* MasterLayout comonent */}
      <MasterLayout>
        {/* Bread crump */}


        {/* Subscription Requests */}
        <SubscriptionRequests />
      </MasterLayout>
    </>
  );
};

export default page;
