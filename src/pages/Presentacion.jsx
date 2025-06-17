import React from 'react';

const Presentacion = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 text-gray-800">
      

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-2">¿Quiénes somos?</h2>
          <p>
            Somos un taller especializado en la rectificación de motores y mantenimiento de vehículos. Contamos con un equipo capacitado y maquinaria de última generación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Nuestros valores</h2>
          <ul className="list-disc ml-6">
            <li>Compromiso con el cliente</li>
            <li>Honestidad y transparencia</li>
            <li>Responsabilidad técnica</li>
            <li>Respeto y trato humano</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contactanos</h2>
          <p>📍 Av. Principal 123, Tucumán, Argentina</p>
          <p>📞 (381) 555-1234</p>
          <p>📧 rectificadora.pepe@mail.com</p>
        </section>
      </main>

    </div>
  );
};

export default Presentacion;
