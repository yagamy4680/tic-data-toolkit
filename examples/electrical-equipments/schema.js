(function(){
  // Generated by LiveScript 1.5.0
  /** Please Don't Modify These Lines Below   */
  /** --------------------------------------- */
  var SchemaBaseClass, MANIFEST, ElectricalMeter, TwoWayMeter, ElectricalEquipment, AirConditionEL, roots;
  SchemaBaseClass = (function(){
    SchemaBaseClass.displayName = 'SchemaBaseClass';
    var prototype = SchemaBaseClass.prototype, constructor = SchemaBaseClass;
    function SchemaBaseClass(){
      this.sensors = {};
      this.actuators = {};
    }
    SchemaBaseClass.prototype.declareSensors = function(typesAndIdentities){
      var self, sensors, st, identities, lresult$, i$, len$, id, results$ = [];
      sensors = (self = this).sensors;
      for (st in typesAndIdentities) {
        identities = typesAndIdentities[st];
        lresult$ = [];
        self.sensors[st] = {};
        for (i$ = 0, len$ = identities.length; i$ < len$; ++i$) {
          id = identities[i$];
          lresult$.push(self.sensors[st][id] = {});
        }
        results$.push(lresult$);
      }
      return results$;
    };
    return SchemaBaseClass;
  }());
  if (typeof SCHEMA_BASE_CLASS != 'undefined' && SCHEMA_BASE_CLASS !== null) {
    SchemaBaseClass = SCHEMA_BASE_CLASS;
  }
  /** --------------------------------------- */
  /** Please Don't Modify These Lines Above   */
  MANIFEST = {
    name: 'electrical-equipments',
    version: '0.1.2'
  };
  ElectricalMeter = (function(superclass){
    var prototype = extend$((import$(ElectricalMeter, superclass).displayName = 'ElectricalMeter', ElectricalMeter), superclass).prototype, constructor = ElectricalMeter;
    ElectricalMeter.prototype.electric_energy = [
      {
        field: 'energy',
        value: ['int', [0, 1000]],
        unit: 'w',
        description: "the currently-consumed energy"
      }, {
        field: 'energy_cumulative',
        value: ['float', [0, 999999990000]],
        unit: 'kWh'
      }
    ];
    ElectricalMeter.prototype.installation_location = [{
      field: 'type',
      writeable: true,
      value: ['enum', ['living_room', 'dining_room', 'kitchen', 'bathroom', 'lavatory', 'washroom_changing_room', 'passageway', 'room', 'stairway', 'front_door', 'storeroom', 'garden_perimeter', 'garage', 'veranda_balcony', 'others', 'free_definition', 'not_specified', 'indifinite', 'position_information']]
    }];
    ElectricalMeter.prototype.fault_status = [{
      field: 'value',
      value: ['enum', ['no_fault', 'fault']]
    }];
    function ElectricalMeter(){
      ElectricalMeter.superclass.call(this);
      this.declareSensors({
        electric_energy: ['0'],
        installation_location: ['0'],
        fault_status: ['0']
      });
    }
    return ElectricalMeter;
  }(SchemaBaseClass));
  TwoWayMeter = (function(superclass){
    var prototype = extend$((import$(TwoWayMeter, superclass).displayName = 'TwoWayMeter', TwoWayMeter), superclass).prototype, constructor = TwoWayMeter;
    function TwoWayMeter(){
      TwoWayMeter.superclass.call(this);
      this.declareSensors({
        electric_energy: ['0', '1']
      });
    }
    return TwoWayMeter;
  }(ElectricalMeter));
  ElectricalEquipment = (function(superclass){
    var prototype = extend$((import$(ElectricalEquipment, superclass).displayName = 'ElectricalEquipment', ElectricalEquipment), superclass).prototype, constructor = ElectricalEquipment;
    ElectricalEquipment.prototype.electric_energy = [
      {
        field: 'energy',
        value: ['int', [0, 1000]],
        unit: 'w',
        description: "the currently-consumed energy"
      }, {
        field: 'energy_cumulative',
        value: ['int', [0, 1000]],
        unit: 'Wh'
      }
    ];
    ElectricalEquipment.prototype.power_switch = [{
      field: 'value',
      value: ['boolean', ['off', 'on']],
      writeable: true
    }];
    function ElectricalEquipment(){
      ElectricalEquipment.superclass.call(this);
      this.declareSensors({
        electric_energy: ['0'],
        power_switch: ['0']
      });
    }
    return ElectricalEquipment;
  }(SchemaBaseClass));
  AirConditionEL = (function(superclass){
    var prototype = extend$((import$(AirConditionEL, superclass).displayName = 'AirConditionEL', AirConditionEL), superclass).prototype, constructor = AirConditionEL;
    AirConditionEL.prototype.user_settings = [
      {
        field: 'operation_mode',
        value: ['enum', ['auto', 'cooling', 'heating', 'dehumidification', 'circulator', 'other']],
        writeable: true
      }, {
        field: 'target_temperature',
        value: ['float', [22.0, 26.0], 0.5],
        writeable: true,
        unit: 'degree_c'
      }, {
        field: 'power_saving_mode',
        value: ['enum', ['power_saving', 'normal']],
        writeable: true
      }
    ];
    AirConditionEL.prototype.air_flow_rate = [{
      field: 'value',
      value: ['enum', ['auto', '1', '2', '3', '4', '5', '6', '7', '8']],
      writeable: true
    }];
    AirConditionEL.prototype.room_temperature = [{
      field: 'temperature',
      value: ['float', [20.0, 40.0]],
      unit: 'degree_c'
    }];
    function AirConditionEL(){
      AirConditionEL.superclass.call(this);
      this.declareSensors({
        user_settings: ['0'],
        air_flow_rate: ['0'],
        room_temperature: ['0']
      });
      this.sensors['air_flow_rate'][0] = {
        echonet: {
          value: ['a0', [0x41, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38]]
        }
      };
      this.sensors['user_settings'][0] = {
        echonet: {
          operation_mode: ['b0', [0x41, 0x42, 0x43, 0x44, 0x45, 0x40]],
          power_saving_mode: ['8f', [0x41, 0x42]]
        }
      };
      this.actuators['user_settings'] = [
        {
          action: 'cleanup_self',
          argument: ['boolean', ['off,', 'on']]
        }, {
          action: 'set_special_mode',
          argument: ['enum', ['human_sleeping', 'offical_working', 'home_standby']],
          $parameters: {
            human_sleeping: {
              target_temperature: 26.0,
              operation_mode: 'auto'
            },
            offical_working: {
              target_temperature: 24.0,
              operation_mode: 'cooling'
            },
            home_standby: {
              target_temperature: 27.0,
              operation_mode: 'circulator'
            }
          }
        }
      ];
    }
    return AirConditionEL;
  }(ElectricalEquipment));
  roots = {
    ElectricalEquipment: ElectricalEquipment,
    ElectricalMeter: ElectricalMeter
  };
  /** Please Don't Modify These Lines Below   */
  /** --------------------------------------- */
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
  var classes = {MANIFEST: MANIFEST, ElectricalMeter: ElectricalMeter, TwoWayMeter: TwoWayMeter, ElectricalEquipment: ElectricalEquipment, AirConditionEL: AirConditionEL};
  module.exports = {roots: roots, classes: classes, manifest: MANIFEST};
}).call(this);