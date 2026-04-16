import './Loader.css';

export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className="loader">
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-shadow"></div>
          <div className="loader-shadow"></div>
          <div className="loader-shadow"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader">
      <div className="loader-circle"></div>
      <div className="loader-circle"></div>
      <div className="loader-circle"></div>
      <div className="loader-shadow"></div>
      <div className="loader-shadow"></div>
      <div className="loader-shadow"></div>
    </div>
  );
}