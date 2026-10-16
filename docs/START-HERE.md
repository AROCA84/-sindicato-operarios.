# Arranque del agente técnico

## Estado de arranque

- **Comprobación automática:** configurada con GitHub Actions.
- **Auditoría inicial de la web principal:** configurada en modo de solo lectura y genera un artefacto descargable.
- **Comando de tareas:** `npm run tasks`.
- **Configuración OpenCode:** `opencode.json` restringe edición y terminal para el perfil de auditoría.
- **Modelo de IA remoto:** pendiente de autenticar un proveedor. No se guarda ninguna clave en el repositorio.

## Cómo iniciar la primera auditoría

Después de que estos cambios estén en la rama principal del repositorio del agente:

1. Abre la pestaña **Actions** del repositorio.
2. Selecciona **Agent scaffold checks**.
3. Pulsa **Run workflow** y confirma la rama `main`.
4. Espera a que termine el trabajo.
5. Abre la ejecución y descarga el artefacto **primary-web-readonly-audit**.

El flujo valida los catálogos, ejecuta las pruebas, comprueba los comandos del agente y lee metadatos/árbol/manifiestos públicos de `AROCA84/-sindicato-operarios`. No modifica ese repositorio ni ejecuta su código.

## Ejecutar el coordinador localmente

Requisitos: Node.js 24 o posterior.

```bash
npm test
npm run repos
npm run tasks
npm run audit -- AROCA84/-sindicato-operarios
```

La variable opcional `GITHUB_TOKEN` solo se configura en el entorno de ejecución, nunca en el código ni en el chat. La auditoría de la web pública puede funcionar sin token; repositorios privados requieren autorización.

## Qué falta para un agente autónomo con IA

La infraestructura de auditoría no equivale a un agente LLM autónomo. Para habilitar el razonamiento y las tareas de programación de OpenCode hace falta autorizar un proveedor/modelo. Esa credencial no está disponible en este repositorio y no se debe inventar ni copiar desde ChatGPT. La conexión debe configurarse en el entorno seguro que vaya a ejecutar el agente; si se usa una API de pago, el proveedor puede cobrar por uso.

Hasta que se configure ese proveedor, el agente puede validar, inventariar y producir el informe estático, pero no puede pedir a un modelo que analice razonadamente el código ni reparar la web por sí solo.

## Límites de seguridad

- No hay despliegue automático.
- No se fusionan cambios de la web principal.
- No se accede a secretos de producción ni a datos reales de Supabase.
- No se cambian pagos, afiliaciones ni certificados.
- Las modificaciones futuras deben pasar por una rama aislada, pruebas y revisión del diff.

## Arrancar el análisis con un modelo de IA

Se ha añadido el workflow manual **OpenCode read-only website audit**. Este sí llama a un modelo de IA y entrega un informe como artefacto, pero necesita una clave de proveedor.

### Preparación única de la clave

1. Abre el repositorio del agente: `AROCA84/-sindicato-operarios.`.
2. Entra en **Settings → Secrets and variables → Actions**.
3. Pulsa **New repository secret**.
4. Nombre exacto: `OPENAI_API_KEY`.
5. Pega una clave de API creada en la plataforma del proveedor y guarda.

No pegues esa clave en el chat, en un archivo, en un issue ni en el código. La API de OpenAI es independiente de la suscripción de ChatGPT y puede generar costes; configura límites de uso en el proveedor antes de ejecutarlo.

### Ejecutar la auditoría

1. Abre **Actions** en el repositorio del agente.
2. Selecciona **OpenCode read-only website audit**.
3. Pulsa **Run workflow**.
4. Deja el enfoque por defecto para revisar el flujo de aprobado y certificado sin pago, o escribe otro foco.
5. Al finalizar, descarga el artefacto **opencode-readonly-website-audit**.

### Qué hace y qué no hace

- Clona una copia pública de la web principal en un runner temporal.
- Instala OpenCode CLI y solicita un informe en español.
- Desactiva las herramientas de escritura, edición y terminal para la sesión de auditoría.
- Guarda el informe como artefacto con retención de 14 días.
- No tiene permisos de escritura en el repositorio; no puede fusionar ni desplegar desde este workflow.

Si el secreto no existe, el flujo se detiene al principio y muestra un error claro. El workflow está preparado en GitHub, pero no se puede completar una ejecución con modelo hasta que se añada la clave del proveedor.

