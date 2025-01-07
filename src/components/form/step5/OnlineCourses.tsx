import { OrganizationParticipation } from '@/types/form';

interface Props {
    formData: OrganizationParticipation;
    setFormData: (data: OrganizationParticipation) => void;
}

export const OnlineCourses = ({ formData, setFormData }: Props) => {
    const handleAddCourse = () => {
        setFormData({
            ...formData,
            onlineCourses: [...formData.onlineCourses, {
                type: '',
                title: '',
                ltp: '',
                level: '',
                duration: 0,
                completed: false
            }]
        });
    };

    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">MOOC/NPTEL/Online Courses</h2>
            <p className="text-sm text-gray-600 mb-4">
                [0.5 mark per course offered/01 mark for attending a full course with completion certificate]
            </p>
            {formData.onlineCourses.map((course, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Course Type</label>
                            <input
                                type="text"
                                value={course.type}
                                onChange={(e) => {
                                    const updated = [...formData.onlineCourses];
                                    updated[index] = { ...course, type: e.target.value };
                                    setFormData({ ...formData, onlineCourses: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., MOOC, NPTEL, Coursera"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Course Title</label>
                            <input
                                type="text"
                                value={course.title}
                                onChange={(e) => {
                                    const updated = [...formData.onlineCourses];
                                    updated[index] = { ...course, title: e.target.value };
                                    setFormData({ ...formData, onlineCourses: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">L-T-P</label>
                            <input
                                type="text"
                                value={course.ltp}
                                onChange={(e) => {
                                    const updated = [...formData.onlineCourses];
                                    updated[index] = { ...course, ltp: e.target.value };
                                    setFormData({ ...formData, onlineCourses: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., 3-0-0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Level</label>
                            <input
                                type="text"
                                value={course.level}
                                onChange={(e) => {
                                    const updated = [...formData.onlineCourses];
                                    updated[index] = { ...course, level: e.target.value };
                                    setFormData({ ...formData, onlineCourses: updated });
                                }}
                                className="w-full p-2 border rounded"
                                placeholder="UG/PG"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Duration (weeks)</label>
                            <input
                                type="number"
                                value={course.duration}
                                onChange={(e) => {
                                    const updated = [...formData.onlineCourses];
                                    updated[index] = { ...course, duration: parseInt(e.target.value) };
                                    setFormData({ ...formData, onlineCourses: updated });
                                }}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Completion Status</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={course.completed}
                                    onChange={(e) => {
                                        const updated = [...formData.onlineCourses];
                                        updated[index] = { ...course, completed: e.target.checked };
                                        setFormData({ ...formData, onlineCourses: updated });
                                    }}
                                    className="mr-2"
                                />
                                <span>Completed with Certificate</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const updated = formData.onlineCourses.filter((_, i) => i !== index);
                            setFormData({ ...formData, onlineCourses: updated });
                        }}
                        className="mt-2 text-red-500 underline"
                    >
                        Remove Course
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddCourse}
                                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"

            >
                + Add Online Course
            </button>
        </section>
    );
}; 