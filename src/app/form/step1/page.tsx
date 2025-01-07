'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SaveLoader } from '@/components/SaveLoader';
import Loading from '@/app/loading';
import { fetchFacultyData, FacultyProfile, UnauthorizedError, StudentEmailError } from '@/lib/fetchFacultyData';

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
        jointFacultyDepartment: '',
        appraisalPeriodStart: '',
        appraisalPeriodEnd: ''
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        const initializeData = async () => {
            setLoading(true);
            try {
                // First try to get existing form data
                const formResponse = await fetch('/api/get-part?step=1');
                const existingData = formResponse.ok ? await formResponse.json() : null;

                if (existingData && Object.keys(existingData).length > 0) {
                    console.log('Using existing form data:', existingData);
                    setFormData(prevData => ({
                        ...prevData,
                        ...existingData,
                        appraisalPeriodStart: existingData.appraisalPeriodStart || '',
                        appraisalPeriodEnd: existingData.appraisalPeriodEnd || ''
                    }));
                } else {
                    console.log('No existing data, fetching from faculty API');
                    const facultyData = await fetchFacultyData(session?.user?.email || '');
                    
                    if (facultyData && facultyData.profile) {
                        setFormData(prevData => ({
                            ...prevData,
                            name: facultyData.profile.name,
                            department: facultyData.profile.department,
                            designation: facultyData.profile.designation,
                            jointFaculty: '',
                            jointFacultyDepartment: '',
                            appraisalPeriodStart: '',
                            appraisalPeriodEnd: ''
                        }));
                    }
                }
            } catch (error) {
                console.error('Error in initializeData:', error);
                if (error instanceof StudentEmailError) {
                    setError(error.message);
                    // Optionally redirect to a different page for students
                    // router.push('/student-dashboard');
                } else if (error instanceof UnauthorizedError) {
                    setError('You are not authorized to access this faculty data. Please contact the administrator.');
                } else {
                    setError(error instanceof Error ? error.message : 'Failed to load faculty data. Please contact the administrator.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.email) {
            initializeData();
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

    // Helper function to safely get year from date string
    const getYearFromDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return isNaN(date.getFullYear()) ? '' : date.getFullYear().toString();
        } catch {
            return '';
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {isSaving && <SaveLoader message={loadingMessage} />}
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Basic Information</h1>
                
                {error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    disabled={true}
                                    className="w-full p-2 border rounded bg-gray-100"
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
                                    value={getYearFromDate(formData.appraisalPeriodStart)}
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            appraisalPeriodStart: year ? `${year}-01-01` : ''
                                        }));
                                    }}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {Array.from(
                                        { length: 10 }, 
                                        (_, i) => new Date().getFullYear() - 5 + i
                                    ).map(year => (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Appraisal Period End Year</label>
                                <select
                                    value={getYearFromDate(formData.appraisalPeriodEnd)}
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            appraisalPeriodEnd: year ? `${year}-12-31` : ''
                                        }));
                                    }}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {Array.from(
                                        { length: 10 }, 
                                        (_, i) => new Date().getFullYear() - 5 + i
                                    ).map(year => (
                                        <option key={year} value={year.toString()}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <p className="text-center mb-2">
                            Appraisal Period: January 01, {getYearFromDate(formData.appraisalPeriodStart)} to December 31, {getYearFromDate(formData.appraisalPeriodEnd)}
                        </p>
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Next: Teaching Engagement
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
