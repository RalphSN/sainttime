import PropTypes from "prop-types";



const VideoPlayer = ({ src }) => {
    return (
      <video width="100%" height="auto" controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  VideoPlayer.propTypes = {
    src: PropTypes.string.isRequired,
  };
  
  export default VideoPlayer;
  