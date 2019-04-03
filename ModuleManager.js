ModuleManager = {
    models: {
        Town: function() {
            this.key = null;
            this.id = null;
            this.name = null;
            this.farmTowns = {};
            this.relatedTowns = [];
            this.currentFarmCount = 0;
            this.modules = {
                Autofarm: {
                    isReadyTime: 0
                },
                Autoculture: {
                    isReadyTime: 0
                },
                Autobuild: {
                    isReadyTime: 0
                }
            };
            this.startFarming = function() {
                Autofarm.startFarming(this);
            };
            this.startCulture = function() {
                Autoculture.startCulture(this);
            };
            this.startBuild = function() {
                Autobuild.startBuild(this);
            }
        }
    },
    Queue: {
        total: 0,
        queue: [],
        /**
         * Add item to the queue
         * @param {Item addded to queue} _item 
         */
        add: function(_item) {
            this.total++;
            this.queue.push(_item);
        },
        /**
         * Start the queue
         */
        start: function() {
            this.next();
        },
        /**
         * Stop the queue
         */
        stop: function() {
            this.queue = [];
        },
        isRunning: function() {
            return this.queue.length > 0 || this.total > 0
        },
        /**
         * Execute the next item in queue
         */
        next: function() {
            ModuleManager.updateTimer();
            var _nextQueueItem = this.queue.shift();
            // if this is not null, execute it
            if (_nextQueueItem) {
                _nextQueueItem.fx();
            //Queue is empty
            } else {
                if (this.queue.length <= 0) {
                    this.total = 0;
                    ModuleManager.finished();
                }
            }
        }
    },
    currentTown: null,
    playerTowns: [],
    /**
     * ID of the interval timing the next cycle
     */
    interval: false,
    modules: {
        Autofarm: {
            isOn: false
        },
        Autoculture: {
            isOn: false
        },
        Autobuild: {
            isOn: false
        },
        Autoattack: {
            isOn: false
        }
    },
    /**
     * Initilize the Autobuild feature
     */
    init: function() {
        ModuleManager.loadPlayerTowns();
        ModuleManager.initButtons();
        ModuleManager.initTimer();
    },
    /**
     * Start function to decide which feature should start or get the lowest timer to next start
     */
    start: function() {
        var _queueNotEmpty = false;
        var _nextTimestamp = null;
        $.each(ModuleManager.playerTowns, function(_each, _town) {
            //Autofarm
            if (typeof Autofarm !== 'undefined') {
                var _readyStatus = Autofarm.checkReady(_town);
                if (_readyStatus == true) {
                    _queueNotEmpty = true;
                    ModuleManager.Queue.add({
                        townId: _town.id,
                        fx: function() {
                            _town.startFarming()
                        }
                    })
                } else {
                    if (_readyStatus != false && (_nextTimestamp == null || _readyStatus < _nextTimestamp)) {
                        _nextTimestamp = _readyStatus
                    }
                }
            };
            //Autoculture
            if (typeof Autoculture !== 'undefined') {
                var _readyStatus = Autoculture['checkReady'](_town);
                if (_readyStatus == true) {
                    _queueNotEmpty = true;
                    ModuleManager.Queue.add({
                        townId: _town.id,
                        fx: function() {
                            _town.startCulture()
                        }
                    })
                } else {
                    if (_readyStatus != false && (_nextTimestamp == null || _readyStatus < _nextTimestamp)) {
                        _nextTimestamp = _readyStatus
                    }
                }
            };
            //Autobuild
            if (typeof Autobuild !== 'undefined') {
                var _readyStatus = Autobuild['checkReady'](_town);
                if (_readyStatus == true) {
                    _queueNotEmpty = true;
                    ModuleManager.Queue.add({
                        townId: _town.id,
                        fx: function() {
                            _town.startBuild()
                        }
                    })
                } else {
                    if (_readyStatus != false && (_nextTimestamp == null || _readyStatus < _nextTimestamp)) {
                        _nextTimestamp = _readyStatus
                    }
                }
            }
        });
        if (_nextTimestamp === null && !_queueNotEmpty) {
            ConsoleLog.Log('Nothing is ready yet!', 0);
            ModuleManager.startTimer(30, function() {
                ModuleManager.start()
            })
        } else {
            if (!_queueNotEmpty) {
                var _nextInterval = (_nextTimestamp - Timestamp.now()) + 10;
                ModuleManager.startTimer(_nextInterval, function() {
                    ModuleManager.start()
                })
            } else {
                ModuleManager.Queue.start()
            }
        }
    },
    /**
     * Stop the bot.
     */
    stop: function() {
        clearInterval(ModuleManager.interval);
        ModuleManager['Queue']['stop']();
        $('#time_autobot .caption .value_container .curr')['html']('Stopped')
    },
    /**
     * On finish the queue cycle, call the start function to get the next timer
     */
    finished: function() {
        ModuleManager.start()
    },
    /**
     * Put the "Start Autobot" text into the timer window
     */
    initTimer: function() {
        $('.nui_main_menu').css('top', '308px');
        $('#time_autobot').append(FormBuilder.timerBoxSmall({
            "id": 'Autofarm_timer',
            "styles": '',
            "text": 'Start Autobot'
        })).show()
    },
    /**
     * Updates the timer for progress of actual queue
     */
    updateTimer: function(/*_0xa6b2xb, _0xa6b2xc*/) {
        var _progress = 0;
        /*if (typeof _0xa6b2xb !== 'undefined' && typeof _0xa6b2xc !== 'undefined') {*/
            //_0xa6b2xd = (((ModuleManager.Queuetotal - (ModuleManager.Queue.queue.length + 1)) + (_0xa6b2xc / _0xa6b2xb)) / ModuleManager['Queue']['total'] * 100)
        //} else {
        _progress = (((ModuleManager.Queue.total - ModuleManager.Queue.queue.length)) / ModuleManager.Queue.total * 100)
        //};
        if (!isNaN(_progress)) {
            $('#time_autobot .progress .indicator').width(_progress + '%');
            $('#time_autobot .caption .value_container .curr').html(Math.round(_progress) + '%')
        }
    },
    checkAutostart: function() {
        if (Autofarm['settings']['autostart']) {
            ModuleManager['modules']['Autofarm']['isOn'] = true;
            var _0xa6b2xe = $('#Autofarm_onoff');
            _0xa6b2xe['addClass']('on');
            _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Stop Autofarm'))
        };
        if (Autoculture['settings']['autostart']) {
            ModuleManager['modules']['Autoculture']['isOn'] = true;
            var _0xa6b2xe = $('#Autoculture_onoff');
            _0xa6b2xe['addClass']('on');
            _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Stop Autoculture'))
        };
        if (Autobuild['settings']['autostart']) {
            ModuleManager['modules']['Autobuild']['isOn'] = true;
            var _0xa6b2xe = $('#Autobuild_onoff');
            _0xa6b2xe['addClass']('on');
            _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Stop Autobuild'))
        };
        if (Autofarm['settings']['autostart'] || Autoculture['settings']['autostart'] || Autobuild['settings']['autostart']) {
            ModuleManager['start']()
        }
    },
    /**
     * Timer that ticks every second to check if Queue has to start
     * @param {*} _0xa6b2xf 
     * @param {Starts after the interval elapsed} _callback 
     */
    startTimer: function(_interval, _callback) {
        var _0xa6b2x11 = _interval;
        ModuleManager.interval = setInterval(function() {
            $('#time_autobot .caption .value_container .curr')['html'](Autobot['toHHMMSS'](_interval));
            $('#time_autobot .progress .indicator')['width']((_0xa6b2x11 - _interval) / _0xa6b2x11 * 100 + '%');
            _interval--;
            if (_interval < 0) {
                clearInterval(ModuleManager['interval']);
                _callback()
            }
        }, 1000)
    },
    initButtons: function(_0xa6b2x12) {
        var _0xa6b2xe = $('#' + _0xa6b2x12 + '_onoff');
        _0xa6b2xe['removeClass']('disabled');
        _0xa6b2xe['on']('click', function(_0xa6b2x13) {
            _0xa6b2x13['preventDefault']();
            if (_0xa6b2x12 == 'Autoattack' && !Autobot['checkPremium']('captain')) {
                HumanMessage['error'](Game['premium_data']['captain']['name'] + ' ' + DM['getl10n']('premium')['advisors']['not_activated']['toLowerCase']() + '.');
                return false
            };
            if (ModuleManager['modules'][_0xa6b2x12]['isOn'] == true) {
                ModuleManager['modules'][_0xa6b2x12]['isOn'] = false;
                _0xa6b2xe['removeClass']('on');
                _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Start ' + _0xa6b2x12));
                HumanMessage['success'](_0xa6b2x12 + ' is deactivated.');
                ConsoleLog.Log(_0xa6b2x12 + ' is deactivated.', 0);
                if (_0xa6b2x12 == 'Autofarm') {
                    Autofarm['stop']()
                } else {
                    if (_0xa6b2x12 == 'Autoculture') {
                        Autoculture['stop']()
                    } else {
                        if (_0xa6b2x12 == 'Autobuild') {
                            Autobuild['stop']()
                        } else {
                            if (_0xa6b2x12 == 'Autoattack') {
                                Autoattack['stop']()
                            }
                        }
                    }
                }
            } else {
                if (ModuleManager['modules'][_0xa6b2x12]['isOn'] == false) {
                    _0xa6b2xe['addClass']('on');
                    HumanMessage['success'](_0xa6b2x12 + ' is activated.');
                    ConsoleLog.Log(_0xa6b2x12 + ' is activated.', 0);
                    _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Stop ' + _0xa6b2x12));
                    ModuleManager['modules'][_0xa6b2x12]['isOn'] = true;
                    if (_0xa6b2x12 == 'Autoattack') {
                        Autoattack['start']()
                    }
                }
            };
            if (_0xa6b2x12 != 'Autoattack') {
                ModuleManager['checkWhatToStart']()
            }
        });
        _0xa6b2xe['find']('span')['mousePopup'](new MousePopup('Start ' + _0xa6b2x12))
    },
    checkWhatToStart: function() {
        var _0xa6b2x14 = 0;
        $['each'](ModuleManager['modules'], function(_0xa6b2x15, _0xa6b2x12) {
            if (_0xa6b2x12['isOn'] && _0xa6b2x12 != 'Autoattack') {
                _0xa6b2x14++
            }
        });
        if (_0xa6b2x14 == 0) {
            ModuleManager['stop']()
        } else {
            if (_0xa6b2x14 >= 0 && !ModuleManager['Queue']['isRunning']()) {
                clearInterval(ModuleManager['interval']);
                ModuleManager['start']()
            }
        }
    },
    loadPlayerTowns: function() {
        var _0xa6b2x5 = 0;
        $['each'](ITowns['towns'], function(_0xa6b2x16, _0xa6b2x17) {
            var _0xa6b2x18 = new ModuleManager['models']['Town'];
            _0xa6b2x18['key'] = _0xa6b2x5;
            _0xa6b2x18['id'] = _0xa6b2x17['id'];
            _0xa6b2x18['name'] = _0xa6b2x17['name'];
            $['each'](ITowns['towns'], function(_0xa6b2x16, _0xa6b2x19) {
                if (_0xa6b2x17['getIslandCoordinateX']() == _0xa6b2x19['getIslandCoordinateX']() && _0xa6b2x17['getIslandCoordinateY']() == _0xa6b2x19['getIslandCoordinateY']() && _0xa6b2x17['id'] != _0xa6b2x19['id']) {
                    _0xa6b2x18['relatedTowns']['push'](_0xa6b2x19['id'])
                }
            });
            ModuleManager['playerTowns']['push'](_0xa6b2x18);
            _0xa6b2x5++
        });
        ModuleManager['playerTowns']['sort'](function(_0xa6b2x1a, _0xa6b2x1b) {
            var _0xa6b2x1c = _0xa6b2x1a['name'],
                _0xa6b2x1d = _0xa6b2x1b['name'];
            if (_0xa6b2x1c == _0xa6b2x1d) {
                return 0
            };
            return _0xa6b2x1c > _0xa6b2x1d ? 1 : -1
        })
    },
    loadModules: function() {
        Autobot['isLogged'] = true;
        //Autobot['trial_time'] = _0xa6b2x1e['trial_time'];
        //Autobot['premium_time'] = _0xa6b2x1e['premium_time'];
        //Autobot['facebook_like'] = _0xa6b2x1e['facebook_like'];
        //if (_0xa6b2x1e['assistant_settings'] != '') {
        //    Assistant['setSettings'](_0xa6b2x1e['assistant_settings'])
        //};
        /*if (!_0xa6b2x1e['player_email']) {
            Autobot['verifyEmail']()
        };*/
        //if (Autobot['trial_time'] - Timestamp['now']() >= 0 || Autobot['premium_time'] - Timestamp['now']() >= 0) {
        if (typeof Autofarm == 'undefined' && typeof Autoculture == 'undefined' && typeof Autobuild == 'undefined' && typeof Autoattack == 'undefined') {
            $['when']($['ajax']({
                method: 'GET',
                //data: Autobot['Account'],
                url: Autobot['domain'] + 'Autofarm.js',
                dataType: 'script'
            }), $['ajax']({
                method: 'GET',
                //data: Autobot['Account'],
                url: Autobot['domain'] + 'Autoculture.js',
                dataType: 'script'
            }), $['ajax']({
                method: 'GET',
                //data: Autobot['Account'],
                url: Autobot['domain'] + 'Autobuild.js',
                dataType: 'script'
            }), $['ajax']({
                method: 'GET',
                //data: Autobot['Account'],
                url: Autobot['domain'] + 'Autoattack.js',
                dataType: 'script'
            }), $.Deferred(function(_0xa6b2x1f) {
                $(_0xa6b2x1f['resolve'])
            }))['done'](function() {
                ModuleManager['init']();
                Autofarm['init']();
                //Autofarm['setSettings'](_0xa6b2x1e['autofarm_settings']);
                Autoculture['init']();
                //Autoculture['setSettings'](_0xa6b2x1e['autoculture_settings']);
                Autobuild['init']();
                //Autobuild['setSettings'](_0xa6b2x1e['autobuild_settings']);
                //Autobuild['setQueue'](_0xa6b2x1e['building_queue'], _0xa6b2x1e['units_queue'], _0xa6b2x1e['ships_queue']);
                Autoattack['init']();
                ModuleManager['checkAutostart']()
            })
        }
        /*} else {
            if (typeof Autofarm == 'undefined') {
                $['when']($['ajax']({
                    method: 'GET',
                    //data: Autobot['Account'],
                    url: Autobot['domain'] + 'Autofarm.js',
                    dataType: 'script'
                }), $.Deferred(function(_0xa6b2x1f) {
                    $(_0xa6b2x1f['resolve'])
                }))['done'](function() {
                    ModuleManager['init']();
                    Autofarm['init']()
                })
            };
            $('#Autoculture_onoff')['mousePopup'](new MousePopup(ModuleManager['requiredPrem']));
            $('#Autobuild_onoff')['mousePopup'](new MousePopup(ModuleManager['requiredPrem']));
            $('#Autoattack_onoff')['mousePopup'](new MousePopup(ModuleManager['requiredPrem']));
            Autobot['createNotification']('getPremiumNotification', 'Unfortunately your premium membership is over. Please upgrade now!')
        }*/
    },
    requiredPrem: DM['getl10n']('tooltips')['requirements']['replace']('.', '') + ' premium'
}