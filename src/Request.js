import axios from "axios";
import React from "react";

export default async function Request(url, setData) {
  return fetch(
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
      url +
      " Australia",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  )
    .then((val) => val.json())
    .then((val) => window.localStorage.setItem(val[0]))
    .catch((err) => console.log(err));
}
