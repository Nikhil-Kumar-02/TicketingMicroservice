import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps , currentUser}) => {
  return (
    <div>
      <h3>{currentUser?.email}</h3>
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