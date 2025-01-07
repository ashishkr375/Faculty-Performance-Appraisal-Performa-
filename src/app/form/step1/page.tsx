'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SaveLoader } from '@/components/SaveLoader';
import Loading from '@/app/loading';

interface BasicInfo {
    name: string;
    designation: string;
    department: string;
    jointFaculty: string;
    jointFacultyDepartment: string;
    appraisalPeriodStart: string;
    appraisalPeriodEnd: string;
}

export default function Step1Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<BasicInfo>({
        name: '',
        designation: '',
        department: '',
        jointFaculty: '',
        appraisalPeriodStart: '',
        appraisalPeriodEnd: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchData = async () => {
            try {
                const response = await fetch('/api/get-part?step=1');
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        setFormData(prevData => ({
                            ...prevData,
                            ...data
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        if (session?.user?.email) {
            fetchData();
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setLoadingMessage('Saving your information...');
        
        try {
            const submissionData = {
                name: formData.name,
                email: session?.user?.email,
                department: formData.department,
                designation: formData.designation,
                jointFaculty: formData.jointFaculty || '',
                jointFacultyDepartment: formData.jointFacultyDepartment || '',
                appraisalPeriodStart: formData.appraisalPeriodStart,
                appraisalPeriodEnd: formData.appraisalPeriodEnd
            };

            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 1,
                    data: submissionData
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save data');
            }

            setLoadingMessage('Proceeding to next step...');
            router.push('/form/step2');
        } catch (error) {
            console.error('Error saving form:', error);
            // Handle error (show error message to user)
            setIsSaving(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {isSaving && <SaveLoader message={loadingMessage} />}
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Faculty Performance Appraisal</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Designation</label>
                            <input
                                type="text"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="Department of ..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Joint Faculty (if any)</label>
                            <input
                                type="text"
                                value={formData.jointFaculty}
                                onChange={(e) => setFormData({ ...formData, jointFaculty: e.target.value })}
                                className="w-full p-2 border rounded"
                                placeholder="Department where Joint Faculty"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Appraisal Period Start Year</label>
                            <select
                                value={new Date(formData.appraisalPeriodStart).getFullYear()}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    setFormData({
                                        ...formData,
                                        appraisalPeriodStart: `${year}-01-01`
                                    });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Appraisal Period End Year</label>
                            <select
                                value={new Date(formData.appraisalPeriodEnd).getFullYear()}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    setFormData({
                                        ...formData,
                                        appraisalPeriodEnd: `${year}-12-31`
                                    });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Year</option>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Next: Teaching Engagement
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
