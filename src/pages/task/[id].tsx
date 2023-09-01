import React, { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import {useSession} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import Head from "next/head";

import styles from './styles.module.css'
import { db } from '../../services/fireabaseConnection'
import { doc, addDoc, collection, query, where, getDoc, getDocs, deleteDoc} from 'firebase/firestore'

// Components
import TextArea from '../../components/TextArea/index'

//Tipos
import {TaskProps} from '../../types/itemTask'
import {Comment} from '../../types/comment'

//Icons
import {FaTrash} from 'react-icons/fa'

const Task = ({ item, allComments }: TaskProps) => {

    const {data: session} = useSession()
    const [input, setInput] = useState('')
    const [commemts, setComments] = useState(allComments || [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        
        if(input === '') return
        
        if(!session?.user?.email || !session?.user?.name) return
        
        const docRef = await addDoc(collection(db, 'comments'), {
            comment: input,
            created: new Date(),
            user: session?.user?.email,
            name: session?.user?.name,
            taskId: item?.id
        }) 

        const data = {
            id: docRef.id,
            comment: input,
            user: session?.user?.email,
            name: session?.user?.name,
            taskId: item.id
        }


        setComments((prev)=> [...prev, data])

        setInput('')
    }

    const handleDeleteTask = async (id: string) =>{
        const docRef = doc(db, 'comments', id)
        await deleteDoc(docRef)

        const deleteComment = commemts.filter((comment) => comment.id !== id)
        setComments(deleteComment)
    }

    return(
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>
            
            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>
                        {item.task}
                    </p>
                </article>

                <section className={styles.commentsContainer}>
                    <h2>Deixar comentário</h2>

                    <form onSubmit={handleSubmit}>
                        <TextArea 
                        placeholder="Digite seu comentário"
                        value={input}
                        onChange={(e : ChangeEvent<HTMLTextAreaElement>)=> setInput(e.target.value)}
                        /> 
                        <button className={styles.button} disabled={!session?.user} >Comentar</button>
                    </form>
                </section>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>
                {commemts.length === 0 ? (
                    <span>Nenhum comentário foi encontrado</span>
                ): (
                    commemts.map((comment)=> (
                        <article  key={comment.id} className={styles.comment}>
                            <div className={styles.headComment}>
                                <label className={styles.commentsLabel} >{comment.name}</label>
                                {
                                    session?.user?.email === comment.user ? (
                                        <button className={styles.buttonTrash}>
                                            <FaTrash size={18} color='#ea3140' onClick={()=> handleDeleteTask(comment.id)}/>
                                        </button>
                                    ) : false
                                }
                            </div>
                            <p>{comment.comment}</p>
                        </article>
                    ))
                )}
            </section>
        </div>
    )
}

export default Task

export const getServerSideProps: GetServerSideProps = async ({ params }) =>{
    const id = params?.id as string

    const docRef = doc(db, 'tasks', id)

    const q = query(collection(db, 'comments'), where('taskId', '==', id))
    const snapshotComments = await getDocs(q)

    let allComments: Comment[] = []

    snapshotComments.forEach((doc)=> {
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            user: doc.data().user,
            name: doc.data().name,
            taskId: doc.data().taskId
        })
    })

    const snapshot = await getDoc(docRef)

    if(snapshot.data() === undefined){
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if(!snapshot.data()?.public){
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000

    const task = {
        task: snapshot.data()?.task,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        id: id
    }

    return {
        props: {
            item: task,
            allComments: allComments,
        }
    }
}