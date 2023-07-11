import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession, getSession } from "next-auth/react"
import fetchJson from "../lib/fetchJson";

import Breadcrumb from "../components/Common/Breadcrumb";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else {
    return {
      props: {
        session,
      },
    }
  }

}

const UploadMediaPage = () => {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    id: '',
    timestamp: '',
    camera: '',
    tags: ['']
  });

  let cameras = null;
  let opcionesCameras = [];
  if (session) {
    cameras = session.user.cameras['data'];
    opcionesCameras = cameras.map((camera) => ({
      value: camera.id,
      label: camera.name
    }));
  }
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagsChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleFileDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: [
      'image/png',
      'image/jpeg',
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
    ],
    onDrop: handleFileDrop
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Generar el timestamp actual en formato ISO8601
    const timestamp = new Date().toISOString();

    // Crear el ID utilizando la unión de camera + timestamp
    const id = formData.camera + '-' + timestamp;

    // Crear el objeto de datos para enviar en la solicitud
    const data = {
      id,
      timestamp,
      camera: formData.camera,
      tags: formData.tags
    };

    try {
      if (file) {
          var typeFile = 'video'
          if ( file.type.includes('image')){
            typeFile = 'picture'
          }
          const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/v1/api/" + typeFile;
          const res = await fetchJson(urlData, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + session.user.token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          console.log('RES', res);

          if (res.id) {
            console.log('res ok');
            const fileData = new FormData();
            fileData.append('file', file, file.name);
            const fileRes = await fetch(`${process.env.NEXT_PUBLIC_VIDEOAPI_URL}/v1/api/${typeFile}/${data.id}`, {
              method: 'POST',
              headers: { 
                'Accept': 'application/json',
                'Authorization': `Bearer ${session.user.token}` },
              body: fileData
            })

            if (fileRes.ok) {
              setFormData({
                id: '',
                timestamp: '',
                camera: '',
                tags: ['']
              });
              setFile(null);
            }

          }
        }
    } catch (error) {
      console.error(error); // Manejar el error si ocurre
    }
  };

  return (
    <>
      <Breadcrumb
        pageName="Subir archivo"
        description=""
      />

      <div className="container">
        <div className="container mx-auto p-4">
          <form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="file" className="block font-medium mb-1">
                Archivo (Imagen/Video):
              </label>
              <div
                {...getRootProps()}
                className="border border-gray-300 px-3 py-2 rounded-md cursor-pointer"
              >
                <input {...getInputProps()} />
                {file ? (
                  <p>Archivo seleccionado: {file.name}</p>
                ) : (
                  <p>Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="camera" className="block font-medium mb-1">
                Camara:
              </label>
              <select
                id="camera"
                name="camera"
                value={formData.camera}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              >
                <option value="">Seleccione una cámara</option>
                {opcionesCameras.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="tags" className="block font-medium mb-1">
                Tags:
              </label>
              {formData.tags.map((tag, index) => (
                <input
                  key={index}
                  type="text"
                  name="tags"
                  value={tag}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md mb-2"
                />
              ))}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-md"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadMediaPage;
