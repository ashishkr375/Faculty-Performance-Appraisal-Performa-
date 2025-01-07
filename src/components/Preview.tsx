import { Header } from './Header';
import { PersonalInfo } from './PersonalInfo';
import { InstructionalElement } from './InstructionalElement';
import { ResearchPublications } from './ResearchPublications';
import { SponsoredRD } from './SponsoredRD';
import { OrganizationParticipation } from './OrganizationParticipation';
import { ManagementDevelopment } from './ManagementDevelopment';
import { SelfAppraisal } from './SelfAppraisal';
import { CommentsForFutureWork } from './CommentsForFutureWork';
import { MarksClaimed } from './MarksClaimed';
import { Forwarding } from './Forwarding';
import { calculateMarks } from '@/utils/calculateMarks';
import { useRouter } from 'next/navigation';

interface PreviewProps {
    formData: {
        step1: {
            name: string;
            designation: string;
            department: string;
            jointFaculty: string;
            appraisalPeriodStart: string;
            appraisalPeriodEnd: string;
        };
        step2: {
            courses: Array<{
                semester: string;
                level: string;
                courseNo: string;
                title: string;
                type: string;
                studentCount: number;
                weeklyLoadL: number;
                weeklyLoadT: number;
                weeklyLoadP: number;
                totalTheoryHours: number;
                totalLabHours: number;
                yearsOffered: number;
            }>;
            // ... other step2 fields
        };
        // ... other steps
    };
}

export function Preview({ formData }: PreviewProps) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Calculate all marks
    const instructionalMarks = calculateMarks.instructionalElement(formData.step2);
    const researchMarks = calculateMarks.researchPublications(formData.step3);
    const sponsoredRDMarks = calculateMarks.sponsoredRD(formData.step4);
    const organizationMarks = calculateMarks.organizationParticipation(formData.step5);
    const managementMarks = calculateMarks.managementDevelopment(formData.step6);
    const totalMarks = instructionalMarks + researchMarks + sponsoredRDMarks + 
                      organizationMarks + managementMarks;

    // Update the Marks Summary Section
    const marksTable = (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr>
                    <th className="border p-2">S. No.</th>
                    <th className="border p-2">Component</th>
                    <th className="border p-2">Max. marks</th>
                    <th className="border p-2">Marks claimed</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">1</td>
                    <td className="border p-2">INSTRUCTIONAL ELEMENT</td>
                    <td className="border p-2">25</td>
                    <td className="border p-2">{instructionalMarks}</td>
                </tr>
                <tr>
                    <td className="border p-2">2</td>
                    <td className="border p-2">RESEARCH PAPERS/PUBLICATIONS</td>
                    <td className="border p-2">40</td>
                    <td className="border p-2">{researchMarks}</td>
                </tr>
                <tr>
                    <td className="border p-2">3</td>
                    <td className="border p-2">SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS</td>
                    <td className="border p-2">14</td>
                    <td className="border p-2">{sponsoredRDMarks}</td>
                </tr>
                <tr>
                    <td className="border p-2">4</td>
                    <td className="border p-2">ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/WORKSHOP</td>
                    <td className="border p-2">6</td>
                    <td className="border p-2">{organizationMarks}</td>
                </tr>
                <tr>
                    <td className="border p-2">5</td>
                    <td className="border p-2">MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS</td>
                    <td className="border p-2">15</td>
                    <td className="border p-2">{managementMarks}</td>
                </tr>
                <tr className="font-bold">
                    <td className="border p-2" colSpan={2}>GRAND TOTAL</td>
                    <td className="border p-2">100</td>
                    <td className="border p-2">{totalMarks}</td>
                </tr>
            </tbody>
        </table>
    );

    // Update the Appraisal Committee Section
    const appraisalTable = (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr>
                    <th className="border p-2">S.No.</th>
                    <th className="border p-2">Component</th>
                    <th className="border p-2">Max. marks</th>
                    <th className="border p-2">Marks claimed</th>
                    <th className="border p-2">Marks Awarded</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2">1</td>
                    <td className="border p-2">INSTRUCTIONAL ELEMENT</td>
                    <td className="border p-2">25</td>
                    <td className="border p-2">{instructionalMarks}</td>
                    <td className="border p-2"></td>
                </tr>
                <tr>
                    <td className="border p-2">2</td>
                    <td className="border p-2">RESEARCH PAPERS/PUBLICATIONS</td>
                    <td className="border p-2">40</td>
                    <td className="border p-2">{researchMarks}</td>
                    <td className="border p-2"></td>
                </tr>
                <tr>
                    <td className="border p-2">3</td>
                    <td className="border p-2">SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS</td>
                    <td className="border p-2">14</td>
                    <td className="border p-2">{sponsoredRDMarks}</td>
                    <td className="border p-2"></td>
                </tr>
                <tr>
                    <td className="border p-2">4</td>
                    <td className="border p-2">ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/WORKSHOP</td>
                    <td className="border p-2">6</td>
                    <td className="border p-2">{organizationMarks}</td>
                    <td className="border p-2"></td>
                </tr>
                <tr>
                    <td className="border p-2">5</td>
                    <td className="border p-2">MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS</td>
                    <td className="border p-2">15</td>
                    <td className="border p-2">{managementMarks}</td>
                    <td className="border p-2"></td>
                </tr>
                <tr className="font-bold">
                    <td className="border p-2" colSpan={3}>GRAND TOTAL</td>
                    <td className="border p-2">{totalMarks}</td>
                    <td className="border p-2"></td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <div className="preview-container max-w-4xl mx-auto p-6">
            <div className="no-print flex gap-4 mb-4 justify-end">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Dashboard
                </button>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Print Preview
                </button>
            </div>

            <Header />
            <PersonalInfo data={formData} />
            
            {/* Teaching Load Section */}
            <div className="instructional-element mb-8">
                <h2 className="text-xl font-bold mb-4">I. INSTRUCTIONAL ELEMENT [Max marks: 25]</h2>
                <div className="mb-4">
                    <h3 className="font-semibold">
                        (a) Teaching Engagement (only courses with ≥5 students)
                    </h3>
                    <p className="text-sm mb-4">
                        [Max marks: 14 for both semesters, 1 mark/hour for L/T, 0.5 marks/hour for P]
                    </p>
                </div>

                {['First', 'Second'].map(semester => (
                    <div key={semester} className="mb-8">
                        <h4 className="font-bold mb-2">{semester} Semester</h4>
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className="border p-2">Course No & Title</th>
                                    <th className="border p-2">Core/Elective</th>
                                    <th className="border p-2">Students</th>
                                    <th className="border p-2">L-T-P</th>
                                    <th className="border p-2">Theory/Lab Hours</th>
                                    <th className="border p-2">Years Offered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.step2.courses
                                    .filter(course => course.semester === semester)
                                    .map((course, idx) => (
                                        <tr key={idx}>
                                            <td className="border p-2">
                                                {course.courseNo} - {course.title}
                                            </td>
                                            <td className="border p-2">{course.type}</td>
                                            <td className="border p-2">{course.studentCount}</td>
                                            <td className="border p-2">
                                                {course.weeklyLoadL}-{course.weeklyLoadT}-{course.weeklyLoadP}
                                            </td>
                                            <td className="border p-2">
                                                T:{course.totalTheoryHours}/L:{course.totalLabHours}
                                            </td>
                                            <td className="border p-2">{course.yearsOffered}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {/* PhD Supervision Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">II. RESEARCH PAPERS/PUBLICATIONS [Max. marks: 40]</h2>
                <h3 className="font-semibold mb-4">(a) Ph.D Research Supervision</h3>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border p-2">Sr. No.</th>
                            <th className="border p-2">Name & Roll No.</th>
                            <th className="border p-2">Registration Year & Status</th>
                            <th className="border p-2">Research Area</th>
                            <th className="border p-2">Other Supervisors</th>
                            <th className="border p-2">SCI Publications</th>
                            <th className="border p-2">Scopus Publications</th>
                            <th className="border p-2">Current Status</th>
                            <th className="border p-2">Status Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.step3.phdSupervision.map((student, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{idx + 1}</td>
                                <td className="border p-2">{student.studentName}</td>
                                <td className="border p-2">{`${student.registrationYear} - ${student.status}`}</td>
                                <td className="border p-2">{student.researchArea}</td>
                                <td className="border p-2">{student.otherSupervisors}</td>
                                <td className="border p-2">{student.sciPublications}</td>
                                <td className="border p-2">{student.scopusPublications}</td>
                                <td className="border p-2">{student.currentStatus}</td>
                                <td className="border p-2">{formatDate(student.statusDate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Journal Papers Section */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">(b) Journal Papers</h3>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border p-2">Sr. No.</th>
                            <th className="border p-2">Authors</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Journal</th>
                            <th className="border p-2">Vol./Pages/Year</th>
                            <th className="border p-2">Quartile</th>
                            <th className="border p-2">Publication Date</th>
                            <th className="border p-2">Student Involved</th>
                            <th className="border p-2">DOI/URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.step3.journalPapers.map((paper, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{idx + 1}</td>
                                <td className="border p-2">{paper.authors}</td>
                                <td className="border p-2">{paper.title}</td>
                                <td className="border p-2">{paper.journal}</td>
                                <td className="border p-2">{`Vol ${paper.volume}, pp ${paper.pages}, ${paper.year}`}</td>
                                <td className="border p-2">{paper.quartile}</td>
                                <td className="border p-2">{formatDate(paper.publicationDate)}</td>
                                <td className="border p-2">{paper.studentInvolved}</td>
                                <td className="border p-2">{paper.doi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sponsored Projects Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">III. SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS</h2>
                <h3 className="font-semibold mb-4">(a) Sponsored Research Projects</h3>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border p-2">S.No.</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Funding Agency</th>
                            <th className="border p-2">Financial Outlay</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Investigators</th>
                            <th className="border p-2">PI Institute</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">NIT Patna Funds</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.step4.sponsoredProjects.map((project, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{idx + 1}</td>
                                <td className="border p-2">{project.title}</td>
                                <td className="border p-2">{project.fundingAgency}</td>
                                <td className="border p-2">₹{project.financialOutlay.toLocaleString()}</td>
                                <td className="border p-2">{formatDate(project.startDate)}</td>
                                <td className="border p-2">{formatDate(project.endDate)}</td>
                                <td className="border p-2">{project.investigators}</td>
                                <td className="border p-2">{project.piInstitute}</td>
                                <td className="border p-2">{project.status}</td>
                                <td className="border p-2">₹{project.fundReceived.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="page-break"></div>

            {/* Events Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">IV. ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/WORKSHOP</h2>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border p-2">Type</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Event Name</th>
                            <th className="border p-2">Sponsor</th>
                            <th className="border p-2">Start Date</th>
                            <th className="border p-2">End Date</th>
                            <th className="border p-2">Participants</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.step5.events.map((event, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{event.type}</td>
                                <td className="border p-2">{event.role}</td>
                                <td className="border p-2">{event.name}</td>
                                <td className="border p-2">{event.sponsor}</td>
                                <td className="border p-2">{formatDate(event.startDate)}</td>
                                <td className="border p-2">{formatDate(event.endDate)}</td>
                                <td className="border p-2">{event.participants}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Management & Development Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">V. MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS [Max. marks: 15]</h2>
                
                {/* Institute Level Activities */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-4">(a) Institute Level Activities (Max 10 marks)</h3>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2">Role/Activity</th>
                                <th className="border p-2">Duration</th>
                                <th className="border p-2">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.step6.instituteLevelActivities.map((activity, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{activity.role}</td>
                                    <td className="border p-2">{activity.duration}</td>
                                    <td className="border p-2">{activity.marks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Department Level Activities */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-4">(b) Department Level Activities (Max 5 marks)</h3>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2">Activity</th>
                                <th className="border p-2">Duration</th>
                                <th className="border p-2">Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.step6.departmentLevelActivities.map((activity, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{activity.activity}</td>
                                    <td className="border p-2">{activity.duration}</td>
                                    <td className="border p-2">{activity.marks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="page-break"></div>

            {/* Self Appraisal Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">VI. SELF APPRAISAL</h2>
                <p className="text-sm mb-4">(Comments on work including circumstances for not being able to undertake activities in some elements) [Max. 500 words]</p>
                <div className="border p-4 rounded whitespace-pre-wrap">
                    {formData.step7.achievements}
                </div>
            </div>

            {/* Future Work Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">VII. COMMENTS/ SUGGESTIONS FOR FUTURE WORK</h2>
                <p className="text-sm mb-4">(Including difficulties faced and suggestions for improvement) [Max. 500 words]</p>
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Areas of Improvement:</h3>
                        <div className="border p-4 rounded whitespace-pre-wrap">
                            {formData.step7.areasOfImprovement}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Future Plans:</h3>
                        <div className="border p-4 rounded whitespace-pre-wrap">
                            {formData.step7.futurePlans}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Support Required:</h3>
                        <div className="border p-4 rounded whitespace-pre-wrap">
                            {formData.step7.supportRequired}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Additional Comments:</h3>
                        <div className="border p-4 rounded whitespace-pre-wrap">
                            {formData.step7.additionalComments}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conference Papers Section */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">(c) Conference Papers</h3>
                <p className="text-sm text-gray-600 mb-4">
                    [0.5 mark per conference publication in SCOPUS/WOS, 0.25 mark for other non-indexed]
                </p>
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="border p-2">Sr. No.</th>
                            <th className="border p-2">Authors</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Conference</th>
                            <th className="border p-2">Location</th>
                            <th className="border p-2">Year</th>
                            <th className="border p-2">Pages</th>
                            <th className="border p-2">Indexing</th>
                            <th className="border p-2">Foreign Author</th>
                            <th className="border p-2">Student Involved</th>
                            <th className="border p-2">DOI</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.step3.conferencePapers.map((paper, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">{idx + 1}</td>
                                <td className="border p-2">{paper.authors}</td>
                                <td className="border p-2">{paper.title}</td>
                                <td className="border p-2">{paper.conference}</td>
                                <td className="border p-2">{paper.location}</td>
                                <td className="border p-2">{paper.year}</td>
                                <td className="border p-2">{paper.pages}</td>
                                <td className="border p-2">{paper.indexing}</td>
                                <td className="border p-2">{paper.foreignAuthor}</td>
                                <td className="border p-2">{paper.studentInvolved}</td>
                                <td className="border p-2">{paper.doi}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Books Section */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">(d) Books/Monographs/Chapters</h3>
                
                {/* Textbooks */}
                <div className="mb-6">
                    <h4 className="font-medium mb-2">Text Books Authored</h4>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2">Sr. No.</th>
                                <th className="border p-2">Title</th>
                                <th className="border p-2">Authors</th>
                                <th className="border p-2">Publisher</th>
                                <th className="border p-2">ISBN</th>
                                <th className="border p-2">Year</th>
                                <th className="border p-2">Scopus Indexed</th>
                                <th className="border p-2">DOI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.step3.books.textbooks.map((book, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{idx + 1}</td>
                                    <td className="border p-2">{book.title}</td>
                                    <td className="border p-2">{book.authors}</td>
                                    <td className="border p-2">{book.publisher}</td>
                                    <td className="border p-2">{book.isbn}</td>
                                    <td className="border p-2">{book.year}</td>
                                    <td className="border p-2">{book.scopusIndexed ? 'Yes' : 'No'}</td>
                                    <td className="border p-2">{book.doi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edited Books */}
                <div className="mb-6">
                    <h4 className="font-medium mb-2">Books Edited</h4>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2">Sr. No.</th>
                                <th className="border p-2">Title</th>
                                <th className="border p-2">Editors</th>
                                <th className="border p-2">Publisher</th>
                                <th className="border p-2">ISBN</th>
                                <th className="border p-2">Year</th>
                                <th className="border p-2">Scopus Indexed</th>
                                <th className="border p-2">DOI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.step3.books.editedBooks.map((book, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{idx + 1}</td>
                                    <td className="border p-2">{book.title}</td>
                                    <td className="border p-2">{book.editors}</td>
                                    <td className="border p-2">{book.publisher}</td>
                                    <td className="border p-2">{book.isbn}</td>
                                    <td className="border p-2">{book.year}</td>
                                    <td className="border p-2">{book.scopusIndexed ? 'Yes' : 'No'}</td>
                                    <td className="border p-2">{book.doi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Book Chapters */}
                <div className="mb-6">
                    <h4 className="font-medium mb-2">Book Chapters</h4>
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2">Sr. No.</th>
                                <th className="border p-2">Authors</th>
                                <th className="border p-2">Chapter Title</th>
                                <th className="border p-2">Book Title</th>
                                <th className="border p-2">Pages</th>
                                <th className="border p-2">Publisher</th>
                                <th className="border p-2">ISBN</th>
                                <th className="border p-2">Year</th>
                                <th className="border p-2">Scopus Indexed</th>
                                <th className="border p-2">DOI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.step3.books.chapters.map((chapter, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2">{idx + 1}</td>
                                    <td className="border p-2">{chapter.authors}</td>
                                    <td className="border p-2">{chapter.chapterTitle}</td>
                                    <td className="border p-2">{chapter.bookTitle}</td>
                                    <td className="border p-2">{chapter.pages}</td>
                                    <td className="border p-2">{chapter.publisher}</td>
                                    <td className="border p-2">{chapter.isbn}</td>
                                    <td className="border p-2">{chapter.year}</td>
                                    <td className="border p-2">{chapter.scopusIndexed ? 'Yes' : 'No'}</td>
                                    <td className="border p-2">{chapter.doi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="page-break"></div>

            {/* Marks Summary Section */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">VIII. MARKS CLAIMED BY FACULTY MEMBER</h2>
                {marksTable}
            </div>

            {/* Signature Section */}
            <div className="mb-8">
                <div className="text-right">
                    <p>(Signature of faculty member with date)</p>
                    <div className="mt-20">
                        <p>Signature</p>
                        <p className="mr-16">Date:</p>
                    </div>
                </div>
            </div>

            {/* Forwarding Section */}
            <div className="page-break"></div>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">IX. FORWARDING, APPRAISAL & FOLLOW UP</h2>
                
                <div className="mb-6">
                    <h3 className="font-semibold mb-4">A) Forwarded by Head of Department/ Centre:</h3>
                    <p className="text-sm mb-4">(With comments, if necessary, about the information given)</p>
                    <div className="border p-4 rounded min-h-[100px]"></div>
                    <div className="text-right mt-4">
                        <p>(Signature of H.O.D. with date)</p>
                        <div className="mt-20">
                        <p>Signature</p>
                        <p className="mr-16">Date:</p>
                    </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">B) Comments of Appraisal Committee</h3>
                    {appraisalTable}
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">C) Follow up Action:</h3>
                    <div className="border p-4 rounded min-h-[100px]"></div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold mb-4">D) Comments of external expert(s):</h3>
                    <div className="border p-4 rounded min-h-[100px]"></div>
                </div>

                <div className="text-right mt-8">
                    <p>DIRECTOR/ DIRECTOR'S NOMINEE</p>
                    <div className="mt-20">
                        <p>Signature</p>
                        <p className="mr-16">Date:</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 