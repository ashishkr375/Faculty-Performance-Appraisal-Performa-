import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface EmailTemplate {
    subject: string;
    html: string;
}

const emailTemplates = {
    formSubmission: (userName: string, totalMarks: number): EmailTemplate => ({
        subject: 'Faculty Appraisal Form Submitted',
        html: `
            <h2>Faculty Appraisal Form Submission</h2>
            <p>Dear ${userName},</p>
            <p>Your faculty appraisal form has been successfully submitted.</p>
            <p>Total Marks: ${totalMarks}/35</p>
            <p>You can view your submission by logging into the portal.</p>
            <br>
            <p>Best regards,</p>
            <p>NIT Patna</p>
        `
    }),
    adminNotification: (facultyName: string, totalMarks: number): EmailTemplate => ({
        subject: 'New Faculty Appraisal Submission',
        html: `
            <h2>New Faculty Appraisal Submission</h2>
            <p>A new faculty appraisal form has been submitted.</p>
            <p>Faculty Name: ${facultyName}</p>
            <p>Total Marks: ${totalMarks}/35</p>
            <p>Please login to the admin portal to review the submission.</p>
        `
    })
};

export async function sendEmail(to: string, template: EmailTemplate) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject: template.subject,
            html: template.html,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export async function sendFormSubmissionEmails(
    facultyEmail: string,
    facultyName: string,
    totalMarks: number
) {
    try {
        // Send confirmation to faculty
        await sendEmail(
            facultyEmail,
            emailTemplates.formSubmission(facultyName, totalMarks)
        );

        // Send notification to admin
        await sendEmail(
            process.env.ADMIN_EMAIL!,
            emailTemplates.adminNotification(facultyName, totalMarks)
        );
    } catch (error) {
        console.error('Error sending submission emails:', error);
        throw error;
    }
} 