"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import DevCardForm from "./components/devCardForm";
import DevCardPreview from "./components/devCardPreview";

export default function Home() {
  const [userData, setUserData] = useState(null);

  const handleDataFetch = (data) => {
    setUserData(data);
  };

  const handleReset = () => {
    setUserData(null);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoText}>HN</span>
          </div>
          <h1 className={styles.title}>HackerNews DevCard Generator</h1>
          <p className={styles.description}>
            Create a beautiful developer card showcasing your HackerNews profile,
            karma, and top stories.
          </p>
        </div>

        <div className={styles.content}>
          {!userData ? (
            <div className={styles.formWrapper}>
              <DevCardForm onDataFetch={handleDataFetch} />
            </div>
          ) : (
            <>
              <DevCardPreview userData={userData} />
              <div className={styles.resetContainer}>
                <button onClick={handleReset} className={styles.resetButton}>
                  Generate Another Card
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://news.ycombinator.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="HackerNews icon"
            width={16}
            height={16}
          />
          Visit HackerNews
        </a>
        <a
          href="https://github.com/Ved235/devcard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="GitHub icon"
            width={16}
            height={16}
          />
          View Source
        </a>
      </footer>
    </div>
  );
}