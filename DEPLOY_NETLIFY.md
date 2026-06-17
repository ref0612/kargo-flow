# 🚀 Guía de Despliegue en Netlify

## Paso 1: Preparar el Repositorio

Los cambios ya están pusheados a GitHub. ✅

## Paso 2: Conectar a Netlify

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a https://app.netlify.com
2. Haz clic en **"New site from Git"**
3. Selecciona **GitHub**
4. Autoriza Netlify en GitHub (si es primera vez)
5. Busca y selecciona **`kargo-flow`**
6. Configura:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. Haz clic en **"Deploy site"**

### Opción B: Desde CLI (Más Rápido)

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Link proyecto
cd C:\Users\ferna\Desktop\kargo-flow
netlify init

# 4. Selecciona:
#    - Create & configure a new site
#    - Team: (tu account)
#    - Site name: kargo-flow (o tu nombre)
#    - Build command: npm run build
#    - Publish directory: dist

# 5. Deploy
netlify deploy --prod
```

---

## Paso 3: Configurar Variables de Entorno

En https://app.netlify.com → Tu Site → **Settings** → **Build & deploy** → **Environment**

Añade estas variables:

```
NODE_ENV=production
NODE_VERSION=20.11.0
NPM_VERSION=10.0.0
VITE_APP_NAME=Kargo Flow
VITE_API_URL=https://api.ejemplo.com
```

---

## Paso 4: Verificar Despliegue

1. Después del primer deploy, verifica:
   - ✅ Build completó sin errores
   - ✅ Sitio está online
   - ✅ Prueba la URL

2. Monitorea los logs:
   ```bash
   netlify logs
   ```

---

## 🔄 Despliegues Automáticos

Después del primer setup, cada push a `main` desplegará automáticamente:

```bash
git add .
git commit -m "Update config"
git push origin main
# ✅ Netlify detecta el push y despliega automáticamente
```

---

## 📊 Comparativa: Netlify vs Alternativas

| Característica | Netlify | Vercel | Railway |
|---|---|---|---|
| **Setup** | 5 min | 5 min | 2 min |
| **Precio** | Gratis | Gratis | $5/mes |
| **Deploy Automático** | ✅ | ✅ | ✅ |
| **SSL/HTTPS** | ✅ | ✅ | ✅ |
| **Analytics** | ✅ | ✅ | ✅ |
| **Soporte SSR** | ✅ | ✅ | ✅ |

---

## 🛠️ Troubleshooting

### Build falla
```bash
# Verifica logs
netlify logs

# Prueba local
npm run build
```

### Sitio no responde
- Verifica que `dist` tiene contenido
- Revisa `netlify.toml`
- Reconstruye: `netlify deploy --prod --trigger`

### Página en blanco
- Abre DevTools (F12)
- Revisa console por errores
- Verifica que `.vercelignore` no está bloqueando archivos

---

## 📱 Comandos Útiles

```bash
# Ver estado
netlify status

# Logs de build
netlify logs

# Deploy local
netlify deploy

# Deploy a producción
netlify deploy --prod

# Abrir dashboard
netlify open

# Listar sites
netlify sites:list
```

---

## 🌍 Configurar Dominio Personalizado

En https://app.netlify.com → Tu Site → **Domain management**

1. Haz clic en **"Add domain"**
2. Ingresa tu dominio
3. Sigue las instrucciones para DNS
4. ¡Listo!

---

## 📞 Soporte

- [Netlify Docs](https://docs.netlify.com)
- [TanStack Start Docs](https://tanstack.com/router/latest/docs/framework/react/start/overview)
- [Netlify Support](https://support.netlify.com)

---

**Configuración lista**: Netlify está 100% configurado
**Próximo paso**: Conectar desde https://app.netlify.com
