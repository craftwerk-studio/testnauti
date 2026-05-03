'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import type { NauticalSchool } from '@/types/directory';

type RequestType = 'claim_ownership' | 'update_info';
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ClaimUpdateFormProps {
  school: NauticalSchool;
}

export default function ClaimUpdateForm({ school }: ClaimUpdateFormProps) {
  const [requestType, setRequestType] = useState<RequestType>('update_info');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/your-link';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!contactName.trim() || !contactEmail.trim() || !message.trim()) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setErrorMessage('Por favor, introduce un email válido.');
      return;
    }

    setFormStatus('submitting');
    setErrorMessage('');

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      setFormStatus('error');
      setErrorMessage('Error de configuración. Por favor, contacta al soporte.');
      console.error('NEXT_PUBLIC_N8N_WEBHOOK_URL is not configured');
      return;
    }

    const formData = {
      schoolId: school.id,
      schoolName: school.name,
      requestType,
      contactName,
      contactEmail,
      contactPhone,
      message,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorDetails = 'Error al enviar el formulario';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorDetails = errorData.message;
          }
          console.error('Webhook error:', errorData);
        } catch {
          console.error('Response error:', response.status, response.statusText);
        }
        throw new Error(errorDetails);
      }

      setFormStatus('success');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setMessage('');
      setRequestType('update_info');
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setErrorMessage('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet o contáctanos directamente a escuelas@testnauti.co');
      } else {
        setErrorMessage('Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo o contáctanos directamente a escuelas@testnauti.co');
      }
    }
  };

  const openCalendly = () => {
    if (typeof window !== 'undefined' && (window as unknown as { Calendly?: { initPopupWidget: (opts: { url: string }) => void } }).Calendly && calendlyLoaded) {
      (window as unknown as { Calendly: { initPopupWidget: (opts: { url: string }) => void } }).Calendly.initPopupWidget({ url: calendlyUrl });
    }
  };

  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => setCalendlyLoaded(true)}
      />

      {/* Success Message */}
      {formStatus === 'success' && (
        <>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 mb-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">
              ¡Solicitud enviada con éxito!
            </h3>
            <p className="text-green-800 mb-4">
              Hemos recibido tu solicitud. Nuestro equipo la revisará y se pondrá en contacto contigo en un plazo de 24-48 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                href={`/escuelas/${school.id}`}
                className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Volver a la escuela
              </Link>
              <button
                onClick={() => setFormStatus('idle')}
                className="bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Enviar otra solicitud
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-center shadow-xl">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              ¿Prefieres hablar con nosotros directamente?
            </h3>
            <p className="text-blue-50 mb-6 max-w-2xl mx-auto">
              Agenda una llamada con nuestro equipo para resolver tus dudas al instante y acelerar el proceso.
            </p>
            <button
              onClick={openCalendly}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reservar una llamada
            </button>
          </div>
        </>
      )}

      {/* Form and Sidebar Layout */}
      {formStatus !== 'success' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {/* Request Type */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  Tipo de solicitud <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50" style={{ borderColor: requestType === 'claim_ownership' ? '#3b82f6' : '#e5e7eb', backgroundColor: requestType === 'claim_ownership' ? '#eff6ff' : 'white' }}>
                    <input
                      type="radio"
                      name="requestType"
                      value="claim_ownership"
                      checked={requestType === 'claim_ownership'}
                      onChange={(e) => setRequestType(e.target.value as RequestType)}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Reclamar propiedad</div>
                      <div className="text-sm text-gray-600">Soy el dueño/responsable de esta escuela y quiero gestionarla</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50" style={{ borderColor: requestType === 'update_info' ? '#3b82f6' : '#e5e7eb', backgroundColor: requestType === 'update_info' ? '#eff6ff' : 'white' }}>
                    <input
                      type="radio"
                      name="requestType"
                      value="update_info"
                      checked={requestType === 'update_info'}
                      onChange={(e) => setRequestType(e.target.value as RequestType)}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Actualizar información</div>
                      <div className="text-sm text-gray-600">La información de la escuela está desactualizada o es incorrecta</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contact Name */}
              <div className="mb-6">
                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Tu nombre y apellidos"
                  required
                />
              </div>

              {/* Contact Email */}
              <div className="mb-6">
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {/* Contact Phone */}
              <div className="mb-6">
                <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-900 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+34 123 456 789"
                />
              </div>

              {/* Message */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder={requestType === 'claim_ownership'
                    ? 'Explica por qué deberías tener acceso a gestionar esta escuela. Incluye cualquier información relevante sobre tu relación con la escuela.'
                    : 'Describe los cambios que necesitas hacer en la información de la escuela (dirección, teléfono, cursos, descripción, etc.)'}
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Mínimo 10 caracteres. Sé específico para que podamos procesar tu solicitud más rápidamente.
                </p>
              </div>

              {/* Error Message */}
              {formStatus === 'error' && errorMessage && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 text-sm">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar solicitud'
                  )}
                </button>
                <Link
                  href={`/escuelas/${school.id}`}
                  className="flex-shrink-0 bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-center transition-all"
                >
                  Cancelar
                </Link>
              </div>

              <p className="mt-6 text-sm text-gray-500 text-center">
                Al enviar este formulario, aceptas que nos pondremos en contacto contigo para verificar tu solicitud.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-center shadow-xl">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ¿Prefieres hablar con nosotros?
                </h3>
                <p className="text-blue-50 text-sm mb-5">
                  Agenda una videollamada de 15 minutos. Te ayudaremos de forma rápida y personal.
                </p>
                <button
                  type="button"
                  onClick={openCalendly}
                  disabled={!calendlyLoaded}
                  className="w-full bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {calendlyLoaded ? 'Reservar llamada' : 'Cargando...'}
                </button>
                <p className="mt-3 text-blue-100 text-xs">
                  ✓ 100% Gratis • ✓ Sin compromiso
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm mb-2">
                      ¿Necesitas ayuda?
                    </h4>
                    <p className="text-xs text-gray-600 mb-3">
                      También puedes escribirnos:
                    </p>
                    <a
                      href="mailto:escuelas@testnauti.co"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      escuelas@testnauti.co
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Respuesta rápida
                </p>
                <p className="text-xs text-gray-600">
                  Te respondemos en menos de 24-48 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
