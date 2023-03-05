import { FC, useState } from "react";
import Map, {Layer, Marker, NavigationControl, Source} from "react-map-gl";
import * as turf from "@turf/turf";


type Props = {
  marker: {
    longitude: Number,
    latitude: Number,
  },
  layer: {
    longitude: Number,
    latitude: Number,
  },
  range: Number
};

export const AttachMap: (marker, layer, range) => JSX.Element = (
  marker,
  layer,
  range
) => {
  const getLayerData = () => {
    return turf.circle([layer.longitude, layer.latitude], range, {
      steps: 50, units: "kilometers"
    })
  }

  return (
    <>
      <Map
        initialViewState={{
          longitude: -73.990593,
          latitude: 40.740121,
          zoom: 10
        }}
        style={{borderRadius: '12px'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl/>
        {
          marker &&
          <Marker longitude={marker.longitude} latitude={marker.latitude} anchor="center"/>
        }
        {
          layer &&
          <Source type={'geojson'} data={getLayerData()}>
            <Layer
              id="point-90-hi"
              type="fill"
              paint={{
                "fill-color": "#088",
                "fill-opacity": 0.2,
                "fill-outline-color": "yellow"
              }}
            />
          </Source>
        }
      </Map>
    </>
  );
};
