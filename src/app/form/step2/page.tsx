'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { TeachingCourse } from '@/types/form';
import Loading from '@/app/loading';
import { fetchFacultyData } from '@/lib/fetchFacultyData';

const COURSE_LEVELS = ['UG', 'PG', 'PhD','Undergraduate','Postgraduate'] as const;
const SEMESTERS = ['Spring', 'Summer', 'Autumn',"Fall","1","2","3","4","5","6","7","8"] as const;

// Add descriptions for each section
const SECTION_DESCRIPTIONS = {
    teachingEngagement: {
        title: "Teaching Engagement",
        description: "Only courses with at least 5 enrolled students will be considered. Maximum marks: 14 for both semesters. Distribution: 01 mark per 01 hour Lecture/Tutorial class and 0.5 marks per 01 hour practical class.",
        courseFields: {
            courseNo: "Course Number as per institute records",
            title: "Official course title",
            type: "Specify if the course is Core or Elective",
            studentCount: "Number of enrolled students (minimum 5 required)",
            weeklyLoad: "Weekly teaching hours - Lecture (L), Tutorial (T), and Practical (P)",
            totalHours: "Total theory and laboratory hours conducted",
            yearsOffered: "Number of years continuously offering this course"
        }
    },
    innovations: {
        title: "Innovations in Teaching",
        description: "Maximum marks: 02 (01 mark per innovation). Describe any innovative teaching methods, tools, or approaches implemented during the reporting period."
    },
    newLabs: {
        title: "New Laboratory/Experiment Development",
        description: "02 marks per new laboratory developed, 01 mark per new experiment. Provide details of new laboratories or experiments developed during the reporting period."
    },
    otherTasks: {
        title: "Other Instructional Tasks",
        description: "Maximum marks: 02 (01 mark per task). Include development of Instructional software, Education technology packages (including ETV films, modular courses, practical supervision etc.)."
    },
    projectSupervision: {
        title: "Project and Thesis Supervision",
        description: "Maximum marks: 10",
        btech: {
            title: "B.Tech Projects",
            description: "02 marks per project/group",
            fields: {
                title: "Complete title of the Project/Thesis/Dissertation",
                students: "Names and Roll Numbers of all students in the group",
                internalSupervisors: "Names of other NIT Patna supervisors, if any",
                externalSupervisors: "Names and affiliations of external supervisors, if any"
            }
        },
        mtech: {
            title: "M.Tech/MSc/MCA/MBA Projects",
            description: "03 marks per project/group",
            fields: {
                title: "Complete title of the Project/Thesis/Dissertation",
                students: "Names and Roll Numbers of all students in the group",
                internalSupervisors: "Names of other NIT Patna supervisors, if any",
                externalSupervisors: "Names and affiliations of external supervisors, if any"
            }
        }
    }
};

interface FormData {
    teachingEngagement: {
        courses: TeachingCourse[];
    };
    innovations: string[];
    newLabs: string[];
    otherTasks: string[];
    projectSupervision: {
        btech: Array<{
            title: string;
            students: string;
            internalSupervisors: string;
            externalSupervisors: string;
        }>;
        mtech: Array<{
            title: string;
            students: string;
            internalSupervisors: string;
            externalSupervisors: string;
        }>;
    };
}

export default function Step2Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        teachingEngagement: {
            courses: []
        },
        innovations: [],
        newLabs: [],
        otherTasks: [],
        projectSupervision: {
            btech: [],
            mtech: []
        }
    });
    const [loading, setLoading] = useState(true);
    const [yearRange, setYearRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [hasAdminData, setHasAdminData] = useState(false);

    useEffect(() => {
        const fetchYearRange = async () => {
            try {
                const response = await fetch('/api/get-part?step=1');
                const data = await response.json();
                if (data?.appraisalPeriodStart && data?.appraisalPeriodEnd) {
                    setYearRange({
                        start: new Date(data.appraisalPeriodStart).getFullYear().toString(),
                        end: new Date(data.appraisalPeriodEnd).getFullYear().toString()
                    });
                }
            } catch (error) {
                console.error('Error fetching year range:', error);
            }
        };

        fetchYearRange();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.email || status !== 'authenticated') {
                return;
            }

            setLoading(true);
            try {
                const formResponse = await fetch('/api/get-part?step=2');
                const existingData = formResponse.ok ? await formResponse.json() : null;

                if (existingData && Object.keys(existingData).length > 0) {
                    setFormData(prevData => ({
                        ...prevData,
                        ...existingData,
                    }));
                    const facultyData = await fetchFacultyData(session?.user?.email || '');
                    let courses = [];
                    if (facultyData?.teaching_engagement) {
                        courses = facultyData.teaching_engagement.map((engagement) => ({
                            semester: engagement.semester,
                            courseNo: engagement.course_number,
                            title: engagement.course_title,
                            studentCount: engagement.student_count,
                            academicYear: engagement.academic_year,
                            teachingHoursPerWeek: engagement.teaching_hours_per_week,
                            level: engagement.level,
                            type: engagement.course_type,
                            weeklyLoadL: engagement.lectures,
                            weeklyLoadT: engagement.tutorials,
                            weeklyLoadP: engagement.practicals,
                            totalTheoryHours: engagement.total_theory,
                            totalLabHours: engagement.lab_hours,
                            yearsOffered: engagement.years_offered,
                        }));
                    }

                    const projectSupervision = { btech: [], mtech: [] };
                    if (facultyData?.project_supervision) {
                        facultyData.project_supervision.forEach((project) => {
                            const projectData = {
                                title: project.project_title,
                                students: project.student_details,
                                internalSupervisors: project.internal_supervisors,
                                externalSupervisors: project.external_supervisors,
                            };

                            if (project.category === 'Undergraduate') {
                                projectSupervision.btech.push(projectData);
                            } else if (project.category === 'Postgraduate') {
                                projectSupervision.mtech.push(projectData);
                            }
                        });
                    }

                    let workshopsConferences = [];
                    if (facultyData?.workshops_conferences) {
                        workshopsConferences = facultyData.workshops_conferences.map((event) => ({
                            id: event.id,
                            email: event.email,
                            event_type: event.event_type,
                            role: event.role,
                            event_name: event.event_name,
                            sponsored_by: event.sponsored_by,
                            start_date: event.start_date,
                            end_date: event.end_date,
                            participants_count: event.participants_count,
                        }));
                    }

                    setFormData(prevData => ({
                        ...prevData,
                        teachingEngagement: { courses:courses },
                        projectSupervision,
                        workshopsConferences,
                    }));

                } else {
                    const facultyData = await fetchFacultyData(session?.user?.email || '');
                    let courses = [];
                    if (facultyData?.teaching_engagement) {
                        courses = facultyData.teaching_engagement.map((engagement) => ({
                            semester: engagement.semester,
                            courseNo: engagement.course_number,
                            title: engagement.course_title,
                            studentCount: engagement.student_count,
                            academicYear: engagement.academic_year,
                            teachingHoursPerWeek: engagement.teaching_hours_per_week,
                            level: engagement.level,
                            type: engagement.course_type,
                            weeklyLoadL: engagement.lectures,
                            weeklyLoadT: engagement.tutorials,
                            weeklyLoadP: engagement.practicals,
                            totalTheoryHours: engagement.total_theory,
                            totalLabHours: engagement.lab_hours,
                            yearsOffered: engagement.years_offered,
                        }));
                    }

                    const projectSupervision = { btech: [], mtech: [] };
                    if (facultyData?.project_supervision) {
                        facultyData.project_supervision.forEach((project) => {
                            const projectData = {
                                title: project.project_title,
                                students: project.student_details,
                                internalSupervisors: project.internal_supervisors,
                                externalSupervisors: project.external_supervisors,
                            };

                            if (project.category === 'Undergraduate') {
                                projectSupervision.btech.push(projectData);
                            } else if (project.category === 'Postgraduate') {
                                projectSupervision.mtech.push(projectData);
                            }
                        });
                    }

                    let workshopsConferences = [];
                    if (facultyData?.workshops_conferences) {
                        workshopsConferences = facultyData.workshops_conferences.map((event) => ({
                            id: event.id,
                            email: event.email,
                            event_type: event.event_type,
                            role: event.role,
                            event_name: event.event_name,
                            sponsored_by: event.sponsored_by,
                            start_date: event.start_date,
                            end_date: event.end_date,
                            participants_count: event.participants_count,
                        }));
                    }

                    setFormData(prevData => ({
                        ...prevData,
                        teachingEngagement: { courses:courses },
                        projectSupervision,
                        workshopsConferences,
                        innovations: [],
                        newLabs: [],
                        otherTasks: [],
                    }));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, status]);

    const handleCourseChange = (index: number, field: keyof TeachingCourse, value: any) => {
        const updatedCourses = [...formData.teachingEngagement.courses];
        updatedCourses[index] = { ...updatedCourses[index], [field]: value };
        setFormData({
            ...formData,
            teachingEngagement: {
                ...formData.teachingEngagement,
                courses: updatedCourses
            }
        });
    };

    const handleAddCourse = () => {
        setFormData({
            ...formData,
            teachingEngagement: {
                ...formData.teachingEngagement,
                courses: [
                    ...formData.teachingEngagement.courses,
                    {
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
                    }
                ]
            }
        });
    };

    const handleRemoveCourse = (index: number) => {
        const updatedCourses = formData.teachingEngagement.courses.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            teachingEngagement: {
                ...formData.teachingEngagement,
                courses: updatedCourses
            }
        });
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
        setFormData({
            ...formData,
            innovations: updatedInnovations
        });
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
        setFormData({
            ...formData,
            newLabs: updatedLabs
        });
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
        setFormData({
            ...formData,
            otherTasks: updatedTasks
        });
    };

    const handleAddBTechProject = () => {
        setFormData({
            ...formData,
            projectSupervision: {
                ...formData.projectSupervision,
                btech: [
                    ...formData.projectSupervision.btech,
                    {
                        title: '',
                        students: '',
                        internalSupervisors: '',
                        externalSupervisors: ''
                    }
                ]
            }
        });
    };

    const handleAddMTechProject = () => {
        setFormData({
            ...formData,
            projectSupervision: {
                ...formData.projectSupervision,
                mtech: [
                    ...formData.projectSupervision.mtech,
                    {
                        title: '',
                        students: '',
                        internalSupervisors: '',
                        externalSupervisors: ''
                    }
                ]
            }
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Teaching Engagement</h1>
            <p className="text-gray-600 mb-6">{SECTION_DESCRIPTIONS.teachingEngagement.description}</p>

            {hasAdminData && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Some course data has been pre-filled from NITP admin database. Please fill in the remaining details manually.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" >
                {formData.teachingEngagement.courses.map((course, index) => (
                    <div key={index} className="border p-4 rounded-lg bg-white shadow-sm">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block mb-2">Semester</label>
                                <select
                                    value={course.semester}
                                    onChange={(e) => handleCourseChange(index, 'semester', e.target.value)}
                                    className="w-full p-2 border rounded bg-gray-200"
                                    disabled={true}
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {SEMESTERS.map((sem) => (
                                        <option key={sem} value={sem}>
                                            {sem}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2">Level</label>
                                <select
                                    value={course.level}
                                    onChange={(e) => handleCourseChange(index, 'level', e.target.value)}
                                    className="w-full p-2 border rounded bg-gray-200"
                                    required
                                    disabled={true}
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
                                    className="w-full p-2 border rounded bg-gray-200"
                                    placeholder="e.g., CS101"
                                    required
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Course Title</label>
                                <input
                                    type="text"
                                    value={course.title}
                                    onChange={(e) => handleCourseChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border rounded bg-gray-200"
                                    placeholder="e.g., Introduction to Programming"
                                    required
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Core/Elective</label>
                                <select
                                    value={course.type}
                                    onChange={(e) => handleCourseChange(index, 'type', e.target.value)}
                                    className="w-full p-2 border rounded bg-gray-200"
                                    disabled={true}
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
                                    className="w-full p-2 border rounded bg-gray-200"
                                    required
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Weekly Load (L/T/P)</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={course.weeklyLoadL}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadL', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        placeholder="L"
                                        required
                                        disabled={true}
                                    />
                                    <input
                                        type="number"
                                        value={course.weeklyLoadT}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadT', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        placeholder="T"
                                        required
                                        disabled={true}
                                    />
                                    <input
                                        type="number"
                                        value={course.weeklyLoadP}
                                        onChange={(e) => handleCourseChange(index, 'weeklyLoadP', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        placeholder="P"
                                        required
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        placeholder="Theory"
                                        required
                                        disabled={true}
                                    />
                                    <input
                                        type="number"
                                        value={course.totalLabHours}
                                        onChange={(e) => handleCourseChange(index, 'totalLabHours', parseInt(e.target.value))}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        placeholder="Lab"
                                        required
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2">Years Offered</label>
                                <input
                                    type="text"
                                    value={course.yearsOffered}
                                    onChange={(e) => handleCourseChange(index, 'yearsOffered', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded bg-gray-200"
                                    required
                                    disabled={true}
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

                {/* <button
                    type="button"
                    onClick={handleAddCourse}
                    className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                >
                    + Add Course
                </button> */}

                {/* Innovations Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.innovations.title}</h2>
                    <p className="text-gray-600 mb-4">{SECTION_DESCRIPTIONS.innovations.description}</p>
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
                                        setFormData({
                                            ...formData,
                                            innovations: newInnovations
                                        });
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
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.newLabs.title}</h2>
                    <p className="text-gray-600 mb-4">{SECTION_DESCRIPTIONS.newLabs.description}</p>
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
                                        setFormData({
                                            ...formData,
                                            newLabs: newLabs
                                        });
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
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.otherTasks.title}</h2>
                    <p className="text-gray-600 mb-4">{SECTION_DESCRIPTIONS.otherTasks.description}</p>
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
                                        setFormData({
                                            ...formData,
                                            otherTasks: newTasks
                                        });
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
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.projectSupervision.title}</h2>
                    <p className="text-gray-600 mb-4">{SECTION_DESCRIPTIONS.projectSupervision.description}</p>

                    {/* B.Tech Projects */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">{SECTION_DESCRIPTIONS.projectSupervision.btech.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{SECTION_DESCRIPTIONS.projectSupervision.btech.description}</p>
                        {formData.projectSupervision.btech.map((project, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.btech.fields.title}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.btech.fields.students}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            required
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.btech.fields.internalSupervisors}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.btech.fields.externalSupervisors}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
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
                        {/* <button
                            type="button"
                            onClick={handleAddBTechProject}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                        >
                            + Add B.Tech Project
                        </button> */}
                    </div>

                    {/* M.Tech/MSc/MCA/MBA Projects */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">{SECTION_DESCRIPTIONS.projectSupervision.mtech.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{SECTION_DESCRIPTIONS.projectSupervision.mtech.description}</p>
                        {formData.projectSupervision.mtech.map((project, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.mtech.fields.title}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.mtech.fields.students}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.mtech.fields.internalSupervisors}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2">{SECTION_DESCRIPTIONS.projectSupervision.mtech.fields.externalSupervisors}</label>
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
                                            className="w-full p-2 border rounded bg-gray-200"
                                            disabled={true}
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
                        {/* <button
                            type="button"
                            onClick={handleAddMTechProject}
                            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                        >
                            + Add M.Tech/MSc/MCA/MBA Project
                        </button> */}
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
