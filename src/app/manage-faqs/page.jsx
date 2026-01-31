import FaqManagement from "@/components/FaqManagement";
import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage FAQs - Affipay Admin",
  description: "Manage FAQs - Affipay Admin",
};

const ManageFaqsPage = async () => {
  // const cookieStore = await cookies();
  // console.log("cookieStore", cookieStore);
  // const token = cookieStore.get("admin_token");
  // console.log("Admin token", token);

  // if (!token?.value) {
  //   // No token, redirect to login
  //   redirect("/login");
  // }

  // try {
  //   const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
  //   if (!decoded?.isAdmin) {
  //     redirect("/login"); // Not an admin
  //   }
  // } catch (error) {
  //   console.error("JWT verification failed:", error);
  //   redirect("/login"); // Invalid token
  // }

  return (
    <MasterLayout>
      <div className="container-fluid">
        <Breadcrumb title="MANAGE FAQs" />
        <div className="row">
          <div className="col-12">
            <FaqManagement />
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default ManageFaqsPage;
