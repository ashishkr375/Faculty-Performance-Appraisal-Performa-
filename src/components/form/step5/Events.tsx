import { OrganizationParticipation } from '@/types/form';

interface Props {
    formData: OrganizationParticipation;
    setFormData: (data: OrganizationParticipation) => void;
}

export const Events = ({ formData, setFormData }: Props) => {
    const handleAddEvent = () => {
        setFormData({
            ...formData,
            events: [...formData.events, {
                type: 'National',
                role: '',
                name: '',
                sponsor: '',
                startDate: '',
                endDate: '',
                participants: 0
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Workshops & Conferences</h2>
            <p className="text-sm text-gray-600 mb-4">
                [2 Marks per Event/Course for min. 5 working days, 3 Marks for International conferences]
            </p>
            {formData.events.map((event, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Event Type</label>
                            <select
                                value={event.type}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, type: e.target.value as 'National' | 'International' };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="National">National</option>
                                <option value="International">International</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2">Your Role</label>
                            <input
                                type="text"
                                value={event.role}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, role: e.target.value };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., Coordinator, Convener"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Event Name</label>
                            <input
                                type="text"
                                value={event.name}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, name: e.target.value };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Sponsored By</label>
                            <input
                                type="text"
                                value={event.sponsor}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, sponsor: e.target.value };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Start Date</label>
                            <input
                                type="date"
                                value={event.startDate}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, startDate: e.target.value };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">End Date</label>
                            <input
                                type="date"
                                value={event.endDate}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, endDate: e.target.value };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Number of Participants</label>
                            <input
                                type="number"
                                value={event.participants}
                                onChange={(e) => {
                                    const updated = [...formData.events];
                                    updated[index] = { ...event, participants: parseInt(e.target.value) };
                                    setFormData({ ...formData, events: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.events.filter((_, i) => i !== index);
                            setFormData({ ...formData, events: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Event
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddEvent}
                                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Event
            </button>
        </section>
    );
}; 