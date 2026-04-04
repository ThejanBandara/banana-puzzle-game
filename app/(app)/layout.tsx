"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const HomeLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-wood-dark flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-16 text-primary animate-spin" />
        <p className="text-primary font-black uppercase tracking-widest animate-pulse italic">Entering the Jungle...</p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default HomeLayout;
