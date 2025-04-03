'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const UserRecord = await db.collection('users').doc(uid).get();

        if(UserRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please sign in instead'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Account created successfully.'
        }

    } catch (e: any) {
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'This email is already in use.'
            }
        }

        return {
            success: false,
            message: 'Failed to create an account.'
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const UserRecord = await auth.getUserByEmail(email)

        if(!UserRecord) {
            return {
                success: false,
                message: 'User does not exist. Create a new account instead.'
            }
        }

        await setSessionCookie(idToken);

    } catch(e) {
        console.log(e);

        return {
            success: false,
            message: "Failed to log in."
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()

    const setSessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK,
    })

    cookieStore.set('session', setSessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)

        const UserRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if(!UserRecord.exists) return null;

        return {
            ...UserRecord.data(),
            id: UserRecord.id,            
        } as User;
    } catch(e) {
        console.log(e)
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

// 🔹 Implement Sign-Out Function
export async function signOut() {
    try {
        const cookieStore = await cookies(); // Await here to get the cookie store

        // Remove the session cookie
        cookieStore.set("session", "", {
            maxAge: -1, // Expire the cookie immediately
            path: "/"
        });

        redirect("/sign-in");
    } catch (e) {
        console.error("Error signing out:", e);

        return {
            success: false,
            message: "Failed to sign out. Try again."
        };
    }
}
