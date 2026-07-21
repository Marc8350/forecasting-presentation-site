import { CONTENT } from "../content/site-content";

export function VideoGallery() {
  return (
    <div className="video-grid">
      {CONTENT.videos.map((video, index) => (
        <article className="video-card" key={video.id}>
          <div className={`video-poster poster-${index + 1}`}>
            <div className="poster-window" aria-hidden="true">
              <span className="poster-rail"><i/><i/><i/><i/></span>
              <span className="poster-canvas"><i/><i/><i/><i/><i/></span>
            </div>
            <span className="video-number">0{index + 1}</span>
            <span className="video-state">Video coming soon</span>
          </div>
          <div className="video-body">
            <div><span>Demo {index + 1}</span><span>{video.duration}</span></div>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
