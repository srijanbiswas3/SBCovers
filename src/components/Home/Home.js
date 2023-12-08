import React, { useEffect, useState } from 'react';
import VideoList from '../VideoList/VideoList';
import { fetchChannelInfo } from '../../api/Api';
import { useGoogleLogin, GoogleLogin, googleLogout, useGoogleOneTapLogin } from '@react-oauth/google';
import ChannelInfo from '../ChannelInfo/ChannelInfo';
import Button from '@mui/material/Button';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';



function Home() {
  const [dropdownText, setDropdownText] = useState('Latest')
  const [channelInfo, setChannelInfo] = useState(null);
  const [accessToken, setAccessToken] = useState('')
  useEffect(() => {
    fetchChannelDetails()
  }, [])


  const fetchChannelDetails = async () => {
    try {
      const fetchedChannelInfo = await fetchChannelInfo();
      console.log('Channel Info: ', fetchedChannelInfo);

      if (fetchedChannelInfo) {
        setChannelInfo({
          id: fetchedChannelInfo.id,
          title: fetchedChannelInfo.snippet.title,
          subscriberCount: fetchedChannelInfo.statistics.subscriberCount,
          profilePicture: fetchedChannelInfo.snippet.thumbnails.default.url,
          bannerPicture: fetchedChannelInfo.brandingSettings.image.bannerExternalUrl,
          customUrl: fetchedChannelInfo.snippet.customUrl,
          viewCount: fetchedChannelInfo.statistics.viewCount,
          videoCount: fetchedChannelInfo.statistics.videoCount,
          channelDesc: fetchedChannelInfo.snippet.description
        });
      } else {
        console.error('Channel information not available.');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  }


  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/youtube.force-ssl",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    onSuccess: tokenResponse => { console.log(tokenResponse); setAccessToken(tokenResponse.access_token) },
    onError: error => { console.log("Error Google Login ", error) },
    login_hint: "catacomb71@gmail.com"

  });

  const handleChange = (event) => {
    // Update the state with the selected value
    console.log(event)
    setDropdownText(event.target.value);
    console.log("please:", event.target.value);
  };
  return (
    <div className='home-container'>
      <GoogleIcon variant="contained" onClick={() => login()}>login</GoogleIcon>

      <LogoutIcon variant="contained" color="error" onClick={() => googleLogout()}>logout</LogoutIcon>

      <ChannelInfo channelInfo={channelInfo} accessToken={accessToken} />


      Filtered by:
     
      <Select 
        value={dropdownText}
        onChange={(event) => setDropdownText(event.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{bgcolor:'grey.800',margin:'5px'}}
        size='small'
      >
        <MenuItem value="Latest">Latest</MenuItem>
        <MenuItem value="Oldest">Oldest</MenuItem>
        <MenuItem value="Views">Views</MenuItem>
        <MenuItem value="Likes">Likes</MenuItem>
        <MenuItem value="Comments">Comments</MenuItem>
      </Select>

      <VideoList dropdownText={dropdownText} search={""} accessToken={accessToken} />
    </div>
  );
}

export default Home;
