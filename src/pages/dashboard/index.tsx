import { GetServerSideProps } from "next";
import React from "react";
import Head from 'next/head'
import { getSession} from 'next-auth/react'

import styles from './styles.module.css'

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session = await getSession({req})

    if(!session?.user){
        return {
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
}
}


