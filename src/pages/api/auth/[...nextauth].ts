import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Kullanıcıyı email ile bulma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) {
          // Şifre doğrulama
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordValid) {
            return user;
          }
        }
        
        // Hatalı giriş
        return null;
      }
    })
    // Diğer sağlayıcıları buraya ekleyebilirsiniz
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  pages: {
    signIn: '/login',  // Giriş sayfasını özelleştirin
  },
  callbacks: {
    async session(session, user) {
      session.user.id = user.id;
      return session;
    }
  }
});
