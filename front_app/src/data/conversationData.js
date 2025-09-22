export const conversations = {
    1: {
        name: 'Juan el Agricultor',
        messages: [
        { id: 1, text: 'Hola, ¿aún tienes tomates orgánicos disponibles?', sender: 'them' },
        { id: 2, text: '¡Sí! ¿Cuántos kilos necesitas?', sender: 'me' },
        { id: 3, text: 'Unos 5 kilos para empezar. ¿A qué precio?', sender: 'them' },
        ],
    },
    2: {
        name: 'María la Compradora',
        messages: [
            { id: 1, text: 'Me interesa comprar 5 kg de maíz. ¿A qué hora puedo pasar?', sender: 'them' },
        ],
    },
};

export const chatsData = [
    { id: 1, name: 'Juan el Agricultor', message: 'Unos 5 kilos para empezar. ¿A qué precio?', timestamp: '10:30 AM', initial: 'J' },
    { id: 2, name: 'María la Compradora', message: 'Me interesa comprar 5 kg de maíz. ¿A qué hora puedo pasar?', timestamp: 'Ayer', initial: 'M' },
];