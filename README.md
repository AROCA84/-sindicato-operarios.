# PLATAFORMA SINDICAL — Agente técnico

Agente en construcción para ayudar a terminar la web de **PLATAFORMA SINDICAL / SINDICATO DE OPERARIOS**, coordinando los repositorios existentes y permitiendo que las personas trabajen sobre ellos de forma ordenada.

## Estado real
**Fase 0 — catálogo y coordinador de solo lectura.** Este repositorio ya contiene un catálogo inicial y una CLI sin dependencias externas. Todavía no es un agente autónomo con IA: no edita código de otros repositorios ni ejecuta cambios remotos.

## Comandos
Requiere Node.js 24 o posterior.

```bash
npm run repos   # muestra los repositorios registrados
npm run check   # consulta visibilidad/metadata en GitHub, solo lectura
npm run plan    # muestra las reglas de trabajo seguro
npm test        # valida catálogo y política
```

Para consultar repositorios públicos no hace falta token. Para repositorios privados, configura `GITHUB_TOKEN` localmente con el mínimo permiso de lectura necesario; nunca lo guardes en el repositorio ni lo compartas en el chat.

## Repositorios registrados
El catálogo está en `config/repositories.json`. Los repositorios originales se conservan separados. El agente debe identificar piezas reutilizables y sus licencias antes de proponer incorporarlas.

## Próximas fases
1. Verificar todos los repositorios y actualizar el catálogo con la evidencia real.
2. Auditar arquitectura, licencias, dependencias, secretos, pruebas y solapamientos.
3. Crear una capa de conectores para GitHub y un adaptador de agente/modelo configurable.
4. Añadir entorno de ejecución aislado y lista permitida de pruebas.
5. Generar cambios en ramas y PRs con informe de pruebas y riesgos.
6. Mantener el bloqueo de merge y despliegue hasta autorización explícita.

Consulta [arquitectura](docs/ARCHITECTURE.md) y [reglas de seguridad](docs/SAFETY.md).
