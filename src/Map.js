import { latLng, MarkerClusterGroup } from "leaflet";
import * as L from "leaflet";
import React from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

const aus_state = require("./geoLoc/aus-state.json");

const colors = {
  blue: {
    color: "blue",
    value: "Very Light Rain",
  },
  green: {
    color: "green",
    value: "Light Rain",
  },
  yellow: {
    color: "yellow",
    value: "Medium Rain",
  },
  orange: {
    color: "orange",
    value: "Heavy Rain",
  },
  red: {
    color: "red",
    value: "Very Heavy Rain",
  },
};

const styles = {
  fillColor: "#D3D3D3",
  weight: 2,
  opacity: 1,
  color: "black",
  dashArray: "3",
  fillOpacity: 0.5,
};

// Shows map
function Map({ data }) {
  const FeatureList = (args, layer) => {
    let name = args?.properties?.STATE_NAME;
    layer.bindPopup(name + " Rainfall: 1000");
    layer.on({
      click: (event) => {
        event.target.setStyle({
          color: "red",
        });
      },
    });
  };

  let lastColor = "";
  const heatmap = () =>
    Object.keys(colors).map((value, index) => {
      let rad;
      let colorprev = "";
      let colornext = "";

      if (index === 0) {
        rad = "10px 10px 0px 0px";
        colorprev = "white";
        colornext = value;
      }

      if (index === Object.keys(colors).length - 1) rad = "0px 0px 10px 10px";

      if (colorprev === "" && colornext === "") {
        colorprev = lastColor;
        colornext = value;
      }

      lastColor = value;

      return (
        <div
          style={{
            textAlign: "center",
            fontWeight: 600,
            maxWidth: 100,
            borderRadius: rad,
            // backgroundColor: value,
            background: `linear-gradient(${colorprev}, ${colornext})`,
            padding: 5,
            height: 100,
            display: "grid",
            placeItems: "center",
          }}
        >
          {colors[value].value}
        </div>
      );
    });

  const explore_data = require("./data/ExploreData.json");

  let raindata = {};
  let aggregate = {
    value: 0,
  };

  const color_map = (value) => {
    // Associate name with value
    if (!value) return blueIcon;
    let ass;
    Object.keys(aggregate).map((v) => {
      if (value.includes(v)) {
        ass = aggregate[v];
      } else {
        return blueIcon;
      }
    });

    if (ass < 0) return blueIcon;
    if (ass > 0 && ass <= 1) return blueIcon;
    if (ass > 1 && ass <= 2) return greenIcon;
    if (ass > 2 && ass <= 10) return yellowIcon;
    if (ass > 10 && ass <= 50) return orangeIcon;
    if (ass > 50) return redIcon;
  };

  Object.keys(explore_data["1"]).map((explore_, value_) => {
    try {
      Object.keys(explore_data["1"][explore_]["Rainfall"]).map((rain_) => {
        let entry = {
          rain: explore_data["1"][explore_]["Rainfall"][rain_],
          location:
            explore_data["1"][explore_]["Location"][
              Object.keys(explore_data["1"][explore_]["Location"])[0]
            ],
        };

        raindata[Object.keys(raindata).length] = entry;
        aggregate[entry.location] = aggregate.value + entry.rain;
      });
    } catch (err) {}
  });

  var blueIcon = new L.Icon({
    iconUrl:
      "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-blue.png?raw=true",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var redIcon = new L.Icon({
    iconUrl:
      "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-red.png?raw=true",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var greenIcon = new L.Icon({
    iconUrl:
      "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-green.png?raw=true",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var orangeIcon = new L.Icon({
    iconUrl:
      "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-orange.png?raw=true",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var yellowIcon = new L.Icon({
    iconUrl:
      "https://github.com/pointhi/leaflet-color-markers/blob/master/img/marker-icon-2x-yellow.png?raw=true",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const markers = () => {
    var values = data.map((val) => {
      return (
        <>
          <Marker
            icon={color_map(JSON.parse(val).display_name) ?? blueIcon}
            position={latLng(JSON.parse(val).lat, JSON.parse(val).lon)}
          >
            <Popup>{JSON.parse(val).display_name ?? ""}</Popup>
          </Marker>
        </>
      );
    });
    return values ?? <></>;
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "600px",
          height: "600px",
        }}
      >
        <MapContainer
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 15,
          }}
          center={[-26.2744, 133.7751]}
          zoom={4}
          scrollWheelZoom={false}
        >
          <GeoJSON
            style={styles}
            data={aus_state}
            onEachFeature={FeatureList}
          />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers()}
        </MapContainer>
      </div>
      <div style={{ margin: 10 }}>
        <p style={{ fontWeight: 800, textAlign: "center" }}>Heatmap</p>
        {heatmap()}
      </div>
    </div>
  );
}

export default Map;
