'use client';
import { useRef } from 'react';
import styles from './DevCardPreview.module.css';
import * as htmlToImage from 'html-to-image';

export default function DevCardPreview({ userData }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    try{
      htmlToimage.toPng(cardRef.current, {canvasWidth:770, canvasHeight: 354})
      .then((dataUrl) => {
        download(dataUrl, `${userData.username}_devcard.png`);
      });
    }catch (error) {
      console.error('Error downloading card:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  const shareCard = async () => {
    if (navigator.share && userData) {
      try {
        await navigator.share({
          title: `${userData.username}'s HackerNews DevCard`,
          url: window.location.href,
        });
        console.log('Shared successfully');
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!userData) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderCard}>
          <h3>Your DevCard will appear here</h3>
          <p>Enter your HackerNews username to generate a card</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <div ref={cardRef} className={styles.devCard}>
          <div className={styles.header}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>
                {userData.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.username}>{userData.username}</h2>
              <p className={styles.joinDate}>
                Member since {userData.creationDate}
              </p>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userData.karma?.toLocaleString()}</span>
              <span className={styles.stateLabel}>Karma</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userData.totalSubmissions}</span>
              <span className={styles.statLabel}>Submissions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{userData.stories?.length || 0}</span>
              <span className={styles.statLabel}>Top Stories</span>
            </div>
          </div>

          {userData.stories && userData.stories.length > 0 && (
            <div className={styles.stories}>
              <h3>🔥 Top Stories</h3>
              <div className={styles.storyList}>
                {userData.stories.slice(0, 3).map((story, index) => (
                  <div key={story.id} className={styles.story}>
                    <span className={styles.storyRank}>#{index + 1}</span>
                    <div className={styles.storyInfo}>
                      <p className={styles.storyTitle}>{story.title}</p>
                      <span className={styles.storyScore}>{story.score} points</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.footer}>
            <span className={styles.powered}>⚡ Powered by HackerNews API</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={downloadCard} className={styles.downloadBtn}>
          Download Card
        </button>
        <button onClick={shareCard} className={styles.shareBtn}>
          Share Link
        </button>
      </div>
    </div>
  );
}
