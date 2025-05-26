import {useRouter} from "next/router";
import {useEffect} from "react";
import SideDrawer from "@/components/organisms/side-drawer";
import {T} from "@/i18n";


export default function ConnectorPage() {
  const router = useRouter();
  useEffect(() => {
    router.push("/assets"); // TODO: to be removed after implementing the dashboard
  }, []);

  return (
      <SideDrawer title={<T string="dashboard.title" />}>
      </SideDrawer>
  );
}
