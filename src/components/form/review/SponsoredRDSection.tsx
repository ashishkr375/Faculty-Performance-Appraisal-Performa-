import { ItemsList } from './ItemsList';
import { SponsoredRD } from '@/types/form';

interface Props {
    data: SponsoredRD;
}

export const SponsoredRDSection = ({ data }: Props) => {
    const sponsoredItems = data.sponsoredProjects.map(project => ({
        title: project.title,
        details: {
            'Funding Agency': project.fundingAgency,
            'Financial Outlay': `₹${project.financialOutlay.toLocaleString()}`,
            'Duration': `${project.startDate} to ${project.endDate}`,
            'Investigators': project.investigators,
            'PI Institute': project.piInstitute,
            'Status': project.status,
            'Fund Received': `₹${project.fundReceived.toLocaleString()}`
        }
    }));

    const consultancyItems = data.consultancyProjects.map(project => ({
        title: project.title,
        details: {
            'Funding Agency': project.fundingAgency,
            'Financial Outlay': `₹${project.financialOutlay.toLocaleString()}`,
            'Start Date': project.startDate,
            'Period': project.period,
            'Investigators': project.investigators,
            'Status': project.status
        }
    }));

    const iprItems = data.ipr.map(item => ({
        title: item.title,
        details: {
            'Type': item.type,
            'Registration Date': item.registrationDate,
            'Publication Date': item.publicationDate || 'N/A',
            'Grant Date': item.grantDate || 'N/A',
            'Grant Number': item.grantNumber || 'N/A',
            'Applicant': item.applicant,
            'Inventors': item.inventors
        }
    }));

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Sponsored Projects</h3>
                <ItemsList items={sponsoredItems} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Consultancy Projects</h3>
                <ItemsList items={consultancyItems} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">IPR and Patents</h3>
                <ItemsList items={iprItems} />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Startups</h3>
                <ItemsList
                    items={data.startups.map(startup => ({
                        title: startup.name,
                        details: {
                            'Incubation Place': startup.incubationPlace,
                            'Registration Date': startup.registrationDate,
                            'Owners': startup.owners,
                            'Annual Income': `₹${startup.annualIncome.toLocaleString()}`,
                            'PAN Number': startup.panNumber
                        }
                    }))}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Industry Labs</h3>
                <ItemsList
                    items={data.industryLabs.map(lab => ({
                        title: lab.industryName,
                        details: {
                            'Equipment': lab.equipmentName,
                            'Location': lab.location,
                            'Fund Received': `₹${lab.fundReceived.toLocaleString()}`
                        }
                    }))}
                />
            </div>

            <div className="mt-4 text-right">
                <p className="font-semibold">Section Marks: {data.calculatedMarks}/14</p>
            </div>
        </div>
    );
}; 