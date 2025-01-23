interface PersonalInfoProps {
    data: {
        step1: {
            name: string;
            designation: string;
            department: string;
            jointFaculty: string;
            appraisalPeriodStart: string;
            appraisalPeriodEnd: string;
        };
    };
}

export function PersonalInfo({ data }: PersonalInfoProps) {
    // Extract just the year from the full dates
    const startYear = new Date(data.step1.appraisalPeriodStart).getFullYear();
    const endYear = new Date(data.step1.appraisalPeriodEnd).getFullYear();

    return (
        <div className="personal-info mb-8">
            <div className="mb-4">
                <p className="text-center mb-2">
                    {/* Appraisal Period: January 01, {startYear} to December 31, {endYear} */}
                    Appraisal Period: January 01, {startYear}
                </p>
                <p className="text-sm text-gray-600 text-center mb-4">
                    Note: Please mention each and every information only for the appraisal period.
                    (Attach additional sheet, if necessary)
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="info-row">
                    <span className="label font-semibold">Name : </span>
                    <span className="value">{data.step1.name}</span>
                </div>
                <div className="info-row">
                    <span className="label font-semibold">Designation : </span>
                    <span className="value">{data.step1.designation}</span>
                </div>
                <div className="info-row">
                    <span className="label font-semibold">Deptt. /Centre : </span>
                    <span className="value">Department of {data.step1.department}</span>
                </div>
                <div className="info-row">
                    <span className="label font-semibold">If, Joint Faculty:</span>
                    <span className="value">{data.step1.jointFaculty}</span>
                </div>
            </div>
        </div>
    );
}

