import { redirect } from "next/navigation";
import { FC } from "react";

const PortalPage: FC = () => {
  redirect("/portal/posts");
};

export default PortalPage;
