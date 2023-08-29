'use client'

import React from "react";
import {useSession, signIn, signOut} from 'next-auth/react'
import Link from "next/link";

import styles from './styles.module.css'

const Header = () => {

    const { data: session, status} = useSession()

    return(
        <header className={styles.header}>
            <section className={styles.container}>
                <nav className={styles.nav}>
                <Link href={'/'}> <h1 className={styles.logo}>Tarefa <span>+</span></h1> </Link>
                {
                    session ? (
                        <Link href={'/dashboard'} className={styles.linkDashboard} >Meu Painel</Link>
                    ): false
                }
                </nav>
                {
                    status === 'loading' ? (
                        <></>
                    ) : session ? (
                        <button className={styles.loginButton} onClick={()=> signOut()}>{`Olá ${session?.user?.name}`}</button>
                    ) : (
                        <button className={styles.loginButton} onClick={()=> signIn("google")}>Acessar</button>
                    )
                }
            </section>
        </header>
    )
}

export default Header