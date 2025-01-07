interface TeachingLoad {
    semester: 'First' | 'Second';
    level: 'UG I' | 'UG II' | 'PG' | 'Ph.D.';
    courseCode: string;
    title: string;
    type: 'Core' | 'Elective';
    studentCount: number;
    weeklyLoadL: number;
    weeklyLoadT: number;
    weeklyLoadP: number;
    totalTheoryHours: number;
    totalLabHours: number;
    yearsOffered: number;
}

interface InstructionalElementProps {
    data: {
        courses: TeachingLoad[];
    };
}

export function InstructionalElement({ data }: InstructionalElementProps) {
    const firstSemesterCourses = data.courses.filter(course => course.semester === 'First');
    const secondSemesterCourses = data.courses.filter(course => course.semester === 'Second');

    const renderTeachingTable = (courses: TeachingLoad[], semester: string) => (
        <div className="mb-8">
            <h3 className="font-bold mb-2">{semester} Semester</h3>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Course No & Title</th>
                        <th className="border p-2">Core/Elective</th>
                        <th className="border p-2">No of Students</th>
                        <th className="border p-2">Weekly load<br/>L&nbsp;&nbsp;&nbsp;&nbsp;T&nbsp;&nbsp;&nbsp;&nbsp;P</th>
                        <th className="border p-2">Total theory classes in hours & total lab. classes in hours</th>
                        <th className="border p-2">Offering for how many years continuously?</th>
                    </tr>
                </thead>
                <tbody>
                    {['UG I', 'UG II', 'PG', 'Ph.D.'].map(level => {
                        const course = courses.find(c => c.level === level);
                        return (
                            <tr key={level}>
                                <td className="border p-2">
                                    {course ? `${course.courseCode} ${course.title}` : ''}
                                </td>
                                <td className="border p-2">{course?.type || ''}</td>
                                <td className="border p-2">{course?.studentCount || ''}</td>
                                <td className="border p-2 text-center">
                                    {course ? `${course.weeklyLoadL}&nbsp;&nbsp;&nbsp;&nbsp;${course.weeklyLoadT}&nbsp;&nbsp;&nbsp;&nbsp;${course.weeklyLoadP}` : ''}
                                </td>
                                <td className="border p-2">
                                    {course ? `Theory: ${course.totalTheoryHours}, Lab: ${course.totalLabHours}` : ''}
                                </td>
                                <td className="border p-2">{course?.yearsOffered || ''}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="instructional-element">
            <h2 className="text-xl font-bold mb-4">I. INSTRUCTIONAL ELEMENT [Max marks: 25]</h2>
            <div className="mb-4">
                <h3 className="font-semibold">
                    (a) Teaching Engagement (only such courses to be considered where at least 5 students are enrolled)
                </h3>
                <p className="text-sm mb-4">
                    [Max marks: 14 for both semesters, Distribution of mark: 01 mark @ 01 hour Lecture/Tutorial class and 0.5 marks @ 01 hour practical class]
                </p>
            </div>

            {renderTeachingTable(firstSemesterCourses, 'First')}
            {renderTeachingTable(secondSemesterCourses, 'Second')}
        </div>
    );
}

