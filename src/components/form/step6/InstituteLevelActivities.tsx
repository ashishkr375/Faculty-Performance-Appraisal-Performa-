import { ManagementDevelopment } from '@/types/form';

interface Props {
    formData: ManagementDevelopment;
    setFormData: (data: ManagementDevelopment) => void;
}

export const InstituteLevelActivities = ({ formData, setFormData }: Props) => {
    const handleAddActivity = () => {
        setFormData({
            ...formData,
            instituteLevelActivities: [...formData.instituteLevelActivities, {
                role: '',
                duration: '',
                marks: 0
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Institute Level Activities</h2>
            <p className="text-sm text-gray-600 mb-4">
                [Max 10 marks]
                <br />
                <small>
                    02 marks/semester for Head of Department, Dean, Chief Warden, etc.
                    <br />
                    01 mark/semester for Warden, Assistant Warden, Associate Dean, etc.
                    <br />
                    0.5 marks/semester for Committee Chairperson/Convener
                </small>
            </p>
            {formData.instituteLevelActivities.map((activity, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Role/Position</label>
                            <input
                                type="text"
                                value={activity.role}
                                onChange={(e) => {
                                    const updated = [...formData.instituteLevelActivities];
                                    updated[index] = { ...activity, role: e.target.value };
                                    setFormData({ ...formData, instituteLevelActivities: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                placeholder="e.g., HOD, Dean, Warden"
                                required
                                disabled={true}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Duration</label>
                            <input
                                type="text"
                                value={activity.duration}
                                onChange={(e) => {
                                    const updated = [...formData.instituteLevelActivities];
                                    updated[index] = { ...activity, duration: e.target.value };
                                    setFormData({ ...formData, instituteLevelActivities: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                placeholder="e.g., Jan 2023 - June 2023"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Marks Claimed</label>
                            {/* <input type="text" className='w-full p-2 border rounded bg-gray-200' disabled={true} value={activity.marks} /> */}
                            <select
                                value={activity.marks}
                                onChange={(e) => {
                                    const updated = [...formData.instituteLevelActivities];
                                    updated[index] = { ...activity, marks: parseFloat(e.target.value) };
                                    setFormData({ ...formData, instituteLevelActivities: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="2">2 marks/semester (HOD/Dean level)</option>
                                <option value="1">1 mark/semester (Warden/Associate Dean)</option>
                                <option value="0.5">0.5 marks/semester (Committee Chair)</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.instituteLevelActivities.filter((_, i) => i !== index);
                            setFormData({ ...formData, instituteLevelActivities: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Activity
                    </button>
                </div>
            ))}
            {/* <button
                type="button"
                onClick={handleAddActivity}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Institute Level Activity
            </button> */}
        </section>
    );
}; 