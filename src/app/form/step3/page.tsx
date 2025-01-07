'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SaveLoader } from '@/components/SaveLoader';
import Loading from '@/app/loading';
import { fetchFacultyData } from '@/lib/fetchFacultyData';

const SECTION_DESCRIPTIONS = {
    phdSupervision: {
        title: "Ph.D Research Supervision",
        description: "Maximum marks: 10. Ph.D. pursuing: 02 marks per Ph.D. student till 03 years of registration, 01 marks per Ph.D. student during 4th and 5th year of registration. No marks shall be awarded for Ph.D. guidance after 05 years of registration. Ph.D. Awarded: 04 marks per Candidate",
        fields: {
            name: "Full name and Roll Number of the student",
            registrationYear: "Year of registration",
            status: "Current status (FT with stipend under Institute/TEQIP/Project/PT)",
            area: "Research area and thesis title",
            otherSupervisors: "Other supervisors' details (if any)",
            sciPublications: "Number of SCI publications during reported period",
            scopusPublications: "Number of Scopus publications during reported period",
            currentStatus: "Latest status (Comprehensive/Pre-submission/Submitted/Awarded)",
            statusDate: "Date of latest status"
        }
    },
    journalPapers: {
        title: "Refereed Journal Papers",
        description: "04 marks for Q1 journal, 03 marks for Q2 journal, 02 marks for Q3 journal, 01 mark for Q4 journal/Scopus, no marks for other journals. Full marks for publications with only supervisor and registered students, otherwise marks divided equally among authors.",
        fields: {
            authors: "Author names in sequence as in paper",
            title: "Complete paper title",
            journal: "Journal name",
            volume: "Volume number",
            year: "Publication year",
            pages: "Page numbers",
            quartile: "Journal quartile (Q1/Q2/Q3/Q4)",
            date: "Publication date",
            students: "Involved NITP students (name and roll number)",
            url: "Paper URL/DOI"
        }
    }
};

export default function Step3Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        phdSupervision: [],
        journalPapers: [],
        conferencePapers: [],
        books: {
            textbooks: [],
            editedBooks: [],
            chapters: []
        },
        calculatedMarks: 0
    });
    const [loading, setLoading] = useState(true);
    const [hasAdminData, setHasAdminData] = useState(false);

    useEffect(() => {
        if (!session?.user?.email || status === 'loading') return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/get-part?step=3');
                const savedData = await response.json();

                if (savedData) {
                    setFormData(savedData);
                } else {
                    // Fetch from faculty API
                    const facultyData = await fetchFacultyData(session.user.email);
                    
                    if (facultyData) {
                        // Convert PhD candidates data
                        const phdStudents = facultyData.phd_candidates.map(student => ({
                            name: student.phd_student_name,
                            registrationYear: student.start_year,
                            status: 'FT', // Default value
                            area: student.thesis_topic,
                            otherSupervisors: '',
                            sciPublications: 0,
                            scopusPublications: 0,
                            currentStatus: student.completion_year === 'Ongoing' ? 'Pursuing' : 'Awarded',
                            statusDate: student.completion_year === 'Ongoing' ? '' : student.completion_year
                        }));

                        // Parse publications data if available
                        let publications = [];
                        if (facultyData.publications?.[0]?.publications) {
                            try {
                                const parsedPubs = JSON.parse(facultyData.publications[0].publications);
                                publications = parsedPubs.map(pub => ({
                                    authors: pub.authors || '',
                                    title: pub.title || '',
                                    journal: pub.journal_name || '',
                                    volume: '',
                                    year: pub.year || '',
                                    pages: '',
                                    quartile: '',
                                    date: '',
                                    students: '',
                                    url: pub.citation_key || ''
                                }));
                            } catch (error) {
                                console.error('Error parsing publications:', error);
                            }
                        }

                        setFormData({
                            ...formData,
                            phdSupervision: phdStudents,
                            journalPapers: publications
                        });
                        setHasAdminData(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session, status]);

    const handleAddPhDStudent = () => {
        setFormData({
            ...formData,
            phdSupervision: [...formData.phdSupervision, {
                studentName: '',
                rollNo: '',
                registrationYear: '',
                status: 'FT',
                stipendType: '',
                researchArea: '',
                otherSupervisors: '',
                sciPublications: 0,
                scopusPublications: 0,
                currentStatus: '',
                statusDate: ''
            }]
        });
    };

    const handleAddJournalPaper = () => {
        setFormData({
            ...formData,
            journalPapers: [...formData.journalPapers, {
                authors: '',
                title: '',
                journal: '',
                volume: '',
                year: '',
                pages: '',
                quartile: 'Q1',
                publicationDate: '',
                studentInvolved: '',
                doi: ''
            }]
        });
    };

    const handleAddConferencePaper = () => {
        setFormData({
            ...formData,
            conferencePapers: [...formData.conferencePapers, {
                authors: '',
                title: '',
                conference: '',
                location: '',
                year: '',
                pages: '',
                indexing: 'SCOPUS',
                foreignAuthor: '',
                studentInvolved: '',
                doi: ''
            }]
        });
    };

    const handleAddTextBook = () => {
        setFormData({
            ...formData,
            books: {
                ...formData.books,
                textbooks: [...formData.books.textbooks, {
                    title: '',
                    authors: '',
                    publisher: '',
                    isbn: '',
                    year: '',
                    scopusIndexed: false,
                    doi: ''
                }]
            }
        });
    };

    const handleAddEditedBook = () => {
        setFormData({
            ...formData,
            books: {
                ...formData.books,
                editedBooks: [...formData.books.editedBooks, {
                    title: '',
                    editors: '',
                    publisher: '',
                    isbn: '',
                    year: '',
                    scopusIndexed: false,
                    doi: ''
                }]
            }
        });
    };

    const handleAddBookChapter = () => {
        setFormData({
            ...formData,
            books: {
                ...formData.books,
                chapters: [...formData.books.chapters, {
                    authors: '',
                    chapterTitle: '',
                    bookTitle: '',
                    pages: '',
                    publisher: '',
                    isbn: '',
                    year: '',
                    scopusIndexed: false,
                    doi: ''
                }]
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/save-part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    step: 3,
                    data: formData,
                }),
            });

            if (response.ok) {
                router.push('/form/step4');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const handleRemovePhDStudent = (index: number) => {
        const updatedStudents = formData.phdSupervision.filter((_, i) => i !== index);
        setFormData({ ...formData, phdSupervision: updatedStudents });
    };

    const handleRemoveJournalPaper = (index: number) => {
        const updatedPapers = formData.journalPapers.filter((_, i) => i !== index);
        setFormData({ ...formData, journalPapers: updatedPapers });
    };

    const handleRemoveConferencePaper = (index: number) => {
        const updatedPapers = formData.conferencePapers.filter((_, i) => i !== index);
        setFormData({ ...formData, conferencePapers: updatedPapers });
    };

    const handleRemoveTextbook = (index: number) => {
        const updatedBooks = formData.books.textbooks.filter((_, i) => i !== index);
        setFormData({ ...formData, books: { ...formData.books, textbooks: updatedBooks } });
    };

    const handleRemoveEditedBook = (index: number) => {
        const updatedBooks = formData.books.editedBooks.filter((_, i) => i !== index);
        setFormData({ ...formData, books: { ...formData.books, editedBooks: updatedBooks } });
    };

    const handleRemoveBookChapter = (index: number) => {
        const updatedChapters = formData.books.chapters.filter((_, i) => i !== index);
        setFormData({ ...formData, books: { ...formData.books, chapters: updatedChapters } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Research Papers & Publications</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* PhD Supervision Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">PhD Research Supervision</h2>
                    <p className="text-sm text-gray-600 mb-4">[Max marks: 10]</p>
                    <p className="text-sm text-gray-600 mb-4">[Ph.D. pursuing: 02 marks per Ph.D. student till 03 years of registration, 01 marks per Ph.D. student during 4th and 5th year of registration. No marks shall be awarded for Ph.D. guidance after 05 years of registration, Ph.D. Awarded: 04 marks per Candidate]</p>
                    
                    {formData.phdSupervision.map((student, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemovePhDStudent(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                                title="Delete record"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Student Name & Roll No.</label>
                                    <input
                                        type="text"
                                        value={student.studentName}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, studentName: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        placeholder="Student Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Registration Year and Status</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={student.registrationYear}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, registrationYear: e.target.value };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded"
                                            placeholder="Year"
                                            required
                                        />
                                        <select
                                            value={student.status}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, status: e.target.value as 'FT' | 'PT' };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded"
                                        >
                                            <option value="FT">Full Time with Stipend under Institute</option>
                                            <option value="TEQIP">TEQIP</option>
                                            <option value="PT">Part Time</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Area of research/Title of thesis undertaken</label>
                                    <input
                                        type="text"
                                        value={student.researchArea}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, researchArea: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Other Supervisors (if any), name, department & institute</label>
                                    <input
                                        type="text"
                                        value={student.otherSupervisors}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, otherSupervisors: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Publications Count</label>
                                    <div className="flex gap-2">
                                        <label className="block mb-2">SCI</label>
                                        <input
                                            type="number"
                                            value={student.sciPublications}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, sciPublications: parseInt(e.target.value) };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded"
                                            placeholder="SCI"
                                            min="0"
                                        />
                                        
                                    </div>
                                    <div className="flex gap-2">
                                        <label className="block mb-2">Scopus</label>
                                        <input
                                            type="number"
                                            value={student.scopusPublications}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, scopusPublications: parseInt(e.target.value) };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded"
                                            placeholder="Scopus"
                                            min="0"
                                        />
                                        
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2">Current Status</label>
                                    <select
                                        value={student.currentStatus}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, currentStatus: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Comprehensive done">Comprehensive done</option>
                                        <option value="Pre-submission done">Pre-submission done</option>
                                        <option value="Thesis submitted">Thesis submitted</option>
                                        <option value="Awarded">Awarded</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2">Status Date </label>
                                    <input
                                        type="date"
                                        value={student.statusDate}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, statusDate: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPhDStudent}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add PhD Student
                    </button>
                </section>

                {/* Journal Papers Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Journal Papers</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Refereed journal papers with foreign researchers must be highlighted.
                        (https://www.webofscience.com/wos/author/search) except joint publication with foreign researchers/authors (Published during the appraisal period):
                        
                        [04 marks for Q1 journal, 03 marks for Q2 journal, 02 marks for Q3 journal, 01 mark for Q4 journal/ any journal publication in Scopus, and no marks for other journals publication (non-quartile/non-indexed journals in WOS and Scopus)]
                        
                        Note: 
                        • Quartile as per JCR and JCI in WOS are valid to get the marks 
                        • Claim of marks can be made only for published journal paper(s) during the appraisal period
                        • Full marks as per the eligible quartile for publication should only be given when publication is only limited to supervisor and their registered students, otherwise all marks as per the eligible quartile will be equally divided among the authors.
                    </p>
                    {formData.journalPapers.map((paper, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveJournalPaper(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Authors</label>
                                    <input
                                        type="text"
                                        value={paper.authors}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, authors: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={paper.title}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, title: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Journal</label>
                                    <input
                                        type="text"
                                        value={paper.journal}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, journal: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Volume</label>
                                    <input
                                        type="text"
                                        value={paper.volume}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, volume: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={paper.year}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, year: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Pages</label>
                                    <input
                                        type="text"
                                        value={paper.pages}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, pages: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Please mention Quartile of the journal, i.e., Q1, Q2, Q3 and Q4
[Kindly search the quartile of the journal at 
https://www.webofscience.com/wos/author/search by typing your name (authors details) in search box]
</label>
                                    <select
                                        value={paper.quartile}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, quartile: e.target.value as 'Q1' | 'Q2' | 'Q3' | 'Q4' };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="Q1">Q1</option>
                                        <option value="Q2">Q2</option>
                                        <option value="Q3">Q3</option>
                                        <option value="Q4">Q4</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2">Date of publication
 (Paper having date of publication after appraisal period should not include)
</label>
                                    <input
                                        type="date"
                                        value={paper.publicationDate}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, publicationDate: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Is NITP PhD/M Tech/B Tech student involved, if yes, please provide the name and Roll. no. </label>
                                    <input
                                        type="text"
                                        value={paper.studentInvolved}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, studentInvolved: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">URL/DOI</label>
                                    <input
                                        type="text"
                                        value={paper.doi}
                                        onChange={(e) => {
                                            const updated = [...formData.journalPapers];
                                            updated[index] = { ...paper, doi: e.target.value };
                                            setFormData({ ...formData, journalPapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddJournalPaper}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Journal Paper
                    </button>
                </section>

                {/* Conference Papers Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Conference Papers</h2>
                    {formData.conferencePapers.map((paper, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveConferencePaper(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Authors</label>
                                    <input
                                        type="text"
                                        value={paper.authors}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, authors: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={paper.title}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, title: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Conference</label>
                                    <input
                                        type="text"
                                        value={paper.conference}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, conference: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={paper.location}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, location: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={paper.year}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, year: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Pages</label>
                                    <input
                                        type="text"
                                        value={paper.pages}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, pages: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Indexing</label>
                                    <select
                                        value={paper.indexing}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, indexing: e.target.value as 'SCOPUS' | 'Web of Science' | 'Non-indexed' };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="SCOPUS">SCOPUS</option>
                                        <option value="Web of Science">Web of Science</option>
                                        <option value="Non-indexed">Non-indexed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2">Foreign Author</label>
                                    <input
                                        type="text"
                                        value={paper.foreignAuthor}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, foreignAuthor: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Student Involved</label>
                                    <input
                                        type="text"
                                        value={paper.studentInvolved}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, studentInvolved: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">DOI</label>
                                    <input
                                        type="text"
                                        value={paper.doi}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, doi: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddConferencePaper}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Conference Paper
                    </button>
                </section>

                {/* Books Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Books/Monographs/Chapters</h2>
                    <h3 className="text-lg font-medium mb-3">Textbooks</h3>
                    {formData.books.textbooks.map((book, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveTextbook(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={book.title}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, title: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Authors</label>
                                    <input
                                        type="text"
                                        value={book.authors}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, authors: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Publisher</label>
                                    <input
                                        type="text"
                                        value={book.publisher}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, publisher: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">ISBN</label>
                                    <input
                                        type="text"
                                        value={book.isbn}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, isbn: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={book.year}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, year: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Scopus Indexed</label>
                                    <input
                                        type="checkbox"
                                        checked={book.scopusIndexed}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, scopusIndexed: e.target.checked };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">DOI</label>
                                    <input
                                        type="text"
                                        value={book.doi}
                                        onChange={(e) => {
                                            const updated = [...formData.books.textbooks];
                                            updated[index] = { ...book, doi: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, textbooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddTextBook}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Textbook
                    </button>

                    <h3 className="text-lg font-medium mb-3 mt-6">Edited Books</h3>
                    {formData.books.editedBooks.map((book, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveEditedBook(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={book.title}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, title: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Editors</label>
                                    <input
                                        type="text"
                                        value={book.editors}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, editors: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Publisher</label>
                                    <input
                                        type="text"
                                        value={book.publisher}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, publisher: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">ISBN</label>
                                    <input
                                        type="text"
                                        value={book.isbn}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, isbn: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={book.year}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, year: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Scopus Indexed</label>
                                    <input
                                        type="checkbox"
                                        checked={book.scopusIndexed}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, scopusIndexed: e.target.checked };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">DOI</label>
                                    <input
                                        type="text"
                                        value={book.doi}
                                        onChange={(e) => {
                                            const updated = [...formData.books.editedBooks];
                                            updated[index] = { ...book, doi: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, editedBooks: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddEditedBook}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Edited Book
                    </button>

                    <h3 className="text-lg font-medium mb-3 mt-6">Book Chapters</h3>
                    {formData.books.chapters.map((chapter, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            <button
                                type="button"
                                onClick={() => handleRemoveBookChapter(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">Authors</label>
                                    <input
                                        type="text"
                                        value={chapter.authors}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, authors: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Chapter Title</label>
                                    <input
                                        type="text"
                                        value={chapter.chapterTitle}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, chapterTitle: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Book Title</label>
                                    <input
                                        type="text"
                                        value={chapter.bookTitle}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, bookTitle: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Pages</label>
                                    <input
                                        type="text"
                                        value={chapter.pages}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, pages: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Publisher</label>
                                    <input
                                        type="text"
                                        value={chapter.publisher}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, publisher: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">ISBN</label>
                                    <input
                                        type="text"
                                        value={chapter.isbn}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, isbn: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Year</label>
                                    <input
                                        type="text"
                                        value={chapter.year}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, year: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Scopus Indexed</label>
                                    <input
                                        type="checkbox"
                                        checked={chapter.scopusIndexed}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, scopusIndexed: e.target.checked };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">DOI</label>
                                    <input
                                        type="text"
                                        value={chapter.doi}
                                        onChange={(e) => {
                                            const updated = [...formData.books.chapters];
                                            updated[index] = { ...chapter, doi: e.target.value };
                                            setFormData({ ...formData, books: { ...formData.books, chapters: updated } });
                                        }}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddBookChapter}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Book Chapter
                    </button>
                </section>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => router.push('/form/step2')}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Previous
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Next: Sponsored R&D
                    </button>
                </div>
            </form>
        </div>
    );
} 