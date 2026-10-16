# Primera inspección de la web principal

Fecha: 16 de octubre de 2026. Inspección de solo lectura de archivos públicos de la rama `main`; no se ejecutó el proyecto ni se consultó la base de datos o Vercel.

## Base técnica observada

- Next.js `^15.5.27`, React `^19.1.0`, TypeScript `^5`, Tailwind CSS `^4.1.0`.
- Node declarado en `package.json`: `24.x`.
- Scripts disponibles: `dev`, `build`, `start`, `lint`. No hay script `test` declarado en `package.json`.
- PDF/credenciales visuales: `jspdf`, `html2canvas`, `qrcode`.
- La integración de Supabase se implementa mediante llamadas REST propias en `lib/supabase-server.ts`; no aparece `@supabase/supabase-js` en el manifiesto revisado.
- El helper de Supabase documenta los nombres reales de columnas de `intentos_test`, `certificados` y `afiliados`; las rutas revisadas usan nombres como `total_preguntas`, `fecha_intento` y `codigo_certificado`.

## Archivos revisados

- `package.json`
- `next.config.mjs`
- `lib/supabase-server.ts`
- `app/api/tests/result/route.ts`
- `app/api/certificados/iniciar/route.ts`
- `app/api/certificados/notify/route.ts`

## Observaciones que requieren verificación

1. **Falta de pruebas automatizadas declaradas en package.json.** Hay que revisar si existen tests o workflows adicionales antes de concluir que no hay pruebas en todo el repositorio. Añadir una estrategia de pruebas sin cambiar el flujo de pago.
2. **Certificados y pago myPOS son zonas críticas.** No tocar el flujo de emisión, la firma de notificaciones ni los secretos sin pruebas aisladas y una revisión específica.
3. **Supabase depende del esquema real.** Antes de modificar consultas, comparar cada columna con el esquema de producción y mantener el acceso a datos reales fuera de las pruebas.
4. **Configuración de cabeceras HTTP.** `next.config.mjs` define `nosniff`, `Referrer-Policy` y `Permissions-Policy`. No se ha auditado aún la política CSP ni el resto de controles de seguridad.
5. **No se ejecutó build ni lint.** El acceso de lectura al código no equivale a una validación ejecutada.

## Orden recomendado para terminar la web

1. Inspeccionar todos los flujos y los tests/workflows existentes sin cambiar archivos.
2. Ejecutar `npm run lint` y `npm run build` en un entorno aislado con dependencias instaladas.
3. Crear una lista priorizada de fallos reproducibles y cubrir primero afiliación, resultado aprobado y certificado.
4. Arreglar cada fallo en una rama separada con diff pequeño y pruebas.
5. Probar pagos con entorno de pruebas/proveedor y datos ficticios; nunca usar cobros reales para verificar cambios.
6. Abrir PRs revisables; no fusionar ni desplegar sin autorización explícita.

## Límites

No se ha accedido a secretos, a datos de afiliados, a Supabase ni a la configuración de Vercel. No se afirma que el flujo de pago funcione correctamente o falle: solo se ha leído el código citado.

## Segunda inspección: ruta de prueba y certificado (solo lectura)

Archivos adicionales consultados en la rama `main` del repositorio de la web:
- `app/prueba-certificado/page.tsx`
- `app/prueba-certificacion/page.tsx`
- `components/certificate-preview.tsx`
- `components/course-exam.tsx`
- `app/certificado/[id]/page.tsx`
- `tests/e2e/test-flow.spec.ts`
- `app/api/tests/submit/route.ts`
- `app/api/tests/result/route.ts`
- `app/api/certificados/iniciar/route.ts`
- `app/api/certificados/pago/route.ts`
- `app/api/certificados/estado/route.ts`
- `app/api/certificados/notify/route.ts`

### Ruta de previsualización

1. `/prueba-certificado` redirige a `/prueba-certificacion?prueba=1`.
2. La página de prueba muestra un aviso de entorno simulado y pasa a `CertificatePreview` con una puntuación de 18/20.
3. `CertificatePreview` detecta `prueba=1`, establece el código `SDO-PRUEBA-INTERNA` y activa la vista confirmada sin consultar el checkout.
4. Su función de inicio de pago contiene un retorno temprano para la prueba interna y no debe llamar a `/api/certificados/iniciar`.

**Conclusión del código leído:** la ruta de prueba está diseñada para evitar pagos reales. No se pudo confirmar el comportamiento del despliegue activo porque no se abrió el sitio en un navegador ni se ejecutó una prueba E2E contra producción. Si el sitio publicado sigue llevando al pago desde esa URL, hay que comparar el commit desplegado con `main` y reproducir la ruta exacta antes de tocar código.

### Flujo real tras aprobar

- El cliente envía las respuestas a `/api/tests/submit`; el servidor calcula la puntuación y guarda el intento.
- `/api/tests/result` recupera un intento aprobado por afiliado y curso para restaurar el aprobado.
- `/api/certificados/iniciar` valida en servidor que el intento exista, esté aprobado, pertenezca al curso y corresponda a la afiliación; después prepara/reutiliza el certificado.
- `/api/certificados/pago` genera la petición firmada de checkout myPOS.
- `/api/certificados/notify` valida la firma de la notificación y actualiza el estado del certificado.
- `/api/certificados/estado` solo informa emisión cuando `pago_realizado` es verdadero y `estado` es `emitido`.
- `app/certificado/[id]/page.tsx` no confía en `score` ni `total` enviados por el navegador: valida el intento o el código del certificado en servidor.

### Hueco de cobertura detectado

El E2E existente cubre la ruta de test interna `/pruebas/test` y algunas denegaciones de acceso a certificados, pero **no incluye una prueba explícita para `/prueba-certificado` que compruebe que aparece la previsualización y que no se llama a las rutas de pago**. Esa debería ser la primera prueba automatizada añadida en una rama de trabajo, con datos ficticios y sin modificar producción.

### Límites de esta inspección

Es un análisis de código estático; no se ha hecho ningún cargo, petición a datos reales, cambio de archivos en la web principal ni despliegue. No demuestra que el flujo completo funcione en el entorno publicado.

