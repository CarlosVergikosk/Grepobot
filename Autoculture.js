Autoculture = {
    settings: {
        autostart: false,
        towns: {}
    },
    town: null,
    iTown: null,
    interval: null,
    isStopped: false,
    init: function() {
        ConsoleLog.Log('Initialize Autoculture', 2);
        Autoculture['initButton']()
    },
    initButton: function() {
        ModuleManager['initButtons']('Autoculture')
    },
    setSettings: function(_0xaa01x1) {
        if (_0xaa01x1 != '' && _0xaa01x1 != null) {
            $['extend'](Autoculture['settings'], JSON['parse'](_0xaa01x1))
        }
    },
    checkAvailable: function(_0xaa01x2) {
        var _0xaa01x3 = {
            party: false,
            triumph: false,
            theater: false
        };
        var _0xaa01x4 = ITowns['towns'][_0xaa01x2]['buildings']()['attributes'];
        var _0xaa01x5 = ITowns['towns'][_0xaa01x2]['resources']();
        if (_0xaa01x4['academy'] >= 30 && _0xaa01x5['wood'] >= 15000 && _0xaa01x5['stone'] >= 18000 && _0xaa01x5['iron'] >= 15000) {
            _0xaa01x3['party'] = true
        };
        if (_0xaa01x4['theater'] == 1 && _0xaa01x5['wood'] >= 10000 && _0xaa01x5['stone'] >= 12000 && _0xaa01x5['iron'] >= 10000) {
            _0xaa01x3['theater'] = true
        };
        if (MM['getModelByNameAndPlayerId']('PlayerKillpoints')['getUnusedPoints']() >= 300) {
            _0xaa01x3['triumph'] = true
        };
        return _0xaa01x3
    },
    checkReady: function(_0xaa01x6) {
        var _0xaa01x7 = ITowns['towns'][_0xaa01x6['id']];
        if (_0xaa01x7['hasConqueror']()) {
            return false
        };
        if (!ModuleManager['modules']['Autoculture']['isOn']) {
            return false
        };
        if (_0xaa01x6['modules']['Autoculture']['isReadyTime'] >= Timestamp['now']()) {
            return _0xaa01x6['modules']['Autoculture']['isReadyTime']
        };
        if (Autoculture['settings']['towns'][_0xaa01x6['id']] !== undefined && (Autoculture['settings']['towns'][_0xaa01x6['id']]['party'] && Autoculture['checkAvailable'](_0xaa01x6['id'])['party'] || Autoculture['settings']['towns'][_0xaa01x6['id']]['triumph'] && Autoculture['checkAvailable'](_0xaa01x6['id'])['triumph'] || Autoculture['settings']['towns'][_0xaa01x6['id']]['theater'] && Autoculture['checkAvailable'](_0xaa01x6['id'])['theater'])) {
            return true
        };
        return false
    },
    startCulture: function(_0xaa01x6) {
        if (!Autoculture['checkEnabled']()) {
            return false
        };
        if (!ModuleManager['modules']['Autoculture']['isOn']) {
            Autoculture['finished'](0);
            return false
        };
        Autoculture['town'] = _0xaa01x6;
        Autoculture['iTown'] = ITowns['towns'][Autoculture['town']['id']];
        if (ModuleManager['currentTown'] != Autoculture['town']['key']) {
            ConsoleLog.Log(Autoculture['town']['name'] + ' move to town.', 2);
            DataExchanger['switch_town'](Autoculture['town']['id'], function() {
                if (!Autoculture['checkEnabled']()) {
                    return false
                };
                ModuleManager['currentTown'] = Autoculture['town']['key'];
                Autoculture['start']()
            })
        } else {
            Autoculture['start']()
        }
    },
    start: function() {
        if (!Autoculture['checkEnabled']()) {
            return false
        };
        Autoculture['interval'] = setTimeout(function() {
            if (Autoculture['settings']['towns'][Autoculture['town']['id']] !== undefined) {
                ConsoleLog.Log(Autoculture['town']['name'] + ' getting event information.', 2);
                DataExchanger['building_place'](Autoculture['town']['id'], function(_0xaa01x8) {
                    if (!Autoculture['checkEnabled']()) {
                        return false
                    };
                    var _0xaa01x9 = [];
                    _0xaa01x9['push']({
                        name: 'triumph',
                        waiting: 19200,
                        element: $(_0xaa01x8['plain']['html'])['find']('#place_triumph')
                    });
                    _0xaa01x9['push']({
                        name: 'party',
                        waiting: 57600,
                        element: $(_0xaa01x8['plain']['html'])['find']('#place_party')
                    });
                    _0xaa01x9['push']({
                        name: 'theater',
                        waiting: 285120,
                        element: $(_0xaa01x8['plain']['html'])['find']('#place_theater')
                    });
                    var _0xaa01xa = false;
                    var _0xaa01xb = 0;
                    var _0xaa01xc = 300;
                    var _0xaa01xd = function(_0xaa01xe) {
                        if (_0xaa01xb == 3) {
                            if (!_0xaa01xa) {
                                ConsoleLog.Log(Autoculture['town']['name'] + ' not ready yet.', 2)
                            };
                            Autoculture['finished'](_0xaa01xc);
                            return false
                        };
                        if (_0xaa01xe['name'] == 'triumph' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['triumph'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['triumph'] || MM['getModelByNameAndPlayerId']('PlayerKillpoints')['getUnusedPoints']() < 300)) {
                            _0xaa01xb++;
                            _0xaa01xd(_0xaa01x9[_0xaa01xb]);
                            return false
                        } else {
                            if (_0xaa01xe['name'] == 'party' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['party'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['party'])) {
                                _0xaa01xb++;
                                _0xaa01xd(_0xaa01x9[_0xaa01xb]);
                                return false
                            } else {
                                if (_0xaa01xe['name'] == 'theater' && (!Autoculture['settings']['towns'][Autoculture['town']['id']]['theater'] || !Autoculture['checkAvailable'](Autoculture['town']['id'])['theater'])) {
                                    _0xaa01xb++;
                                    _0xaa01xd(_0xaa01x9[_0xaa01xb]);
                                    return false
                                }
                            }
                        };
                        if (_0xaa01xe['element']['find']('#countdown_' + _0xaa01xe['name'])['length']) {
                            var _0xaa01xf = Autobot['timeToSeconds'](_0xaa01xe['element']['find']('#countdown_' + _0xaa01xe['name'])['html']());
                            if (_0xaa01xc == 300) {
                                _0xaa01xc = _0xaa01xf
                            } else {
                                if (_0xaa01xc > _0xaa01xf) {
                                    _0xaa01xc = _0xaa01xf
                                }
                            };
                            _0xaa01xb++;
                            _0xaa01xd(_0xaa01x9[_0xaa01xb]);
                            return false
                        } else {
                            if (_0xaa01xe['element']['find']('.button, .button_new')['data']('enabled') != '1') {
                                _0xaa01xb++;
                                _0xaa01xd(_0xaa01x9[_0xaa01xb]);
                                return false
                            } else {
                                if (_0xaa01xe['element']['find']('.button, .button_new')['data']('enabled') == '1') {
                                    Autoculture['interval'] = setTimeout(function() {
                                        _0xaa01xa = true;
                                        Autoculture['startCelebration'](_0xaa01xe, function(_0xaa01x10) {
                                            if (Autoculture['isPauzed']) {
                                                return false
                                            };
                                            if (_0xaa01xc == 300) {
                                                _0xaa01xc = _0xaa01x10
                                            } else {
                                                if (_0xaa01xc >= _0xaa01x10) {
                                                    _0xaa01xc = _0xaa01x10
                                                }
                                            };
                                            _0xaa01xb++;
                                            _0xaa01xd(_0xaa01x9[_0xaa01xb])
                                        })
                                    }, (_0xaa01xb + 1) * Autobot['randomize'](1000, 2000));
                                    return false
                                }
                            }
                        };
                        _0xaa01xb++;
                        _0xaa01xd(_0xaa01x9[_0xaa01xb])
                    };
                    _0xaa01xd(_0xaa01x9[_0xaa01xb])
                })
            }
        }, Autobot['randomize'](2000, 4000))
    },
    startCelebration: function(_0xaa01xe, _0xaa01x11) {
        if (!Autoculture['checkEnabled']()) {
            return false
        };
        DataExchanger['start_celebration'](Autoculture['town']['id'], _0xaa01xe['name'], function(_0xaa01x8) {
            if (!Autoculture['checkEnabled']()) {
                return false
            };
            var _0xaa01x12 = 0;
            if (_0xaa01x8['json']['error'] == undefined) {
                var _0xaa01x13 = {};
                $['each'](_0xaa01x8['json']['notifications'], function(_0xaa01x14, _0xaa01x15) {
                    if (_0xaa01x15['subject'] == 'Celebration') {
                        _0xaa01x13 = JSON['parse'](_0xaa01x15['param_str'])
                    }
                });
                if (Autoculture['town']['id'] == Game['townId']) {
                    var _0xaa01x16 = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                    for (var _0xaa01x17 = 0; _0xaa01x16['length'] > _0xaa01x17; _0xaa01x17++) {
                        _0xaa01x16[_0xaa01x17]['getHandler']()['refresh']()
                    }
                };
                if (_0xaa01x13['Celebration'] != undefined) {
                    ConsoleLog.Log('<span style="color: #fff;">' + PopupFactory['texts'][_0xaa01x13['Celebration']['celebration_type']] + ' is started.</span>', 2);
                    _0xaa01x12 = _0xaa01x13['Celebration']['finished_at'] - Timestamp['now']()
                }
            } else {
                ConsoleLog.Log(Autoculture['town']['name'] + ' ' + _0xaa01x8['json']['error'], 2)
            };
            _0xaa01x11(_0xaa01x12)
        })
    },
    stop: function() {
        clearInterval(Autoculture['interval']);
        Autoculture['isStopped'] = true
    },
    finished: function(_0xaa01x12) {
        if (!Autoculture['checkEnabled']()) {
            return false
        };
        Autoculture['town']['modules']['Autoculture']['isReadyTime'] = Timestamp['now']() + _0xaa01x12;
        ModuleManager['Queue']['next']()
    },
    checkEnabled: function() {
        return ModuleManager['modules']['Autoculture']['isOn']
    },
    contentSettings: function() {
        var _0xaa01x18 = '<ul class="game_list" id="townsoverview"><li class="even">';
        _0xaa01x18 += '<div class="towninfo small tag_header col w80 h25" id="header_town"></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w40" id="header_island"> Island</div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w35" id="header_wood"><div class="col header wood"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w40" id="header_stone"><div class="col header stone"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w40" id="header_iron"><div class="col header iron"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w35" id="header_free_pop"><div class="col header free_pop"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w40" id="header_storage"><div class="col header storage"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration party"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration triumph"></div></div>';
        _0xaa01x18 += '<div class="towninfo small tag_header col w50" id="header_storage"><div class="col header celebration theater"></div></div>';
        _0xaa01x18 += '<div style="clear:both;"></div>';
        _0xaa01x18 += '</li></ul><div id="bot_townsoverview_table_wrapper">';
        _0xaa01x18 += '<ul class="game_list scroll_content">';
        var _0xaa01x17 = 0;
        $['each'](ModuleManager['playerTowns'], function(_0xaa01x19, _0xaa01x6) {
            var _0xaa01x1a = ITowns['towns'][_0xaa01x6['id']];
            var _0xaa01x1b = _0xaa01x1a['getIslandCoordinateX']();
            var _0xaa01x1c = _0xaa01x1a['getIslandCoordinateY']();
            var _0xaa01x1d = _0xaa01x1a['resources']();
            _0xaa01x18 += '<li class="' + (_0xaa01x17 % 2 ? 'even' : 'odd') + ' bottom" id="ov_town_' + _0xaa01x1a['id'] + '">';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w80">';
            _0xaa01x18 += '<div>';
            _0xaa01x18 += '<span><a href="#' + _0xaa01x1a['getLinkFragment']() + '" class="gp_town_link">' + _0xaa01x1a['name'] + '</a></span><br>';
            _0xaa01x18 += '<span>(' + _0xaa01x1a['getPoints']() + ' Ptn.)</span>';
            _0xaa01x18 += '</div></div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w40">';
            _0xaa01x18 += '<div>';
            _0xaa01x18 += '<span>' + _0xaa01x1b + ',' + _0xaa01x1c + '</span>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w40">';
            _0xaa01x18 += '<div class="wood' + (_0xaa01x1d['wood'] == _0xaa01x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xaa01x18 += _0xaa01x1d['wood'];
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w40">';
            _0xaa01x18 += '<div class="stone' + (_0xaa01x1d['stone'] == _0xaa01x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xaa01x18 += _0xaa01x1d['stone'];
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w40">';
            _0xaa01x18 += '<div class="iron' + (_0xaa01x1d['iron'] == _0xaa01x1d['storage'] ? ' town_storage_full' : '') + '">';
            _0xaa01x18 += _0xaa01x1d['iron'];
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w35">';
            _0xaa01x18 += '<div>';
            _0xaa01x18 += '<span class="town_population_count">' + _0xaa01x1d['population'] + '</span>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w40">';
            _0xaa01x18 += '<div>';
            _0xaa01x18 += '<span class="storage">' + _0xaa01x1d['storage'] + '</span>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w50">';
            _0xaa01x18 += '<div class="culture_party_row" id="culture_party_' + _0xaa01x1a['id'] + '">';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w50">';
            _0xaa01x18 += '<div class="culture_triumph_row" id="culture_triumph_' + _0xaa01x1a['id'] + '">';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div class="towninfo small townsoverview col w50">';
            _0xaa01x18 += '<div class="culture_theater_row" id="culture_theater_' + _0xaa01x1a['id'] + '">';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '</div>';
            _0xaa01x18 += '<div style="clear:both;"></div>';
            _0xaa01x18 += '</li>';
            _0xaa01x17++
        });
        _0xaa01x18 += '</ul></div>';
        _0xaa01x18 += '<div class="game_list_footer">';
        _0xaa01x18 += '<div id="bot_culture_settings"></div>';
        _0xaa01x18 += '</div>';
        var _0xaa01x1e = {};

        function _0xaa01x1f(_0xaa01x20) {
            var _0xaa01x21 = $(_0xaa01x20 + ' .checkbox_new');
            if (!_0xaa01x1e[_0xaa01x20]) {
                _0xaa01x21['addClass']('checked');
                _0xaa01x21['find']('input[type="checkbox"]')['prop']('checked', true);
                _0xaa01x1e[_0xaa01x20] = true
            } else {
                _0xaa01x21['removeClass']('checked');
                _0xaa01x21['find']('input[type="checkbox"]')['prop']('checked', false);
                _0xaa01x1e[_0xaa01x20] = false
            }
        }
        var _0xaa01x22 = $(_0xaa01x18);
        _0xaa01x22['find']('.celebration.party')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['party']))['on']('click', function() {
            _0xaa01x1f('.culture_party_row')
        });
        _0xaa01x22['find']('.celebration.triumph')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['triumph']))['on']('click', function() {
            _0xaa01x1f('.culture_triumph_row')
        });
        _0xaa01x22['find']('.celebration.theater')['mousePopup'](new MousePopup('Auto ' + PopupFactory['texts']['theater']))['on']('click', function() {
            _0xaa01x1f('.culture_theater_row')
        });
        $['each'](ModuleManager['playerTowns'], function(_0xaa01x19, _0xaa01x6) {
            _0xaa01x22['find']('#culture_party_' + _0xaa01x6['id'])['html'](FormBuilder['checkbox']({
                "id": 'bot_culture_party_' + _0xaa01x6['id'],
                "name": 'bot_culture_party_' + _0xaa01x6['id'],
                "checked": _0xaa01x6['id'] in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xaa01x6['id']]['party'] : false,
                "disabled": !Autoculture['checkAvailable'](_0xaa01x6['id'])['party']
            }));
            _0xaa01x22['find']('#culture_triumph_' + _0xaa01x6['id'])['html'](FormBuilder['checkbox']({
                "id": 'bot_culture_triumph_' + _0xaa01x6['id'],
                "name": 'bot_culture_triumph_' + _0xaa01x6['id'],
                "checked": _0xaa01x6['id'] in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xaa01x6['id']]['triumph'] : false,
                "disabled": !Autoculture['checkAvailable'](_0xaa01x6['id'])['triumph']
            }));
            _0xaa01x22['find']('#culture_theater_' + _0xaa01x6['id'])['html'](FormBuilder['checkbox']({
                "id": 'bot_culture_theater_' + _0xaa01x6['id'],
                "name": 'bot_culture_theater_' + _0xaa01x6['id'],
                "checked": _0xaa01x6['id'] in Autoculture['settings']['towns'] ? Autoculture['settings']['towns'][_0xaa01x6['id']]['theater'] : false,
                "disabled": !Autoculture['checkAvailable'](_0xaa01x6['id'])['theater']
            }))
        });
        _0xaa01x22['find']('#bot_culture_settings')['append'](FormBuilder['button']({
            name: DM['getl10n']('notes')['btn_save'],
            style: 'float: left;'
        })['on']('click', function() {
            var _0xaa01x23 = $('#bot_townsoverview_table_wrapper input')['serializeObject']();
            $['each'](ModuleManager['playerTowns'], function(_0xaa01x19, _0xaa01x6) {
                Autoculture['settings']['towns'][_0xaa01x6['id']] = {
                    party: false,
                    triumph: false,
                    theater: false
                }
            });
            $['each'](_0xaa01x23, function(_0xaa01x19, _0xaa01x24) {
                if (_0xaa01x19['indexOf']('bot_culture_party_') >= 0) {
                    Autoculture['settings']['towns'][_0xaa01x19['replace']('bot_culture_party_', '')]['party'] = (_0xaa01x24 != undefined)
                } else {
                    if (_0xaa01x19['indexOf']('bot_culture_triumph_') >= 0) {
                        Autoculture['settings']['towns'][_0xaa01x19['replace']('bot_culture_triumph_', '')]['triumph'] = (_0xaa01x24 != undefined)
                    } else {
                        if (_0xaa01x19['indexOf']('bot_culture_theater_') >= 0) {
                            Autoculture['settings']['towns'][_0xaa01x19['replace']('bot_culture_theater_', '')]['theater'] = (_0xaa01x24 != undefined)
                        }
                    }
                }
            });
            Autoculture['settings']['autostart'] = $('#autoculture_autostart')['prop']('checked');
            ConsoleLog.Log('Settings saved', 2);
            HumanMessage['success']('The settings were saved!')
        }))['append'](FormBuilder['checkbox']({
            "text": 'AutoStart AutoCulture.',
            "id": 'autoculture_autostart',
            "name": 'autoculture_autostart',
            "checked": Autoculture['settings']['autostart']
        }));
        return FormBuilder['gameWrapper']('AutoCulture', 'bot_townsoverview', _0xaa01x22, 'margin-bottom:9px;')
    },
}