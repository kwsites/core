module.exports = (self) => {
   Object.assign(self, { loadSingleEmbedWidget });

   async function loadSingleEmbedWidget (req, widget) {
      const log = self.log.extend('singleWidget');
      log('singleWidget: loading: %s', widget.url);

      widget._instaUrl = widget.url.replace(/\?.+$/, '');
   }

};
