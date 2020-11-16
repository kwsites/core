const { promiseResult } = require('@kwsites/promise-result');

module.exports = (self, options) => {
   Object.assign(self, { loadSingleEmbedWidget });

   function getEmbedAuth(req) {
      const { source, token } = { source: 'inline', ...self.getEmbedConfig(req) };
      switch (source) {
         case 'env':
            return process.env[token];
         case 'inline':
            return token;
         default:
            throw new Error(`Unknown embed source: "${source}"`);
      }
   }

   async function loadSingleEmbedWidget(req, widget) {
      const log = self.log.extend('singleWidget');
      log('singleWidget: loading: %s', widget.url);

      const { threw, result } = await promiseResult(oEmbed(req, widget.url));
      if (threw) {
         log('singleWidget: error: %s %o', widget.url, result);
         widget._embed = null;
      } else {
         widget._embed = result;
         log('singleWidget: complete: %s', widget.url);
      }
   }

   function oEmbed(req, url) {
      return new Promise((done, fail) => {
         self.apos.oembed.query(
            req,
            url.replace(/\?.+$/, ''),
            { neverOpenGraph: true, accessToken: getEmbedAuth(req) },
            (err, data) => {
               if (err) {
                  return fail(err);
               }

               data.html = data.html.replace(/<script[^>]*>.*<\/script[^>]*>/g, '');

               done(data);
            }
         );
      });
   }
};
