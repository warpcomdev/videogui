import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Breadcrumb from "../components/Common/Breadcrumb";

const VideoPage = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      {/* <script src="https://www.youtube.com/iframe_api"></script> */}

      <Breadcrumb
        pageName="Último video Cámara 360° - Finca La Cocosa"
        description=""
      />
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">
            <div className="w-full px-6 lg:max-w-none">
              {/* Foto Start --->*/}
              <div className="relative aspect-[77/40] items-center justify-center">
                {/* <Image src="/images/video/video.png" alt="video image" fill />
                <div className="absolute top-0 right-0 flex h-full w-full items-center justify-center">
                  <button
                    onClick={() => setOpen(true)}
                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white bg-opacity-75 text-primary transition hover:bg-opacity-100"
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      className="fill-current"
                    >
                      <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                    </svg>
                  </button>
                </div> */}
                {/* <Video
                  channel="youtube"
                  autoplay
                  isOpen={isOpen}
                  videoId="https://www.youtube.com/watch?BoYpQrZcC3Q"
                  onClose={() => setOpen(false)}
                /> */}
                {/* <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="BoYpQrZcC3Q" onClose={() => setOpen(false)} />
                <button className="btn-primary" onClick={()=> setOpen(true)}>VIEW DEMO</button> */}

                <video
                  class="border-gray-200 dark:border-gray-700 h-auto w-full max-w-5xl rounded-lg border"
                  controls
                >
                  <source src="/images/video/video1.mp4" type="video/mp4" />
                    su navegador no soporte el TAG de video.
                </video>

                {/* <iframe
                  width="1000"
                  height="225"
                  src="https://www.youtube.com/embed/BoYpQrZcC3Q"
                  title="Fondo de pantalla del universo con música relajante para meditar// Wallpaper of the universe"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe> */}
              </div>
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
              className="rounded-md bg-rojoinstitucional py-3 px-8 text-center text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
            >
              Volver a camara
            </Link>
            {/* </div> */}
          </div>
        </div>
      </div>
      {/* <ModalVideo
        channel="youtube"
        autoplay={true}
        start={true}
        isOpen={isOpen}
        videoId="BoYpQrZcC3Q"
        onClose={() => setOpen(false)}
      />
      <div className="absolute bottom-0 left-0 right-0 z-[-1]">
        <Image src="/images/video/shape.svg" alt="shape" className="w-full" />
      </div> */}
    </>
  );

  ReactDOM.render(<VideoPage />, document.getElementById("root"));
};

export default VideoPage;
