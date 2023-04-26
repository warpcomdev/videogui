import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import "@/src/styles/Camara.module.css";

import { Fragment, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

/* const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);
 */
const CamaraSectionOne = () => {
  /*   const List = ({ text }) => (
    <p className="mb-5 flex items-center text-lg font-medium text-body-color">
      <span className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
        {checkIcon}
      </span>
      {text}
    </p>
  ); */

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <section id="camara1" className="pt-16 md:pt-20 lg:pt-28">
      <div className="container">
        <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-6 lg:w-1/2">
              <div className="containerInLine">
                <div className="mb-2">
                  <button
                    className="derecho con_medidas flex w-full items-center justify-center rounded-md bg-yellow py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    onClick={handleOpen}
                  >
                    Acceder al último video
                  </button>
                </div>

                <div className="mb-2">
                  <button className="con_medidas flex justify-center rounded-md bg-yellow py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    Acceder a la última foto
                  </button>
                </div>
              </div>

              {/*  <div
                className="wow fadeInUp mb-12 max-w-[570px] lg:mb-0"
                data-wow-delay=".15s"
              >
                <div className="mx-[-12px] flex flex-wrap">
                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Premium quality" />
                    <List text="Tailwind CSS" />
                    <List text="Use for lifetime" />
                  </div>

                  <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                    <List text="Next.js" />
                    <List text="Rich documentation" />
                    <List text="Developer friendly" />
                  </div>
                </div>
              </div> */}
            </div>

            <div className="w-full px-4 lg:w-1/2">
              {/*      <div
                className="wow fadeInUp relative mx-auto aspect-[25/24] max-w-[500px] lg:mr-0"
                data-wow-delay=".2s"
              >
                <Image
                  src="/images/about/about-image.svg"
                  alt="about-image"
                  fill
                  className="mx-auto max-w-full lg:mr-0"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* ventana dialogo para mostrar imagen */}
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Última foto</DialogHeader>
        <DialogBody divider>
        <Image
                    src="/images/video/pexels-pixabay-2150.jpg"
                    alt="logo"
                    width={400}
                    height={400}
                    className="dark:hidden"
                  />
        </DialogBody>
        <DialogFooter>
{/*           <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cerrar</span>
          </Button> */}
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
};

export default CamaraSectionOne;
