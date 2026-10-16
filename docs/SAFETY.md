# Reglas de seguridad y autorización

- La web principal de producción nunca es un entorno de experimentación.
- Leer e inventariar puede hacerse en modo de solo lectura.
- Toda modificación de código debe ir primero a una rama dedicada.
- Antes de editar: registrar rama base, commit inicial, archivos afectados y plan de pruebas.
- No fusionar PRs ni desplegar a producción sin autorización explícita del usuario.
- No crear, leer, imprimir, copiar ni registrar valores de secretos (.env, service-role keys, tokens o credenciales de pago).
- No ejecutar scripts de repositorios externos sin revisión previa.
- No mezclar bases de datos, autenticación, pagos ni variables de entorno de proyectos distintos.
- No asumir que un 404 significa que un repositorio no existe: puede ser privado o estar fuera del alcance de la conexión.
- No borrar repositorios ni historiales para “unificarlos”. La coordinación se hace con un catálogo y cambios selectivos revisables.
- Antes de reutilizar código, comprobar licencia, dependencias, vulnerabilidades y compatibilidad.
- Informar con precisión qué se ha leído, qué se ha probado y qué no se ha podido ejecutar.
