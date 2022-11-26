var Autobot = {
  title: 'Autobot',
  version: '1',
  domain:
    window.location.protocol +
    '//cdn.jsdelivr.net/gh/CarlosVergikosk/Grepobot@master/',
  botWnd: '',
  isLogged: false,
  Account: {
    player_id: Game.player_id,
    player_name: Game.player_name,
    world_id: Game.world_id,
    locale_lang: Game.locale_lang,
    premium_grepolis: Game.premium_user,
    csrfToken: Game.csrfToken,
  },
  init: function () {
    ConsoleLog.Log('Initialize Autobot', 0);
    Autobot.loadModules();
    Autobot.initAjax();
    Autobot.initMapTownFeature();
    Autobot.fixMessage();
    Assistant.init();
  },
  loadModules: function () {
    ModuleManager.loadModules();
  },
  initWnd: function () {
    if (!Autobot.isLogged) {
      return;
    }
    if (typeof Autobot.botWnd != 'undefined') {
      try {
        Autobot.botWnd.close();
      } catch (F) {}
      Autobot.botWnd = undefined;
    }
    Autobot.botWnd = Layout.dialogWindow.open(
      '',
      Autobot.title +
        '<span style="font-size: 10px;">' +
        Autobot.version +
        '</span>',
      500,
      350,
      '',
      false
    );
    Autobot.botWnd.setHeight([350]);
    Autobot.botWnd.setPosition(['center', 'center']);
    var yessenia = Autobot.botWnd.getJQElement();
    yessenia.append(
      $('<div/>', {
        class: 'menu_wrapper',
        style: 'left: 78px; right: 14px',
      }).append(
        $('<ul/>', { class: 'menu_inner' })
          .prepend(Autobot.addMenuItem('AUTHORIZE', 'Account', 'Account'))
          .prepend(Autobot.addMenuItem('CONSOLE', 'Assistant', 'Assistant'))
          .prepend(Autobot.addMenuItem('ASSISTANT', 'Console', 'Console'))
      )
    );
    if (typeof Autoattack !== 'undefined') {
      yessenia
        .find('.menu_inner li:last-child')
        .before(Autobot.addMenuItem('ATTACKMODULE', 'Attack', 'Autoattack'));
    }
    if (typeof Autobuild !== 'undefined') {
      yessenia
        .find('.menu_inner li:last-child')
        .before(Autobot.addMenuItem('CONSTRUCTMODULE', 'Build', 'Autobuild'));
    }
    if (typeof Autoculture !== 'undefined') {
      yessenia
        .find('.menu_inner li:last-child')
        .before(Autobot.addMenuItem('CULTUREMODULE', 'Culture', 'Autoculture'));
    }
    if (typeof Autofarm !== 'undefined') {
      yessenia
        .find('.menu_inner li:last-child')
        .before(Autobot.addMenuItem('FARMMODULE', 'Farm', 'Autofarm'));
    }
    $('#Autobot-AUTHORIZE').click();
  },
  addMenuItem: function (tmarion, zarrah, aeda) {
    return $('<li/>').append(
      $('<a/>', {
        class: 'submenu_link',
        href: '#',
        id: 'Autobot-' + tmarion,
        rel: aeda,
      })
        .click(function () {
          Autobot.botWnd
            .getJQElement()
            .find('li a.submenu_link')
            .removeClass('active');
          $(this).addClass('active');
          Autobot.botWnd.setContent2(Autobot.getContent($(this).attr('rel')));
          if ($(this).attr('rel') == 'Console') {
            var amear = $('.terminal');
            var sok = $('.terminal-output')[0].scrollHeight;
            amear.scrollTop(sok);
          }
        })
        .append(function () {
          return aeda != 'Support'
            ? $('<span/>', { class: 'left' }).append(
                $('<span/>', { class: 'right' }).append(
                  $('<span/>', { class: 'middle' }).html(zarrah)
                )
              )
            : '<a id="help-button" onclick="return false;" class="confirm"></a>';
        })
    );
  },
  getContent: function (aniha) {
    if (aniha == 'Console') {
      return ConsoleLog.contentConsole();
    } else {
      if (aniha == 'Account') {
        return Autobot.contentAccount();
      } else {
        if (typeof window[aniha] != 'undefined') {
          return window[aniha].contentSettings();
        }
        return '';
      }
    }
  },
  contentAccount: function () {
    var _rows = {
      'Name:': Game.player_name,
      'World:': Game.world_id,
      'Rank:': Game.player_rank,
      'Towns:': Game.player_villages,
      'Language:': Game.locale_lang,
    };
    var _table = $('<table/>', {
      class: 'game_table layout_main_sprite',
      cellspacing: '0',
      width: '100%',
    }).append(function () {
      var _counter = 0;
      var _tbody = $('<tbody/>');
      $.each(_rows, function (_index, _value) {
        _tbody.append(
          $('<tr/>', {
            class: _counter % 2 ? 'game_table_even' : 'game_table_odd',
          })
            .append(
              $('<td/>', {
                style: 'background-color: #DFCCA6;width: 30%;',
              }).html(_index)
            )
            .append($('<td/>').html(_value))
        );
        _counter++;
      });
      return _tbody;
    });
    return FormBuilder.gameWrapper(
      'Account',
      'account_property_wrapper',
      _table,
      'margin-bottom:9px;'
    )[0].outerHTML;
  },
  fixMessage: function () {
    var aspenn = function (kindrick) {
      return function () {
        kindrick.apply(this, arguments);
        $(window).unbind('click');
      };
    };
    HumanMessage._initialize = aspenn(HumanMessage._initialize);
  },
  initAjax: function () {
    $(document).ajaxComplete(function (_event, _xhr, _settings) {
      if (
        _settings.url.indexOf(Autobot.domain) == -1 &&
        _settings.url.indexOf('/game/') != -1 &&
        _xhr.readyState == 4 &&
        _xhr.status == 200
      ) {
        var _url = _settings.url.split('?');
        var _action = _url[0].substr(6) + '/' + _url[1].split('&')[1].substr(7);
        if (typeof Autobuild !== 'undefined') {
          Autobuild.calls(_action);
        }
        if (typeof Autoattack !== 'undefined') {
          Autoattack.calls(_action, _xhr.responseText);
        }
      }
    });
  },
  randomize: function (tremir, rishan) {
    return Math.floor(Math.random() * (rishan - tremir + 1)) + tremir;
  },
  secondsToTime: function (dharmik) {
    var symir = Math.floor(dharmik / 86400);
    var truleigh = Math.floor((dharmik % 86400) / 3600);
    var tanairi = Math.floor(((dharmik % 86400) % 3600) / 60);
    return (
      (symir ? symir + ' days ' : '') +
      (truleigh ? truleigh + ' hours ' : '') +
      (tanairi ? tanairi + ' minutes ' : '')
    );
  },
  timeToSeconds: function (kymira) {
    var daevin = kymira.split(':'),
      jynesis = 0,
      ivone = 1;
    while (daevin.length > 0) {
      jynesis += ivone * parseInt(daevin.pop(), 10);
      ivone *= 60;
    }
    return jynesis;
  },
  createNotification: function (artavia, nakoa) {
    var deandrew =
      typeof Layout.notify == 'undefined' ? new NotificationHandler() : Layout;
    deandrew.notify(
      $('#notification_area>.notification').length + 1,
      artavia,
      '<span><b>Autobot</b></span>' +
        nakoa +
        "<span class='small notification_date'>" +
        'Version ' +
        Autobot.version +
        '</span>'
    );
  },
  toHHMMSS: function (tynae) {
    var tyrecia = ~~(tynae / 3600);
    var hascal = ~~((tynae % 3600) / 60);
    var ismail = tynae % 60;
    ret = '';
    if (tyrecia > 0) {
      ret += '' + tyrecia + ':' + (hascal < 10 ? '0' : '');
    }
    ret += '' + hascal + ':' + (ismail < 10 ? '0' : '');
    ret += '' + ismail;
    return ret;
  },
  stringify: function (jaelynn) {
    var yairet = typeof jaelynn;
    if (yairet === 'string') {
      return '"' + jaelynn + '"';
    }
    if (yairet === 'boolean' || yairet === 'number') {
      return jaelynn;
    }
    if (yairet === 'function') {
      return jaelynn.toString();
    }
    var chanin = [];
    for (var zakaira in jaelynn) {
      chanin.push('"' + zakaira + '":' + this.stringify(jaelynn[zakaira]));
    }
    return '{' + chanin.join(',') + '}';
  },
  town_map_info: function (jakwon, saryna) {
    if (jakwon != undefined && jakwon.length > 0 && saryna.player_name) {
      for (var demeturis = 0; demeturis < jakwon.length; demeturis++) {
        if (jakwon[demeturis].className == 'flag town') {
          if (typeof Assistant !== 'undefined') {
            if (Assistant.settings.town_names) {
              $(jakwon[demeturis]).addClass('active_town');
            }
            if (Assistant.settings.player_name) {
              $(jakwon[demeturis]).addClass('active_player');
            }
            if (Assistant.settings.alliance_name) {
              $(jakwon[demeturis]).addClass('active_alliance');
            }
          }
          $(jakwon[demeturis]).append(
            '<div class="player_name">' + (saryna.player_name || '') + '</div>'
          );
          $(jakwon[demeturis]).append(
            '<div class="town_name">' + saryna.name + '</div>'
          );
          $(jakwon[demeturis]).append(
            '<div class="alliance_name">' +
              (saryna.alliance_name || '') +
              '</div>'
          );
          break;
        }
      }
    }
    return jakwon;
  },
  checkPremium: function (aleena) {
    return $('.advisor_frame.' + aleena + ' div').hasClass(aleena + '_active');
  },
  initWindow: function () {
    $('.nui_main_menu').css('top', '282px');
    $('<div/>', { class: 'nui_bot_toolbox' })
      .append(
        $('<div/>', { class: 'bot_menu layout_main_sprite' }).append(
          $('<ul/>')
            .append(
              $('<li/>', { id: 'Autofarm_onoff', class: 'disabled' }).append(
                $('<span/>', { class: 'autofarm farm_town_status_0' })
              )
            )
            .append(
              $('<li/>', { id: 'Autoculture_onoff', class: 'disabled' }).append(
                $('<span/>', { class: 'autoculture farm_town_status_0' })
              )
            )
            .append(
              $('<li/>', { id: 'Autobuild_onoff', class: 'disabled' }).append(
                $('<span/>', { class: 'autobuild toolbar_activities_recruits' })
              )
            )
            .append(
              $('<li/>', { id: 'Autoattack_onoff', class: 'disabled' }).append(
                $('<span/>', { class: 'autoattack sword_icon' })
              )
            )
            .append(
              $('<li/>').append(
                $('<span/>', {
                  href: '#',
                  class: 'botsettings circle_button_settings',
                })
                  .on('click', function () {
                    if (Autobot.isLogged) {
                      Autobot.initWnd();
                    }
                  })
                  .mousePopup(
                    new MousePopup(DM.getl10n('COMMON').main_menu.settings)
                  )
              )
            )
        )
      )
      .append($('<div/>', { id: 'time_autobot', class: 'time_row' }))
      .append($('<div/>', { class: 'bottom' }))
      .insertAfter('.nui_left_box');
  },
  initMapTownFeature: function () {
    var shamanique = function (quetzalcoatl) {
      return function () {
        var videlle = quetzalcoatl.apply(this, arguments);
        return Autobot.town_map_info(videlle, arguments[0]);
      };
    };
    MapTiles.createTownDiv = shamanique(MapTiles.createTownDiv);
  },
  checkAutoRelogin: function () {
    if (
      typeof $.cookie('pid') !== 'undefined' &&
      typeof $.cookie('ig_conv_last_site') !== 'undefined'
    ) {
      var elroi = $.cookie('ig_conv_last_site')
        .match(/\/\/(.*?)\.grepolis\.com/g)[0]
        .replace('//', '')
        .replace('.grepolis.com', '');
    }
  },
};
(function () {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
  };
  $.fn.serializeObject = function () {
    var elah = {};
    var lacresia = this.serializeArray();
    $.each(lacresia, function () {
      if (elah[this.name] !== undefined) {
        if (!elah[this.name].push) {
          elah[this.name] = [elah[this.name]];
        }
        elah[this.name].push(this.value || '');
      } else {
        elah[this.name] = this.value || '';
      }
    });
    return elah;
  };
  var initer = setInterval(function () {
    if (window != undefined) {
      if ($('.nui_main_menu').length && !$.isEmptyObject(ITowns.towns)) {
        clearInterval(initer);
        Autobot.initWindow();
        Autobot.initMapTownFeature();
        $.when(
          $.getScript(Autobot.domain + 'DataExchanger.js'),
          $.getScript(Autobot.domain + 'ConsoleLog.js'),
          $.getScript(Autobot.domain + 'FormBuilder.js'),
          $.getScript(Autobot.domain + 'ModuleManager.js'),
          $.getScript(Autobot.domain + 'Assistant.js'),
          $.Deferred(function (brixley) {
            $(brixley.resolve);
          })
        ).done(function () {
          Autobot.init();
        });
      } else {
        if (/grepolis\.com\/start\?nosession/g.test(window.location.href)) {
          clearInterval(initer);
          $.when(
            $.getScript(Autobot.domain + 'DataExchanger.js'),
            $.getScript(Autobot.domain + 'Redirect.js'),
            $.Deferred(function (breella) {
              $(breella.resolve);
            })
          ).done(function () {
            Autobot.checkAutoRelogin();
          });
        }
      }
    }
  }, 100);
})();
