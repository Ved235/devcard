'use client';
import { useRef } from 'react';
import styles from './devCardPreview.module.css';
import * as htmlToimage from 'html-to-image';
import download from 'downloadjs';

export default function DevCardPreview({ userData }) {
  const cardRef = useRef(null);

  const downloadCard = async () => {
    try{
      htmlToimage.toPng(cardRef.current, {canvasWidth:1000, canvasHeight: 509})
      .then((dataUrl) => {
        download(dataUrl, `${userData.username}_devcard.png`);
    });
  }catch (error) {
    console.error('Error downloading card:', error);
    alert('Failed to download card. Please try again.');
  }
  }

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
          <div className={styles.innerCard}>
            {/* Left side - Identity & Core Stats */}
            <div className={styles.leftSection}>
              <div className={styles.profileSection}>
                <div className={styles.avatar}>
                  <span className={styles.avatarText}>
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <h2 className={styles.username}>{userData.username}</h2>
                  <div className={styles.handle}>@{userData.username}</div>
                  <div className={styles.joinDate}>
                    Joined {userData.creationDate}
                  </div>
                </div>
              </div>
              
              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <svg className={styles.statIcon} viewBox="0 0 16 17" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 13.605A5.333 5.333 0 108 2.938a5.333 5.333 0 000 10.667zm1.213-8.672a.494.494 0 00-.812-.517L4.944 7.922a.494.494 0 00.35.843H7.82l-1.034 2.844a.494.494 0 00.812.518l3.456-3.507a.494.494 0 00-.348-.842H8.179l1.034-2.845z" fill="currentColor"/>
                    </svg>
                    Reputation
                  </div>
                  <div className={styles.statNumber}>{userData.karma?.toLocaleString()}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none">
                      <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" fill="currentColor"/>
                    </svg>
                    Submissions
                  </div>
                  <div className={styles.statNumber}>{userData.totalSubmissions}</div>
                </div>
              </div>
            </div>

            {/* Right side - Top Stories */}
            <div className={styles.rightSection}>
              <div className={styles.storiesSection}>
                <h3 className={styles.storiesTitle}>Top Stories</h3>
                <ul className={styles.storiesList}>
                  {userData.stories && userData.stories.length > 0 ? (
                    userData.stories.map((story) => (
                      <li key={story.id} className={styles.storyItem}>
                        <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noopener noreferrer" className={styles.storyLink}>
                          <span className={styles.storyTitle}>{story.title}</span>
                          <span className={styles.storyScore}>
                            {story.score}
                            <svg className={styles.scoreIcon} viewBox="0 0 24 24">
                              <path d="M12 2L1 21h22L12 2zm0 4.55L18.51 19H5.49L12 6.55z"/>
                            </svg>
                          </span>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noStories}>No stories found.</li>
                  )}
                </ul>
              </div>
            </div>
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