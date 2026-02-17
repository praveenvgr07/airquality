"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Search, Leaf, User } from 'lucide-react';
import { useLocation } from '@/context/LocationContext';
import styles from './Header.module.css';

const Header = () => {
  const pathname = usePathname();
  const { selectedLocation } = useLocation();

  const getCropLink = () => {
    if (!selectedLocation) return '/crop';

    const params = new URLSearchParams({
      name: selectedLocation.name,
      temp: selectedLocation.temp.toString(),
      hum: selectedLocation.hum.toString(),
      aqi: selectedLocation.aqi.toString()
    });
    return `/crop?${params.toString()}`;
  };

  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Map', href: '/map', icon: <Map size={18} /> },
    { name: 'Search', href: '/search', icon: <Search size={18} /> },
    { name: 'Agriculture AI', href: getCropLink(), icon: <Leaf size={18} /> },
    { name: 'Profile', href: '/profile', icon: <User size={18} /> },
  ];

  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoDot} />
          </div>
          <span className={styles.logoText}>Air<span className={styles.logoHighlight}>Quality</span></span>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${pathname === '/crop' && item.name === 'Agriculture AI' ? styles.active : pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navName}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
