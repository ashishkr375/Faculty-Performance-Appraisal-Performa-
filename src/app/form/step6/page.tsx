'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { ManagementDevelopment } from '@/types/form';
import { InstituteLevelActivities } from '@/components/form/step6/InstituteLevelActivities';
import { DepartmentLevelActivities } from '@/components/form/step6/DepartmentLevelActivities';
import { calculateStep6Marks } from '@/utils/calculateMarks';

const Step6Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<ManagementDevelopment>({
        instituteLevelActivities: [],
        departmentLevelActivities: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=6');
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
        const marks = calculateStep6Marks(formData);
        if (marks !== formData.calculatedMarks) {
            setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        }
    }, [formData.instituteLevelActivities, formData.departmentLevelActivities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 6,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step7');
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
            <h1 className="text-2xl font-bold mb-6">Management & Institutional Development</h1>
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                <span className="text-blue-600">{formData.calculatedMarks}</span>
                <span className="text-gray-600">/15</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <InstituteLevelActivities formData={formData} setFormData={setFormData} />
                <DepartmentLevelActivities formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step5')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Self Appraisal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step6Page; 