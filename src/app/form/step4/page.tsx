'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { SponsoredRD } from '@/types/form';
import { SponsoredProjects } from '@/components/form/step4/SponsoredProjects';
import { ConsultancyProjects } from '@/components/form/step4/ConsultancyProjects';
import { IPR } from '@/components/form/step4/IPR';
import { Startups } from '@/components/form/step4/Startups';
import { Internships } from '@/components/form/step4/Internships';
import { IndustryLabs } from '@/components/form/step4/IndustryLabs';
import { calculateStep4Marks } from '@/utils/calculateMarks';
import { fetchFacultyData } from '@/lib/fetchFacultyData';
const SECTION_DESCRIPTIONS = {
    sponsoredProjects: {
        title: "Sponsored Research Projects from any Govt. agency/industry/institute",
        description: "Project under TEQIP/Institute grant shall not be considered for marks:\n" +
            "• 01 mark for each submitted research project (maximum up to 02 marks)\n" +
            "• 03 marks for completion/ongoing status, of each sponsored research project with grant ≤ Rs. 5 lacs\n" +
            "• 04 marks for completion/ongoing status, of each sponsored research project with grant between Rs. 5 to Rs. 10 lacs\n" +
            "• 05 marks for completion/ongoing status, of each sponsored research project with grant ≥ Rs. 10 lacs",
        notes: [
            "1. Sponsored research project from industry: With the condition that for a research project, grant from the industry must be received in the institute account will only be considered as 'Sponsored research project from industry'.",
            "2. Faculty as a PI/Co-PI of an external sponsored research projects submitted from any institute other than NIT Patna: With the condition that for such a research project, complete grant/share of grant from the funding agency must be received in the institute (NIT Patna) account will only be considered."
        ]
    },
    consultancyProjects: {
        title: "Consultancy Projects",
        description: "Maximum 08 marks. Up to Rs. 50,000/-: 01 mark. After increment of each Rs. 50,000/- one mark will be added maximum up to 08 marks."
    },
    ipr: {
        title: "IPR and Technology Transfer",
        description: "04 marks for Technology transfer, 03 marks for the grant of patent, 02 marks for publication of each patent.\n" +
            "01 marks for grant of each Design/copyright and maximum up to 3 marks, no mark for filing of Design/copyright",
        note: "IPR containing 'Institute name as Applicant or one of the Applicants' will only be considered."
    },
    startups: {
        title: "Startup",
        description: "Maximum 06 marks:\n" +
            "• 02 marks for registered startup as a firm/company as per Indian govt. act\n" +
            "• 03 marks per startup for annual revenue from 50K to 1 Lakh\n" +
            "• 04 marks per startup for annual revenue between 1-5 Lakhs\n" +
            "• 05 marks per startup for annual revenue between 5 to 10 Lakhs\n" +
            "• 06 marks per startup for annual revenue greater than 10 Lakhs"
    },
    internships: {
        title: "Internships offered during the appraisal period",
        description: "Maximum 04 marks:\n" +
            "• 02 marks for each registered external student (other than the institute) for a minimum period of one month\n" +
            "• 01 mark for each registered internal student (NIT Patna) for a minimum period of one month",
        note: "For more than one supervisor, marks will be divided equally"
    },
    industryLabs: {
        title: "Setting-up of industry sponsored laboratory",
        description: "Maximum marks: 05"
    }
};

const Step4Page = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [marks,setmarks]=useState(0);
    const [formData, setFormData] = useState<SponsoredRD>({
        sponsoredProjects: [],
        consultancyProjects: [],
        ipr: [],
        startups: [],
        internships: [],
        industryLabs: [],
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedData = async () => {
            try {
                setLoading(true);
                if (status === 'unauthenticated') {
                    router.push("/auth/signin");
                    return;
                }
    
                const response = await fetch("/api/get-part?step=4");
                if (!response.ok) {
                    console.error("Failed to fetch data");
                    setLoading(false);
                    return;
                }
    
                const { stepData: existingData, appraisalPeriod } = await response.json();
                const appraisalYear = new Date(appraisalPeriod).getFullYear();
    
                const facultyData = await fetchFacultyData(session?.user?.email || '');
                if (facultyData) {
                    let sponsoredProjects = facultyData?.sponsored_projects?.map(project => {
                        const endYear =project.end_date? new Date(project.end_date).getFullYear():new Date().getFullYear();
                        const startYear=new Date(project.start_date).getFullYear();
                        // const endYear=new Date(project.end_date).getFullYear();
                        if (!(endYear >= appraisalYear && startYear <= appraisalYear)) return null;
                        let marks = 0;
                        if (project.funding_agency !== 'TEQIP' && project.funding_agency !== 'Institute grant') {
                            marks += 1;
                        }
                        if (project.status === 'Completed' || project.status === 'Ongoing') {
                            if (parseInt(project.financial_outlay) <= 500000) {
                                marks += 3;
                            } else if (parseInt(project.financial_outlay) <= 1000000) {
                                marks += 4;
                            } else {
                                marks += 5;
                            }
                        }
                        return marks > 0 ? {
                            title: project.project_title,
                            fundingAgency: project.funding_agency,
                            financialOutlay: parseFloat(project.financial_outlay),
                            startDate: project.start_date.split("T")[0],
                            endDate:project.end_date? project.end_date.split("T")[0]:null,
                            investigators: project.investigators,
                            piInstitute: project.pi_institute || '',
                            status: project.status || 'In Progress',
                            fundReceived: parseFloat(project.funds_received) || 0,
                            marks,
                        } : null;
                    }).filter(project => project !== null) || [];

                    const existingSponsoredProjects = existingData?.sponsoredProjects
                        ?.filter(project => project.status === "Submitted")
                        ?.map(project => {
                            let marks = 0;
                            const financialOutlay = parseInt(project.financial_outlay) || 0;

                            if (financialOutlay <= 500000) {
                                marks += 3;
                            } else if (financialOutlay <= 1000000) {
                                marks += 4;
                            } else {
                                marks += 5;
                            }

                            return {
                                ...project,
                                marks,
                            };
                        }) || [];

                    sponsoredProjects = [...sponsoredProjects, ...existingSponsoredProjects];
    
                    const consultancyProjects = facultyData?.consultancy_projects?.map(project => {
                        const projectYear = new Date(project.start_date).getFullYear();
                        const startYear=projectYear;
                        const endYear=new Date(project.start_date).getFullYear();
                        if (!(endYear >= appraisalYear && startYear <= appraisalYear)) return null;
    
                        let marks = 0;
                        const amount = parseFloat(project.financial_outlay);
                        if (amount <= 50000) {
                            marks += 1;
                        } else {
                            marks += Math.min(Math.floor(amount / 50000), 8);
                        }
                        return marks > 0 ? {
                            title: project.project_title,
                            fundingAgency: project.funding_agency,
                            financialOutlay: amount,
                            startDate: project.start_date.split("T")[0],
                            period: project.period_months,
                            investigators: project.investigators,
                            status: project.status || 'In Progress',
                            marks,
                        } : null;
                    }).filter(project => project !== null) || [];
    
                    const ipr = facultyData?.ipr?.map(iprItem => {
                        const projectYear = new Date(iprItem.publication_date).getFullYear();
                        const startYear=projectYear;
                        const endYear=new Date(iprItem.grant_date).getFullYear();
                        if (!(endYear >= appraisalYear && startYear <= appraisalYear)) return null;
    
                        let marks = 0;
                        if (iprItem.type === 'Patent') {
                            marks += 3;
                        } else if (iprItem.type === 'Industrial Design' || iprItem.type === 'Copyright') {
                            marks += 1;
                        }
                        if (iprItem.publication_date) {
                            marks += 2;
                        }
                        return marks > 0 ? {
                            title: iprItem.title,
                            registrationDate: iprItem.registration_date.split("T")[0] || '',
                            publicationDate: iprItem?.publication_date?.split('T')[0] || '',
                            grantDate: iprItem?.grant_date?.split("T")[0] || '',
                            grantNumber: iprItem.grant_no || iprItem.patent_number,
                            applicant: iprItem.applicant_name || '',
                            inventors: iprItem.inventors || '',
                            type: iprItem.type,
                            marks,
                        } : null;
                    }).filter(iprItem => iprItem !== null) || [];
    
                    const startups = facultyData?.startups?.map(startup => {
                        const projectYear = new Date(startup.registration_date).getFullYear();
                        const startYear=projectYear;
                        const endYear=new Date(startup.registration_date).getFullYear();
                        if (!(endYear >= appraisalYear && startYear <= appraisalYear)) return null;
    
                        let marks = 0;
                        if (parseInt(startup.annual_income) >= 1000000) {
                            marks += 6;
                        } else if (parseInt(startup.annual_income) >= 500000) {
                            marks += 5;
                        } else if (parseInt(startup.annual_income) >= 100000) {
                            marks += 4;
                        } else if (parseInt(startup.annual_income) >= 50000) {
                            marks += 3;
                        }
                        if (startup.registration_date) {
                            marks += 2;
                        }
                        return marks > 0 ? {
                            name: startup.startup_name,
                            incubationPlace: startup.incubation_place || '',
                            registrationDate: startup.registration_date.split("T")[0] || '',
                            owners: startup.owners_founders || '',
                            annualIncome: parseFloat(startup.annual_income) || 0,
                            panNumber: startup.pan_number || '',
                            marks,
                        } : null;
                    }).filter(startup => startup !== null) || [];
    
                    const internships = facultyData?.internships?.map(internship => {
                        const projectYear = new Date(internship.start_date).getFullYear();
                        const startYear=projectYear;
                        const endYear=internship.end_date ? new Date(internship.end_date).getFullYear():new Date().getFullYear();
                        if (!(endYear >= appraisalYear && startYear <= appraisalYear)) return null;
    
                        let marks = 0;
                        if (internship.student_type === 'External') {
                            marks += 2;
                        } else {
                            marks += 1;
                        }
                        return marks > 0 ? {
                            studentName: internship.student_name || '',
                            qualification: internship.qualification || '',
                            affiliation: internship.affiliation || '',
                            projectTitle: internship.project_title || '',
                            startDate:new Date(internship.start_date),
                            endDate:internship.end_date? new Date(internship.end_date):null,
                            isExternal: internship.student_type === 'External',
                            marks,
                        } : null;
                    }).filter(internship => internship !== null) || [];
    
                    const industryLabs = [];
                    const totalMarks = [
                        ...sponsoredProjects,
                        ...consultancyProjects,
                        ...ipr,
                        ...startups,
                        ...internships
                    ].reduce((total, item) => total + (item?.marks || 0), 0);
    
                    setFormData({
                        sponsoredProjects,
                        consultancyProjects,
                        ipr,
                        startups,
                        internships,
                        industryLabs,
                        calculatedMarks: totalMarks,
                        totalMarks,
                    });
                }
                if (existingData) {
                    setFormData(prevData => ({
                        ...prevData,
                        industryLabs: existingData.IndustryLabs || [],
                    }));
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };
    
        fetchSavedData();
    }, [status, router, session?.user?.email]);
    
    useEffect(() => {
        // Calculate marks whenever form data changes
        const marks = calculateStep4Marks(formData);
        // if (marks !== formData.calculatedMarks) {
        //     setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        // }

        setmarks(calculateStep4Marks(formData))
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
                    step: 4,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step5');
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
            <h1 className="text-2xl font-bold mb-6">Sponsored R&D, Consultancy & Extension Elements</h1>
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                {/* <span className="text-blue-600">{formData.calculatedMarks}</span> */}
                <span className="text-blue-600">{marks}</span>
                <span className="text-gray-600">/14</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-2">{SECTION_DESCRIPTIONS.sponsoredProjects.title}</h2>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{SECTION_DESCRIPTIONS.sponsoredProjects.description}</p>
                    <div className="mb-4">
                        {SECTION_DESCRIPTIONS.sponsoredProjects.notes.map((note, index) => (
                            <p key={index} className="text-sm text-gray-600 mb-1">{note}</p>
                        ))}
                    </div>
                    <SponsoredProjects formData={formData} setFormData={setFormData} />
                </section>
                <ConsultancyProjects formData={formData} setFormData={setFormData} />
                <IPR formData={formData} setFormData={setFormData} />
                <Startups formData={formData} setFormData={setFormData} />
                <Internships formData={formData} setFormData={setFormData} />
                <IndustryLabs formData={formData} setFormData={setFormData} />

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step3')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Organization & Participation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step4Page; 

