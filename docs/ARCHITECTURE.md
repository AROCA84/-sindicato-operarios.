# Arquitectura inicial

## Objetivo
Un espacio de trabajo central para coordinar la finalización de PLATAFORMA SINDICAL y SINDICATO DE OPERARIOS, aprovechando código existente sin destruir ni mezclar repositorios indiscriminadamente.

## Capas previstas
1. **Catálogo**: inventario de repositorios, propósito, rama por defecto, accesibilidad, licencia y estado.
2. **Auditoría**: lectura de README, manifiestos, árbol de archivos, historial, PRs, tests, licencias y secretos expuestos (sin imprimir secretos).
3. **Planificador**: propone tareas ordenadas por riesgo e impacto y asigna cada tarea al repositorio propietario.
4. **Adaptadores de agentes/modelos**: interfaz desacoplada para conectar un modelo o agente compatible cuando se disponga de acceso legítimo y presupuesto/plan adecuado.
5. **Entorno de trabajo aislado**: cambios en ramas o worktrees separados; comandos de prueba con lista permitida.
6. **Revisión y entrega**: diff explicable, pruebas ejecutadas, riesgos y PR. Sin merge ni despliegue automático.

## Estrategia de reutilización
No importar repositorios completos como si fueran carpetas de la aplicación. Primero compararlos, identificar componentes útiles y sus licencias, comprobar dependencias y adaptar selectivamente. Mantener atribuciones y licencias.

## Limitación actual
Este commit inicial es un coordinador CLI de solo lectura y catálogo multi-repositorio. Todavía no incorpora un modelo LLM, ejecución aislada de código ni capacidad autónoma para modificar repositorios. Esas piezas se añaden tras validar el entorno y los permisos.
