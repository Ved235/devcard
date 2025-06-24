"use client";
import { useRef, useEffect } from "react";
import styles from "./devCardPreview.module.css";
import * as htmlToimage from "html-to-image";
import download from "downloadjs";

export default function DevCardPreview({ userData }) {
  const cardRef = useRef(null);
  const cardWrapperRef = useRef(null);

  // Default theme
  const defaultTheme = {
    id: "orange",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #f56500 50%, #ea580c 100%)",
    color: "#ff6b35",
  };

  const theme = userData?.theme || defaultTheme;
  const layout = userData?.layout || "horizontal";

  const downloadCard = async () => {
    try {
      const dimensions =
        layout === "vertical"
          ? { canvasWidth: 800, canvasHeight: 608 }
          : { canvasWidth: 800, canvasHeight: 328 };

      const dataUrl = await htmlToimage.toPng(
        cardWrapperRef.current,
        dimensions
      );
      download(dataUrl, `${userData.username}_${layout}_devcard.png`);
    } catch (e) {
      console.error(e);
      alert("Failed to download card. Please try again");
    }
  };

  const shareCard = async () => {
    try {
      await navigator.share({
        title: `${userData.username}'s HackerNews DevCard`,
        url: window.location.href,
      });
      console.log("Shared successfully");
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
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

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(3000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(3000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    };

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.1s ease-out";
    };
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    wrapper.addEventListener("mouseenter", handleMouseEnter);
  }, [userData]);

  if (!userData) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderCard}>
          <h3>Your DevCard will appear here</h3>
          <p>Enter your HackerNews username to generate a devcard</p>
        </div>
      </div>
    );
  }

  const gradientStyle = {
    background: `linear-gradient(135deg, #2d3748 0%, ${theme.color} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div className={styles.container}>
      <div ref={cardWrapperRef} className={styles.cardWrapper}>
        <div
          ref={cardRef}
          className={`${styles.devCard} ${
            layout === "vertical" ? styles.verticalCard : ""
          }`}
          style={{ background: theme.gradient }}
        >
          <div
            className={`${styles.innerCard} ${
              layout === "vertical" ? styles.verticalInner : ""
            }`}
          >
            <div className={styles.leftSection}>
              <div className={styles.profileSection}>
                <div
                  className={styles.avatar}
                  style={{ background: theme.gradient }}
                >
                  <span className={styles.avatarText}>
                    {userData.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.userInfo}>
                  <h2 className={styles.username} style={gradientStyle}>
                    {userData.username}
                  </h2>
                  <div className={styles.handle}>@{userData.username}</div>
                  <div className={styles.joinDate}>
                    Joined {userData.creationDate}
                  </div>
                </div>
              </div>

              <div className={styles.statsContainer}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <svg
                      className={styles.statIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ color: theme.color }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
                        clipRule="evenodd"
                        fill="currentColor"
                      />
                    </svg>
                    Karma
                  </div>
                  <div className={styles.statNumber} style={gradientStyle}>
                    {userData.karma?.toLocaleString()}
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>
                    <svg
                      className={styles.statIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ color: theme.color}}
                    >
                      <path
                        d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z"
                        fill="currentColor"
                      />
                      <path
                        d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z"
                        fill="currentColor"
                      />
                    </svg>
                    Submissions
                  </div>
                  <div className={styles.statNumber} style={gradientStyle}>
                    {userData.totalSubmissions}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.storiesSection}>
                <h3 className={styles.storiesTitle} style={gradientStyle}>
                  Top Stories
                </h3>
                <ul className={styles.storiesList}>
                  {userData.stories && userData.stories.length > 0 ? (
                    userData.stories.map((story) => (
                      <li key={story.id} className={styles.storyItem}>
                        <a
                          href={`https://news.ycombinator.com/item?id=${story.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.storyLink}
                          onMouseEnter={(e) => {
                            e.target.style.borderColor = theme.color;
                            e.target.style.boxShadow = `0 8px 25px ${theme.color}26`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.borderColor = "#e2e8f0";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <span className={styles.storyTitle}>
                            {story.title}
                          </span>
                          <span
                            className={styles.storyScore}
                            style={{ color: theme.color }}
                          >
                            {story.score}
                            <svg
                              className={styles.scoreIcon}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2L1 21h22L12 2zm0 4.55L18.51 19H5.49L12 6.55z" />
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
        <button
          onClick={shareCard}
          className={styles.shareBtn}
          style={{ background: theme.gradient }}
        >
          Share Link
        </button>
      </div>
    </div>
  );
}
