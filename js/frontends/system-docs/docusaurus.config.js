// @ts-nocheck
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Emergency Service for Mass Events',
  tagline: 'Engineering thesis by Wojciech Fabjańczuk',
  favicon: 'icons/favicon.ico',

  // Set the production url of your site here
  url: 'https://wfabjanczuk.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/esme/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'wfabjanczuk', // Usually your GitHub org/user name.
  projectName: 'esme', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'redocusaurus',
      /** @type {import('redocusaurus').PresetOptions} */
      {
        specs: [
          {
            spec: 'openapi/organizer-api.yml',
            route: '/organizer-api/',
            url: 'https://github.com/wfabjanczuk/esme/blob/main/js/frontends/system-docs/openapi/organizer-api.yml'
          },
        ],
        theme: {
          primaryColor: '#006db3',
          options: {
            sortTagsAlphabetically: true,
          },
        },
      },
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'ESME',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: 'organizer-api',
            label: 'Organizer API',
            activeBasePath: 'organizer-api'
          },
          {
            href: 'https://github.com/wfabjanczuk/esme',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
