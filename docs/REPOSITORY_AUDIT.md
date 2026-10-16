# Auditoría inicial de repositorios propios

Fecha de revisión: 16 de octubre de 2026. Esta auditoría es una fotografía parcial basada en los archivos y árboles que la conexión GitHub ha permitido leer. No sustituye a ejecutar los proyectos ni revisar sus historiales completos.

## Repositorios localizados en la cuenta

La consulta de repositorios accesibles como propietario devolvió ocho repositorios públicos:

| Repositorio | Evidencia observada | Papel propuesto |
|---|---|---|
| `AROCA84/-sindicato-operarios` | Aplicación Next.js 15, React 19, APIs de afiliación, cursos, pruebas, área del afiliado y certificados; myPOS en las rutas de certificados según árbol de archivos | Proyecto principal. Preservar y finalizar; no reemplazar por un prototipo |
| `AROCA84/sindicato-operarios-platform` | App Next.js anterior, Supabase SDK y Stripe en package.json; documentación de despliegue y estado | Fuente histórica de ideas/código. No copiar pagos de Stripe sin adaptar a decisiones actuales |
| `AROCA84/-sindicato-operarios2` | Árbol con `index.html` | Prototipo visual/funcional, no aplicación base |
| `AROCA84/Web-esit` | package.json Next.js 16, React 19 y configuración de herramientas; árbol visible pequeño, sin app/components visibles en la primera consulta | Auditar más; no asumir que aporta una aplicación completa |
| `AROCA84/Web` | Solo `README.md` | Sin código reutilizable detectado |
| `AROCA84/sindicato-operarios-web` | Solo `README.md` | Sin código reutilizable detectado |
| `AROCA84/Web-Sindicato-` | Git repository vacío | No aporta código |
| `AROCA84/-sindicato-operarios.` | Repositorio vacío al inicio; ahora contiene esta base en la rama `agent/bootstrap` | Espacio de trabajo del agente técnico |

El repositorio `AROCA84/plataforma-sindical-tech-agent` no apareció en el listado de repositorios accesibles y las consultas previas devolvieron 404. Esto no prueba que no exista; puede ser privado, tener otro nombre o estar fuera del alcance de la conexión.

## Decisión de integración

**No fusionar repositorios enteros ni borrar sus historiales.** El objetivo es coordinar y reutilizar componentes seleccionados, no hacer un monorepo accidental.

1. Mantener `AROCA84/-sindicato-operarios` como fuente de verdad de la web actual.
2. Leer el estado actual del proyecto anterior y comparar únicamente archivos candidatos con la web principal.
3. Tomar el HTML antiguo como referencia si aún contiene diseños o recorridos que merezcan la pena.
4. No invertir tiempo en los repositorios de solo README o vacíos salvo que el usuario identifique contenido adicional.
5. Revisar licencias, dependencias, vulnerabilidades y secretos antes de copiar código.
6. Toda integración se prepara en una rama y se entrega mediante diff/PR. Sin fusión o despliegue sin permiso.

## Limitaciones verificadas

- La conexión GitHub permite leer archivos y hacer commits en la rama del repositorio de trabajo.
- Esta sesión no ha ejecutado `npm test`, build de Next.js ni Playwright localmente.
- Se añadió un workflow de GitHub Actions para probar el andamiaje cuando GitHub ejecute la rama/PR.
- No se han conectado aún un modelo LLM ni un entorno aislado para ejecutar cambios autónomos.
- La consulta de descubrimiento de la futura CLI solo podrá listar repositorios privados si el token local tiene permisos suficientes; el token nunca debe guardarse en Git.
