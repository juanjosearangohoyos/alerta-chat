# ALERTA CHAT

Simulación educativa para que personas mayores de 60 años practiquen cómo reconocer mensajes sospechosos en
WhatsApp, Messenger de Facebook y mensajes de texto (SMS). Proyecto final de Ciberculturas, Pontificia Universidad
Javeriana Cali.

> Es una simulación: no envía dinero, no tiene campos para escribir datos, los enlaces no abren páginas externas y no
> envía información a ningún servidor.

## Cómo abrirlo (primera vez)

1. Instale **Node.js** (versión 18 o superior) desde <https://nodejs.org>.
2. Abra una terminal en esta carpeta (`ALERTA CHAT`).
3. Instale lo necesario (solo la primera vez):

```bash
npm install
```

4. Inicie la experiencia:

```bash
npm run dev
```

5. Abra en el navegador la dirección que aparece en la terminal, normalmente <http://localhost:5173>.

Para detenerla, presione `Ctrl + C` en la terminal.

## Versión final (para presentar o publicar)

```bash
npm run build
```

Esto revisa las historias y crea la carpeta `dist/`. Para verla en el computador:

```bash
npm run preview
```

La carpeta `dist/` también se puede subir a un servicio de páginas estáticas (por ejemplo GitHub Pages o Netlify).
Las instrucciones para publicarla y abrirla desde otro computador o celular están en [docs/PUBLICAR.md](docs/PUBLICAR.md).

## Pruebas

```bash
npm test
```

Comprueba que el lector de audio divida bien las oraciones y elija una voz en español, que las tres historias terminen, que cada decisión tenga 2 o 3 opciones y al menos una segura, que todos los
resultados tengan los botones finales y que los diálogos no tengan nombres ni parentescos.

## Dónde está cada cosa

| Carpeta | Contenido |
|---|---|
| `src/story/` | **El guion.** Un archivo por historia (`whatsapp.js`, `messenger.js`, `sms.js`). Para corregir un texto se edita aquí. |
| `src/engine/` | Motor narrativo compartido por las tres historias. |
| `src/ui/` y `src/styles/` | Pantallas y apariencia (Android, iPhone y versión sencilla). |
| `docs/` | Análisis, mapa de las historias y registro de decisiones. |
| `REFERENCIAS/` | Documento académico y capturas de referencia. |
| `RESPALDO/` | Copia de seguridad comprimida del proyecto. |
