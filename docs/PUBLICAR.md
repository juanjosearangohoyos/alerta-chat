# Cómo publicar y abrir ALERTA CHAT

La versión lista para presentar está en la carpeta **`dist/`**. Se genera con `npm run build`. Es un sitio estático: no necesita servidor propio ni base de datos.

> `dist/index.html` **no funciona con doble clic** (abriéndolo como archivo). Debe abrirse desde una dirección web, con cualquiera de estas opciones.

## Opción 1 · Enlace de Claude (ya publicado)
<https://claude.ai/artifact/EMYAErnMG4ffmL2qy8aAGH>

- Es privado: se abre con la cuenta de Claude de quien lo publicó, en el computador o en el celular.
- Para que otra persona lo vea, use el menú **Compartir** de la página.

## Opción 2 · Enlace público gratuito (Netlify Drop)
1. Ejecute `npm run build`.
2. Entre a <https://app.netlify.com/drop> e inicie sesión. Puede crear la cuenta con GitHub o con un correo.
3. Arrastre la carpeta **`dist`** a la página.
4. Copie la dirección que aparece (termina en `.netlify.app`). Se abre en cualquier computador o celular.

## Opción 3 · Sin internet, en la misma red Wi-Fi (para la presentación)
1. En el computador, dentro de la carpeta del proyecto:
   ```bash
   npm run build
   npm run preview -- --host
   ```
2. La terminal muestra una línea `Network: http://192.168.x.x:4173`.
3. En el celular, conectado a la **misma red Wi-Fi**, abra esa dirección en el navegador.
4. Si no carga, permita el acceso en el aviso del Firewall de Windows.

## Opción 4 · GitHub Pages (preparado, aún no publicado)
La configuración ya está lista; falta que alguien del equipo suba el proyecto. No se ha creado ningún repositorio ni se ha hecho `git push`.

- `vite.config.js` usa `base: './'` (rutas relativas): funciona con cualquier nombre de repositorio, sin editar nada.
- `.github/workflows/pages.yml` compila con `npm run build` (incluye las pruebas) y publica `dist/`.
- `.gitignore` deja fuera `node_modules`, `dist`, `RESPALDO`, `.claude` y `REFERENCIAS` (tiene capturas con datos de personas reales).

Pasos (los hace una persona del equipo):
1. En GitHub, cree un repositorio nuevo (vacío, sin README).
2. En la carpeta del proyecto: `git init`, `git add .`, `git commit -m "ALERTA CHAT"`, `git branch -M main`, `git remote add origin <dirección-del-repositorio>`, `git push -u origin main`.
3. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
4. Espere a que termine la pestaña **Actions**. La página queda en `https://<usuario>.github.io/<repositorio>/`.

## Audio y enlaces oficiales
- La lectura en voz alta usa la voz instalada en el dispositivo (no hay archivos de audio ni servicios externos). Si el dispositivo no tiene voz en español, el botón se desactiva y el texto sigue siendo legible.
- Los tres enlaces de la Policía Nacional abren en una pestaña nueva y requieren internet.
