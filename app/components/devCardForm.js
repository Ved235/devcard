'use client';
import { useState } from 'react';
import styles from './devCardForm.module.css';

export default function DevCardForm({ onDataFetch }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      
      if (onDataFetch) {
        onDataFetch(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchUserData(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.formSection}>
          <div>
            <label htmlFor="username" className={styles.label}>
              HackerNews Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your username"
              className={styles.input}
              disabled={isLoading}
            />
          </div>
          <button 
            onClick={fetchUserData}
            disabled={isLoading || !username.trim()}
            className={styles.button}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner}></div>
                Generating...
              </>
            ) : (
              <>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
                  <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Generate DevCard
              </>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}
