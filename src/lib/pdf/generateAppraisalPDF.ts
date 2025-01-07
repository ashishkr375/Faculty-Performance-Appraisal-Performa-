import PDFDocument from 'pdfkit';
import { FormData } from '@/types/form';

// Helper function to create tables
function createTable(doc: PDFKit.PDFDocument, headers: string[], data: string[][], options = {}) {
    const {
        cellPadding = 5,
        fontSize = 10,
        headerFontSize = 10,
        borders = true,
        width = doc.page.width - 100,
    } = options;

    const tableTop = doc.y;
    const tableLeft = 50;
    const columnWidths = options.columnWidths || headers.map(() => width / headers.length);
    const cellHeight = 25; // Increased for better readability

    // Draw headers with background
    doc.font('Times-Bold').fontSize(headerFontSize);
    headers.forEach((header, i) => {
        const x = tableLeft + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
        
        // Draw cell border
        if (borders) {
            doc.rect(x, tableTop, columnWidths[i], cellHeight).stroke();
        }
        
        // Draw header text
        doc.text(
            header,
            x + cellPadding,
            tableTop + (cellHeight - doc.currentLineHeight()) / 2,
            {
                width: columnWidths[i] - (cellPadding * 2),
                align: 'center',
                lineBreak: true
            }
        );
    });

    // Draw data rows
    doc.font('Times-Roman').fontSize(fontSize);
    let currentY = tableTop + cellHeight;

    data.forEach((row, rowIndex) => {
        const maxLines = row.reduce((max, cell, i) => {
            const lines = doc.heightOfString(cell, {
                width: columnWidths[i] - (cellPadding * 2)
            }) / doc.currentLineHeight();
            return Math.max(max, Math.ceil(lines));
        }, 1);

        const rowHeight = Math.max(cellHeight, maxLines * doc.currentLineHeight() + cellPadding * 2);

        row.forEach((cell, columnIndex) => {
            const x = tableLeft + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
            
            // Draw cell border
            if (borders) {
                doc.rect(x, currentY, columnWidths[columnIndex], rowHeight).stroke();
            }
            
            // Draw cell content
            doc.text(
                cell,
                x + cellPadding,
                currentY + (rowHeight - doc.currentLineHeight()) / 2,
                {
                    width: columnWidths[columnIndex] - (cellPadding * 2),
                    align: 'center',
                    lineBreak: true
                }
            );
        });

        currentY += rowHeight;
    });

    doc.y = currentY + 10;
}

// Helper function to create underlined text fields
function createField(doc: PDFKit.PDFDocument, label: string, value: string, options = {}) {
    const startX = doc.x;
    doc.text(label, { continued: true })
       .text(': ', { continued: true });
    
    const labelWidth = doc.widthOfString(label) + doc.widthOfString(': ');
    doc.text(value || '_'.repeat(40), startX + labelWidth);
    doc.moveDown(0.5);
}

export async function generateAppraisalPDF(formData: FormData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                autoFirstPage: true,
                size: 'A4',
                margin: 50,
                bufferPages: true
            });

            const chunks: any[] = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Create all pages
            createFirstPage(doc, formData);
            doc.addPage();
            createSecondPage(doc, formData);
            doc.addPage();
            createThirdPage(doc, formData);
            doc.addPage();
            createFourthPage(doc, formData);
            doc.addPage();
            createFifthPage(doc, formData);
            doc.addPage();
            createSixthPage(doc, formData);
            doc.addPage();
            createSeventhPage(doc, formData);
            doc.addPage();
            createEighthPage(doc, formData);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

function createFirstPage(doc: PDFKit.PDFDocument, formData: any) {
    // Header
    doc.font('Times-Bold')
       .fillColor('blue')
       .fontSize(16)
       .text('NATIONAL INSTITUTE OF TECHNOLOGY PATNA', {
           align: 'center'
       })
       .moveDown(0.5);

    doc.fillColor('black')
       .fontSize(12)
       .text('Faculty Performance Appraisal Performa', {
           align: 'center'
       })
       .moveDown(1);

    doc.text('Appraisal Period: January 01, --------- to December 31: ---------', {
        align: 'center'
    })
    .moveDown(1);

    doc.fontSize(10)
       .text('Note: Please mention each and every information only for the appraisal period.', {
           align: 'center'
       });
    doc.text('(Attach additional sheet, if necessary)', {
        align: 'center'
    })
    .moveDown(2);

    // Personal Information
    createField(doc, 'Name', formData.personalInfo?.name || '');
    createField(doc, 'Designation', formData.personalInfo?.designation || '');
    createField(doc, 'Deptt. /Centre', `Department of ${formData.personalInfo?.department || ''}`);
    createField(doc, 'If, Joint Faculty (Name of the Department where Joint Faculty)', 
        formData.personalInfo?.jointFaculty || '');

    // Teaching Load Section
    doc.moveDown(1)
       .font('Times-Bold')
       .text('I        INSTRUCTIONAL ELEMENT   [Max marks: 25]')
       .moveDown(1);

    doc.font('Times-Roman')
       .text('(a)      Teaching Engagement (only such courses to be considered where at least 5 students are enrolled)')
       .moveDown(1);

    // Create UG/PG teaching load tables
    const teachingHeaders = [
        'Course No & Title',
        'Core/ Elective',
        'No of Students',
        'Weekly load\nL    T    P',
        'Total theory classes in hours & total lab. classes in hours',
        'Offering for how many years continuously?'
    ];

    // UG Table
    const ugRows = [
        ['UG I', '', '', '', '', ''],
        ['UG II', '', '', '', '', ''],
        ['PG', '', '', '', '', ''],
        ['Ph.D.', '', '', '', '', '']
    ];
    createTable(doc, teachingHeaders, ugRows);

    // Add page number
    addPageNumber(doc, 1);
}

function createSecondPage(doc: PDFKit.PDFDocument, formData: any) {
    doc.font('Times-Bold')
       .fontSize(12)
       .text('II.    RESEARCH PAPERS/PUBLICATIONS    [Max. marks: 40]')
       .moveDown();

    // PhD Research Supervision
    doc.font('Times-Roman')
       .text('(a) Ph.D Research Supervision')
       .moveDown();

    const phdHeaders = [
        'Name & Roll No.',
        'Registration Year and Status (FT with institute/TEQIP/Project (PT))',
        'Area of Research/Title of thesis undertaken',
        'Other supervisor(s) (if any)',
        'No. of publications by the student in Journals during reported period',
        'Current status'
    ];

    createTable(doc, phdHeaders, formData.researchPapers?.phdSupervision || []);

    // Add WOS note
    doc.fontSize(10)
       .text('(b)      Refereed journal papers indexed in WOS quartiles.')
       .text('Refereed journal papers with foreign researchers must be highlighted.')
       .text('(https://www.webofscience.com/wos/author/search)')
       .moveDown();

    addPageNumber(doc, 2);
}

// Continue with other pages...

function createThirdPage(doc: PDFKit.PDFDocument, formData: any) {
    // Journal papers table
    const journalHeaders = [
        'S. No',
        'Details of paper',
        'Please mention Quartile of the Journal',
        'Date of publication',
        'Is NITP Ph.D/M.Tech/B.Tech student involved',
        'URL/DOI'
    ];

    createTable(doc, journalHeaders, formData.researchPapers?.journalPapers || []);

    // Conference papers section
    doc.moveDown()
       .text('(c)      Refereed Conference Research Papers (Published during the appraisal period)')
       .moveDown();

    addPageNumber(doc, 3);
}

function createFourthPage(doc: PDFKit.PDFDocument, formData: any) {
    // Sponsored R&D Section
    doc.font('Times-Bold')
       .fontSize(12)
       .text('III        SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS')
       .moveDown();

    doc.font('Times-Roman')
       .text('(a)      Sponsored Research Projects from any Govt. agency/Industry/institute: (Project under')
       .text('TEQIP/Institute grant shall not be considered for marks):')
       .moveDown();

    // Add bullet points for marks
    doc.fontSize(10)
       .text('•  01 mark for each submitted research project (maximum up to 02 marks) to any Govt.')
       .text('   agency/Industry/institute during the period of reporting. (Note: Date of submission')
       .text('   should be between the period of appraisal. Status of project, i.e., accepted against the')
       .text('   submitted application are not eligible against this point).')
       .text('•  02 marks for completion/ongoing status, of each sponsored research project with')
       .text('   grant ≤ Rs. 5 lacs during the period of reporting.')
       .text('•  04 marks for completion/ongoing status, of each sponsored research project with')
       .text('   grant between Rs. 5 to Rs. 10 lacs during the period of reporting.')
       .text('•  05 marks for completion/ongoing status, of each sponsored research project with')
       .text('   grant ≥ Rs. 10 lacs during the period of reporting.')
       .moveDown();

    // Add Note section
    doc.text('Note:')
       .text('1.  Sponsored research project from industry: With the condition that for a research project,')
       .text('    grant from the Industry must be received in the institute account will only be considered')
       .text('    as "Sponsored research project from industry".')
       .moveDown();

    // Create sponsored projects table
    const projectHeaders = [
        'S.No.',
        'Title of Project',
        'Funding Agency',
        'Financial Outlay',
        'Start date',
        'End date',
        'Name of P.I and other Investigators',
        'PI institute name',
        'Status: Started/completed/in progress',
        'Did NIT Patna received any fund, if yes, mention the amount'
    ];

    createTable(doc, projectHeaders, formData.sponsoredRD?.projects || []);

    addPageNumber(doc, 4);
}

function createFifthPage(doc: PDFKit.PDFDocument, formData: any) {
    // IPR and Technology Transfer
    doc.text('(c)      IPR and Technology Transfer:')
       .moveDown();
    
    doc.fontSize(10)
       .text('Note: IPR containing "Institute name as Applicant or one of the Applicants" will only be considered.')
       .moveDown();

    const iprHeaders = [
        'S. No.',
        'Title of IPR',
        'Date of registration/filing',
        'Date of publication',
        'Grant No.',
        'Name of Applicant',
        'Name of Inventor(s)'
    ];

    createTable(doc, iprHeaders, formData.sponsoredRD?.ipr || []);

    // Startup section
    doc.moveDown()
       .text('(d)      Startup:')
       .moveDown();

    const startupHeaders = [
        'S. No.',
        'Name of startup',
        'Place of incubation (e.g., TBI NIT Patna or other)',
        'Date of registration as firm/company as per Indian govt act',
        'Name of owner (s) and founder (s)',
        'Annual Income (INR)',
        'PAN no. of reg. startup'
    ];

    createTable(doc, startupHeaders, formData.sponsoredRD?.startups || []);

    addPageNumber(doc, 5);
}

// Continue with pages 6-8...

function createSixthPage(doc: PDFKit.PDFDocument, formData: any) {
    // Management & Institutional Development Elements
    doc.font('Times-Bold')
       .fontSize(12)
       .text('V        MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS    [Max. marks: 15]')
       .moveDown();

    doc.font('Times-Roman')
       .text('(a)      Institute Level: (Max 10 marks)')
       .moveDown()
       .text('"02 marks/semester for Head of the Department, Dean, Chief Warden, Professor In charge')
       .text('(Training and placement), Advisor (Estate), Chief Vigilance Officer, PI (Exam), TEQIP')
       .text('(Coordinator), etc. such as Chief Finance Officer."')
       .moveDown();

    // Continue with exact structure from image...

    addPageNumber(doc, 6);
}

function createSeventhPage(doc: PDFKit.PDFDocument, formData: any) {
    // Self Appraisal Section
    doc.font('Times-Bold')
       .fontSize(12)
       .text('VI        SELF APPRAISAL')
       .moveDown()
       .font('Times-Roman')
       .text('(Comments on the work including particulars of circumstances for not being able to undertake')
       .text('activities in some elements) [Max. 500 words]')
       .moveDown(2);

    // Create box for self appraisal text
    const boxHeight = 200;
    const boxWidth = doc.page.width - 100;
    doc.rect(50, doc.y, boxWidth, boxHeight).stroke();
    doc.text(formData.selfAppraisal?.achievements || '', 55, doc.y + 5, {
        width: boxWidth - 10,
        height: boxHeight - 10
    });

    doc.moveDown(2);

    // Comments/Suggestions Section
    doc.font('Times-Bold')
       .text('VII       COMMENTS/SUGGESTIONS FOR FUTURE WORK')
       .moveDown()
       .font('Times-Roman')
       .text('(Including difficulties faced, if any, and suggestions for improvement, training, infrastructure')
       .text('etc. for professional growth and for achievement of excellence) [Max. 500 words]')
       .moveDown(2);

    // Create box for comments
    doc.rect(50, doc.y, boxWidth, boxHeight).stroke();
    doc.text(formData.selfAppraisal?.comments || '', 55, doc.y + 5, {
        width: boxWidth - 10,
        height: boxHeight - 10
    });

    // Marks Summary Table
    doc.moveDown(2)
       .font('Times-Bold')
       .text('VIII      MARKS CLAIMED BY FACULTY MEMEBER')
       .moveDown();

    const marksHeaders = ['S.No.', 'Component', 'Max. marks', 'Marks claimed'];
    const marksData = [
        ['1', 'INSTRUCTIONAL ELEMENT', '25', formData.marks?.instructional || ''],
        ['2', 'RESEARCH PAPERS/PUBLICATIONS', '40', formData.marks?.research || ''],
        ['3', 'SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS', '14', formData.marks?.sponsored || ''],
        ['4', 'ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/\nWORKSHOP AND OTHER EXTENSION WORKS', '06', formData.marks?.organization || ''],
        ['5', 'MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS', '15', formData.marks?.management || ''],
        ['', 'GRAND TOTAL', '100', formData.marks?.total || '']
    ];

    createTable(doc, marksHeaders, marksData);

    // Signature line
    doc.moveDown(2)
       .text('(Signature of faculty member with date)', { align: 'right' });

    addPageNumber(doc, 7);
}

function createEighthPage(doc: PDFKit.PDFDocument, formData: any) {
    // Forwarding Section
    doc.font('Times-Bold')
       .fontSize(12)
       .text('IX        FORWARDING, APPRAISAL & FOLLOW UP')
       .moveDown();

    doc.font('Times-Bold')
       .text('A)        Forwarded by Head of Department/ Centre:')
       .font('Times-Roman')
       .text('(With comments, if necessary, about the information given)')
       .moveDown(2);

    // Create box for HOD comments
    const boxWidth = doc.page.width - 100;
    const boxHeight = 100;
    doc.rect(50, doc.y, boxWidth, boxHeight).stroke();
    doc.moveDown(boxHeight/20 + 1);

    // HOD Signature line
    doc.text('(Signature of H.O.D. with date)', { align: 'right' })
       .moveDown(2);

    // Appraisal Committee Section
    doc.font('Times-Bold')
       .text('B)        Comments of Appraisal Committee to be communicated to the faculty member')
       .moveDown();

    // Create marks awarded table
    const marksHeaders = ['S.No.', 'Component', 'Max. marks', 'Marks Claimed', 'Marks Awarded'];
    const marksData = [
        ['1', 'INSTRUCTIONAL ELEMENT', '25', '', ''],
        ['2', 'RESEARCH PAPERS/PUBLICATIONS', '40', '', ''],
        ['3', 'SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS', '14', '', ''],
        ['4', 'ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/\nWORKSHOP AND OTHER EXTENSION WORKS', '06', '', ''],
        ['5', 'MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS', '15', '', ''],
        ['', 'GRAND TOTAL', '100', '', '']
    ];

    createTable(doc, marksHeaders, marksData);

    // Signature lines
    doc.moveDown(2)
       .text('(Counter sign of the faculty member with date)', { align: 'right' })
       .moveDown(2)
       .text('Signature of Appraisal Committee with date')
       .moveDown(2);

    // Create lines for committee signatures
    for (let i = 0; i < 3; i++) {
        doc.text('_'.repeat(30), 50 + (i * 180));
    }

    // Follow up sections
    doc.moveDown(2)
       .text('C) Follow up Action:')
       .moveDown(2)
       .text('D) Comments of external expert(s):')
       .moveDown(2)
       .text('DIRECTOR/ DIRECTOR\'S NOMINEE')
       .moveDown();

    addPageNumber(doc, 8);
}

function addPageNumber(doc: PDFKit.PDFDocument, pageNo: number) {
    doc.fontSize(10)
       .text(`Page ${pageNo} of 8`, 50, doc.page.height - 50, {
           align: 'center'
       });
} 