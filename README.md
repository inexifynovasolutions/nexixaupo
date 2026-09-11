# NexiXaupo (NexiRocket-XAU Pro Max)

AI-powered gold trading robot — client verification + subscription system.

**Live:** https://nexiaupo.vercel.app  
**Domain:** nexifynova.co.uk

---

## 🗂️ Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Landing + Welcome overlay + Live demo |
| `register.html` | 4-step registration (Supabase) |
| `signin.html` | Login (Supabase) |
| `dashboard.html` | Trading robot (Supabase) |
| `admin.html` | Admin panel (Supabase) |
| `renewal.html` | Subscription renewal (Supabase) |
| `supabase-config.js` | Supabase client + helpers |
| `vercel.json` | Clean URLs config |

---

## ⚙️ Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend (SMTP)
- **Hosting:** Vercel
- **DNS/Email Routing:** Cloudflare

---

## 🔐 Credentials

Saari credentials encrypted password manager mein rakhi gayi hain.  
**Kisi bhi credential ko is repo mein commit na karein.**

---

## 💰 Business Model

- First month: **$3**
- Renewal: **$5/month**
- Payment: Binance Pay (UID: 968525536)

---

## 🚀 Deployment

Vercel pe auto-deploy on `git push` to `main` branch.

---

## 📝 Author

Asad Ilyas — inexifynova.solutions@gmail.com

---

## ⚠️ Known Security Debt

- RLS policies abhi permissive hain (Phase 1 setup)
- **Phase 3 mein Supabase Auth laga kar RLS ko tighten karna zaroori hai**
- Abhi custom auth (email + password_hash) use ho raha hai