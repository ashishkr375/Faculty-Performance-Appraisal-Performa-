'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/app/loading';

export function AdminCheck({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'loading') return;
        
        if (status === 'unauthenticated') {
            // Store the intended destination
            sessionStorage.setItem('redirectAfterLogin', pathname);
            router.push('/auth/signin');
            return;
        }

        if (!session?.user?.isAdmin) {
            router.push('/dashboard');
        }
    }, [session, status, router, pathname]);

    if (status === 'loading') {
        return <Loading />;
    }

    if (!session?.user?.isAdmin) {
        return null;
    }

    return <>{children}</>;
} 