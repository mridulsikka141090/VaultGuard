# 🔐 VaultGuard – Secure File Vault (Frontend)

VaultGuard is a secure, scalable, and modern file management web app built using **Next.js**, **Tailwind CSS**, and **AWS Cognito for authentication**. This frontend integrates with an AWS-powered backend to allow authenticated users to securely upload, view, and manage files (images, PDFs, videos, etc.) in S3.

### ✨ Live Demo
> _(Add a link here when deployed)_

---

## 🚀 Features

- 🔐 **Secure Auth** with AWS Cognito (OIDC flow with token handling)
- ☁️ **Presigned Uploads** to S3 via Lambda + API Gateway
- 📂 **Real-Time File Display** with thumbnail previews and metadata (IN PROGRESS)
- 🎨 Built with **Tailwind CSS**, **React Hooks**, and **Component Library**
- 🧱 Componentized with `@mridul/react-components-library` (IN PROGRESS)
- 🌑 **Dark mode ready** (via ThemeProvider) (IN PROGRESS)
- ♻️ **Fully client-side** & stateless frontend
- 🔎 Differentiates file types visually: image, video, document (IN PROGRESS)

---

## 📁 Project Structure

```bash
vaultguard-frontend/
├── app/                   # Next.js App Router structure
│   ├── /                  # File dashboard page
│   ├── login/             # Login screen
│   └── callback/          # OAuth2 callback handler
├── components/            # Shared UI components (Cards, Layouts)
├── hooks/                 # Custom React Hooks (auth, upload, fetch)
├── styles/                # Global styles (Tailwind)
├── public/                # Static assets
├── utils/                 # Helper functions
├── types/                 # Shared TypeScript types
└── ...
```

---

## 🧪 Technologies Used

| Stack        | Description                                |
|--------------|--------------------------------------------|
| **Next.js**  | App Router, TypeScript, SSR-friendly        |
| **Tailwind** | Modern utility-first styling                |
| **AWS**      | Cognito, API Gateway, Lambda, S3, DynamoDB |
| **React**    | Hooks, Context, Client-side routing         |
| **JWT**      | Secure token-based auth with validation     |

---

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup `.env.local`

```env
NEXT_PUBLIC_COGNITO_LOGIN_URL=https://your-auth-domain/login
NEXT_PUBLIC_API_UPLOAD_URL=https://your-api-url/upload
NEXT_PUBLIC_API_FETCH_URL=https://your-api-url/fetch
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_API_GATEWAY_URL=https://aws-api-gateway-url
```

### 3. Start the Dev Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🔒 Authentication Flow

1. User on visit to the dashboard page → redirected to Cognito Hosted UI
2. On success, redirected to `/callback` with tokens
3. Tokens are stored in `localStorage` (id_token + access_token)
4. Subsequent API calls use `Bearer <token>` headers
5. Redirected back to the dashboard page 

---

## 📦 Component Library Used (IN PROGRESS)

This project is built using a custom React component library:

> [`@mridul/react-components-library`](https://github.com/your-user/react-components-library)

This includes shared components like `Button`, `ThemeProvider`, and more — with full tree-shaking and dark mode support.

---

## 💡 Future Improvements

- 🔜 File deletion
- 🔜 Role-based access (admin vs. user)
- 🔜 Pagination / infinite scroll
- 🔜 Preview files before upload
- 🔜 Analytics dashboard (number of uploads, storage used)
- 🔜 CI/CD + Infra-as-code with AWS CDK

---

## 👨‍💻 Author

**Mridul Sikka**  
[GitHub](https://github.com/mridulsikka141090)

---

## 📄 License

MIT © 2025 Mridul Sikka
