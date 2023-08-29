import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'

// Imagem
import heroPng from '../../public/hero.png'


export default function Home() {
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
            <span>+ 12 posts</span>
          </section>

          <section className={styles.box}>
            <span>+ 100 comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}
