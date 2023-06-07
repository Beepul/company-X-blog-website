"use client"

import { signIn, useSession } from 'next-auth/react'
import styles from './page.module.css';
import React from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
  const session = useSession();
  const router = useRouter();

  if(session.status === "loading"){
    return <p>loading...</p>
  }
  if(session.status === "authenticated"){
    router?.push("/dashboard")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value
    const password = e.target[1].value

    signIn("credentials", {email,password})
  }
  return (
    <div className={styles.container} onSubmit={handleSubmit}>
       <form className={styles.form} >
         <input type="email" placeholder='email' className={styles.input} required />
         <input type="password" placeholder='password' className={styles.input} required />
         <button type="submit" className={styles.button}>Login</button>
       </form>
       <Link href={"/dashboard/register"}>Register your account.</Link>
       <button onClick={()=> signIn("google")} className={styles.login}>Login with Google</button>
     </div>
  )
}

export default Login