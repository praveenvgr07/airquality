'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Map', path: '/map' },
    { name: 'Search', path: '/search' },
    { name: 'Crop', path: '/crop' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo on the left */}
        <div className="logo">
          <Link href="/">
            <h1>AirQuality</h1>
          </Link>
        </div>

        {/* Navigation on the right */}
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}