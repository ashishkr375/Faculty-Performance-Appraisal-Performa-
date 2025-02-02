import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

const DESCRIPTION = {
    title: "Internships offered during the appraisal period",
    description: "Maximum 04 marks:\n" +
        "• 02 marks for each registered external student (other than the institute) for a minimum period of one month\n" +
        "• 01 mark for each registered internal student (NIT Patna) for a minimum period of one month",
    note: "For more than one supervisor, marks will be divided equally",
    fields: {
        name: "Name of registered student",
        qualification: "Qualification of students, e.g., BTech/MTech/PhD",
        affiliation: "Affiliation of the student",
        project: "Title of project during training",
        startDate: "Start date",
        endDate: "End date"
    }
};

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
            <h2 className="text-xl font-semibold mb-2">{DESCRIPTION.title}</h2>
            <p className="text-gray-600 mb-2 whitespace-pre-line">{DESCRIPTION.description}</p>
            <p className="text-gray-600 mb-4 italic">{DESCRIPTION.note}</p>
            {formData.internships.map((internship, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.name}</label>
                            <input
                                type="text"
                                value={internship.studentName}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, studentName: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.qualification}</label>
                            <input
                                type="text"
                                value={internship.qualification}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, qualification: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                placeholder="e.g., BTech/MTech/PhD"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.affiliation}</label>
                            <input
                                type="text"
                                value={internship.affiliation}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, affiliation: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.project}</label>
                            <input
                                type="text"
                                value={internship.projectTitle}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, projectTitle: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.startDate}</label>
                            <input
                                type="date"
                                value={internship.startDate}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, startDate: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">{DESCRIPTION.fields.endDate}</label>
                            <input
                                type="date"
                                value={internship.endDate}
                                onChange={(e) => {
                                    const updated = [...formData.internships];
                                    updated[index] = { ...internship, endDate: e.target.value };
                                    setFormData({ ...formData, internships: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
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
                                    className="mr-2 text-gray-200"
                                    disabled={true}
                                />
                                <span>External Student</span>
                            </div>
                        </div>
                    </div>
                    {/* <button
                        type="button"
                        onClick={() => {
                            const updated = formData.internships.filter((_, i) => i !== index);
                            setFormData({ ...formData, internships: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Internship
                    </button> */}
                </div>
            ))}
            {/* <button
                type="button"
                onClick={handleAddInternship}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Internship
            </button> */}
        </section>
    );
}; 