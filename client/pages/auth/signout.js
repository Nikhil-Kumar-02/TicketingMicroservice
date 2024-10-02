import { useEffect } from "react"
import useRequest from "../../hooks/use-Request"
import Router from 'next/router'

export default () => {

  const [makeRequest] = useRequest( 
    "get" ,
     "/api/users/signout" , 
    {} ,
    () => Router.push({ pathname : '/' })
  );

  useEffect(() => {
    makeRequest();
  } , []);

  return <h3>
    Signing the user out ... 
  </h3>
}