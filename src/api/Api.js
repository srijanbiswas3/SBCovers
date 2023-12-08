// Api.js
import axios from 'axios';
import { API_KEY, CHANNEL_ID, PLAYLIST_ID } from '../config';

const fetchChannelInfo = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics,brandingSettings',
        id: CHANNEL_ID,
        key: API_KEY,
      },
    });

    const channelInfo = response.data.items[0];
    return channelInfo;
  } catch (error) {
    console.error('Error fetching channel information:', error);
    return null;
  }
};

const fetchPlaylistItems = async (dropdownText) => {
  console.log(dropdownText)
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet,contentDetails',
        playlistId: PLAYLIST_ID,
        key: API_KEY,
        maxResults: 20,
      },
    });

    const videoItems = response.data.items;

    return videoItems;

  } catch (error) {
    console.error('Error fetching playlist items:', error);
    return [];
  }
};

const fetchVideoDetails = async (videoId) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: API_KEY,
      },
    });

    const videoDetails = response.data.items[0];
    return videoDetails;
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
};

const fetchVideoComments = async (videoId) => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
      params: {
        part: 'snippet,replies',
        videoId: videoId,
        key: API_KEY,
      },
    });

    const comments = response.data.items.map(item => {
      const authorName = item.snippet.topLevelComment.snippet.authorDisplayName;
      const commentText = item.snippet.topLevelComment.snippet.textDisplay;
      const replies = item.replies ? item.replies.comments.map(reply => ({
        authorName: reply.snippet.authorDisplayName,
        commentText: reply.snippet.textDisplay,
      })) : [];

      return { authorName, commentText, replies };
    });

    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

const filterVideos = async (videoDetails, dropdownText, search) => {
  videoDetails = videoDetails.filter(video => video !== null);

  if (dropdownText === 'Latest') {
    videoDetails.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt));
  } else if (dropdownText === 'Oldest') {
    videoDetails.sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt));
  }
  else if (dropdownText === 'Comments') {
    videoDetails.sort((a, b) => b.statistics.commentCount - a.statistics.commentCount);
  }
  else if (dropdownText === 'Likes') {
    videoDetails.sort((a, b) => b.statistics.likeCount - a.statistics.likeCount);
  }
  else if (dropdownText === 'Views') {
    videoDetails.sort((a, b) => b.statistics.viewCount - a.statistics.viewCount);
  }
  console.log("filterVideosWithDetails : ", videoDetails)
  return videoDetails;

}

const likeVideo = async (accessToken, videoId) => {
  try {


    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id: videoId,
        rating: 'like',
      }),
    });
    console.log("Response : ", response)
    if (response.ok === true) {
      console.log('Video liked successfully');
    }
    else{
    console.log('Error Liking: ', response)
    }
  } catch (error) {
    console.error('Error liking video:', error);
  }
};

const postComment = async (videoId, commentText, accessToken) => {
  try {
    const response = await axios.post('https://www.googleapis.com/youtube/v3/commentThreads', {
      part: 'snippet',
      snippet: {
        videoId: videoId,
        channelId:CHANNEL_ID,
        topLevelComment: {
          snippet: {
            textOriginal: commentText,
          },
        },
      },
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        part: "snippet",
      },
    });

    console.log('Comment posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting comment:', error.response ? error.response.data : error.message);
  }
};

const subscribeChannel = async (channelId, accessToken) => {
  try {
    console.log("Det: ", channelId, " and ", accessToken)
    // Check if the user is already subscribed
    const response = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
      params: {
        part: 'snippet,contentDetails',
        // channelId: channelId,
        mine: true,
        forChannelId: channelId,
        key: API_KEY, // Replace with your YouTube API key
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const subscrption = response.data.items
    console.log("subscribe :", subscrption)


    if (response.data.items.length > 0) {
      // User is already subscribed, handle accordingly
      console.log('User is already subscribed to the channel.');
    } else {
      //  Subscribe the user to the channel
      await axios.post(
        'https://www.googleapis.com/youtube/v3/subscriptions',
        {
          snippet: {
            resourceId: {
              kind: "youtube#subscription",
              channelId: channelId,


            },
          },
        },

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            part: "snippet",
          },
        }
      );

      console.log('User subscribed to the channel successfully.');
    }
  } catch (error) {
    console.error('Error subscribing to the channel:', error.response ? error.response.data : error.message);
  }
};
export { fetchChannelInfo, fetchPlaylistItems, fetchVideoDetails, fetchVideoComments, filterVideos, likeVideo, postComment, subscribeChannel };
