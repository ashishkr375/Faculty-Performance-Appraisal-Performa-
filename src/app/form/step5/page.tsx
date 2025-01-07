'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { OrganizationParticipation } from '@/types/form';
import { Events } from '@/components/form/step5/Events';
import { Lectures } from '@/components/form/step5/Lectures';
import { OnlineCourses } from '@/components/form/step5/OnlineCourses';
import { Visits } from '@/components/form/step5/Visits';
import { OutreachActivities } from '@/components/form/step5/OutreachActivities';
import { calculateStep5Marks } from '@/utils/calculateMarks';

const Step5Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<OrganizationParticipation>({
        events: [],
        lectures: [],
        onlineCourses: [],
        visits: [],
        outreachActivities: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=5');
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

    useEffect(() => {
        // Calculate marks whenever form data changes
        const marks = calculateStep5Marks(formData);
        if (marks !== formData.calculatedMarks) {
            setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        }
    }, [formData.events, formData.lectures, formData.onlineCourses, 
        formData.visits, formData.outreachActivities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 5,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step6');
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
            <h1 className="text-2xl font-bold mb-6">Organization & Participation</h1>
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                <span className="text-blue-600">{formData.calculatedMarks}</span>
                <span className="text-gray-600">/6</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <Events formData={formData} setFormData={setFormData} />
                <Lectures formData={formData} setFormData={setFormData} />
                <OnlineCourses formData={formData} setFormData={setFormData} />
                <Visits formData={formData} setFormData={setFormData} />
                <OutreachActivities formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step4')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Management & Development
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step5Page; 