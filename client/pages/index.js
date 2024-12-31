const LandingPage = ({currentUser}) => {
  console.log("the current user is : " , currentUser);
  return currentUser ? (<h1>You are signed in {currentUser?.email}</h1>) : (<h1>you are not signed in</h1>);
};

LandingPage.getInitialProps = async (context , client , currentUser) => {
  return {};  
};

export default LandingPage;
