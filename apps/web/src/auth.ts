import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SignJWT, jwtVerify } from "jose";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    jwt: {
        async encode({ token, secret }) {
            const secretKey = new TextEncoder().encode(secret as string);
            return new SignJWT(token as any)
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("30d")
                .sign(secretKey);
        },
        async decode({ token, secret }) {
            if (!token) return null;
            try {
                const secretKey = new TextEncoder().encode(secret as string);
                const { payload } = await jwtVerify(token, secretKey, {
                    algorithms: ["HS256"],
                });
                return payload as any;
            } catch (error) {
                console.error("Error decodificando JWT con HS256:", error);
                return null;
            }
        },
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.picture = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = (token.sub || token.id) as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },

    secret: process.env.AUTH_SECRET,
    trustHost: true,
});