import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/router";

const Signin = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
  });

  // mensaje error
  const [botonSubmit, setBotonSubmit] = useState(false);

  // evento submit
  const onSubmit = async (data) => {
    // Sign in 
    const result = await signIn('credentials', { 
      redirect: true,
      callbackUrl: "/dashboard",
      id: data.username, 
      password: data.password 
    });

    if(result.error){
      setError("root.random", {
        type: "random",
        message: result.error,
      });
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-primary bg-opacity-5 px-6 py-10 dark:bg-dark sm:p-[60px]">
                {/* Titulo inicio sesión y Logo Diputación Badajoz*/}
                <div
                  className="borderBottomRojo
                  mx-auto
                  mt-10
                  grid
                  max-w-lg
                  grid-cols-2
                  items-center gap-x-5
                  gap-y-10 sm:max-w-xl sm:grid-cols-2
                  sm:gap-x-5 lg:mx-0 lg:max-w-none
                  lg:grid-cols-2"
                >
                  <div>
                    {/* Titulo inicio sesión>*/}
                    <h3 className="sm:text-3x3 mb-3 inline-block w-full text-left text-2xl font-bold text-black dark:text-white">
                      Iniciar sesión
                    </h3>
                  </div>

                  {/* Logo Diputación Badajoz*/}
                  <Image
                    src="/images/logo/escudo_2016_ancho.svg"
                    alt="logo"
                    width={100}
                    height={25}
                    className="w-full dark:hidden"
                  />
                  <Image
                    src="/images/logo/escudo_2016_anch_Bco.svg"
                    alt="logo"
                    width={100}
                    height={25}
                    className="hidden w-full dark:block"
                  />
                </div>

                {/* Mensaje de error */}

                <ErrorMessage
                  errors={errors}
                  name="root.random"
                  render={({ message }) => (
                    <p
                      className="text-red mb-3 block 
                    bg-yellow text-center text-sm font-medium text-dark dark:text-white"
                    >
                      {" "}
                      <br />
                      {message}
                      <br />
                      <br />
                    </p>
                  )}
                />

                {/* Form login */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-8">
                    <label
                      htmlFor="UserName"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Usuario
                    </label>
                    <input
                      id="username"
                      name="username"
                      placeholder="Escriba su usuario"
                      className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      {...register("username")}
                      // onChange={(e) => setUsername(e.target.value)}
                      // value={username}
                      required={true}
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm font-medium text-dark dark:text-white"
                    >
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Escriba su contraseña"
                      className="w-full rounded-md border border-transparent px-6 py-3 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none dark:bg-[#242B51] dark:shadow-signUp"
                      {...register("password")}
                      // onChange={handleChange}
                      // onChange={(e) => setPassword(e.target.value)}
                      // value={password}
                      required={true}
                    />
                  </div>
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center
                    rounded-md bg-rojoinstitucional px-9 py-4 text-base font-medium
                    text-white transition duration-300 ease-in-out hover:bg-opacity-80
                    hover:shadow-signUp"
                      disabled={botonSubmit}
                    >
                      Acceder
                    </button>
                  </div>
                </form>
                {/* texto EUR italic*/}
                <p className="text-center text-base font-medium text-body-color">
                  Fondo Europeo de Desarrollo Regional
                </p>
                <p className="text-center text-base font-medium italic text-body-color">
                  &quot;Una manera de hacer Europa&quot;
                </p>

                {/* logos intitucionales */}
                <div
                  className="mx-auto
                  mt-10
                  grid
                  max-w-lg
                  grid-cols-7
                  items-center gap-x-1
                  gap-y-10 sm:max-w-xl sm:grid-cols-7
                  sm:gap-x-1 lg:mx-0 lg:max-w-none
                  lg:grid-cols-7"
                >
                  {/* logo ministerio inline-flex imagenInline*/}
                  <Image
                    src="/images/logo/ministerio3.svg"
                    alt="logo"
                    width={120}
                    height={10}
                    className="col-span-3"
                  />

                  {/* logo Red.Es */}
                  <Image
                    src="/images/logo/red_es.svg"
                    alt="logo"
                    width={70}
                    height={10}
                    className="dark:hidden"
                  />
                  <Image
                    src="/images/logo/red_es_bco.svg"
                    alt="logo"
                    width={70}
                    height={10}
                    className="hidden dark:block"
                  />

                  {/* logo Diputación Badajoz */}
                  <Image
                    src="/images/logo/escudo_2016_ancho.svg"
                    alt="logo"
                    width={100}
                    height={10}
                    className="col-span-2 dark:hidden"
                    priority
                  />
                  <Image
                    src="/images/logo/escudo_2016_anch_Bco.svg"
                    alt="logo"
                    width={100}
                    height={10}
                    className="col-span-2 hidden dark:block"
                    priority
                  />

                  {/* logo Unión Europea */}
                  <Image
                    src="/images/logo/ue-union-europea.svg"
                    alt="logo"
                    width={70}
                    height={10}
                    className="imagenInline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
