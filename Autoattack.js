Autoattack = {
    settings: {
        autostart: false
    },
    attacks: [],
    attacks_timers: [],
    view: null,
    checked_count: 0,
    init: function() {
        ConsoleLog.Log('Initialize Autoattack', 4);
        Autoattack['initButton']();
        if (Autobot['checkPremium']('captain')) {
            Autoattack['loadAttackQueue']()
        }
    },
    setSettings: function(_0x44b9x1) {
        if (_0x44b9x1 != '' && _0x44b9x1 != null) {
            $['extend'](Autoattack['settings'], JSON['parse'](_0x44b9x1))
        }
    },
    initButton: function() {
        ModuleManager['initButtons']('Autoattack')
    },
    start: function() {
        Autoattack['attacks_timers'] = [];
        var _0x44b9x2 = $['map'](Autoattack['attacks'], function(_0x44b9x3, _0x44b9x4) {
            var _0x44b9x5 = $.Deferred();
            Autoattack['checkAttack'](_0x44b9x3, _0x44b9x4)['then'](function() {
                _0x44b9x5['resolve']()
            });
            return _0x44b9x5
        });
        $['when']['apply']($, _0x44b9x2)['done'](function() {
            Autoattack['checked_count'] = 0;
            var _0x44b9x6 = null;
            if (Autoattack['countRunningAttacks']() == 0) {
                _0x44b9x6 = DM['getl10n']('COMMON')['no_results'] + '.';
                HumanMessage['error'](_0x44b9x6);
                ConsoleLog.Log('<span style="color: #ff4f23;">' + _0x44b9x6 + '</span>', 4);
                Autoattack['disableStart']()
            } else {
                _0x44b9x6 = DM['getl10n']('alliance')['index']['button_send'] + ': ' + Autoattack['countRunningAttacks']() + ' ' + DM['getl10n']('layout')['toolbar_activities']['incomming_attacks']['toLocaleLowerCase']() + '.';
                HumanMessage['success'](_0x44b9x6);
                ConsoleLog.Log('<span style="color: #ff4f23;">' + _0x44b9x6 + '</span>', 4)
            }
        })
    },
    checkAttack: function(_0x44b9x3, _0x44b9x4) {
        var _0x44b9x5 = $.Deferred();
        if (_0x44b9x3['send_at'] >= Timestamp['now']()) {
            Autoattack['checked_count']++;
            setTimeout(function() {
                DataExchanger['town_info_attack'](_0x44b9x3['town_id'], _0x44b9x3, function(_0x44b9x7) {
                    if (_0x44b9x7['json'] != undefined) {
                        if (!_0x44b9x7['json']['same_island'] || GameDataUnits['hasNavalUnits'](_0x44b9x3['units'])) {
                            var _0x44b9x8 = GameDataUnits['calculateCapacity'](_0x44b9x3['town_id'], _0x44b9x3['units']);
                            if (_0x44b9x8['needed_capacity'] > _0x44b9x8['total_capacity']) {
                                var _0x44b9x6 = DM['getl10n']('place')['support_overview']['slow_transport_ship'];
                                $('#attack_order_id_' + _0x44b9x3['id'] + ' .attack_bot_timer')['removeClass']('success')['html'](_0x44b9x6);
                                Autoattack['addAttack'](_0x44b9x4, _0x44b9x6);
                                _0x44b9x5['resolve']();
                                return false
                            }
                        };
                        Autoattack['addAttack'](_0x44b9x4);
                        _0x44b9x5['resolve']()
                    }
                })
            }, ((Autoattack['checked_count'] * 1000) / 2))
        } else {
            var _0x44b9x6 = 'Expired';
            Autoattack['addAttack'](_0x44b9x4, _0x44b9x6);
            $('#attack_order_id_' + _0x44b9x3['id'] + ' .attack_bot_timer')['removeClass']('success')['html'](_0x44b9x6);
            _0x44b9x5['resolve']()
        };
        return _0x44b9x5
    },
    addAttack: function(_0x44b9x4, _0x44b9x9) {
        var _0x44b9xa = {
            is_running: false,
            attack_id: Autoattack['attacks'][_0x44b9x4]['id'],
            interval: null,
            message: '',
            message_text: ''
        };
        if (_0x44b9x9 != undefined) {
            _0x44b9xa['message_text'] = _0x44b9x9
        } else {
            _0x44b9xa['is_running'] = true;
            _0x44b9xa['interval'] = setInterval(function() {
                if (Autoattack['attacks'][_0x44b9x4] != undefined) {
                    var _0x44b9xb = Autoattack['attacks'][_0x44b9x4]['send_at'] - Timestamp['now']();
                    _0x44b9xa['message'] = $('#attack_order_id_' + _0x44b9xa['attack_id'] + ' .attack_bot_timer');
                    _0x44b9xa['message']['html'](Autobot['toHHMMSS'](_0x44b9xb));
                    if (_0x44b9xb == 300 || _0x44b9xb == 120 || _0x44b9xb == 60) {
                        ConsoleLog.Log('<span style="color: #ff4f23;">[' + Autoattack['attacks'][_0x44b9x4]['origin_town_name'] + ' &#62; ' + Autoattack['attacks'][_0x44b9x4]['target_town_name'] + '] ' + DM['getl10n']('heroes')['common']['departure']['toLowerCase']()['replace'](':', '') + ' ' + DM['getl10n']('place')['support_overview']['just_in'] + ' ' + hours_minutes_seconds(_0x44b9xb) + '.</span>', 4)
                    };
                    if (Autoattack['attacks'][_0x44b9x4]['send_at'] <= Timestamp['now']()) {
                        _0x44b9xa['is_running'] = false;
                        Autoattack['sendAttack'](Autoattack['attacks'][_0x44b9x4]);
                        Autoattack['stopTimer'](_0x44b9xa)
                    }
                } else {
                    _0x44b9xa['is_running'] = false;
                    _0x44b9xa['message']['html']('Stopped');
                    Autoattack['stopTimer'](_0x44b9xa)
                }
            }, 1000)
        };
        Autoattack['attacks_timers']['push'](_0x44b9xa)
    },
    countRunningAttacks: function() {
        var _0x44b9xc = 0;
        Autoattack['attacks_timers']['forEach'](function(_0x44b9xd) {
            if (_0x44b9xd['is_running']) {
                _0x44b9xc++
            }
        });
        return _0x44b9xc
    },
    stopTimer: function(_0x44b9xa) {
        clearInterval(_0x44b9xa['interval']);
        if (Autoattack['countRunningAttacks']() == 0) {
            ConsoleLog.Log('<span style="color: #ff4f23;">All finished.</span>', 4);
            Autoattack['stop']()
        }
    },
    stop: function() {
        Autoattack['disableStart']();
        Autoattack['attacks_timers']['forEach'](function(_0x44b9xd) {
            if (_0x44b9xd['is_running']) {
                $('#attack_order_id_' + _0x44b9xd['attack_id'] + ' .attack_bot_timer')['html']('')
            };
            clearInterval(_0x44b9xd['interval'])
        })
    },
    disableStart: function() {
        ModuleManager['modules']['Autoattack']['isOn'] = false;
        $('#Autoattack_onoff')['removeClass']('on')['find']('span')['mousePopup'](new MousePopup('Start Autoattack'))
    },
    sendAttack: function(_0x44b9xe) {
        DataExchanger['send_units'](_0x44b9xe['town_id'], _0x44b9xe['type'], _0x44b9xe['target_town_id'], Autoattack['unitsToSend'](_0x44b9xe['units']), function(_0x44b9x7) {
            var _0x44b9xa = Autoattack['attacks_timers']['filter'](function(_0x44b9xf) {
                return _0x44b9xf['attack_id'] === _0x44b9xe['id']
            });
            if (_0x44b9x7['success'] != undefined && _0x44b9xa['length']) {
                _0x44b9xa[0]['message_text'] = 'Success';
                _0x44b9xa[0]['message']['addClass']('success')['html']('Success');
                ConsoleLog.Log('<span style="color: #ff9e22;">[' + _0x44b9xe['origin_town_name'] + ' &#62; ' + _0x44b9xe['target_town_name'] + '] ' + _0x44b9x7['success'] + '</span>', 4)
            } else {
                if (_0x44b9x7['error'] != undefined && _0x44b9xa['length']) {
                    _0x44b9xa[0]['message_text'] = 'Invalid';
                    _0x44b9xa[0]['message']['html']('Invalid');
                    ConsoleLog.Log('<span style="color: #ff3100;">[' + _0x44b9xe['origin_town_name'] + ' &#62; ' + _0x44b9xe['target_town_name'] + '] ' + _0x44b9x7['error'] + '</span>', 4)
                }
            }
        })
    },
    unitsToSend: function(_0x44b9x10) {
        var _0x44b9x11 = {};
        $['each'](_0x44b9x10, function(_0x44b9x12, _0x44b9xc) {
            if (_0x44b9xc > 0) {
                _0x44b9x11[_0x44b9x12] = _0x44b9xc
            }
        });
        return _0x44b9x11
    },
    calls: function(_0x44b9x13, _0x44b9x7) {
        switch (_0x44b9x13) {
            case 'attack_planer/add_origin_town':
                ;
            case 'attack_planer/edit_origin_town':
                Autoattack['stop']();
                Autoattack['loadAttackQueue']();
                break;
            case 'attack_planer/attacks':
                _0x44b9x7 = JSON['parse'](_0x44b9x7);
                if (_0x44b9x7['json']['data'] != undefined) {
                    Autoattack['setAttackData'](_0x44b9x7['json'])
                };
                break
        }
    },
    setAttackData: function(_0x44b9x7) {
        if (Autobot['checkPremium']('captain')) {
            Autoattack['attacks'] = _0x44b9x7['data']['attacks'] != undefined ? _0x44b9x7['data']['attacks'] : []
        }
    },
    attackOrderRow: function(_0x44b9xe, _0x44b9x4) {
        var _0x44b9x14 = $('<div/>', {
            "\x63\x6C\x61\x73\x73": 'origin_town_units'
        });
        if (_0x44b9xe['units'] != undefined) {
            $['each'](_0x44b9xe['units'], function(_0x44b9x10, _0x44b9xc) {
                if (_0x44b9xc > 0) {
                    _0x44b9x14['append']($('<div/>', {
                        "\x63\x6C\x61\x73\x73": 'unit_icon25x25 ' + _0x44b9x10
                    })['html'](_0x44b9xc))
                }
            })
        };
        var _0x44b9x15 = $('<li/>', {
            "\x63\x6C\x61\x73\x73": 'attacks_row ' + ((_0x44b9x4 % 2 == 0) ? 'odd' : 'even'),
            "\x69\x64": 'attack_order_id_' + _0x44b9xe['id']
        });
        if (_0x44b9xe['send_at'] > Timestamp['now']()) {
            _0x44b9x15['hover'](function() {
                $(this)['toggleClass']('brown')
            })
        };
        return _0x44b9x15['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'attack_type32x32 ' + _0x44b9xe['type']
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'arrow'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'row1'
        })['append'](' ' + _0x44b9xe['origin_town_link'] + ' ')['append']('(' + _0x44b9xe['origin_player_link'] + ')')['append']($('<span/>', {
            "\x63\x6C\x61\x73\x73": 'small_arrow'
        }))['append'](' ' + _0x44b9xe['target_town_link'] + ' ')['append']('(' + _0x44b9xe['origin_player_link'] + ') '))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'row2' + (_0x44b9xe['send_at'] <= Timestamp['now']() ? ' expired' : '')
        })['append']($('<span/>')['html'](DM['getl10n']('heroes')['common']['departure']))['append'](' ' + DateHelper['formatDateTimeNice'](_0x44b9xe['send_at']) + ' ')['append']($('<span/>')['html'](DM['getl10n']('heroes')['common']['arrival']))['append'](' ' + DateHelper['formatDateTimeNice'](_0x44b9xe['arrival_at']) + ' '))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'show_units'
        })['on']('click', function() {
            _0x44b9x14['toggle']()
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'attack_bot_timer'
        })['html'](function() {
            var _0x44b9xa = Autoattack['attacks_timers']['filter'](function(_0x44b9xf) {
                return _0x44b9xf['attack_id'] === _0x44b9xe['id']
            });
            if (_0x44b9xa['length']) {
                if (_0x44b9xa[0]['is_running']) {
                    return Autobot['toHHMMSS'](_0x44b9xe['send_at'] - Timestamp['now']())
                } else {
                    return _0x44b9xa[0]['message_text']
                }
            }
        }))['append'](_0x44b9x14)
    },
    loadAttackQueue: function() {
        DataExchanger['attack_planner'](Game['townId'], function(_0x44b9x7) {
            Autoattack['setAttackData'](_0x44b9x7);
            Autoattack['setAttackQueue']($('#attack_bot'))
        })
    },
    setAttackQueue: function(_0x44b9x16) {
        if (_0x44b9x16['length']) {
            var _0x44b9x17 = _0x44b9x16['find']('ul.attacks_list');
            _0x44b9x17['empty']();
            DataExchanger['attack_planner'](Game['townId'], function(_0x44b9x7) {
                Autoattack['setAttackData'](_0x44b9x7);
                $['each'](Autoattack['attacks'], function(_0x44b9x4, _0x44b9xe) {
                    _0x44b9x4++;
                    _0x44b9x17['append'](Autoattack['attackOrderRow'](_0x44b9xe, _0x44b9x4))
                })
            })
        }
    },
    contentSettings: function() {
        var _0x44b9x18 = $('<div id="attack_bot" class="attack_bot attack_planner attacks">' + '<div class="game_border">' + '<div class="game_border_top"></div>' + '<div class="game_border_bottom"></div>' + '<div class="game_border_left"></div>' + '<div class="game_border_right"></div>' + '<div class="game_border_top"></div>' + '<div class="game_border_corner corner1">' + '</div><div class="game_border_corner corner2">' + '</div><div class="game_border_corner corner3">' + '</div><div class="game_border_corner corner4">' + '</div><div class="game_header bold" id="settings_header">AutoAttack</div>' + '<div>' + '<div class="attacks_list">' + '<ul class="attacks_list">' + '</ul>' + '</div>' + '<div class="game_list_footer autoattack_settings"></div>' + '</div>' + '</div>' + '</div>');
        _0x44b9x18['find']('.autoattack_settings')['append'](function() {
            var _0x44b9x19 = FormBuilder['button']({
                name: DM['getl10n']('premium')['advisors']['short_advantages']['attack_planner'],
                style: 'float: left;',
                class: !Autobot['checkPremium']('captain') ? ' disabled' : ''
            });
            return Autobot['checkPremium']('captain') ? _0x44b9x19['click'](function() {
                AttackPlannerWindowFactory['openAttackPlannerWindow']()
            }) : _0x44b9x19
        })['append'](function() {
            var _0x44b9x19 = FormBuilder['button']({
                name: DM['getl10n']('update_notification')['refresh'],
                style: 'float: left;',
                class: !Autobot['checkPremium']('captain') ? ' disabled' : ''
            });
            return Autobot['checkPremium']('captain') ? _0x44b9x19['click'](function() {
                Autoattack['setAttackQueue'](_0x44b9x18)
            }) : _0x44b9x19
        })['append'](function() {
            if (!Autobot['checkPremium']('captain')) {
                return FormBuilder['button']({
                    name: DM['getl10n']('construction_queue')['advisor_banner']['activate'](Game['premium_data']['captain']['name']),
                    style: 'float: right;'
                })['click'](function() {
                    PremiumWindowFactory['openBuyAdvisorsWindow']()
                })
            }
        });
        Autoattack['setAttackQueue'](_0x44b9x18);
        return _0x44b9x18
    }
}