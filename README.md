# HackerNews DevCard Generator

A Next.js application that generates beautiful developer cards showcasing your HackerNews profile, karma and top stories.

## Features

- Generate personalized developer cards from HackerNews usernames
- Multiple theme options (Orange, Blue, Purple, Green, Custom)
- Horizontal and vertical layout options
- Download cards as PNG images
- Share cards with direct links

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ved235/devcard.git
cd devcard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your HackerNews username
2. Choose a theme and layout
3. Click "Generate DevCard"
4. Download or share your generated card

## Tech Stack

- Next.js 15
- React 19
- CSS Modules
- html-to-image for PNG generation
- Vercel Blob for image storage

## API Routes

- `/api` - Fetches HackerNews user data
- `/api/store-card` - Stores generated cards to Vercel Blob

## Deployment

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).