/* Content loader pattern.
 *
 * Options:
 *    url(string): To load content from remote resource. Use 'el' to use with anchor tag href.
 *    content(string): CSS selector for content already on page. Can be used in conjunction with url to load remote content on page.
 *    trigger(string): Event to trigger content loading. Defaults to "click"
 *    target(string): CSS selector of target for content loading. If this is empty, it's assume content will replace pattern element.
 *
 * Documentation:
 *    # With selector
 *    {{ example-1 }}
 *
 *    # With remote content
 *    {{ example-2 }}
 *
 * Example: example-1
 *    <a href="#" class="pat-contentloader" data-pat-contentloader="content:#clexample1;target:#clexample1target;">Load content</a>
 *    <div id="clexample1target">Original Content</div>
 *    <div id="clexample1" style="display:none">Replaced Content</div>
 *
 * Example: example-2
 *    <a href="#" class="pat-contentloader" data-pat-contentloader="url:something.html;">Load content</a>
 *
 *
 */


define('mockup-patterns-contentloader',[
  'jquery',
  'pat-base',
  'pat-logger',
  'pat-registry',
  'mockup-utils',
  'underscore'
], function($, Base, logger, Registry, utils, _) {
  'use strict';
  var log = logger.getLogger('pat-contentloader');

  var ContentLoader = Base.extend({
    name: 'contentloader',
    trigger: '.pat-contentloader',
    parser: 'mockup',
    defaults: {
      url: null,
      content: null,
      trigger: 'click',
      target: null,
      template: null,
      dataType: 'html'
    },
    init: function() {
      var that = this;
      if(that.options.url === 'el' && that.$el[0].tagName === 'A'){
        that.options.url = that.$el.attr('href');
      }
      if(that.options.trigger === 'immediate'){
        that._load();
      }else{
        that.$el.on(that.options.trigger, function(e){
          e.preventDefault();
          that._load();
        });
      }
    },
    _load: function(){
      var that = this;
      that.$el.addClass('loading-content');
      if(that.options.url){
        that.loadRemote();
      }else{
        that.loadLocal();
      }
    },
    loadRemote: function(){
      var that = this;
      $.ajax({
        url: that.options.url,
        dataType: that.options.dataType,
        success: function(data){
          var $el;
          if(that.options.dataType === 'html'){
            if(data.indexOf('<html') !== -1){
              data = utils.parseBodyTag(data);
            }
            $el = $('<div>' + data + '</div>');  // jQuery starts to search at the first child element.
          }else if(that.options.dataType.indexOf('json') !== -1){
            // must have template defined with json
            if(data.constructor === Array && data.length === 1){
              // normalize json if it makes sense since some json returns as array with one item
              data = data[0];
            }
            try{
              $el = $(_.template(that.options.template)(data));
            }catch(e){
              // log this
              log.warn('error rendering template. pat-contentloader will not work');
              return;
            }
          }
          if(that.options.content !== null){
            $el = $el.find(that.options.content);
          }
          that.loadLocal($el);
          that.$el.removeClass('loading-content');
        },
        error: function(){
          that.$el.addClass('content-load-error');
        }
      });
    },
    loadLocal: function($content){
      var that = this;
      if(!$content && that.options.content === null){
        log.warn('No selector configured');
        return;
      }
      var $target = that.$el;
      if(that.options.target !== null){
        $target = $(that.options.target);
        if($target.size() === 0){
          log.warn('No target nodes found');
          return;
        }
      }

      if(!$content){
        $content = $(that.options.content).clone();
      }
      $content.show();
      $target.replaceWith($content);
      Registry.scan($content);
      that.$el.removeClass('loading-content');
    }
  });

  return ContentLoader;

});

define('collectionfilter',[
    'jquery',
    'pat-base',
    'mockup-patterns-contentloader'
], function($, Base, contentloader) {

    'use strict';

    var CollectionFilter = Base.extend({
        name: 'collectionfilter',
        trigger: '.pat-collectionfilter',
        parser: 'mockup',
        contentloader: contentloader,
        defaults: {
            collectionUUID: '',
            collectionURL: '',
            reloadURL: ''
        },

        init: function() {
            if (this.options.additive) {
                this.$el.unbind('collectionfilter:reload');
                this.$el.on('collectionfilter:reload', function (e, data) {
                    if (data.collectionUUID === this.options.collectionUUID) {
                        this.reload(data.targetFilterURL);
                    }
                }.bind(this));
            }
            $('.filteritem', this.$el).on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var collectionURL = e.target.closest('a').href  // dunno why, but e.target here is a span el, when it should be the a tag. this fixes it forward/backwards compatible...

                if (this.options.additive) {
                    $(this.trigger).trigger(
                        'collectionfilter:reload',
                        {
                            collectionUUID: this.options.collectionUUID,
                            targetFilterURL: collectionURL
                        }
                    );
                }

                this.reloadCollection(collectionURL + '&ajax_load=1');
            }.bind(this));
        },

        reload: function (filterURL) {

            var reloadURL = this.options.reloadURL;
            if (this.options.additive) {
                var urlParts = reloadURL.split('?');
                var query1 = urlParts[1] || [];
                var query2 = filterURL.split('?')[1] || [];
                var query = [].concat(query1, query2).join('&');
                var reloadURL = [].concat(urlParts[0], query).join('?');
            }

            var cl = new this.contentloader(this.$el, {
                url: reloadURL,
                target: this.$el,
                content: 'aside',
                trigger: 'immediate'
            });
        },

        reloadCollection: function (collectionURL) {
            var cl = new this.contentloader(this.$el, {
                url: collectionURL,
                target: '#content-core',
                content: '#content-core',
                trigger: 'immediate'
            });
        }

    });

    return CollectionFilter;
});

require([
  'jquery',
  'pat-registry',
  // patterns
  'collectionfilter'
], function($, registry) {
  'use strict';

  // initialize only if we are in top frame
  if (window.parent === window) {
    $(document).ready(function() {
      if (!registry.initialized) {
        registry.init();
      }
    });
  }

});

define("/home/_thet/data/dev/agitator/collectionfilter/plone/src/collective.collectionfilter/src/collective/collectionfilter/resources/collectionfilter-bundle.js", function(){});
