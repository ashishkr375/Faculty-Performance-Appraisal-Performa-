'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SaveLoader } from '@/components/SaveLoader';
import Loading from '@/app/loading';
import { fetchFacultyData } from '@/lib/fetchFacultyData';

interface PhDStudent {
    studentName: string;
    rollNo: string;
    registrationYear: string;
    status: string;
    stipendType: string;
    researchArea: string;
    otherSupervisors: string;
    sciPublications: number;
    scopusPublications: number;
    currentStatus: string;
    statusDate: string;
}

interface JournalPaper {
    authors: string;
    title: string;
    journal: string;
    volume: string;
    year: string;
    pages: string;
    quartile: string;
    publicationDate: string;
    studentInvolved: string;
    doi: string;
}

interface ConferencePaper {
    authors: string;
    title: string;
    conference: string;
    location: string;
    year: number;
    pages: string;
    indexing: string;
    foreignAuthor: string;
    studentInvolved: string;
    doi: string;
}

interface Book {
    title: string;
    authors: string;
    publisher: string;
    isbn: string;
    year: string;
    scopusIndexed: boolean;
    doi: string;
}

interface FormData {
    phdSupervision: PhDStudent[];
    journalPapers: JournalPaper[];
    conferencePapers: ConferencePaper[];
    books: {
        textbooks: Book[];
        editedBooks: Book[];
        chapters: Book[];
    };
    calculatedMarks: number;
}

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
            currentStatus: "Latest status (Comprehensive/Pre-submission/Submitted/Awarded/Ongoing)",
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
    const [formData, setFormData] = useState<FormData>({
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
        const fetchSavedData = async () => {
            try {
                setLoading(true);
                if (status === 'unauthenticated') {
                    router.push("/auth/signin");
                    return;
                }
    
                const response = await fetch("/api/get-part?step=3");
                if (!response.ok) {
                    console.error("Failed to fetch data");
                    setLoading(false);
                    return;
                }
    
                const { stepData: existingData, appraisalPeriod } = await response.json();
                const appraisalYear = new Date(appraisalPeriod).getFullYear();
    
                const facultyData = await fetchFacultyData(session?.user?.email || '');

                if (facultyData) {
                    console.log(facultyData?.phd_candidates);

                    let phdSupervisionMarks = 0;
                    const phdSupervision = facultyData?.phd_candidates?.map(candidate => {
                        let marks = 0;
                        const registrationYear = candidate.registration_year;
                        const currentYear = new Date().getFullYear();
                        const yearsInPhD = currentYear - registrationYear;
    
                        if (candidate.current_status != "Awarded") {
                            if (yearsInPhD <= 3) marks += 2;
                            else if (yearsInPhD <= 5) marks += 1; 
                        }
                        if (candidate.current_status === "Awarded") {
                            marks += 4;
                        }
    
                        phdSupervisionMarks += marks;
                        return marks > 0 ? {
                            studentName: `${candidate.student_name} (${candidate.roll_no})`,
                            rollNo: candidate.roll_no,
                            registrationYear: candidate.registration_year,
                            status: candidate.current_status,
                            stipendType: candidate.registration_type,
                            researchArea: candidate.research_area,
                            otherSupervisors: candidate.other_supervisors,
                            marks,
                            statusDate: candidate.completion_year
                        } : null;
                    }).filter(candidate => candidate !== null && candidate.registrationYear <=appraisalYear) || [];
    
                    phdSupervisionMarks = Math.min(phdSupervisionMarks, 10);
    
                    const journalPapers = facultyData?.journal_papers?.map(paper => {
                        let marks = 0;
                        const publicationYear = new Date(paper.publication_date).getFullYear();
                        // endYear >= appraisalYear && startYear <= appraisalYear
                        if (publicationYear == appraisalYear) { //publicationYear>=appraisalYear
                            switch (paper.journal_quartile) {
                                case 'Q1': marks = 4; break;
                                case 'Q2': marks = 3; break;
                                case 'Q3': marks = 2; break;
                                case 'Q4': marks = 1; break;
                                default: marks = 0; break;
                            }
                            const isScopusIndexed = paper.journal_name && paper.journal_name.toLowerCase().includes('scopus');
                            if (isScopusIndexed && marks === 0) {
                                marks = 1;
                            }
    
                            const authorCount = paper.authors.split(',').length;
                            if (authorCount > 1) {
                                marks = Math.floor(marks / authorCount);
                            }
    
                            return marks > 0 ? {
                                authors: paper.authors,
                                title: paper.title,
                                journal: paper.journal_name,
                                volume: paper.volume,
                                year: paper.publication_year,
                                pages: paper.pages,
                                quartile: paper.journal_quartile,
                                publicationDate: paper.publication_date.split("T")[0],
                                studentInvolved: paper.student_involved ? 'Yes' : 'No',
                                doi: paper.doi_url,
                                marks,
                            } : null;
                        }
                        return null;
                    }).filter(paper => paper !== null) || [];
    
                    const totalJournalMarks = journalPapers.reduce((total, paper) => total + (paper?.marks || 0), 0);
                    const cappedJournalMarks = Math.min(totalJournalMarks, 10);
    
                    let conferencePapersMarks = 0;
                    const conferencePapers = facultyData?.conference_papers?.map(paper => {
                        // const conferenceYear = new Date(paper.conference_year).getFullYear();
                        const conferenceYear = paper.conference_year
                        // conferenceYear >= appraisalYear
                        if (conferenceYear == appraisalYear) {
                            let marks = 0;
                            if (paper.indexing === 'SCOPUS' || paper.indexing === 'Web of Science') {
                                marks = 0.5;
                            } else {
                                marks = 0.25;
                            }
                            conferencePapersMarks += marks;
                            return {
                                authors: paper.authors ? paper.authors.split(',').map(author => author.trim()) : [],
                                title: paper.title,
                                conference: paper.conference_name,
                                location: paper.location,
                                year: conferenceYear,
                                pages: paper.pages,
                                indexing: paper.indexing,
                                studentInvolved: paper.student_involved,
                                doi: paper.doi,
                                foreignAuthor:paper.foreign_author,
                                marks
                            };
                        }
                        return null;
                    }).filter(paper => paper !== null) || [];
    
                    conferencePapersMarks = Math.min(conferencePapersMarks, 5);
    
                    let booksMarks = 0;
                    const books = {
                        textbooks: facultyData?.textbooks?.map(book => {
                            const bookYear = book.year;
                            // bookYear >= appraisalYear
                            if (bookYear == appraisalYear) {
                                booksMarks += 6;
                                return {
                                    title: book.title,
                                    authors: book.authors,
                                    publisher: book.publisher,
                                    isbn: book.isbn,
                                    year: bookYear,
                                    scopusIndexed: book.scopus.toLowerCase() === "yes",
                                    doi: book.doi,
                                    pages: book.pages,
                                    marks: 6
                                };
                            }
                            return null;
                        }).filter(book => book !== null) || [],
    
                        editedBooks: facultyData?.edited_books?.map(book => {
                            const bookYear = book.year;
                            // bookYear >= appraisalYear
                            if (bookYear == appraisalYear) {
                                booksMarks += 4;
                                return {
                                    title: book.title,
                                    authors: book.editors,
                                    editors:book.editors,
                                    publisher: book.publisher,
                                    isbn: book.isbn,
                                    year: bookYear,
                                    scopusIndexed: book.scopus.toLowerCase() === "yes",
                                    doi: book.doi,
                                    pages: book.pages,
                                    marks: 4 
                                };
                            }
                            return null;
                        }).filter(book => book !== null) || [],
    
                        chapters: facultyData?.book_chapters?.map(chapter => {
                            const chapterYear = chapter.year;
                            // chapterYear >= appraisalYear
                            if (chapterYear == appraisalYear) {
                                booksMarks += 2;
                                return {
                                    chapterTitle: chapter.chapter_title,
                                    authors: chapter.authors,
                                    bookTitle: chapter.book_title,
                                    publisher: chapter.publisher,
                                    isbn: chapter.isbn,
                                    year: chapterYear,
                                    scopusIndexed: chapter.scopus.toLowerCase() === "yes",
                                    doi: chapter.doi,
                                    pages: chapter.pages,
                                    marks: 2 
                                };
                            }
                            return null;
                        }).filter(chapter => chapter !== null) || []
                    };
    
                    booksMarks = Math.min(booksMarks, 6);
    
                    const totalMarks = Math.min(
                        phdSupervisionMarks + cappedJournalMarks + conferencePapersMarks + booksMarks,
                        40
                    );
    
                    setFormData({
                        phdSupervision,
                        journalPapers,
                        conferencePapers,
                        books,
                        calculatedMarks: totalMarks,
                        totalMarks,
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setLoading(false);
            }
        };
    
        fetchSavedData();
    }, [status, router, session?.user?.email]);
    
    
    
    

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
                statusDate: '',
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
            <div className="mb-4 text-right">
                <span className="font-semibold">Total Marks: </span>
                <span className="text-blue-600">{formData.calculatedMarks}</span>
                <span className="text-gray-600">/40</span>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* PhD Supervision Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">PhD Research Supervision</h2>
                    <p className="text-sm text-gray-600 mb-4">[Max marks: 10]</p>
                    <p className="text-sm text-gray-600 mb-4">[Ph.D. pursuing: 02 marks per Ph.D. student till 03 years of registration, 01 marks per Ph.D. student during 4th and 5th year of registration. No marks shall be awarded for Ph.D. guidance after 05 years of registration, Ph.D. Awarded: 04 marks per Candidate]</p>
                    
                    {formData.phdSupervision.map((student, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            {/* <button
                                type="button"
                                onClick={() => handleRemovePhDStudent(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold"
                                title="Delete record"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                        placeholder="Student Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">Registration Year and Type</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={student.registrationYear}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, registrationYear: e.target.value };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded bg-gray-200"
                                            placeholder="Year"
                                            required
                                            disabled={true}
                                        />
                                        <select
                                            value={student.stipendType}
                                            disabled={true}
                                            onChange={(e) => {
                                                const updated = [...formData.phdSupervision];
                                                updated[index] = { ...student, status: e.target.value as 'FT' | 'PT' };
                                                setFormData({ ...formData, phdSupervision: updated });
                                            }}
                                            className="w-1/2 p-2 border rounded bg-gray-200"
                                        >
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="SRF">SRF</option>
                                            <option value="JRF">JRF</option>
                                            {/* <option value="PT">pursuing phd</option> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                    {/* <input type='text' value={student.status} /> */}
                                    <select
                                        value={student.status}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, currentStatus: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        required
                                        disabled={true}                                        
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Comprehension">Comprehensive done</option>
                                        <option value="Presubmission ">Pre-submission done</option>
                                        <option value="Thesis_Submitted">Thesis submitted</option>
                                        <option value="Awarded">Awarded</option>
                                        <option value="Ongoing">Ongoing</option>
                                    </select>
                                </div>
                                <div>
                                    {/* <label className="block mb-2">Status Date </label> */}
                                    <label className="block mb-2">Completion Year </label>
                                    <input
                                        type="text"
                                        value={student.statusDate}
                                        onChange={(e) => {
                                            const updated = [...formData.phdSupervision];
                                            updated[index] = { ...student, statusDate: e.target.value };
                                            setFormData({ ...formData, phdSupervision: updated });
                                        }}
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddPhDStudent}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add PhD Student
                    </button> */}
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
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveJournalPaper(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200" disabled={true}
                                        
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddJournalPaper}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Journal Paper
                    </button> */}
                </section>

                {/* Conference Papers Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Conference Papers</h2>
                    {formData.conferencePapers.map((paper, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveConferencePaper(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        disabled={true}
                                        className="w-full p-2 border rounded bg-gray-300"
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
                                        disabled={true}
                                        onChange={(e) => {
                                            const updated = [...formData.conferencePapers];
                                            updated[index] = { ...paper, foreignAuthor: e.target.value };
                                            setFormData({ ...formData, conferencePapers: updated });
                                        }}
                                        className="w-full p-2 border rounded bg-gray-300 "
                                        // disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    />
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddConferencePaper}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Conference Paper
                    </button> */}
                </section>

                {/* Books Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Books/Monographs/Chapters</h2>
                    <h3 className="text-lg font-medium mb-3">Textbooks</h3>
                    {formData.books.textbooks.map((book, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveTextbook(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        required
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        required
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddTextBook}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Textbook
                    </button> */}

                    <h3 className="text-lg font-medium mb-3 mt-6">Edited Books</h3>
                    {formData.books.editedBooks.map((book, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveEditedBook(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        required
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    
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
                                        disabled={true}
                                        className="w-full p-2 border rounded "
                                        
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddEditedBook}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Edited Book
                    </button> */}

                    <h3 className="text-lg font-medium mb-3 mt-6">Book Chapters</h3>
                    {formData.books.chapters.map((chapter, index) => (
                        <div key={index} className="border p-4 rounded mb-4 relative">
                            {/* <button
                                type="button"
                                onClick={() => handleRemoveBookChapter(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button> */}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
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
                                        disabled={true}
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
                                        className="w-full p-2 border rounded bg-gray-200"
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        onClick={handleAddBookChapter}
                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600"
                    >
                        + Add Book Chapter
                    </button> */}
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