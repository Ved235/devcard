'use client';
import { useRef, useEffect } from 'react';
import styles from './devCardPreview.module.css';
import * as htmlToimage from 'html-to-image';
import download from 'downloadjs';

export default function DevCardPreview({ userData }) {
  const cardRef = useRef(null);
  const cardWrapperRef = useRef(null);

  // Default theme
  const defaultTheme = {
    id: 'orange',
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #f56500 50%, #ea580c 100%)',
    color: '#ff6b35'
  };

  const theme = userData?.theme || defaultTheme;

  const downloadCard = async () => {
    try{
      htmlToimage.toPng(cardRef.current, {canvasWidth:800, canvasHeight: 328})
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

  useEffect(() => {
    const card = cardRef.current;
    const wrapper = cardWrapperRef.current;

    if (!card || !wrapper) return;

    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;   
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    };

    const handleMouseEnter = () => {
      card.style.transition = 'transform 0.1s ease-out';
    };

    // Only add listeners on Desktop
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    const addListeners = () => {
      if (mediaQuery.matches) {
        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseleave', handleMouseLeave);
        wrapper.addEventListener('mouseenter', handleMouseEnter);
      }
    };

    const removeListeners = () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      wrapper.removeEventListener('mouseenter', handleMouseEnter);
      card.style.transform = 'none';
    };

    addListeners();
    mediaQuery.addEventListener('change', (e) => {
      if (e.matches) {
        addListeners();
      } else {
        removeListeners();
      }
    });

    return () => {
      removeListeners();
      mediaQuery.removeEventListener('change', addListeners);
    };
  }, [userData]);

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
      <div ref={cardWrapperRef} className={styles.cardWrapper}>
        <div ref={cardRef} className={styles.devCard} style={{ background: theme.gradient }}>
          <div className={styles.innerCard}>
            {/* Left side - Identity & Core Stats */}
            <div className={styles.leftSection}>
              <div className={styles.profileSection}>
                <div className={styles.avatar} style={{ background: theme.gradient }}>
                  <span className={styles.avatarText}>
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <h2 className={styles.username} style={{ 
                    background: `linear-gradient(135deg, #2d3748 0%, ${theme.color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{userData.username}</h2>
                  <div className={styles.handle}>@{userData.username}</div>
                  <div className={styles.joinDate}>
                    Joined {userData.creationDate}
                  </div>
                </div>
              </div>
              
              <div className={styles.statsContainer}>
                <div className={styles.statItem} style={{ borderColor: userData.theme ? 'transparent' : '#e2e8f0' }}>
                  <div className={styles.statLabel}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" style={{ color: theme.color }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 20.4A8 8 0 1012 4.4a8 8 0 000 16zm1.82-13.01a.74.74 0 00-1.22-.78L7.42 11.88a.74.74 0 00.52 1.26h4.23l-1.55 4.27a.74.74 0 001.22.78l5.18-5.26a.74.74 0 00-.52-1.26h-4.23l1.55-4.27z" fill="currentColor"/>
                    </svg>
                    Karma
                  </div>
                  <div className={styles.statNumber} style={{ 
                    background: `linear-gradient(135deg, #2d3748 0%, ${theme.color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{userData.karma?.toLocaleString()}</div>
                </div>
                <div className={styles.statItem} style={{ borderColor: userData.theme ? 'transparent' : '#e2e8f0' }}>
                  <div className={styles.statLabel}>
                    <svg className={styles.statIcon} viewBox="0 0 24 24" fill="none" style={{ color: theme.color }}>
                      <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" fill="currentColor"/>
                    </svg>
                    Submissions
                  </div>
                  <div className={styles.statNumber} style={{ 
                    background: `linear-gradient(135deg, #2d3748 0%, ${theme.color} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{userData.totalSubmissions}</div>
                </div>
              </div>
            </div>

            {/* Right side - Top Stories */}
            <div className={styles.rightSection}>
              <div className={styles.storiesSection}>
                <h3 className={styles.storiesTitle} style={{ 
                  background: `linear-gradient(135deg, #2d3748 0%, ${theme.color} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Top Stories</h3>
                <ul className={styles.storiesList}>
                  {userData.stories && userData.stories.length > 0 ? (
                    userData.stories.map((story) => (
                      <li key={story.id} className={styles.storyItem}>
                        <a 
                          href={`https://news.ycombinator.com/item?id=${story.id}`} 
                          target="_blank" 
                          className={styles.storyLink}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = theme.color;
                            e.target.style.boxShadow = `0 8px 25px ${theme.color}26`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <span className={styles.storyTitle}>{story.title}</span>
                          <span className={styles.storyScore} style={{ color: theme.color }}>
                            {story.score}
                            <svg className={styles.scoreIcon} viewBox="0 0 24 24">
                              <path d="M12 2L1 21h22L12 2zm0 4.55L18.51 19H5.49L12 6.55z"/>
                            </svg>
                          </span>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noStories}>No stories found</li>
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
        <button onClick={shareCard} className={styles.shareBtn} style={{ background: theme.gradient }}>
          Share Link
        </button>
      </div>
    </div>
  );
}
