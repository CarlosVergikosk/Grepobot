Autobuild = {
    settings: {
        autostart: false,
        enable_building: true,
        enable_units: true,
        enable_ships: true,
        timeinterval: 120,
        instant_buy: false
    },
    building_queue: {},
    town_queues: [],
    units_queue: {},
    ships_queue: {},
    town: null,
    iTown: null,
    interval: null,
    currentWindow: null,
    isCaptain: false,
    Queue: 0,
    /**
     * Initilize Autobuild
     */
    init: function () {
        ConsoleLog.Log('Initialize Autobuild', 3);
        Autobuild['initFunction']();
        Autobuild['initButton']();
        Autobuild['checkCaptain']();
        Autobuild['activateCss']()
    },
    /**
     * Save the Autobuild Settings to settings property
     * @param {JSON String} _0xc4a4x1 
     */
    setSettings: function (_0xc4a4x1) {
        if (_0xc4a4x1 != '' && _0xc4a4x1 != null) {
            $['extend'](Autobuild['settings'], JSON['parse'](_0xc4a4x1))
        }
    },
    activateCss: function () {
        $('.construction_queue_order_container')['addClass']('active')
    },
    /**
     * Save the Queue Strings to propertys
     * @param {Json String} _building_queue 
     * @param {Json String} _units_queue 
     * @param {Json Stirng} _ships_queue 
     */
    setQueue: function (_building_queue, _units_queue, _ships_queue) {
        if (_building_queue != '' && _building_queue != null) {
            Autobuild['building_queue'] = JSON['parse'](_building_queue);
            Autobuild['initQueue']($('.construction_queue_order_container'), 'building')
        };
        if (_units_queue != '' && _units_queue != null) {
            Autobuild['units_queue'] = JSON['parse'](_units_queue)
        };
        if (_ships_queue != '' && _ships_queue != null) {
            Autobuild['ships_queue'] = JSON['parse'](_ships_queue)
        }
    },
    calls: function (_0xc4a4x5) {
        switch (_0xc4a4x5) {
            case 'building_main/index':
                ;
            case 'building_main/build':
                ;
            case 'building_main/cancel':
                ;
            case 'building_main/tear_down':
                Autobuild['windows']['building_main_index'](_0xc4a4x5);
                break;
            case 'building_barracks/index':
                ;
            case 'building_barracks/build':
                ;
            case 'building_barracks/cancel':
                ;
            case 'building_barracks/tear_down':
                Autobuild['windows']['building_barracks_index'](_0xc4a4x5);
                break
        }
    },
    initFunction: function () {
        var _0xc4a4x6 = function (_0xc4a4x7) {
            return function () {
                _0xc4a4x7['apply'](this, arguments);
                if (this['$el']['selector'] == '#building_tasks_main .various_orders_queue .frame-content .various_orders_content' || this['$el']['selector'] == '#ui_box .ui_construction_queue .construction_queue_order_container') {
                    Autobuild['initQueue'](this.$el, 'building')
                };
                if (this['$el']['selector'] == '#unit_orders_queue .js-researches-queue') {
                    var _0xc4a4x8 = this['$el']['find']('.ui_various_orders');
                    if (_0xc4a4x8['hasClass']('barracks')) {
                        Autobuild['initQueue'](this.$el, 'unit')
                    } else {
                        if (_0xc4a4x8['hasClass']('docks')) {
                            Autobuild['initQueue'](this.$el, 'ship')
                        }
                    }
                }
            }
        };
        GameViews['ConstructionQueueBaseView']['prototype']['renderQueue'] = _0xc4a4x6(GameViews['ConstructionQueueBaseView']['prototype']['renderQueue']);
        var _0xc4a4x9 = function (_0xc4a4x7) {
            return function () {
                _0xc4a4x7['apply'](this, arguments);
                if (this['barracks']) {
                    Autobuild['initUnitOrder'](this, 'unit')
                } else {
                    if (!this['barracks']) {
                        Autobuild['initUnitOrder'](this, 'ship')
                    }
                }
            }
        };
        UnitOrder['selectUnit'] = _0xc4a4x9(UnitOrder['selectUnit'])
    },
    /**
     * Initilize the Buttons for Autobuild
     */
    initButton: function () {
        ModuleManager['initButtons']('Autobuild')
    },
    /**
     * Check if Captain is active: Set Queue length to 7.
     */
    checkCaptain: function () {
        if ($('.advisor_frame.captain div')['hasClass']('captain_active')) {
            Autobuild['isCaptain'] = true
        };
        Autobuild['Queue'] = Autobuild['isCaptain'] ? 7 : 2
    },
    /**
     * Check if current town can build
     * @param {Current Town} _0xc4a4xa 
     */
    checkReady: function (_town) {
        var _0xc4a4xb = ITowns['towns'][_town['id']];
        if (!ModuleManager['modules']['Autobuild']['isOn']) {
            return false
        };
        if (_0xc4a4xb['hasConqueror']()) {
            return false
        };
        if (!Autobuild['settings']['enable_building'] && !Autobuild['settings']['enable_units'] && !Autobuild['settings']['enable_ships']) {
            return false
        };
        if (_town['modules']['Autobuild']['isReadyTime'] >= Timestamp['now']()) {
            return _town['modules']['Autobuild']['isReadyTime']
        };
        if (Autobuild.town_queues.filter(e => e.town_id === _town.id).length > 0) {
            let current_town = Autobuild.town_queues.find(e => e.town_id === _town.id);
            return (current_town.building_queue > 0 || current_town.unit_queue.length > 0 || current_town.ship_queue > 0);
        }
        return (GameDataInstantBuy['isEnabled']() && Autobuild['settings']['instant_buy']);
    },
    startBuild: function (_0xc4a4xa) {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        Autobuild['town'] = _0xc4a4xa;
        Autobuild['iTown'] = ITowns['towns'][Autobuild['town']['id']];
        if (ModuleManager['currentTown'] != Autobuild['town']['key']) {
            ConsoleLog.Log(Autobuild['town']['name'] + ' move to town.', 3);
            DataExchanger['switch_town'](Autobuild['town']['id'], function () {
                ModuleManager['currentTown'] = Autobuild['town']['key'];
                Autobuild['startUpgrade']()
            })
        } else {
            Autobuild['startUpgrade']()
        }
    },
    startQueueing: function () {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        if (Autobuild.town_queues.filter(e => e.town_id === Autobuild.town.id).length <= 0) {
            Autobuild['finished']()
        };
        var _0xc4a4xc = Autobuild['getReadyTime'](Autobuild['town']['id'])['shouldStart'];
        if (_0xc4a4xc == 'building') {
            Autobuild['startBuildBuilding']()
        } else {
            if (_0xc4a4xc == 'unit' || _0xc4a4xc == 'ship') {
                Autobuild['startBuildUnits'](_0xc4a4xc == 'unit' ? Autobuild['units_queue'] : Autobuild['ships_queue'], _0xc4a4xc)
            } else {
                Autobuild['finished']()
            }
        }
    },
    startUpgrade: function () {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        if (GameDataInstantBuy['isEnabled']() && Autobuild['checkInstantComplete'](Autobuild['town']['id'])) {
            Autobuild['interval'] = setTimeout(function () {
                DataExchanger['frontend_bridge'](Autobuild['town']['id'], {
                    model_url: 'BuildingOrder/' + Autobuild['instantBuyTown']['order_id'],
                    action_name: 'buyInstant',
                    arguments: {
                        order_id: Autobuild['instantBuyTown']['order_id']
                    },
                    town_id: Autobuild['town']['id'],
                    nl_init: true
                }, function (_0xc4a4xd) {
                    if (_0xc4a4xd['success']) {
                        if (Autobuild['town']['id'] == Game['townId']) {
                            var _0xc4a4xe = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                            for (var _0xc4a4xf = 0; _0xc4a4xe['length'] > _0xc4a4xf; _0xc4a4xf++) {
                                _0xc4a4xe[_0xc4a4xf]['getHandler']()['refresh']()
                            }
                        };
                        ConsoleLog.Log('<span style="color: #ffa03d;">' + Autobuild['instantBuyTown']['building_name']['capitalize']() + ' - ' + _0xc4a4xd['success'] + '</span>', 3)
                    };
                    if (_0xc4a4xd['error']) {
                        ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _0xc4a4xd['error'], 3)
                    };
                    Autobuild['interval'] = setTimeout(function () {
                        Autobuild['instantBuyTown'] = false;
                        Autobuild['startQueueing']()
                    }, Autobot['randomize'](500, 700))
                })
            }, Autobot['randomize'](1000, 2000))
        } else {
            Autobuild['startQueueing']()
        }
    },
    startBuildUnits: function (_0xc4a4x10, _0xc4a4x11) {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        if (_0xc4a4x10[Autobuild['town']['id']] != undefined) {
            if (_0xc4a4x10[Autobuild['town']['id']][_0xc4a4x11] != undefined) {
                var _0xc4a4x12 = _0xc4a4x10[Autobuild['town']['id']][_0xc4a4x11][0];
                if (GameDataUnits['getMaxBuildForSingleUnit'](_0xc4a4x12['item_name']) >= _0xc4a4x12['count']) {
                    Autobuild['interval'] = setTimeout(function () {
                        DataExchanger['building_barracks'](Autobuild['town']['id'], {
                            "\x75\x6E\x69\x74\x5F\x69\x64": _0xc4a4x12['item_name'],
                            "\x61\x6D\x6F\x75\x6E\x74": _0xc4a4x12['count'],
                            "\x74\x6F\x77\x6E\x5F\x69\x64": Autobuild['town']['id'],
                            "\x6E\x6C\x5F\x69\x6E\x69\x74": true
                        }, function (_0xc4a4xd) {
                            if (_0xc4a4xd['error']) {
                                ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _0xc4a4xd['error'], 3)
                            } else {
                                if (Autobuild['town']['id'] == Game['townId']) {
                                    var _0xc4a4xe = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                                    for (var _0xc4a4xf = 0; _0xc4a4xe['length'] > _0xc4a4xf; _0xc4a4xf++) {
                                        _0xc4a4xe[_0xc4a4xf]['getHandler']()['refresh']()
                                    }
                                };
                                ConsoleLog.Log('<span style="color: ' + (_0xc4a4x11 == 'unit' ? '#ffe03d' : '#3dadff') + ';">Units - ' + _0xc4a4x12['count'] + ' ' + GameData['units'][_0xc4a4x12['item_name']]['name_plural'] + ' added.</span>', 3);
                                /*DataExchanger.Auth('removeItemQueue', {
                                    player_id: Autobot['Account']['player_id'],
                                    world_id: Autobot['Account']['world_id'],
                                    csrfToken: Autobot['Account']['csrfToken'],
                                    town_id: Autobuild['town']['id'],
                                    item_id: _0xc4a4x12['id'],
                                    type: _0xc4a4x11
                                },*/
                                Autobuild['callbackSaveUnits']($('#unit_orders_queue .ui_various_orders'), _0xc4a4x11); //);
                                $('.queue_id_' + _0xc4a4x12['id'])['remove']()
                            };
                            Autobuild['finished']()
                        })
                    }, Autobot['randomize'](1000, 2000))
                } else {
                    ConsoleLog.Log(Autobuild['town']['name'] + ' recruiting ' + _0xc4a4x12['count'] + ' ' + GameData['units'][_0xc4a4x12['item_name']]['name_plural'] + ' not ready.', 3);
                    Autobuild['finished']()
                }
            } else {
                Autobuild['finished']()
            }
        } else {
            Autobuild['finished']()
        }
    },
    startBuildBuilding: function () {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        //check if town has building queues
        if (Autobuild.town_queues.filter(e => e.town_id === Autobuild.town.id).length > 0) {
            let current_town_queue = Autobuild.town_queues.find(e => e.town_id === Autobuild.town.id).building_queue;

            //if there is something to build
            if (current_town_queue.length > 0) {
                //timeout for prevent detection
                Autobuild['interval'] = setTimeout(function () {
                    ConsoleLog.Log(Autobuild['town']['name'] + ' getting building information.', 3);
                    DataExchanger['building_main'](Autobuild['town']['id'], function (_response_building_main) {
                        if (Autobuild['hasFreeBuildingSlots'](_response_building_main)) {
                            var _firstBuilding = current_town_queue[0];
                            //search the building in the response
                            var _building_from_resp = Autobuild.getBuildings(_response_building_main)[_firstBuilding['item_name']];
                            if (_building_from_resp['can_upgrade']) {
                                DataExchanger['frontend_bridge'](Autobuild['town']['id'], {
                                    model_url: 'BuildingOrder',
                                    action_name: 'buildUp',
                                    arguments: {
                                        building_id: _firstBuilding['item_name']
                                    },
                                    town_id: Autobuild['town']['id'],
                                    nl_init: true
                                }, function (_response_buildUp) {
                                    if (_response_buildUp['success']) {
                                        if (Autobuild['town']['id'] == Game['townId']) {
                                            var _0xc4a4xe = GPWindowMgr['getByType'](GPWindowMgr.TYPE_BUILDING);
                                            for (var _0xc4a4xf = 0; _0xc4a4xe['length'] > _0xc4a4xf; _0xc4a4xf++) {
                                                _0xc4a4xe[_0xc4a4xf]['getHandler']()['refresh']()
                                            }
                                        };
                                        ConsoleLog.Log('<span style="color: #ffa03d;">' + _firstBuilding['item_name']['capitalize']() + ' - ' + _response_buildUp['success'] + '</span>', 3);
                                        /*DataExchanger.Auth('removeItemQueue', {
                                            player_id: Autobot['Account']['player_id'],
                                            world_id: Autobot['Account']['world_id'],
                                            csrfToken: Autobot['Account']['csrfToken'],
                                            town_id: Autobuild['town']['id'],
                                            item_id: _0xc4a4x13['id'],
                                            type: 'building'
                                        }, Autobuild['callbackSaveBuilding']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));*/

                                        Autobuild.saveBuilding({
                                            type: "remove",
                                            town_id: Game['townId'],
                                            item_id: _firstBuilding['id'],
                                        });

                                        $('.queue_id_' + _firstBuilding['id'])['remove']()
                                    };
                                    if (_response_buildUp['error']) {
                                        ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _response_buildUp['error'], 3)
                                    };
                                    Autobuild['finished']()
                                })
                            } else {
                                var _0xc4a4x15 = Autobuild['iTown']['resources']();
                                if (!_building_from_resp['enough_population']) {
                                    ConsoleLog.Log(Autobuild['town']['name'] + ' not enough population for ' + _firstBuilding['item_name'] + '.', 3);
                                    Autobuild['finished']()
                                } else {
                                    if (!_building_from_resp['enough_resources']) {
                                        ConsoleLog.Log(Autobuild['town']['name'] + ' not enough resources for ' + _firstBuilding['item_name'] + '.', 3);
                                        Autobuild['finished']()
                                    } else {
                                        ConsoleLog.Log(Autobuild['town']['name'] + ' ' + _firstBuilding['item_name'] + ' can not be started due dependencies.', 3);
                                        /*DataExchanger.Auth('removeItemQueue', {
                                            player_id: Autobot['Account']['player_id'],
                                            world_id: Autobot['Account']['world_id'],
                                            csrfToken: Autobot['Account']['csrfToken'],
                                            town_id: Autobuild['town']['id'],
                                            item_id: _0xc4a4x13['id'],
                                            type: 'building'
                                        }, Autobuild['callbackSaveBuilding']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));*/

                                        Autobuild.saveBuilding({
                                            type: "remove",
                                            town_id: Game['townId'],
                                            item_id: _firstBuilding['id'],
                                        });

                                        $('.queue_id_' + _firstBuilding['id'])['remove']();
                                        Autobuild['finished']()
                                    }
                                }
                            }
                        } else {
                            ConsoleLog.Log(Autobuild['town']['name'] + ' no free building slots available.', 3);
                            Autobuild['finished']()
                        }
                    })
                }, Autobot['randomize'](1000, 2000))
            } else {
                Autobuild.finished();
            }
        } else {
            Autobuild['finished']()
        }
    },
    getReadyTime: function (_townId) {
        var _queues = {
            building: {
                queue: [],
                timeLeft: 0
            },
            unit: {
                queue: [],
                timeLeft: 0
            },
            ship: {
                queue: [],
                timeLeft: 0
            }
        };
        $['each'](MM['getOnlyCollectionByName']('BuildingOrder')['models'], function (_index, _element) {
            if (_townId == _element['getTownId']()) {
                _queues['building']['queue']['push']({
                    type: 'building',
                    model: _element
                });
                if (_queues['building']['timeLeft'] == 0){
                    _queues['building']['timeLeft'] = _element['getTimeLeft']()
                }
            }
        });

        $['each'](MM['getOnlyCollectionByName']('UnitOrder')['models'], function (_index, _element) {
            if (_townId == _element['attributes']['town_id']) {
                if (_element['attributes']['kind'] == 'ground') {
                    _queues['unit']['queue']['push']({
                        type: 'unit',
                        model: _element
                    });
                    if (_queues['unit']['timeLeft'] == 0) {
                        _queues['unit']['timeLeft'] = _element['getTimeLeft']()
                    }
                };
                if (_element['attributes']['kind'] == 'naval') {
                    _queues['ship']['queue']['push']({
                        type: 'ship',
                       model: _element
                    });
                    if (_queues['ship']['timeLeft'] == 0) {
                        _queues['ship']['timeLeft'] = _element['getTimeLeft']()
                    }
                }
            }
        });

        var _readyTime = -1;
        var _doNext = 'nothing';
        //check which bot queue has elements and take the one where 
        $['each'](_queues, function (_type, _0xc4a4x1b) {
            //if ((_0xc4a4x18 == 'building' && Autobuild['building_queue'][_0xc4a4x16] != undefined) || (_0xc4a4x18 == 'unit' && Autobuild['units_queue'][_0xc4a4x16] != undefined) || (_0xc4a4x18 == 'ship' && Autobuild['ships_queue'][_0xc4a4x16] != undefined)) {

            if (Autobuild.town_queues.filter(e => e.town_id === _townId).length > 0) {
                let current_town = Autobuild.town_queues.find(e => e.town_id === _townId);
                if((_type == 'building' && current_town.building_queue.length > 0) || 
                   (_type == 'unit' && current_town.unit_queue.length > 0) || 
                   (_type == 'ship' && current_town.ship_queue.length > 0)) {
                    if (_readyTime == null) {
                        _readyTime = _0xc4a4x1b['timeLeft'];
                        _doNext = _type
                    } else {
                        if (_0xc4a4x1b['timeLeft'] < _readyTime) {
                            _readyTime = _0xc4a4x1b['timeLeft'];
                            _doNext = _type
                        }
                    }
                    //if there is space in the queue, start
                    if (_queues[_type].queue.length < Autobot.Queue) {
                        _readyTime = 10;
                    }
                }
            }
        });
        //if instant buy is enabled
        if (GameDataInstantBuy['isEnabled']() && Autobuild['settings']['instant_buy']) {
            //if there are buildings in the queue
            if (_queues.building.queue.length > 0) {
                let _firstBuildingTime = _queues.building.queue[0].model.getTimeLeft() - 300;
                if (_firstBuildingTime <= 0) {
                    _firstBuildingTime = 10;
                }
                if (_firstBuildingTime < _readyTime || _readyTime == -1) {
                    _readyTime = _firstBuildingTime
                }
            }
        };
        return {
            readyTime: Timestamp.now() + (_readyTime >= 0 ? _readyTime : +Autobuild['settings']['timeinterval']),
            shouldStart: _doNext
        }
    },
    /**
     * Stop Autobuild
     */
    stop: function () {
        clearInterval(Autobuild['interval'])
    },
    /**
     * Check if Autobuild is enabled
     */
    checkEnabled: function () {
        return ModuleManager['modules']['Autobuild']['isOn']
    },
    finished: function () {
        if (!Autobuild['checkEnabled']()) {
            return false
        };
        Autobuild['town']['modules']['Autobuild']['isReadyTime'] = Autobuild['getReadyTime'](Autobuild['town']['id'])['readyTime'];
        ModuleManager['Queue']['next']()
    },
    /**
     * Complete if only 5 Minutes are left
     * @param {} _0xc4a4x16 
     */
    checkInstantComplete: function (_0xc4a4x16) {
        Autobuild['instantBuyTown'] = false;
        $['each'](MM['getOnlyCollectionByName']('BuildingOrder')['models'], function (_0xc4a4x18, _0xc4a4x19) {
            if (_0xc4a4x16 == _0xc4a4x19['getTownId']() && _0xc4a4x19['getTimeLeft']() < 300) {
                Autobuild['instantBuyTown'] = {
                    order_id: _0xc4a4x19['id'],
                    building_name: _0xc4a4x19['getBuildingId']()
                };
                return false
            }
        });
        return Autobuild['instantBuyTown']
    },
    checkBuildingDepencencies: function (_0xc4a4x1c, _0xc4a4x1d) {
        var _0xc4a4x1e = GameData['buildings'][_0xc4a4x1c],
            _0xc4a4x1f = _0xc4a4x1e['dependencies'],
            _0xc4a4x20 = _0xc4a4x1d['getBuildings'](),
            _0xc4a4x21 = _0xc4a4x20['getBuildings']();
        var _0xc4a4x22 = [];
        $['each'](_0xc4a4x1f, function (_0xc4a4x23, _0xc4a4x24) {
            var _0xc4a4x25 = _0xc4a4x21[_0xc4a4x23];
            if (_0xc4a4x25 < _0xc4a4x24) {
                _0xc4a4x22['push']({
                    building_id: _0xc4a4x23,
                    level: _0xc4a4x24
                })
            }
        });
        return _0xc4a4x22
    },
    /*
    callbackSaveBuilding: function (_0xc4a4x26) {
        return function (response) {
            if (response['success']) {
                _0xc4a4x26['each'](function () {
                    $(this)['find']('.empty_slot')['remove']();
                    if (response['item']) {
                        $(this)['append'](Autobuild['buildingElement']($(this), response['item']));
                        Autobuild['setEmptyItems']($(this))
                    } else {
                        Autobuild['setEmptyItems']($(this))
                    }
                });
                delete(response['item']);
                delete(response['success']);
                Autobuild['building_queue'] = response
            }
        }
    },
    */
    /**
     * Update the buildingqueue.
     * @param {Object with Building Data} _building_data 
     */
    saveBuilding: function (_building_data) {
        let newBuilding;
        //if town doesnt exists in town_queues, add them
        if (Autobuild.town_queues.filter(e => e.town_id === _building_data.town_id).length <= 0) {
            Autobuild.town_queues.push({
                town_id: _building_data.town_id,
                building_queue: [],
                unit_queue: [],
                ship_queue: []
            })
        }
        //Add new item to building queue
        if (_building_data.type === "add") {
            newBuilding = {
                id: Timestamp.now(),
                item_name: _building_data.item_name,
                count: _building_data.count
            }
            Autobuild.town_queues.find(e => e.town_id === _building_data.town_id).building_queue.push(newBuilding);
        } else if (_building_data.type === "remove") {
            let current_town_queue = Autobuild.town_queues.find(e => e.town_id === _building_data.town_id).building_queue;
            current_town_queue.splice(current_town_queue.findIndex(e => e.id === _building_data.item_id), 1);
        }

        $("#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders").each(function () {
            $(this).find(".empty_slot").remove();
            //Add new item to building queue
            if (_building_data.type === "add") {
                $(this).append(Autobuild.buildingElement($(this), newBuilding));
            }
            Autobuild.setEmptyItems($(this));
        });
    },
    callbackSaveSettings: function () {
        ConsoleLog.Log('Settings saved', 3);
        HumanMessage['success']('The settings were saved!')
    },
    hasFreeBuildingSlots: function (_0xc4a4x27) {
        var _0xc4a4x28 = false;
        if (_0xc4a4x27 != undefined) {
            if (/BuildingMain\.full_queue = false;/g ['test'](_0xc4a4x27['html'])) {
                _0xc4a4x28 = true
            }
        };
        return _0xc4a4x28
    },
    getBuildings: function (_0xc4a4x27) {
        var _0xc4a4x14 = null;
        if (_0xc4a4x27['html'] != undefined) {
            var _0xc4a4x29 = _0xc4a4x27['html']['match'](/BuildingMain\.buildings = (.*);/g);
            if (_0xc4a4x29[0] != undefined) {
                _0xc4a4x14 = JSON['parse'](_0xc4a4x29[0]['substring'](25, _0xc4a4x29[0]['length'] - 1))
            }
        };
        return _0xc4a4x14
    },
    initQueue: function (_0xc4a4x2a, _0xc4a4x11) {
        var _guiQueue = _0xc4a4x2a['find']('.ui_various_orders');
        _guiQueue['find']('.empty_slot')['remove']();
        if (_0xc4a4x11 == 'building') {
            $('#building_tasks_main')['addClass']('active');

            if(Autobuild.town_queues.filter(e => e.town_id == Game.townId).length > 0) {
                let current_town_queue = Autobuild.town_queues.find(e => e.town_id == Game.townId).building_queue;
                $.each(current_town_queue, function(_index, _element) {
                    _guiQueue.append(Autobuild.buildingElement(_guiQueue, _element))
                });
            }
        };
        if (_0xc4a4x11 == 'unit') {
            $('#unit_orders_queue')['addClass']('active');
            if (Autobuild['units_queue'][Game['townId']] != undefined) {
                if (Autobuild['units_queue'][Game['townId']][_0xc4a4x11] != undefined) {
                    $['each'](Autobuild['units_queue'][Game['townId']][_0xc4a4x11], function (_0xc4a4x18, _0xc4a4x1b) {
                        _guiQueue['append'](Autobuild['unitElement'](_guiQueue, _0xc4a4x1b, _0xc4a4x11))
                    })
                }
            }
        };
        if (_0xc4a4x11 == 'ship') {
            $('#unit_orders_queue')['addClass']('active');
            if (Autobuild['ships_queue'][Game['townId']] != undefined) {
                if (Autobuild['ships_queue'][Game['townId']][_0xc4a4x11] != undefined) {
                    $['each'](Autobuild['ships_queue'][Game['townId']][_0xc4a4x11], function (_0xc4a4x18, _0xc4a4x1b) {
                        _guiQueue['append'](Autobuild['unitElement'](_guiQueue, _0xc4a4x1b, _0xc4a4x11))
                    })
                }
            }
        };
        Autobuild['setEmptyItems'](_guiQueue);
        _guiQueue['parent']()['mousewheel'](function (_0xc4a4x2b, _0xc4a4x2c) {
            this['scrollLeft'] -= (_0xc4a4x2c * 30);
            _0xc4a4x2b['preventDefault']()
        })
    },
    initUnitOrder: function (_0xc4a4x2d, _0xc4a4x11) {
        var _0xc4a4x12 = _0xc4a4x2d['units'][_0xc4a4x2d['unit_id']];
        var _0xc4a4x2e = _0xc4a4x2d['$el']['find']('#unit_order_confirm');
        var _0xc4a4x2f = _0xc4a4x2d['$el']['find']('#unit_order_addqueue');
        var _0xc4a4x30 = _0xc4a4x2d['$el']['find']('#unit_order_slider');
        if (_0xc4a4x2f['length'] >= 0 && (_0xc4a4x12['missing_building_dependencies']['length'] >= 1 || _0xc4a4x12['missing_research_dependencies']['length'] >= 1)) {
            _0xc4a4x2f['hide']()
        };
        if (_0xc4a4x12['missing_building_dependencies']['length'] == 0 && _0xc4a4x12['missing_research_dependencies']['length'] == 0) {
            var _0xc4a4x31 = ITowns['towns'][Game['townId']];
            var _0xc4a4x32 = _0xc4a4x12['max_build'];
            var _0xc4a4x33 = Math['max']['apply'](this, [_0xc4a4x12['resources']['wood'], _0xc4a4x12['resources']['stone'], _0xc4a4x12['resources']['iron']]);
            var _0xc4a4x34 = [];
            _0xc4a4x34['push'](Math['floor'](_0xc4a4x31['getStorage']() / _0xc4a4x33));
            _0xc4a4x34['push'](Math['floor']((_0xc4a4x31['getAvailablePopulation']() - Autobuild['checkPopulationBeingBuild']()) / _0xc4a4x12['population']));
            if (_0xc4a4x12['favor'] > 0) {
                _0xc4a4x34['push'](Math['floor'](500 / _0xc4a4x12['favor']))
            };
            var _0xc4a4x35 = Math['min']['apply'](this, _0xc4a4x34);
            if (_0xc4a4x35 > 0 && _0xc4a4x35 >= _0xc4a4x32) {
                _0xc4a4x2d['slider']['setMax'](_0xc4a4x35)
            };
            if (_0xc4a4x2f['length'] == 0) {
                _0xc4a4x2f = $('<a/>', {
                    href: '#',
                    id: 'unit_order_addqueue',
                    "\x63\x6C\x61\x73\x73": 'confirm'
                });
                _0xc4a4x2e['after'](_0xc4a4x2f);
                _0xc4a4x2f['mousePopup'](new MousePopup('Add to reqruite queue'))['on']('click', function (_0xc4a4x36) {
                    _0xc4a4x36['preventDefault']();
                    Autobuild['addUnitQueueItem'](_0xc4a4x12, _0xc4a4x11)
                })
            } else {
                _0xc4a4x2f['unbind']('click');
                _0xc4a4x2f['on']('click', function (_0xc4a4x36) {
                    _0xc4a4x36['preventDefault']();
                    Autobuild['addUnitQueueItem'](_0xc4a4x12, _0xc4a4x11)
                })
            };
            if (_0xc4a4x35 <= 0) {
                _0xc4a4x2f['hide']()
            } else {
                _0xc4a4x2f['show']()
            };
            _0xc4a4x2e['show']();
            _0xc4a4x30['slider']({
                slide: function (_0xc4a4x2b, _0xc4a4x37) {
                    if (_0xc4a4x37['value'] > _0xc4a4x32) {
                        _0xc4a4x2e['hide']()
                    } else {
                        if (_0xc4a4x37['value'] >= 0 && _0xc4a4x37['value'] <= _0xc4a4x32) {
                            _0xc4a4x2e['show']()
                        }
                    };
                    if (_0xc4a4x37['value'] == 0) {
                        _0xc4a4x2f['hide']()
                    } else {
                        if (_0xc4a4x37['value'] > 0 && _0xc4a4x35 > 0) {
                            _0xc4a4x2f['show']()
                        }
                    }
                }
            })
        }
    },
    checkBuildingLevel: function (_0xc4a4x1b) {
        var _0xc4a4x38 = ITowns['towns'][Game['townId']]['getBuildings']()['attributes'][_0xc4a4x1b['item_name']];
        $['each'](ITowns['towns'][Game['townId']]['buildingOrders']()['models'], function (_0xc4a4x18, _0xc4a4x2a) {
            if (_0xc4a4x2a['attributes']['building_type'] == _0xc4a4x1b['item_name']) {
                _0xc4a4x38++
            }
        });
        if (Autobuild.town_queues.filter(e => e.town_id == Game.townId).length > 0) {
            $.each(Autobuild.town_queues.find(e => e.town_id === Game.townId).building_queue, function (_0xc4a4x18, _0xc4a4x2a) {
                if (_0xc4a4x2a['id'] == _0xc4a4x1b['id']) {
                    return false
                };
                if (_0xc4a4x2a['item_name'] == _0xc4a4x1b['item_name']) {
                    _0xc4a4x38++
                }
            });
        };
        _0xc4a4x38++;
        return _0xc4a4x38
    },
    checkPopulationBeingBuild: function () {
        var _0xc4a4x39 = 0;
        if (Autobuild['units_queue'][Game['townId']] != undefined) {
            $(Autobuild['units_queue'][Game['townId']]['unit'])['each'](function (_0xc4a4x18, _0xc4a4x2a) {
                _0xc4a4x39 += (_0xc4a4x2a['count'] * GameData['units'][_0xc4a4x2a['item_name']]['population'])
            })
        };
        if (Autobuild['ships_queue'][Game['townId']] != undefined) {
            $(Autobuild['ships_queue'][Game['townId']]['ship'])['each'](function (_0xc4a4x18, _0xc4a4x2a) {
                _0xc4a4x39 += (_0xc4a4x2a['count'] * GameData['units'][_0xc4a4x2a['item_name']]['population'])
            })
        };
        return _0xc4a4x39
    },
    addUnitQueueItem: function (_0xc4a4x3a, _0xc4a4x11) {
        /*DataExchanger.Auth('addItemQueue', {
            player_id: Autobot['Account']['player_id'],
            world_id: Autobot['Account']['world_id'],
            csrfToken: Autobot['Account']['csrfToken'],
            town_id: Game['townId'],
            item_name: _0xc4a4x3a['id'],
            type: _0xc4a4x11,
            count: UnitOrder['slider']['getValue']()
        },*/
        Autobuild['callbackSaveUnits']($('#unit_orders_queue .ui_various_orders'), _0xc4a4x11); //)
    },
    callbackSaveUnits: function (_0xc4a4x26, _0xc4a4x11) {
        return function (_0xc4a4xd) {
            if (_0xc4a4xd['success']) {
                delete(_0xc4a4xd['success']);
                if (_0xc4a4x11 == 'unit') {
                    Autobuild['units_queue'] = _0xc4a4xd
                } else {
                    if (_0xc4a4x11 = 'ship') {
                        Autobuild['ships_queue'] = _0xc4a4xd
                    }
                };
                _0xc4a4x26['each'](function () {
                    $(this)['find']('.empty_slot')['remove']();
                    if (_0xc4a4xd['item']) {
                        $(this)['append'](Autobuild['unitElement']($(this), _0xc4a4xd['item'], _0xc4a4x11));
                        Autobuild['setEmptyItems']($(this));
                        delete(_0xc4a4xd['item'])
                    } else {
                        Autobuild['setEmptyItems']($(this))
                    };
                    UnitOrder['selectUnit'](UnitOrder['unit_id'])
                })
            }
        }
    },
    setEmptyItems: function (_0xc4a4x26) {
        var _0xc4a4x3b = 0;
        var _0xc4a4x3c = _0xc4a4x26['parent']()['width']();
        $['each'](_0xc4a4x26['find']('.js-tutorial-queue-item'), function () {
            _0xc4a4x3b += $(this)['outerWidth'](true)
        });
        var _0xc4a4x3d = _0xc4a4x3c - _0xc4a4x3b;
        if (_0xc4a4x3d >= 0) {
            _0xc4a4x26['width'](_0xc4a4x3c);
            for (var _0xc4a4xf = 1; _0xc4a4xf <= Math['floor'](_0xc4a4x3d) / 60; _0xc4a4xf++) {
                _0xc4a4x26['append']($('<div/>', {
                    "\x63\x6C\x61\x73\x73": 'js-queue-item js-tutorial-queue-item construction_queue_sprite empty_slot'
                }))
            }
        } else {
            _0xc4a4x26['width'](_0xc4a4x3b + 25)
        }
    },
    buildingElement: function (_0xc4a4x26, _0xc4a4x1b) {
        return $('<div/>', {
            "\x63\x6C\x61\x73\x73": 'js-tutorial-queue-item queued_building_order last_order ' + _0xc4a4x1b['item_name'] + ' queue_id_' + _0xc4a4x1b['id']
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'construction_queue_sprite frame'
        })['mousePopup'](new MousePopup(_0xc4a4x1b['item_name']['capitalize']() + ' queued'))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'item_icon building_icon40x40 js-item-icon build_queue ' + _0xc4a4x1b['item_name']
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'building_level'
        })['append']('<span class="construction_queue_sprite arrow_green_ver"></span>' + Autobuild['checkBuildingLevel'](_0xc4a4x1b)))))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
        })['on']('click', function (_0xc4a4x36) {
            _0xc4a4x36['preventDefault']();
            /*DataExchanger.Auth('removeItemQueue', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                town_id: Game['townId'],
                item_id: _0xc4a4x1b['id'],
                type: 'building'
            }, Autobuild['callbackSaveBuilding']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')));*/

            Autobuild.saveBuilding({
                type: "remove",
                town_id: Game['townId'],
                item_id: _0xc4a4x1b['id'],
            });

            $('.queue_id_' + _0xc4a4x1b['id'])['remove']()
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'left'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'right'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'caption js-caption'
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'effect js-effect'
        }))))
    },
    unitElement: function (_0xc4a4x26, _0xc4a4x1b, _0xc4a4x11) {
        return $('<div/>', {
            "\x63\x6C\x61\x73\x73": 'js-tutorial-queue-item queued_building_order last_order ' + _0xc4a4x1b['item_name'] + ' queue_id_' + _0xc4a4x1b['id']
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'construction_queue_sprite frame'
        })['mousePopup'](new MousePopup(_0xc4a4x1b['item_name']['capitalize']()['replace']('_', ' ') + ' queued'))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'item_icon unit_icon40x40 js-item-icon build_queue ' + _0xc4a4x1b['item_name']
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'unit_count text_shadow'
        })['html'](_0xc4a4x1b['count']))))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'btn_cancel_order button_new square remove js-item-btn-cancel-order build_queue'
        })['on']('click', function (_0xc4a4x36) {
            _0xc4a4x36['preventDefault']();
            /*DataExchanger.Auth('removeItemQueue', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                town_id: Game['townId'],
                item_id: _0xc4a4x1b['id'],
                type: _0xc4a4x11
            },*/
            Autobuild['callbackSaveUnits']($('#unit_orders_queue .ui_various_orders'), _0xc4a4x11); //);
            $('.queue_id_' + _0xc4a4x1b['id'])['remove']()
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'left'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'right'
        }))['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'caption js-caption'
        })['append']($('<div/>', {
            "\x63\x6C\x61\x73\x73": 'effect js-effect'
        }))))
    },
    contentSettings: function () {
        return $('<fieldset/>', {
            "\x69\x64": 'Autobuild_settings',
            "\x73\x74\x79\x6C\x65": 'float:left; width:472px; height: 270px;'
        })['append']($('<legend/>')['html']('Autobuild Settings'))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'AutoStart Autobuild.',
            "\x69\x64": 'autobuild_autostart',
            "\x6E\x61\x6D\x65": 'autobuild_autostart',
            "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['autostart']
        }))['append'](FormBuilder['selectBox']({
            id: 'autobuild_timeinterval',
            name: 'autobuild_timeinterval',
            label: 'Check every: ',
            styles: 'width: 120px;',
            value: Autobuild['settings']['timeinterval'],
            options: [{
                value: '120',
                name: '2 minutes'
            }, {
                value: '300',
                name: '5 minutes'
            }, {
                value: '600',
                name: '10 minutes'
            }, {
                value: '900',
                name: '15 minutes'
            }]
        }))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'Enable building queue.',
            "\x69\x64": 'autobuild_building_enable',
            "\x6E\x61\x6D\x65": 'autobuild_building_enable',
            "\x73\x74\x79\x6C\x65": 'width: 100%;padding-top: 35px;',
            "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['enable_building']
        }))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'Enable barracks queue.',
            "\x69\x64": 'autobuild_barracks_enable',
            "\x6E\x61\x6D\x65": 'autobuild_barracks_enable',
            "\x73\x74\x79\x6C\x65": 'width: 100%;',
            "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['enable_units']
        }))['append'](FormBuilder['checkbox']({
            "\x74\x65\x78\x74": 'Enable ships queue.',
            "\x69\x64": 'autobuild_ships_enable',
            "\x6E\x61\x6D\x65": 'autobuild_ships_enable',
            "\x73\x74\x79\x6C\x65": 'width: 100%;padding-bottom: 35px;',
            "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['enable_ships']
        }))['append'](function () {
            if (GameDataInstantBuy['isEnabled']()) {
                return FormBuilder['checkbox']({
                    "\x74\x65\x78\x74": 'Free Instant Buy.',
                    "\x69\x64": 'autobuild_instant_buy',
                    "\x6E\x61\x6D\x65": 'autobuild_instant_buy',
                    "\x73\x74\x79\x6C\x65": 'width: 100%;',
                    "\x63\x68\x65\x63\x6B\x65\x64": Autobuild['settings']['instant_buy']
                })
            }
        })['append'](FormBuilder['button']({
            name: DM['getl10n']('notes')['btn_save'],
            style: 'top: 10px;'
        })['on']('click', function () {
            var _0xc4a4x3e = $('#Autobuild_settings')['serializeObject']();
            Autobuild['settings']['autostart'] = _0xc4a4x3e['autobuild_autostart'] != undefined;
            Autobuild['settings']['timeinterval'] = parseInt(_0xc4a4x3e['autobuild_timeinterval']);
            Autobuild['settings']['autostart'] = _0xc4a4x3e['autobuild_autostart'] != undefined;
            Autobuild['settings']['enable_building'] = _0xc4a4x3e['autobuild_building_enable'] != undefined;
            Autobuild['settings']['enable_units'] = _0xc4a4x3e['autobuild_barracks_enable'] != undefined;
            Autobuild['settings']['enable_ships'] = _0xc4a4x3e['autobuild_ships_enable'] != undefined;
            Autobuild['settings']['instant_buy'] = _0xc4a4x3e['autobuild_instant_buy'] != undefined;
            /*DataExchanger.Auth('saveBuild', {
                player_id: Autobot['Account']['player_id'],
                world_id: Autobot['Account']['world_id'],
                csrfToken: Autobot['Account']['csrfToken'],
                autobuild_settings: Autobot['stringify'](Autobuild['settings'])
            },*/
            Autobuild['callbackSaveSettings']; //)
        }))
    },
    windows: {
        wndId: null,
        wndContent: null,
        building_main_index: function () {
            if (GPWindowMgr && GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)) {
                Autobuild['currentWindow'] = GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)['getJQElement']()['find']('.gpwindow_content');
                var _0xc4a4x3f = Autobuild['currentWindow']['find']('#main_tasks h4');
                _0xc4a4x3f['html'](_0xc4a4x3f['html']()['replace'](/\/.*\)/, '/&infin;)'));
                var _0xc4a4x40 = ['theater', 'thermal', 'library', 'lighthouse', 'tower', 'statue', 'oracle', 'trade_office'];
                $['each']($('#buildings .button_build.build_grey.build_up.small.bold'), function () {
                    var _0xc4a4x41 = $(this)['parent']()['parent']()['attr']('id')['replace']('building_main_', '');
                    if (Autobuild['checkBuildingDepencencies'](_0xc4a4x41, ITowns['getTown'](Game['townId']))['length'] <= 0) {
                        if ($['inArray'](_0xc4a4x41, _0xc4a4x40) == -1) {
                            $(this)['removeClass']('build_grey')['addClass']('build')['html']('Add to queue')['on']('click', function (_0xc4a4x36) {
                                _0xc4a4x36['preventDefault']();
                                /*DataExchanger.Auth('addItemQueue', {
                                    player_id: Autobot['Account']['player_id'],
                                    world_id: Autobot['Account']['world_id'],
                                    csrfToken: Autobot['Account']['csrfToken'],
                                    town_id: Game['townId'],
                                    item_name: _0xc4a4x41,
                                    count: 1,
                                    type: 'building'
                                }, Autobuild['callbackSaveBuilding']($('#building_tasks_main .ui_various_orders, .construction_queue_order_container .ui_various_orders')))*/

                                Autobuild.saveBuilding({
                                    type: "add",
                                    town_id: Game['townId'],
                                    item_name: _0xc4a4x41,
                                    count: 1,
                                });


                            })
                        }
                    }
                })
            }
        },
        building_barracks_index: function () {
            if (GPWindowMgr && GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)) {
                Autobuild['currentWindow'] = GPWindowMgr['getOpenFirst'](Layout['wnd'].TYPE_BUILDING)['getJQElement']()['find']('.gpwindow_content');
                var _0xc4a4x3f = Autobuild['currentWindow']['find']('#unit_orders_queue h4');
                _0xc4a4x3f['find']('.js-max-order-queue-count')['html']('&infin;')
            }
        }
    }
}