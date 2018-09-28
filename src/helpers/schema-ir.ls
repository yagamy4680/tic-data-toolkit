require! <[fs path lodash]>
{DBG, WARN, INFO, ERR} = global.get-logger __filename


class FieldTypeClass
  (@spec, @sensor-type, @verbose) ->
    {name, writeable, value, unit, annotations} = spec
    {type, range, incremental} = value
    {peripheral-type} = sensor-type
    self = @
    self.name = name
    self.writeable = writeable
    self.value-type = type
    self.value-range = range
    self.value-incremental = incremental
    self.value-unit = unit
    self.annotations = annotations
    INFO "loading #{peripheral-type.name.cyan}/#{sensor-type.name.green}/#{name.yellow} => #{type}, [#{range.join ', '}], unit:#{unit}, #{if writeable then 'writable'}" if verbose

  init: ->
    return


class SensorTypeClass
  (@spec, @peripheral-type, @verbose) ->
    {s_type, s_id_list, fields} = spec
    self = @
    self.name = name = s_type
    self.s_id_list = s_id_list
    xs = [ s.red for s in s_id_list ]
    INFO "loading #{peripheral-type.name.cyan}/#{name.green} => #{xs.join ', '}" if verbose
    self.field-types = [ (new FieldTypeClass f, self, verbose) for f in fields ]

  init: ->
    {name, peripheral-type, field-types, verbose} = self = @
    INFO "init #{peripheral-type.name}/#{name}" if verbose
    [ f.init! for f in field-types ]



class PeripheralTypeClass
  (@spec, @loader, @verbose) ->
    {p_type, p_type_parent, classname, sensor_types} = spec
    self = @
    self.name = name = p_type
    self.parent-name = p_type_parent
    self.classname = classname
    INFO "loading #{name.cyan}" if verbose
    self.sensor-types = [ (new SensorTypeClass s, self, verbose) for s in sensor_types ]
    self.children = []

  add-child: (p) ->
    self = @
    self.children.push p
    self.children = lodash.sortBy self.children, <[name]>

  init: ->
    {name, sensor-types, loader, parent-name, verbose} = self = @
    {p-type-map} = loader
    INFO "init #{name}" if verbose
    [ s.init! for s in sensor-types ]
    self.parent = parent = p-type-map[parent-name]
    return parent.add-child self if parent?
    return loader.set-root-class self if name is \schema_base_class
    throw new Error "detect a class without parent class, but itself is not schema_base_class => #{name}"



class Loader
  (@filename, @spec, @opts) ->
    {verbose} = opts
    self = @
    self.verbose = verbose
    return

  set-root-class: (@root) ->
    return

  load: ->
    {spec, filename, verbose} = self = @
    {peripheral_types} = spec
    INFO "loader: #{filename}, #{peripheral_types.length} peripheral types."
    self.p-types = xs = [ (new PeripheralTypeClass pt, self, verbose) for pt in peripheral_types ]
    self.p-type-map = {[x.name, x] for x in xs}
    [ x.init! for x in xs ]
    {root} = self
    throw new Error "missing root class" unless root?
    root.level = 0
    self.p-types-ordered = [root]
    self.dfs-discovery root
    throw new Error "DFS discovery but number of elements is mismatched: #{xs.length} != #{self.p-types-ordered.length}" unless xs.length is self.p-types-ordered.length
    for p in self.p-types-ordered
      INFO "tree #{'    ' * p.level}#{p.name.cyan}"

  dfs-discovery: (p) ->
    {p-types-ordered} = self = @
    {children} = p
    for c in children
      p-types-ordered.push c
      c.level = p.level + 1
      self.dfs-discovery c

  to-csv: ->
    {p-types-ordered} = self = @
    self.output = []
    for p in p-types-ordered
      {sensor-types} = p
      for s in sensor-types
        {s_id_list} = s
        for i in s_id_list
          {field-types} = s
          for f in field-types
            xs = [p.name, s.name, i, f.name, f.writeable, f.value-type, f.value-unit]
            self.output.push xs
    xs = self.output
    xs = [ x.join ',' for x in xs ]
    xs = ["p_type,s_type,s_id,name,writable,type,unit"] ++ xs
    return xs.join "\n"


module.exports = exports = {Loader}