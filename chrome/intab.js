var IntabExt = {

  cmd: false,
  alt: false,
  open: false,
  peeking: false,
  $container: null,
  $frame: null,
  $framecover: null,
  $urlForm: null,
  $urlInput: null,
  speed: 250,
  width: 0,

  init: function() {
    $("body").append('<div class="intabExt"><a href="#close" title="Close" class="intabExt-close intabExt-control"><i class="fa-icon-remove"></i></a><br /><a href="#open_full_tab" title="Open in New Tab" class="intabExt-expand intabExt-control"><i class="fa-icon-external-link"></i></a><form class="intabExt-urlForm"><input type="text" placeholder="Enter url..." /></form><iframe width="100%" height="100%" src=""></iframe><div class="intabExt-iframe-cover"></div></div>');
    this.$container = $('.intabExt');
    this.$frame = $('.intabExt iframe');
    this.$urlForm = $('.intabExt-urlForm');
    this.$urlInput = $('.intabExt-urlForm input');
    this.$framecover = $('.intabExt .intabExt-iframe-cover');
    this.bindEvents();
  },

  bindEvents: function() {

    $("body").on("click", "a", function(event) {
      var href = $(this).attr('href');
      if (href.indexOf("http://")==0 && href.indexOf("https://")==0) {
        return;
      }
      if (IntabExt.open || (IntabExt.cmd && IntabExt.alt)) {
        IntabExt.show(href);
        return false;
      }
    });

    this.$urlInput.focus(function(e) {
      setTimeout(function() {IntabExt.$urlInput.select();}, 0);
    })

    $(window).keydown(function(evt) {
      if (evt.which == 27) IntabExt.close();
      if (!IntabExt.cmd && evt.which == 91) IntabExt.cmd = true;
      if (!IntabExt.alt && evt.which == 18) IntabExt.alt = true;

      if (!IntabExt.open && !IntabExt.peeking && (IntabExt.cmd && IntabExt.alt)) {
        IntabExt.peek();
      }

      if (IntabExt.cmd && IntabExt.alt) {
        var sel = IntabExt.getSelection();
        if (sel.length > 0) {
          console.log(sel);
          href = 'http://google.com/search?q=' + sel;
          IntabExt.show(href);
        }
      }

    }).keyup(function(evt) {
      if (IntabExt.cmd && evt.which == 91) IntabExt.cmd = false;
      if (IntabExt.alt && evt.which == 18) IntabExt.alt = false;

      if (IntabExt.peeking && (!IntabExt.cmd || !IntabExt.alt)) {
        IntabExt.close();
      }
    });

    this.$urlForm.submit(function(e) {
      e.preventDefault();
      href = IntabExt.$urlInput.val();
      if (href === null || href.length == 0) {
        return;
      }
      if (!href.match(/^http|https/)) {
        href = 'http://' + href;
      }
      IntabExt.show(href);
    });

    $(document).bind('keydown', 'alt+ctrl+n', function() {
      // $('.intabExt-src').show();
    });

    IntabExt.$container.draggable({
      axis: 'x',
      iframeFix: true,
      drag: function( event, ui ) {
        if (IntabExt.peeking) {
          IntabExt.peeking = false;
          IntabExt.open = true;
        }
        IntabExt.width = 100 - (ui.position.left / $(window).width() *100);
        if (IntabExt.width < 98 && IntabExt.width > 1) {
          IntabExt.$container.css('width', IntabExt.width + '%');
        } else {
          return false;
        }
      },
      
      start: function () {
        IntabExt.$framecover.css('width', '100%');
      },

      stop: function (event, ui) {
        IntabExt.$framecover.css('width', 0);
       if (IntabExt.width < 5) {
        IntabExt.close();
       }
      }
    });

    $(".intabExt-close").on("click", function() {
      IntabExt.close();
      return false;
    });

    $(".intabExt-expand").on("click", function() {
      window.open($(".intabExt iframe").attr('src'));
      IntabExt.close();
      return false;
    })


  },

  peek: function() {
    this.$container.animate({width: "20px"});
    this.peeking = true;
  },

  show: function(href) {
    this.$frame.attr('src', href);
    if (!this.open) {
      this.$container.animate({width: '40%'}, this.speed);
    }
    this.$urlInput.val(href);
    this.open = true;
    this.peeking = false;
  },

  close: function() {
    this.$frame.attr('src', '');
    this.$container.css({right: '0', left: 'auto'}).animate({width: 0});
    this.open = false;
    this.peeking = false;
    this.$urlInput.val('');
  },

  getSelection: function() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
  }
}


$(function() {IntabExt.init()});