'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '../loading';

interface FormProgress {
    completedSteps: number[];
    lastUpdated?: Date;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formProgress, setFormProgress] = useState<FormProgress>({ completedSteps: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchProgress = async () => {
            try {
                const response = await fetch('/api/get-progress');
                if (response.ok) {
                    const data = await response.json();
                    setFormProgress(data);
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.email) {
            fetchProgress();
        }
    }, [session, status, router]);

    const steps = [
        { number: 1, title: 'Personal Information', path: '/form/step1' },
        { number: 2, title: 'Teaching Load', path: '/form/step2' },
        { number: 3, title: 'Research & Publications', path: '/form/step3' },
        { number: 4, title: 'Sponsored R&D', path: '/form/step4' },
        { number: 5, title: 'Organization & Participation', path: '/form/step5' },
        { number: 6, title: 'Management & Development', path: '/form/step6' },
        { number: 7, title: 'Self Appraisal', path: '/form/step7' },
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Faculty Performance Appraisal</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Form Progress</h2>
                <div className="space-y-4">
                    {steps.map((step) => {
                        const isCompleted = formProgress.completedSteps.includes(step.number);
                        const isNext = !isCompleted && 
                            !formProgress.completedSteps.includes(step.number) && 
                            (formProgress.completedSteps.length === 0 || 
                             Math.max(...formProgress.completedSteps) === step.number - 1);

                        return (
                            <div key={step.number} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                                <div>
                                    <h3 className="font-medium">
                                        Step {step.number}: {step.title}
                                    </h3>
                                    <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                                        {isCompleted ? 'Completed' : 'Not completed'}
                                    </p>
                                </div>
                                <div>
                                    {isCompleted ? (
                                        <Link
                                            href={step.path}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            Edit
                                        </Link>
                                    ) : isNext ? (
                                        <Link
                                            href={step.path}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Complete
                                        </Link>
                                    ) : (
                                        <span className="text-gray-400">Locked</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {formProgress.completedSteps.length === 7 && (
                <div className="text-center">
                    <Link
                        href="/form/review"
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                        View Complete Filled Form
                    </Link>
                </div>
            )}
        </div>
    );
} 