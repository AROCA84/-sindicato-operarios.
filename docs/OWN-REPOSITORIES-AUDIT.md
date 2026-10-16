# Auditoría inicial de los repositorios de PLATAFORMA SINDICAL

Fecha: 16 de octubre de 2026. Esta revisión utiliza metadatos y árboles públicos de GitHub; no implica que se haya ejecutado cada proyecto ni validado cada archivo.

## Repositorios propios encontrados

| Repositorio | Evidencia consultada | Uso recomendado |
|---|---|---|
| `AROCA84/-sindicato-operarios` | Next.js App Router; APIs de afiliación, certificados, pago myPOS, resultados de pruebas, área del afiliado, componentes y workflows de pruebas | **Código principal que hay que terminar.** Mantener como repositorio canónico y proteger producción. |
| `AROCA84/sindicato-operarios-platform` | Next.js anterior; páginas de cursos, administración, certificados, progreso, Supabase y rutas de Stripe | Referencia histórica de funcionalidades y esquemas. No copiar rutas de pago sin adaptar: las decisiones actuales usan myPOS, no Stripe. |
| `AROCA84/Web-esit` | En el árbol de la rama principal solo aparecen archivos de configuración y manifiestos básicos; no se ha confirmado una aplicación completa en ese árbol | No tratar como base funcional. Inspeccionar ramas/historial solo si aparece código útil. |
| `AROCA84/-sindicato-operarios2` | Prototipo HTML pequeño | Referencia visual o de copy, no backend ni base principal. |
| `AROCA84/Web` | Repositorio de tamaño cero en el inventario consultado | No aporta código comprobado por ahora. |
| `AROCA84/sindicato-operarios-web` | Repositorio de tamaño cero en el inventario consultado | No aporta código comprobado por ahora. |
| `AROCA84/Web-Sindicato-` | Repositorio de tamaño cero en el inventario consultado | No aporta código comprobado por ahora. |
| `AROCA84/-sindicato-operarios.` | Repositorio inicialmente vacío; ya contiene la rama `agent/bootstrap` con el andamiaje inicial del agente y una PR de borrador | Espacio de trabajo del agente mientras se verifica el acceso al destino `plataforma-sindical-tech-agent`. |

## Decisiones derivadas

1. La web principal no se debe reconstruir desde cero ni sustituir por un agente de terceros. El agente debe trabajar sobre el código existente y preservar lo que ya funciona.
2. El repositorio antiguo contiene ideas de funcionalidades, pero también referencias a Stripe y un esquema de arquitectura anterior. Se usa como fuente de comparación, no como verdad actual.
3. Los repositorios vacíos o casi vacíos no deben considerarse código reutilizable solo por su nombre.
4. La integración multi-repositorio será mediante catálogo, lectura, auditoría y cambios selectivos. No se combinarán historiales ni se copiará todo a un monorepo por defecto.
5. La primera misión del agente debe ser auditar la web canónica: scripts de test/build, workflows, estado de PRs y puntos pendientes; después proponer el plan mínimo para terminarla.

## Límites de esta auditoría

No se han ejecutado build, tests de Playwright ni validaciones contra Supabase/Vercel. Los árboles de GitHub no demuestran que todas las ramas estén vacías ni que el código sea seguro. Antes de fusionar cambios hay que comprobarlos en un entorno de pruebas.
