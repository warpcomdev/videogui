import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

import useUser from "../../lib/useUser";
import "../../styles/Home.module.css";
import fetchJson from '../../lib/fetchJson'

// 38.614192, -6.972437
const MapFull = () => {
  const { user } = useUser()
  const [center, setCenter] = useState({ lat: 38.75552, lng: -6.98471 });
  const [cameras, setSelectedCamaras] = useState();

  // mensaje error
  const [errorMsg, setErrorMsg] = useState("");
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();
  var coordinates = [
    [38.75552, -6.98471],
    [38.869901, -7.070868],
  ];

  const camaraIcon = new L.Icon({
    iconUrl: "../images/video/telescope.svg",
    iconRetinaUrl: "../images/video/telescope_shadow.svg",
    iconAnchor: new L.Point(19, 64), // point of the icon which will correspond to marker's location
    popupAnchor: new L.Point(-5, -56), // point from which the popup should open relative to the iconAnchor
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(32, 32), // tamaño del icono
    className: "leaflet-div-icon",
  });

  // useEffect(() => {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/api/camera";
    fetchJson(urlData, {
      Authorization: "Bearer " + user.token,
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedCamaras(data);
      })
      .catch((err) => {
        console.log(err);
      });
  // });

  async function getCameras() {
    try {
      // datos camaras
      // mutateUser(
      res = await fetchJson(urlCamaras, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      return res;

      // )
    } catch (error) {
      if (error instanceof FetchError) {
        setErrorMsg(error.data.message);
      } else {
        console.error("An unexpected error happened:", error);
      }
    }
  }

  function ButtonMarker(id, lat, lng, name) {
    const router = useRouter();

    return (
      <Marker
        key={id}
        position={[lat, lng]}
        icon={camaraIcon}
        eventHandlers={{
          click: () => {
            router.push({
              pathname: "/camara/[id]",
              query: { id: id },
            });
          },
        }}
      >
        <Tooltip>
          {id} <br />
          {name} <br />
          lat: {lat}, lng: {lat}
        </Tooltip>
      </Marker>
    );
  }

  return (
    <>
      <div className="container">
        <div className="container">
          <h1 className="mt-5 text-start">Localización de cámaras</h1>
        </div>
        <div className="row">
          <div className="col">
            <div className="container">
              <MapContainer
                className="leaflet-container2"
                center={center}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
                scrollWheelZoom={true}
                opacity={0}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* detalle camaras */}
                {cameras &&
                  cameras.data.map((item, index) => {
                    return ButtonMarker(
                      item.id,
                      item.latitude,
                      item.longitude,
                      item.name
                    );
                  })}
                {/* {ButtonMarker("cam1", 38.75552, -6.98471)}
                {ButtonMarker("cam2", 38.869901, -7.070868)} */}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapFull;
