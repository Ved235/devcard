"use client";
import { useRef, useEffect, useState } from "react";
import styles from "./devCardPreview.module.css";
import * as htmlToimage from "html-to-image";
import download from "downloadjs";

export default function DevCardPreview({ userData }) {
  const cardHRef = useRef(null);
  const cardWrapperRef = useRef(null);
  const cardVRef = useRef(null);
  const [isStoring, setIsStoring] = useState(false);
  const [storedCardUrl, setStoredCardUrl] = useState(null);
  const [cardId, setCardId] = useState(null);

  // Default theme
  const defaultTheme = {
    id: "orange",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #f56500 50%, #ea580c 100%)",
    color: "#ff6b35",
  };

  const theme = userData?.theme || defaultTheme;
  const layout = userData?.layout || "horizontal";

  const generateCardImage = async () => {
    const targetElement =
      layout === "vertical" ? cardVRef.current : cardHRef.current;
    return await htmlToimage.toPng(targetElement);
  };

  const downloadCard = async () => {
    try {
      const dataUrl = await generateCardImage();
      download(dataUrl, `${userData.username}_${layout}_devcard.png`);
    } catch (e) {
      console.log(e);
      alert("Failed to download card");
    }
  };

  const storeCard = async () => {
    try {
      setIsStoring(true);
      const dataUrl = await generateCardImage();

      const response = await fetch("/api/store-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: dataUrl,
          username: userData.username,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to store card");
      }

      const result = await response.json();
      setStoredCardUrl(result.url);
      setCardId(result.cardId);

      return result;
    } catch (e) {
      console.log(e);
      alert("Failed to store card. Please try again");
      return null;
    } finally {
      setIsStoring(false);
    }
  };

  const shareCard = async () => {
    try {
      let shareData = { url: storedCardUrl, cardId };

      if (!shareData.url || !shareData.cardId) {
        shareData = await storeCard();
        if (!shareData) return;
      }

      const pageUrl = `https://uawywqgif4rz9jqu.public.blob.vercel-storage.com/${userData.username}_${shareData.cardId}.png`;

      if (navigator.share) {
        await navigator.share({
          title: `${userData.username}'s HackerNews DevCard`,
          text: `Check out ${userData.username}'s HackerNews DevCard`,
          url: pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        alert("Card link copied to clipboard");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const card = cardHRef.current;
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

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    };

    const handleMouseLeave = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
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
          ref={cardHRef}
          className={`${styles.devCard} ${
            layout === "vertical" ? styles.verticalCard : ""
          }`}
          style={layout === "vertical" ? {} : { background: theme.gradient }}
        >
          <div
            ref={cardVRef}
            className={`${styles.innerCard} ${
              layout === "vertical" ? styles.verticalInner : ""
            }`}
            style={
              layout === "vertical"
                ? {
                    background: theme.gradient,
                    padding: "4px",
                    borderRadius: "1.5rem",
                  }
                : {}
            }
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "calc(1.5rem - 4px)",
                display: "flex",
                flexDirection: layout === "vertical" ? "column" : "row",
                minHeight: layout === "vertical" ? "600px" : "320px",
                overflow: "hidden",
                position: "relative",
              }}
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
                          clipRule="evenodd"
                          d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
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
                        style={{ color: theme.color }}
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
      </div>

      <div className={styles.actions}>
        <button onClick={downloadCard} className={styles.downloadBtn}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5a.75.75 0 0 1 .75.75V7.5h-1.5V2.25A.75.75 0 0 1 12 1.5ZM11.25 7.5v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
          </svg>
          Download
        </button>

        <button
          onClick={shareCard}
          className={styles.shareBtn}
          style={{ background: theme.gradient }}
          disabled={isStoring}
        >
          {isStoring ? (
            <>
              <div className={styles.spinner}></div>
              Storing...
            </>
          ) : (
            <>
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V15a.75.75 0 0 0 1.5 0V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
              </svg>
              Share Card
            </>
          )}
        </button>
      </div>

      {storedCardUrl && (
        <div className={styles.storedInfo}>
          <p className={styles.storedText}>
            Card stored successfully! Share the link above or use the direct
            image URL.
          </p>
        </div>
      )}
    </div>
  );
}
