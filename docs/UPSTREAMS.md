# Repositorios externos candidatos para integrar

No se deben copiar repositorios completos sin análisis. La idea es tomar módulos bien delimitados y conservar sus licencias y atribuciones.

## Candidatos prioritarios

1. **[OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)** — licencia MIT consultada en su archivo LICENSE. Referencia principal para la experiencia de agente, orquestación y arquitectura de control. Es un proyecto grande; no conviene volcarlo entero dentro de este repositorio.
2. **[OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk)** — SDK modular de agentes. Estudiar si aporta una interfaz útil para herramientas, ejecución y conversaciones.
3. **[OpenHands/typescript-client](https://github.com/OpenHands/typescript-client)** — cliente TypeScript para hablar con el servidor de agentes; candidato si elegimos una arquitectura basada en Agent Server.
4. **[OpenHands/automation](https://github.com/OpenHands/automation)** — automatización, planificación y disparadores. Revisar requisitos de despliegue y coste antes de adoptarlo.
5. **[SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent)** — referencia para resolver tareas de ingeniería a partir de incidencias y evaluar cambios en repositorios.

## Decisión provisional

- Usar OpenHands como referencia arquitectónica, no importar todo su código.
- Mantener el catálogo de nuestros repositorios separado de los upstreams externos.
- Antes de incluir un módulo: leer licencia actual, dependencias, versión, instrucciones de seguridad, requisitos de Docker/VM, proveedor de modelo y costes.
- No prometer operación gratuita permanente: un agente de código necesita entorno de ejecución y, normalmente, un modelo; la licencia abierta no hace gratuitos los servidores ni las APIs.
- El agente debe coordinar varios repositorios sin destruir sus historiales ni convertirlos a la fuerza en un monorepo.

## Enlaces
- https://github.com/OpenHands/OpenHands
- https://github.com/OpenHands/software-agent-sdk
- https://github.com/OpenHands/typescript-client
- https://github.com/OpenHands/automation
- https://github.com/SWE-agent/SWE-agent
