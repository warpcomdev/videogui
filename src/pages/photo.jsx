import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "../components/Common/Breadcrumb";
import { getSession } from "next-auth/react"
import fetchJson from "../lib/fetchJson";


export async function getServerSideProps(context) {
  const { cameraId, pictureId } = context.query;
  const session = await getSession(context);
  if (!session) {
      return {
          redirect: {
              destination: '/login',
              permanent: false,
          },
      }
  }
  var data = await getData(session.user.token, pictureId);
  if (data) {
    return {
      props: {
        session,
        picture: data
      }
    };
  } else {
    return {
      props: {
        session,
        picture: null
      },
    };
  }

}

async function getData(token, id) {
  try {
    const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL : ""}/v1/api/picture/${id}`;
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
    console.error('ERROR FOTO', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

const FotoPage = ({picture}) => {
  const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL : ""}`
  const searchParams = useSearchParams();

  const camera = {
    id: searchParams.get("cameraId"),
    name: searchParams.get("cameraId"),
    pictureId: searchParams.get("pictureId"),
  };

  const cameraName = `${camera.id} - ${camera.name}`;

  console.log(picture);

  return (
    <>
      <Breadcrumb pageName={cameraName} description="" />

      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">
            <div className="w-full px-6 lg:max-w-none">
              {/* Foto Start --->*/}
              <Image
                src={`${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL: ""}/v1/media/${picture.media_url}`}
                alt={`${picture.id}`}
                width={100}
                height={25}
                className="w-full"
                unoptimized={true}
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
              href={`/camera?id=${camera.id}`}
              className="rounded-md bg-rojoinstitucional px-8 py-3 text-center text-base font-bold text-white shadow-signUp duration-300 hover:bg-white hover:text-primary md:px-9 lg:px-8 xl:px-9"
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