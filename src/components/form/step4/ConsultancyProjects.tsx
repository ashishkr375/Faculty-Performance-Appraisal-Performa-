import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

const DESCRIPTION = {
    title: "Consultancy Projects",
    description: "Maximum 08 marks. Up to Rs. 50,000/-: 01 mark. After increment of each Rs. 50,000/- one mark will be added maximum up to 08 marks."
};

export const ConsultancyProjects = ({ formData, setFormData }: Props) => {
    const handleAddProject = () => {
        setFormData({
            ...formData,
            consultancyProjects: [...formData.consultancyProjects, {
                title: '',
                fundingAgency: '',
                financialOutlay: 0,
                startDate: '',
                period: '',
                investigators: '',
                status: 'Started'
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-2">{DESCRIPTION.title}</h2>
            <p className="text-gray-600 mb-4">{DESCRIPTION.description}</p>
            {formData.consultancyProjects.map((project, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Project Title</label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, title: e.target.value };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Funding Agency</label>
                            <input
                                type="text"
                                value={project.fundingAgency}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, fundingAgency: e.target.value };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Financial Outlay (₹)</label>
                            <input
                                type="number"
                                value={project.financialOutlay}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, financialOutlay: parseFloat(e.target.value) };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Start Date</label>
                            <input
                                type="date"
                                value={project.startDate}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, startDate: e.target.value };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Period (in months)</label>
                            <input
                                type="text"
                                value={project.period}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, period: e.target.value };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Investigators</label>
                            <input
                                type="text"
                                value={project.investigators}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, investigators: e.target.value };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Status</label>
                            <select
                                value={project.status}
                                onChange={(e) => {
                                    const updated = [...formData.consultancyProjects];
                                    updated[index] = { ...project, status: e.target.value as 'Started' | 'Completed' | 'In Progress' };
                                    setFormData({ ...formData, consultancyProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                required
                                disabled={true}
                            >
                                <option value="Started">Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Terminated">Terminated</option>
                                <option value="Ongoing">Ongoing</option>
                            </select>
                        </div>
                    </div>
                    {/* <button
                        type="button"
                        onClick={() => {
                            const updated = formData.consultancyProjects.filter((_, i) => i !== index);
                            setFormData({ ...formData, consultancyProjects: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Project
                    </button> */}
                </div>
            ))}
            {/* <button
                type="button"
                onClick={handleAddProject}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Consultancy Project
            </button> */}
        </section>
    );
}; 