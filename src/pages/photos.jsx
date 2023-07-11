import Breadcrumb from "../components/Common/Breadcrumb";
import React, { useState } from 'react';
import { useSession, getSession, signOut } from "next-auth/react"
import fetchJson from "../lib/fetchJson";

const currentDate = new Date().toISOString();

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
  var data = await getData(session.user.token);
  if (data) {
    return {
      props: {
        session,
        pictures: data['data']
      },
    }
  } else {
    return {
      props: {
        session,
        pictures: null
      },
    }
  }

}

/**
 * Función para obtener los datos de las cámaras
 */
async function getData(token) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/v1/api/picture";
    const res = await fetchJson(urlData, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (!res || res.error) {
      throw new Error("Ocurrio un error al extraer los datos");
    }

    return res;
  } catch (error) {
    if (!error.message.includes('Unauthorized')) {
      console.log("ERROR", error);
      throw new Error("Ocurrio un error al extraer los datos");
    }

  }
}

const ListPhotosPage = ({ pictures }) => {
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5);

  const totalPictures = pictures || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalPictures.length > 0 ? totalPictures.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(totalPictures.length / itemsPerPage);

  const [editableValues, setEditableValues] = useState(currentItems.map(picture => ({
    id: picture.id,
    isEditing: false,
    value: picture.tags,
  })));

  const handleEditing = (id) => {
    setEditableValues(editableValues.map(ev => ev.id === id ? { ...ev, isEditing: true } : ev));
  };

  const handleChange = (id, newValue) => {
    setEditableValues(editableValues.map(ev => ev.id === id ? { ...ev, value: newValue } : ev));
  };

  const handleBlur = async (id) => {
    setEditableValues(editableValues.map(ev => ev.id === id ? { ...ev, isEditing: false } : ev));
    const newTags = editableValues.find(ev => ev.id === id).value;
    const tagsArray = newTags.split(' ').map(tag => tag.trim());

    try {
      const urlData = `${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/picture/${id}`;
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
      <Breadcrumb pageName="Consulta y modificación de directorios de captura automática" description="" />

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
                    {currentItems.map((picture, index) => (
                      <tr key={picture.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{picture.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{picture.camera}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{picture.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editableValues[index]?.isEditing ? (
                            <input
                              value={editableValues[index]?.value}
                              onChange={(e) => handleChange(picture.id, e.target.value)}
                              onBlur={() => handleBlur(picture.id)}
                              className="text-sm text-gray-500"
                            />
                          ) : (
                            <div onClick={() => handleEditing(picture.id)} className="text-sm text-gray-500">
                              {picture.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="mr-1">{tag}</span>
                                ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`ml-2 px-6 py-2 border border-gray-300 text-sm text-black font-medium rounded-md 
                  ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
                  disabled={currentPage === totalPages}
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
