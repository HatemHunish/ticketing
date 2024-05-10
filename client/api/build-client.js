import axios from "axios";
export default ({ req }) => {
  const serviceName = "ingress-nginx-controller";
  const NAMESPACE = "ingress-nginx";

  if (typeof window === "undefined") {
    return axios.create({
      baseURL: `http://${serviceName}.${NAMESPACE}.svc.cluster.local`,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: `/`,
    });
  }
};
