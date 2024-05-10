import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });
  useEffect(() => {
    console.log("si");
    doRequest();
  }, []);
  return <div className="alert">Signing you out...</div>;
};
