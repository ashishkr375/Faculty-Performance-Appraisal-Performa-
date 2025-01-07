import { OrganizationParticipation } from '@/types/form';

interface Props {
    formData: OrganizationParticipation;
    setFormData: (data: OrganizationParticipation) => void;
}

export const Visits = ({ formData, setFormData }: Props) => {
    const handleAddVisit = () => {
        setFormData({
            ...formData,
            visits: [...formData.visits, {
                institution: '',
                purpose: '',
                startDate: '',
                endDate: '',
                funding: ''
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Visit to Outside Institute/Organization</h2>
            <p className="text-sm text-gray-600 mb-4">[0.5 mark per visit, max 1 mark]</p>
            {formData.visits.map((visit, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Institution/Organization</label>
                            <input
                                type="text"
                                value={visit.institution}
                                onChange={(e) => {
                                    const updated = [...formData.visits];
                                    updated[index] = { ...visit, institution: e.target.value };
                                    setFormData({ ...formData, visits: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Purpose of Visit</label>
                            <input
                                type="text"
                                value={visit.purpose}
                                onChange={(e) => {
                                    const updated = [...formData.visits];
                                    updated[index] = { ...visit, purpose: e.target.value };
                                    setFormData({ ...formData, visits: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Start Date</label>
                            <input
                                type="date"
                                value={visit.startDate}
                                onChange={(e) => {
                                    const updated = [...formData.visits];
                                    updated[index] = { ...visit, startDate: e.target.value };
                                    setFormData({ ...formData, visits: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">End Date</label>
                            <input
                                type="date"
                                value={visit.endDate}
                                onChange={(e) => {
                                    const updated = [...formData.visits];
                                    updated[index] = { ...visit, endDate: e.target.value };
                                    setFormData({ ...formData, visits: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block mb-2">Funding Details</label>
                            <input
                                type="text"
                                value={visit.funding}
                                onChange={(e) => {
                                    const updated = [...formData.visits];
                                    updated[index] = { ...visit, funding: e.target.value };
                                    setFormData({ ...formData, visits: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="Was it approved/financed by the institute or project?"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.visits.filter((_, i) => i !== index);
                            setFormData({ ...formData, visits: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Visit
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddVisit}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Visit
            </button>
        </section>
    );
}; 