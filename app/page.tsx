import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.cta}>
            <Link href="/map" className="btn-primary">
              Explore Global Map <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </Link>
            <Link href="/search" className={styles.btnSecondary}>
              Search Location
            </Link>
          </div>
        </div>

        <div className={styles.features}>
        </div>
      </section>

      {/* Info Section */}
      <section className={styles.info}>
        <div className={styles.infoGrid}>
          <div className={styles.infoText}>
          </div>
          <div className={`${styles.infoImage} glass-card`}>
            {/* Concept image or illustration placeholder */}
            <div className={styles.placeholderImage}>
              <div className={styles.circle1} />
              <div className={styles.circle2} />
              <div className={styles.circle3} />
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 AirQuality Professional. All rights reserved.</p>
      </footer>
    </div>
  );
}
