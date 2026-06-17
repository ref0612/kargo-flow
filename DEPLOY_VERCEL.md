# 🚀 Guía de Despliegue en Vercel

Este documento describe cómo desplegar **Kargo Flow** en Vercel sin restricciones.

## Requisitos Previos

- Una cuenta en [Vercel](https://vercel.com)
- Git configurado localmente
- Node.js 20.x o superior

## Configuración Automática

### 1. Conectar el Repositorio

```bash
# Vercel detectará automáticamente este proyecto como TanStack Start + Vite
# y usará la configuración de `vercel.json`
```

### 2. Variables de Entorno

En el panel de Vercel, añade las variables requeridas:

```env
NODE_ENV=production
VITE_APP_NAME=Kargo Flow
VITE_API_URL=https://api.ejemplo.com
```

## Archivos de Configuración

### `vercel.json`
- Define el comando de build: `npm run build`
- Especifica el directorio de salida: `dist`
- Configura headers de caché para activos estáticos
- Aumenta memory y timeout de funciones serverless

### `.vercelignore`
- Excluye `node_modules` y archivos de desarrollo
- Reduce el tamaño del despliegue

### `vite.config.ts`
- Minificación con Terser optimizado
- Code splitting automático
- Sourcemaps desactivados en producción
- Compresión CSS y JS

## Límites de Vercel (Configurados)

- **Timeout de función**: 60 segundos ✅
- **Memoria**: 3008 MB (máximo disponible) ✅
- **Tamaño de función**: ~50 MB (optimizado) ✅
- **Build time**: ~5-10 minutos

## Características Habilitadas

✅ Caché de activos estáticos (1 año)
✅ Revalidación automática de HTML
✅ Compresión Gzip/Brotli
✅ Code splitting inteligente
✅ Headers de seguridad (CSP, CORS)
✅ SSR (Server-Side Rendering)
✅ Error handling mejorado

## Proceso de Despliegue

### Opción 1: Desde Git (Recomendado)

```bash
# 1. Push a la rama main
git push origin main

# 2. Vercel se despliega automáticamente
# Monitorea el progreso en https://vercel.com
```

### Opción 2: CLI de Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel deploy --prod

# Con variables de entorno
vercel deploy --prod --env NODE_ENV=production
```

### Opción 3: GitHub Actions

Puedes configurar un workflow automático para Vercel:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Optimizaciones Aplicadas

### 1. Build Optimization
- Minificación de JS/CSS
- Code splitting por vendor
- Terser con 2 pasadas de compresión
- Sin sourcemaps en producción

### 2. Runtime Optimization
- Node.js 20.x runtime
- 3GB de memoria disponible
- Timeout de 60 segundos
- Caché de módulos npm

### 3. Network Optimization
- Caché de 1 año para activos versionados
- Revalidación de HTML cada request
- Headers de compresión
- Headers de seguridad

## Troubleshooting

### Error: "Build failed"
```bash
# Revisa los logs de Vercel en el dashboard
# Asegúrate de que NODE_ENV=production está configurado
vercel logs --follow
```

### Error: "Function too large"
```bash
# Verifica el tamaño del build
du -sh dist/

# Si > 50MB, revisa las dependencias innecesarias
npm ls
```

### Error: "Timeout"
```bash
# Aumenta el timeout (ya está en 60s en vercel.json)
# O optimiza la lógica del servidor
```

### Performance: Slow builds
```bash
# Usa npm ci en lugar de npm install
npm ci --prefer-offline

# Habilita caché de Vercel
vercel env pull
```

## Monitoreo Post-Despliegue

1. **Analytics**: Accede a Vercel Dashboard → Analytics
2. **Logs**: `vercel logs` en la CLI
3. **Monitoring**: Integra con Sentry o similar
4. **Performance**: Usa Vercel's Web Vitals

## Rollback

```bash
# Revierte a un despliegue anterior
vercel rollback

# O desde el dashboard: Deployments → Previous → Promote
```

## Comandos Útiles

```bash
# Ver estado actual
vercel status

# Ver variables de entorno
vercel env ls

# Inspeccionar función
vercel inspect

# Logs en tiempo real
vercel logs --follow --tail

# Limpiar build cache
vercel cache clear
```

## Configuración Adicional (Opcional)

### Custom Domain
```bash
vercel domain add tu-dominio.com
```

### Email Notifications
```bash
# Configura notificaciones en Vercel Dashboard
# Team Settings → Integrations → Email
```

### Monitoreo Avanzado
```bash
# Integra con servicios de monitoreo
# - Sentry para error tracking
# - DataDog para APM
# - LogRocket para sesiones
```

## Contacto y Soporte

Para más información:
- [Documentación Vercel](https://vercel.com/docs)
- [TanStack Start Docs](https://tanstack.com/router/latest/docs/framework/react/start/overview)
- [GitHub Issues](https://github.com/ref0612/kargo-flow/issues)

---

**Última actualización**: 2024
**Versión**: 1.0.0
