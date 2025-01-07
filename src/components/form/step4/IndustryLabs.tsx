import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

export const IndustryLabs = ({ formData, setFormData }: Props) => {
    const handleAddLab = () => {
        setFormData({
            ...formData,
            industryLabs: [...formData.industryLabs, {
                industryName: '',
                fundReceived: 0,
                equipmentName: '',
                location: ''
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Industry Sponsored Labs</h2>
            <p className="text-sm text-gray-600 mb-4">[Max marks: 05]</p>
            {formData.industryLabs.map((lab, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Industry Name</label>
                            <input
                                type="text"
                                value={lab.industryName}
                                onChange={(e) => {
                                    const updated = [...formData.industryLabs];
                                    updated[index] = { ...lab, industryName: e.target.value };
                                    setFormData({ ...formData, industryLabs: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Fund Received (₹)</label>
                            <input
                                type="number"
                                value={lab.fundReceived}
                                onChange={(e) => {
                                    const updated = [...formData.industryLabs];
                                    updated[index] = { ...lab, fundReceived: parseFloat(e.target.value) };
                                    setFormData({ ...formData, industryLabs: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Equipment Name</label>
                            <input
                                type="text"
                                value={lab.equipmentName}
                                onChange={(e) => {
                                    const updated = [...formData.industryLabs];
                                    updated[index] = { ...lab, equipmentName: e.target.value };
                                    setFormData({ ...formData, industryLabs: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Location</label>
                            <input
                                type="text"
                                value={lab.location}
                                onChange={(e) => {
                                    const updated = [...formData.industryLabs];
                                    updated[index] = { ...lab, location: e.target.value };
                                    setFormData({ ...formData, industryLabs: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.industryLabs.filter((_, i) => i !== index);
                            setFormData({ ...formData, industryLabs: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Lab
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddLab}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Industry Lab
            </button>
        </section>
    );
}; 