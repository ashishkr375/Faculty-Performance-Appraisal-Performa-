'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { SelfAppraisal } from '@/types/form';
import { SelfAppraisalForm } from '@/components/form/step7/SelfAppraisal';

const Step7Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<SelfAppraisal>({
        achievements: '',
        areasOfImprovement: '',
        futurePlans: '',
        supportRequired: '',
        additionalComments: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=7');
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                }
            } catch (error) {
                console.error('Error fetching saved data:', error);
            }
            setLoading(false);
        };

        fetchSavedData();
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 7,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/review');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Self Appraisal</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <SelfAppraisalForm formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step6')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Review Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step7Page; 