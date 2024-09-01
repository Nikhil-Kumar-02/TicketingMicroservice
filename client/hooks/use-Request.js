import axios from 'axios';
import { useState } from 'react';

export default (method , url , body , onSucess) => {
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
      setErrors(err.response.data.errors);
    }
  };

  return [makeRequest , errors];
}