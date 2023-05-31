import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { sessionOptions } from "../lib/session";
import fetchJson from "../lib/fetchJson";
import useUser from "../lib/useUser";
import Breadcrumb from "../components/Common/Breadcrumb";

import "../styles/Camara.module.css";
import { Button } from "@material-tailwind/react";

/**
 * Función para obtener los datos de las cámaras
 */
async function getData(token, id) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + `/api/camera/${id}`;
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
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

/**
 * Función para obtener los datos de la última foto
 */
async function getPictureData(token, id) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL 
    + `/api/picture?sort=timestamp&ascending=false&limit=1&q:camera:eq=${id}`;
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
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

/**
 * Página Camara
 */
const CamaraPage = ({ camera, picture }) => {
  // Si el usuario no esta en sessión redirecciona al login
  const { user } = useUser({
    redirectTo: "/",
  });

  const nombreCamara = `${camera.id} - ${camera.name}`;

  console.log(picture);

  const OpenStreetMap = dynamic(
    () => import("../components/Map/OpenStreetMap"),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Breadcrumb pageName={nombreCamara} description="" />

      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">
            <div className="w-full px-6 lg:max-w-none">
              {/* botones acceso último video - foto Start --->*/}
              <div
                class="sm:grid-cols
                  mx-auto
                  mt-5
                  grid
                  max-w-lg
                  grid-cols-4
                  items-center
                  gap-x-1
                  gap-y-10
                  sm:max-w-xl sm:gap-x-1
                  lg:mx-0 lg:max-w-none lg:grid-cols-4"
              >
                <div className="ocultar-div"></div>
                <div className="mb-2 items-center justify-center">
                  <Link
                    className="flex items-center justify-center
                    rounded-md bg-rojoinstitucional px-9 py-4 text-xl font-medium
                    text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    href="/video"
                  >
                    Accede al último video
                  </Link>
                </div>

                <div className="mb-2 items-center justify-center">
                  <Link
                    className="flex items-center justify-center
                  rounded-md bg-rojoinstitucional px-9 py-4 text-xl font-medium text-white
                  transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                  href={{
                    pathname: '/foto',
                    query: {
                      cameraId: camera.id,
                      cameraName: camera.name,
                      pictureId: picture.id
                    }
                  }}
                  >
                    Accede a la última foto
                  </Link>
                </div>
              </div>
              {/* botones acceso último video - foto End --->*/}

              {/* Búsqueda Start --->*/}
              <div
                className="wow fadeInUp mb-12 w-full lg:mb-0 lg:max-w-none"
                data-wow-delay=".15s"
              >
                <div
                  className="mx-auto
                  mt-8
                  grid
                  max-w-lg
                  grid-cols-3
                  items-center gap-x-1
                  gap-y-10 sm:max-w-xl sm:grid-cols-2
                  sm:gap-x-1 lg:mx-0 lg:max-w-none
                  lg:grid-cols-3"
                >
                  <div></div>
                  <div className="mx-[-12px] flex flex-wrap items-center justify-center ">
                    <input
                      type="search"
                      class="border-neutral-300 text-neutral-700 focus:text-neutral-700
                    dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200
                    relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid
                    bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal
                    leading-[1.6] outline-none transition duration-200 ease-in-out focus:z-[3]
                    focus:border-rojoinstitucional focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)]
                    focus:outline-none dark:focus:border-rojoinstitucional"
                      placeholder="Explora todos los videos y fotografías"
                      aria-label="Search"
                      aria-describedby="button-addon1"
                    />

                    {/* <!--Search button--> */}
                    <button
                      class="relative z-[2] flex
                    items-center rounded-r bg-rojoinstitucional px-6 py-2.5 text-xs
                    font-medium uppercase leading-tight text-white shadow-md transition
                    duration-150 ease-in-out hover:bg-rojoinstitucional10 hover:shadow-lg focus:bg-rojoinstitucional 
                    focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rojoinstitucional active:shadow-lg"
                      type="button"
                      id="button-addon1"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="h-5 w-5"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Búsqueda End --->*/}

            <div
              className="wow fadeInUp mb-12 w-full lg:mb-0 lg:max-w-none "
              data-wow-delay=".15s"
            >
              <div
                className="leaflet-container[40.505,
                  -100.09]
                  mx-auto
                  mt-8
                  grid
                  max-w-lg grid-cols-2
                  items-center gap-x-1 gap-y-10
                  sm:max-w-xl sm:grid-cols-1 sm:gap-x-1
                  lg:mx-0
                  lg:max-w-none lg:grid-cols-2"
              >
                {/* Mapa camara Start --->*/}
                <div>
                  <OpenStreetMap camera={camera} />
                </div>
                {/* Mapa camara End --->*/}

                {/* Detalle camara Start --->*/}
                <div mb-5>
                  <h1>Información</h1>
                  <form>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Identificador
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.id}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Nombre
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.name}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Fecha de creación
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.created_at}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Fecha de actualización
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.created_at}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Latitud
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.latitude}
                      </label>
                    </div>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Longitud
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-2 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.longitude}
                      </label>
                    </div>
                    <div className="mb-6">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Ruta local
                      </label>
                      <label className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp">
                        {camera.local_path}
                      </label>
                    </div>
                  </form>
                </div>
                {/* Detalle camara End --->*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CamaraPage;

/**
 * Busca los datos en el servidor
 */
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    const user = req.session.user ?? null;
    const { id } = query;
    if (user && user.isLoggedIn) {
      var data = await getData(user.token, id);
      var pictureData = await getPictureData(user.token, id);
      return {
        props: {
          camera: data,
          picture: pictureData,
        },
      };
    } else {
      return {
        props: {
          camera: null,
          picture: null
        },
      };
    }
  },
  sessionOptions
);
