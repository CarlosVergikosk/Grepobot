Autofarm = {
  settings: {
    autostart: false,
    method: 300,
    timebetween: 1,
    skipWhenFull: true,
    lowresfirst: true,
    stoplootbelow: true,
  },
  title: 'Autofarm settings',
  town: null,
  isPaused: false,
  iTown: null,
  interval: null,
  isCaptain: false,
  hasP: true,
  shouldFarm: [],
  checkReady: function (tristun) {
    var city = ITowns.towns[tristun.id];
    if (city.hasConqueror()) {
      return false;
    }
    if (!Autofarm.checkEnabled()) {
      return false;
    }
    if (tristun.modules.Autofarm.isReadyTime >= Timestamp.now()) {
      return tristun.modules.Autofarm.isReadyTime;
    }
    var resources = city.resources();
    if (
      resources.wood == resources.storage &&
      resources.stone == resources.storage &&
      resources.iron == resources.storage &&
      Autofarm.settings.skipWhenFull
    ) {
      return false;
    }
    var aaliyahrose = false;
    $.each(ModuleManager.Queue.queue, function (donaleen, demitria) {
      if (demitria.module == 'Autofarm') {
        var embla = tristun.relatedTowns.indexOf(demitria.townId);
        if (embla != -1) {
          aaliyahrose = true;
          return false;
        }
      }
    });
    if (Autofarm.settings.lowresfirst) {
      if (tristun.relatedTowns.length > 0) {
        aaliyahrose = false;
        $.each(tristun.relatedTowns, function (courtnei, elaynah) {
          var resources = city.resources();
          var demarque = ITowns.towns[elaynah].resources();
          if (
            resources.wood + resources.stone + resources.iron >
            demarque.wood + demarque.stone + demarque.iron
          ) {
            aaliyahrose = true;
            return false;
          }
        });
      }
    }
    if (aaliyahrose) {
      return false;
    }
    return true;
  },
  disableP: function () {
    Autoattack.settings = {
      autostart: false,
      method: 300,
      timebetween: 1,
      skipWhenFull: true,
      lowresfirst: true,
      stoplootbelow: true,
    };
  },
  checkEnabled: function () {
    return ModuleManager.modules.Autofarm.isOn;
  },
  startFarming: function (yo) {
    if (!Autofarm.checkEnabled()) {
      return false;
    }
    Autofarm.town = yo;
    Autofarm.shouldFarm = [];
    Autofarm.iTown = ITowns.towns[Autofarm.town.id];
    var zikora = function () {
      Autofarm.interval = setTimeout(function () {
        ConsoleLog.Log(Autofarm.town.name + ' getting farm information.', 1);
        if (!Autofarm.isCaptain) {
          Autofarm.initFarmTowns(function () {
            if (!Autofarm.checkEnabled()) {
              return false;
            }
            Autofarm.town.currentFarmCount = 0;
            Autofarm.claimResources();
          });
        } else {
          Autofarm.initFarmTownsCaptain(function () {
            if (!Autofarm.checkEnabled()) {
              return false;
            }
            Autofarm.claimResources();
          });
        }
      }, Autobot.randomize(1e3, 2e3));
    };
    if (ModuleManager.currentTown != Autofarm.town.key) {
      Autofarm.interval = setTimeout(function () {
        ConsoleLog.Log(Autofarm.town.name + ' move to town.', 1);
        if (!Autofarm.checkEnabled()) {
          return false;
        }
        ModuleManager.currentTown = Autofarm.town.key;
        Autofarm.town.isSwitched = true;
      }, Autobot.randomize(1e3, 2e3));
    }
    zikora();
  },
  initFarmTowns: function (io) {
    DataExchanger.game_data(Autofarm.town.id, function (data) {
      if (!Autofarm.checkEnabled()) {
        return false;
      }
      var zavdiel = data.map.data.data.data;
      $.each(zavdiel, function (brook, flavis) {
        var farmTowns = [];
        $.each(flavis.towns, function (jalene, town) {
          if (
            town.x == Autofarm.iTown.getIslandCoordinateX() &&
            town.y == Autofarm.iTown.getIslandCoordinateY() &&
            town.relation_status == 1
          ) {
            farmTowns.push(town);
          }
        });
        Autofarm.town.farmTowns = farmTowns;
      });
      $.each(Autofarm.town.farmTowns, function (neetu, jazma) {
        var gorkem = jazma.loot - Timestamp.now();
        if (gorkem <= 0) {
          Autofarm.shouldFarm.push(jazma);
        }
      });
      io(true);
    });
  },
  initFarmTownsCaptain: function (yeiden) {
    DataExchanger.farm_town_overviews(Autofarm.town.id, function (aukeem) {
      if (!Autofarm.checkEnabled()) {
        return false;
      }
      var sumanth = [];
      $.each(aukeem.farm_town_list, function (jessalynne, mudasir) {
        if (
          mudasir.island_x == Autofarm.iTown.getIslandCoordinateX() &&
          mudasir.island_y == Autofarm.iTown.getIslandCoordinateY() &&
          mudasir.rel == 1
        ) {
          sumanth.push(mudasir);
        }
      });
      Autofarm.town.farmTowns = sumanth;
      $.each(Autofarm.town.farmTowns, function (elysabeth, margeurite) {
        var donterious = margeurite.loot - Timestamp.now();
        if (donterious <= 0) {
          Autofarm.shouldFarm.push(margeurite);
        }
      });
      yeiden(true);
    });
  },
  claimResources: function () {
    if (!Autofarm.town.farmTowns[0]) {
      ConsoleLog.Log(Autofarm.town.name + ' has no farm towns.', 1);
      Autofarm.finished(1800);
      return false;
    }
    if (Autofarm.town.currentFarmCount < Autofarm.shouldFarm.length) {
      Autofarm.interval = setTimeout(function () {
        var tyzell = 'normal';
        if (!Game.features.battlepoint_villages) {
          if (
            Autofarm.shouldFarm[Autofarm.town.currentFarmCount].mood >= 86 &&
            Autofarm.settings.stoplootbelow
          ) {
            tyzell = 'double';
          }
          if (!Autofarm.settings.stoplootbelow) {
            tyzell = 'double';
          }
        }
        if (!Autofarm.isCaptain) {
          Autofarm.claimLoad(
            Autofarm.shouldFarm[Autofarm.town.currentFarmCount].id,
            tyzell,
            function () {
              if (!Autofarm.checkEnabled()) {
                return false;
              }
              Autofarm.shouldFarm[Autofarm.town.currentFarmCount].loot =
                Timestamp.now() + Autofarm.getMethodTime(Autofarm.town.id);
              ModuleManager.updateTimer(
                Autofarm.shouldFarm.length,
                Autofarm.town.currentFarmCount
              );
              Autofarm.town.currentFarmCount++;
              Autofarm.claimResources();
            }
          );
        } else {
          var penelopee = [];
          $.each(Autofarm.shouldFarm, function (anaisha, garang) {
            penelopee.push(garang.id);
          });
          Autofarm.claimLoads(penelopee, tyzell, function () {
            if (!Autofarm.checkEnabled()) {
              return false;
            }
            Autofarm.finished(Autofarm.getMethodTime(Autofarm.town.id));
          });
        }
      }, Autobot.randomize(
        Autofarm.settings.timebetween * 1e3,
        Autofarm.settings.timebetween * 1e3 + 1e3
      ));
    } else {
      var syndia = null;
      $.each(Autofarm.town.farmTowns, function (lamae, tresaun) {
        var knolyn = tresaun.loot - Timestamp.now();
        if (syndia == null) {
          syndia = knolyn;
        } else {
          if (knolyn <= syndia) {
            syndia = knolyn;
          }
        }
      });
      if (Autofarm.shouldFarm.length > 0) {
        $.each(Autofarm.shouldFarm, function (kenshayla, janye) {
          var meridy = janye.loot - Timestamp.now();
          if (syndia == null) {
            syndia = meridy;
          } else {
            if (meridy <= syndia) {
              syndia = meridy;
            }
          }
        });
      } else {
        ConsoleLog.Log(Autofarm.town.name + ' not ready yet.', 1);
      }
      Autofarm.finished(syndia);
    }
  },
  claimLoad: function (farmTownId, scarlett, milen) {
    if (!Game.features.battlepoint_villages) {
      DataExchanger.claim_load(
        Autofarm.town.id,
        scarlett,
        Autofarm.getMethodTime(Autofarm.town.id),
        farmTownId,
        function (yuen) {
          Autofarm.claimLoadCallback(farmTownId, yuen);
          milen(yuen);
        }
      );
    } else {
      DataExchanger.frontend_bridge(
        Autofarm.town.id,
        {
          model_url:
            'FarmTownPlayerRelation/' +
            MM.getOnlyCollectionByName(
              'FarmTownPlayerRelation'
            ).getRelationForFarmTown(farmTownId).id,
          action_name: 'claim',
        },
        function (waukesha) {
          Autofarm.claimLoadCallback(farmTownId, waukesha);
          milen(waukesha);
        }
      );
    }
  },
  claimLoadCallback: function (berklee, kelbi) {
    if (kelbi.success) {
      var jacin = kelbi.satisfaction,
        shateia = kelbi.lootable_human;
      if (kelbi.relation_status === 2) {
        WMap.updateStatusInChunkTowns(
          berklee.id,
          jacin,
          Timestamp.now() + Autofarm.getMethodTime(Autofarm.town.id),
          Timestamp.now(),
          shateia,
          2
        );
        WMap.pollForMapChunksUpdate();
      } else {
        WMap.updateStatusInChunkTowns(
          berklee.id,
          jacin,
          Timestamp.now() + Autofarm.getMethodTime(Autofarm.town.id),
          Timestamp.now(),
          shateia
        );
      }
      Layout.hideAjaxLoader();
      ConsoleLog.Log(
        '<span style="color: #6FAE30;">' + kelbi.success + '</span>',
        1
      );
    } else {
      if (kelbi.error) {
        ConsoleLog.Log(Autofarm.town.name + ' ' + kelbi.error, 1);
      }
    }
  },
  claimLoads: function (oliviya, chaquanna, gerhardt) {
    DataExchanger.claim_loads(
      Autofarm.town.id,
      oliviya,
      chaquanna,
      Autofarm.getMethodTime(Autofarm.town.id),
      function (evangeline) {
        Autofarm.claimLoadsCallback(evangeline);
        gerhardt(evangeline);
      }
    );
  },
  getMethodTime: function (carlyann) {
    if (Game.features.battlepoint_villages) {
      var nyjee = Autofarm.settings.method;
      $.each(
        MM.getOnlyCollectionByName('Town').getTowns(),
        function (laqueen, jewelya) {
          if (jewelya.id == carlyann) {
            if (jewelya.getResearches().hasResearch('booty')) {
              nyjee = Autofarm.settings.method * 2;
              return false;
            }
          }
        }
      );
      return nyjee;
    } else {
      return Autofarm.settings.method;
    }
  },
  claimLoadsCallback: function (pryor) {
    if (pryor.success) {
      var archana = pryor.notifications,
        jarious = pryor.handled_farms;
      $.each(jarious, function (nazuri, kordero) {
        if (kordero.relation_status == 2) {
          WMap.updateStatusInChunkTowns(
            nazuri,
            kordero.satisfaction,
            Timestamp.now() + Autofarm.getMethodTime(Autofarm.town.id),
            Timestamp.now(),
            kordero.lootable_at,
            2
          );
          WMap.pollForMapChunksUpdate();
        } else {
          WMap.updateStatusInChunkTowns(
            nazuri,
            kordero.satisfaction,
            Timestamp.now() + Autofarm.getMethodTime(Autofarm.town.id),
            Timestamp.now(),
            kordero.lootable_at
          );
        }
      });
      ConsoleLog.Log(
        '<span style="color: #6FAE30;">' + pryor.success + '</span>',
        1
      );
    } else {
      if (pryor.error) {
        ConsoleLog.Log(Autofarm.town.name + ' ' + pryor.error, 1);
      }
    }
  },
  finished: function (inbal) {
    if (!Autofarm.checkEnabled()) {
      return false;
    }
    $.each(ModuleManager.playerTowns, function (juaquina, burton) {
      var kyonia = Autofarm.town.relatedTowns.indexOf(burton.id);
      if (kyonia != -1) {
        burton.modules.Autofarm.isReadyTime = Timestamp.now() + inbal;
      }
    });
    Autofarm.town.modules.Autofarm.isReadyTime = Timestamp.now() + inbal;
    ModuleManager.Queue.next();
  },
  stop: function () {
    clearInterval(Autofarm.interval);
  },
  init: function () {
    ConsoleLog.Log('Initialize AutoFarm', 1);
    Autofarm.initButton();
    Autofarm.checkCaptain();
    Autofarm.loadSettings();
  },
  initButton: function () {
    ModuleManager.initButtons('Autofarm');
  },
  checkCaptain: function () {
    if ($('.advisor_frame.captain div').hasClass('captain_active')) {
      Autofarm.isCaptain = true;
    }
  },
  loadSettings: function () {
    let _settings = localStorage.getItem('Autofarm.Settings');
    if (_settings) {
      $.extend(Autofarm.settings, JSON.parse(_settings));
    }
  },
  contentSettings: function () {
    return $('<fieldset/>', {
      id: 'Autofarm_settings',
      style: 'float:left; width:472px;height: 270px;',
    })
      .append($('<legend/>').html(Autofarm.title))
      .append(
        FormBuilder.checkbox({
          text: 'AutoStart AutoFarm.',
          id: 'autofarm_autostart',
          name: 'autofarm_autostart',
          checked: Autofarm.settings.autostart,
          disabled: !Autofarm.hasP,
        })
      )
      .append(function () {
        var syvella = {
          id: 'autofarm_method',
          name: 'autofarm_method',
          label: 'Farm method: ',
          styles: 'width: 120px;',
          value: Autofarm.settings.method,
          options: [
            { value: '613', name: '10 minute farm' },
            { value: '1200', name: '20 minute farm' },
            { value: '5400', name: '90 minute farm' },
            { value: '14400', name: '240 minute farm' },
          ],
          disabled: false,
        };
        if (!Autofarm.hasP) {
          syvella = $.extend(syvella, { disabled: true });
        }
        var larenz = FormBuilder.selectBox(syvella);
        if (!Autofarm.hasP) {
          larenz.mousePopup(new MousePopup('Premium required'));
        }
        return larenz;
      })
      .append(function () {
        var kicia = {
          id: 'autofarm_bewteen',
          name: 'autofarm_bewteen',
          label: 'Time before next farm: ',
          styles: 'width: 120px;',
          value: Autofarm.settings.timebetween,
          options: [
            { value: '1', name: '1-2 seconds' },
            { value: '3', name: '3-4 seconds' },
            { value: '5', name: '5-6 seconds' },
            { value: '7', name: '7-8 seconds' },
            { value: '9', name: '9-10 seconds' },
          ],
        };
        if (!Autofarm.hasP) {
          kicia = $.extend(kicia, { disabled: true });
        }
        var halana = FormBuilder.selectBox(kicia);
        if (!Autofarm.hasP) {
          halana.mousePopup(new MousePopup('Premium required'));
        }
        return halana;
      })
      .append(
        FormBuilder.checkbox({
          text: 'Skip farm when warehouse is full.',
          id: 'autofarm_warehousefull',
          name: 'autofarm_warehousefull',
          checked: Autofarm.settings.skipWhenFull,
          disabled: !Autofarm.hasP,
        })
      )
      .append(
        FormBuilder.checkbox({
          text: 'Lowest resources first with more towns on one island.',
          id: 'autofarm_lowresfirst',
          name: 'autofarm_lowresfirst',
          checked: Autofarm.settings.lowresfirst,
          disabled: !Autofarm.hasP,
        })
      )
      .append(
        FormBuilder.checkbox({
          text: 'Stop loot farm until mood is below 80%.',
          id: 'autofarm_loot',
          name: 'autofarm_loot',
          checked: Autofarm.settings.stoplootbelow,
          disabled: !Autofarm.hasP,
        })
      )
      .append(
        FormBuilder.button({
          name: DM.getl10n('notes').btn_save,
          class: !Autofarm.hasP ? ' disabled' : '',
          style: 'top: 62px;',
        }).on('click', function () {
          if (!Autofarm.hasP) {
            return false;
          }
          var riaan = $('#Autofarm_settings').serializeObject();
          Autofarm.settings.autostart = riaan.autofarm_autostart != undefined;
          Autofarm.settings.method = parseInt(riaan.autofarm_method);
          Autofarm.settings.timebetween = parseInt(riaan.autofarm_bewteen);
          Autofarm.settings.skipWhenFull =
            riaan.autofarm_warehousefull != undefined;
          Autofarm.settings.lowresfirst =
            riaan.autofarm_lowresfirst != undefined;
          Autofarm.settings.stoplootbelow = riaan.autofarm_loot != undefined;
          localStorage.setItem(
            'Autofarm.Settings',
            JSON.stringify(Autofarm.settings)
          );
          ConsoleLog.Log('Settings saved', 1);
          HumanMessage.success('The settings were saved!');
        })
      );
  },
};
