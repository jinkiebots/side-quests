import Link from 'next/link';
import styles from './page.module.css';

const months = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

const recipes = [
  { date: 2, title: 'Totoro Bento', film: 'My Neighbor Totoro', color: 'yellow' },
  { date: 7, title: 'Spirited Away Ramen', film: 'Spirited Away', color: 'purple' },
  { date: 9, title: 'Kiki\'s Cake', film: 'Kiki\'s Delivery Service', color: 'pink' },
  { date: 12, title: 'Howl\'s Breakfast', film: 'Howl\'s Moving Castle', color: 'green' },
  { date: 16, title: 'Ponyo Ramen', film: 'Ponyo', color: 'blue' },
  { date: 20, title: 'Chihiro\'s Onigiri', film: 'Spirited Away', color: 'orange' },
  { date: 24, title: 'Sophie\'s Tea', film: 'Howl\'s Moving Castle', color: 'yellow' },
  { date: 28, title: 'Mononoke Stew', film: 'Princess Mononoke', color: 'green' },
  { date: 31, title: 'Halloween Treats', film: 'The Nightmare Before Christmas', color: 'purple' }
];

export default function Home() {
  // Generate calendar days for October 2025
  const firstDay = new Date(2025, 9, 1); // October 1, 2025
  const lastDay = new Date(2025, 9, 31); // October 31, 2025
  const startDay = firstDay.getDay(); // Day of week (0 = Sunday)
  
  const days = [];
  
  // Add empty cells for days before October 1st
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }
  
  // Add October days
  for (let day = 1; day <= 31; day++) {
    const recipe = recipes.find(r => r.date === day);
    days.push({ 
      day, 
      isCurrentMonth: true, 
      recipe 
    });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Ghibli Recipes</h1>
        <p className={styles.subtitle}>October 2025 Recipe Calendar</p>
      </header>

      <main className={styles.main}>
        {/* Month Tabs */}
        <div className={styles.monthTabs}>
          {months.map((month, index) => (
            <button 
              key={month}
              className={`${styles.monthTab} ${index === 9 ? styles.activeMonth : ''}`}
            >
              {month}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <div className={styles.dayHeader}>MONDAY</div>
            <div className={styles.dayHeader}>TUESDAY</div>
            <div className={styles.dayHeader}>WEDNESDAY</div>
            <div className={styles.dayHeader}>THURSDAY</div>
            <div className={styles.dayHeader}>FRIDAY</div>
            <div className={styles.dayHeader}>SATURDAY</div>
            <div className={styles.dayHeader}>SUNDAY</div>
          </div>
          
          <div className={styles.calendarGrid}>
            {days.map((dayData, index) => (
              <div key={index} className={styles.calendarDay}>
                {dayData.day && (
                  <>
                    <div className={styles.dayNumber}>{dayData.day}</div>
                    {dayData.recipe && (
                      <div className={`${styles.recipeNote} ${styles[dayData.recipe.color]}`}>
                        <div className={styles.recipeTitle}>{dayData.recipe.title}</div>
                        <div className={styles.recipeFilm}>{dayData.recipe.film}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Box Link */}
        <div className={styles.recipeBoxLink}>
          <Link href="/prototypes/ghibli-recipe-box" className={styles.recipeBoxButton}>
            <div className={styles.recipeBoxContent}>
              <h2>Shake for Random Recipe</h2>
              <p>Discover magical recipes from Studio Ghibli films</p>
            </div>
            <div className={styles.recipeBoxArrow}>→</div>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built with Next.js and lots of imagination ✨</p>
      </footer>
    </div>
  );
}
