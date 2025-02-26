import React from "react";

import { Spinner } from "@bigbinary/neetoui";

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Spinner />
  </div>
);

export default PageLoader;
