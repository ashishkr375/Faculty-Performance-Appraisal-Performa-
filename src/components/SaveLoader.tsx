import { CgSpinner } from 'react-icons/cg';

export function SaveLoader({ message = "Saving..." }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
                <CgSpinner className="animate-spin text-blue-500 w-12 h-12" />
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
} 