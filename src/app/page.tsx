'use client';

import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const { user, loading } = useAuth();
  console.log('User:', user);
  return (
    <div className='flex flex-row-reverse'>
      Hello
    </div>
  )
}
