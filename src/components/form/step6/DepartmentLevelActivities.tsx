import { ManagementDevelopment } from '@/types/form';

interface Props {
    formData: ManagementDevelopment;
    setFormData: (data: ManagementDevelopment) => void;
}

export const DepartmentLevelActivities = ({ formData, setFormData }: Props) => {
    const handleAddActivity = () => {
        setFormData({
            ...formData,
            departmentLevelActivities: [...formData.departmentLevelActivities, {
                activity: '',
                duration: '',
                marks: 0.5
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Department Level Activities</h2>
            <p className="text-sm text-gray-600 mb-4">
                [Maximum 05 marks]
                <br />
                <small>
                    0.5 Mark/semester for each Departmental activity identified by Head of the Department
                </small>
            </p>
            {formData.departmentLevelActivities.map((activity, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Activity Description</label>
                            <input
                                type="text"
                                value={activity.activity}
                                onChange={(e) => {
                                    const updated = [...formData.departmentLevelActivities];
                                    updated[index] = { ...activity, activity: e.target.value };
                                    setFormData({ ...formData, departmentLevelActivities: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., Lab In-charge, Committee Member"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Duration</label>
                            <input
                                type="text"
                                value={activity.duration}
                                onChange={(e) => {
                                    const updated = [...formData.departmentLevelActivities];
                                    updated[index] = { ...activity, duration: e.target.value };
                                    setFormData({ ...formData, departmentLevelActivities: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., Jan 2023 - June 2023"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.departmentLevelActivities.filter((_, i) => i !== index);
                            setFormData({ ...formData, departmentLevelActivities: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Activity
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddActivity}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Department Level Activity
            </button>
        </section>
    );
}; 