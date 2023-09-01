import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import { GetStaticProps } from 'next'

// Imagem
import heroPng from '../../public/hero.png'

//Firebase
import {collection, getDocs} from 'firebase/firestore'
import {db } from '../services/fireabaseConnection'

// Types
import {HomeProps} from '../types/homeProps'


export default function Home({posts, comments}: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Board Todo</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <Image className={styles.hero} alt='Logo Tarefas' src={heroPng} priority/>
        </div>
        <h1 className={styles.title}>Sistema feito para você organzar <br/> seus estudos e suas tarefas</h1>

        <div className={styles.infoContainer}>
          <section className={styles.box}>
            <span>+ {posts} posts</span>
          </section>

          <section className={styles.box}>
            <span>+ {comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async ()=>{

  const commentRef = collection(db, 'comments')
  const commentSnapshot = await getDocs(commentRef)

  const postsRef = collection(db, 'tasks');
  const postsSnapshot = await getDocs(postsRef)

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 3600
  }
}