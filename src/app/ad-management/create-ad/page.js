import Breadcrumb from "@/components/Breadcrumb";
import MasterLayout from "@/masterLayout/MasterLayout";
import React from "react";
import AdForm from "@/components/AdForm";

const CreateAdPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb title="Create New Ad" />
        {/* <h4 className="mt-3 mx-3 ">Create New Advertisement</h4> */}
        <p className="my-3 text-muted">
          Set up a new advertisement campaign. Choose between image banner or
          script code.
        </p>
        <AdForm />
      </MasterLayout>
    </>
  );
};

export default CreateAdPage;
