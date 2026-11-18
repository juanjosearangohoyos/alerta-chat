import './styles/tokens.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/device.css';
import './styles/alerta-pages.css';
import './styles/skins/common.css';
import './styles/skins/whatsapp.css';
import './styles/skins/messenger.css';
import './styles/skins/messages.css';
import './styles/skins/simple.css';

import { createEngine } from './engine/story-engine.js';
import { STORY, MANIFEST, START } from './story/index.js';
import { mountApp } from './ui/app.js';

const engine = createEngine({ story: STORY, manifest: MANIFEST, start: START });
mountApp(document.getElementById('app'), engine);
