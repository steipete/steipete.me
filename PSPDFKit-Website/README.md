# PSPDFKit Website

The PSPDFKit website (http://pspdfkit.com/) is deployed from the `master` branch of this repository.

- [Installation](#installation)
- [Content](#content)
- [Deployment](#deployment)
- [Analytics](#analytics)
- [Testing](#testing)

---

## Installation

### Docker Setup (Recommended)

You will need the following installed:

- [Git](http://git-scm.com/)
- [Docker Desktop](https://docs.docker.com/docker-for-mac/install/) (this needs to be running to run the website)

#### Initial Setup

Make a copy of the website repository and login into Docker. 

```sh
git clone git@github.com:PSPDFKit/PSPDFKit-Website.git
cd PSPDFKit-Website
docker login pspdfkit.azurecr.io -u 313b3ceb-8237-496f-a1d3-f1fbccdeda3f -p 255342ff-459e-4fee-8384-79e34b4b03b5
```

#### Running

Once the initial setup (above) is complete, the following command will start the website running at http://localhost:4567.

```sh
docker-compose up --build
```

### Manual Setup (Advanced)

You will need the following installed:

- [Git](http://git-scm.com/)

The `setup` script will install the other dependencies for you:

```sh
git clone git@github.com:PSPDFKit/PSPDFKit-Website.git
cd PSPDFKit-Website
./bin/setup
bundle exec middleman server
open http://localhost:4567
```

---

## Content

### Page Metadata

- `title: Your Title`

  The title of the page, appears as the tab name in the browser, and as the link title in search / shares.

  _Result: "Your Title | PSPDFKit"_

### Blog

Please refer to our [Writing Blog Articles guide](https://docs.google.com/document/d/1vvpwpcz64SmRsmctmqC49cciNd_cHcRxQgWmJs1oYTQ/edit#heading=h.6kxhhyb6uz8o) for a detailed guide on how to contribute to our blog.

### Guides

Please refer to our [Writing Guide Articles guide](https://docs.google.com/document/d/1kbFtvCyQXy7A4XAVy89bBwQajqmw3bQ5a9MYQ5jnftk/edit#) for a detailed guide on how to contribute to our guides.

### Content Specifications

Please refer to our [Website Content Specs](https://docs.google.com/document/d/1Xq7FUBE0h8JuOXqk5TOm2M_MReTTVTr5NYnQET1gtdo) for a detailed guide on how to produce screenshots and screencasts for the Blog articles and product pages.

---

## Deployment

Deployment is automated via webhooks. A push to any of the deployment branches (`master`, `staging`, or `next`, see below) will trigger a deploy.

**Note:** When deploying, the deployment process checks that _all_ deployable branches of _all_ our website repos are deployed and up-to-date. If not, they will also be built and deployed according to their latest commit. If you experience deployment issues it may be caused by a failing build in another branch, or another repo. Monitor the #devops channel for details.

### Staging

_Don't force push to staging!_

The `staging` environment is for day-to-day content / blog editing and smaller changes. This branch
can contain WIP. You can think of it as an internal `master` branch where other people can commit
as well.

Everything pushed to the `staging` branch is deployed to http://staging.pspdfkit.com (`pspdfkit // stag1ng`).

```
git checkout staging
git merge my-branch
git push
```

### Next

The `next` environment is for previewing / testing bigger changes to the site outside of the day-to-day content and blog editing.

Work on `next` should happen in feature branches and be force pushed to `next` for previewing (i.e. do not commit directly to `next` to avoid your work being lost on the next force push).

Everything pushed to the `next` branch is deployed to http://next.pspdfkit.com (`pspdfkit // stag1ng`).

```
git push origin my-branch:next --force
```

### Production

Everything pushed to the `master` branch is deployed to http://pspdfkit.com.

---

## Analytics

When logging into [Licensor](https://admin.pspdfkit.com), a cookie is set to exclude you from all analytics tracking on the website. When the cookie is set a **Team** badge is shown at the top-right (desktop) / top-left (mobile) of the page.

To fully exclude yourself you will need to log in to Licensor _on all of the devices/browsers you use to view the website_.

---

## Testing

### Unit Tests

The unit tests can be run via `rake`:

```
PSPDFKIT_ENV=test NO_CONTRACTS=true bundle exec rake test:unit
```

### System Tests

The system tests can be run via `rake`:

```
LICENSE_API_URL=http://localhost:3000/api/ bundle exec rake test:system
```

### Danger

[Danger](https://danger.systems/ruby/) runs automatically on CI.

You can also run it locally:

```
DANGER_GITHUB_API_TOKEN=<YOUR_GITHUB_API_TOKEN> bundle exec danger local
```

### Manual Tests

#### License Key Prefilling

1. You will need the [licensor](https://github.com/PSPDFKit/licensor) installed and running.

2. Start middleman with the `LICENSE_API_URL` configured to point to the licensor:

```sh
LICENSE_API_URL=http://localhost:3000/api/ bundle exec middleman
```

3. Visit http://localhost:3000, sign in, and click either the iOS or Android buttons under “Try the Latest Version of PSPDFKit.”

4. Check the console for the email text and copy the `#<platform>_token=xyz` part of the url.

5. Visit http://localhost:4567, add the token so the url becomes e.g.
   http://pspdfkit.dev/#ios_token=xyz, and reload the page. The tokens should be replaced on the [relevant pages](https://github.com/PSPDFKit/PSPDFKit-Website/blob/master/assets/javascripts/prefill-license-keys.js).

6. License data is saved in the browser’s `localStorage` with the key `demo_<platform>_license`. To clear the data you can use the [`localStorage` API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), your browser’s developer tools, or by setting `#<platform>_token=clear` in the url.
