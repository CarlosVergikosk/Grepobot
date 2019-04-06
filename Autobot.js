var Autobot = {
    title: 'Autobot',
    version: '0.427',
    domain: window.location.protocol + "//cdn.jsdelivr.net/gh/Robinatus/Grepobot@0.427/",
    botWnd: '',
    isLogged: false,
    Account: {
        player_id: Game.player_id,
        player_name: Game.player_name,
        world_id: Game.world_id,
        locale_lang: Game.locale_lang,
        premium_grepolis: Game.premium_user,
        csrfToken: Game.csrfToken
    },
    init: function () {
        ConsoleLog.Log('Initialize Autobot', 0);
        Autobot.loadModules();
        Autobot.initAjax();
        Autobot.initMapTownFeature();
        Autobot.fixMessage();
        Assistant.init()
    },
    /**
     * Load all bot modules from CDN
     */
    loadModules: function () {
        ModuleManager.loadModules();
    },
    /**
     * Initialize bot window
     */
    initWnd: function () {
        if (!Autobot['isLogged']) {
            return;
        }
        //if window is already initialized
        if (typeof Autobot.botWnd != 'undefined') {
            try {
                Autobot['botWnd']['close']()
            } catch (F) {};
            Autobot['botWnd'] = undefined
        };

        Autobot.botWnd = Layout.dialogWindow.open('', Autobot.title + ' v<span style="font-size: 10px;">' + Autobot.version + '</span>', 500, 350, '', false);
        Autobot.botWnd.setHeight([350])
        Autobot.botWnd.setPosition(['center', 'center']);
        var _0xe20bx2 = Autobot.botWnd.getJQElement();
        _0xe20bx2['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'menu_wrapper',
            "\x73\x74\x79\x6C\x65": 'left: 78px; right: 14px'
        })['append']($('<ul/>', {
            "\x63\x6C\x61\x73\x73": 'menu_inner'
        })['prepend'](Autobot['addMenuItem']('AUTHORIZE', 'Account', 'Account'))['prepend'](Autobot['addMenuItem']('CONSOLE', 'Assistant', 'Assistant'))['prepend'](Autobot['addMenuItem']('ASSISTANT', 'Console', 'Console')) /*['prepend'](Autobot['addMenuItem']('SUPPORT', 'Support', 'Support'))*/ ));
        if (typeof Autoattack !== 'undefined') {
            _0xe20bx2['find']('.menu_inner li:last-child')['before'](Autobot['addMenuItem']('ATTACKMODULE', 'Attack', 'Autoattack'))
        };
        if (typeof Autobuild !== 'undefined') {
            _0xe20bx2['find']('.menu_inner li:last-child')['before'](Autobot['addMenuItem']('CONSTRUCTMODULE', 'Build', 'Autobuild'))
        };
        if (typeof Autoculture !== 'undefined') {
            _0xe20bx2['find']('.menu_inner li:last-child')['before'](Autobot['addMenuItem']('CULTUREMODULE', 'Culture', 'Autoculture'))
        };
        if (typeof Autofarm !== 'undefined') {
            _0xe20bx2['find']('.menu_inner li:last-child')['before'](Autobot['addMenuItem']('FARMMODULE', 'Farm', 'Autofarm'))
        };
        $('#Autobot-AUTHORIZE')['click']()
    },
    addMenuItem: function (_0xe20bx3, _0xe20bx4, _0xe20bx5) {
        return $('<li/>')['append']($('<a/>', {
            "\x63\x6C\x61\x73\x73": 'submenu_link',
            "\x68\x72\x65\x66": '#',
            "\x69\x64": 'Autobot-' + _0xe20bx3,
            "\x72\x65\x6C": _0xe20bx5
        })['click'](function () {
            Autobot['botWnd']['getJQElement']()['find']('li a.submenu_link')['removeClass']('active');
            $(this)['addClass']('active');
            Autobot['botWnd']['setContent2'](Autobot['getContent']($(this)['attr']('rel')));
            if ($(this)['attr']('rel') == 'Console') {
                var _0xe20bx6 = $('.terminal');
                var _0xe20bx7 = $('.terminal-output')[0]['scrollHeight'];
                _0xe20bx6['scrollTop'](_0xe20bx7)
            }
        })['append'](function () {
            return _0xe20bx5 != 'Support' ? $('<span/>', {
                "\x63\x6C\x61\x73\x73": 'left'
            })['append']($('<span/>', {
                "\x63\x6C\x61\x73\x73": 'right'
            })['append']($('<span/>', {
                "\x63\x6C\x61\x73\x73": 'middle'
            })['html'](_0xe20bx4))) : '<a id="help-button" onclick="return false;" class="confirm"></a>'
        }))
    },
    getContent: function (_0xe20bx8) {
        if (_0xe20bx8 == 'Console') {
            return ConsoleLog['contentConsole']()
        } else {
            if (_0xe20bx8 == 'Account') {
                return Autobot['contentAccount']()
            } else {
                /*if (_0xe20bx8 == 'Support') {
                    return Autobot['contentSupport']()
                } else {*/
                if (typeof window[_0xe20bx8] != 'undefined') {
                    return window[_0xe20bx8]['contentSettings']()
                };
                return ''
                //}
            }
        }
    },

    /**
     * First tab of bot 
     */
    contentAccount: function () {
        var _rows = {
            "Name:": Game.player_name,
            "World:": Game.world_id,
            "Rank:": Game.player_rank,
            "Towns:": Game.player_villages,
            "Language:": Game.locale_lang
        };
        var _table = $('<table/>', {
            "class": 'game_table layout_main_sprite',
            "cellspacing": '0',
            "width": '100%'
        }).append(function () {
            var _counter = 0;
            var _tbody = $('<tbody/>');
            $.each(_rows, function (_index, _value) {
                _tbody.append($('<tr/>', {
                    "class": _counter % 2 ? 'game_table_even' : 'game_table_odd'
                }).append($('<td/>', {
                    "style": 'background-color: #DFCCA6;width: 30%;'
                }).html(_index)).append($('<td/>').html(_value)));
                _counter++
            });
            return _tbody
        });
        return FormBuilder.gameWrapper('Account', 'account_property_wrapper', _table, 'margin-bottom:9px;')[0]['outerHTML'];
    },
    fixMessage: function () {
        var _0xe20bx12 = function (_0xe20bx13) {
            return function () {
                _0xe20bx13['apply'](this, arguments);
                $(window)['unbind']('click')
            }
        };
        HumanMessage['_initialize'] = _0xe20bx12(HumanMessage._initialize)
    },

    /**
     * Subscribe to ajaxComplete Event
     */
    initAjax: function () {
        $(document).ajaxComplete(function (_event, _xhr, _settings) {
            if (_settings.url.indexOf(Autobot.domain) == -1 && _settings.url.indexOf('/game/') != -1 && _xhr.readyState == 4 && _xhr.status == 200) {
                var _url = _settings.url.split('?');
                var _action = _url[0].substr(6) + '/' + _url[1].split('&')[1].substr(7);
                if (typeof Autobuild !== 'undefined') {
                    Autobuild.calls(_action);
                };
                if (typeof Autoattack !== 'undefined') {
                    Autoattack.calls(_action, _xhr.responseText);
                }
            }
        })
    },
    randomize: function (_0xe20bx26, _0xe20bx27) {
        return Math['floor'](Math['random']() * (_0xe20bx27 - _0xe20bx26 + 1)) + _0xe20bx26
    },
    secondsToTime: function (_0xe20bx28) {
        var _0xe20bx29 = Math['floor'](_0xe20bx28 / 86400);
        var _0xe20bx2a = Math['floor']((_0xe20bx28 % 86400) / 3600);
        var _0xe20bx2b = Math['floor'](((_0xe20bx28 % 86400) % 3600) / 60);
        return (_0xe20bx29 ? _0xe20bx29 + ' days ' : '') + (_0xe20bx2a ? _0xe20bx2a + ' hours ' : '') + (_0xe20bx2b ? _0xe20bx2b + ' minutes ' : '')
    },
    timeToSeconds: function (_0xe20bx2c) {
        var _0xe20bx2d = _0xe20bx2c['split'](':'),
            _0xe20bx1e = 0,
            _0xe20bx2e = 1;
        while (_0xe20bx2d['length'] > 0) {
            _0xe20bx1e += _0xe20bx2e * parseInt(_0xe20bx2d['pop'](), 10);
            _0xe20bx2e *= 60
        };
        return _0xe20bx1e
    },

    createNotification: function (_0xe20bx30, _0xe20bx31) {
        var _0xe20bx32 = (typeof Layout['notify'] == 'undefined') ? new NotificationHandler() : Layout;
        _0xe20bx32['notify']($('#notification_area>.notification')['length'] + 1, _0xe20bx30, '<span><b>' + 'Autobot' + '</b></span>' + _0xe20bx31 + '<span class=\'small notification_date\'>' + 'Version ' + Autobot['version'] + '</span>')
    },
    toHHMMSS: function (_0xe20bx33) {
        var _0xe20bx34 = ~~(_0xe20bx33 / 3600);
        var _0xe20bx35 = ~~((_0xe20bx33 % 3600) / 60);
        var _0xe20bx36 = _0xe20bx33 % 60;
        ret = '';
        if (_0xe20bx34 > 0) {
            ret += '' + _0xe20bx34 + ':' + (_0xe20bx35 < 10 ? '0' : '')
        };
        ret += '' + _0xe20bx35 + ':' + (_0xe20bx36 < 10 ? '0' : '');
        ret += '' + _0xe20bx36;
        return ret
    },
    stringify: function (_0xe20bx37) {
        var _0xe20bx38 = typeof _0xe20bx37;
        if (_0xe20bx38 === 'string') {
            return '"' + _0xe20bx37 + '"'
        };
        if (_0xe20bx38 === 'boolean' || _0xe20bx38 === 'number') {
            return _0xe20bx37
        };
        if (_0xe20bx38 === 'function') {
            return _0xe20bx37.toString()
        };
        var _0xe20bx39 = [];
        for (var _0xe20bx3a in _0xe20bx37) {
            _0xe20bx39['push']('"' + _0xe20bx3a + '":' + this['stringify'](_0xe20bx37[_0xe20bx3a]))
        };
        return '{' + _0xe20bx39['join'](',') + '}'
    },
    town_map_info: function (_0xe20bx3b, _0xe20bx3c) {
        if (_0xe20bx3b != undefined && _0xe20bx3b['length'] > 0 && _0xe20bx3c['player_name']) {
            for (var _0xe20bx3d = 0; _0xe20bx3d < _0xe20bx3b['length']; _0xe20bx3d++) {
                if (_0xe20bx3b[_0xe20bx3d]['className'] == 'flag town') {
                    if (typeof Assistant !== 'undefined') {
                        if (Assistant['settings']['town_names']) {
                            $(_0xe20bx3b[_0xe20bx3d])['addClass']('active_town')
                        };
                        if (Assistant['settings']['player_name']) {
                            $(_0xe20bx3b[_0xe20bx3d])['addClass']('active_player')
                        };
                        if (Assistant['settings']['alliance_name']) {
                            $(_0xe20bx3b[_0xe20bx3d])['addClass']('active_alliance')
                        }
                    };
                    $(_0xe20bx3b[_0xe20bx3d])['append']('<div class="player_name">' + (_0xe20bx3c['player_name'] || '') + '</div>');
                    $(_0xe20bx3b[_0xe20bx3d])['append']('<div class="town_name">' + _0xe20bx3c['name'] + '</div>');
                    $(_0xe20bx3b[_0xe20bx3d])['append']('<div class="alliance_name">' + (_0xe20bx3c['alliance_name'] || '') + '</div>');
                    break
                }
            }
        };
        return _0xe20bx3b
    },
    checkPremium: function (_0xe20bx3e) {
        return $('.advisor_frame.' + _0xe20bx3e + ' div')['hasClass'](_0xe20bx3e + '_active')
    },
    initWindow: function () {
        $('.nui_main_menu')['css']('top', '282px');
        $('<div/>', {
            class: 'nui_bot_toolbox'
        })['append']($('<div/>', {
            class: 'bot_menu layout_main_sprite'
        })['append']($('<ul/>')['append']($('<li/>', {
            id: 'Autofarm_onoff',
            class: 'disabled'
        })['append']($('<span/>', {
            class: 'autofarm farm_town_status_0'
        })))['append']($('<li/>', {
            id: 'Autoculture_onoff',
            class: 'disabled'
        })['append']($('<span/>', {
            class: 'autoculture farm_town_status_0'
        })))['append']($('<li/>', {
            id: 'Autobuild_onoff',
            class: 'disabled'
        })['append']($('<span/>', {
            class: 'autobuild toolbar_activities_recruits'
        })))['append']($('<li/>', {
            id: 'Autoattack_onoff',
            class: 'disabled'
        })['append']($('<span/>', {
            class: 'autoattack sword_icon'
        })))['append']($('<li/>')['append']($('<span/>', {
            href: '#',
            class: 'botsettings circle_button_settings'
        })['on']('click', function () {
            if (Autobot['isLogged']) {
                Autobot['initWnd']()
            }
        })['mousePopup'](new MousePopup(DM['getl10n']('COMMON')['main_menu']['settings']))))))['append']($('<div/>', {
            id: 'time_autobot',
            class: 'time_row'
        }))['append']($('<div/>', {
            class: 'bottom'
        }))['insertAfter']('.nui_left_box')
    },
    initMapTownFeature: function () {
        var _0xe20bx3f = function (_0xe20bx13) {
            return function () {
                var _0xe20bx3b = _0xe20bx13['apply'](this, arguments);
                return Autobot['town_map_info'](_0xe20bx3b, arguments[0])
            }
        };
        MapTiles['createTownDiv'] = _0xe20bx3f(MapTiles['createTownDiv'])
    },
    checkAutoRelogin: function () {
        if (typeof $['cookie']('pid') !== 'undefined' && typeof $['cookie']('ig_conv_last_site') !== 'undefined') {
            var _0xe20bx40 = $['cookie']('ig_conv_last_site')['match'](/\/\/(.*?)\.grepolis\.com/g)[0]['replace']('//', '')['replace']('.grepolis.com', '');
            /* TODO
            DataExchanger.Auth('checkAutorelogin', {
                player_id: $['cookie']('pid'),
                world_id: _0xe20bx40
            }, function(_0xe20bx9) {
                if (_0xe20bx9 != 0) {
                    setTimeout(function() {
                        DataExchanger['login_to_game_world'](_0xe20bx40)
                    }, _0xe20bx9 * 1000)
                }
            })*/
        }
    }
};
(function () {
    String['prototype']['capitalize'] = function () {
        return this['charAt'](0)['toUpperCase']() + this['slice'](1)
    };
    $['fn']['serializeObject'] = function () {
        var _0xe20bx41 = {};
        var _0xe20bx42 = this['serializeArray']();
        $['each'](_0xe20bx42, function () {
            if (_0xe20bx41[this['name']] !== undefined) {
                if (!_0xe20bx41[this['name']]['push']) {
                    _0xe20bx41[this['name']] = [_0xe20bx41[this['name']]]
                };
                _0xe20bx41[this['name']]['push'](this['value'] || '')
            } else {
                _0xe20bx41[this['name']] = this['value'] || ''
            }
        });
        return _0xe20bx41
    };
    var _0xe20bx43 = setInterval(function () {
        if (window != undefined) {
            if ($('.nui_main_menu')['length'] &&
                !$['isEmptyObject'](ITowns['towns'])) {
                clearInterval(_0xe20bx43);
                Autobot['initWindow']();
                Autobot['initMapTownFeature']();

                $['when'](
                    $['getScript'](Autobot['domain'] + 'DataExchanger.js'),
                    $['getScript'](Autobot['domain'] + 'ConsoleLog.js'),
                    $['getScript'](Autobot['domain'] + 'FormBuilder.js'),
                    $['getScript'](Autobot['domain'] + 'ModuleManager.js'),
                    $['getScript'](Autobot['domain'] + 'Assistant.js'),
                    $.Deferred(function (_0xe20bx44) {
                        $(_0xe20bx44['resolve'])
                    })
                )['done'](function () {
                    Autobot['init']()
                })

            } else {
                if (/grepolis\.com\/start\?nosession/g ['test'](window['location']['href'])) {
                    clearInterval(_0xe20bx43);
                    $['when'](
                        $['getScript'](Autobot['domain'] + 'DataExchanger.js'),
                        $['getScript'](Autobot['domain'] + 'Redirect.js'),
                        $.Deferred(function (_0xe20bx44) {
                            $(_0xe20bx44['resolve'])
                        })
                    )['done'](function () {
                        Autobot['checkAutoRelogin']()
                    })
                }
            }
        }
    }, 100)
})()