'use client';

import { useEffect, useState } from 'react';
import { Preview } from '@/components/Preview';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '../../loading';

export default function AdminReviewPage() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const userEmail = searchParams.get('email');

    useEffect(() => {
        if (!session?.user?.email) {
            router.push('/auth/signin');
            return;
        }

        const fetchData = async () => {
            try {
                // First check if user is admin
                const adminCheck = await fetch('/api/admin/check');
                if (!adminCheck.ok) {
                    router.push('/dashboard');
                    return;
                }

                // Then fetch the requested user's form data
                const response = await fetch(`/api/form/get-data?email=${userEmail}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Failed to fetch form data:', error);
                setError('Failed to load form data');
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchData();
        } else {
            router.push('/admin');
        }
    }, [session, router, userEmail]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600">{error}</h2>
                    <button
                        onClick={() => router.push('/admin')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Back to Admin Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white shadow-lg rounded-lg">
                {formData && <Preview formData={formData} />}
            </div>
        </div>
    );
} 