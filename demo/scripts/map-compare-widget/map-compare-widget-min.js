!function(t){function e(e,n,o){var r=t(e).find(" div."+n+"-container");r.find("label").html(o.name);var s="radio"===o.type?"radio":"drop-down";r.append(d[s]);var c=r.find(".image-selector"),l=t(e+" img.image-"+n),u=t(e+" img.image-"+n+"-legend"),f=o.images;"radio"===s?(a(c,l,u,f),c.parent().removeClass("four").addClass("twelve"),r.find(".filler-container").hide()):i(c,l,u,f),1===o.images.length&&r.hide()}function a(e,a,i,o){var d=n(o.length);t.each(o,function(){var n=t("<label />").addClass(d);n.append(t('<input type="radio" name="sl" />').val(this.source).data("alt",this.alt).data("legend",this.legend).data("legend-alt",this["legend-alt"])),n.append(t('<span class="label-body" />').text(this.name)),e.append(n),this["default"]&&(t('input[name=sl][value="'+this.source+'"]').prop("checked",!0),n.addClass("on"),a.attr("alt",this.alt).attr("title",this.alt),i.attr("src",this.legend).attr("alt",this["legend-alt"]).attr("title",this["legend-alt"])),n.click(function(){t(this).siblings().removeClass("on"),t(this).addClass("on")})}),e.on("change",function(){var e=t("input[name='sl']:checked");a.attr("src",e.val()).attr("alt",e.data("alt")).attr("title",e.data("alt")),i.attr("src",e.data("legend")).attr("alt",e.data("legendAlt")).attr("title",e.data("legendAlt"))})}function n(t){var e="nem-mcw-button-";switch(t){case 1:e+="whole";break;case 2:e+="half";break;case 3:e+="third";break;case 4:e+="fourth";break;case 5:e+="fifth";break;default:e+="default"}return e}function i(e,a,n,i){t.each(i,function(){e.append(t("<option />").val(this.source).text(this.name).data("alt",this.alt).data("legend",this.legend).data("legend-alt",this["legend-alt"])),this["default"]&&(e.val(this.source),a.attr("alt",this.alt).attr("title",this.alt),n.attr("src",this.legend).attr("alt",this["legend-alt"]).attr("title",this["legend-alt"]))}),e.on("change",function(){a.attr("src",t(this).val()).attr("alt",t(this).data("alt")).attr("title",t(this).data("alt")),n.attr("src",t(this).data("legend")).attr("alt",t(this).data("legendAlt")).attr("title",t(this).data("legendAlt"))})}function o(t){var e=t.leftSelector,a=t.rightSelector,n='<div class="nem-mcw-container main-container" style="display: none;"><div class="nem-mcw-row">';return e&&(n+='<div class="four nem-mcw-columns left-container"><label></label></div>'),(e&&"radio"===e.type||a&&"radio"===a.type)&&(n+='<div class="four nem-mcw-columns filler-container"></div>'),a&&(n+='<div class="four nem-mcw-columns right-container"><label></label></div>'),n+='</div><div class="nem-mcw-row"><div class="twelve nem-mcw-columns twentytwenty-container"><div class="image-slider">',e&&(n+='<img class="image-left twentytwenty-before" />'),a&&(n+='<img class="image-right twentytwenty-after" />'),e&&a&&(n+='<div class="fader"></div>'),n+="</div>",e&&e.images[0].legend&&(n+='<img class="image-left-legend twentytwenty-legend" />'),a&&a.images[0].legend&&(n+='<img class="image-right-legend twentytwenty-legend" />'),n+="</div></div></div>"}t.widget("nemac.mapCompare",{options:{config:{}},_create:function(){this.element.empty();var e=this,a="#"+t(this.element).attr("id");"string"==typeof this.options.config?t.getJSON(this.options.config,function(t){e.element.html(o(t)),e._deployApp(t,a)}):(this.element.html(o(this.options.config)),this._deployApp(this.options.config,a))},_deployApp:function(a,n){a.leftSelector&&e(n,"left",a.leftSelector),a.rightSelector&&e(n,"right",a.rightSelector),t(n).find(".image-selector").trigger("change"),"fade"===a.type?(t(n).find(".fader").append('<label class="slide-label">both</label><div class="slide-group"><span class="slide-label">'+a.leftSelector.slideLabel+'</span><input type="range" min="0" max="1" step="0.01" value="'+a.defaultSlidePosition+'" /><span class="slide-label">'+a.rightSelector.slideLabel+"</span></div>"),t(n).find(".fader").val("0").on("input change",function(e){t(n).find(".image-left").css("opacity",1-e.target.value)}),t(n).find(".image-left").css("opacity",1-a.defaultSlidePosition)):setTimeout(function(){t(n).find(".image-slider").twentytwenty({default_offset_pct:a.defaultSlidePosition})},300),t(n).find("div.main-container").show()}});var d={radio:'<form class="image-selector"></form>',"drop-down":'<select class="nem-mcw-u-full-width image-selector"></select>'};t.fn.twentytwenty=function(e){var e=t.extend({default_offset_pct:.5,orientation:"horizontal"},e);return this.each(function(){var a=e.default_offset_pct,n=t(this),i=e.orientation,o="vertical"===i?"down":"left",d="vertical"===i?"up":"right";n.wrap("<div class='twentytwenty-wrapper twentytwenty-"+i+"'></div>"),n.append("<div class='twentytwenty-overlay'></div>");var r=n.find("img:first"),s=n.find("img:last");n.append("<div class='twentytwenty-handle'></div>");var c=n.find(".twentytwenty-handle");c.append("<span class='twentytwenty-"+o+"-arrow'></span>"),c.append("<span class='twentytwenty-"+d+"-arrow'></span>"),n.addClass("twentytwenty-container"),r.addClass("twentytwenty-before"),s.addClass("twentytwenty-after");var l=n.find(".twentytwenty-overlay");l.append("<div class='twentytwenty-before-label'></div>"),l.append("<div class='twentytwenty-after-label'></div>");var u=function(t){var e=r.width(),a=r.height();return{w:e+"px",h:a+"px",cw:t*e+"px",ch:t*a+"px"}},f=function(t){"vertical"===i?r.css("clip","rect(0,"+t.w+","+t.ch+",0)"):r.css("clip","rect(0,"+t.cw+","+t.h+",0)"),n.css("height",t.h)},m=function(t){var e=u(t);c.css("vertical"===i?"top":"left","vertical"===i?e.ch:e.cw),f(e)};t(window).on("resize.twentytwenty",function(t){m(a)});var g=0,p=0;c.on("movestart",function(t){(t.distX>t.distY&&t.distX<-t.distY||t.distX<t.distY&&t.distX>-t.distY)&&"vertical"!==i?t.preventDefault():(t.distX<t.distY&&t.distX<-t.distY||t.distX>t.distY&&t.distX>-t.distY)&&"vertical"===i&&t.preventDefault(),n.addClass("active"),g=n.offset().left,offsetY=n.offset().top,p=r.width(),imgHeight=r.height()}),c.on("moveend",function(t){n.removeClass("active")}),c.on("move",function(t){n.hasClass("active")&&(a="vertical"===i?(t.pageY-offsetY)/imgHeight:(t.pageX-g)/p,0>a&&(a=0),a>1&&(a=1),m(a))}),n.find("img").on("mousedown",function(t){t.preventDefault()}),t(window).trigger("resize.twentytwenty")})},function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t,e){function a(t){function e(t){n?(a(),O(e),i=!0,n=!1):i=!1}var a=t,n=!1,i=!1;this.kick=function(t){n=!0,i||e()},this.end=function(t){var e=a;t&&(i?(a=n?function(){e(),t()}:t,n=!0):t())}}function n(){return!0}function i(){return!1}function o(t){t.preventDefault()}function d(t){P[t.target.tagName.toLowerCase()]||t.preventDefault()}function r(t){return 1===t.which&&!t.ctrlKey&&!t.altKey}function s(t,e){var a,n;if(t.identifiedTouch)return t.identifiedTouch(e);for(a=-1,n=t.length;++a<n;)if(t[a].identifier===e)return t[a]}function c(t,e){var a=s(t.changedTouches,e.identifier);if(a&&(a.pageX!==e.pageX||a.pageY!==e.pageY))return a}function l(t){var e;r(t)&&(e={target:t.target,startX:t.pageX,startY:t.pageY,timeStamp:t.timeStamp},R(document,H.move,u,e),R(document,H.cancel,f,e))}function u(t){var e=t.data;w(t,e,t,m)}function f(t){m()}function m(){j(document,H.move,u),j(document,H.cancel,f)}function g(t){var e,a;P[t.target.tagName.toLowerCase()]||(e=t.changedTouches[0],a={target:e.target,startX:e.pageX,startY:e.pageY,timeStamp:t.timeStamp,identifier:e.identifier},R(document,K.move+"."+e.identifier,p,a),R(document,K.cancel+"."+e.identifier,v,a))}function p(t){var e=t.data,a=c(t,e);a&&w(t,e,a,h)}function v(t){var e=t.data,a=s(t.changedTouches,e.identifier);a&&h(e.identifier)}function h(t){j(document,"."+t,p),j(document,"."+t,v)}function w(t,e,a,n){var i=a.pageX-e.startX,o=a.pageY-e.startY;L*L>i*i+o*o||X(t,e,a,i,o,n)}function y(){return this._handled=n,!1}function Y(t){t._handled()}function X(t,e,a,n,i,o){var d,r;e.target;d=t.targetTouches,r=t.timeStamp-e.timeStamp,e.type="movestart",e.distX=n,e.distY=i,e.deltaX=n,e.deltaY=i,e.pageX=a.pageX,e.pageY=a.pageY,e.velocityX=n/r,e.velocityY=i/r,e.targetTouches=d,e.finger=d?d.length:1,e._handled=y,e._preventTouchmoveDefault=function(){t.preventDefault()},N(e.target,e),o(e.identifier)}function b(t){var e=t.data.timer;t.data.touch=t,t.data.timeStamp=t.timeStamp,e.kick()}function S(t){var e=t.data.event,a=t.data.timer;T(),x(e,a,function(){setTimeout(function(){j(e.target,"click",i)},0)})}function T(t){j(document,H.move,b),j(document,H.end,S)}function k(t){var e=t.data.event,a=t.data.timer,n=c(t,e);n&&(t.preventDefault(),e.targetTouches=t.targetTouches,t.data.touch=n,t.data.timeStamp=t.timeStamp,a.kick())}function _(t){var e=t.data.event,a=t.data.timer,n=s(t.changedTouches,e.identifier);n&&(C(e),x(e,a))}function C(t){j(document,"."+t.identifier,k),j(document,"."+t.identifier,_)}function A(t,e,a,n){var i=a-t.timeStamp;t.type="move",t.distX=e.pageX-t.startX,t.distY=e.pageY-t.startY,t.deltaX=e.pageX-t.pageX,t.deltaY=e.pageY-t.pageY,t.velocityX=.3*t.velocityX+.7*t.deltaX/i,t.velocityY=.3*t.velocityY+.7*t.deltaY/i,t.pageX=e.pageX,t.pageY=e.pageY}function x(t,e,a){e.end(function(){return t.type="moveend",N(t.target,t),a&&a()})}function D(t,e,a){return R(this,"movestart.move",Y),!0}function q(t){return j(this,"dragstart drag",o),j(this,"mousedown touchstart",d),j(this,"movestart",Y),!0}function F(t){"move"!==t.namespace&&"moveend"!==t.namespace&&(R(this,"dragstart."+t.guid+" drag."+t.guid,o,e,t.selector),R(this,"mousedown."+t.guid,d,e,t.selector))}function z(t){"move"!==t.namespace&&"moveend"!==t.namespace&&(j(this,"dragstart."+t.guid+" drag."+t.guid),j(this,"mousedown."+t.guid))}var L=6,R=t.event.add,j=t.event.remove,N=function(e,a,n){t.event.trigger(a,n,e)},O=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,e){return window.setTimeout(function(){t()},25)}}(),P={textarea:!0,input:!0,select:!0,button:!0},H={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},K={move:"touchmove",cancel:"touchend",end:"touchend"};t.event.special.movestart={setup:D,teardown:q,add:F,remove:z,_default:function(t){function n(e){A(o,d.touch,d.timeStamp),N(t.target,o)}var o,d;t._handled()&&(o={target:t.target,startX:t.startX,startY:t.startY,pageX:t.pageX,pageY:t.pageY,distX:t.distX,distY:t.distY,deltaX:t.deltaX,deltaY:t.deltaY,velocityX:t.velocityX,velocityY:t.velocityY,timeStamp:t.timeStamp,identifier:t.identifier,targetTouches:t.targetTouches,finger:t.finger},d={event:o,timer:new a(n),touch:e,timeStamp:e},t.identifier===e?(R(t.target,"click",i),R(document,H.move,b,d),R(document,H.end,S,d)):(t._preventTouchmoveDefault(),R(document,K.move+"."+t.identifier,k,d),R(document,K.end+"."+t.identifier,_,d)))}},t.event.special.move={setup:function(){R(this,"movestart.move",t.noop)},teardown:function(){j(this,"movestart.move",t.noop)}},t.event.special.moveend={setup:function(){R(this,"movestart.moveend",t.noop)},teardown:function(){j(this,"movestart.moveend",t.noop)}},R(document,"mousedown.move",l),R(document,"touchstart.move",g),"function"==typeof Array.prototype.indexOf&&!function(t,e){for(var a=["changedTouches","targetTouches"],n=a.length;n--;)-1===t.event.props.indexOf(a[n])&&t.event.props.push(a[n])}(t)})}(jQuery);