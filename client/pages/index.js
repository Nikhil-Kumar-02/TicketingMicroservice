import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = (currentUser) => {
  // console.log(currentUser);
  // axios.get('/api/users/currentuser');
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({req}) => {
  try {
    console.log("the req header in getinitialprops  : " , req.headers);
    const { data } = await buildClient(req).get('/api/users/currentuser');
    return data;  
  } catch (error) {
    return error;
  }
};

export default LandingPage;
