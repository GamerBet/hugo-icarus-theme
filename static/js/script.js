(function($) {
  var toTop = $('#toTop').length ? $('#toTop').offset().top - $(window).height() + 20 : 0;

  // Share
  $('body').on('click', function() {
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e) {
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      offset = $this.offset();

    if ($('#' + id).length) {
      var box = $('#' + id);

      if (box.hasClass('on')) {
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
        '<input class="article-share-input" value="' + url + '">',
        '<div class="article-share-links">',
        '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="fa fa-twitter article-share-twitter" target="_blank" title="Twitter"></a>',
        '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="fa fa-facebook article-share-facebook" target="_blank" title="Facebook"></a>',
        '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="fa fa-pinterest article-share-pinterest" target="_blank" title="Pinterest"></a>',
        '<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="fa fa-google article-share-google" target="_blank" title="Google+"></a>',
        '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e) {
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function() {
    $(this).select();
  }).on('click', '.article-share-box-link', function(e) {
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i) {
    $(this).find('img').each(function() {
      if ($(this).parent().hasClass('fancybox')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
    });

    $(this).find('.fancybox').each(function() {
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox) {
    $('.fancybox').fancybox();
  }

  // Profile card
  $(document).on('click', function() {
    $('#profile').removeClass('card');
  }).on('click', '#profile-anchor', function(e) {
    e.stopPropagation();
    $('#profile').toggleClass('card');
  }).on('click', '.profile-inner', function(e) {
    e.stopPropagation();
  });

  // To Top
  $(document).on('scroll', function() {
    if ($(document).width() >= 800) {
      if ($(this).scrollTop() > toTop) {
        $('#toTop').addClass('fix');
        $('#toTop').css('left', $('#sidebar').offset().left);
      } else {
        $('#toTop').removeClass('fix');
      }
    } else {
      $('#toTop').addClass('fix');
      $('#toTop').css('right', 20);
    }
  }).on('click', '#toTop', function() {
    $(document).scrollTop(0);
  });

  $(".submitGetReplays").click(function(event) {
    $("#getReplays").submit();
    event.preventDefault();
  });

  $("#getReplays").submit(function(event) {
    var data = {}
    data.firstName = $("#firstName").val();
    data.lastName = $("#lastName").val();
    data.region = $("#region").val();
    data.email = $("#email").val();

    var names = document.getElementsByName("summonerName");
    var regions = document.getElementsByName("region");

    var summoners = [];
    for (I = 0; I < names.length; I++) {
      summoners.push({
        summonerName: names[I].value,
        region: regions[I].value
      });
    }

    data.summoners = summoners;

    request(
      "https://gamerbet.co/api/ec/contact",
      "POST",
      JSON.stringify(data),
      true).then(function(res) {
      $("#getReplays").html("Thanks! Keep an eye on your inbox, you'll get an email when your account is ready.")
      $(".submitGetReplays").remove();
    })
    event.preventDefault();
  });

  var max_fields = 10; //maximum input boxes allowed
  var x = 1; //initlal text box count

  function initSummonerForm() {

    var wrapper = $("#getReplays"); //Fields wrapper
    var add_button = $("#addSummoner"); //Add button ID
    $(add_button).click(function(e) { //on add input button click
      e.preventDefault();
      if (x < max_fields) { //max input box allowed
        x++; //text box increment
        add_button.remove();
        $(wrapper).append('<div class="row">' +
          '<div class="col-lg-5 col-md-5 col-sm-5">' +
          '<input id="summonerName1" name="summonerName" type="text" placeholder="Summoner Name" class="search-form-input" />' +
          '</div>' +
          '<div class="col-lg-5 col-md-5 col-sm-5">' +
          '<input id="region1" name="region" type="text" placeholder="Region" class="search-form-input" />' +
          '</div>' +
          '<div class="col-lg-2 col-md-2 col-sm-2">' +
          '<a id="addSummoner" class="follow" href="#"><i class="fa fa-plus"></i></a>' +
          '</div>' +
          '</div>');
        initSummonerForm()
      } else {
        add_button.remove();
      }
    });

    $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
      e.preventDefault();
      $(this).parent('div').remove();
      x--;
    })
  }

  initSummonerForm();

  function request(route, method, data, json) {
    return new Promise(function(resolve, reject) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open(method, route, true);

      if (method == "POST") {
        //Send the appropriate headers
        xmlhttp.setRequestHeader("Content-type", "application/json");
      }

      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
          if (method == "POST")
            console.log("Response:", xmlhttp.responseText);
          console.log("method:", method);
          if (xmlhttp.status == 200) {
            if (json == true) {
              resolve(JSON.parse(xmlhttp.responseText))
            } else {
              resolve(xmlhttp.responseText)
            }
          } else if (xmlhttp.status == 400) {
            if (json == true) {
              reject(JSON.parse(xmlhttp.responseText))
            } else {
              reject(xmlhttp.responseText)
            }
          } else {
            if (json == true) {
              reject(JSON.parse(xmlhttp.responseText))
            } else {
              reject(xmlhttp.responseText)
            }
          }
        }
      }

      xmlhttp.send(data);
    });
  }

})(jQuery);
