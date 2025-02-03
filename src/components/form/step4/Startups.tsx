import { SponsoredRD } from '@/types/form';

interface Props {
    formData: SponsoredRD;
    setFormData: (data: SponsoredRD) => void;
}

const DESCRIPTION = {
    title: "Startup",
    description: "Maximum 06 marks:\n" +
        "• 02 marks for registered startup as a firm/company as per Indian govt. act\n" +
        "• 03 marks per startup for annual revenue from 50K to 1 Lakh\n" +
        "• 04 marks per startup for annual revenue between 1-5 Lakhs\n" +
        "• 05 marks per startup for annual revenue between 5 to 10 Lakhs\n" +
        "• 06 marks per startup for annual revenue greater than 10 Lakhs",
    fields: {
        name: "Name of startup",
        incubation: "Place of incubation (e.g., TBI NIT Patna or other)",
        registration: "Date of registration as firm/company as per Indian govt. act",
        owners: "Name of owner(s) and founder(s)",
        revenue: "Annual Income (INR)",
        pan: "PAN no of reg. startup"
    }
};

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
            <h2 className="text-xl font-semibold mb-2">{DESCRIPTION.title}</h2>
            <p className="text-gray-600 mb-2 whitespace-pre-line">{DESCRIPTION.description}</p>
            
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true} 
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
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
                                className="w-full p-2 border rounded bg-gray-200"
                                disabled={true}
                                required
                            />
                        </div>
                    </div>
                    {/* <button
                        type="button"
                        onClick={() => {
                            const updated = formData.startups.filter((_, i) => i !== index);
                            setFormData({ ...formData, startups: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Startup
                    </button> */}
                </div>
            ))}
            {/* <button
                type="button"
                onClick={handleAddStartup}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
                + Add Startup
            </button> */}
        </section>
    );
}; 