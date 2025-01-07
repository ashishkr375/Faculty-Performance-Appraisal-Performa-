interface Props {
    data: {
        name: string;
        email: string;
        department: string;
        designation: string;
        joiningDate: string;
        employeeId: string;
    };
}

export const PersonalInfoSection = ({ data }: Props) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="font-semibold">Name:</p>
                <p>{data.name}</p>
            </div>
            <div>
                <p className="font-semibold">Email:</p>
                <p>{data.email}</p>
            </div>
            <div>
                <p className="font-semibold">Department:</p>
                <p>{data.department}</p>
            </div>
            <div>
                <p className="font-semibold">Designation:</p>
                <p>{data.designation}</p>
            </div>
            <div>
                <p className="font-semibold">Joining Date:</p>
                <p>{new Date(data.joiningDate).toLocaleDateString()}</p>
            </div>
            <div>
                <p className="font-semibold">Employee ID:</p>
                <p>{data.employeeId}</p>
            </div>
        </div>
    );
}; 