import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
// import 'leaflet/dist/leaflet.css'

// import { Marker, icon } from 'leaflet'

// 38.614192, -6.972437
const Map22 = ({ camera }) => {
  const [center, setCenter] = useState([camera.latitude, camera.longitude]);

  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  /**
   * Icono camara
   */
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

  return (
    <>
      <div className="container">
        <div className="container">
          {/* <h1 className='text-center-mt-5'>Localización de cámara</h1> scrollWheelZoom={false}*/}
          <Link
            href="/camera"
            // className="rounded-md bg-rojoinstitucional py-3 px-8 text-center text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
          >
            Localización de cámara
          </Link>
        </div>
        <div className="row">
          <div className="col">
            <div className="container">
              <MapContainer
                center={center}
                zoom={ZOOM_LEVEL}
                ref={mapRef}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center} icon={camaraIcon}>
                  <Popup>
                    {camera.id} <br />
                    {camera.name} <br />
                    lat: {camera.latitude}, lng: {camera.longitude} <br />
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Map22;
