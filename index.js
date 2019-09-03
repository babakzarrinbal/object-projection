/**
 * validate objects like mongodb projection methodology
 * can't allow or ignore at the same time
 * @param {object} obj target object to validate
 * @param {*} validation validation object {key:<boolean>, "key.nestedkey":<boolean>}
 */
var objectProj = function objectProj(obj, validation) {
  //return not object variables
  if (!obj || typeof obj != "object" || Array.isArray(obj)) return obj;
  // flatten validation object
  let flatvalid = objToFlat(validation),
    //flatten target
    flatobj = objToFlat(obj),
    // array of allowed keys
    allowed = Object.keys(flatvalid).filter(k => flatvalid[k]),
    // array of guarded keys
    guarded = Object.keys(flatvalid).filter(
      k => flatvalid[k] != undefined && !flatvalid[k]
    ),
    // declare finalresult
    finalresult = null;
  if (allowed && allowed.length)
    finalresult = allowed.reduce((result, o) => {
      if (flatobj[o] != undefined) return { ...result, [o]: flatobj[o] };
      else
        return {
          ...result,
          ...Object.keys(flatobj).reduce((fr, u) => {
            if (u.match(new RegExp("^" + o + "\\..*"))) {
              return { ...fr, [u]: flatobj[u] };
            } else {
              return fr;
            }
          }, {})
        };
    }, {});
  else if (guarded && guarded.length)
    finalresult = Object.keys(flatobj).reduce((result, k) => {
      let ignore = guarded.find(
        g => k == g || k.match(new RegExp("^" + g + "\\..*"))
      );
      if (ignore) return result;
      return { ...result, [k]: flatobj[k] };
    }, {});
  else finalresult = flatobj;
  return flatToObj(finalresult);
};

/**
 * reformat flatted objects into multi layer object (joined by . char)
 * @param {object} ob input object
 */
var flatToObj = function flatToObj(ob) {
  if (!ob || typeof ob != "object") return ob;
  if (Array.isArray(ob)) return ob.map(k => flatToObj(k));
  return Object.keys(ob).reduce((result, k) => {
    let ka = k.split(".");
    if (ka.length == 1) return { ...result, ...{ [k]: flatToObj(ob[k]) } };
    let key = ka.shift();
    return {
      ...result,
      [key]: flatToObj({ ...(result[key] || {}), [ka.join(".")]: ob[k] })
    };
  }, {});
};

/**
 * flat nested object into single layer object (join by . char)
 * @param {object} ob input object
 */
var objToFlat = function objToFlat(ob) {
  if (!ob || typeof ob != "object") return ob;
  if (Array.isArray(ob)) return ob.map(k => objToFlat(k));
  return Object.keys(ob).reduce((fo, k) => {
    let cob = ob[k];
    if (!cob || typeof cob != "object") return { ...fo, [k]: cob };
    let flatted = objToFlat(cob);
    if (Array.isArray(flatted)) return { [k]: flatted };
    return Object.keys(flatted).reduce(
      (fo2, k2) => ({ ...fo2, [k + "." + k2]: flatted[k2] }),
      fo
    );
  }, {});
};

/**
 * sort nested object
 * @param {object} ob input object
 */
var objectSort = function(ob, sortfunc = (a, b) => (a > b ? 1 : -1)) {
  if (!ob || typeof ob != "object") return ob;
  if (Array.isArray(ob)) {
    return ob
      .reduce((c, ai) => {
        let sorted = objectSort(ai);
        return [
          ...c,
          {
            obj: sorted,
            objstr: typeof (sorted && sorted == "object")
              ? JSON.stringify(sorted)
              : sorted.toString()
          }
        ];
      }, [])
      .sort((a, b) => sortfunc(a.objstr, b.objstr))
      .map(r => r.obj);
  }

  return Object.keys(ob)
    .sort(sortfunc)
    .reduce((c, k) => ({ ...c, [k]: objectSort(ob[k]) }), {});
};

/**
 * compaire nested objects or arrays
 * @param {*} a first object
 * @param {*} b second object
 */
var objectCompare = function(a, b) {
  let c = t => {
    let te = objectSort(t);
    return te && typeof te == "object" ? JSON.stringify(te) : te;
  };
  return c(a) == c(b) ? a : null;
};

module.exports = {
  objectProj,
  objectSort,
  objectCompare,
  flatToObj,
  objToFlat
};
