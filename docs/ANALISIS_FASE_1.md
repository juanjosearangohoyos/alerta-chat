# ALERTA CHAT — Análisis, mapa de historias y arquitectura (Fase 1)

> **Actualización 10 nov. 2026:** el equipo decidió que la experiencia empiece preguntando qué tipo de celular usa la persona
> (Android · iPhone · No estoy seguro). La decisión, el nuevo flujo y la arquitectura por variantes están en la **sección 8**,
> que reemplaza lo que se oponga en las secciones 2, 5 y 6.
>
> Documento de trabajo previo a la programación. Fuente única: carpeta `REFERENCIAS/`
> (documento «Primera Entrega - Proyecto Final.docx» con su Anexo A de 79 figuras, y 9 capturas de pantalla).
> No se ha escrito código de la experiencia. No se abrió ni modificó ningún otro proyecto.

---

## 0. Verificación del entorno

| Comprobación | Resultado |
|---|---|
| Carpeta de trabajo | `…/PROYECTO FINAL CIBERCULTURAS/ALERTA CHAT` |
| Contenido inicial | solo `REFERENCIAS/` (no hay código previo ni repositorio git) |
| Proyecto `nexus-os` | no se abrió, no se listó, no se tocó |
| Archivos creados | únicamente este documento (`docs/ANALISIS_FASE_1.md`) |

### Inventario de `REFERENCIAS/`

| Archivo | Qué es |
|---|---|
| `Primera Entrega - Proyecto Final.docx` | Documento académico (4 nov. 2026). Incluye wireframe en texto y **Anexo A**: 72 pantallas de prototipo de baja fidelidad (G01–G06, W…, M…, S…), 4 diagramas (D01–D04) y 3 storyboards (SB01–SB03). **Los «prototipos» están dentro del .docx, no como archivos sueltos.** |
| 7 capturas `3.31.29` … `3.37.29` | App **Mensajes de iPhone** (modo oscuro), mensajes «Mensaje de texto • SMS» reales de estafa (paquetería, puntos, operador). |
| Captura `3.45.13` | **Messenger en iPhone** (modo claro), conversación real. |
| Captura `3.59.57` | **WhatsApp en iPhone** (modo oscuro), chat consigo mismo. |

> No hay capturas de Android: **toda la referencia visual es iOS**.

---

## 1. Lo que dice el documento académico

### 1.1 Problemática
- Estafas, suplantación de identidad y robo de información por canales de comunicación cotidianos, con foco en **personas de 60 años o más en Cali**.
- Se entiende como un problema de **manipulación en la comunicación**: fotos de perfil robadas, urgencia, frases cotidianas («hola, cambié de número») para lograr transferencias o entrega de datos.
- Contexto: 73,9 % de hogares con internet (DANE, 2026); mayores de 55 sin conexión bajan de 65,7 % (2018) a 41,2 % (2024) (ANIF, 2025). **Tener acceso no implica saber usarlo con seguridad** (Hargittai y Dobransky, 2017). Policía Nacional (2026): bandas de extorsión con perfiles falsos cuyas víctimas eran mayoritariamente adultos mayores.

### 1.2 Objetivos (explícitos e implícitos en el texto)
1. Que la persona **viva un intento de estafa en un entorno seguro** («sandbox») que recrea la apariencia y el ritmo de su app de mensajería.
2. Que **tome decisiones** (responder, enviar dinero, llamar por la línea tradicional para verificar) y **vea las consecuencias de inmediato**.
3. Que reciba **consejos prácticos** y desarrolle el **hábito de dudar y verificar**…
4. …**sin generar miedo ni quitar autonomía** en el uso del celular.
5. Superar las campañas pasivas (folletos, charlas) que no reproducen el estrés de un mensaje urgente.

### 1.3 Conceptos (marco conceptual)
| Concepto | Autor(es) | Cómo aterriza en ALERTA CHAT |
|---|---|---|
| Brecha digital de segundo nivel | Hargittai (2002); Hargittai y Dobransky (2017) | Usar WhatsApp a diario no implica reconocer mensajes falsos. |
| Habilidades digitales | Vuorikari et al. (2022), DigComp 2.2 | Identificar situaciones sospechosas, verificar quién escribe, decidir con seguridad. |
| Ingeniería social | Krombholz et al. (2015); Mouton et al. (2016) | Familiar que pide dinero urgente; falsa entidad bancaria; miedo, preocupación o confianza. |
| Suplantación de identidad | FTC (2025) | Conversaciones falsas en WhatsApp, Messenger y SMS. |
| Alfabetización mediática | Livingstone (2004); UNESCO (2020) | No creer de inmediato; revisar, identificar engaños, pensar antes de compartir datos o dinero. |

### 1.4 Referentes y lo que aportan
| Referente | Aporte | Limitación que ALERTA CHAT resuelve |
|---|---|---|
| Phishing Quiz (Google Jigsaw) | Simular el engaño paso a paso y dar respuesta inmediata al error. | Centrado en correo de computador, no en chat de celular. |
| Bad News (Cambridge) | Aprender viviendo el engaño desde dentro. | Mucho texto rápido; complejo para baja experiencia digital. |
| CiberProtegidos (INCIBE) | Letras grandes, alto contraste. | Información pasiva, sin práctica. |

### 1.5 Requisitos extraídos
**Funcionales**
- RF1. Simulación de la pantalla de un teléfono inteligente.
- RF2. Al iniciar, elegir entre **WhatsApp, Facebook Messenger o Mensajes de iPhone**.
- RF3. Emular cada interfaz «de la manera más exacta y fiel posible».
- RF4. Narrativa ergódica: cada mensaje sospechoso exige una decisión que ramifica la historia.
- RF5. Tras cada decisión la experiencia **se pausa** y explica: si hubo error, **qué señales se ignoraron, sin regañar**; si hubo acierto, **refuerza** el comportamiento.
- RF6. (Prototipo) Botones `< ATRÁS` y `SALIR / AYUDA` en todas las pantallas; menú de ayuda G05 accesible desde cualquier punto.
- RF7. (Prototipo) Al final de cada caso: comparación de rutas, señales de alerta y principio práctico; repetir, cambiar de app o terminar.

**No funcionales**
- RNF1. Público mayor de 60 años con baja experiencia digital: lenguaje sencillo, letra grande, alto contraste.
- RNF2. Sin tiempo límite («No hay tiempo límite. Lee con calma», G01).
- RNF3. Seguridad: no se envía dinero real, no se piden datos reales (G01); enlaces ilustrativos que no funcionan; formularios como «ilustración estática».
- RNF4. Se puede equivocar y repetir cuantas veces quiera.
- RNF5. Prueba con adultos mayores de Cali (familiares y amigos del equipo) en la semana 2.

### 1.6 Cronograma del documento (14 días)
- Semana 1: guion de todos los caminos + pantallas fieles a WhatsApp, Messenger e iMessage.
- Semana 2: conectar nodos (interactividad), pruebas en Cali, dos días finales de corrección y entrega.

---

## 2. Sistema general de navegación (G01–G06)

```
G01 Bienvenida ─► G02 Cómo funciona ─► G03 Elige la aplicación ─► G04 Cómo decidir ─► W01 | M01 | S01
                                                                                   │
            G05 Ayuda y salida (desde cualquier pantalla): 1 seguir · 2 → G03 · 3 → G06
                                                                                   │
   W12 / M12 / S12:  1 repetir caso · 2 → G03 · 3 → G06      G06 Fin: 1 → G03 · 2 → G01
```

| Pantalla | Contenido clave |
|---|---|
| G01 | «Esto es una simulación educativa». Antes de empezar: no se envía dinero real; no necesitas datos reales; puedes equivocarte y repetir; no hay tiempo límite. Créditos: Ciberculturas · Javeriana Cali. |
| G02 | 5 pasos: recibes un mensaje → observas con calma quién escribe y qué pide → eliges entre 2 o 3 opciones → descubres qué pasa → repasas señales de alerta. |
| G03 | Elegir app. «Cada historia tiene entre 9 y 12 pantallas» (por recorrido). |
| G04 | Primeras decisiones: A/B/C. Segundas decisiones: 1/2. Explica ATRÁS y SALIR/AYUDA. |
| G05 | «Pausaste la práctica. Nada se perdió». Si dudas en la vida real: no respondas ni toques enlaces; cuelga y llama tú al número que ya conoces; pide ayuda a alguien de confianza. Lema: **DETENTE · REVISA · VERIFICA**. |
| G06 | Tres acciones: reconoce urgencia y pedidos inusuales; confirma identidad por un canal que ya conoces; no compartas dinero, contraseñas ni códigos sin verificar. Resumen por app y créditos del equipo. |

**Patrón de cada pantalla del prototipo:** cabecera (app + código de pantalla) · `< ATRÁS` · `SALIR / AYUDA` · contenido · **«Guía ALERTA CHAT»** (una frase de acompañamiento) · botón(es) de acción · barra de progreso («Escena n · ruta»).

**Patrón narrativo común a las tres historias**

| Ruta | Actitud | Consecuencia |
|---|---|---|
| A | Confiar | Pérdida simulada, con **punto de corrección** (detenerse a tiempo) y opción de volver a la primera decisión. |
| B | Verificar por un canal conocido | Sin pérdida; refuerzo positivo; paso extra (reportar/avisar a la familia). |
| C | Dudar dentro del mismo canal | El estafador evade y cambia de táctica → **segunda decisión** (1 caer · 2 verificar por otro canal). |

Total de nodos: 6 generales + 23 WhatsApp + 21 Messenger + 22 SMS = **72 pantallas**.

---

## 3. Mapa de las tres historias

### 3.1 WhatsApp — Suplantación de un familiar («cambié de número»)

**Situación:** martes, 10:38 a. m. La usuaria es la madre de **Andrés** (contacto guardado: +57 310 555 0123). Escribe un número no guardado (+57 322 555 0187) **con la misma foto de perfil de Andrés**.
**Técnicas de ingeniería social:** confianza familiar, foto robada, urgencia, petición de dinero, cuenta de un tercero, «no me llames», presión creciente, nota de voz que imita la voz.

```
W01 Lista de chats (nuevo mensaje) → W02 Datos del chat (no está en contactos) → W03 «Hola ma, soy Andrés» / «Cambié de número»
→ W04 «Se me varó el carro en la vía a Jamundí… grúa… la app del banco no funciona… Son $480.000. Porfa, es urgente»
→ W05 ¿QUÉ DECIDES HACER?
   ├─ A  Ayudar y hacer la transferencia
   │    W06A Tú: «¿A dónde le mando la plata?» → cuenta Banco Ceiba 000-555-0199 a nombre de «Grúas El Rápido»
   │    W07A Presión: «el señor está bravo», «No me llames, solo por WhatsApp», pide $200.000 más
   │       ├─ 1 Transferir $480.000 → W08A Comprobante ficticio [SIMULACIÓN · NO SE MUEVE DINERO REAL]
   │       │                         → W09A Llama el verdadero Andrés: «Yo no le he escrito». Qué pasó · señales · qué hacer en la vida real
   │       │                            → W11 | ↺ W05
   │       └─ 2 Detenerse y llamar al número guardado → W08A2 «Corregiste a tiempo» → W11 | ↺ W05
   ├─ B  Llamar al número de Andrés que ya tenía guardado
   │    W06B Llamada saliente → W07B Andrés real: «No mande nada. Eso es una estafa»
   │    W08B Vuelves al chat: «Ma, ¿ya hiciste la transferencia?» ¿QUÉ HACES CON ESTE CONTACTO?
   │       ├─ 1 Bloquear y reportar → W09B
   │       └─ 2 Responder para reclamar → W08B2 El impostor inventa otra historia («me robaron el celular viejo») → Bloquear → W09B
   │    W09B Resultado: verificaste. Paso extra: avisar al grupo familiar → W11
   └─ C  Hacerle preguntas para estar segura
        W06C «¿Cómo se llama la perrita de su casa?» → W07C Evasiva: «no es momento de juegos», «mire mi foto»; tú pides nota de voz
        W08C Nota de voz 0:07 (voz parecida, entrecortada) + «¿Ya me cree?»
        W09C ¿QUÉ DECIDES AHORA?
           ├─ 1 «Ya escuché su voz»: transferir → W10CA Pérdida simulada; las voces se pueden imitar con programas → W11 | ↺ W09C
           └─ 2 Dejar el chat y llamar al número guardado → W10CB Andrés: «La perrita se llama Luna». Tus dudas tenían razón → W11
W11 Conclusión (tabla de rutas · 3 señales: número nuevo con foto conocida; urgencia y dinero; cuenta de otra persona y «no me llames»)
    Principio: «Antes de enviar dinero, confirma con el contacto que ya conoces».
W12 Repetir (W01) · Otra app (G03) · Terminar (G06)
```

### 3.2 Facebook Messenger — Perfil falso de una sobrina (robo de cuenta)

**Situación:** jueves, 4:15 p. m. La usuaria es tía de **Daniela Ortiz**, amiga en Facebook desde 2014. Llega una **nueva solicitud de amistad** de «Daniela Ortiz»: misma foto, perfil creado en noviembre de 2026, 12 amigos (3 en común), 2 publicaciones de hoy. En la historia se confirma la solicitud.
**Técnicas:** clonación de perfil, datos tomados de publicaciones públicas (la rodilla, la clínica, el bautizo de Sofi), enlace con dominio parecido (`faceb0ok` con cero), falsa expiración de sesión, prisa («lo borro esta noche»), cambio de petición hacia el **código de verificación**, apelación emocional.

```
M01 Notificación: solicitud de amistad → M02 Perfil de la solicitud → M03 «¡Holaaa tía! Soy Dani» / «la otra cuenta me la hackearon»
→ M04 Gana confianza: «¿Cómo sigue de la rodilla? Vi su foto en la clínica» / «¿Va al bautizo de Sofi?»
→ M05 «Subí las fotos, el álbum quedó privado. Entre con su Facebook aquí: fotos-faceb0ok.invalid/album-sofia» / «Ábralo ya, que lo borro esta noche»
   ├─ A  Abrir el enlace e iniciar sesión
   │    M06A Página falsa [ILUSTRACIÓN ESTÁTICA · NO ES UN FORMULARIO REAL] «Tu sesión expiró»
   │       ├─ 1 Escribir correo y contraseña → M07A [SIMULACIÓN · NO SE ENVIÓ NINGÚN DATO REAL] «Error: álbum no disponible»
   │       │     → M08A [CONSECUENCIA SIMULADA] Te cambian la contraseña; desde tu cuenta piden $300.000 a Paola (sobrina); Paola sospecha
   │       │     → M09A Qué pasó · señales · recuperar cuenta desde la app oficial y avisar a contactos → M11 | ↺ M05
   │       └─ 2 Cerrar la página y revisar el perfil → M06B (punto de corrección)
   ├─ B  Revisar si este perfil es el verdadero
   │    M06B Tabla: perfil nuevo vs. perfil de siempre (se unió marzo 2014, 486 amigos, publica desde hace años)
   │    M07B Llamada a Daniela (+57 315 555 0142, guardado): «Mi cuenta está bien… No abra nada»
   │    M08B Reportar el perfil falso (5 pasos) + aviso al grupo «Familia Ortiz»
   │    M09B Resultado: verificaste → M11
   └─ C  Preguntarle por qué no manda las fotos por aquí
        M06C → M07C «Pesan mucho» / «me da miedo esos enlaces» / «Más bien hágame un favor: le va a llegar un código de 6 números…»
        M08C Notificación SMS: «Tu código de verificación de Facebook es 482 913. No lo compartas con nadie» + «Rápido, se vence en 5 minutos» + «Ahí tengo las fotos de mi abuela»
        M09C ¿QUÉ DECIDES AHORA?
           ├─ 1 Enviarle el código → M10CA [CONSECUENCIA SIMULADA] Se cierra tu sesión: el código era para TU cuenta → M11 | ↺ M09C
           └─ 2 No enviarlo y llamar a Daniela → M10CB «¿Un código? No se lo dé a nadie». Cuenta segura → M11
M11 Comparación de resultados. Principio: «Un nombre y una foto conocidos no garantizan que la cuenta pertenezca a esa persona».
M12 Repetir (M01) · Otra app (G03) · Terminar (G06)
```

### 3.3 Mensajes de texto (iPhone, SMS) — Falso aviso bancario (smishing)

**Situación:** lunes, 7:52 a. m. Banco **ficticio «Banco Cordillera»**. En la bandeja hay un SMS legítimo anterior del número corto 85555 y un mensaje de **Laura (hija)**. Llega un SMS desde un **celular común** (+57 318 555 0164) que se presenta como el banco.
**Técnicas:** falsa autoridad, alarma económica ($1.850.000), cuenta regresiva ficticia («30 minutos», «10 minutos», «se cobrará hoy»), llamada perdida para presionar, enlace a página clonada, captura de cédula, usuario y clave, uso del **código real de autorización** que envía el banco.

```
S01 Bandeja de Mensajes → S02 «Detectamos un movimiento inusual por $1.850.000… podría ser bloqueada»
→ S03 «ÚLTIMO AVISO: 30 minutos… Ingresa aquí: https://bco-cordillera.invalid/verificar» (enlace ilustrativo)
→ S04 Llamada perdida 8:03 + «Para cancelar la compra ingresa ya al enlace»
→ S05 ¿QUÉ DECIDES HACER?
   ├─ A  Abrir el enlace del mensaje
   │    S06A Página falsa del banco [ILUSTRACIÓN ESTÁTICA] pide cédula, usuario, clave
   │       ├─ 1 Escribir mis datos → S07A La página pide un código; llega SMS real de 85555: «Tu código para AUTORIZAR una transferencia de $2.300.000 es 739105»
   │       │     ├─ 1 Escribir el código → S08A [CONSECUENCIA SIMULADA] Transferencia de $2.300.000 → S09A Qué pasó · señales · qué hacer → S11 | ↺ S05
   │       │     └─ 2 Detenerse: «dice autorizar, no cancelar» → S08A2 Llamas a la línea del respaldo de la tarjeta; corregiste a tiempo → S11 | ↺ S05
   │       └─ 2 Cerrar la página y entrar por la app oficial → S06B (punto de corrección)
   ├─ B  Entrar a la app oficial del banco sin usar el enlace
   │    S06B App ya instalada → S07B Cuenta activa, sin bloqueos; no existe la compra de $1.850.000
   │    S08B Llamas a la línea del respaldo: «El banco nunca le pide claves ni códigos por mensaje o enlace»
   │    S09B Resultado: verificaste; mensaje reportado y eliminado → S11
   └─ C  Responder el mensaje para pedir ayuda
        S06C Tú: «Yo no hice esa compra» → piden cédula y los 16 números de la tarjeta
        S07C «¿Por qué me escriben desde un celular?» → «Es nuestra línea de seguridad… no podemos llamarle» / «10 minutos»
        S08C Notificación de 85555: «Tu código es 205318. Banco Cordillera NUNCA te lo pedirá» + «Respóndanos con el código»
        S09C ¿QUÉ DECIDES AHORA?
           ├─ 1 Responder con el código → S10CA [SIMULACIÓN] Transferencia de $1.200.000 → S11 | ↺ S09C
           └─ 2 No responder y llamar a la línea oficial → S10CB «Ese mensaje no es nuestro». Cambiaste de canal → S11
S11 Comparación. Principio: «No ingreses a tu banco desde enlaces inesperados ni compartas códigos de seguridad».
S12 Repetir (S01) · Otra app (G03) · Terminar (G06)
```

### 3.4 Coherencia pedagógica entre las tres apps

| | WhatsApp | Messenger | SMS |
|---|---|---|---|
| Quién se suplanta | Hijo | Sobrina | Banco |
| Qué se busca robar | Dinero (transferencia) | Cuenta (contraseña / código) | Datos bancarios y código |
| Canal seguro que enseña | Llamar al número guardado | Comparar perfiles + llamar al celular | App oficial + línea del respaldo de la tarjeta |
| Segunda táctica (ruta C) | Nota de voz imitada | Código de verificación | Código de autorización |
| Resumen en G06 | Confianza familiar y urgencia | Perfiles falsos, enlaces y códigos | Falsa autoridad bancaria y datos |

Las tres historias comparten la misma gramática (A confiar / B verificar / C dudar → 2.ª decisión) y el mismo lema (**Detente · Revisa · Verifica**), pero cada una enseña un canal de verificación distinto. Es coherente con el documento y no hay solapamiento de contenidos.

---

## 4. Lectura de las capturas para la fidelidad visual

| App | Lo que se observa (iOS) | Para replicar |
|---|---|---|
| **Mensajes (SMS)** — 7 capturas, modo oscuro | Fondo negro; cabecera con botón atrás en cápsula y contador de no leídos; avatar genérico circular; remitente (números cortos 87xxx / 899903) con chevrón; sello centrado «Mensaje de texto • SMS / fecha, hora»; burbujas grises oscuras con cola a la izquierda; enlaces azules subrayados; barra inferior con «+», campo «Mensaje de texto • SMS» y micrófono. | Burbujas grises (SMS, no azules de iMessage), sello de fecha, enlaces visualmente de enlace pero **no navegables**. |
| **Messenger** — 1 captura, modo claro | Fondo blanco; chevrón y botones de llamada/video en azul; avatar + nombre en negrita; sellos de fecha centrados en mayúsculas («1 DIC 2023, 12:10 P.M.»); entrantes en gris claro agrupadas con el avatar en la última; salientes en azul; barra con cámara, galería, micrófono, campo «Aa», emoji y pulgar. | Agrupación de burbujas, colores azul/gris, barra de redacción. |
| **WhatsApp** — 1 captura, modo oscuro | Fondo con patrón de dibujos; cabecera con «< 271», avatar, nombre y botón de llamada; chips de fecha («sábado», «Hoy»); burbujas salientes verdes con hora y check; barra con «+», campo, sticker, cámara y micrófono. | Patrón de fondo, chips de fecha, burbujas verde/gris, nota de voz, cabecera con número no guardado. |

**Privacidad de las capturas:** contienen nombres y fotos de personas reales (una conversación de Messenger con una tercera persona, el perfil de un integrante del equipo, una foto de pizarra). **Se usarán solo como referencia de maquetación**; en el producto todos los nombres, números (+57 3xx 555 01xx), bancos (Banco Ceiba, Banco Cordillera) y dominios (`.invalid`) son ficticios, como ya los definió el prototipo, y los avatares serán ilustraciones o iniciales propias.

---

## 5. Arquitectura web propuesta

### 5.1 Principios
1. **El guion es datos, no código.** Las 72 pantallas viven en archivos de historia que el equipo puede corregir sin tocar la lógica.
2. **Dos capas visuales claramente distintas:**
   - **Capa app (ficción):** réplica fiel de WhatsApp / Messenger / Mensajes de iOS dentro del marco del teléfono.
   - **Capa ALERTA CHAT (pedagógica):** guía, decisiones, retroalimentación, banners «SIMULACIÓN», ayuda. Con identidad propia (color, ícono y tipografía distintos) para que **nunca se confunda con la app real**.
3. **Sitio estático, sin servidor ni base de datos:** no hay nada que capturar ni a dónde enviarlo.
4. **Nada interactivo es real:** sin `<a href>` hacia fuera, sin `<input>` de contraseña/datos, sin `fetch` a terceros.

### 5.2 Pila tecnológica recomendada
- **HTML + CSS + JavaScript (módulos ES) con Vite** como servidor de desarrollo y empaquetador. Sin framework: el problema es una máquina de estados con plantillas, y así el equipo de Producción Audiovisual puede leer y editar el código.
- Despliegue como sitio estático (GitHub Pages, Netlify o carpeta `dist/` abierta desde un servidor local para las pruebas en Cali, incluso sin internet).

### 5.3 Estructura de carpetas
```
ALERTA CHAT/
├─ REFERENCIAS/                 (solo lectura)
├─ docs/                        análisis, guion, decisiones, informe de pruebas
├─ index.html
├─ src/
│  ├─ main.js                   arranque
│  ├─ engine/
│  │  ├─ story-engine.js        máquina de estados: nodo actual, historial (ATRÁS), ruta, progreso
│  │  └─ validate-story.js      comprueba que todo destino exista y todo nodo sea alcanzable
│  ├─ story/
│  │  ├─ general.js             G01–G06
│  │  ├─ whatsapp.js            W01–W12 (23 nodos)
│  │  ├─ messenger.js           M01–M12 (21 nodos)
│  │  └─ sms.js                 S01–S12 (22 nodos)
│  ├─ shell/                    capa ALERTA CHAT
│  │  ├─ phone-frame.js         marco del teléfono + barra de estado
│  │  ├─ guide-panel.js         «Guía ALERTA CHAT»
│  │  ├─ decision-panel.js      opciones A/B/C y 1/2
│  │  ├─ feedback-card.js       Qué pasó · Señales · Si te pasa en la vida real
│  │  └─ help-menu.js           G05
│  ├─ skins/                    capa app (fiel)
│  │  ├─ whatsapp/  (chat-list, chat, contact-info, voice-note, call)
│  │  ├─ messenger/ (notifications, profile, chat, profile-compare)
│  │  ├─ ios-sms/   (inbox, thread, notification-banner)
│  │  └─ shared/    (fake-web-page, fake-bank-app, call-screen, receipt)
│  └─ styles/  tokens.css · base.css · accessibility.css
└─ public/assets/  avatares ilustrados propios, íconos SVG, audio (si se aprueba)
```

### 5.4 Modelo de un nodo (ejemplo con contenido real del prototipo)
```js
{
  id: 'W05', app: 'whatsapp', route: 'inicio', scene: 5,
  view: 'chat',                                  // qué plantilla de la skin se usa
  chat: { title: '+57 322 555 0187', unsaved: true, avatar: 'andres' },
  messages: [ /* acumulados desde W03, con hora y remitente */ ],
  guide: 'Llegaron mensajes nuevos. Léelos con calma antes de decidir.',
  prompt: '¿QUÉ DECIDES HACER?',
  choices: [
    { key: 'A', label: 'Ayudar y hacer la transferencia',                    to: 'W06A' },
    { key: 'B', label: 'Llamar al número de Andrés que ya tenía guardado',   to: 'W06B' },
    { key: 'C', label: 'Hacerle preguntas para estar segura',                to: 'W06C' }
  ]
}
```
Nodos de resultado añaden `feedback: { tone: 'perdida' | 'correccion' | 'acierto', banner, whatHappened, signals[], realLife[] }`.

### 5.5 Pantalla inicial (simulación del teléfono)
- Escritorio/tableta: teléfono centrado; **fuera del teléfono**, una franja fija «ALERTA CHAT · Simulación educativa» y un botón grande **Ayuda / Salir**.
- Celular: la experiencia ocupa la pantalla completa; la franja de simulación queda arriba, siempre visible.
- G01–G04 se muestran con la capa ALERTA CHAT. En G03, la elección se presenta como **pantalla de inicio de un teléfono con tres íconos grandes** (WhatsApp, Messenger, Mensajes) con su nombre escrito debajo, más los botones A/B/C del prototipo para quien no reconozca los íconos.

### 5.6 Accesibilidad (criterio de aceptación de cada pantalla)
| Requisito | Implementación |
|---|---|
| Tipografía grande | Mínimo 20 px en burbujas y opciones, 18 px en texto secundario; unidades `rem` para que el zoom del navegador funcione. |
| Contraste | Capa ALERTA CHAT ≥ 7:1 (AAA); réplica de apps ≥ 4,5:1 (se ajustan los grises de las apps reales cuando no cumplan). |
| Botones amplios | Área táctil ≥ 56 px de alto, ancho completo, separación ≥ 12 px, texto + letra (A/B/C). |
| Instrucciones claras | Una sola decisión por pantalla; la «Guía» en una frase; verbos de acción en los botones. |
| Sin tiempo límite | No hay cuentas regresivas reales ni avance automático. La urgencia («30 minutos») es solo texto de la ficción. Los mensajes pueden aparecer con una animación breve, pero las opciones esperan sin límite y la animación se desactiva con «reducir movimiento». |
| Navegación sencilla | `< ATRÁS` y `AYUDA` siempre en el mismo lugar; ningún gesto obligatorio (deslizar, mantener pulsado). |
| Lectores de pantalla y teclado | `lang="es-CO"`, foco visible, orden lógico, mensajes nuevos anunciados con `aria-live`. |
| Audio (si lo hay) | Transcripción siempre visible, como en el prototipo (W08C). |

### 5.7 Garantías de seguridad (verificables en el código)
- Enlaces simulados como `<button>` o `<span>` con estilo de enlace; los dominios son `.invalid` (reservado, no resuelve).
- Formularios falsos sin elementos `<input>`: los campos son dibujos con la etiqueta «campo ilustrativo»; «escribir mis datos» se representa con puntos que aparecen solos.
- Comprobantes y transferencias con banner «SIMULACIÓN · NO SE MUEVE DINERO REAL», como en el prototipo.
- Sin analítica, sin cookies, sin almacenamiento de respuestas. Como mucho, `localStorage` para recordar «dónde iba» si se aprueba.
- Prueba automática que falla si aparece un `<input>`, un `href` externo o un `fetch` en el código de las historias.

---

## 6. Plan de implementación por fases

| Fase | Entregable | Criterio de «hecho» |
|---|---|---|
| **0. Análisis** (este documento) | Análisis, mapas, arquitectura, preguntas abiertas | Aprobación del equipo |
| **1. Base y navegación** | Proyecto Vite, motor de historia, marco del teléfono, capa ALERTA CHAT, G01–G06, **las 72 pantallas cargadas como texto plano** | Se recorre todo el grafo de punta a punta; el validador no reporta destinos rotos ni nodos huérfanos |
| **2. WhatsApp** | Skin fiel (lista de chats, chat, info de contacto, nota de voz, llamada, comprobante ficticio) + 23 nodos | Los 7 finales de ruta alcanzables; revisión visual contra la captura |
| **3. Messenger** | Skin fiel (notificaciones, solicitud/perfil, chat, comparación de perfiles, página falsa) + 21 nodos | Ídem |
| **4. Mensajes iOS (SMS)** | Skin fiel (bandeja, hilo SMS, notificación, página falsa del banco, app bancaria ficticia, llamada) + 22 nodos | Ídem |
| **5. Accesibilidad y QA** | Auditoría (axe/Lighthouse), teclado, lector de pantalla, celular/tableta/escritorio, revisión del texto contra el documento | 0 errores críticos; todas las pruebas de seguridad en verde |
| **6. Prueba con adultos mayores y entrega** | Versión estática desplegada + guía corta de prueba para el equipo; correcciones | Ajustes de la prueba en Cali aplicados |

Cada fase se entrega navegable para que el equipo revise antes de pasar a la siguiente.

---

## 7. Información que falta o que hay que decidir

### 7.1 Decisiones del equipo (bloquean la Fase 2)
1. ~~**Plataforma del teléfono simulado.**~~ **Resuelto (10 nov.):** la persona elige Android, iPhone o «No estoy seguro». Ver sección 8.
2. **Modo claro u oscuro.** Las capturas mezclan WhatsApp oscuro, Messenger claro y SMS oscuro. **Decisión provisional de la Fase 1: modo claro en todo**, porque se lee mejor con letra grande y es el modo de fábrica de la mayoría de teléfonos. Se puede revisar.
3. **Logos y marcas.** ¿Se usan los íconos oficiales de WhatsApp, Messenger y Mensajes (uso académico) o íconos propios que se parezcan? Recomendación: forma y color reconocibles, sin logotipos oficiales, y la franja «Simulación educativa» siempre visible.
4. **Nota de voz (W08C).** ¿Se graba un audio real (con voz humana del equipo, nunca clonada de una persona real) o solo se muestra la transcripción como en el prototipo?

### 7.2 Contradicciones o riesgos en el contenido (solo los señalo; no los he cambiado)
1. **Número corto del banco.** S01 afirma: «Los mensajes reales de tu banco siempre llegan del número corto 85555», y S09A/S10CA usan «escribía desde un celular común» como señal. Sin embargo, **todas las capturas reales de estafa llegan desde números cortos** (87648, 87296, 87185, 87182, 899903). Enseñar que «número corto = confiable» puede crear una falsa seguridad. Sugerencia para que el equipo decida: matizar el texto («un número corto conocido no basta: entra por la app oficial o llama a la línea del respaldo de la tarjeta»).
2. **«iMessage» vs. «SMS».** El documento habla de iMessage, pero el prototipo y las capturas son SMS en la app Mensajes de iPhone (burbujas grises, «Mensaje de texto • SMS»). Propongo llamar a la app «Mensajes» y simular SMS, que es lo que muestran las referencias.
3. **Cantidad de opciones.** El wireframe en texto del documento muestra 2 opciones (A/B); el Anexo A, 3 (A/B/C) más segundas decisiones. Tomo el **Anexo A** como versión vigente.
4. **Protagonista femenina fija.** Las historias tratan a quien juega como «ma», «tía» y «señora», y la opción C dice «para estar **segura**». ¿Es una decisión de guion (una sola protagonista) o debe servir también a hombres mayores?
5. **Montos en SMS.** La ruta A termina en $2.300.000 y la ruta C en $1.200.000. ¿Es intencional?
6. **Paola (sobrina)** aparece solo en M08A sin presentarla antes. ¿Se mantiene o se usa un familiar ya mencionado?
7. **«Volver» desde las conclusiones.** W11/M11/S11 tienen `< ATRÁS` hacia la primera decisión (W05/M05/S05), no a la pantalla anterior, porque llegan desde varias rutas. Lo implementaré así salvo que se indique otra cosa.

### 7.3 Material que no está en las referencias
- Capturas de **WhatsApp**: lista de chats, chat con un número no guardado (aviso «no está en tus contactos», botones Bloquear/Agregar), nota de voz recibida, pantalla de llamada. La única captura es un chat consigo mismo con imágenes.
- Capturas de **Messenger/Facebook**: notificaciones, solicitud de amistad, perfil, bandeja de chats.
- Capturas de **iOS**: pantalla de llamada (saliente y entrante), banner de notificación, pantalla de inicio (para G03).
- **Avatares** de Andrés y Daniela (el guion dice «la misma foto»): ¿ilustraciones, fotos de stock libres o fotos de personas del equipo con su consentimiento?
- **Fecha exacta de entrega** y **dispositivo de la prueba en Cali** (¿celular del participante, tableta o computador?), que define el tamaño de pantalla prioritario.
- **Despliegue**: ¿necesitan un enlace público (GitHub Pages/Netlify) o basta con una versión local?
- **Registro de la prueba**: el documento no pide medir resultados. No incluiré analítica salvo que el equipo quiera, por ejemplo, un resumen anónimo en pantalla de las rutas elegidas.
- **Nombre definitivo** del proyecto (el encargo lo llama «provisional»).

---

## 8. Decisión del 10 nov. 2026: el usuario elige su tipo de celular

### 8.1 Qué se decidió
Antes de empezar, la persona responde **«¿Qué celular usas?»** (se tutea, igual que en todo el prototipo):

| Opción en pantalla | Texto de apoyo | Variante visual (`os`) |
|---|---|---|
| **Android** | Samsung, Motorola, Xiaomi y otros | `android`: WhatsApp para Android, Messenger para Android, **Google Mensajes** |
| **iPhone** | De Apple | `ios`: WhatsApp para iPhone, Messenger para iPhone, **Mensajes de Apple** (SMS) |
| **No estoy seguro** | La práctica se ve sencilla y se puede cambiar después | `simple`: interfaz simplificada, igual para las tres apps |

Debajo se explica cómo saberlo, con palabras de uso diario: *«Mira la parte de atrás de tu celular. Si tiene una manzanita, es un iPhone. Si no, casi seguro es Android.»*

### 8.2 Lo que **no** cambia
- **Siguen siendo tres historias**, no seis. Los 72 nodos del Anexo A (textos, decisiones, consecuencias, retroalimentación, montos, horas, nombres) son **los mismos** en los tres sistemas.
- El sistema operativo solo cambia **cómo se dibuja** cada pantalla: marco del teléfono, barra de estado, pantalla de inicio, colores, íconos, forma de las burbujas y barra de escribir.
- Excepción de nombre: en Android la app de SMS se llama **«Mensajes»** (Google Mensajes) y el texto del prototipo «Mensajes (iPhone)» se muestra como «Mensajes». El contenido de los SMS es idéntico.

### 8.3 Cambio de navegación (justificado)
El prototipo era: G01 → G02 → **G03 elige app** → **G04 cómo decidir** → W01/M01/S01. Se ajusta a:

```
P00 Bienvenida: ¿Qué celular usas?  (nuevo)
 → G01 Antes de empezar → G02 Cómo funciona → G04 Cómo decidir
 → G03 Pantalla de inicio del celular (toca WhatsApp, Messenger o Mensajes) → W01 | M01 | S01
```
- **P00** es nuevo y lo pide la decisión del equipo. Repite la marca «Simulación educativa».
- **G04 pasa antes de G03.** Motivo: G03 ahora es la **pantalla de inicio de un celular de verdad**; en un teléfono real, tocar un ícono abre la app de inmediato. Meter una pantalla de instrucciones entre el ícono y la app rompe esa metáfora. El texto de G04 no cambia y también queda disponible en el menú de Pausa.
- G03 conserva las opciones del prototipo como botones grandes en la capa ALERTA CHAT, además de los íconos, para quien no reconozca los íconos.
- Desde W12/M12/S12 y G05 «Elegir otra aplicación» sigue llevando a G03 (ahora, la pantalla de inicio).

### 8.4 Ajustes y cambio de sistema
- El menú **Pausa** (G05) incluye **«Cambiar el tipo de celular»**.
- Cambiar de Android a iPhone (o a sencillo) **no pierde el progreso**: el motor guarda solo `{ nodo actual, historial, os }`; al cambiar `os` se vuelve a dibujar el mismo nodo con otra variante.
- El progreso vive en `sessionStorage` (sobrevive a recargar la página, se borra al cerrar la pestaña). No se guardan respuestas ni datos de la persona, y no se envía nada a ningún servidor. Así, si en la prueba de Cali varias personas usan el mismo equipo, cada una empieza de cero al abrir una pestaña nueva.

### 8.5 Arquitectura por variantes (reemplaza 5.3)
```
src/
├─ engine/          story-engine.js · resolve-node.js · validate-story.js   ← no sabe nada de Android ni iPhone
├─ story/           manifest.js (los 72 nodos del Anexo A) · general.js · whatsapp.js · messenger.js · sms.js
├─ ui/
│  ├─ app.js                orquestador: estado → dibujo
│  ├─ shell/                capa ALERTA CHAT (igual en los tres sistemas)
│  │   strip.js (Atrás · Simulación educativa · Pausa) · coach.js (guía y decisiones) · pause-menu.js
│  ├─ device/               marco y barra de estado por sistema (android · ios · simple)
│  ├─ views/                UN componente por tipo de pantalla, compartido por los tres sistemas
│  │   alerta-pages (P00, G01, G02, G04, G06, en construcción) · home · lists (chats y notificaciones) · profile · chat
│  └─ icons.js · avatars.js SVG propios (íconos inspirados en las apps, avatares ilustrados)
└─ styles/
   ├─ tokens.css · base.css · shell.css · device.css
   └─ skins/ common.css · whatsapp.css · messenger.css · messages.css · simple.css   ← variantes con [data-os="android|ios|simple"]
```
- **Una sola vista por tipo de pantalla.** Por ejemplo, `chat` dibuja la conversación de WhatsApp, Messenger o Mensajes con el mismo código; el contenedor lleva `data-app` y `data-os`, y el CSS de cada skin aplica colores, burbujas, cabecera y barra de escribir.
- Las pocas diferencias de estructura (por ejemplo, en iPhone el nombre del contacto va centrado en Mensajes, o el botón de volver es «‹» en iPhone y «←» en Android) se resuelven con una tabla de rasgos por sistema (`src/ui/device/os-traits.js`), no con componentes duplicados (`src/ui/device/os-traits.js`).
- **Modo sencillo (`simple`)**: sin barra de estado ni íconos decorativos; cada burbuja dice quién escribe («+57 322 555 0187 le escribió»); cabeceras con el nombre de la app escrito; pantalla de inicio con tres botones grandes en lugar de una cuadrícula de íconos.

### 8.6 Referencias visuales para Android (pendientes)
Las capturas del equipo son todas de iPhone. Para Android, la Fase 1 usa la apariencia pública conocida (modo claro) de WhatsApp para Android, Messenger para Android y Google Mensajes. **Se necesitan capturas de Android del equipo** (lista de chats, conversación, número no guardado, notificación, SMS de un número desconocido) para ajustar la fidelidad en las Fases 2–4.

### 8.7 Plan de fases actualizado (reemplaza la sección 6)
| Fase | Alcance |
|---|---|
| **1** | Proyecto base, motor narrativo, manifiesto de los 72 nodos, P00 (elegir celular), G01, G02, G04, **G03 pantalla de inicio** en 3 variantes, G05 Pausa con «Cambiar el tipo de celular», G06, y **entrada a las tres apps** (W01–W05, M01–M05, S01–S05: desde la lista de chats hasta la primera decisión). Las ramas A/B/C muestran «se construye en la fase siguiente». |
| 2 | WhatsApp completo (rutas A, B, C, conclusión) en las 3 variantes |
| 3 | Messenger completo |
| 4 | Mensajes completo |
| 5 | Accesibilidad y revisión de calidad (incluye las 3 variantes × 3 apps) |
| 6 | Prueba con adultos mayores y entrega |

### 8.8 Estado de la Fase 1 (10 nov. 2026)
Implementado y revisado en el navegador (escritorio 1280 px y celular 375 px):
- P00 con las tres opciones, G01, G02, G04, G03 (inicio del celular en Android, iPhone y sencillo), G06 y el menú G05 con «Cambiar el tipo de celular».
- Entrada a las tres apps hasta la primera decisión (W01–W05, M01–M05, S01–S05) en las tres variantes. Las ramas A/B/C muestran una pantalla «En construcción» con «Volver a la decisión».
- Cambiar de sistema conserva el nodo y el historial (también al recargar la página, dentro de la misma pestaña).
- Controles de la app que no se usan (barra de escribir, Bloquear/Agregar, enlaces, pestañas) muestran un aviso de ALERTA CHAT en vez de no hacer nada. Los enlaces no navegan.
- `npm run check` valida el guion (destinos, alcanzabilidad, ausencia de `<input>`, `href` y direcciones que no sean `.invalid`) y se ejecuta antes de cada `npm run build`.

Ajustes de fidelidad por accesibilidad (documentados en el CSS): verde de insignias de WhatsApp más oscuro (#128C4A), verde de SMS enviados en iPhone más oscuro (#248A3D), letra de burbujas de 20 px y el nombre o número de quien escribe nunca se corta.

Pendiente de mejorar: en celulares, las opciones de la Guía quedan debajo de la conversación y hay que desplazarse para verlas. Se revisará en la Fase 5 o tras la prueba con usuarios.

---

## 9. Segunda entrega (11 nov. 2026): correcciones definitivas y Fase 2

Decisiones del equipo que **prevalecen sobre el Anexo A** (el documento final manda sobre el boceto):

| Tema | Antes (Anexo A / Fase 1) | Ahora |
|---|---|---|
| Inicio | P00 → G01 → G02 → G04 → G03 | **Bienvenida → ¿Qué celular utiliza? → ¿Dónde quiere practicar? → introducción breve → conversación**. G01, G02 y G04 salen del flujo; su idea central queda en la bienvenida y en «Salir / Ayuda». |
| Trato | «tú» | «usted» en toda la capa ALERTA CHAT. |
| Personajes | Andrés (hijo), Daniela (sobrina), Laura (hija), «ma», «tía», «mija» | **Ningún nombre ni parentesco presupuesto.** Remitentes neutrales: número desconocido, «Soporte de Cuentas», número corto 87648. |
| WhatsApp | «Cambié de número» de un hijo | Número desconocido que pregunta «¿Sí sabe quién le habla?» y pide $350.000. La persona puede decir que no lo reconoce. |
| Messenger | «Hola tía, soy Dani» | Eliminada. Perfil desconocido que se presenta como soporte y pide confirmar datos (apertura hecha; ramas en Fase 3). |
| SMS | Falso aviso bancario | Aviso de entrega fallida (como las capturas), con la respuesta «No estoy esperando ninguna entrega» (apertura hecha; ramas en Fase 4). |
| Respuestas | Botones en un panel lateral | Panel de decisiones **dentro del teléfono**, donde iría la barra de escribir. 2 o 3 opciones (máximo 3, lo valida `npm run check`). Las respuestas elegidas aparecen como mensaje enviado. No hay campo para escribir. |
| Ritmo | Todo el chat de una vez | Mensajes de uno en uno con «Escribiendo…»; las opciones aparecen al final y esperan sin límite. «Mostrar todos» y, en «Salir / Ayuda», «Todos de inmediato» y «Letra más grande». |
| Resultados | Una conclusión por caso | Un resultado por desenlace (seguro, se detuvo y corrigió, con riesgo), con qué ocurrió, señales, qué estuvo en riesgo, cómo verificar y qué hacer en la vida real, más tres botones: Volver a practicar · Elegir otra aplicación · Volver al inicio. Fuentes: FTC (2025) e INCIBE, ya citadas en el documento. |

**WhatsApp completo:** 17 nodos, 32 recorridos distintos y 4 desenlaces (W90R bloqueó, W91R no envió dinero, W92R se detuvo después de enviar, W93R envió dinero). Hay dos puntos de corrección: antes de transferir y después de la primera transferencia. El mapa está al inicio de `src/story/whatsapp.js`.

**Motor reutilizable:** la conversación se arma con el recorrido real (`chat.thread` y `chat.start`), así que dos ramas pueden llegar al mismo nodo con historias distintas. La respuesta elegida (`say`) se inserta sola como mensaje enviado. Messenger y SMS ya usan este motor; para completarlos solo hay que escribir sus nodos.

**Queda abierto:** con la historia nueva de SMS deja de aplicar el texto de §7.2.1 sobre el número corto del banco.

### 9.1 Messenger y SMS completos (11 nov. 2026)
- **Messenger** (`src/story/messenger.js`): perfil «Soporte de Cuentas» que pide confirmar datos. Tiene 24 nodos, 36 recorridos y 6 desenlaces: eliminó la solicitud, bloqueó, verificó en la aplicación oficial, cerró la página a tiempo, perdió la cuenta, se detuvo antes del código. La pantalla de perfil (M03B) tiene sus propias decisiones de verificación.
- **SMS** (`src/story/sms.js`): aviso de entrega fallida desde el número corto 87648, con la respuesta «No estoy esperando ninguna entrega». Tiene 15 nodos, 7 recorridos y 4 desenlaces: borró y reportó, no abrió ni pagó, cerró la página a tiempo, datos expuestos.
- **Nueva vista `webpage`** (`src/ui/views/webpage.js`): página educativa local para los enlaces (falsa, aplicación oficial o aviso del sistema). No tiene campos reales: al tocar un «campo» aparece un aviso de que es una ilustración.
- `npm run check`: 60 nodos sin errores. Ninguna página contiene `input`, `form` ni enlaces navegables.
