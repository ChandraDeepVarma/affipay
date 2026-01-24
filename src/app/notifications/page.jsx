import Breadcrumb from "@/components/Breadcrumb";
import NotificationsPage from "@/components/NotificationsPage";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Cash2Captcha- Notifications",
  description: "Cash2Captcha- Notifications",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Claimed Gifts / Notifications" />

        <NotificationsPage />
      </MasterLayout>
    </>
  );
};

export default Page;
