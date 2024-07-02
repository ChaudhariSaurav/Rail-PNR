import React, { useState, useEffect } from "react";

const App = () => {
  const [pageViews, setPageViews] = useState(0);

  useEffect(() => {
    const storedPageViews = localStorage.getItem("pageViews");

    if (storedPageViews) {
      setPageViews(parseInt(storedPageViews, 10));
    }

    setPageViews((prevPageViews) => {
      const newPageViews = prevPageViews + 1;
      localStorage.setItem("pageViews", newPageViews.toString());
      return newPageViews;
    });
  }, []);

  return (
    <div className="bg-gray-200 rounded-lg p-4 shadow-md text-center">
      <p className="text-center">
        {" "}
        Saurav Chaudhary &copy; {new Date().getFullYear()}
      </p>
      <p className="text-5xl font-bold">{pageViews}</p>
    </div>
  );
};

export default App;
