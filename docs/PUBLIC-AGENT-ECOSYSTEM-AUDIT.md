# Auditoría del ecosistema público de agentes de programación

Fecha de comprobación de metadatos: 16 de octubre de 2026.

Objetivo: elegir componentes para un agente propio que termine la web ya avanzada, no reconstruir la plataforma desde cero. La búsqueda de repositorios públicos se hace por consultas relevantes; no es posible afirmar que se hayan inspeccionado literalmente todos los repositorios de GitHub. Los candidatos se van ampliando por tandas y se auditan antes de reutilizar código.

## Primera comparación basada en metadatos de GitHub

| Proyecto | Lenguaje / licencia detectada por GitHub | Uso potencial | Decisión provisional |
|---|---|---|---|
| [OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk) | Python / MIT | SDK modular para agentes de ingeniería | POC candidato. Revisar instalación, ejecución aislada, dependencias y uso de modelos. |
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | TypeScript / MIT | Agente de programación completo; lenguaje cercano al stack de la web | Candidato para comparar como motor externo/CLI. No importar todo el repositorio al proyecto web. |
| [SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | Python / MIT | Ejecutor ligero de tareas de programación | Candidato a ejecutor de incidencias; verificar requisitos y controles del entorno. |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | Python / Apache-2.0 | Flujo de programación con Git y cambios revisables | Referencia para flujos Git y revisión, no primera opción para integrar en Next.js. |
| [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | Pendiente de auditoría específica de licencia y runtime | Entorno más amplio de agente de ingeniería | Referencia arquitectónica; evaluar coste y complejidad. |
| [cline/cline](https://github.com/cline/cline) | Pendiente de auditoría específica de licencia y runtime | Agente de programación con aprobaciones y herramientas | Estudiar permisos y ciclo de confirmación humana. |
| [block/goose](https://github.com/block/goose) | Pendiente de confirmar URL canónica, licencia y runtime | Agente extensible | No adoptar hasta verificar metadatos y repositorio canónico. |

Las licencias de la tabla son metadatos del repositorio, no una revisión legal completa de dependencias, componentes de terceros o archivos individuales. Antes de copiar código hay que revisar el archivo LICENSE, avisos de copyright y licencias transitivas.

## Recomendación técnica inicial

No mezclar varios agentes completos ni crear un sistema multiagente complejo todavía. Primero hacer una prueba comparativa pequeña:

1. **OpenCode** como candidato de motor TypeScript independiente.
2. **OpenHands SDK** como candidato de SDK Python.
3. **mini-swe-agent** como alternativa ligera para tareas puntuales.

La prueba debe usar una rama temporal del repositorio principal y una incidencia concreta, sin secretos ni datos reales. Comparar: capacidad de leer el repo, proponer cambios, ejecutar pruebas, mostrar un diff, detenerse ante permisos insuficientes, consumo de modelo y facilidad para revertir. No hay una prueba de ejecución completada todavía.

## Diseño del agente propio

- **Coordinador:** catálogo de repositorios, tareas, estado y asignación de trabajo.
- **Adaptador GitHub:** lectura de repositorios, ramas, incidencias, commits y PRs mediante permisos mínimos.
- **Motor intercambiable:** evita acoplar la plataforma a un solo proveedor de IA.
- **Ejecutor aislado:** tareas en un entorno temporal, sin credenciales de producción por defecto.
- **Revisor:** diff, pruebas, riesgos, archivos tocados y pasos de reversión.
- **Acceso multiusuario:** cada persona autoriza su cuenta; se registra el alcance exacto de sus permisos.
- **Control de cambios:** escritura solo en ramas de trabajo. Merge, despliegue, cambios en Supabase, pagos y secretos requieren aprobación explícita.

## Búsqueda de repositorios

La búsqueda debe mantenerse abierta a proyectos públicos relevantes: agentes de código, SDKs, sandboxes, adaptadores GitHub, MCP, evaluación, seguridad y ejecución de tareas. La lista de candidatos se amplía con búsquedas adicionales, pero ningún proyecto se considera seguro o apto por tener muchas estrellas.

## Límites actuales

- La CLI puede consultar catálogos y buscar metadatos; no es todavía una aplicación multiusuario.
- OAuth/GitHub App, almacenamiento cifrado de credenciales, sandbox de ejecución y conexión al modelo todavía no están implementados.
- No se ha ejecutado una prueba comparativa de los agentes.
- Los modelos, API y alojamiento pueden tener coste aunque el código sea abierto.
