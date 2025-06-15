'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function CallbackPage() {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');

    if (idToken && accessToken) {
      localStorage.setItem('id_token', idToken);
      localStorage.setItem('access_token', accessToken);
      router.replace('/');
    } else {
      console.error('Login failed');
    }
  }, []);

  return <Spinner />;
}
