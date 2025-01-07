import carbone from 'carbone';
import { promisify } from 'util';
import { google } from 'googleapis';
import { FormData } from '@/types/form';

const renderReport = promisify(carbone.render);

export async function generateDocFromTemplate(formData: FormData): Promise<Buffer> {
    try {
        // Get your template file ID from Google Docs URL
        const TEMPLATE_FILE_ID = 'your_google_doc_template_id';
        
        // Initialize Google Docs API
        const auth = new google.auth.GoogleAuth({
            keyFile: 'path/to/your/credentials.json',
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });

        const drive = google.drive({ version: 'v3', auth });

        // Download template
        const response = await drive.files.export({
            fileId: TEMPLATE_FILE_ID,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

        // Format your data
        const data = {
            name: formData.personalInfo?.name,
            designation: formData.personalInfo?.designation,
            department: formData.personalInfo?.department,
            // Add all your fields here
            teachingLoad: formData.teachingLoad?.courses?.map(course => ({
                courseCode: course.code,
                type: course.type,
                students: course.studentsCount,
                lectureHours: course.lectureHours,
                // etc...
            }))
        };

        // Generate document
        const result = await renderReport(response.data, data);
        return Buffer.from(result);

    } catch (error) {
        console.error('Template processing failed:', error);
        throw error;
    }
}