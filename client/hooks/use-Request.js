import axios from 'axios';
import { useState } from 'react';

export default (method , url , body , onSucess) => {
  console.log("Requesting:", { method, url, body });
  const [errors, setErrors] = useState([]);

  const makeRequest = async () => {
    try {
      setErrors([]);
      const response = await axios({
        method: method,
        url: url,
        data: body
      });
      
      if(onSucess){
        onSucess(response.data);
      }

      return response.data;

    } catch (err) {
      console.log(err.response.data.errors);
      setErrors(err.response.data.errors);
    }
  };

  return [makeRequest , errors];
}