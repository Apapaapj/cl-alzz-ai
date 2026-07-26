# CL-ALZZ AI 🔴⚫

**Multi-model AI Website by AlzzIsBack**

---

## 🚀 Deploy ke Vercel (Step by Step)

### 1. Install dependencies
```bash
npm install
```

### 2. Setup API Keys
```bash
cp .env.local.example .env.local
```
Edit `.env.local` dan isi API key yang kamu punya:
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
HUGGINGFACE_API_KEY=hf_...
```
**⚠️ JANGAN PERNAH commit `.env.local` ke GitHub!**

### 3. Test lokal
```bash
npm run dev
```
Buka `http://localhost:3000`

### 4. Push ke GitHub
```bash
git init
git add .
git commit -m "init cl-alzz"
git remote add origin https://github.com/USERNAME/cl-alzz.git
git push -u origin main
```

### 5. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) → New Project
2. Import repo dari GitHub
3. **PENTING**: Masuk ke **Settings → Environment Variables**
4. Tambahkan semua API key dari `.env.local.example`
5. Deploy → selesai!

---

## 🔒 Keamanan API Key

- API key **HANYA** ada di server (Vercel Environment Variables)
- File `config/system-prompts.ts` dan `app/api/` **tidak pernah** dikirim ke browser
- User **tidak bisa** override system prompt via chat
- Anti-jailbreak baked-in di level prompt server

---

## 📁 Struktur File

```
cl-alzz/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      ← API endpoint utama (server only)
│   │   └── models/route.ts    ← Cek ketersediaan model
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── IntroScreen.tsx        ← Glitch intro animation
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   ├── ChatPage.tsx
│   ├── MessageList.tsx
│   ├── ChatInput.tsx
│   ├── ModelSelector.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── three/
│       └── ThinkingAnimation.tsx  ← Robot head Three.js
├── config/
│   ├── models.ts              ← Daftar semua AI mode
│   └── system-prompts.ts      ← LOCKED prompts (server only)
├── .env.local.example         ← Template env vars
├── .gitignore                 ← .env.local excluded!
└── vercel.json
```

---

## 🛠 Tambah Mode AI Baru

Edit `config/models.ts`, tambahkan entry baru:
```ts
{
  id: 'nama-mode-dark',
  name: 'NAMA MODE DARK',
  provider: 'anthropic',  // atau openai, gemini, groq, huggingface
  modelId: 'model-id-dari-provider',
  description: 'Deskripsi mode ini...',
  badge: 'FAST',  // FAST, SMART, atau FREE
  maxTokens: 4096,
  supportsStreaming: true,
  envKey: 'NAMA_ENV_KEY',
}
```

---

## 📞 Kontak

- Telegram: [@alzzisbackv2](https://t.me/alzzisbackv2)
- WhatsApp: [+1 (979) 346-2644](https://wa.me/19793462644)
