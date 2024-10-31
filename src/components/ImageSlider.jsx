import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "../index.css";

export default function ImageSlider({ url, limit = 5, page = 1 }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [currentSlider, setCurrentSlider] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchImages(getUrl) {
    try {
      setLoading(true);
      const response = await fetch(`${getUrl}?page=${page}&limit=${limit}`);
      const resData = await response.json();
      if (resData) {
        setImages(resData);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (url) fetchImages(url);
  }, [url]);

  function handleNext() {
    setCurrentSlider(
      currentSlider === images.length - 1 ? 0 : currentSlider + 1
    );
  }
  function handlePrevious() {
    setCurrentSlider(
      currentSlider === 0 ? images.length - 1 : currentSlider - 1
    );
  }

  if (loading) {
    return <div>Loading data! Please wait...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <BsArrowLeftCircleFill
        onClick={handlePrevious}
        className="arrow arrow-left"
      />
      {images && images.length > 0 ? (
        images.map((imageItem, index) => (
          <img
            key={imageItem.id || imageItem.download_url} // Ensure `id` or use URL if unique
            alt="Slider Image"
            src={imageItem.download_url}
            className={
              currentSlider === index
                ? "current-image"
                : "current-image hide-current-image"
            }
          />
        ))
      ) : (
        <p>No images available</p>
      )}
      <BsArrowRightCircleFill
        onClick={handleNext}
        className="arrow arrow-right"
      />
      <span className="circle-indicators">
        {images && images.length
          ? images.map((_, index) => (
              <button
                key={index}
                className={
                  currentSlider === index
                    ? "current-indicator"
                    : "current-indicator inactive-indicator"
                }
                onClick={() => setCurrentSlider(index)}
              ></button>
            ))
          : null}
      </span>
    </div>
  );
}
