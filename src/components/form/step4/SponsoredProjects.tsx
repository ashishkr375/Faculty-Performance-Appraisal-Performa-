import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

const DESCRIPTION = {
    title: "Sponsored Research Projects from any Govt. agency/industry/institute",
    description: "Project under TEQIP/Institute grant shall not be considered for marks:\n" +
        "• 01 mark for each submitted research project (maximum up to 02 marks)\n" +
        "• 03 marks for completion/ongoing status, of each sponsored research project with grant ≤ Rs. 5 lacs\n" +
        "• 04 marks for completion/ongoing status, of each sponsored research project with grant between Rs. 5 to Rs. 10 lacs\n" +
        "• 05 marks for completion/ongoing status, of each sponsored research project with grant ≥ Rs. 10 lacs",
    notes: [
        "1. Sponsored research project from industry: With the condition that for a research project, grant from the industry must be received in the institute account will only be considered as 'Sponsored research project from industry'.",
        "2. Faculty as a PI/Co-PI of an external sponsored research projects submitted from any institute other than NIT Patna: With the condition that for such a research project, complete grant/share of grant from the funding agency must be received in the institute (NIT Patna) account will only be considered."
    ]
};

export const SponsoredProjects = ({ formData, setFormData }: Props) => {
    const handleAddProject = () => {
        setFormData({
            ...formData,
            sponsoredProjects: [...formData.sponsoredProjects, {
                title: '',
                fundingAgency: '',
                financialOutlay: 0,
                startDate: '',
                endDate: '',
                investigators: '',
                piInstitute: '',
                status: 'Started',
                fundReceived: 0
            }]
        });
    };

    return (
        <section>
            {formData.sponsoredProjects.map((project, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Project Title</label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => {
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, title: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
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
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, fundingAgency: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
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
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, financialOutlay: parseInt(e.target.value) };
                                    setFormData({ ...formData, sponsoredProjects: updated });
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
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, startDate: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">End Date</label>
                            <input
                                type="date"
                                value={project.endDate}
                                onChange={(e) => {
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, endDate: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                required
                                disabled={true}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Name of P.I and other Investigators</label>
                            <input
                                type="text"
                                value={project.investigators}
                                onChange={(e) => {
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, investigators: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">PI Institute Name</label>
                            <input
                                type="text"
                                value={project.piInstitute}
                                onChange={(e) => {
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, piInstitute: e.target.value };
                                    setFormData({ ...formData, sponsoredProjects: updated });
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
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, status: e.target.value as 'Started' | 'Completed' | 'In Progress' };
                                    setFormData({ ...formData, sponsoredProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                required
                                disabled={true}
                            >
                                <option value="Started">Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Funds Received by NIT Patna (₹)</label>
                            <input
                                type="number"
                                value={project.fundReceived}
                                onChange={(e) => {
                                    const updated = [...formData.sponsoredProjects];
                                    updated[index] = { ...project, fundReceived: parseInt(e.target.value) };
                                    setFormData({ ...formData, sponsoredProjects: updated });
                                }}
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.sponsoredProjects.filter((_, i) => i !== index);
                            setFormData({ ...formData, sponsoredProjects: updated });
                        }}
                        className="mt-2 text-red-500 text-sm"
                    >
                        Remove Project
                    </button>
                </div>
            ))}
            {/* <button
                type="button"
                onClick={handleAddProject}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Sponsored Project
            </button> */}
        </section>
    );
}; 