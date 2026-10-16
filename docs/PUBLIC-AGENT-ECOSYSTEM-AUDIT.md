# Auditoría del ecosistema público de agentes de programación

Fecha de revisión inicial: 16 de octubre de 2026.

El objetivo no es incorporar todo GitHub ni combinar a ciegas proyectos incompatibles. El objetivo es buscar repositorios públicos relevantes, leer sus licencias, arquitectura, dependencias, historial y límites operativos, y reutilizar módulos concretos para construir un agente propio que ayude a terminar la plataforma existente.

## Candidatos de ingeniería

| Repositorio | Uso potencial | Decisión inicial |
|---|---|---|
| OpenHands/OpenHands | Orquestación y ejecución de tareas de ingeniería | Estudiar arquitectura; no copiar el producto entero |
| OpenHands/software-agent-sdk | SDK para construir agentes de ingeniería | Evaluar API y compatibilidad |
| anomalyco/opencode | Agente TypeScript y abstracción de herramientas/modelos | Comparar arquitectura con OpenHands |
| cline/cline | Aprobación humana y ejecución de herramientas | Estudiar el modelo de permisos |
| Aider-AI/aider | Flujo Git y cambios revisables | Adoptar patrones, no importar la aplicación Python completa |
| SWE-agent/mini-swe-agent | Ciclo de resolución de incidencias más pequeño | Evaluar como ejecutor especializado |
| SWE-agent/SWE-agent | Herramientas y evaluación de tareas de código | Referencia de investigación, comparar con mini-swe-agent |
| block/goose | Agente local extensible y conectores | Evaluar solo si encaja con el entorno disponible |
| openai/codex | Patrones de agente de programación y aislamiento | Revisar licencia, requisitos y compatibilidad antes de cualquier uso |
| google-gemini/gemini-cli | Agente CLI y herramientas | Alternativa, no dependencia obligatoria |
| modelcontextprotocol/servers | Conectores reutilizables mediante MCP | Elegir servidores específicos tras auditar permisos y mantenimiento |
| Kilo-Org/kilocode | Agente de programación con modos de trabajo | Comparar, evitando duplicar funciones ya elegidas |
| langchain-ai/deepagents | Patrones de agentes con planificación y herramientas | Evaluar si la complejidad adicional se justifica |
| microsoft/autogen | Coordinación multiagente | No adoptar sin demostrar que necesitamos varios agentes |
| continuedev/continue | Integración con entornos de desarrollo | Verificar estado de mantenimiento y adecuación antes de adoptar |

## Reglas para la auditoría

Para cada repositorio candidato hay que registrar:
1. URL, licencia real en el archivo LICENSE y avisos de terceros.
2. Actividad reciente, releases, issues abiertos, estado archivado y responsables.
3. Lenguaje, estructura, dependencias, versión de runtime y tamaño de la integración.
4. Capacidades exactas: lectura, edición, ejecución de comandos, pruebas, Git, PRs, MCP y permisos.
5. Requisitos de modelos, claves, contenedores, máquinas virtuales, red y coste.
6. Riesgos de ejecución de código, exposición de secretos, prompt injection y acceso a otros repositorios.
7. Qué módulo concreto se reutilizaría, por qué, cómo se probaría y cómo se revertiría.

## Arquitectura prevista para Plataforma Sindical

- Un **coordinador** mantiene el catálogo de repositorios y asigna cada tarea al repositorio propietario.
- Los **adaptadores** permiten cambiar de agente o proveedor de modelo sin rehacer la plataforma.
- Los **conectores** leen repositorios, incidencias, documentación y resultados de pruebas.
- Un **entorno aislado** ejecuta las comprobaciones y limita las escrituras.
- Un **revisor** entrega diff, pruebas, riesgos y recomendaciones.
- Las modificaciones empiezan en ramas de trabajo. Fusionar, cambiar datos reales, tocar secretos o desplegar requiere autorización explícita.

## No confundir “incluir todos” con mezclar el código

Los repositorios se integran en el catálogo de conocimiento y herramientas del agente, no necesariamente como dependencias del mismo programa. Copiar aplicaciones enteras produciría conflictos de lenguajes, dependencias, licencias, ejecución y seguridad. Solo se incorporarán componentes justificados y comprobados.

## Estado de verificación

La primera exploración ha confirmado que los repositorios anteriores son accesibles públicamente y ha consultado metadatos como rama principal y estado archivado en GitHub. Esto no equivale a una auditoría completa de código ni confirma que todos sean aptos para reutilización. Las licencias y los requisitos deben comprobarse individualmente antes de adoptar código.
