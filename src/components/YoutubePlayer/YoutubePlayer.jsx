import YouTube from "react-youtube";
import PropTypes from "prop-types";


const YoutubePlayer = ({ videoId }) => {
  const opts = {
    height: "auto",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

YoutubePlayer.propTypes = {
 videoId: PropTypes.string.isRequired,
};

export default YoutubePlayer;

