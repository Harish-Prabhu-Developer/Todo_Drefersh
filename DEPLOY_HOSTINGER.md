# Deploying to Hostinger hPanel (Node.js App)

Since you are hosting this on shared hosting (hPanel), follow these steps to deploy your Node.js application:

## 1. Prepare Your Application
1. **Remove node_modules:**  
   Ensure `node_modules` is NOT uploaded. You will install dependencies on the server.
2. **Zip Your Project:**  
   Create a zip file of your project folder (excluding `node_modules` and `.git`).
   
## 2. Setup Node.js in hPanel
1. Login to **hPanel** (Hostinger).
2. Go to **Advanced** -> **Node.js**.
3. Create a new Node.js application:
   - **Root:** `/public_html/todo-app` (Or any other folder you prefer).
   - **Application URL:** `todo-app` (Or leave blank for root domain).
   - **Application Startup File:** Set this to `src/server.js`. 
   - **Node.js Version:** Select the latest recommended version (e.g., 18 or 20).
   - **Environment:** Select `Production`.
4. Click **Create**.

## 3. Upload Project Files
1. Go to **Files** -> **File Manager**.
2. Navigate to the folder you created (e.g., `/public_html/todo-app`).
3. Upload your project ZIP file.
4. Extract the ZIP file contents directly into this folder.

## 4. Install Dependencies
1. Go back to the **Node.js** page in hPanel.
2. Click the **Enter Control Panel** button (it opens a terminal-like interface) OR create/run `npm install` directly via the interface if available.
3. If using the terminal/SSH via hPanel:
   - Make sure you are in the project directory (`cd public_html/todo-app` or similar).
   - Run: `npm install`
   
## 5. Configure Environment Variables (.env)
1. In hPanel **File Manager**, create a new file named `.env` in your project root.
2. Paste the contents of your local `.env` file into it.
   - **Wait!** Your `DB_HOST` is likely already pointing to `srv1402.hstgr.io`. 
   - **Important:** If your Node.js app is on the *same server* as the database (shared hosting), try using `localhost` or `127.0.0.1` for `DB_HOST` in the `.env` on the server, as it's faster and avoids external connection limits. If that doesn't work, stick to the `srv...` address.

## 6. Restart the App
1. Go back to the **Node.js** page in hPanel.
2. Click the **Restart** button for your application.

## 7. Verify
- Visit your website URL. Your Todo app should be live!
   
---
**Note:** If you face "403 Forbidden" or similar errors, check your `.htaccess` file. Node.js apps on shared hosting often require specific `.htaccess` rules (generated automatically by the Node.js setup usually).
