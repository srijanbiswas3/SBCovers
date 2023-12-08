import React, { useState } from 'react';
// import { Button } from 'react-bootstrap';
import { subscribeChannel } from '../../api/Api';
import './ChannelInfo.css'; // Import your CSS file
import Button from '@mui/material/Button';


const ChannelInfo = ({ channelInfo, accessToken }) => {

  const [isSubscribed, setIsSubscribed] = useState(false);

const handleImageClick=()=>{
  const url = 'https://www.youtube.com/channel/UCOdmaZt9s806R0U6Pjtrq-Q'; // Replace with your desired URL
  window.open(url, '_blank');
}
  return (
    <div className='background'>
      <img className="channel-banner" src={channelInfo ? channelInfo.bannerPicture : 'N/A'} alt="brandpic" />
      <div className='channel-detail'>
        <img className="channel-profile-pic" src={channelInfo ? channelInfo.profilePicture : 'N/A'} alt="profilepic"  onClick={handleImageClick}/>
        <h1 className="channel-title">{channelInfo ? channelInfo.title : 'Channel Name'}</h1>
        <p className="channel-url">Channel URL: {channelInfo ? channelInfo.customUrl : 'Channel URL'}</p>
        <p className="subscriber-count">Subscriber Count: {channelInfo ? channelInfo.subscriberCount : 'N/A'}</p>
        <p className="total-view-count">Total View Count: {channelInfo ? channelInfo.viewCount : 'N/A'}</p>
        <p className="total-video-count">Total Video Count: {channelInfo ? channelInfo.videoCount : 'N/A'}</p>
        <Button color="error"
          variant="contained" className="subscribe-buttoon" onClick={async () => {
            await subscribeChannel(channelInfo ? channelInfo.id : 'N/A', accessToken)
            console.log(isSubscribed)

          }}
          disabled={isSubscribed}>
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>
    </div>
  );
};

export default ChannelInfo;
