'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SuccessPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-center">
                        <svg
                            className="h-12 w-12 text-green-500 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Form Submitted Successfully!
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your faculty appraisal form has been submitted successfully. You can view or download your submission using the buttons below.
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <Link
                        href="/form/review"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        View Submission
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Download PDF
                    </button>
                    <Link
                        href="/dashboard"
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact the admin at{' '}
                        <a href="mailto:admin@nitpatna.ac.in" className="text-blue-600 hover:text-blue-500">
                            admin@nitpatna.ac.in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage; 