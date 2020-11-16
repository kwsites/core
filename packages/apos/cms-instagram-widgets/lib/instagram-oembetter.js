const request = require('bent')('GET', 'json');

module.exports = function instagram(self, oembetter) {
   oembetter.addBefore(async (url, options, response, callback) => {
      if (!url.match(/instagram.com\/p\//)) {
         return setImmediate(callback);
      }

      const requestUrl =
         `https://graph.facebook.com/v9.0/instagram_oembed` +
         `?url=${encodeURIComponent(url)}` +
         `&access_token=${options.accessToken}`;

      request(requestUrl)
         .then((json) => {
            callback(null, url, options, {
               type: 'instagram',
               html: json.html.replace(/<script[^>]*>.*<\/script[^>]*>/g, ''),
               title: json.title,
               thumbnail_url: json.thumbnail_url,
               thumbnail_width: json.thumbnail_width,
               thumbnail_height: json.thumbnail_height,
            });
         })
         .catch((e) => callback(e));
   });
};
