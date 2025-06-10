# 🔥 Firebase RC Manager

A lightweight Node.js application to manage Firebase Remote Config parameters and groups via a simple web interface or API.

---

## 📁 Project Structure


```
firebase-rc-manager
├─ app.js
├─ config
│  ├─ constants.js
│  └─ firebase.js
├─ controllers
│  ├─ errorHandler.js
│  ├─ groups.js
│  └─ parameters.js
├─ firebase-debug.log
├─ index.js
├─ package-lock.json
├─ package.json
├─ public
│  └─ index.html
├─ routes
│  ├─ groups.js
│  ├─ index.js
│  ├─ parameters.js
│  └─ uploads.js
├─ serviceAccountKey.json
└─ utils
   └─ templateUtils.js

```


---

## 🚀 Features

- Manage Firebase Remote Config parameters and groups  
- Upload and apply config templates  
- RESTful API structure  
- Centralized error handling

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/firebase-rc-manager.git
cd firebase-rc-manager


2. Install dependencies

npm install

3. Add Firebase Admin SDK Key
Place your Firebase service account key as:
/serviceAccountKey.json

| Method | Endpoint      | Description                       |
| ------ | ------------- | --------------------------------- |
| GET    | `/parameters` | List all Remote Config parameters |
| POST   | `/parameters` | Update parameters                 |
| GET    | `/groups`     | List parameter groups             |
| POST   | `/groups`     | Create or update groups           |
| POST   | `/uploads`    | Upload config templates           |


📌 Notes
Ensure that Remote Config is enabled in your Firebase project.

This app uses Firebase Admin SDK and requires proper credentials.

🤝 Contributing
Pull requests are welcome. For major changes, open an issue to discuss them first.

📜 License
MIT License

