"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import DevCardForm from "./components/devcardform";
import DevCardPreview from "./components/devCardPreview";

export default function Home() {
  const [userData, setUserData] = useState(null);

  const handleDataFetch = (data) => {
    setUserData(data);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>HackerNews DevCard Generator</h1>
          <p className={styles.description}>
            Create a devcard showcasing your HackerNews profile, stats
            and top stories
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <DevCardForm onDataFetch={handleDataFetch} />
          </div>
          <div className={styles.formSection}>
            <DevCardPreview userData={userData}/>
          </div>
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
