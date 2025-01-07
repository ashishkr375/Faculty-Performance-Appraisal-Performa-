import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

export const Internships = ({ formData, setFormData }: Props) => {
    const handleAddInternship = () => {
        setFormData({
            ...formData,
            internships: [...formData.internships, {
                studentName: '',
                qualification: '',
                affiliation: '',
                projectTitle: '',
                startDate: '',
                endDate: '',
                isExternal: false
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Internships</h2>
            <p className="text-sm text-gray-600 mb-4">
                [Max 04 marks: 02 marks per external student, 01 mark per internal student]
            </p>
            {formData.internships.map((internship, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Student Name</label>
                            <input
                                type="text"
                                value={internship.studentName}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, studentName: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Qualification</label>
                            <input
                                type="text"
                                value={internship.qualification}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, qualification: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., BTech/MTech/PhD"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Affiliation</label>
                            <input
                                type="text"
                                value={internship.affiliation}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, affiliation: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Project Title</label>
                            <input
                                type="text"
                                value={internship.projectTitle}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, projectTitle: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Start Date</label>
                            <input
                                type="date"
                                value={internship.startDate}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, startDate: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">End Date</label>
                            <input
                                type="date"
                                value={internship.endDate}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, endDate: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Student Type</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={internship.isExternal}
                                    onChange={(e) => {
                                        const updated = [...formData.internships];
                                        updated[index] = { ...internship, isExternal: e.target.checked };
                                        setFormData({ ...formData, internships: updated });
                                    }}
                                    className="mr-2"
                                />
                                <span>External Student</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.internships.filter((_, i) => i !== index);
                            setFormData({ ...formData, internships: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Internship
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddInternship}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Internship
            </button>
        </section>
    );
}; 