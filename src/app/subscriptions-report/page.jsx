import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import Subscriptions from "@/components/subscriptions";

export const metadata = {
  title: "Cash2Captcha- Subscriptions Reports",
  description: "Cash2Captcha- Subscriptions Reports",
};

const Page = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Subscriptions" />
        {/* <UsersDelLayer scenario="subscription" /> */}
        <Subscriptions />
      </MasterLayout>
    </>
  );
};

export default Page;
