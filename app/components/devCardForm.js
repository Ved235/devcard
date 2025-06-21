'use client';
import { useState } from 'react';
import styles from './DevCardForm.module.css';

export default function DevCardForm({ onDataFetch }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const fetchUserData = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user data');
      }
      
      setUserData(data);
      if (onDataFetch) {
        onDataFetch(data);
      }
    } catch (err) {
      setError(err.message);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Enter HackerNews Username</h2>
      <form onSubmit={fetchUserData} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., pg, sama, gdb"
            className={styles.input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !username.trim()}
            className={styles.button}
          >
            {isLoading ? 'Loading...' : 'Generate Card'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      {userData && (
        <div className={styles.stats}>
          <h3>User Stats</h3>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Karma</span>
              <span className={styles.statValue}>{userData.karma?.toLocaleString()}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Member Since</span>
              <span className={styles.statValue}>{userData.creationDate}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Submissions</span>
              <span className={styles.statValue}>{userData.totalSubmissions}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Stories</span>
              <span className={styles.statValue}>{userData.stories?.length || 0}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}