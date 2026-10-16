# Decisión técnica preliminar: motor del agente

Fecha: 2026-10-16

## Resultado
**Candidato para prueba aislada: OpenCode CLI. No se integra todavía en el runtime del coordinador.**

Fuentes inspeccionadas directamente en el repositorio público `anomalyco/opencode`:
- `package.json`: proyecto privado tipo monorepo, `packageManager: bun@1.4.2`, múltiples workspaces y scripts internos.
- `README.md`: presenta OpenCode como agente de programación; documenta modos de planificación de solo lectura y construcción con permisos.
- `LICENSE`: licencia MIT en el archivo consultado.

La licencia MIT permite reutilización conforme a sus condiciones, pero no significa que los modelos, el alojamiento o los servicios sean gratuitos. La licencia del repositorio no sustituye la revisión de licencias de dependencias.

## Por qué probarlo
- Encaja con un flujo de trabajo centrado en código y repositorios existentes.
- Su modo de planificación de solo lectura puede servir para la primera fase de auditoría.
- Puede evaluarse como herramienta externa sin copiar el monorepo entero dentro de este proyecto.

## Riesgos y límites
- El repositorio upstream usa Bun y una arquitectura de múltiples paquetes; no es una biblioteca Node sencilla que debamos importar a ciegas.
- La ejecución de comandos o edición de archivos exige aislamiento real y límites explícitos.
- Un proveedor de modelos puede exigir credenciales y cobrar por uso.
- No se ha instalado ni ejecutado OpenCode en este entorno; esta decisión es una selección para un experimento, no una prueba de funcionamiento.

## Experimento propuesto
1. Preparar un entorno de prueba separado del sitio productivo.
2. Instalar una versión identificada y registrar versión, licencia y procedencia.
3. Configurar un proveedor/modelo de prueba sin publicar credenciales en el repositorio.
4. Ejecutar únicamente una tarea de lectura sobre una copia de trabajo de la web.
5. Exigir un informe con archivos revisados, hallazgos, comandos, costes y límites.
6. Solo después evaluar una modificación pequeña en una rama aislada con tests y diff revisable.

## Criterios de aceptación
- No accede a secretos ni a datos reales de Supabase.
- No despliega, no fusiona y no escribe en la rama principal.
- Respeta la lista de repositorios autorizados.
- Produce un informe reproducible.
- Se conoce el coste por tarea antes de habilitar uso frecuente.

## Alternativas no descartadas
- OpenHands SDK: volver a evaluar si se necesita una integración más programática y aislada.
- mini-swe-agent: evaluar si se busca un ejecutor más pequeño para tareas de ingeniería acotadas.

## Decisión de seguridad
No ejecutar agentes de terceros con permisos de escritura sobre la web productiva. No almacenar tokens en el código, prompts, issues o logs. La autorización de acceso y el proveedor de modelo siguen pendientes.
