import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps , currentUser}) => {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps}  />
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  const { data } = await buildClient(context.ctx).get('/api/users/currentuser');

  let pageProps = {};
  if(context.Component.getInitialProps){
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

    return {
      ...data,
      pageProps
    };  
}

export default AppComponent;