'use client';

import { useEffect, useState } from 'react';
import { Preview } from '@/components/Preview';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../../loading';


export default function ReviewPage() {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session?.user?.email) {
            router.push('/auth/signin');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/form/get-data?email=${session.user.email}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setFormData(data);
            } catch (error) {
                console.error('Failed to fetch form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, router]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(`/api/generate-pdf/${encodeURIComponent(session?.user?.email || '')}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'faculty-appraisal.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download document:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white shadow-lg rounded-lg">
                {formData && <Preview formData={formData} />}
            </div>
        </div>
    );
}
