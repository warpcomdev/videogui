import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import fetchJson from "../lib/fetchJson";
import Breadcrumb from "../components/Common/Breadcrumb";
import { getSession, useSession } from "next-auth/react"

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Datepicker from "react-tailwindcss-datepicker";

import "../styles/Camara.module.css";


export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  var data = await getData(session.user.token, id);
  var pictureData = await getPictureData(session.user.token, id);
  var videoData = await getVideoData(session.user.token, id);
  console.error('ERROR VIDEO DATA', videoData);
  if (data && pictureData && videoData) {
    return {
      props: {
        session,
        camera: data,
        picture: pictureData['data'][0],
        video: videoData && videoData['data'] && videoData['data'].length > 0 ? videoData['data'][0] : null,
      }
    };
  } else {
    return {
      props: {
        session,
        camera: null,
        picture: null,
        video: null
      },
    };
  }

}

/**
 * Función para obtener los datos de las cámaras
 */
async function getData(token, id) {
  try {
    console.log('ID', id);
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + `/v1/api/camera/${id}`;
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
    console.error('ERROR CAMERA', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

/**
 * Función para obtener los datos de la última foto
 */
async function getPictureData(token, id) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL
      + `/v1/api/picture?sort=timestamp&ascending=false&limit=1&q:camera:eq=${id}`;
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
    console.error('ERROR CAMERA', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

async function getVideoData(token, id) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL
      + `/v1/api/video?sort=timestamp&ascending=false&limit=1&q:camera:eq=${id}`;
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
    console.error('ERROR VIDEO DATA', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



/**
 * Página Camara
 */
const CamaraPage = ({ camera, picture, video }) => {
  const nombreCamara = `${camera.id} - ${camera.name}`;
  const [search, setSearch] = useState('');
  const [dateValue, setDateValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });

  const OpenStreetMap = dynamic(
    () => import("../components/Map/OpenStreetMap"),
    {
      ssr: false,
    }
  );

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: session } = useSession();

  /**
   * Videos
   */
  const [currentVideoPage, setCurrentVideoPage] = useState('limit=10&offset=0');
  const [nextVideoPage, setNextVideoPage] = useState('');
  const [prevVideoPage, setPrevVideoPage] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoPage]);

  const fetchVideos = async () => {
    try {
      console.log('CAMERa', camera.id);
      const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/video?q-camera-eq=${camera.id}&${currentVideoPage}`;
      const res = await fetchJson(urlData, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.user.token,
        },
      });

      if (!res || res.error) {
        throw new Error("Ocurrió un error al extraer los datos");
      }
      console.log('RES', res);
      setVideos(res.data);
      setNextVideoPage(res.next.replace(`&q-camera-eq=${camera.id}`, ""));
      setPrevVideoPage(res.prev.replace(`&q-camera-eq=${camera.id}`, ""));
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  /**
   * Fotos
   */

  const [currentPage, setCurrentPage] = useState('limit=10&offset=0');
  const [nextPage, setNextPage] = useState('');
  const [prevPage, setPrevPage] = useState('');
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    console.log('CURRENT PICTURE PAGE', currentPage);
    fetchPictures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchPictures = async () => {
    try {
      const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/picture?q-camera-eq=${camera.id}&${currentPage}`;
      const res = await fetchJson(urlData, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.user.token,
        },
      });

      if (!res || res.error) {
        throw new Error("Ocurrió un error al extraer los datos");
      }
      setPictures(res.data);
      setNextPage(res.next.replace(`&q-camera-eq=${camera.id}`, ""));
      setPrevPage(res.prev.replace(`&q-camera-eq=${camera.id}`, ""));
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    let arraySearch = search.split(' ');
    let convertedString = arraySearch.map(item => '&q-tags-eq=' + encodeURIComponent(item)).join('');
    setCurrentVideoPage(`limit=10&offset=0${convertedString}`);
    setCurrentPage(`limit=10&offset=0${convertedString}`);
  };

  const handleDateValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setDateValue(newValue);
  }


  return (
    <>
      <Breadcrumb pageName={nombreCamara} description="" />

      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-2 flex flex-wrap items-center">

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
                <div mb-12>
                  <form>
                    <div className="mb-3">
                      <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                        Id
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
                  {video && video.media_url && video.media_url.endsWith('.avi') &&
                    <a className="flex items-center justify-center
                    rounded-md bg-rojoinstitucional px-9 py-4 text-xl font-medium
                    text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      href={`${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL : ""}/v1/media/${video.media_url}`} download>Descargar el último video</a>
                  }
                  {video && video.media_url && !video.media_url.endsWith('.avi') &&
                    <Link
                      href={{
                        pathname: '/video',
                        query: {
                          cameraId: camera.id,
                          cameraName: camera.name,
                          videoId: video && video.id ? video.id : null
                        }
                      }}
                    >
                      <a
                        className="flex items-center justify-center
            rounded-md bg-rojoinstitucional px-9 py-4 text-xl font-medium
            text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                      >
                        Accede al último video
                      </a>
                    </Link>
                  }
                </div>

                <div className="mb-2 items-center justify-center">
                  <Link
                    className="flex items-center justify-center
                  rounded-md bg-rojoinstitucional px-9 py-4 text-xl font-medium text-white
                  transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    href={{
                      pathname: '/photo',
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
                  <div className="mr-4">
                    <Datepicker
                    value={value}
                    onChange={handleDateValueChange}
                    /> 
                  </div>
                  <div className="mx-[-12px] flex flex-wrap items-center justify-center">
                    <input
                      type="search"
                      class="border-neutral-300 text-neutral-700 focus:text-neutral-700
                    dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200
                    relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid
                    bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal
                    leading-[1.6] outline-none transition duration-200 ease-in-out focus:z-[3]
                    focus:border-rojoinstitucional focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)]
                    focus:outline-none dark:focus:border-rojoinstitucional"
                      placeholder="Explora todos los archivos"
                      aria-label="Search"
                      aria-describedby="button-addon1"
                      onChange={(e) => handleSearch(e.target.value)}
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
                      onClick={handleSearchSubmit}
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
                <div>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Videos" {...a11yProps(0)} />
                        <Tab label="Fotografías" {...a11yProps(1)} />
                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap">
                          <div className="w-full px-4">
                            <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]" data-wow-delay=".15s">
                              <div className="overflow-x-auto min-w-[600px] sm:min-w-[0]">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Video
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cámara
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Etiquetas
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {videos.map((video, index) => (
                                      <tr key={video.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {video && video.media_url && video.media_url.endsWith('.avi') &&
                                            <a href={`${process.env.NEXT_PUBLIC_VIDEOAPI_URL ? process.env.NEXT_PUBLIC_VIDEOAPI_URL : ""}/v1/media/${video.media_url}`} download><div className="text-sm text-gray-900">{video.id}</div></a>
                                          }
                                          {video && video.media_url && !video.media_url.endsWith('.avi') &&
                                            <Link
                                              href={{
                                                pathname: '/video',
                                                query: {
                                                  cameraId: camera.id,
                                                  cameraName: camera.name,
                                                  videoId: video && video.id ? video.id : null
                                                }
                                              }}
                                            >
                                              <div className="text-sm text-gray-900">{video.id}</div>
                                            </Link>
                                          }
                                          {video && !video.media_url &&
                                            <div className="text-sm text-gray-900">{video.id}</div>
                                          }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">{video.camera}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">{video.timestamp}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {video.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="mr-1">{tag}</span>
                                          ))}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex justify-end mt-4">
                                <button
                                  onClick={() => setCurrentVideoPage(prevVideoPage)}
                                  className={`px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${prevVideoPage === "" && "opacity-50 cursor-not-allowed"}`}
                                  disabled={prevVideoPage === ""}
                                >
                                  Anterior
                                </button>
                                <button
                                  onClick={() => setCurrentVideoPage(nextVideoPage)}
                                  className={`ml-2 px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${nextVideoPage === "" && "opacity-50 cursor-not-allowed"}`}
                                  disabled={nextVideoPage === ""}
                                >
                                  Siguiente
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap">
                          <div className="w-full px-4">
                            <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]" data-wow-delay=".15s">
                              <div className="overflow-x-auto min-w-[600px] sm:min-w-[0]">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fotografía
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cámara
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                      </th>
                                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Etiquetas
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {pictures.map((picture, index) => (
                                      <tr key={picture.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <Link
                                            href={{
                                              pathname: '/photo',
                                              query: {
                                                cameraId: camera.id,
                                                cameraName: camera.name,
                                                pictureId: picture.id
                                              }
                                            }}
                                          >
                                            <div className="text-sm text-gray-900">{picture.id}</div>
                                          </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">{picture.camera}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-sm text-gray-900">{picture.timestamp}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {picture.tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="mr-1">{tag}</span>
                                          ))}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="flex justify-end mt-4">
                                <button
                                  onClick={() => setCurrentPage(prevPage)}
                                  className={`px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${prevPage === "" && "opacity-50 cursor-not-allowed"}`}
                                  disabled={prevPage === ""}
                                >
                                  Anterior
                                </button>
                                <button
                                  onClick={() => setCurrentPage(nextPage)}
                                  className={`ml-2 px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${nextPage === "" && "opacity-50 cursor-not-allowed"}`}
                                  disabled={nextPage === ""}
                                >
                                  Siguiente
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CustomTabPanel>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CamaraPage;