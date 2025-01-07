import { CgSpinner } from 'react-icons/cg';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center">
                <CgSpinner className="animate-spin text-blue-500 w-16 h-16 mx-auto mb-4" />
                <div className="text-xl font-semibold text-gray-700">Loading...</div>
                <div className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</div>
            </div>
        </div>
    );
} 