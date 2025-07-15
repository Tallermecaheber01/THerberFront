import React, { useState, useEffect, useRef } from 'react';
import { searchFaqs, findFaqByPregunta } from './api/admin';

export default function FAQ() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const send = async () => {
    if (!input.trim()) return;

    const q = input.trim();
    setHistory(h => [...h, { from: 'user', text: q }]);
    setInput('');

    try {
      // Buscar coincidencia exacta
      const exact = await findFaqByPregunta(q);
      if (exact) {
        setHistory(h => [...h, { from: 'bot', text: exact.respuesta }]);
        return;
      }

      // Buscar coincidencias parciales si no hubo exacta
      const partials = await searchFaqs(q);
      if (partials.length > 0) {
        partials.forEach(faq => {
          setHistory(h => [...h, { from: 'bot', text: faq.respuesta }]);
        });
      } else {
        setHistory(h => [
          ...h,
          { from: 'bot', text: 'No se encontró una respuesta relacionada.' },
        ]);
      }
    } catch (err) {
      console.error(err);
      setHistory(h => [
        ...h,
        { from: 'bot', text: 'Hubo un error al obtener la respuesta.' },
      ]);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-50"
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✕' : '❓'}
      </button>

      {open && (
        <div className="fixed bottom-16 right-4 w-80 h-96 bg-gray-300 dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50">
          <div className="px-4 py-2 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="form-label">Preguntas Frecuentes</h2>
            <button className="textError" onClick={() => setOpen(false)}>X</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {history.map((m, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  m.from === 'bot' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    m.from === 'bot'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t dark:border-gray-700 flex">
            <input
              className="flex-1 px-3 py-2 rounded-l-lg border dark:bg-gray-700 dark:border-gray-600 focus:outline-none  text-black dark:text-white"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
            />
            <button
              onClick={send}
              className="px-4 bg-blue-600 text-white rounded-r-lg"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
