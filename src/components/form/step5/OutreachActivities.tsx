import { OrganizationParticipation } from '@/types/form';

interface Props {
    formData: OrganizationParticipation;
    setFormData: (data: OrganizationParticipation) => void;
}

export const OutreachActivities = ({ formData, setFormData }: Props) => {
    const handleAddActivity = () => {
        setFormData({
            ...formData,
            outreachActivities: [...formData.outreachActivities, '']
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Outreach Activities</h2>
            <p className="text-sm text-gray-600 mb-4">
                [Maximum 07 marks @ 01 mark per activity]
                <br />
                <small>
                    Involvement with outside institutes, Network/Joint Projects, International & National 
                    Academics, Professional Societies, Industry/Govt./Public/Community Service, Editorial work, etc.
                </small>
            </p>
            {formData.outreachActivities.map((activity, index) => (
                <div key={index} className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={activity}
                            onChange={(e) => {
                                const updated = [...formData.outreachActivities];
                                updated[index] = e.target.value;
                                setFormData({ ...formData, outreachActivities: updated });
                            }}
                            className="w-full p-2 border rounded"
                            placeholder="Describe the outreach activity..."
                            required
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const updated = formData.outreachActivities.filter((_, i) => i !== index);
                                setFormData({ ...formData, outreachActivities: updated });
                            }}
                            className="text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddActivity}
                                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Activity
            </button>
        </section>
    );
}; 