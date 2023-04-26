# Video GUI

### ✨ Características
- Next.js 13
- Tailwind CSS
- iron-session
- Temas Dark and Light
- OpenStreetMap

### ⚡ Deploy Now
Para producción se debe de definir las variables de entorno
- NODE_ENV= 'production'
- SECRET_COOKIE_PASSWORD= 'valor cookie'
- NEXT_PUBLIC_VIDEOAPI_URL= 'ruta de las API´s de video'

En desarrollo se utiliza
- NEXT_PUBLIC_VIDEOAPI_URL='http://localhost:8080'
- SECRET_COOKIE_PASSWORD='Z7d7brH2J6tSgyVgJHfSKYfVZqpgN7'

Las variables de entorno para que puedan ser visibles en nextjs fuera del entorno de nodejs deben de llevar el prefijo NEXT_PUBLIC_

Nombre de la cookieName: 'videogui-iron-session'

### Ejecución con docker-compose
Se utiliza el archivo Dockerfile con optimización para que la imagen tenga solo los elementos necesarios y reducir el tamaño.

.dockerignore

Este repositorio incluye los ficheros 
- [docker-compose.yaml](docker-compose.yaml)
- [.dockerignore](.dockerignore)
- [Dockerfile](Dockerfile)

con la especificación adecuada para poder levantar localmente una instancia de esta WEB App, escuchando en el puerto **3003**.

Paran lanzar la instancia, se deben ejecutar estos pasos desde el directorio donde se haya clonado el repositorio:

```
# reconstruir las imágenes docker del servicio
docker-compose build

# Levantar la imagen
docker-compose up

````