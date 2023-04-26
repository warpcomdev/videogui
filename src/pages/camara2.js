import React from "react";
import dynamic from 'next/dynamic'
// import Map from '@/src/components/Map/LeafletMap'

// import OpenStreetMap from '../component/OpenStreetMap'
const OpenStreetMap = dynamic(() => import('../components/Common/OpenStreetMap'), {
  ssr: false,
})

const Camara2Page = () => {
  return (
    <>
      <h1 className='text-center'>OpenStreetMap</h1>
      <OpenStreetMap />
    </>
  )
}

export default Camara2Page