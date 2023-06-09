# react-social-media-app

This is a social-media-type app written in React following the awesome ["React for the Rest of Use"](https://simscale.udemy.com/course/react-for-the-rest-of-us) course by [Brad Schiff](https://simscale.udemy.com/user/bradschiff/).

The app is currently hosted with a free-tier [Netlify](https://netlify.com) account at https://react-social-media-app-shamanskiy.netlify.app.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c1af5f23-dc27-4dd0-8352-6ccad8b1a097/deploy-status)](https://app.netlify.com/sites/react-social-media-app-shamanskiy/deploys)

## Useful links

- [App hosting](https://app.netlify.com/sites/react-social-media-app-shamanskiy/overview)
- [Back-end repo](https://github.com/shamanskiy/react-social-media-app-backend)
- [Back-end hosting](https://dashboard.render.com)
- Back-end URL: https://react-social-media-app-backend.onrender.com
- [MongoDB](https://cloud.mongodb.com)
- [HTML/CSS templates](https://github.com/LearnWebCode/react-course)

## Local dev environment

To install dependencies:

```
npm install
```

To start a live dev server, run

```
npm run dev
```

and visit [localhost:3000](localhost:3000).

## Using local back-end

By default, the app uses a remote back-end hosted on Render.com. If you want to use local back-end:

1. clone the [back-end repo](https://github.com/shamanskiy/react-social-media-app-backend)
2. start the back-end following the README instructions
3. in the root of _this_ repo, create a `.env` file with the following content:

```
BACKENDURL = http://localhost:8080
```

## Creating production version

To create a version of the app optimized for production, run

```
npm run build
```

This create a `/dist` directory with the production version. To preview it locally, run

```
npm run previewDist
```

and visit [localhost:4000](localhost:4000).

## TODO

- handle "profile-not-found" situation: render NotFound component
- login form validation: if username/password field is empty, don't send login request and use `is-invalid` style for `input` fields to add red border
- colors for pop-up messages: use additional Bootstrap stylings - `alert-primary` (blue), `alert-secondary` (gray), `alert-danger` (red), `alert-warning` (yellow), `alert-info` (light blue/teal), `alert-light`, `alert-dark`
