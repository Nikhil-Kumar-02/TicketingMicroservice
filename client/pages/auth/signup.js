import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const emailError = errors
    .filter(err => err.field === "email")
    .map(err => <li key={err.message}>{err.message}</li>);
  

  const passwordError = errors
    .filter(err => err.field === "password")
    .map(err => <li key={err.message}>{err.message}</li>);
  
  console.log(emailError);
  console.log(passwordError);

  const onSubmit = async event => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email,
        password
      });

      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
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
