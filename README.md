# Samuel Portfolio 🚀

A modern, full-stack portfolio website showcasing my skills, projects, and professional experience. Built with React, featuring smooth animations, dark mode by default, and a comprehensive admin dashboard.

---

## **Overview** 🌟

This portfolio website displays my work as a Full-Stack Developer, including:
- **Home** - Introduction with typewriter animation and social links
- **About** - Personal information and technology stack
- **Skills** - Technical proficiency with category filtering
- **Education** - Academic background with transcript downloads
- **Experience** - Work history with company links
- **Projects** - Featured projects with pagination and status indicators
- **Contact** - Contact form and information

### **Key Features** ✨

- 🎨 **Dark Mode by Default** - Modern dark theme with light mode toggle
- 📱 **Fully Responsive** - Optimized for all devices
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 📊 **Admin Dashboard** - Complete CRUD operations for all content
- 🔄 **Mock Data Support** - Works offline with built-in mock data
- 🚀 **Vercel Ready** - Optimized for deployment on Vercel
- 📄 **PDF Downloads** - CV and education transcript downloads
- 🎯 **SEO Optimized** - Meta tags and semantic HTML

---

## **Technologies Used** 💻

### **Frontend**

- **React 18** ⚛️ - UI library
- **Vite** ⚡ - Build tool and dev server
- **Framer Motion** 🎞️ - Animation library
- **TanStack Query** 🔄 - Data fetching and caching
- **Tailwind CSS** 🌈 - Utility-first CSS framework
- **React Router** 🛣️ - Client-side routing
- **FontAwesome** 🎨 - Icon library
- **Axios** 🌐 - HTTP client
- **React Type Animation** ⌨️ - Typewriter effects

### **Backend Options**

1. **Supabase** (Optional)
   - PostgreSQL database
   - File storage
   - Real-time subscriptions

2. **Mock Data** (Default)
   - Works without backend
   - Perfect for development and deployment
   - All features functional with mock data

### **Deployment**

- **Frontend:** Vercel
- **Build Tool:** Vite
- **Package Manager:** npm

---

## **Project Structure** 📁

```
portfolio/
├── frontend/
│   ├── public/
│   │   ├── images/          # Portfolio images
│   │   ├── cv/              # CV and transcript PDFs
│   │   └── logo.svg         # Logo
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── auth/            # Authentication components
│   │   ├── config/          # Configuration files
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── hooks/            # Custom React hooks
│   │   ├── mocks/            # Mock data and services
│   │   ├── portfolio/        # Public portfolio pages
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── vercel.json              # Vercel deployment config
├── .gitignore
└── README.md
```

---

## **Setup Instructions** 🛠️

### **Prerequisites**

- Node.js 18+ and npm
- Git

### **Local Development**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   # or
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

### **Environment Variables (Optional)**

Create a `.env` file in the `frontend/` directory:

```env
# Supabase (Optional - app uses mock data if not provided)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API URL (Optional)
VITE_API_URL=https://your-api-url.com/

# Firebase (Required for authentication)
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MEASUREMENT_ID=your_firebase_measurement_id
```

**Note:** The app works perfectly with mock data if environment variables are not provided!

---

## **Build for Production** 🏗️

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/` directory.

---

## **Deployment** 🚀

### **Deploy to Vercel**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`
   - Add environment variables in Vercel Dashboard
   - Click "Deploy"

3. **Your site will be live at:**
   ```
   https://your-project.vercel.app
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## **Features in Detail** 📋

### **Portfolio Sections**

- **Home:** Hero section with animated typewriter, social icons, and CV download
- **About:** Personal bio, image, and technology badges (MERN, Python, ML)
- **Skills:** Technical skills with category filtering (Frontend, Backend, Mobile)
- **Education:** Academic qualifications with transcript PDF downloads
- **Experience:** Work history with company websites and technologies used
- **Projects:** Featured projects with pagination, status indicators, and links
- **Contact:** Contact form and contact information

### **Admin Dashboard**

- **Landing Page Management:** Update hero content, typewriter texts, and images
- **About Content:** Manage bio, image, and personal details
- **Skills Management:** Add, edit, and delete technical skills
- **Experience Management:** Manage work experience entries
- **Education Management:** Manage education entries with PDF uploads
- **Projects Management:** Full CRUD for portfolio projects
- **Services Management:** Manage services offered
- **Feedback Management:** View and manage testimonials

---

## **Mock Data** 🎭

The application includes comprehensive mock data that allows it to work completely offline:

- Landing page content
- About section
- Skills (Frontend, Backend, Mobile)
- Projects (8 featured projects)
- Experience (3 work experiences)
- Education (1 education entry)
- Services
- Feedback/Testimonials

All mock data is in `frontend/src/mocks/mockData.js`

---

## **Screenshots** 📸

### **Homepage**
![Homepage](./screenshots/homepage.png)

### **Dashboard**
![Dashboard](./screenshots/dashboard.png)

---

## **Development** 👨‍💻

### **Available Scripts**

```bash
npm start      # Start development server
npm run dev    # Alias for start
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

### **Tech Stack Details**

- **React 18.3** - Latest React with hooks
- **Vite 5.4** - Fast build tool
- **Tailwind CSS 3.4** - Utility-first CSS
- **Framer Motion 11** - Animation library
- **TanStack Query 5** - Data fetching
- **React Router 6** - Routing
- **FontAwesome 6** - Icons

---

## **Browser Support** 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## **Future Improvements** 🚀

- [ ] Add unit and integration tests
- [ ] Implement real-time updates with WebSockets
- [ ] Add blog section
- [ ] Enhance accessibility (ARIA labels, keyboard navigation)
- [ ] Add multi-language support
- [ ] Implement analytics tracking
- [ ] Add PWA support

---

## **Contributing** 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

---

## **License** 📄

This project is open source and available under the [MIT License](LICENSE).

---

## **Contact** 📬

**Samuel Mulu**

- **Email:** samuelmulu810@gmail.com
- **Phone:** +251962520885
- **LinkedIn:** [linkedin.com/in/sami-mulu-20a1a1322](https://www.linkedin.com/in/sami-mulu-20a1a1322/)
- **GitHub:** [github.com/samuel-mulu](https://github.com/samuel-mulu)

---

## **Acknowledgments** 🙏

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the React and Vite communities

---

**Built with ❤️ by Samuel Mulu**

Thank you for visiting my portfolio! 🎉
