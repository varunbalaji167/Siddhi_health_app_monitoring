import React from "react";
import ImageSlider from "./HomePageImages.jsx"; // Adjust the import path as per your project structure
import charak1 from "./img/Charak1.jpg";
import charak2 from "./img/Charak2.png";
import charak3 from "./img/Charak3.png";
import charak4 from "./img/Charak4.jpg";
import charak6 from "./img/Charak6.jpeg";

const ImgCol = () => {
  const images = [
    {
      url: charak1,
    },
    {
      url: charak2,
    },
    {
      url: charak4,
    },

    {
      url: charak6,
    },

    {
      url: charak3,
    },
    // Add more image URLs as needed
  ];

  return (
    <div>
      <ImageSlider images={images} />
    </div>
  );
};

export default ImgCol;
