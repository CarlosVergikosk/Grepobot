Autofarm = {
    settings: {
        autostart: false,
        method: 300,
        timebetween: 1,
        skipwhenfull: true,
        lowresfirst: true,
        stoplootbelow: true
    },
    title: 'Autofarm settings',
    town: null,
    isPauzed: false,
    iTown: null,
    interval: null,
    isCaptain: false,
    hasP: true,
    shouldFarm: [],
    checkReady: function(_0xfac7x1) {
        var _0xfac7x2 = ITowns['towns'][_0xfac7x1['id']];
        if (_0xfac7x2['hasConqueror']()) {
            return false
        };
        if (!Autofarm['checkEnabled']()) {
            return false
        };
        if (_0xfac7x1['modules']['Autofarm']['isReadyTime'] >= Timestamp['now']()) {
            return _0xfac7x1['modules']['Autofarm']['isReadyTime']
        };
        var _0xfac7x3 = _0xfac7x2['resources']();
        if (_0xfac7x3['wood'] == _0xfac7x3['storage'] && _0xfac7x3['stone'] == _0xfac7x3['storage'] && _0xfac7x3['iron'] == _0xfac7x3['storage'] && Autofarm['settings']['skipwhenfull']) {
            return false
        };
        var _0xfac7x4 = false;
        $['each'](ModuleManager['Queue']['queue'], function(_0xfac7x5, _0xfac7x6) {
            if (_0xfac7x6['module'] == 'Autofarm') {
                var _0xfac7x7 = _0xfac7x1['relatedTowns']['indexOf'](_0xfac7x6['townId']);
                if (_0xfac7x7 != -1) {
                    _0xfac7x4 = true;
                    return false
                }
            }
        });
        if (Autofarm['settings']['lowresfirst']) {
            if (_0xfac7x1['relatedTowns']['length'] > 0) {
                _0xfac7x4 = false;
                $['each'](_0xfac7x1['relatedTowns'], function(_0xfac7x5, _0xfac7x8) {
                    var _0xfac7x3 = _0xfac7x2['resources']();
                    var _0xfac7x9 = ITowns['towns'][_0xfac7x8]['resources']();
                    if ((_0xfac7x3['wood'] + _0xfac7x3['stone'] + _0xfac7x3['iron']) > (_0xfac7x9['wood'] + _0xfac7x9['stone'] + _0xfac7x9['iron'])) {
                        _0xfac7x4 = true;
                        return false
                    }
                })
            }
        };
        if (_0xfac7x4) {
            return false
        };
        return true
    },
    disableP: function() {
        Autoattack['settings'] = {
            autostart: false,
            method: 300,
            timebetween: 1,
            skipwhenfull: true,
            lowresfirst: true,
            stoplootbelow: true
        }
    },
    checkEnabled: function() {
        return ModuleManager['modules']['Autofarm']['isOn']
    },
    startFarming: function(_0xfac7x1) {
        if (!Autofarm['checkEnabled']()) {
            return false
        };
        Autofarm['town'] = _0xfac7x1;
        Autofarm['shouldFarm'] = [];
        Autofarm['iTown'] = ITowns['towns'][Autofarm['town']['id']];
        var _0xfac7xa = function() {
            Autofarm['interval'] = setTimeout(function() {
                ConsoleLog.Log(Autofarm['town']['name'] + ' getting farm information.', 1);
                if (!Autofarm['isCaptain']) {
                    Autofarm['initFarmTowns'](function() {
                        if (!Autofarm['checkEnabled']()) {
                            return false
                        };
                        Autofarm['town']['currentFarmCount'] = 0;
                        Autofarm['claimResources']()
                    })
                } else {
                    Autofarm['initFarmTownsCaptain'](function() {
                        if (!Autofarm['checkEnabled']()) {
                            return false
                        };
                        Autofarm['claimResources']()
                    })
                }
            }, Autobot['randomize'](1000, 2000))
        };
        if (ModuleManager['currentTown'] != Autofarm['town']['key']) {
            Autofarm['interval'] = setTimeout(function() {
                ConsoleLog.Log(Autofarm['town']['name'] + ' move to town.', 1);
                if (!Autofarm['checkEnabled']()) {
                    return false
                };
                ModuleManager['currentTown'] = Autofarm['town']['key'];                
                
                /*DataExchanger['switch_town'](Autofarm['town']['id'], function() {
                    if (!Autofarm['checkEnabled']()) {
                        return false
                    };
                    ModuleManager['currentTown'] = Autofarm['town']['key'];
                    _0xfac7xa()
                });*/

                Autofarm['town']['isSwitched'] = true
            }, Autobot['randomize'](1000, 2000))
        }
        _0xfac7xa()
    },
    initFarmTowns: function(_0xfac7xb) {
        DataExchanger['game_data'](Autofarm['town']['id'], function(_0xfac7xc) {
            if (!Autofarm['checkEnabled']()) {
                return false
            };
            var _0xfac7xd = _0xfac7xc['map']['data']['data']['data'];
            $['each'](_0xfac7xd, function(_0xfac7x5, _0xfac7xe) {
                var _0xfac7xf = [];
                $['each'](_0xfac7xe['towns'], function(_0xfac7x5, _0xfac7x1) {
                    if (_0xfac7x1['x'] == Autofarm['iTown']['getIslandCoordinateX']() && _0xfac7x1['y'] == Autofarm['iTown']['getIslandCoordinateY']() && _0xfac7x1['relation_status'] == 1) {
                        _0xfac7xf['push'](_0xfac7x1)
                    }
                });
                Autofarm['town']['farmTowns'] = _0xfac7xf
            });
            $['each'](Autofarm['town']['farmTowns'], function(_0xfac7x10, _0xfac7x11) {
                var _0xfac7x12 = _0xfac7x11['loot'] - Timestamp['now']();
                if (_0xfac7x12 <= 0) {
                    Autofarm['shouldFarm']['push'](_0xfac7x11)
                }
            });
            _0xfac7xb(true)
        })
    },
    initFarmTownsCaptain: function(_0xfac7xb) {
        DataExchanger['farm_town_overviews'](Autofarm['town']['id'], function(_0xfac7xc) {
            if (!Autofarm['checkEnabled']()) {
                return false
            };
            var _0xfac7xf = [];
            $['each'](_0xfac7xc['farm_town_list'], function(_0xfac7x5, _0xfac7x1) {
                if (_0xfac7x1['island_x'] == Autofarm['iTown']['getIslandCoordinateX']() && _0xfac7x1['island_y'] == Autofarm['iTown']['getIslandCoordinateY']() && _0xfac7x1['rel'] == 1) {
                    _0xfac7xf['push'](_0xfac7x1)
                }
            });
            Autofarm['town']['farmTowns'] = _0xfac7xf;
            $['each'](Autofarm['town']['farmTowns'], function(_0xfac7x10, _0xfac7x11) {
                var _0xfac7x12 = _0xfac7x11['loot'] - Timestamp['now']();
                if (_0xfac7x12 <= 0) {
                    Autofarm['shouldFarm']['push'](_0xfac7x11)
                }
            });
            _0xfac7xb(true)
        })
    },
    claimResources: function() {
        if (!Autofarm['town']['farmTowns'][0]) {
            ConsoleLog.Log(Autofarm['town']['name'] + ' has no farm towns.', 1);
            Autofarm['finished'](1800);
            return false
        };
        if (Autofarm['town']['currentFarmCount'] < Autofarm['shouldFarm']['length']) {
            Autofarm['interval'] = setTimeout(function() {
                var _0xfac7x13 = 'normal';
                if (!Game['features']['battlepoint_villages']) {
                    if (Autofarm['shouldFarm'][Autofarm['town']['currentFarmCount']]['mood'] >= 86 && Autofarm['settings']['stoplootbelow']) {
                        _0xfac7x13 = 'double'
                    };
                    if (!Autofarm['settings']['stoplootbelow']) {
                        _0xfac7x13 = 'double'
                    }
                };
                if (!Autofarm['isCaptain']) {
                    Autofarm['claimLoad'](Autofarm['shouldFarm'][Autofarm['town']['currentFarmCount']]['id'], _0xfac7x13, function() {
                        if (!Autofarm['checkEnabled']()) {
                            return false
                        };
                        Autofarm['shouldFarm'][Autofarm['town']['currentFarmCount']]['loot'] = Timestamp['now']() + Autofarm['getMethodTime'](Autofarm['town']['id']);
                        ModuleManager['updateTimer'](Autofarm['shouldFarm']['length'], Autofarm['town']['currentFarmCount']);
                        Autofarm['town']['currentFarmCount']++;
                        Autofarm['claimResources']()
                    })
                } else {
                    var _0xfac7x14 = [];
                    $['each'](Autofarm['shouldFarm'], function(_0xfac7x5, _0xfac7x15) {
                        _0xfac7x14['push'](_0xfac7x15['id'])
                    });
                    Autofarm['claimLoads'](_0xfac7x14, _0xfac7x13, function() {
                        if (!Autofarm['checkEnabled']()) {
                            return false
                        };
                        Autofarm['finished'](Autofarm['getMethodTime'](Autofarm['town']['id']))
                    })
                }
            }, Autobot['randomize'](Autofarm['settings']['timebetween'] * 1000, Autofarm['settings']['timebetween'] * 1000 + 1000))
        } else {
            var _0xfac7x16 = null;
            $['each'](Autofarm['town']['farmTowns'], function(_0xfac7x10, _0xfac7x11) {
                var _0xfac7x17 = _0xfac7x11['loot'] - Timestamp['now']();
                if (_0xfac7x16 == null) {
                    _0xfac7x16 = _0xfac7x17
                } else {
                    if (_0xfac7x17 <= _0xfac7x16) {
                        _0xfac7x16 = _0xfac7x17
                    }
                }
            });
            if (Autofarm['shouldFarm']['length'] > 0) {
                $['each'](Autofarm['shouldFarm'], function(_0xfac7x10, _0xfac7x11) {
                    var _0xfac7x17 = _0xfac7x11['loot'] - Timestamp['now']();
                    if (_0xfac7x16 == null) {
                        _0xfac7x16 = _0xfac7x17
                    } else {
                        if (_0xfac7x17 <= _0xfac7x16) {
                            _0xfac7x16 = _0xfac7x17
                        }
                    }
                })
            } else {
                ConsoleLog.Log(Autofarm['town']['name'] + ' not ready yet.', 1)
            };
            Autofarm['finished'](_0xfac7x16)
        }
    },
    claimLoad: function(_0xfac7x18, _0xfac7x13, _0xfac7xb) {
        if (!Game['features']['battlepoint_villages']) {
            DataExchanger['claim_load'](Autofarm['town']['id'], _0xfac7x13, Autofarm['getMethodTime'](Autofarm['town']['id']), _0xfac7x18, function(_0xfac7xc) {
                Autofarm['claimLoadCallback'](_0xfac7x18, _0xfac7xc);
                _0xfac7xb(_0xfac7xc)
            })
        } else {
            DataExchanger['frontend_bridge'](Autofarm['town']['id'], {
                model_url: 'FarmTownPlayerRelation/' + MM['getOnlyCollectionByName']('FarmTownPlayerRelation')['getRelationForFarmTown'](_0xfac7x18)['id'],
                action_name: 'claim',
                arguments: {
                    "\x66\x61\x72\x6D\x5F\x74\x6F\x77\x6E\x5F\x69\x64": _0xfac7x18,
                    "\x74\x79\x70\x65": 'resources',
                    "\x6F\x70\x74\x69\x6F\x6E": 1
                }
            }, function(_0xfac7x19) {
                Autofarm['claimLoadCallback'](_0xfac7x18, _0xfac7x19);
                _0xfac7xb(_0xfac7x19)
            })
        }
    },
    claimLoadCallback: function(_0xfac7x18, _0xfac7xc) {
        if (_0xfac7xc['success']) {
            var _0xfac7x1a = _0xfac7xc['satisfaction'],
                _0xfac7x1b = _0xfac7xc['lootable_human'];
            if (_0xfac7xc['relation_status'] === 2) {
                WMap['updateStatusInChunkTowns'](_0xfac7x18['id'], _0xfac7x1a, Timestamp['now']() + Autofarm['getMethodTime'](Autofarm['town']['id']), Timestamp['now'](), _0xfac7x1b, 2);
                WMap['pollForMapChunksUpdate']()
            } else {
                WMap['updateStatusInChunkTowns'](_0xfac7x18['id'], _0xfac7x1a, Timestamp['now']() + Autofarm['getMethodTime'](Autofarm['town']['id']), Timestamp['now'](), _0xfac7x1b)
            };
            Layout['hideAjaxLoader']();
            ConsoleLog.Log('<span style="color: #6FAE30;">' + _0xfac7xc['success'] + '</span>', 1)
        } else {
            if (_0xfac7xc['error']) {
                ConsoleLog.Log(Autofarm['town']['name'] + ' ' + _0xfac7xc['error'], 1)
            }
        }
    },
    claimLoads: function(_0xfac7x1c, _0xfac7x13, _0xfac7xb) {
        DataExchanger['claim_loads'](Autofarm['town']['id'], _0xfac7x1c, _0xfac7x13, Autofarm['getMethodTime'](Autofarm['town']['id']), function(_0xfac7xc) {
            Autofarm['claimLoadsCallback'](_0xfac7xc);
            _0xfac7xb(_0xfac7xc)
        })
    },
    getMethodTime: function(_0xfac7x1d) {
        if (Game['features']['battlepoint_villages']) {
            var _0xfac7x1e = Autofarm['settings']['method'];
            $['each'](MM['getOnlyCollectionByName']('Town')['getTowns'](), function(_0xfac7x10, _0xfac7x1) {
                if (_0xfac7x1['id'] == _0xfac7x1d) {
                    if (_0xfac7x1['getResearches']()['hasResearch']('booty')) {
                        _0xfac7x1e = Autofarm['settings']['method'] * 2;
                        return false
                    }
                }
            });
            return _0xfac7x1e
        } else {
            return Autofarm['settings']['method']
        }
    },
    claimLoadsCallback: function(_0xfac7xc) {
        if (_0xfac7xc['success']) {
            var _0xfac7x1f = _0xfac7xc['notifications'],
                _0xfac7x20 = _0xfac7xc['handled_farms'];
            $['each'](_0xfac7x20, function(_0xfac7x10, _0xfac7x15) {
                if (_0xfac7x15['relation_status'] == 2) {
                    WMap['updateStatusInChunkTowns'](_0xfac7x10, _0xfac7x15['satisfaction'], Timestamp['now']() + Autofarm['getMethodTime'](Autofarm['town']['id']), Timestamp['now'](), _0xfac7x15['lootable_at'], 2);
                    WMap['pollForMapChunksUpdate']()
                } else {
                    WMap['updateStatusInChunkTowns'](_0xfac7x10, _0xfac7x15['satisfaction'], Timestamp['now']() + Autofarm['getMethodTime'](Autofarm['town']['id']), Timestamp['now'](), _0xfac7x15['lootable_at'])
                }
            });
            ConsoleLog.Log('<span style="color: #6FAE30;">' + _0xfac7xc['success'] + '</span>', 1)
        } else {
            if (_0xfac7xc['error']) {
                ConsoleLog.Log(Autofarm['town']['name'] + ' ' + _0xfac7xc['error'], 1)
            }
        }
    },
    finished: function(_0xfac7x21) {
        if (!Autofarm['checkEnabled']()) {
            return false
        };
        $['each'](ModuleManager['playerTowns'], function(_0xfac7x5, _0xfac7x1) {
            var _0xfac7x7 = Autofarm['town']['relatedTowns']['indexOf'](_0xfac7x1['id']);
            if (_0xfac7x7 != -1) {
                _0xfac7x1['modules']['Autofarm']['isReadyTime'] = Timestamp['now']() + _0xfac7x21
            }
        });
        Autofarm['town']['modules']['Autofarm']['isReadyTime'] = Timestamp['now']() + _0xfac7x21;
        ModuleManager['Queue']['next']()
    },
    stop: function() {
        clearInterval(Autofarm['interval'])
    },
    init: function() {
        ConsoleLog.Log('Initialize AutoFarm', 1);
        Autofarm['initButton']();
        Autofarm['checkCaptain']()
        Autofarm.loadSettings();
    },
    initButton: function() {
        ModuleManager['initButtons']('Autofarm')
    },
    checkCaptain: function() {
        if ($('.advisor_frame.captain div')['hasClass']('captain_active')) {
            Autofarm['isCaptain'] = true
        }
    },
    /**
     * Load settings from local storage
     */
    loadSettings: function() {
        let _settings = localStorage.getItem("Autofarm.Settings")
        if (_settings) {
            $.extend(Autofarm.settings, JSON.parse(_settings));
        }
    },
    contentSettings: function() {
        return $('<fieldset/>', {
            "id": 'Autofarm_settings',
            "style": 'float:left; width:472px;height: 270px;'
        })['append']($('<legend/>')['html'](Autofarm['title']))['append'](FormBuilder['checkbox']({
            "text": 'AutoStart AutoFarm.',
            "id": 'autofarm_autostart',
            "name": 'autofarm_autostart',
            "checked": Autofarm['settings']['autostart'],
            "disabled": !Autofarm['hasP']
        }))['append'](function() {
            var _0xfac7x24 = {
                id: 'autofarm_method',
                name: 'autofarm_method',
                label: 'Farm method: ',
                styles: 'width: 120px;',
                value: Autofarm['settings']['method'],
                options: [{
                    value: '300',
                    name: '5 minute farm'
                }, {
                    value: '1200',
                    name: '20 minute farm'
                }, {
                    value: '5400',
                    name: '90 minute farm'
                }, {
                    value: '14400',
                    name: '240 minute farm'
                }],
                disabled: false
            };
            if (!Autofarm['hasP']) {
                _0xfac7x24 = $['extend'](_0xfac7x24, {
                    disabled: true
                })
            };
            var _0xfac7x25 = FormBuilder['selectBox'](_0xfac7x24);
            if (!Autofarm['hasP']) {
                _0xfac7x25['mousePopup'](new MousePopup('Premium required'))
            };
            return _0xfac7x25
        })['append'](function() {
            var _0xfac7x24 = {
                id: 'autofarm_bewteen',
                name: 'autofarm_bewteen',
                label: 'Time before next farm: ',
                styles: 'width: 120px;',
                value: Autofarm['settings']['timebetween'],
                options: [{
                    value: '1',
                    name: '1-2 seconds'
                }, {
                    value: '3',
                    name: '3-4 seconds'
                }, {
                    value: '5',
                    name: '5-6 seconds'
                }, {
                    value: '7',
                    name: '7-8 seconds'
                }, {
                    value: '9',
                    name: '9-10 seconds'
                }]
            };
            if (!Autofarm['hasP']) {
                _0xfac7x24 = $['extend'](_0xfac7x24, {
                    disabled: true
                })
            };
            var _0xfac7x25 = FormBuilder['selectBox'](_0xfac7x24);
            if (!Autofarm['hasP']) {
                _0xfac7x25['mousePopup'](new MousePopup('Premium required'))
            };
            return _0xfac7x25
        })['append'](FormBuilder['checkbox']({
            "text": 'Skip farm when warehouse is full.',
            "id": 'autofarm_warehousefull',
            "name": 'autofarm_warehousefull',
            "checked": Autofarm['settings']['skipwhenfull'],
            "disabled": !Autofarm['hasP']
        }))['append'](FormBuilder['checkbox']({
            "text": 'Lowest resources first with more towns on one island.',
            "id": 'autofarm_lowresfirst',
            "name": 'autofarm_lowresfirst',
            "checked": Autofarm['settings']['lowresfirst'],
            "disabled": !Autofarm['hasP']
        }))['append'](FormBuilder['checkbox']({
            "text": 'Stop loot farm until mood is below 80%.',
            "id": 'autofarm_loot',
            "name": 'autofarm_loot',
            "checked": Autofarm['settings']['stoplootbelow'],
            "disabled": !Autofarm['hasP']
        }))['append'](FormBuilder['button']({
            name: DM['getl10n']('notes')['btn_save'],
            class: !Autofarm['hasP'] ? ' disabled' : '',
            style: 'top: 62px;'
        })['on']('click', function() {
            if (!Autofarm['hasP']) {
                return false
            };
            var _0xfac7x23 = $('#Autofarm_settings')['serializeObject']();
            Autofarm['settings']['autostart'] = _0xfac7x23['autofarm_autostart'] != undefined;
            Autofarm['settings']['method'] = parseInt(_0xfac7x23['autofarm_method']);
            Autofarm['settings']['timebetween'] = parseInt(_0xfac7x23['autofarm_bewteen']);
            Autofarm['settings']['skipwhenfull'] = _0xfac7x23['autofarm_warehousefull'] != undefined;
            Autofarm['settings']['lowresfirst'] = _0xfac7x23['autofarm_lowresfirst'] != undefined;
            Autofarm['settings']['stoplootbelow'] = _0xfac7x23['autofarm_loot'] != undefined;

            localStorage.setItem("Autofarm.Settings", JSON.stringify(Autofarm.settings));

            ConsoleLog.Log('Settings saved', 1);
            HumanMessage['success']('The settings were saved!');
        }))
    },
}