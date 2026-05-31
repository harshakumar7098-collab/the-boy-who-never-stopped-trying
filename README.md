# The Boy Who Never Stopped Trying

Static public literary memoir website.

## What is included

- Cinematic homepage with generated symbolic watercolor artwork
- Full manuscript reading experience
- Author note and literary author page
- Table of contents for 35 chapters plus epilogue
- Emotional timeline
- Full-text browser search
- Bookmarking, reading progress, dark mode, and immersive reading mode
- Dedicated "In Memory of Us" page
- Final cinematic ending page

## Local preview

Open `index.html` in a browser, or serve the folder with any static server.

## Deploy

This is a static site. Deploy the folder contents to:

- GitHub Pages: this project includes `.github/workflows/pages.yml`. In the GitHub repository, set Pages to deploy from GitHub Actions. Every push to `main` will publish the site automatically.
- Cloudflare Pages: create a Pages project, choose this folder as the output directory, and leave build command empty.
- Netlify: drag the folder into Netlify Drop or connect a repository with no build command.
- Vercel: import the repository as a static project with no build command.

## One-command publishing

After Git is connected, publish updates with either:

```powershell
.\publish.ps1 "Update memoir"
```

or:

```bat
publish.bat "Update memoir"
```

Both scripts run `git add .`, `git commit`, and `git push`. GitHub Pages then updates the live website.

## Notes

The memoir text is preserved in `data.js`, generated from the supplied manuscript PDF. No backend or external database is required.
