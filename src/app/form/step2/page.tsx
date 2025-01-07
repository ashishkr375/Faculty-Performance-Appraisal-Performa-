'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { InstructionalElement, TeachingCourse, ProjectSupervision } from '@/types/form';

const COURSE_LEVELS = ['UG I', 'UG II', 'PG', 'Ph.D.'] as const;
const SEMESTERS = ['First', 'Second'] as const;

export default function Step2Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<InstructionalElement>({
        courses: [],
        innovations: [],
        newLabs: [],
        otherTasks: [],
        projectSupervision: {
            btech: [],
            mtech: []
        },
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=2');
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                }
            } catch (error) {
                console.error('Error fetching saved data:', error);
            }
            setLoading(false);
        };

        fetchSavedData();
    }, [status, router]);

    const handleCourseChange = (index: number, field: keyof TeachingCourse, value: any) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index] = { ...updatedCourses[index], [field]: value };
        setFormData({ ...formData, courses: updatedCourses });
    };

    const handleAddCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, {
                semester: 'First',
                level: 'UG I',
                courseNo: '',
                title: '',
                type: 'Core',
                studentCount: 0,
                weeklyLoadL: 0,
                weeklyLoadT: 0,
                weeklyLoadP: 0,
                totalTheoryHours: 0,
                totalLabHours: 0,
                yearsOffered: 0
            }]
        });
    };

    const handleRemoveCourse = (index: number) => {
        const updatedCourses = formData.courses.filter((_, i) => i !== index);
        setFormData({ ...formData, courses: updatedCourses });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 2,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step3');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleAddInnovation = () => {
        setFormData({
            ...formData,
            innovations: [...formData.innovations, '']
        });
    };

    const handleInnovationChange = (index: number, value: string) => {
        const updatedInnovations = [...formData.innovations];
        updatedInnovations[index] = value;
        setFormData({ ...formData, innovations: updatedInnovations });
    };

    const handleAddLab = () => {
        setFormData({
            ...formData,
            newLabs: [...formData.newLabs, '']
        });
    };

    const handleLabChange = (index: number, value: string) => {
        const updatedLabs = [...formData.newLabs];
        updatedLabs[index] = value;
        setFormData({ ...formData, newLabs: updatedLabs });
    };

    const handleAddTask = () => {
        setFormData({
            ...formData,
            otherTasks: [...formData.otherTasks, '']
        });
    };

    const handleTaskChange = (index: number, value: string) => {
        const updatedTasks = [...formData.otherTasks];
        updatedTasks[index] = value;
        setFormData({ ...formData, otherTasks: updatedTasks });
    };

    const handleAddBTechProject = () => {
        setFormData({
            ...formData,
            projectSupervision: {
                ...formData.projectSupervision,
                btech: [...formData.projectSupervision.btech, {
                    title: '',
                    students: '',
                    internalSupervisors: '',
                    externalSupervisors: ''
                }]
            }
        });
    };

    const handleAddMTechProject = () => {
        setFormData({
            ...formData,
            projectSupervision: {
                ...formData.projectSupervision,
                mtech: [...formData.projectSupervision.mtech, {
                    title: '',
                    students: '',
                    internalSupervisors: '',
                    externalSupervisors: ''
                }]
            }
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Teaching Engagement</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {formData.courses.map((course, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Semester</label>
                                <select
                                    value={course.semester}
                                    onChange={(e) => handleCourseChange(index, 'semester', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {SEMESTERS.map((sem) => (
                                        <option key={sem} value={sem}>
                                            {sem} Semester
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Level</label>
                                <select
                                    value={course.level}
                                    onChange={(e) => handleCourseChange(index, 'level', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Level</option>
                                    {COURSE_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Course Number</label>
                                <input
                                    type="text"
                                    value={course.courseNo}
                                    onChange={(e) => handleCourseChange(index, 'courseNo', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g., CS101"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => handleCourseChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="e.g., Introduction to Programming"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Core/Elective</label>
                                <select
                                    value={course.type}
                                    onChange={(e) => handleCourseChange(index, 'type', e.target.value)}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="Core">Core</option>
                                    <option value="Elective">Elective</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">No of Students</label>
                                <input
                                    type="number"
                                    value={course.studentCount}
                                    onChange={(e) => handleCourseChange(index, 'studentCount', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Weekly Load (L/T/P)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={course.weeklyLoadL}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadL', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded"
                                        placeholder="L"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={course.weeklyLoadT}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadT', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded"
                                        placeholder="T"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={course.weeklyLoadP}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadP', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded"
                                        placeholder="P"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2">Total Theory & Lab Hours</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={course.totalTheoryHours}
                                        onChange={(e) => handleCourseChange(index, 'totalTheoryHours', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded"
                                        placeholder="Theory"
                                        required
                                    />
                                    <input
                                        type="number"
                                        value={course.totalLabHours}
                                        onChange={(e) => handleCourseChange(index, 'totalLabHours', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded"
                                        placeholder="Lab"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2">Years Offered</label>
                                <input
                                    type="number"
                                    value={course.yearsOffered}
                                    onChange={(e) => handleCourseChange(index, 'yearsOffered', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveCourse(index)}
                            className="text-red-500 text-sm"
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
                    + Add Course
                </button>

                {/* Innovations Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Innovations in Teaching</h2>
                    <p className="text-sm text-gray-600 mb-4">[Max marks 02 @ 01 per innovation]</p>
                    {formData.innovations.map((innovation, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={innovation}
                                    onChange={(e) => handleInnovationChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Describe innovation..."
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newInnovations = formData.innovations.filter((_, i) => i !== index);
                                        setFormData({ ...formData, innovations: newInnovations });
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
                        onClick={handleAddInnovation}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Innovation
                    </button>
                </div>

                {/* New Labs Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">New Laboratory/Experiment Development</h2>
                    <p className="text-sm text-gray-600 mb-4">[02 marks per new laboratory/01 mark per new experiment]</p>
                    {formData.newLabs.map((lab, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={lab}
                                    onChange={(e) => handleLabChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Describe new lab/experiment..."
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newLabs = formData.newLabs.filter((_, i) => i !== index);
                                        setFormData({ ...formData, newLabs: newLabs });
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
                        onClick={handleAddLab}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Lab/Experiment
                    </button>
                </div>

                {/* Other Tasks Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Other Instructional Tasks</h2>
                    <p className="text-sm text-gray-600 mb-4">[Max marks: 02 @ 01 mark per task]</p>
                    {formData.otherTasks.map((task, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={task}
                                    onChange={(e) => handleTaskChange(index, e.target.value)}
                                    className="w-full p-2 border rounded"
                                    placeholder="Describe task..."
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newTasks = formData.otherTasks.filter((_, i) => i !== index);
                                        setFormData({ ...formData, otherTasks: newTasks });
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
                        onClick={handleAddTask}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Task
                    </button>
                </div>

                {/* Project Supervision Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Project and Thesis Supervision</h2>
                    <p className="text-sm text-gray-600 mb-4">[Max marks: 10]</p>

                    {/* B.Tech Projects */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">B.Tech Projects (2 marks per project)</h3>
                        {formData.projectSupervision.btech.map((project, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-2">Title of Project/Thesis</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.btech];
                                                updated[index] = { ...project, title: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        btech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Names/Roll Nos of Students</label>
                                        <input
                                            type="text"
                                            value={project.students}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.btech];
                                                updated[index] = { ...project, students: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        btech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Other Supervisors (if any)</label>
                                        <input
                                            type="text"
                                            value={project.internalSupervisors}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.btech];
                                                updated[index] = { ...project, internalSupervisors: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        btech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">External Supervisors (if any)</label>
                                        <input
                                            type="text"
                                            value={project.externalSupervisors}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.btech];
                                                updated[index] = { ...project, externalSupervisors: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        btech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = formData.projectSupervision.btech.filter((_, i) => i !== index);
                                        setFormData({
                                            ...formData,
                                            projectSupervision: {
                                                ...formData.projectSupervision,
                                                btech: updated
                                            }
                                        });
                                    }}
                                    className="mt-2 text-red-500 underline"
                                >
                                    Remove Project
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddBTechProject}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                        >
                            + Add B.Tech Project
                        </button>
                    </div>

                    {/* M.Tech/MSc/MCA/MBA Projects */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">M.Tech/MSc/MCA/MBA Projects (3 marks per project)</h3>
                        {formData.projectSupervision.mtech.map((project, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-2">Title of Project/Thesis/Dissertation</label>
                                        <input
                                            type="text"
                                            value={project.title}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.mtech];
                                                updated[index] = { ...project, title: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        mtech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Names/Roll Nos of Students</label>
                                        <input
                                            type="text"
                                            value={project.students}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.mtech];
                                                updated[index] = { ...project, students: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        mtech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">Other Supervisors (if any)</label>
                                        <input
                                            type="text"
                                            value={project.internalSupervisors}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.mtech];
                                                updated[index] = { ...project, internalSupervisors: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        mtech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">External Supervisors (if any)</label>
                                        <input
                                            type="text"
                                            value={project.externalSupervisors}
                                            onChange={(e) => {
                                                const updated = [...formData.projectSupervision.mtech];
                                                updated[index] = { ...project, externalSupervisors: e.target.value };
                                                setFormData({
                                                    ...formData,
                                                    projectSupervision: {
                                                        ...formData.projectSupervision,
                                                        mtech: updated
                                                    }
                                                });
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = formData.projectSupervision.mtech.filter((_, i) => i !== index);
                                        setFormData({
                                            ...formData,
                                            projectSupervision: {
                                                ...formData.projectSupervision,
                                                mtech: updated
                                            }
                                        });
                                    }}
                                    className="mt-2 text-red-500 text-sm"
                                >
                                    Remove Project
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddMTechProject}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                        >
                            + Add M.Tech/MSc/MCA/MBA Project
                        </button>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step1')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Research & Publications
                    </button>
                </div>
            </form>
        </div>
    );
}
