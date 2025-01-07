interface Props {
    data: {
        courses: Array<{
            code: string;
            name: string;
            semester: string;
            type: string;
            level: string;
            studentsCount: number;
            contactHours: number;
        }>;
    };
}

export const TeachingLoadSection = ({ data }: Props) => {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left">Course Code</th>
                            <th className="px-4 py-2 text-left">Course Name</th>
                            <th className="px-4 py-2 text-left">Semester</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Level</th>
                            <th className="px-4 py-2 text-right">Students</th>
                            <th className="px-4 py-2 text-right">Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.courses.map((course, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-2">{course.code}</td>
                                <td className="px-4 py-2">{course.name}</td>
                                <td className="px-4 py-2">{course.semester}</td>
                                <td className="px-4 py-2">{course.type}</td>
                                <td className="px-4 py-2">{course.level}</td>
                                <td className="px-4 py-2 text-right">{course.studentsCount}</td>
                                <td className="px-4 py-2 text-right">{course.contactHours}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-50 font-semibold">
                            <td colSpan={5} className="px-4 py-2 text-right">Total:</td>
                            <td className="px-4 py-2 text-right">
                                {data.courses.reduce((sum, course) => sum + course.studentsCount, 0)}
                            </td>
                            <td className="px-4 py-2 text-right">
                                {data.courses.reduce((sum, course) => sum + course.contactHours, 0)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}; 