'use client';

import { AdminCheck } from '@/components/AdminCheck';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';

interface UserSubmission {
    userId: string;  // email
    step1?: {
        name: string;
        department: string;
        // ... other step1 fields
    };
    completedSteps: number[];
    lastUpdated: Date;
}

export default function AdminPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<UserSubmission[]>([]);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const isWebmaster = session?.user?.email === 'webmaster@nitp.ac.in';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/admin/add-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newAdminEmail }),
            });
            if (!response.ok) throw new Error('Failed to add admin');
            setNewAdminEmail('');
            fetchUsers(); // Refresh user list
        } catch (err) {
            setError('Failed to add admin');
        }
    };

    const handleRemoveAdmin = async (email: string) => {
        try {
            const response = await fetch('/api/admin/remove-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) throw new Error('Failed to remove admin');
            fetchUsers(); // Refresh user list
        } catch (err) {
            setError('Failed to remove admin');
        }
    };

    const getStepStatus = (steps: number[]) => {
        const statusMap = {
            1: 'Basic Info',
            2: 'Teaching',
            3: 'Research',
            4: 'Sponsored R&D',
            5: 'Organization',
            6: 'Management',
            7: 'Self Appraisal'
        };

        if (steps.length === 0) return 'Not Started';
        if (steps.length === 7) return 'Completed';
        
        const lastStep = Math.max(...steps);
        return `Completed till ${statusMap[lastStep as keyof typeof statusMap]}`;
    };

    return (
        <AdminCheck>
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                {/* User Management Section */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">User Submissions</h2>
                        {loading ? (
                            <div className="flex items-center justify-center min-h-[200px]">
                                <CgSpinner className="animate-spin text-blue-500 w-8 h-8" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left">Faculty Name</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Department</th>
                                            <th className="px-4 py-2 text-left">Status</th>
                                            <th className="px-4 py-2 text-left">Last Updated</th>
                                            <th className="px-4 py-2 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.userId} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    {user.step1?.name || 'Not Started'}
                                                </td>
                                                <td className="px-4 py-2">{user.userId}</td>
                                                <td className="px-4 py-2">
                                                    {user.step1?.department || 'Not Started'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.completedSteps.length === 7 
                                                            ? 'bg-green-100 text-green-800'
                                                            : user.completedSteps.length === 0
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {getStepStatus(user.completedSteps)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    {new Date(user.lastUpdated).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => window.open(`/form/admin-review?email=${encodeURIComponent(user.userId)}`, '_blank')}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2 text-sm"
                                                    >
                                                        View Form
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Admin Management Section - Only visible to webmaster */}
                    {isWebmaster && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Admin Management</h2>
                            <form onSubmit={handleAddAdmin} className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={newAdminEmail}
                                        onChange={(e) => setNewAdminEmail(e.target.value)}
                                        placeholder="Enter email to add admin"
                                        className="flex-1 p-2 border rounded"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                    >
                                        Add Admin
                                    </button>
                                </div>
                            </form>

                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Current Admins</h3>
                                <ul className="space-y-2">
                                    {users
                                        .filter(user => user.isAdmin)
                                        .map(admin => (
                                            <li key={admin.email} className="flex justify-between items-center">
                                                <span>{admin.email}</span>
                                                {admin.email !== 'webmaster@nitp.ac.in' && (
                                                    <button
                                                        onClick={() => handleRemoveAdmin(admin.email)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>
        </AdminCheck>
    );
} 