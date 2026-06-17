# Configuración para Netlify

Esta carpeta contiene la configuración de Netlify para deployment.

## Archivos

- `netlify.toml` - Configuración principal de Netlify

## Variables de Entorno Requeridas

Configura estas variables en el panel de Netlify (Site settings → Build & deploy → Environment):

```
NODE_ENV=production
NODE_VERSION=20.11.0
NPM_VERSION=10.0.0
```

## Despliegue Automático

Netlify se desplegará automáticamente cada vez que hagas push a `main`.

## Monitoreo

- Logs de build: https://app.netlify.com/[tu-site]/deploys
- Analytics: https://app.netlify.com/[tu-site]/analytics
