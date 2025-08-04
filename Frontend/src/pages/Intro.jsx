import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import backgroundImage2 from "../assets/clark-street-mercantile-P3pI6xzovu0-unsplash.jpg";

const elements = [
  {
    type: "header",
    value: "Your Wardrobe, Reimagined",
  },
  {
    type: "line",
    value:
      "Upload, organize, and style your outfits effortlessly with our Virtual Wardrobe and Outfit Generator.",
  },
  {
    type: "button",
    value: "Get started",
  },
];

const Intro = () => {
  const [visibleElements, setVisibleElements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timeouts = [];
    elements.forEach((el, index) => {
      const timeout = setTimeout(() => {
        setVisibleElements((prev) => [...prev, el]);
      }, index * 700);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  return (
    <div
      className="relative h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${backgroundImage2})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 via-black/40 to-black"></div>
      <div className="relative z-10 flex flex-col justify-center items-center h-full">
        {visibleElements.map((el, index) => {
          if (el.type === "header") {
            return (
              <h1
                key={index}
                className="text-4xl font-bold mb-4 animate-slideInFromTop"
              >
                {el.value}
              </h1>
            );
          }
          if (el.type === "line") {
            return (
              <p
                key={index}
                className="text-lg font-light mb-4 animate-slideInFromTop"
              >
                {el.value}
              </p>
            );
          }
          if (el.type === "button") {
            return (
              <button
                key={index}
                onClick={() => navigate("/vw/homepage")}
                className="font-bold text-center px-6 py-3 border border-white bg-transparent text-white hover:bg-red-500 hover:border-red-500 transition duration-300 animate-slideInFromTop"
              >
                {el.value}
              </button>
            );
          }
          return null;
        })}
      </div>
      <Outlet />
    </div>
  );
};

export default Intro;
