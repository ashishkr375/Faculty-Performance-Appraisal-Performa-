'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { ManagementDevelopment } from '@/types/form';
import { InstituteLevelActivities } from '@/components/form/step6/InstituteLevelActivities';
import { DepartmentLevelActivities } from '@/components/form/step6/DepartmentLevelActivities';
import { calculateStep6Marks } from '@/utils/calculateMarks';
import { fetchFacultyData } from '@/lib/fetchFacultyData';
const SECTION_DESCRIPTIONS = {
    instituteLevelRoles: {
        title: "Institute Level",
        description: "Maximum 10 marks\n" +
            "• 02 marks/semester for Head of the Department, Dean, Chief Warden, Professor In charge (Training and placement), " +
            "Advisor (Estate), Chief Vigilance Officer, PI (Exam), TEQIP (Coordinator), etc. such as Chief Proctor.\n" +
            "• 01 mark/semester for Warden, Assistant warden, Associate Dean, Chairman or Convener institute academic committees, " +
            "Faculty In charge Computer Center or Information and Technology Services or Library or Admission or student activities " +
            "and other Institutional activities like Coordinator/Incharge IIC/SC/ST cell, NCC, Annual report, Technical Events, " +
            "Cultural events, NKN, GIAN, Yoga, Raj Bhasha, security.\n" +
            "• Other assignments: 0.5 Marks/semester Chairman and Convener of different standing committee and special committee " +
            "(Ex-officio status will not be considered). Faculty in charges (Each for one year duration) of different Units or equivalent."
    },
    departmentLevelRoles: {
        title: "Department/Centre's Level",
        description: "Maximum 05 marks\n" +
            "0.5 Mark/semester for each Departmental activities identified by Head of the Department like lab in charges, " +
            "or department level committee for a minimum period of one year."
    }
};

const Step6Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState<ManagementDevelopment>({
        instituteLevelActivities: [],
        departmentLevelActivities: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);
    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return '';
        }
        return d.toLocaleDateString('en-CA');
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }
    
        const fetchSavedData = async () => {
            try {
                const response = await fetch("/api/get-part?step=6");
    
                if (!response.ok) {
                    console.error("Failed to fetch data");
                } else {
                    const { stepData: existingData, appraisalPeriod } = await response.json();
                    const appraisalYear = new Date(appraisalPeriod).getFullYear();
    
                    const facultyData = await fetchFacultyData(session?.user?.email || '');
                    if (facultyData) {
                        let instituteMarks = 0;
                        const instituteLevelActivities = facultyData?.institute_activities
                            ?.filter(activity => {
                                const endDate = new Date(activity.end_date === 'Continue' ? new Date() : activity.end_date);
                                const endYear = endDate.getFullYear();
                                return endYear >= appraisalYear;
                            })
                            .map(activity => {
                                let marks = 0;
                                switch (activity.role_position) {
                                    case 'Head of the Department':
                                    case 'Dean':
                                    case 'Chief Warden':
                                    case 'Professor In charge (Training and placement)':
                                    case 'Advisor (Estate)':
                                    case 'Chief Vigilance Officer':
                                    case 'PI (Exam)':
                                    case 'TEQIP (Coordinator)':
                                    case 'Chief Proctor':
                                        marks = 2;
                                        break;
                                    case 'Warden':
                                    case 'Assistant warden':
                                    case 'Associate Dean':
                                    case 'Chairman':
                                    case 'Convener institute academic committees':
                                    case 'Faculty In charge Computer Center':
                                    case 'Faculty In charge Information and Technology Services':
                                    case 'Faculty In charge Library':
                                    case 'Faculty In charge Admission':
                                    case 'Faculty In charge student activities':
                                    case 'Coordinator/Incharge IIC/SC/ST cell':
                                    case 'NCC':
                                    case 'Annual report':
                                    case 'Technical Events':
                                    case 'Cultural events':
                                    case 'NKN':
                                    case 'GIAN':
                                    case 'Yoga':
                                    case 'Raj Bhasha':
                                    case 'Security':
                                        marks = 1;
                                        break;
                                    case 'Chairman and Convener of different standing committee':
                                    case 'Faculty in charge of different Units':
                                        marks = 0.5;
                                        break;
                                    default:
                                        marks = 0;
                                }
    
                                instituteMarks += marks;
    
                                if (instituteMarks > 10) {
                                    instituteMarks = 10;
                                }
    
                                return {
                                    role: activity.role_position,
                                    duration: `${formatDate(activity.start_date)} - ${activity.end_date === 'Continue' ? 'Continue' : formatDate(activity.end_date)}`,
                                    marks: marks,
                                };
                            }) || [];
    
                        let departmentMarks = 0;
                        const departmentLevelActivities = facultyData?.department_activities
                            ?.filter(activity => {
                                const endDate = new Date(activity.end_date === 'Continue' ? new Date() : activity.end_date);
                                const endYear = endDate.getFullYear();
                                return endYear >= appraisalYear;
                            })
                            .map(activity => {
                                let marks = 0.5;
                                departmentMarks += marks;
    
                                if (departmentMarks > 5) {
                                    departmentMarks = 5; 
                                }
    
                                return {
                                    activity: activity.activity_description,
                                    duration: `${formatDate(activity.start_date)} - ${activity.end_date === 'Continue' ? 'Continue' : formatDate(activity.end_date)}`,
                                    marks: marks,
                                };
                            }) || [];
    
                        const managementDevelopment = {
                            instituteLevelActivities,
                            departmentLevelActivities,
                            calculatedMarks: formData?.calculatedMarks || 0,
                        };
    
                        setFormData(managementDevelopment);
                    }
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
    
        fetchSavedData();
    }, [status, router, session?.user?.email, formData?.calculatedMarks]);
    useEffect(() => {
        // Calculate marks whenever form data changes
        const marks = calculateStep6Marks(formData);
        if (marks !== formData.calculatedMarks) {
            setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        }
    }, [formData.instituteLevelActivities, formData.departmentLevelActivities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 6,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step7');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Management & Institutional Development Elements</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.instituteLevelRoles.title}</h2>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{SECTION_DESCRIPTIONS.instituteLevelRoles.description}</p>
                    <InstituteLevelActivities formData={formData} setFormData={setFormData} />
                </section>

                <section>
                    <DepartmentLevelActivities formData={formData} setFormData={setFormData} />
                </section>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step5')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Self Appraisal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step6Page; 