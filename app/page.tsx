import Link from 'next/link';
import styles from './page.module.css';

const prototypes = [
  {
    id: 'ghibli-recipe-box',
    title: 'Studio Ghibli Recipe Box',
    description: 'Shake your phone to discover magical recipes with handwritten notes and mysterious stains',
    tags: ['Interactive', 'Mobile', 'Animation', 'Studio Ghibli']
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ghibli Recipes</h1>
        <p className={styles.subtitle}>This is ghibli recipe</p>
      </header>

      <main className={styles.main}>
        <div className={styles.prototypesGrid}>
          {prototypes.map((prototype) => (
            <Link 
              key={prototype.id} 
              href={`/prototypes/${prototype.id}`}
              className={styles.prototypeCard}
            >
              <div className={styles.cardContent}>
                <h2 className={styles.prototypeTitle}>{prototype.title}</h2>
                <p className={styles.prototypeDescription}>{prototype.description}</p>
                <div className={styles.tags}>
                  {prototype.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js and lots of imagination ✨</p>
      </footer>
    </div>
  );
}
