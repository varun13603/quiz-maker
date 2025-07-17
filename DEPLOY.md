# 🚀 Deployment Guide

## Quick Deploy to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `quiz-maker` (or any name you prefer)
3. **Don't initialize with README** (we already have one)
4. Make it **public** for GitHub Pages to work

### Step 2: Connect Local Repository to GitHub
```bash
# Add your GitHub repository as remote origin
git remote add origin https://github.com/varun13603/quiz-maker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The deployment workflow will automatically run

**Important**: The workflow now uses the newer GitHub Pages deployment method with proper permissions.

### Step 4: Update Base Path (Important!)
Before deploying, you need to update the base path in `vite.config.ts`:

```typescript
// Replace 'quiz-maker' with your actual repository name
base: '/YOUR_REPOSITORY_NAME/',
```

### Step 5: Wait for Deployment
The GitHub Actions workflow will automatically:
1. Build your project
2. Deploy to GitHub Pages
3. Your site will be live at: `https://varun13603.github.io/quiz-maker/`

You can check the deployment status in the **Actions** tab of your repository.

## Alternative: Deploy to Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Get your live URL instantly!

## Alternative: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Your app will be live!

## Environment Variables

For production deployment, create these environment variables:

```env
VITE_APP_TITLE=Quiz Maker
VITE_APP_DESCRIPTION=Create and share amazing quizzes
```

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable custom domain in GitHub Pages settings

## Troubleshooting

### 404 Error on Refresh
If you get 404 errors when refreshing pages, add a `_redirects` file to the `public` folder:

```
/*    /index.html   200
```

### Build Errors
If you encounter build errors:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Run `npm run build`

### GitHub Pages Not Working
1. Check if repository is public
2. Verify GitHub Pages is enabled in settings
3. Check if workflow permissions are correct

## Your Live URLs

Once deployed, your quiz maker will be available at:
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/quiz-maker/`
- **Netlify**: `https://YOUR_APP_NAME.netlify.app`
- **Vercel**: `https://YOUR_APP_NAME.vercel.app`

## Update Instructions

To update your deployed app:
1. Make changes to your code
2. Commit changes: `git commit -am "Update: description"`
3. Push to GitHub: `git push origin main`
4. GitHub Actions will automatically deploy the updates

---

**Ready to deploy? Let's get your Quiz Maker live! 🚀**
