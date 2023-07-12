import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react"
import fetchJson from "../lib/fetchJson";
import Breadcrumb from "../components/Common/Breadcrumb";
import { useSearchParams } from "next/navigation";

export async function getServerSideProps(context) {
  const { cameraId, videoId } = context.query;
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  var data = await getData(session.user.token, videoId);
  if (data) {
    return {
      props: {
        session,
        video: data
      }
    };
  } else {
    return {
      props: {
        session,
        video: null
      },
    };
  }

}

async function getData(token, id) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL
      + `/v1/api/video/${id}`;
    const res = await fetchJson(urlData, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    // handle errors
    if (!res || res.error) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Ocurrio un error al extraer los datos");
    }

    return res;
  } catch (error) {
    console.error('ERROR VIDEO', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

const VideoPage = ({ video }) => {
  const searchParams = useSearchParams();

  const camera = {
    id: searchParams.get("cameraId"),
    name: searchParams.get("cameraName"),
    videoId: searchParams.get("videoId"),
  };


  return (
    <>
      <Breadcrumb
        pageName={`Último video - ${camera.name}`}
        description=""
      />
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">
            <div className="w-full px-6 lg:max-w-none">
              <div className="relative aspect-[77/40] items-center justify-center">

                {video.media_url.endsWith('.avi') &&
                  <a href={`${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL: ""}/v1/media/${video.media_url}`} download>Descargar video</a>
                }
                {!video.media_url.endsWith('.avi') &&
                  <video
                    class="border-gray-200 dark:border-gray-700 h-auto w-full max-w-5xl rounded-lg border"
                    controls
                  >
                    <source src={`${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL: ""}/v1/media/${video.media_url}`} type="video/mp4" />
                    su navegador no soporte el TAG de video.
                  </video>
                }
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
              href="/camera"
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
