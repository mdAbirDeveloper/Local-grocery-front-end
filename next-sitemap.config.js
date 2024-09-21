/** @type {import('next-sitemap').IConfig} */


module.exports = {
    siteUrl: 'Your Domain', // Replace with your domain
    generateRobotsTxt: true, // (optional) Generate a robots.txt file
    changefreq: 'monthly', // Change frequency of your pages
    priority: 0.7, // Default priority of your pages
    sitemapSize: 5000, // Limit for the number of URLs per sitemap file
    exclude: ['/404'], // Exclude specific pages if necessary
  };
