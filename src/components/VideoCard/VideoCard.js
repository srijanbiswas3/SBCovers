import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube';
import { likeVideo, postComment } from "../../api/Api"
import './VideoCard.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';

function VideoCard({ video, accessToken }) {
  const [commentText, setCommentText] = useState("")
  const [isLoaded, setIsLoaded] = useState(false);

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0, // 0 or 1
      controls: 1, // 0 or 1
      modestbranding: 1, // 0 or 1
      showinfo: 1, // 0 or 1
      rel: 0, // 0 or 1
    },
  };
  const handleReady = () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

  }
  const handleError = () => {


  }

  const handleLike = async () => {
    await likeVideo(accessToken, video.id)
  }
  const handlePostComment = async () => {
    await postComment(video.id, commentText, accessToken)
  }
  return (
    <div className="video-details-container">
      <h3 className="video-title">{video.snippet.title}</h3>
      {/* {isLoading ? (<Skeleton width={640} height={390} sx={{ bgcolor: 'grey.400' }}
        variant="rectangular" className="skeleton" />) : (
        <YouTube videoId={video.id} opts={opts} className="youtube-video"
          onReady={handleReady}
          onError={handleError} />
      )} */}
      <div className='video-area'>
        {!isLoaded && (
          <div className="skeleton-container">
            <Skeleton width={640} height={400} sx={{
              position: 'absolute'
            }}
              variant="rounded" className="skeleton" animation="wave" />
          </div>
        )}

        <YouTube videoId={video.id} opts={opts} className="youtube-video"
          onReady={handleReady}
          onError={handleError} />
      </div>
      <ThumbUpIcon variant="contained" className="like-button" onClick={handleLike}>
        Like
      </ThumbUpIcon>
      <p className="statistic">Likes: {video.statistics ? video.statistics.likeCount : 'N/A'}</p>
      <VisibilityIcon />
      <p className="statistic">Views: {video.statistics ? video.statistics.viewCount : 'N/A'}</p>

      <p className="published-at">Published at: {video.snippet.publishedAt}</p>
      <div>
        <h4 className="comments-title">Comments:</h4>
        {video.comments &&
          video.comments.map((comment, index) => (
            <div key={index} className="comment-container">
              <p className="comment">
                <strong>{comment.authorName}</strong>: {comment.commentText}
              </p>
              {comment.replies &&
                comment.replies.map((reply, replyIndex) => (
                  <p key={replyIndex} className="reply">
                    <strong>{reply.authorName}</strong>: {reply.commentText}
                  </p>
                ))}
            </div>
          ))}
        <TextField
          id="outlined-size-small"
          size="small"
          label="Comment"
          placeholder="Add a Comment..."

          multiline
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ bgcolor: 'grey.900', width: '500px', margin: '10px' }}
        />

        <Button variant="contained" className="comment-button" onClick={() => handlePostComment(video.id, commentText, accessToken)}>
          Comment
        </Button>
      </div>
      <Button
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        color="error"
        sx={{ margin: '10px' }}
      >
        Watch on YouTube
      </Button>
    </div>
  );
};

export default VideoCard