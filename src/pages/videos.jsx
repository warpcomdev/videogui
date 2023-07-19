import Breadcrumb from "../components/Common/Breadcrumb";
import React, { useState, useEffect } from 'react';
import { useSession, getSession, signOut } from "next-auth/react"
import fetchJson from "../lib/fetchJson";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session
    },
  }

}

const ListPhotosPage = () => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState('limit=10&offset=0');
  const [nextPage, setNextPage] = useState('');
  const [prevPage, setPrevPage] = useState('');
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchVideos = async () => {
    try {
      const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/video?${currentPage}`;
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
      const parametros = currentPage.split("&");
      const obj = {};
      parametros.forEach((parametro) => {
        const [clave, valor] = parametro.split("=");
        obj[clave] = valor;
      });
      setPage(Math.floor(obj['offset'] / 10) + 1)
      setVideos(res.data);
      setNextPage(res.next);
      setPrevPage(res.prev);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target
    const editData = videos.map((video) =>
      video.id === id && name ? { ...video, [name]: value } : video)
    setVideos(editData)
  }

  const handleSave = async (id) => {
    let newTags = [];

    videos
      .filter(video => video.id === id)
      .map(video => {
        newTags = newTags.concat(video.tags);
      });
    const tagsArray = newTags[0].split(',').map(tag => tag.trim());
    try {
      const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/video/${id}`;
      const res = await fetch(urlData, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + session.user.token,
        },
        body: JSON.stringify({ tags: tagsArray })
      });

      if (!res.ok) {
        throw new Error("Ocurrió un error al actualizar los datos");
      }

      // Si la respuesta es OK pero no contiene ningún cuerpo, puedes necesitar recargar la página.
      if (res.status === 204) {
        window.location.reload();
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Consulta y modificación de videos de captura automática" description="" />

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
                          <div className="text-sm text-gray-900">{video.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{video.camera}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{video.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative flex flex-grow items-stretch focus-within:z-10">
                            <input
                              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              name="tags"
                              type="text"
                              value={video.tags}
                              onChange={(e) => handleChange(e, video.id)}
                              placeholder="Type Position"
                            />
                            <button
                              onClick={() => handleSave(video.id)}
                              type="button"
                              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                              Guardar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">{page}</div>
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
    </>
  );
};

export default ListPhotosPage;