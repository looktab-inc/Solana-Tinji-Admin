import React, {useRef} from "react";
import {CountryCodes} from "@/util/IOSCounryCode";
import CustomSelect from "@/components/CustomSelect";
import Map, {Layer, Marker, NavigationControl, Source} from "react-map-gl";
import * as turf from "@turf/turf";

export interface Props {
  country: string;
  setCountry: any,
  address: string;
  handleChangeAddress: any;
  searchAddress: any;
  addressSearchResult: any;
  handleClickAddress: any;
  range: any;
  handleLocalRange: any;
  marker: any;
  layer: any;
  mapRef: any;
}

const CreateNFTStep2 = React.forwardRef<HTMLElement, Props>(
  ({
     country,
     setCountry,
     address,
     handleChangeAddress,
     searchAddress,
     addressSearchResult,
     handleClickAddress,
     range,
     handleLocalRange,
     marker,
     layer,
     mapRef,
     ...props }, ref) => {

    return (
      <div className="h-[724px]">
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium  mb-[12px]">Country</p>
          <select
            className="form-select appearance-none
                        block
                        w-full
                        rounded-xl border  py-[16px] px-[24px]
                        text-base
                        font-normal
                       border-[#646B7C] bg-[#191A1E]
                        transition
                        ease-in-out
                        "
            value={country}
            aria-label="Default select example"
            onChange={(e) => setCountry(e.target.value)}
          >
            {
              CountryCodes.map(countryCode => <option key={countryCode[0]} value={countryCode[0]}>{countryCode[1]}</option>)
            }
          </select>
        </div>
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium  mb-[12px]">Address</p>
          <input
            className="w-full h-[56px]  placeholder:text-[#727272] rounded-xl border border-[#646B7C] bg-[#191A1E] py-[16px] px-[24px]"
            placeholder="Please enter your address"
            value={address}
            onChange={handleChangeAddress}
            onKeyDown={searchAddress}
          />
          {
            addressSearchResult.length > 0 &&
            <CustomSelect addressList={addressSearchResult} onClick={handleClickAddress}/>
          }
        </div>
        <div className="mb-[20px]">
          <p className="text-[16px] font-medium  mb-[12px]">Local range</p>
          <select
            className="form-select appearance-none
                        block
                        w-full
                        rounded-xl border py-[16px] px-[24px]
                        text-base
                        font-normal
                        border-[#646B7C] bg-[#191A1E]
                        transition
                        ease-in-out
                        "
            value={range}
            aria-label="Default select example"
            onChange={(e) => handleLocalRange(e)}
          >
            <option value={0}>Select local range</option>
            <option value="1">1 km</option>
            <option value="5">5 km</option>
            <option value="10">10 km</option>
          </select>
        </div>
        <div className="h-[350px]">
          <Map
            id="displayMap"
            initialViewState={{
              longitude: marker.longitude ? marker.longitude : -73.990593,
              latitude: marker.latitude? marker.latitude : 40.740121,
              zoom: 10
            }}
            ref={mapRef}
            style={{borderRadius: '12px'}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          >
            <NavigationControl/>
            {
              marker.latitude && marker.longitude &&
              <Marker longitude={marker.longitude} latitude={marker.latitude}/>
            }
            {
              layer.latitude && layer.longitude && range > 0 &&
              <Source type={'geojson'} data={turf.circle([layer.longitude, layer.latitude], range, {
                steps: 50, units: "kilometers"
              })}>
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
        </div>
      </div>
    );
  }
);

export default CreateNFTStep2;
