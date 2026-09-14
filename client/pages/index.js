import axios from "axios";
import http from "http";

const LandingPage = ({ currentUser }) => {
  console.log("Current User: ", currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  try {
    if (typeof window === "undefined") {
      const { data } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: req.headers,
          httpAgent: new http.Agent({ keepAlive: false }),
          timeout: 5000,
        },
      );
      return data;
    } else {
      const { data } = await axios.get("/api/users/currentuser");
      return data;
    }
  } catch (err) {
    console.log("ERROR in getInitialProps:", err.message, err.response?.status);
    return {};
  }
};

export default LandingPage;
