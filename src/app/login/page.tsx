'use client';

import { useEffect } from "react";
import Spinner from "@/components/Spinner";

const LoginPage = () => {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;

    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=token&scope=email+openid+phone&redirect_uri=${redirectUri}`;

    window.location.href = loginUrl;
  }, []);
  
  return <Spinner />;
}

export default LoginPage;