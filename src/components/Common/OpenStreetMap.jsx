import React, { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Link from "next/link";
// import 'leaflet/dist/leaflet.css'

// import { Marker, icon } from 'leaflet'

// 38.614192, -6.972437
const Map22 = () => {
  const [center, setCenter] = useState({ lat: 38.614192, lng: -6.972437 })
  
  const ZOOM_LEVEL = 9
  const mapRef = useRef()

  return (
    <>
      <div className='container'>
        <div className='container'>
          {/* <h1 className='text-center-mt-5'>Localización de cámara</h1> scrollWheelZoom={false}*/}
          <Link
              href="/camara"
              // className="rounded-md bg-rojoinstitucional py-3 px-8 text-center text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
            >
              Localización de cámara
            </Link>
        </div>
        <div className='row'>
          <div className='col'>
            <div className='container'>
              <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <Marker
                  position={[center.lat, center.lng]}
                >
                  <Popup>
                    CAM-360-1 <br />
                    Finca La Cocosa <br />
                    lat: 38.75552, lng: -6.98471 <br />
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default Map22