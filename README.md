# 🧠 MadeWithNestle Chatbot – Frontend

This is the React-based frontend for the MadeWithNestle AI chatbot. It features a floating chat UI with a pop-out modal that interacts with an intelligent backend powered by LLMs, vector search, and a graph database.

---

## 🚀 Technologies Used

- React with TypeScript
- Tailwind CSS + Headless UI
- Vite
- Deployed on Google Cloud Run

---

## ⚙️ Setup and Running Locally

### Prerequisites
- Node.js (v18+)

### Local Development
#### Using NPM (Development Mode)
```bash
npm install
npm run dev
```
 
#### Using Docker
```bash
# Build Docker image
docker build -t react-frontend .

# Run the container (use any local port, e.g., 3000)
docker run -p 3000:3000 react-frontend
```

### Build for Production
```bash
npm run build
```

---

## ☁️ Deployment

### Build and Deploy
```bash
npm run build
gcloud builds submit --tag gcr.io/PROJECT_NAME/react-frontend
gcloud run deploy react-frontend   --image gcr.io/PROJECT_NAME/react-frontend   --platform managed   --allow-unauthenticated   --region LOCATION
```

---

## 🔗 Integration

The frontend communicates with the FastAPI backend via REST APIs. Ensure the backend endpoint is properly configured in your API calls.

---

## 🚧 Known Limitations

- Hosted in a single region, may have latency for distant users
- Backend may return limited responses due to partial data scraping

---
