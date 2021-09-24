import React from "react";
import axios from "axios";

const explore_data = require("./data/ExploreData.json");

const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
  },
  responseType: "blob",
};

// Gets all data and returns it
const Data = () => {
  // Gets data from localstorage, if not found then finds it from internet
  // Returns each item from specified url name (name of state / location)
  const get_data = (url) => {
    if (!window.localStorage.getItem(url)) {
      retrieve(url);
    }
    return JSON.parse(window.localStorage.getItem(url));
  };

  const retrieve = (url) =>
    axios
      .get(
        "https://nominatim.openstreetmap.org/search?format=json&q=" +
          url +
          " Australia",
        {
          crossdomain: true,
          headers: config,
          proxy: { host: "https://nominatim.openstreetmap.org/" },
        }
      )
      .then((val) =>
        window.localStorage.setItem(url, JSON.stringify(val.data[0]))
      )
      .catch();

  return Promise.all(
    Object.keys(explore_data[0]).map((explore_, value_) => {
      let name = explore_data[0][explore_];
      let value = get_data(name);
      return JSON.stringify(value);
    })
  );
};

export default Data;
