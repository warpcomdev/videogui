import React from "react";
import Image from "next/image";
import Link from "next/link";

import Breadcrumb from "../components/Common/Breadcrumb";

const FotoPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Última foto Cámara 360° - Finca La Cocosa"
        description=""
      />

      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">
            <div className="w-full px-6 lg:max-w-none">
              {/* Foto Start --->*/}
              {/* <Image
                src="/images/video/pexels-pixabay-2150.jpg"
                alt="foto"
                width={100}
                height={25}
                className="w-full"
              /> */}
              <Image
                alt="nature"
                className="h-[48rem] w-full object-cover object-center"
                src="/images/video/pexels-pixabay-2150.jpg"
              />
            </div>
          </div>
          <br></br>

         <div
                className="
                      mx-auto
                      mt-8
                      grid
                      max-w-lg grid-cols-4
                      items-center gap-x-1 gap-y-10
                      sm:max-w-xl sm:grid-cols-1 sm:gap-x-1
                      lg:mx-8
                      lg:max-w-none lg:grid-cols-4"
              > 
          {/* <div className="-mx-2 flex flex-wrap items-right">
            <div className="w-full px-6 lg:max-w-none items-end"> */}
            <div className="ocultar-div"></div>
            <div className="ocultar-div"></div>
            <div className="ocultar-div"></div>
              <Link
                href="/camara"
                className="text-center rounded-md bg-rojoinstitucional py-3 px-8 text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
              >
                Volver a camara
              </Link>
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default FotoPage;
