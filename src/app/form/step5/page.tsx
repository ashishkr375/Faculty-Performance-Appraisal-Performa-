'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { OrganizationParticipation } from '@/types/form';
import { Events } from '@/components/form/step5/Events';
import { Lectures } from '@/components/form/step5/Lectures';
import { OnlineCourses } from '@/components/form/step5/OnlineCourses';
import { Visits } from '@/components/form/step5/Visits';
import { OutreachActivities } from '@/components/form/step5/OutreachActivities';
import { calculateStep5Marks } from '@/utils/calculateMarks';
import { fetchFacultyData } from '@/lib/fetchFacultyData';
const SECTION_DESCRIPTIONS = {
    events: {
        title: "Workshop/FDP/Conference Organization",
        description: "Maximum marks: 06\n" +
            "• Workshop or Faculty Development program or short-term courses (min 05 working days) as coordinator/convener: 2 Marks per Event\n" +
            "• Global Initiative of Academic Networks (GIAN) as course coordinator:\n" +
            "  - Two weeks duration: 2 Marks per Course\n" +
            "  - One week duration: 1 Mark per Course\n" +
            "• National/International conference as Chairman/Secretary: 3 Marks per Program\n" +
            "• National conference/workshop/webinar/expert lecture: 1 mark each (Max. 3 marks)"
    },
    lectures: {
        title: "Continuing Education/QIP Short Term Lectures/Special Lectures",
        description: "Maximum 01 mark @ 0.5 mark per lecture delivered"
    },
    onlineCourses: {
        title: "MOOC/NPTEL/Online Courses",
        description: "0.5 mark per course offered/01 mark for attending a full course with completion certificate"
    },
    visits: {
        title: "Visit to Outside Institute/Organization",
        description: "0.5 mark per visit, max 1 mark"
    },
    outreach: {
        title: "Outreach Activities",
        description: "Maximum 07 marks @ 01 mark per activity\n" +
            "Such as involvement with outside institutes - Network/Joint Projects, International & National Academics, " +
            "Professional Societies, Industry/Govt./Public/Community Service, Editorial & Renewing work, " +
            "Editing of proceedings, Development of national code of standards, members of advisory committee/BOS/Senate/BOG/" +
            "professional bodies/Governing Council/Selection Committees/Chief Guest/Editorship of journal/Reviewer of journal, " +
            "membership of Professional bodies/award/recognition/fellow member of any professional bodies or societies/" +
            "getting fellowship during the appraisal period from any professional bodies or societies, MOU initiated, etc."
    }
};

const Step5Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [marks,setmarks]=useState(0);
    const [formData, setFormData] = useState<OrganizationParticipation>({
        events: [],
        lectures: [],
        onlineCourses: [],
        visits: [],
        outreachActivities: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                if (status === 'unauthenticated') {
                    router.push('/auth/signin');
                    return;
                }
    
                const response = await fetch("/api/get-part?step=5");
    
                if (!response.ok) {
                    console.error("Failed to fetch data");
                } else {
                    const { stepData: existingData, appraisalPeriod } = await response.json();
                    const appraisalYear = new Date(appraisalPeriod).getFullYear();
    
                    const facultyData = await fetchFacultyData(session?.user?.email || '');
                    if (facultyData) {
                        let eventsMarks = 0;
                        const lecturesMarks = 0;
                        const onlineCoursesMarks = 0;
                        const visitsMarks = 0;
                        let outreachMarks = 0;
    
                        const workshopsConferences = facultyData?.workshops_conferences?.map(workshop => {
                            let marks = 0;
                            const endDate = new Date(workshop.end_date);
                            const endYear = endDate.getFullYear();
                            const startYear = new Date(workshop.start_date).getFullYear();
    
                            if (endYear >= appraisalYear && startYear <= appraisalYear) {
                                if (workshop.event_type === 'Workshop' || workshop.event_type === 'FDP' || workshop.event_type === 'Short-Term Course') {
                                    if (workshop.role === 'Coordinator' || workshop.role === 'Convener') {
                                        marks = 2; 
                                    }
                                } else if (workshop.event_type === 'GIAN') {
                                    const durationWeeks = workshop.duration_weeks;
                                    if (durationWeeks >= 2) {
                                        marks = 2;
                                    } else if (durationWeeks === 1) {
                                        marks = 1;
                                    }
                                } else if (workshop.event_type === 'National' || workshop.event_type==='International') {
                                    if (workshop.role === 'Chairman' || workshop.role === 'Secretary') {
                                        marks = 3;
                                    }
                                } else if (workshop.event_type === 'National' || workshop.event_type === 'Workshop' || workshop.event_type === 'Webinar' || workshop.event_type === 'Expert Lecture') {
                                    marks = 1;
                                }else{
                                    marks=1;
                                }
    
                                eventsMarks += marks;
    
                                if (eventsMarks > 6) {
                                    eventsMarks = 6;
                                }
    
                                return {
                                    event_type: workshop.event_type,
                                    role: workshop.role,
                                    event_name: workshop.event_name,
                                    sponsored_by: workshop.sponsored_by,
                                    start_date: workshop.start_date.split("T")[0],
                                    end_date: workshop.end_date.split("T")[0],
                                    participants_count: workshop.participants_count,
                                    marks,
                                };
                            }
                        }).filter(workshop => workshop !== undefined) || [];
    
                        const organizationParticipation = {
                            events: workshopsConferences.map(workshop => ({
                                type: workshop.event_type,
                                role: workshop.role,
                                name: workshop.event_name,
                                sponsor: workshop.sponsored_by,
                                startDate: workshop.start_date,
                                endDate: workshop.end_date,
                                participants: workshop.participants_count,
                            })),
                            lectures: existingData?.lectures || [],
                            onlineCourses: existingData?.onlineCourses || [],
                            visits: existingData?.visits || [],
                            
                            outreachActivities: existingData?.outreachActivities?.map(activity => {
                                outreachMarks += 1;
                                if (outreachMarks > 7) {
                                    outreachMarks = 7;
                                }
                                return activity;
                            }) || [],
                            calculatedMarks: eventsMarks + lecturesMarks + onlineCoursesMarks + visitsMarks + outreachMarks,
                        };
    
                        setFormData(organizationParticipation);
                    }
                }
                
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
    
        fetchSavedData();
    }, [status, router, session?.user?.email]);


    useEffect(() => {
        // Calculate marks whenever form data changes
        const calculated_marks = calculateStep5Marks(formData);
        // if (marks !== formData.calculatedMarks) {
        //     setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        // }
        formData.calculatedMarks=marks;
        setmarks(calculateStep5Marks(formData));
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 5,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step6');
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
            <h1 className="text-2xl font-bold mb-6">Organization & Participation</h1>
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                {/* <span className="text-blue-600">{formData.calculatedMarks?formData.calculatedMarks :0}</span> */}
                <span className="text-blue-600">{marks}</span>
                <span className="text-gray-600">/6</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.events.title}</h2>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{SECTION_DESCRIPTIONS.events.description}</p>
                </section>
                <Events formData={formData} setFormData={setFormData} />
                
                <Lectures formData={formData} setFormData={setFormData} />
                
                <OnlineCourses formData={formData} setFormData={setFormData} />
               
                <Visits formData={formData} setFormData={setFormData} />
               
                <OutreachActivities formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step4')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Management & Development
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step5Page; 