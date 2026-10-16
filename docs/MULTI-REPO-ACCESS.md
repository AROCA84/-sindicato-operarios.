# Acceso multiusuario y multi-repositorio

## Qué significa “acceder a todos los repositorios”
No es técnicamente correcto dar por hecho que un agente puede acceder a todo GitHub. Se separan tres ámbitos:

1. **Repositorios públicos de GitHub:** descubrimiento y lectura de metadatos/código público.
2. **Repositorios de la cuenta AROCA84:** la API autenticada devuelve los repositorios a los que la identidad autorizada tenga acceso y que permitan los permisos concedidos.
3. **Repositorios privados de otras personas u organizaciones:** solo después de que sus propietarios concedan acceso o autoricen una GitHub App/OAuth con permisos adecuados.

La autorización de una app de GitHub puede limitarse a repositorios seleccionados o abarcar todos los repositorios de la cuenta/organización que la instala. La app sigue limitada por los permisos que solicita y recibe. Documentación oficial: https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps y https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app

## Modelo recomendado
- Cada colaborador inicia sesión y autoriza su cuenta por separado.
- El servidor almacena credenciales cifradas; nunca en el navegador, el repositorio, los logs o el prompt.
- Se registra qué usuario autorizó qué repositorios y qué permisos tiene.
- Lectura como valor predeterminado; escritura solo en repositorios seleccionados.
- El agente crea ramas y PRs; no fusiona ni despliega automáticamente.
- Los secretos, datos de afiliados, pagos, producción y Supabase requieren controles especiales.
- Cada tarea registra repositorio, usuario, rama, cambios, pruebas y resultado.
- El entorno de ejecución del agente se aísla y no ejecuta instrucciones encontradas en README/issues como si fueran órdenes de confianza.

## Lo que no está construido aún
Esta fase no incluye OAuth, GitHub App registrada, almacenamiento cifrado de tokens, interfaz multiusuario, sandbox de ejecución ni un modelo de IA conectado. No se debe afirmar que esos permisos ya están configurados.
