define("collectionfilter",["jquery","pat-base","mockup-patterns-contentloader"],function(n,t,e){return t.extend({name:"collectionfilter",trigger:".pat-collectionfilter",parser:"mockup",contentloader:e,defaults:{collectionUUID:"",collectionURL:"",reloadURL:"",ajaxLoad:!0,contentSelector:"#content-core"},_initmap_cycles:2,_zoomed:!1,init:function(){var t;if(this.$el.unbind("collectionfilter:reload"),this.$el.on("collectionfilter:reload",function(t,e){e.noReloadSearch&&this.$el.hasClass("collectionSearch")||e.noReloadMap&&this.$el.hasClass("collectionMaps")||e.collectionUUID===this.options.collectionUUID&&this.reload(e.targetFilterURL)}.bind(this)),this.$el.hasClass("collectionSearch")&&this.ajaxLoad)return n('button[type="submit"]',this.$el).hide(),n("form",this.$el).on("submit",function(t){t.preventDefault()}),void n('input[name="SearchableText"]',this.$el).on("keyup",function(o){clearTimeout(t),0<n(o.target).val().length&&n(o.target).val().length<3||(t=setTimeout(function(){var t=n(o.target).data("url"),e=encodeURIComponent(n(o.target).val());e&&(t+="&"+n(o.target).attr("name")+"="+e),n(this.trigger).trigger("collectionfilter:reload",{collectionUUID:this.options.collectionUUID,targetFilterURL:t,noReloadSearch:!0}),this.reloadCollection(t)}.bind(this),500))}.bind(this));n(".filterContent a",this.$el).on("click",function(t){t.stopPropagation(),t.preventDefault();var e=n(t.target).closest("a").attr("href");n(this.trigger).trigger("collectionfilter:reload",{collectionUUID:this.options.collectionUUID,targetFilterURL:e}),this.reloadCollection(e)}.bind(this)),n(".filterContent input",this.$el).on("change",function(t){var e=n(t.target).data("url");n(this.trigger).trigger("collectionfilter:reload",{collectionUUID:this.options.collectionUUID,targetFilterURL:e}),this.reloadCollection(e)}.bind(this)),n(".filterContent select",this.$el).on("change",function(t){var e=n("option:selected",t.target),o=n(e).data("url");n(this.trigger).trigger("collectionfilter:reload",{collectionUUID:this.options.collectionUUID,targetFilterURL:o}),this.reloadCollection(o)}.bind(this)),this.$el.hasClass("collectionMaps")&&n(".pat-leaflet",this.$el).on("leaflet.moveend leaflet.zoomend",function(t,e){if("false"!==n(t.target).data("narrow-down-result").toLowerCase())if(0<this._initmap_cycles)this._initmap_cycles-=1;else{var o=e.original_event;if("moveend"===o.type&&this._zoomed)this._zoomed=!1;else{"zoomend"===o.type&&(this._zoomed=!0);var i=n(t.target).data("url"),l=o.target.getBounds();i+="&latitude.query:list:record="+l._northEast.lat+"&latitude.query:list:record="+l._southWest.lat+"&latitude.range:record=minmax",i+="&longitude.query:list:record="+l._northEast.lng+"&longitude.query:list:record="+l._southWest.lng+"&longitude.range:record=minmax",n(this.trigger).trigger("collectionfilter:reload",{collectionUUID:this.options.collectionUUID,targetFilterURL:i,noReloadMap:!0}),this.reloadCollection(i)}}}.bind(this))},reload:function(t){if(this.ajaxLoad){var e=this.options.reloadURL,o=e.split("?"),i=o[1]||[],l=t.split("?")[1]||[],n=[].concat(i,l).join("&");e=[].concat(o[0],n).join("?");new this.contentloader(this.$el,{url:e,target:"div.portletContent",content:"div.portletContent",trigger:"immediate"})}else window.location.href=t},reloadCollection:function(t){if(this.ajaxLoad){new this.contentloader(n(this.options.contentSelector).parent(),{url:t+"&ajax_load=1",target:this.options.contentSelector,content:this.options.contentSelector,trigger:"immediate"});re=/@@.*\//,t=t.replace(re,""),window.history.replaceState({path:t},"",t)}}})}),require(["jquery","pat-registry","collectionfilter"],function(t,e){}),define("/Users/dylanjay/Projects/collective/collective.collectionfilter/src/collective/collectionfilter/resources/collectionfilter-bundle.js",function(){});
//# sourceMappingURL=collectionfilter-bundle-compiled.js.map