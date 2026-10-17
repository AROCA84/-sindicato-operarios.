# Arranque inicial del agente colaborativo

## Componentes elegidos

- [OpenHands Agent Canvas](https://github.com/OpenHands/OpenHands): interfaz y control de agentes.
- [OpenHands Software Agent SDK](https://github.com/OpenHands/software-agent-sdk): runtime de agentes usado por el ecosistema OpenHands.
- [MCP servers](https://github.com/modelcontextprotocol/servers): conectores opcionales; instalar solo los necesarios.

No se copian repositorios enteros al código del agente. Se utilizan sus distribuciones oficiales y se conserva la licencia de cada componente.

## Requisitos

- Docker Engine/Desktop con Compose.
- Un proveedor/modelo compatible configurado en OpenHands. El código abierto no incluye automáticamente inferencia gratuita.
- Una copia de trabajo del repositorio web en una rama que no sea `main`.

## Preparar la copia de trabajo del sindicato

Desde una terminal en una máquina de confianza:

```bash
mkdir -p "$HOME/sindicato-agent-workspace"
cd "$HOME/sindicato-agent-workspace"
git clone https://github.com/AROCA84/-sindicato-operarios.git website
cd website
git switch -c agent/workspace-first-task
```

Si ya tienes el repositorio clonado, no vuelvas a clonarlo: crea una rama nueva desde la versión actualizada de `main`.

## Arrancar localmente

Desde el repositorio del agente, establece la ruta absoluta de la carpeta que contiene la copia de trabajo:

```bash
export PROJECTS_PATH="$HOME/sindicato-agent-workspace"
docker compose -f deploy/agent-canvas/compose.yaml up -d
```

Abre [http://localhost:8000](http://localhost:8000) en esa misma máquina y configura un proveedor de modelo en la interfaz si te lo solicita.

## Seguridad obligatoria

- La configuración enlaza el puerto a `127.0.0.1`; no lo expongas directamente a Internet.
- Esta configuración es para arrancar y validar localmente, no constituye un despliegue multiusuario público.
- Para dar acceso a colaboradores desde Internet se necesita un servidor persistente con HTTPS, autenticación, aislamiento por usuario y almacenamiento seguro de credenciales. No publicar este contenedor sin esas protecciones.
- El agente debe trabajar en ramas y proponer PRs. No autorizar merge ni despliegue automático.
- Nunca proporcionar acceso al directorio de producción, secretos, credenciales de Supabase ni datos reales.
- Cada colaborador debe tener su propio acceso GitHub. Un repositorio público permite leer el código, pero no concede permiso de escritura.

## Estado

La selección de repositorios y el manifiesto de arranque están preparados en esta rama. Todavía no hay una instancia pública multiusuario desplegada ni se ha ejecutado este contenedor desde GitHub. El siguiente paso operativo es probarlo en un host Docker seguro; Vercel por sí solo no sustituye ese host persistente.
