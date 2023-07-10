import React from 'react'
import Breadcrumb from "../components/Common/Breadcrumb";

const ConfigPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Configuración Avanzada"
        description=""
      />
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="flex flex-wrap justify-center items-center">
            <div className="w-full px-6 lg:max-w-none">
              <h2 className="text-center text-2xl mb-6">Acceso Remoto</h2>
              <div className="mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex justify-center">
                  <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Cámara 360 Finca La Cocosa
                  </button>
                </div>
                <div className="flex justify-center">
                  <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Cámara 360 Finca Tamurejo
                  </button>
                </div>
                <div className="flex justify-center">
                  <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Cámara Deep Sky Telescopio
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full px-6 py-6 lg:max-w-none">
    <h2 className="text-2xl mb-6">Administración</h2>
    <div className="mx-auto mt-5 grid grid-cols-1 gap-4">
        <div>
            <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                Consulta y modificación de directorios de captura automática
            </button>
        </div>
        <div>
            <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                Subida manual de vídeos y fotografías
            </button>
        </div>
        <div>
            <button className="rounded-md bg-rojoinstitucional px-2 py-1 text-sm font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                Clasificación, etiquetado y eliminado de vídeos y fotografías
            </button>
        </div>
    </div>
</div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigPage;
