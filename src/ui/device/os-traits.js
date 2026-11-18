// Tabla de rasgos por sistema. Las vistas son las mismas para todos; aquí solo cambian
// nombres y pequeñas diferencias de estructura. Los colores están en CSS (styles/skins).

export const OS_LABEL = {
  android: 'Android',
  ios: 'iPhone',
  simple: 'Versión sencilla',
};

export const APP_LABEL = {
  whatsapp: { android: 'WhatsApp', ios: 'WhatsApp', simple: 'WhatsApp' },
  messenger: { android: 'Messenger', ios: 'Messenger', simple: 'Messenger de Facebook' },
  sms: { android: 'Mensajes', ios: 'Mensajes', simple: 'Mensajes de texto (SMS)' },
};

export const BACK_ICON = { android: 'arrowBack', ios: 'chevronBack', simple: 'arrowBack' };

// Cabecera de las listas de conversaciones (un nodo puede cambiarla con `list.title`).
export const LIST_TITLE = {
  whatsapp: { android: 'WhatsApp', ios: 'Chats', simple: 'WhatsApp · Sus conversaciones' },
  sms: { android: 'Mensajes', ios: 'Mensajes', simple: 'Mensajes de texto · Sus conversaciones' },
  messenger: { android: 'Chats', ios: 'Chats', simple: 'Messenger · Sus conversaciones' },
};

export const SEARCH_PLACEHOLDER = {
  whatsapp: { ios: 'Buscar' }, // En Android la búsqueda es la lupa de la cabecera (referencia 3).
  messenger: { android: 'Buscar', ios: 'Buscar' },
  sms: { ios: 'Buscar' },
};

// Barra inferior de WhatsApp (decorativa).
export const WHATSAPP_TABS = {
  android: [
    { icon: 'chat', label: 'Chats', active: true },
    { icon: 'status', label: 'Novedades' },
    { icon: 'people', label: 'Comunidades' },
    { icon: 'phone', label: 'Llamadas' },
  ],
  ios: [
    { icon: 'status', label: 'Novedades' },
    { icon: 'phone', label: 'Llamadas' },
    { icon: 'people', label: 'Comunidades' },
    { icon: 'chat', label: 'Chats', active: true },
    { icon: 'gear', label: 'Configuración' },
  ],
};
