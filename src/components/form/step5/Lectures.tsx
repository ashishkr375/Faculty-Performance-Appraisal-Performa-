import { OrganizationParticipation } from '@/types/form';

interface Props {
    formData: OrganizationParticipation;
    setFormData: (data: OrganizationParticipation) => void;
}

export const Lectures = ({ formData, setFormData }: Props) => {
    const handleAddLecture = () => {
        setFormData({
            ...formData,
            lectures: [...formData.lectures, {
                title: '',
                details: ''
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Continuing Education/QIP Short Term Lectures</h2>
            <p className="text-sm text-gray-600 mb-4">[Max 01 mark @ 0.5 mark per lecture delivered]</p>
            {formData.lectures.map((lecture, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block mb-2">Title of Lecture/Series</label>
                            <input
                                type="text"
                                value={lecture.title}
                                onChange={(e) => {
                                    const updated = [...formData.lectures];
                                    updated[index] = { ...lecture, title: e.target.value };
                                    setFormData({ ...formData, lectures: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Date, Place and Programme Details</label>
                            <textarea
                                value={lecture.details}
                                onChange={(e) => {
                                    const updated = [...formData.lectures];
                                    updated[index] = { ...lecture, details: e.target.value };
                                    setFormData({ ...formData, lectures: updated });
                                }}
                                className="w-full p-2 border rounded"
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.lectures.filter((_, i) => i !== index);
                            setFormData({ ...formData, lectures: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Lecture
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddLecture}
                                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Lecture
            </button>
        </section>
    );
}; 