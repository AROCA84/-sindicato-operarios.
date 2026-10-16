# PLATAFORMA SINDICAL — Agente técnico

Objetivo: terminar la plataforma existente, no rehacerla desde cero. Este repositorio reúne el inventario de repositorios, la investigación de herramientas públicas y las reglas de trabajo del agente.

## Estado real
**Fase 1: coordinación multi-repositorio en modo seguro.** Hay catálogo de repositorios, descubrimiento paginado de repositorios accesibles, búsqueda de proyectos públicos y comprobaciones de metadata. Todavía no es un agente autónomo conectado a un modelo ni una aplicación multiusuario desplegada.

## Comandos
Requiere Node.js 24 o posterior.

```bash
npm run repos      # muestra el catálogo conocido
npm run discover   # descubre repositorios visibles para las credenciales disponibles
npm run search     # busca proyectos públicos de agentes y herramientas
npm run check      # comprueba metadata de repositorios registrados
npm run audit -- AROCA84/-sindicato-operarios  # auditoría estática de un repo del catálogo
npm run plan       # muestra límites de seguridad
npm test           # ejecuta pruebas del catálogo
```

La auditoría es de solo lectura: revisa metadatos, árbol de archivos, manifiestos, señales de tecnología, pruebas y workflows. No ejecuta código del repositorio auditado ni verifica por sí sola que compile.

## Acceso a repositorios
- **Públicos:** el agente puede buscar sus metadatos y leer código público.
- **Privados:** solo podrá verlos si una persona autoriza credenciales válidas con permisos suficientes. No existe un permiso mágico que abra todos los repositorios.
- **Colaboradores:** cada persona debe autorizar su propia cuenta o recibir acceso explícito al repositorio. No se comparten contraseñas ni tokens.
- **Mínimo privilegio:** comenzar con lectura; habilitar escritura solo donde haga falta, en ramas de trabajo.
- [Modelo de acceso multiusuario y multi-repositorio](docs/MULTI-REPO-ACCESS.md)

Para una prueba local con token, define `GITHUB_TOKEN` en el entorno de ejecución, nunca dentro de archivos versionados ni en el chat. No copies tokens a issues, logs o capturas.

## Repositorios y auditorías
- [Catálogo propio](config/repositories.json)
- [Candidatos públicos](config/upstreams.json)
- [Auditoría de repositorios propios](docs/OWN-REPOSITORIES-AUDIT.md)
- [Auditoría del ecosistema público](docs/PUBLIC-AGENT-ECOSYSTEM-AUDIT.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Reglas de seguridad](docs/SAFETY.md)

## Próximos pasos
1. Confirmar inventario completo de repositorios y acceso a privados.
2. Auditar licencias, dependencias, actividad y arquitectura de candidatos.
3. Elegir un solo motor de agente para evitar duplicar runtimes.
4. Añadir integración GitHub OAuth/App con permisos mínimos y aislamiento por usuario.
5. Ejecutar tareas en ramas, probar, mostrar diff y abrir PR.
6. Interfaz compartida para que varias personas gestionen tareas y resultados.
7. Merge, cambios de datos reales, secretos y despliegue siempre requieren aprobación explícita.

**Coste:** el código abierto no garantiza que los modelos, API o alojamiento sean gratuitos. La elección final debe probarse con el presupuesto disponible.
