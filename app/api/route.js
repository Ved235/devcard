import { NextResponse } from 'next/server';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Fetch user data
    const userResponse = await fetch(`${HN_API_BASE}/user/${username}.json`);
    
    if (!userResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }

    const userData = await userResponse.json();

    if(!userData){
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Account creation date
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const accountCreated = new Intl.DateTimeFormat('en-US', options).format(new Date(userData.created * 1000));

    // Fetch user's submissions
    const submissions = userData.submitted || [];

    const storyPromises = submissions.map(async (itemId) => {
      try {
        const response = await fetch(`${HN_API_BASE}/item/${itemId}.json`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.type === "story" && data.score) {
            return data; 
          }
        }
        return null;
      } catch(e) {
        return null;
      }
    });

    const stories = await Promise.all(storyPromises);
    const validStories = stories
      .filter(story => story !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const result = {
      username: userData.id,
      karma: userData.karma || 0,
      creationDate: accountCreated,
      joinDate: new Date(userData.created * 1000).getFullYear(),
      totalSubmissions: submissions.length,
      topStories: validStories.map(story => ({
        id: story.id,
        title: story.title,
        score: story.score,
        url: story.url
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching HackerNews data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' }, 
      { status: 500 }
    );
  }
}