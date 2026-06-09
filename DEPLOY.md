# 🚀 GUÍA DE DESPLIEGUE - MockAgent.AI

## FASE 1: BASE DE DATOS (PlanetScale)

1. Ve a https://planetscale.com y regístrate (gratis, no requiere tarjeta)
2. Crea una base de datos:
   - Name: `mockagent`
   - Region: `eu-west` (o la más cercana a ti)
3. Ve a **Settings** → **Passwords** → **New password**
4. Copia el **connection string** (formato: `mysql://usuario:password@host:3306/mockagent?sslmode=require`)
5. Guarda el usuario, password y host (los necesitarás para Railway)

## FASE 2: BACKEND (Railway)

1. Ve a https://railway.app y regístrate con GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Selecciona `Arturo3579/TFG-MockAgent`
4. Ve a **Variables** (pestaña del proyecto) y añade:
   - `DATABASE_URL` → `jdbc:mysql://HOST:3306/mockagent?useSSL=true&serverTimezone=UTC` (sustituye HOST por el de PlanetScale)
   - `DATABASE_USERNAME` → usuario de PlanetScale
   - `DATABASE_PASSWORD` → contraseña de PlanetScale
   - `JWT_SECRET` → genera una clave larga aleatoria (mínimo 32 caracteres, puedes usar https://jwtsecret.com/generate)
5. Railway detectará automáticamente el Dockerfile y hará deploy
6. Copia la URL que Railway te da (ej: `https://mockagent.up.railway.app`)

## FASE 3: FRONTEND (Vercel)

1. Ve a https://vercel.com y regístrate con GitHub
2. **Add New Project** → importa `TFG-MockAgent`
3. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. En **Environment Variables**, añade:
   - `VITE_API_URL` → `https://TU-URL-DE-RAILWAY` (sin barra final, ej: `https://mockagent.up.railway.app`)
5. **Deploy**
6. Vercel te da una URL tipo `https://mockagent-ai.vercel.app`

## FASE 4: DOMINIO CUSTOM (mockagentai.com)

1. Ve a tu panel de dominios (Namecheap, GoDaddy, etc.) donde compraste `mockagentai.com`
2. Añade un **CNAME record**:
   - Name: `@` (o `www` si prefieres)
   - Value: `cname.vercel-dns.com` (Vercel te dice exactamente cuál)
3. En Vercel, ve a **Project Settings** → **Domains** → añade `mockagentai.com`
4. Vercel verificará el DNS (tarda 1-24 horas en propagarse)

## FASE 5: STRIPE (al final, cuando todo funcione)

1. Ve a https://dashboard.stripe.com (modo Test)
2. **Products** → **Add product**:
   - "MockAgent Pro" → $4.99 / Recurring / Monthly → copia Price ID
   - "MockAgent Premium" → $7.99 / Recurring / Monthly → copia Price ID
3. **Developers** → **API keys** → copia Secret key (`sk_test_...`)
4. **Developers** → **Webhooks** → **Add endpoint**:
   - URL: `https://TU-URL-DE-RAILWAY/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copia Signing secret (`whsec_...`)
5. Ve a Railway → Variables y añade:
   - `STRIPE_SECRET_KEY` → `sk_test_...`
   - `STRIPE_WEBHOOK_SECRET` → `whsec_...`
   - `STRIPE_PRICE_PRO_MONTHLY` → `price_...`
   - `STRIPE_PRICE_PREMIUM_MONTHLY` → `price_...`
6. Actualiza el frontend: cambia el botón "Upgrade a Pro (simulado)" por el checkout real de Stripe

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de cada fase, verifica:
- [ ] PlanetScale: la base de datos está activa
- [ ] Railway: el backend responde en `https://tu-url/api/auth/health` (o `/api/auth/logout` que devuelve 200)
- [ ] Vercel: el frontend carga y puedes navegar entre páginas
- [ ] Login/Signup: puedes crear una cuenta y hacer login
- [ ] Dashboard: puedes crear endpoints y ver logs
- [ ] Dominio: `https://mockagentai.com` carga la app

## 🆘 SI ALGO FALLA

- **Backend no conecta a DB**: verifica que la URL de PlanetScale incluye `?useSSL=true`
- **CORS error**: verifica que la URL de Vercel está en `SecurityConfig.java`
- **Frontend 404 al recargar**: verifica que `vercel.json` está en el repo
- **Railway no detecta Dockerfile**: ve a Settings → Dockerfile Path → `backend/backend/Dockerfile`

## 📞 CONTACTO

Para cualquier problema, revisa los logs en Railway (pestaña Deployments) y en Vercel (pestaña Functions).
