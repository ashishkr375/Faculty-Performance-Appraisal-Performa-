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
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }

        const fetchSavedData = async () => {
            try {
                const response = await fetch('/api/get-part?step=4');
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

    useEffect(() => {
        // Calculate marks whenever form data changes
        const marks = calculateStep4Marks(formData);
        if (marks !== formData.calculatedMarks) {
            setFormData(prev => ({ ...prev, calculatedMarks: marks }));
        }
    }, [formData.sponsoredProjects, formData.consultancyProjects, formData.ipr, 
        formData.startups, formData.internships, formData.industryLabs]);

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
                <span className="text-blue-600">{formData.calculatedMarks}</span>
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

