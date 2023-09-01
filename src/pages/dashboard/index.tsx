import React, { ChangeEvent, FormEvent} from "react";
import Head from 'next/head'
import { GetServerSideProps } from "next";
import { getSession} from 'next-auth/react'
import { useState, useEffect } from "react";
import Link from 'next/link'

import styles from './styles.module.css'

// Components
import TextArea from '../../components/TextArea'

//icons
import {FiShare2} from 'react-icons/fi'
import {FaTrash} from 'react-icons/fa'

// Banco de dados
import { db } from '../../services/fireabaseConnection'
import {addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc} from 'firebase/firestore'

// Tipos
import { UserdashboardProps } from '../../types/userDashboardProps'
import {Task} from '../../types/task'

const Dashboard = ({user}: UserdashboardProps) => {

    const [ input, setInput] = useState('')
    const [ publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(()=> {
        async function loadingTasks(){
            const tasksRef= collection(db, 'tasks')
            const q = query(
                tasksRef,
                orderBy('created','desc'),
                where('user', '==', user?.email)
            )

            onSnapshot(q, (snapshot)=>{
                let listTasks: Task[] = []

                snapshot.forEach((doc)=>{
                    listTasks.push({
                        id: doc.id,
                        task: doc.data().task,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                })

                setTasks(listTasks)
            })
        }

        loadingTasks()
    }, [user?.email])

    const handleCheked = (e : ChangeEvent<HTMLInputElement>) => {
        setPublicTask(e.target.checked)
    }

    const handleRegisterTask = async (e : FormEvent)=> {
        e.preventDefault()

        if(input === '') return

        await addDoc(collection(db, "tasks"), {
            task: input,
            created: new Date(),
            user: user?.email,
            public: publicTask
        })

        setInput('')
        setPublicTask(false)
    }

    const handleShare = async (id: string) => {
        await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/tasks/${id}`)
    }

    const handleDeleteTask = async (id: string) => {
        const docRef = doc(db, 'tasks', id)
        await deleteDoc(docRef)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                <div className={styles.contentForm}>
                    <h1 className={styles.title}> Qual sua tarefa?</h1>

                    <form onSubmit={handleRegisterTask}>
                        <TextArea placeholder="Digite qual sua tarefa" value={input} onChange={(e : ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}/>
                        <div className={styles.checkboxArea}>
                            <input type="checkbox" className={styles.checkbox} checked={publicTask} onChange={handleCheked}/>
                            <label>Deixar a tarefa públca?</label>
                        </div>

                        <button className={styles.button} type="submit">Registrar</button>
                    </form>
                </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas tarefas</h1>

                    {
                        tasks.map((task)=> (
                            <article className={styles.task} key={task.id}>

                                {
                                    task.public ? (
                                        <div className={styles.tagContainer}>
                                            <label className={styles.tag}>PÚBLICA</label>
                                            <button className={styles.shareButton}>
                                                <FiShare2 size={22} color="#3183ff" onClick={()=> handleShare(task.id)}/>
                                            </button>
                                        </div>
                                    ) : false
                                }

                                <div className={styles.taskContent}>
                                    {
                                        task.public ? (
                                            <Link href={`/task/${task.id}`} ><p>{task.task}</p></Link>
                                        ) : <p>{task.task}</p>
                                    }
                                    <button className={styles.trashButton} onClick={() => handleDeleteTask(task.id)}><FaTrash size={24} color='#ea3140'/></button>
                                </div>
                            </article>
                        ))
                    }
                </section>           
            </main>
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
        props: {
            user: {
                email: session?.user?.email
            }
        }
}
}


