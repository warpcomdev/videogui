import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

import "../../styles/Home.module.css";

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

/**
 * Función genera la camara (marker) en OpenStreetmap
 * y asigna las propiedades del tooltip y del click
 */
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
            pathname: "/camera",
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

/**
 * Componente mapa central
 */
const MapFull = ({ cameras }) => {
  const mapRef = useRef();
  const ZOOM_LEVEL = 9;

  // despliega el mensaje en caso de no tener camaras registradas
  if (!cameras || cameras.data.length === 0) {
    return (
      <>
        <h3>No se tiene registrada ninguna camara.</h3>
      </>
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
                center={[cameras.data[0].latitude, cameras.data[0].longitude]}
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
                  cameras?.data?.length > 0 &&
                  cameras?.data?.map((item) => {
                    return ButtonMarker(
                      item.id,
                      item.latitude,
                      item.longitude,
                      item.name
                    );
                  })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapFull;
