# HackerNews DevCard Generator

A Next.js application that generates beautiful developer cards showcasing your HackerNews profile, karma and top stories.
_Please use a chromium based browser. It has compatibility issues with firefox_

## Features

- Generate personalized developer cards from HackerNews usernames
- Multiple theme options (Orange, Blue, Purple, Green, Custom)
- Horizontal and vertical layout options
- Download cards as PNG images
- Share cards with direct links
  
**Sample horizontal devCard:**

![jl_horizontal_devcard](https://github.com/user-attachments/assets/9420621a-ce51-45c5-be97-5ab22f98f1e5)

**Sample vertical devCard:**

![jl_vertical_devcard](https://github.com/user-attachments/assets/28b62dcf-b6fb-4766-be15-f81f7c697a33)

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

The easiest way to deploy is using the Vercel
