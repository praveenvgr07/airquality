"use client";

import { useState } from 'react';
import { User, Mail, Lock, LogIn, UserPlus, Settings, LogOut, Bell, Shield, AlertCircle } from 'lucide-react';
import styles from './profile.module.css';

// Default credentials
const DEFAULT_EMAIL = 'admin@air.com';
const DEFAULT_PASSWORD = 'password123';

export default function ProfilePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
            setIsLoggedIn(true);
        } else {
            setError('Invalid email or password. Please check your credentials.');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className={`${styles.container} container`}>
                <div className={`${styles.authCard} glass-card`}>
                    <div className={styles.authHeader}>
                        <div className={styles.authIcon}>
                            {isLoginView ? <LogIn size={32} /> : <UserPlus size={32} />}
                        </div>
                        <h1>{isLoginView ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>{isLoginView ? 'Login to access your personalized environment data' : 'Join our global community for better air'}</p>
                    </div>

                    {isLoginView && (
                        <div style={{ backgroundColor: '#1e3a5f', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #3b82f6' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#93c5fd' }}>Demo Credentials:</p>
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#fff' }}>📧 Email: <strong>{DEFAULT_EMAIL}</strong></p>
                            <p style={{ margin: '4px 0', fontSize: '13px', color: '#fff' }}>🔐 Password: <strong>{DEFAULT_PASSWORD}</strong></p>
                        </div>
                    )}

                    {error && (
                        <div style={{ backgroundColor: '#7f1d1d', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #dc2626' }}>
                            <AlertCircle size={18} color="#fca5a5" />
                            <p style={{ margin: 0, fontSize: '13px', color: '#fca5a5' }}>{error}</p>
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleLogin}>
                        {!isLoginView && (
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <div className={styles.inputWrapper}>
                                    <User size={18} />
                                    <input type="text" placeholder="John Doe" required />
                                </div>
                            </div>
                        )}
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} />
                                <input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                            {isLoginView ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    <p className={styles.toggleText}>
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }}>{isLoginView ? 'Register' : 'Login'}</button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} container`}>
            <header className={styles.profileHeader}>
                <div className={styles.avatar}>
                    <img src="https://ui-avatars.com/api/?name=Praveen&background=3b82f6&color=fff&size=128" alt="Avatar" />
                </div>
                <div className={styles.profileInfo}>
                    <h1>Praveen Kumar</h1>
                    <p>Environmental Advocate | Premium Member</p>
                    <div className={styles.badges}>
                        <span className={styles.tag}>Admin</span>
                        <span className={styles.tag}>Gold Member</span>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={() => setIsLoggedIn(false)}>
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className={styles.dashboard}>
                <div className={`${styles.dashCard} glass-card`}>
                    <div className={styles.dashHeader}>
                        <Settings size={20} color="#3b82f6" />
                        <h3>Account Settings</h3>
                    </div>
                    <ul className={styles.settingsList}>
                        <li>Edit Profile</li>
                        <li>Security & Privacy</li>
                        <li>Subscription Plan</li>
                    </ul>
                </div>

                <div className={`${styles.dashCard} glass-card`}>
                    <div className={styles.dashHeader}>
                        <Bell size={20} color="#f59e0b" />
                        <h3>Notifications</h3>
                    </div>
                    <div className={styles.emptyState}>
                        <p>No new alerts for your area.</p>
                    </div>
                </div>

                <div className={`${styles.dashCard} glass-card`}>
                    <div className={styles.dashHeader}>
                        <Shield size={20} color="#10b981" />
                        <h3>Data Usage</h3>
                    </div>
                    <div className={styles.usage}>
                        <div className={styles.usageBar}>
                            <div className={styles.usageProgress} style={{ width: '45%' }}></div>
                        </div>
                        <span>450MB of 1GB cloud storage used</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
