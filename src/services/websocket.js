const WS_URL = process.env.REACT_APP_WS_URL || 'wss://trustid-backend-production.up.railway.app';

let socket = null;
let callbacks = {};

export function connecterWS(cbs = {}) {
  callbacks = cbs;
  _connecter();
}

function _connecter() {
  if (socket?.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('🔌 Dashboard WS connecté');
    socket.send(JSON.stringify({
      type: 'identifier',
      userId: 'dashboard',
      clientType: 'dashboard',
    }));
  };

  socket.onmessage = (event) => {
    try {
      const { evenement, donnees } = JSON.parse(event.data);
      if (callbacks[evenement]) callbacks[evenement](donnees);
    } catch (_) {}
  };

  socket.onclose = () => setTimeout(_connecter, 5000);
  socket.onerror = (err) => console.error('WS erreur:', err);
}

export function deconnecterWS() {
  if (socket) { socket.onclose = null; socket.close(); socket = null; }
}
