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
        alerts: data['data']
      },
    }
  } else {
    return {
      props: {
        session,
        alerts: null
      },
    }
  }

}

async function getData(token) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/v1/api/alert";
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
    if (!error.message.includes('Unauthorized')) {
      console.log("ERROR", error);
      throw new Error("Ocurrio un error al extraer los datos");
    }

  }
}

const AlertPage = (alerts) => {
  const { data: session } = useSession()
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5); // Ajusta este número según lo que necesites

  const totalAlerts = alerts.alerts || []; // Se comprueba si alerts['alerts']['alerts'] está definido, si no lo está se asigna un array vacío

  // Calcular los items para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Comprueba si totalAlerts es un array vacío antes de usar slice
  const currentItems = totalAlerts.length > 0 ? totalAlerts.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(totalAlerts.length / itemsPerPage); // Calcular el número total de páginas

  const handleAcknowledge = (id) => {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + `/v1/api/alert/${id}`;
    fetch(urlData, {
      method: 'PUT',
      headers: {
        Accept: '*/*',
        'Authorization': 'Bearer ' + session.user.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ acknowledged_at: currentDate })
    })
      .then(response => {
        if (response.status === 204) {
          window.location.reload();
        } else {
          return response.json();
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleResolve = (id) => {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + `/v1/api/alert/${id}`;
    fetch(urlData, {
      method: 'PUT',
      headers: {
        Accept: '*/*',
        'Authorization': 'Bearer ' + session.user.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resolved_at: currentDate })
    })
      .then(response => {
        if (response.status === 204) {
          window.location.reload();
        } else {
          return response.json();
        }
      })
      .catch((error) => console.error('Error:', error));
  };
  return (
    <>
      <Breadcrumb pageName="Alertas" description="" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap">
          <div className="w-full px-4">
            <div className="wow fadeInUp mb-12 rounded-md bg-primary/[3%] py-11 px-8 dark:bg-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]" data-wow-delay=".15s">
              <div className="overflow-x-auto min-w-[600px] sm:min-w-[0]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cámara
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Id Alerta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conocida
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resuelta
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((alert) => (
                      <tr key={alert.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{alert.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{alert.camera}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alert.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alert.severity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{alert.message}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {alert.acknowledged_at === null ? (
                            <button
                              className="px-4 py-2 bg-yellow rounded"
                              onClick={() => handleAcknowledge(alert.id)}
                            >
                              Reconocer
                            </button>
                          ) : (
                            <div className="text-sm text-gray-500">{alert.acknowledged_at}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {alert.resolved_at === null ? (
                            <button className="px-4 py-2 bg-yellow rounded">Resolver</button>
                          ) : (
                            <div className="text-sm text-gray-500">{alert.resolved_at}</div>
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

export default AlertPage;
