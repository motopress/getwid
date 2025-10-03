<p align="center">
  <a href="https://wordpress.org/plugins/getwid/">
    <img src="https://ps.w.org/getwid/assets/icon.svg" alt="Getwid" width="128" height="128">
  </a>
</p>

<h1 align="center">Getwid - Free Blocks & Designs for Gutenberg</h1>

<p align="center">
<img src="https://img.shields.io/wordpress/plugin/v/getwid" alt="Plugin version">
<img src="https://img.shields.io/wordpress/plugin/wp-version/getwid" alt="Supported WordPress version">
<img src="https://img.shields.io/wordpress/plugin/dd/getwid" alt="WordPress.org downloads per day">
<img src="https://img.shields.io/wordpress/plugin/installs/getwid" alt="WordPress.org active installs">
<img src="https://img.shields.io/wordpress/plugin/rating/getwid" alt="WordPress.org rating">
<img src="https://img.shields.io/badge/license-GPL--2.0%2B-blue.svg?style=flat" alt="License">
</p>

[Getwid](https://wordpress.org/plugins/getwid/) is a popular extension to the WordPress block editor (Gutenberg). It extends the default blocks library with 40+ commodity and creative blocks and adds 35+ pre-designed page sections allowing you to create any sort of site you can imagine.

**[Getwid Blocks Demo](https://getwid.getmotopress.com/)**

The Getwid bundle includes such unique and comprehensive blocks as Image Hotspot, Instagram Gallery, Tabs and Accordion (with nested blocks), Custom Post Type and Post blocks (with support for the ACF plugin), Pricing Tables and more.

For developers building sites with Getwid, there is [Getwid Style Kit](https://github.com/motopress/getwid-style-kit).

[Getwid Base](https://github.com/motopress/getwid-base) is a free multipurpose WordPress theme completely built with Getwid blocks.

Useful links: [Watch Getwid videos](https://www.youtube.com/playlist?list=PLbDImkyrISyLX7CwC1bHWTwJLwlBBmrhp) | [Getwid block examples and news](https://motopress.com/blog/category/getwid-gutenberg-blocks/)

## Getting Started
The plugin has two build scripts. The first one is responsible for building blocks into one file. The second one is for generating separate files for each block.

Before running any of the scripts, you must complete several steps:
1. Clone the GitHub repository into your plugins directory.
1. In the plugin directory run `npm i`.
1. `nvm use 14.21.3`

For the first option (build blocks into one file):
* Run `npm run dev` to compile your files automatically whenever you've made changes to the associated files.
* Run `npm run build` to compile files for release.

For the second option (generating separate files for each block):
* Run `npm run dev:splitted` to compile your files automatically whenever you've made changes to the associated files.
* Run `npm run build:splitted` to compile files for release.

### Update/generate POT(languages) file
1. Install WP-CLI and add it to PATH (check out [official guide](https://wp-cli.org/#installing))
1. Navigate to ./languages
1. Run `wp i18n make-pot ./.. getwid.pot --exclude="src/,vendors/"`
1. To subtract new strings run `wp i18n make-pot ./.. getwid-new.pot --subtract="getwid.pot" --exclude="src/,vendors/"`

## Support
This is a developer's portal for the Getwid plugin and should not be used for support. Please visit the support page if you need to submit a support request.

## License
Getwid WordPress Plugin, Copyright (C) 2019, MotoPress.
Getwid is distributed under the terms of the GNU GPL.

## Contributions
Anyone is welcome to contribute.

<p align="center">
    <br/>
    Made with 💙 by <a href="https://motopress.com/">MotoPress</a>.<br/>
</p>
