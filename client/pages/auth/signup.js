import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import useRequest from '../../hooks/use-Request';
import Router from 'next/router'

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [makeRequest , errors] = useRequest( "post" , "/api/users/signup" , {email,password} , 
     (data) => Router.push({ pathname : '/', query : data } ) 
    );

  const emailError = errors
    .filter(err => err.field === "email")
    .map(err => <li key={err.message}>{err.message}</li>);
  

  const passwordError = errors
    .filter(err => err.field === "password")
    .map(err => <li key={err.message}>{err.message}</li>);
  
  const onSubmit = async event => {
    event.preventDefault();

    await makeRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
        {emailError && emailError.length > 0 && (
          <div className="alert alert-danger">
            <h6>Ooops....</h6>
            <ul className="my-0">
              {emailError}
            </ul>
          </div>
        )}
        {emailError.length === 0 && errors.length>0 && !errors[0].field && (
          <div className="alert alert-danger">
            <h6>Ooops....</h6>
              <h5>{errors[0].message}</h5>
          </div>
        )}
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
        {passwordError && passwordError.length > 0 && (
          <div className="alert alert-danger">
            <h6>Ooops....</h6>
            <ul className="my-0">
              {passwordError}
            </ul>
          </div>
        )}
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
