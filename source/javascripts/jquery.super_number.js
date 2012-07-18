/* jQuery superNumber version 1.0.0
 * (c) 2012 Shane Riley
 * Original source at https://github.com/shaneriley/super_number
 * Licensed under GPL 2.0 (http://www.gnu.org/licenses/gpl-2.0.html)
 * Source hosted at http://www.gnu.org/licenses/gpl-2.0.html
 */
(function($) {
  if (!$) { return; }

  var super_number = {
    name: "superNumber",
    max: undefined,
    min: undefined,
    step: 1,
    controls: {
      $el: $("<a />", { href: "#" }),
      increment: "+",
      decrement: "-"
    },
    container: {
      element: "<div />",
      "class": "super_number"
    },
    createElements: function() {
      var s = this,
          container_opts = $.extend({}, s.container),
          $c;
      delete container_opts.element;
      s.$el.wrap($(s.container.element, container_opts));
      $c = s.$el.closest("." + container_opts["class"]);
      $.each(["in", "de"], function(i, v) {
        var c = v + "crement",
            $e = s.controls.$el.clone().text(s.controls[c]).data(super_number.name, s)
                  .addClass(c);
        s.controls["$" + c] = $e.appendTo($c);
      });
    },
    positionControls: function() {
      var s = this;
      s.controls.$increment.add(s.controls.$decrement)
        .css({
          left: (s.$el.closest("." + s.container["class"]).outerWidth() - s.controls.$increment.outerWidth()) / 2
        });
    },
    keyup: function(e) {
      if (e.which !== 38 && e.which !== 40) { return; }
      var s = $(this).data(super_number.name);
      s.controls["$" + (e.which === 38 ? "in" : "de") + "crement"].click();
    },
    click: function(e) {
      e.preventDefault();
      var $e = $(this),
          s = $e.data(super_number.name),
          v = +s.$el.val(),
          change = ($e.hasClass("increment") ? "+" : "-") + s.step,
          diff = v + +change;
      if (diff > s.max || diff < s.min) { return; }
      s.$el.val(diff);
    },
    destroy: function() {
      var $els = this;
      $els.each(function(i) {
        var s = $els.eq(i).data(super_number.name);
        $.each(["in", "de"], function(j, v) {
          s.controls["$" + v + "crement"].remove();
        });
        $els.unwrap("." + s.container["class"]).unbind("." + s.name).removeData(s.name);
      });
    },
    init: function() {
      var s = this;

      if (!s.$el.is(":input")) {
        $.error("jQuery." + s.name + ": one or more elements are not inputs and will not be initialized");
        return;
      }
      s.createElements();
      s.positionControls();
      s.$el.on("keydown." + s.name + ".keyup", s.keyup);
      s.$el.closest("." + s.container["class"]).on("click." + s.name + ".click", "a", s.click);
      s.initialized = true;
    }
  };

  $.each([super_number], function(i, plugin) {
    $.fn[plugin.name] = function(opts) {
      var $els = this,
          method = $.isPlainObject(opts) || !opts ? "" : opts;
      if (method && plugin[method]) {
        plugin[method].apply($els, Array.prototype.slice.call(arguments, 1));
      }
      else if (!method) {
        $els.each(function(i) {
          var plugin_instance = $.extend(true, {
            $el: $els.eq(i)
          }, plugin, opts);
          if (plugin_instance.$el.data(plugin.name)) { return; }
          plugin_instance.$el.data(plugin.name, plugin_instance);
          plugin_instance.init();
        });
      }
      else {
        $.error('Method ' +  method + ' does not exist on jQuery.' + plugin.name);
      }
      return $els;
    };
  });
})(jQuery || undefined);