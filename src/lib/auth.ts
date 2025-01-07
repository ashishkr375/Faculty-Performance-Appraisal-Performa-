import { AuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from './mongodb';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session }) {
            if (session?.user?.email) {
                try {
                    const { db } = await connectToDatabase();
                    const adminDoc = await db.collection('admins').findOne({ 
                        email: session.user.email 
                    });
                    session.user.isAdmin = !!adminDoc || session.user.email === 'webmaster@nitp.ac.in';
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    session.user.isAdmin = session.user.email === 'webmaster@nitp.ac.in';
                }
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If there's a stored redirect path, use it
            if (typeof window !== 'undefined') {
                const redirectPath = sessionStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    return `${baseUrl}${redirectPath}`;
                }
            }
            // Otherwise, use the default redirect
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
};

// Utility function to check if an email is admin
export const isAdmin = async (email: string | null | undefined): Promise<boolean> => {
    if (!email) return false;
    if (email === 'webmaster@nitp.ac.in') return true;
    
    try {
        const { db } = await connectToDatabase();
        const adminDoc = await db.collection('admins').findOne({ email });
        return !!adminDoc;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}; 