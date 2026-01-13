import { currentUser } from '@clerk/nextjs/server';

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ajustes</h1>
        <p className="mt-2 text-gray-600">
          Gestiona la configuración de tu cuenta y preferencias.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                defaultValue={user?.firstName || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                defaultValue={user?.lastName || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled
              />
            </div>
            <p className="text-sm text-gray-500">
              Para actualizar la información de tu perfil, usa el menú de usuario en la esquina superior derecha.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferencias</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Notificaciones por correo</h3>
                <p className="text-sm text-gray-500">Recibe actualizaciones por correo sobre tu cuenta</p>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
              >
                <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Correos de marketing</h3>
                <p className="text-sm text-gray-500">Recibe correos sobre nuevas funciones y actualizaciones</p>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
              >
                <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Zona de peligro</h2>
          <p className="text-sm text-gray-600 mb-4">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
          </p>
          <button className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

