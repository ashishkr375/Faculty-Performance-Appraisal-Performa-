import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

export const Startups = ({ formData, setFormData }: Props) => {
    const handleAddStartup = () => {
        setFormData({
            ...formData,
            startups: [...formData.startups, {
                name: '',
                incubationPlace: '',
                registrationDate: '',
                owners: '',
                annualIncome: 0,
                panNumber: ''
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Startups</h2>
            <p className="text-sm text-gray-600 mb-4">
                [Max 06 marks @ 02 marks for registered startup, 03-06 marks based on annual revenue]
            </p>
            {formData.startups.map((startup, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Startup Name</label>
                            <input
                                type="text"
                                value={startup.name}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, name: e.target.value };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Place of Incubation</label>
                            <input
                                type="text"
                                value={startup.incubationPlace}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, incubationPlace: e.target.value };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., TBI NIT Patna"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Registration Date</label>
                            <input
                                type="date"
                                value={startup.registrationDate}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, registrationDate: e.target.value };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Owners & Founders</label>
                            <input
                                type="text"
                                value={startup.owners}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, owners: e.target.value };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Annual Income (₹)</label>
                            <input
                                type="number"
                                value={startup.annualIncome}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, annualIncome: parseFloat(e.target.value) };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">PAN Number</label>
                            <input
                                type="text"
                                value={startup.panNumber}
                                onChange={(e) => {
                                    const updated = [...formData.startups];
                                    updated[index] = { ...startup, panNumber: e.target.value };
                                    setFormData({ ...formData, startups: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.startups.filter((_, i) => i !== index);
                            setFormData({ ...formData, startups: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Startup
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddStartup}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Startup
            </button>
        </section>
    );
}; 