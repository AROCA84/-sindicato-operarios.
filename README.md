# PLATAFORMA SINDICAL — Agente técnico

Agente en construcción para ayudar a terminar la web de **PLATAFORMA SINDICAL / SINDICATO DE OPERARIOS**, coordinando los repositorios existentes y permitiendo que las personas trabajen sobre ellos de forma ordenada.

## Estado real
**Fase 1 — catálogo multi-repositorio y descubrimiento de solo lectura.** La CLI puede listar el catálogo, comprobar accesibilidad y descubrir repositorios de la cuenta sin modificarlos. Todavía no es un agente autónomo con IA: no edita código de otros repositorios ni ejecuta cambios remotos.

## Comandos
Requiere Node.js 24 o posterior.

```bash
npm run repos      # muestra los repositorios registrados
npm run discover   # descubre repositorios accesibles sin escribir cambios
npm run check      # consulta visibilidad/metadata en GitHub
npm run plan       # muestra las reglas de trabajo seguro
npm test           # valida catálogo y política
```

Sin token, `discover` solo puede listar repositorios públicos. Para ver repositorios privados, configura `GITHUB_TOKEN` localmente con los permisos mínimos necesarios; nunca lo guardes en el repositorio ni lo compartas en el chat.

## Repositorios
- [Catálogo propio](config/repositories.json)
- [Candidatos upstream](config/upstreams.json)
- [Auditoría inicial](docs/REPOSITORY_AUDIT.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Reglas de seguridad](docs/SAFETY.md)
- [Proyectos de agentes evaluados](docs/UPSTREAMS.md)

Los repositorios originales se conservan separados. No se copia código hasta comprobar su licencia, dependencias, seguridad y utilidad para la web principal.

## Próximas fases
1. Ejecutar las pruebas automáticas de este andamiaje.
2. Completar el inventario de todos los repositorios y sus archivos útiles.
3. Evaluar OpenHands SDK/Agent Server frente a una implementación mínima, considerando coste y entorno.
4. Añadir conexión segura a GitHub y adaptador de modelo configurable.
5. Añadir entorno de ejecución aislado, revisión de cambios y pruebas automáticas.
6. Permitir que varias personas consulten tareas, diagnósticos y PRs desde una interfaz común.
7. Mantener el bloqueo de merge y despliegue hasta autorización explícita.

La licencia abierta de una herramienta no hace gratuitos los modelos, el alojamiento ni los entornos de ejecución. No se promete coste cero hasta probar una combinación real.
