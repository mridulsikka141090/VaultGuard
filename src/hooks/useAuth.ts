// hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email?: string;
  sub: string;
  exp: number;
  [key: string]: any;
}

export function useAuth({ redirectToLogin = true } = {}) {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem('id_token');
      if (!token) throw new Error('Token not found');

      const decoded: DecodedToken = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) throw new Error('Token expired');

      setUser(decoded);
    } catch (err) {
      if (redirectToLogin) router.replace('/login');
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
}
