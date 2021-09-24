import React, { useState, useEffect } from "react";
import { CircularProgress, Hidden } from "@material-ui/core";
import "./App.css";
import Map from "./Map";
import Data from "./Data";

const App = () => {
  // Stringified JSON Data of all states with geoloc
  const [data, setData] = useState([]);

  React.useState(() => {
    Data(setData);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      setData(
        Object.keys(localStorage).map((dat) => {
          return window.localStorage.getItem(dat);
        })
      );
    }, 5000);

    return () => clearInterval(intervalId); //This is important
  }, [useState]);

  // info.then((val) => setData(JSON.stringify(val)));

  return (
    <div className="App">
      <h1>Mapping rainfall data for Data Analytics</h1>
      {data == null || data.length < 1 ? (
        <CircularProgress color="secondary" />
      ) : (
        <Map data={data} />
      )}
      <div
        className="scr"
        style={{
          maxHeight: 150,
          width: "80%",
          backgroundColor: "seashell",
          borderRadius: 20,
          padding: 10,
          margin: 20,
        }}
      >
        {"Current Dataset locations: " + data?.length ?? 0}
      </div>
    </div>
  );
};

export default App;
