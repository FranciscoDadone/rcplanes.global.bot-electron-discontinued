import '../../../assets/css/Media.css';

function Media(props: { mediaType: string; media: string }) {
  const { mediaType, media } = props;

  if (mediaType === 'VIDEO') {
    return (
      <div>
        <video className="video" autoPlay controls>
          <source src={media} type="video/mp4" />
        </video>
      </div>
    );
  }
  return (
    <div>
      <img src={media} alt="img" className="image" />
    </div>
  );
}

export default Media;
