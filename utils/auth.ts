import Provider from "@/app/provider";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./db";
export const authOptions = {
      adapter: PrismaAdapter(prisma),
    providers:[
       Credentials({
        name:"Credentials",
        credentials:{
            email:{
                label:"Email",
                type:"email",
                placeholder:"Email",
            },
            password:{
                label:"Password",
                type:"password",
                placeholder:"Password",
            }
        },
        async authorize(credentials:any){
            if(credentials){
                // database base query
                const email = credentials.email;
                const password = credentials.password;
                console.log(email, password)
                return credentials
            }
            return null
        },
    
       }),
       Google({
        clientId: process.env.GOOGLE_ID??'35765613640-q05ptd1hgkj5jkh8lqlk0mnt2mb7gdo1.apps.googleusercontent.com',
        clientSecret:process.env.GOOGLE_SECRET??'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',
       }),
       
    ],
    callbacks: {
        async session({ session, user  }:{session:any, user:any}) {
          session.user.id = user.id;
          return session;
        },
      },
    secret:process.env.NEXTAUTH_SECRET??'secret',
    pages:{
        signIn:"/login"
    }
}


