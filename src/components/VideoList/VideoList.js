// src/components/VideoList.js
import React, { useEffect, useState } from 'react';
import {
    fetchPlaylistItems,
    fetchVideoDetails,
    fetchVideoComments,
    filterVideos
} from '../../api/Api';
import VideoCard from '../VideoCard/VideoCard';



const VideoList = ({ dropdownText,accessToken}) => {

    const [videos, setVideos] = useState([]);


    useEffect(() => {
        console.log("Search : ",dropdownText," ")
        fetchVideos(dropdownText);
    }, [dropdownText]);

    const fetchVideos = async (dropdownText) => {
        try {

            const videoItems = await fetchPlaylistItems(dropdownText);
            console.log('Playlist Info: ', videoItems);


            const videoDetails = await Promise.all(videoItems.map(async (video) => {
                try {
                    const details = await fetchVideoDetails(video.contentDetails.videoId);
                    // console.log('Video Details: ', details);

                    const comments = await fetchVideoComments(video.contentDetails.videoId);

                    return { ...details, comments };
                } catch (error) {
                    console.error('Error fetching video details:', error);
                    return null;
                }
            }));


            const videosWithDetails = await filterVideos(videoDetails, dropdownText);

            setVideos(videosWithDetails);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };




    return (
        <div>
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} accessToken={accessToken} />
            ))}
        </div>
    );
};

export default VideoList;
