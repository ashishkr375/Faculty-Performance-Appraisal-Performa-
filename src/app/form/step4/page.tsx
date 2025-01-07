'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { SponsoredRD } from '@/types/form';
import { SponsoredProjects } from '@/components/form/step4/SponsoredProjects';
import { ConsultancyProjects } from '@/components/form/step4/ConsultancyProjects';
import { IPR } from '@/components/form/step4/IPR';
import { Startups } from '@/components/form/step4/Startups';
import { Internships } from '@/components/form/step4/Internships';
import { IndustryLabs } from '@/components/form/step4/IndustryLabs';
import { calculateStep4Marks } from '@/utils/calculateMarks';

const Step4Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<SponsoredRD>({
        sponsoredProjects: [],
        consultancyProjects: [],
        ipr: [],
        startups: [],
        internships: [],
        industryLabs: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=4');
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
        const marks = calculateStep4Marks(formData);
        if (marks !== formData.calculatedMarks) {
            setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        }
    }, [formData.sponsoredProjects, formData.consultancyProjects, formData.ipr, 
        formData.startups, formData.internships, formData.industryLabs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 4,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step5');
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
            <h1 className="text-2xl font-bold mb-6">Sponsored R&D and Consultancy</h1>
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                <span className="text-blue-600">{formData.calculatedMarks}</span>
                <span className="text-gray-600">/14</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <SponsoredProjects formData={formData} setFormData={setFormData} />
                <ConsultancyProjects formData={formData} setFormData={setFormData} />
                <IPR formData={formData} setFormData={setFormData} />
                <Startups formData={formData} setFormData={setFormData} />
                <Internships formData={formData} setFormData={setFormData} />
                <IndustryLabs formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step3')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Organization & Participation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step4Page; 