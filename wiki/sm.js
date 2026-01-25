/*! For license information please see bundle.js.LICENSE.txt */
( () => {
    "use strict";
    var e, t, n = {
        22: (e, t) => {
            function n(e, t) {
                var n = e.length;
                e.push(t);
                e: for (; 0 < n; ) {
                    var r = n - 1 >>> 1
                      , a = e[r];
                    if (!(0 < i(a, t)))
                        break e;
                    e[r] = t,
                    e[n] = a,
                    n = r
                }
            }
            function r(e) {
                return 0 === e.length ? null : e[0]
            }
            function a(e) {
                if (0 === e.length)
                    return null;
                var t = e[0]
                  , n = e.pop();
                if (n !== t) {
                    e[0] = n;
                    e: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
                        var s = 2 * (r + 1) - 1
                          , l = e[s]
                          , u = s + 1
                          , c = e[u];
                        if (0 > i(l, n))
                            u < a && 0 > i(c, l) ? (e[r] = c,
                            e[u] = n,
                            r = u) : (e[r] = l,
                            e[s] = n,
                            r = s);
                        else {
                            if (!(u < a && 0 > i(c, n)))
                                break e;
                            e[r] = c,
                            e[u] = n,
                            r = u
                        }
                    }
                }
                return t
            }
            function i(e, t) {
                var n = e.sortIndex - t.sortIndex;
                return 0 !== n ? n : e.id - t.id
            }
            if ("object" == typeof performance && "function" == typeof performance.now) {
                var o = performance;
                t.unstable_now = function() {
                    return o.now()
                }
            } else {
                var s = Date
                  , l = s.now();
                t.unstable_now = function() {
                    return s.now() - l
                }
            }
            var u = []
              , c = []
              , d = 1
              , m = null
              , f = 3
              , h = !1
              , p = !1
              , g = !1
              , y = "function" == typeof setTimeout ? setTimeout : null
              , b = "function" == typeof clearTimeout ? clearTimeout : null
              , v = "undefined" != typeof setImmediate ? setImmediate : null;
            function w(e) {
                for (var t = r(c); null !== t; ) {
                    if (null === t.callback)
                        a(c);
                    else {
                        if (!(t.startTime <= e))
                            break;
                        a(c),
                        t.sortIndex = t.expirationTime,
                        n(u, t)
                    }
                    t = r(c)
                }
            }
            function x(e) {
                if (g = !1,
                w(e),
                !p)
                    if (null !== r(u))
                        p = !0,
                        D(_);
                    else {
                        var t = r(c);
                        null !== t && L(x, t.startTime - e)
                    }
            }
            function _(e, n) {
                p = !1,
                g && (g = !1,
                b(E),
                E = -1),
                h = !0;
                var i = f;
                try {
                    for (w(n),
                    m = r(u); null !== m && (!(m.expirationTime > n) || e && !T()); ) {
                        var o = m.callback;
                        if ("function" == typeof o) {
                            m.callback = null,
                            f = m.priorityLevel;
                            var s = o(m.expirationTime <= n);
                            n = t.unstable_now(),
                            "function" == typeof s ? m.callback = s : m === r(u) && a(u),
                            w(n)
                        } else
                            a(u);
                        m = r(u)
                    }
                    if (null !== m)
                        var l = !0;
                    else {
                        var d = r(c);
                        null !== d && L(x, d.startTime - n),
                        l = !1
                    }
                    return l
                } finally {
                    m = null,
                    f = i,
                    h = !1
                }
            }
            "undefined" != typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
            var N, k = !1, S = null, E = -1, P = 5, C = -1;
            function T() {
                return !(t.unstable_now() - C < P)
            }
            function M() {
                if (null !== S) {
                    var e = t.unstable_now();
                    C = e;
                    var n = !0;
                    try {
                        n = S(!0, e)
                    } finally {
                        n ? N() : (k = !1,
                        S = null)
                    }
                } else
                    k = !1
            }
            if ("function" == typeof v)
                N = function() {
                    v(M)
                }
                ;
            else if ("undefined" != typeof MessageChannel) {
                var A = new MessageChannel
                  , R = A.port2;
                A.port1.onmessage = M,
                N = function() {
                    R.postMessage(null)
                }
            } else
                N = function() {
                    y(M, 0)
                }
                ;
            function D(e) {
                S = e,
                k || (k = !0,
                N())
            }
            function L(e, n) {
                E = y(function() {
                    e(t.unstable_now())
                }, n)
            }
            t.unstable_IdlePriority = 5,
            t.unstable_ImmediatePriority = 1,
            t.unstable_LowPriority = 4,
            t.unstable_NormalPriority = 3,
            t.unstable_Profiling = null,
            t.unstable_UserBlockingPriority = 2,
            t.unstable_cancelCallback = function(e) {
                e.callback = null
            }
            ,
            t.unstable_continueExecution = function() {
                p || h || (p = !0,
                D(_))
            }
            ,
            t.unstable_forceFrameRate = function(e) {
                0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < e ? Math.floor(1e3 / e) : 5
            }
            ,
            t.unstable_getCurrentPriorityLevel = function() {
                return f
            }
            ,
            t.unstable_getFirstCallbackNode = function() {
                return r(u)
            }
            ,
            t.unstable_next = function(e) {
                switch (f) {
                case 1:
                case 2:
                case 3:
                    var t = 3;
                    break;
                default:
                    t = f
                }
                var n = f;
                f = t;
                try {
                    return e()
                } finally {
                    f = n
                }
            }
            ,
            t.unstable_pauseExecution = function() {}
            ,
            t.unstable_requestPaint = function() {}
            ,
            t.unstable_runWithPriority = function(e, t) {
                switch (e) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                default:
                    e = 3
                }
                var n = f;
                f = e;
                try {
                    return t()
                } finally {
                    f = n
                }
            }
            ,
            t.unstable_scheduleCallback = function(e, a, i) {
                var o = t.unstable_now();
                switch (i = "object" == typeof i && null !== i && "number" == typeof (i = i.delay) && 0 < i ? o + i : o,
                e) {
                case 1:
                    var s = -1;
                    break;
                case 2:
                    s = 250;
                    break;
                case 5:
                    s = 1073741823;
                    break;
                case 4:
                    s = 1e4;
                    break;
                default:
                    s = 5e3
                }
                return e = {
                    id: d++,
                    callback: a,
                    priorityLevel: e,
                    startTime: i,
                    expirationTime: s = i + s,
                    sortIndex: -1
                },
                i > o ? (e.sortIndex = i,
                n(c, e),
                null === r(u) && e === r(c) && (g ? (b(E),
                E = -1) : g = !0,
                L(x, i - o))) : (e.sortIndex = s,
                n(u, e),
                p || h || (p = !0,
                D(_))),
                e
            }
            ,
            t.unstable_shouldYield = T,
            t.unstable_wrapCallback = function(e) {
                var t = f;
                return function() {
                    var n = f;
                    f = t;
                    try {
                        return e.apply(this, arguments)
                    } finally {
                        f = n
                    }
                }
            }
        }
        ,
        38: (e, t, n) => {
            e.exports = function(e) {
                var t = n.nc;
                t && e.setAttribute("nonce", t)
            }
        }
        ,
        40: e => {
            e.exports = function(e) {
                var t = [];
                return t.toString = function() {
                    return this.map(function(t) {
                        var n = ""
                          , r = void 0 !== t[5];
                        return t[4] && (n += "@supports (".concat(t[4], ") {")),
                        t[2] && (n += "@media ".concat(t[2], " {")),
                        r && (n += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")),
                        n += e(t),
                        r && (n += "}"),
                        t[2] && (n += "}"),
                        t[4] && (n += "}"),
                        n
                    }).join("")
                }
                ,
                t.i = function(e, n, r, a, i) {
                    "string" == typeof e && (e = [[null, e, void 0]]);
                    var o = {};
                    if (r)
                        for (var s = 0; s < this.length; s++) {
                            var l = this[s][0];
                            null != l && (o[l] = !0)
                        }
                    for (var u = 0; u < e.length; u++) {
                        var c = [].concat(e[u]);
                        r && o[c[0]] || (void 0 !== i && (void 0 === c[5] || (c[1] = "@layer".concat(c[5].length > 0 ? " ".concat(c[5]) : "", " {").concat(c[1], "}")),
                        c[5] = i),
                        n && (c[2] ? (c[1] = "@media ".concat(c[2], " {").concat(c[1], "}"),
                        c[2] = n) : c[2] = n),
                        a && (c[4] ? (c[1] = "@supports (".concat(c[4], ") {").concat(c[1], "}"),
                        c[4] = a) : c[4] = "".concat(a)),
                        t.push(c))
                    }
                }
                ,
                t
            }
        }
        ,
        171: (e, t, n) => {
            e.exports = n(666)
        }
        ,
        199: e => {
            e.exports = function(e) {
                return e[1]
            }
        }
        ,
        230: e => {
            var t = [];
            function n(e) {
                for (var n = -1, r = 0; r < t.length; r++)
                    if (t[r].identifier === e) {
                        n = r;
                        break
                    }
                return n
            }
            function r(e, r) {
                for (var i = {}, o = [], s = 0; s < e.length; s++) {
                    var l = e[s]
                      , u = r.base ? l[0] + r.base : l[0]
                      , c = i[u] || 0
                      , d = "".concat(u, " ").concat(c);
                    i[u] = c + 1;
                    var m = n(d)
                      , f = {
                        css: l[1],
                        media: l[2],
                        sourceMap: l[3],
                        supports: l[4],
                        layer: l[5]
                    };
                    if (-1 !== m)
                        t[m].references++,
                        t[m].updater(f);
                    else {
                        var h = a(f, r);
                        r.byIndex = s,
                        t.splice(s, 0, {
                            identifier: d,
                            updater: h,
                            references: 1
                        })
                    }
                    o.push(d)
                }
                return o
            }
            function a(e, t) {
                var n = t.domAPI(t);
                return n.update(e),
                function(t) {
                    if (t) {
                        if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap && t.supports === e.supports && t.layer === e.layer)
                            return;
                        n.update(e = t)
                    } else
                        n.remove()
                }
            }
            e.exports = function(e, a) {
                var i = r(e = e || [], a = a || {});
                return function(e) {
                    e = e || [];
                    for (var o = 0; o < i.length; o++) {
                        var s = n(i[o]);
                        t[s].references--
                    }
                    for (var l = r(e, a), u = 0; u < i.length; u++) {
                        var c = n(i[u]);
                        0 === t[c].references && (t[c].updater(),
                        t.splice(c, 1))
                    }
                    i = l
                }
            }
        }
        ,
        317: e => {
            var t = {};
            e.exports = function(e, n) {
                var r = function(e) {
                    if (void 0 === t[e]) {
                        var n = document.querySelector(e);
                        if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement)
                            try {
                                n = n.contentDocument.head
                            } catch (e) {
                                n = null
                            }
                        t[e] = n
                    }
                    return t[e]
                }(e);
                if (!r)
                    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                r.appendChild(n)
            }
        }
        ,
        353: (e, t, n) => {
            !function e() {
                if ("undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE)
                    try {
                        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e)
                    } catch (e) {
                        console.error(e)
                    }
            }(),
            e.exports = n(951)
        }
        ,
        489: (e, t, n) => {
            var r = n(171)
              , a = Symbol.for("react.element")
              , i = (Symbol.for("react.fragment"),
            Object.prototype.hasOwnProperty)
              , o = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner
              , s = {
                key: !0,
                ref: !0,
                __self: !0,
                __source: !0
            };
            function l(e, t, n) {
                var r, l = {}, u = null, c = null;
                for (r in void 0 !== n && (u = "" + n),
                void 0 !== t.key && (u = "" + t.key),
                void 0 !== t.ref && (c = t.ref),
                t)
                    i.call(t, r) && !s.hasOwnProperty(r) && (l[r] = t[r]);
                if (e && e.defaultProps)
                    for (r in t = e.defaultProps)
                        void 0 === l[r] && (l[r] = t[r]);
                return {
                    $$typeof: a,
                    type: e,
                    key: u,
                    ref: c,
                    props: l,
                    _owner: o.current
                }
            }
            t.jsx = l,
            t.jsxs = l
        }
        ,
        552: (e, t, n) => {
            e.exports = n(489)
        }
        ,
        594: (e, t, n) => {
            var r = n(353);
            t.createRoot = r.createRoot,
            t.hydrateRoot = r.hydrateRoot
        }
        ,
        665: (e, t, n) => {
            e.exports = n(22)
        }
        ,
        666: (e, t) => {
            var n = Symbol.for("react.element")
              , r = Symbol.for("react.portal")
              , a = Symbol.for("react.fragment")
              , i = Symbol.for("react.strict_mode")
              , o = Symbol.for("react.profiler")
              , s = Symbol.for("react.provider")
              , l = Symbol.for("react.context")
              , u = Symbol.for("react.forward_ref")
              , c = Symbol.for("react.suspense")
              , d = Symbol.for("react.memo")
              , m = Symbol.for("react.lazy")
              , f = Symbol.iterator
              , h = {
                isMounted: function() {
                    return !1
                },
                enqueueForceUpdate: function() {},
                enqueueReplaceState: function() {},
                enqueueSetState: function() {}
            }
              , p = Object.assign
              , g = {};
            function y(e, t, n) {
                this.props = e,
                this.context = t,
                this.refs = g,
                this.updater = n || h
            }
            function b() {}
            function v(e, t, n) {
                this.props = e,
                this.context = t,
                this.refs = g,
                this.updater = n || h
            }
            y.prototype.isReactComponent = {},
            y.prototype.setState = function(e, t) {
                if ("object" != typeof e && "function" != typeof e && null != e)
                    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
                this.updater.enqueueSetState(this, e, t, "setState")
            }
            ,
            y.prototype.forceUpdate = function(e) {
                this.updater.enqueueForceUpdate(this, e, "forceUpdate")
            }
            ,
            b.prototype = y.prototype;
            var w = v.prototype = new b;
            w.constructor = v,
            p(w, y.prototype),
            w.isPureReactComponent = !0;
            var x = Array.isArray
              , _ = Object.prototype.hasOwnProperty
              , N = {
                current: null
            }
              , k = {
                key: !0,
                ref: !0,
                __self: !0,
                __source: !0
            };
            function S(e, t, r) {
                var a, i = {}, o = null, s = null;
                if (null != t)
                    for (a in void 0 !== t.ref && (s = t.ref),
                    void 0 !== t.key && (o = "" + t.key),
                    t)
                        _.call(t, a) && !k.hasOwnProperty(a) && (i[a] = t[a]);
                var l = arguments.length - 2;
                if (1 === l)
                    i.children = r;
                else if (1 < l) {
                    for (var u = Array(l), c = 0; c < l; c++)
                        u[c] = arguments[c + 2];
                    i.children = u
                }
                if (e && e.defaultProps)
                    for (a in l = e.defaultProps)
                        void 0 === i[a] && (i[a] = l[a]);
                return {
                    $$typeof: n,
                    type: e,
                    key: o,
                    ref: s,
                    props: i,
                    _owner: N.current
                }
            }
            function E(e) {
                return "object" == typeof e && null !== e && e.$$typeof === n
            }
            var P = /\/+/g;
            function C(e, t) {
                return "object" == typeof e && null !== e && null != e.key ? function(e) {
                    var t = {
                        "=": "=0",
                        ":": "=2"
                    };
                    return "$" + e.replace(/[=:]/g, function(e) {
                        return t[e]
                    })
                }("" + e.key) : t.toString(36)
            }
            function T(e, t, a, i, o) {
                var s = typeof e;
                "undefined" !== s && "boolean" !== s || (e = null);
                var l = !1;
                if (null === e)
                    l = !0;
                else
                    switch (s) {
                    case "string":
                    case "number":
                        l = !0;
                        break;
                    case "object":
                        switch (e.$$typeof) {
                        case n:
                        case r:
                            l = !0
                        }
                    }
                if (l)
                    return o = o(l = e),
                    e = "" === i ? "." + C(l, 0) : i,
                    x(o) ? (a = "",
                    null != e && (a = e.replace(P, "$&/") + "/"),
                    T(o, t, a, "", function(e) {
                        return e
                    })) : null != o && (E(o) && (o = function(e, t) {
                        return {
                            $$typeof: n,
                            type: e.type,
                            key: t,
                            ref: e.ref,
                            props: e.props,
                            _owner: e._owner
                        }
                    }(o, a + (!o.key || l && l.key === o.key ? "" : ("" + o.key).replace(P, "$&/") + "/") + e)),
                    t.push(o)),
                    1;
                if (l = 0,
                i = "" === i ? "." : i + ":",
                x(e))
                    for (var u = 0; u < e.length; u++) {
                        var c = i + C(s = e[u], u);
                        l += T(s, t, a, c, o)
                    }
                else if (c = function(e) {
                    return null === e || "object" != typeof e ? null : "function" == typeof (e = f && e[f] || e["@@iterator"]) ? e : null
                }(e),
                "function" == typeof c)
                    for (e = c.call(e),
                    u = 0; !(s = e.next()).done; )
                        l += T(s = s.value, t, a, c = i + C(s, u++), o);
                else if ("object" === s)
                    throw t = String(e),
                    Error("Objects are not valid as a React child (found: " + ("[object Object]" === t ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
                return l
            }
            function M(e, t, n) {
                if (null == e)
                    return e;
                var r = []
                  , a = 0;
                return T(e, r, "", "", function(e) {
                    return t.call(n, e, a++)
                }),
                r
            }
            function A(e) {
                if (-1 === e._status) {
                    var t = e._result;
                    (t = t()).then(function(t) {
                        0 !== e._status && -1 !== e._status || (e._status = 1,
                        e._result = t)
                    }, function(t) {
                        0 !== e._status && -1 !== e._status || (e._status = 2,
                        e._result = t)
                    }),
                    -1 === e._status && (e._status = 0,
                    e._result = t)
                }
                if (1 === e._status)
                    return e._result.default;
                throw e._result
            }
            var R = {
                current: null
            }
              , D = {
                transition: null
            }
              , L = {
                ReactCurrentDispatcher: R,
                ReactCurrentBatchConfig: D,
                ReactCurrentOwner: N
            };
            function O() {
                throw Error("act(...) is not supported in production builds of React.")
            }
            t.Children = {
                map: M,
                forEach: function(e, t, n) {
                    M(e, function() {
                        t.apply(this, arguments)
                    }, n)
                },
                count: function(e) {
                    var t = 0;
                    return M(e, function() {
                        t++
                    }),
                    t
                },
                toArray: function(e) {
                    return M(e, function(e) {
                        return e
                    }) || []
                },
                only: function(e) {
                    if (!E(e))
                        throw Error("React.Children.only expected to receive a single React element child.");
                    return e
                }
            },
            t.Component = y,
            t.Fragment = a,
            t.Profiler = o,
            t.PureComponent = v,
            t.StrictMode = i,
            t.Suspense = c,
            t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = L,
            t.act = O,
            t.cloneElement = function(e, t, r) {
                if (null == e)
                    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
                var a = p({}, e.props)
                  , i = e.key
                  , o = e.ref
                  , s = e._owner;
                if (null != t) {
                    if (void 0 !== t.ref && (o = t.ref,
                    s = N.current),
                    void 0 !== t.key && (i = "" + t.key),
                    e.type && e.type.defaultProps)
                        var l = e.type.defaultProps;
                    for (u in t)
                        _.call(t, u) && !k.hasOwnProperty(u) && (a[u] = void 0 === t[u] && void 0 !== l ? l[u] : t[u])
                }
                var u = arguments.length - 2;
                if (1 === u)
                    a.children = r;
                else if (1 < u) {
                    l = Array(u);
                    for (var c = 0; c < u; c++)
                        l[c] = arguments[c + 2];
                    a.children = l
                }
                return {
                    $$typeof: n,
                    type: e.type,
                    key: i,
                    ref: o,
                    props: a,
                    _owner: s
                }
            }
            ,
            t.createContext = function(e) {
                return (e = {
                    $$typeof: l,
                    _currentValue: e,
                    _currentValue2: e,
                    _threadCount: 0,
                    Provider: null,
                    Consumer: null,
                    _defaultValue: null,
                    _globalName: null
                }).Provider = {
                    $$typeof: s,
                    _context: e
                },
                e.Consumer = e
            }
            ,
            t.createElement = S,
            t.createFactory = function(e) {
                var t = S.bind(null, e);
                return t.type = e,
                t
            }
            ,
            t.createRef = function() {
                return {
                    current: null
                }
            }
            ,
            t.forwardRef = function(e) {
                return {
                    $$typeof: u,
                    render: e
                }
            }
            ,
            t.isValidElement = E,
            t.lazy = function(e) {
                return {
                    $$typeof: m,
                    _payload: {
                        _status: -1,
                        _result: e
                    },
                    _init: A
                }
            }
            ,
            t.memo = function(e, t) {
                return {
                    $$typeof: d,
                    type: e,
                    compare: void 0 === t ? null : t
                }
            }
            ,
            t.startTransition = function(e) {
                var t = D.transition;
                D.transition = {};
                try {
                    e()
                } finally {
                    D.transition = t
                }
            }
            ,
            t.unstable_act = O,
            t.useCallback = function(e, t) {
                return R.current.useCallback(e, t)
            }
            ,
            t.useContext = function(e) {
                return R.current.useContext(e)
            }
            ,
            t.useDebugValue = function() {}
            ,
            t.useDeferredValue = function(e) {
                return R.current.useDeferredValue(e)
            }
            ,
            t.useEffect = function(e, t) {
                return R.current.useEffect(e, t)
            }
            ,
            t.useId = function() {
                return R.current.useId()
            }
            ,
            t.useImperativeHandle = function(e, t, n) {
                return R.current.useImperativeHandle(e, t, n)
            }
            ,
            t.useInsertionEffect = function(e, t) {
                return R.current.useInsertionEffect(e, t)
            }
            ,
            t.useLayoutEffect = function(e, t) {
                return R.current.useLayoutEffect(e, t)
            }
            ,
            t.useMemo = function(e, t) {
                return R.current.useMemo(e, t)
            }
            ,
            t.useReducer = function(e, t, n) {
                return R.current.useReducer(e, t, n)
            }
            ,
            t.useRef = function(e) {
                return R.current.useRef(e)
            }
            ,
            t.useState = function(e) {
                return R.current.useState(e)
            }
            ,
            t.useSyncExternalStore = function(e, t, n) {
                return R.current.useSyncExternalStore(e, t, n)
            }
            ,
            t.useTransition = function() {
                return R.current.useTransition()
            }
            ,
            t.version = "18.3.1"
        }
        ,
        673: (e, t, n) => {
            n.d(t, {
                A: () => s
            });
            var r = n(199)
              , a = n.n(r)
              , i = n(40)
              , o = n.n(i)()(a());
            o.push([e.id, "*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.18 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden=\"until-found\"])) {\n  display: none;\n}\n  * {\n    box-sizing: border-box;\n  }\n  \n  body {\n    font-family: 'PingFang SC', 'Microsoft YaHei', 'SimHei', sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    min-height: 100vh;\n    margin: 0;\n    padding: 0;\n  }\n  \n  #root {\n    min-height: 100vh;\n  }\n.glass-card {\n  border-radius: 0.75rem;\n  border-width: 1px;\n  border-color: rgb(255 255 255 / 0.2);\n  background-color: rgb(255 255 255 / 0.1);\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  --tw-backdrop-blur: blur(12px);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n.gradient-text {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n  --tw-gradient-from: #c084fc var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(192 132 252 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n  --tw-gradient-to: #f472b6 var(--tw-gradient-to-position);\n  -webkit-background-clip: text;\n          background-clip: text;\n  color: transparent;\n}\n.palace-cell {\n  position: relative;\n  min-height: 120px;\n  cursor: pointer;\n  border-radius: 0.5rem;\n  border-width: 1px;\n  border-color: rgb(216 180 254 / 0.3);\n  background-color: rgb(255 255 255 / 0.05);\n  padding: 0.75rem;\n  --tw-backdrop-blur: blur(4px);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 300ms;\n}\n.palace-cell:hover {\n  border-color: rgb(192 132 252 / 0.5);\n  background-color: rgb(255 255 255 / 0.1);\n}\n@keyframes pulseGlow {\n\n  0%, 100% {\n    box-shadow: 0 0 5px rgba(168, 85, 247, 0.5);\n  }\n\n  50% {\n    box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);\n  }\n}\n.palace-cell.active {\n  animation: pulseGlow 2s infinite;\n  --tw-border-opacity: 1;\n  border-color: rgb(192 132 252 / var(--tw-border-opacity, 1));\n  background-color: rgb(168 85 247 / 0.2);\n}\n.star-major {\n    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);\n    font-size: 1.125rem;\n    line-height: 1.75rem;\n    font-weight: 700;\n    --tw-text-opacity: 1;\n    color: rgb(250 204 21 / var(--tw-text-opacity, 1));\n  }\n.star-minor {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: rgb(147 197 253 / var(--tw-text-opacity, 1));\n}\n.star-hua-lu {\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(74 222 128 / var(--tw-text-opacity, 1));\n}\n.star-hua-quan {\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity, 1));\n}\n.star-hua-ke {\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(96 165 250 / var(--tw-text-opacity, 1));\n}\n.star-hua-ji {\n  font-weight: 600;\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity, 1));\n}\n.absolute {\n  position: absolute;\n}\n.bottom-1 {\n  bottom: 0.25rem;\n}\n.left-1 {\n  left: 0.25rem;\n}\n.left-4 {\n  left: 1rem;\n}\n.right-1 {\n  right: 0.25rem;\n}\n.top-1 {\n  top: 0.25rem;\n}\n.top-4 {\n  top: 1rem;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.mb-1 {\n  margin-bottom: 0.25rem;\n}\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n.mb-4 {\n  margin-bottom: 1rem;\n}\n.mb-6 {\n  margin-bottom: 1.5rem;\n}\n.mb-8 {\n  margin-bottom: 2rem;\n}\n.mr-1 {\n  margin-right: 0.25rem;\n}\n.mr-2 {\n  margin-right: 0.5rem;\n}\n.mr-3 {\n  margin-right: 0.75rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-4 {\n  margin-top: 1rem;\n}\n.mt-6 {\n  margin-top: 1.5rem;\n}\n.mt-8 {\n  margin-top: 2rem;\n}\n.block {\n  display: block;\n}\n.inline {\n  display: inline;\n}\n.flex {\n  display: flex;\n}\n.grid {\n  display: grid;\n}\n.hidden {\n  display: none;\n}\n.h-12 {\n  height: 3rem;\n}\n.h-16 {\n  height: 4rem;\n}\n.h-3 {\n  height: 0.75rem;\n}\n.h-32 {\n  height: 8rem;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-full {\n  height: 100%;\n}\n.min-h-\\[calc\\(100vh-64px\\)\\] {\n  min-height: calc(100vh - 64px);\n}\n.min-h-screen {\n  min-height: 100vh;\n}\n.w-16 {\n  width: 4rem;\n}\n.w-3 {\n  width: 0.75rem;\n}\n.w-32 {\n  width: 8rem;\n}\n.w-64 {\n  width: 16rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-full {\n  width: 100%;\n}\n.max-w-2xl {\n  max-width: 42rem;\n}\n.max-w-4xl {\n  max-width: 56rem;\n}\n.max-w-6xl {\n  max-width: 72rem;\n}\n.flex-1 {\n  flex: 1 1 0%;\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n}\n.grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n.grid-cols-3 {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n.flex-wrap {\n  flex-wrap: wrap;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-1 {\n  gap: 0.25rem;\n}\n.gap-3 {\n  gap: 0.75rem;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.gap-6 {\n  gap: 1.5rem;\n}\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.5rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-x-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(1rem * var(--tw-space-x-reverse));\n  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\n.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\n.space-y-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));\n}\n.space-y-4 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n}\n.space-y-6 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));\n}\n.rounded {\n  border-radius: 0.25rem;\n}\n.rounded-2xl {\n  border-radius: 1rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.border {\n  border-width: 1px;\n}\n.border-2 {\n  border-width: 2px;\n}\n.border-4 {\n  border-width: 4px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-l-4 {\n  border-left-width: 4px;\n}\n.border-dashed {\n  border-style: dashed;\n}\n.border-none {\n  border-style: none;\n}\n.border-blue-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(96 165 250 / var(--tw-border-opacity, 1));\n}\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));\n}\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n}\n.border-pink-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(244 114 182 / var(--tw-border-opacity, 1));\n}\n.border-purple-400 {\n  --tw-border-opacity: 1;\n  border-color: rgb(192 132 252 / var(--tw-border-opacity, 1));\n}\n.border-purple-400\\/30 {\n  border-color: rgb(192 132 252 / 0.3);\n}\n.border-purple-400\\/50 {\n  border-color: rgb(192 132 252 / 0.5);\n}\n.border-purple-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(168 85 247 / var(--tw-border-opacity, 1));\n}\n.border-white\\/10 {\n  border-color: rgb(255 255 255 / 0.1);\n}\n.border-white\\/30 {\n  border-color: rgb(255 255 255 / 0.3);\n}\n.border-yellow-500\\/30 {\n  border-color: rgb(234 179 8 / 0.3);\n}\n.border-t-transparent {\n  border-top-color: transparent;\n}\n.bg-blue-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));\n}\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n}\n.bg-blue-500\\/20 {\n  background-color: rgb(59 130 246 / 0.2);\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n}\n.bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));\n}\n.bg-gray-500\\/20 {\n  background-color: rgb(107 114 128 / 0.2);\n}\n.bg-gray-800 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));\n}\n.bg-green-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));\n}\n.bg-green-500\\/20 {\n  background-color: rgb(34 197 94 / 0.2);\n}\n.bg-orange-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 237 213 / var(--tw-bg-opacity, 1));\n}\n.bg-orange-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 247 237 / var(--tw-bg-opacity, 1));\n}\n.bg-pink-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(236 72 153 / var(--tw-bg-opacity, 1));\n}\n.bg-purple-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));\n}\n.bg-purple-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));\n}\n.bg-red-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));\n}\n.bg-red-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));\n}\n.bg-red-500\\/20 {\n  background-color: rgb(239 68 68 / 0.2);\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n}\n.bg-white\\/10 {\n  background-color: rgb(255 255 255 / 0.1);\n}\n.bg-white\\/5 {\n  background-color: rgb(255 255 255 / 0.05);\n}\n.bg-yellow-500\\/10 {\n  background-color: rgb(234 179 8 / 0.1);\n}\n.bg-yellow-500\\/20 {\n  background-color: rgb(234 179 8 / 0.2);\n}\n.bg-opacity-20 {\n  --tw-bg-opacity: 0.2;\n}\n.bg-gradient-to-r {\n  background-image: linear-gradient(to right, var(--tw-gradient-stops));\n}\n.from-blue-500 {\n  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-500 {\n  --tw-gradient-from: #a855f7 var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(168 85 247 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.from-purple-500\\/10 {\n  --tw-gradient-from: rgb(168 85 247 / 0.1) var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(168 85 247 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n.to-pink-500 {\n  --tw-gradient-to: #ec4899 var(--tw-gradient-to-position);\n}\n.to-pink-500\\/10 {\n  --tw-gradient-to: rgb(236 72 153 / 0.1) var(--tw-gradient-to-position);\n}\n.to-purple-600 {\n  --tw-gradient-to: #9333ea var(--tw-gradient-to-position);\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.p-3 {\n  padding: 0.75rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-6 {\n  padding: 1.5rem;\n}\n.p-8 {\n  padding: 2rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n.px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n.py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n}\n.pl-4 {\n  padding-left: 1rem;\n}\n.text-center {\n  text-align: center;\n}\n.text-right {\n  text-align: right;\n}\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n.text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n}\n.text-4xl {\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n}\n.text-6xl {\n  font-size: 3.75rem;\n  line-height: 1;\n}\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-semibold {\n  font-weight: 600;\n}\n.text-blue-400 {\n  --tw-text-opacity: 1;\n  color: rgb(96 165 250 / var(--tw-text-opacity, 1));\n}\n.text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity, 1));\n}\n.text-blue-600 {\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity, 1));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity, 1));\n}\n.text-blue-800 {\n  --tw-text-opacity: 1;\n  color: rgb(30 64 175 / var(--tw-text-opacity, 1));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n}\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity, 1));\n}\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity, 1));\n}\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity, 1));\n}\n.text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity, 1));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity, 1));\n}\n.text-green-400 {\n  --tw-text-opacity: 1;\n  color: rgb(74 222 128 / var(--tw-text-opacity, 1));\n}\n.text-green-500 {\n  --tw-text-opacity: 1;\n  color: rgb(34 197 94 / var(--tw-text-opacity, 1));\n}\n.text-green-600 {\n  --tw-text-opacity: 1;\n  color: rgb(22 163 74 / var(--tw-text-opacity, 1));\n}\n.text-orange-500 {\n  --tw-text-opacity: 1;\n  color: rgb(249 115 22 / var(--tw-text-opacity, 1));\n}\n.text-orange-600 {\n  --tw-text-opacity: 1;\n  color: rgb(234 88 12 / var(--tw-text-opacity, 1));\n}\n.text-purple-300 {\n  --tw-text-opacity: 1;\n  color: rgb(216 180 254 / var(--tw-text-opacity, 1));\n}\n.text-purple-400 {\n  --tw-text-opacity: 1;\n  color: rgb(192 132 252 / var(--tw-text-opacity, 1));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(168 85 247 / var(--tw-text-opacity, 1));\n}\n.text-purple-600 {\n  --tw-text-opacity: 1;\n  color: rgb(147 51 234 / var(--tw-text-opacity, 1));\n}\n.text-red-400 {\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity, 1));\n}\n.text-red-600 {\n  --tw-text-opacity: 1;\n  color: rgb(220 38 38 / var(--tw-text-opacity, 1));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n.text-white\\/40 {\n  color: rgb(255 255 255 / 0.4);\n}\n.text-white\\/50 {\n  color: rgb(255 255 255 / 0.5);\n}\n.text-white\\/60 {\n  color: rgb(255 255 255 / 0.6);\n}\n.text-white\\/70 {\n  color: rgb(255 255 255 / 0.7);\n}\n.text-white\\/80 {\n  color: rgb(255 255 255 / 0.8);\n}\n.text-white\\/90 {\n  color: rgb(255 255 255 / 0.9);\n}\n.text-yellow-400 {\n  --tw-text-opacity: 1;\n  color: rgb(250 204 21 / var(--tw-text-opacity, 1));\n}\n.text-yellow-500 {\n  --tw-text-opacity: 1;\n  color: rgb(234 179 8 / var(--tw-text-opacity, 1));\n}\n.opacity-90 {\n  opacity: 0.9;\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.transition-shadow {\n  transition-property: box-shadow;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-300 {\n  transition-duration: 300ms;\n}\n\n.ziwei-grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  grid-template-rows: repeat(4, 1fr);\n  gap: 8px;\n  aspect-ratio: 1;\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.palace-position-1 { grid-area: 1 / 2; }\n.palace-position-2 { grid-area: 1 / 3; }\n.palace-position-3 { grid-area: 1 / 4; }\n.palace-position-4 { grid-area: 2 / 4; }\n.palace-position-5 { grid-area: 3 / 4; }\n.palace-position-6 { grid-area: 4 / 4; }\n.palace-position-7 { grid-area: 4 / 3; }\n.palace-position-8 { grid-area: 4 / 2; }\n.palace-position-9 { grid-area: 4 / 1; }\n.palace-position-10 { grid-area: 3 / 1; }\n.palace-position-11 { grid-area: 2 / 1; }\n.palace-position-12 { grid-area: 1 / 1; }\n\n.center-info {\n  grid-area: 2 / 2 / 4 / 4;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.75rem;\n  border-width: 1px;\n  border-color: rgb(255 255 255 / 0.3);\n  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));\n  --tw-gradient-from: rgb(147 51 234 / 0.2) var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(147 51 234 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n  --tw-gradient-to: rgb(37 99 235 / 0.2) var(--tw-gradient-to-position);\n  --tw-backdrop-blur: blur(12px);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n}\n\n.hover\\:scale-105:hover {\n  --tw-scale-x: 1.05;\n  --tw-scale-y: 1.05;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n.hover\\:border-blue-500:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));\n}\n\n.hover\\:border-green-500:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(34 197 94 / var(--tw-border-opacity, 1));\n}\n\n.hover\\:border-purple-500:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(168 85 247 / var(--tw-border-opacity, 1));\n}\n\n.hover\\:bg-blue-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));\n}\n\n.hover\\:bg-gray-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n}\n\n.hover\\:bg-gray-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));\n}\n\n.hover\\:bg-green-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));\n}\n\n.hover\\:bg-purple-50:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));\n}\n\n.hover\\:bg-white\\/10:hover {\n  background-color: rgb(255 255 255 / 0.1);\n}\n\n.hover\\:bg-white\\/20:hover {\n  background-color: rgb(255 255 255 / 0.2);\n}\n\n.hover\\:from-purple-600:hover {\n  --tw-gradient-from: #9333ea var(--tw-gradient-from-position);\n  --tw-gradient-to: rgb(147 51 234 / 0) var(--tw-gradient-to-position);\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);\n}\n\n.hover\\:to-pink-600:hover {\n  --tw-gradient-to: #db2777 var(--tw-gradient-to-position);\n}\n\n.hover\\:text-purple-200:hover {\n  --tw-text-opacity: 1;\n  color: rgb(233 213 255 / var(--tw-text-opacity, 1));\n}\n\n.hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n}\n\n.hover\\:shadow-lg:hover {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.hover\\:shadow-md:hover {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.hover\\:shadow-xl:hover {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.focus\\:border-purple-400:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(192 132 252 / var(--tw-border-opacity, 1));\n}\n\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n@media (min-width: 768px) {\n\n  .md\\:block {\n    display: block;\n  }\n\n  .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-5 {\n    grid-template-columns: repeat(5, minmax(0, 1fr));\n  }\n\n  .md\\:p-12 {\n    padding: 3rem;\n  }\n\n  .md\\:p-8 {\n    padding: 2rem;\n  }\n\n  .md\\:text-6xl {\n    font-size: 3.75rem;\n    line-height: 1;\n  }\n}\n\n@media (min-width: 1024px) {\n\n  .lg\\:col-span-2 {\n    grid-column: span 2 / span 2;\n  }\n\n  .lg\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n", ""]);
            const s = o
        }
        ,
        762: e => {
            e.exports = function(e) {
                var t = document.createElement("style");
                return e.setAttributes(t, e.attributes),
                e.insert(t, e.options),
                t
            }
        }
        ,
        823: e => {
            e.exports = function(e) {
                if ("undefined" == typeof document)
                    return {
                        update: function() {},
                        remove: function() {}
                    };
                var t = e.insertStyleElement(e);
                return {
                    update: function(n) {
                        !function(e, t, n) {
                            var r = "";
                            n.supports && (r += "@supports (".concat(n.supports, ") {")),
                            n.media && (r += "@media ".concat(n.media, " {"));
                            var a = void 0 !== n.layer;
                            a && (r += "@layer".concat(n.layer.length > 0 ? " ".concat(n.layer) : "", " {")),
                            r += n.css,
                            a && (r += "}"),
                            n.media && (r += "}"),
                            n.supports && (r += "}");
                            var i = n.sourceMap;
                            i && "undefined" != typeof btoa && (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i)))), " */")),
                            t.styleTagTransform(r, e, t.options)
                        }(t, e, n)
                    },
                    remove: function() {
                        !function(e) {
                            if (null === e.parentNode)
                                return !1;
                            e.parentNode.removeChild(e)
                        }(t)
                    }
                }
            }
        }
        ,
        935: e => {
            e.exports = function(e, t) {
                if (t.styleSheet)
                    t.styleSheet.cssText = e;
                else {
                    for (; t.firstChild; )
                        t.removeChild(t.firstChild);
                    t.appendChild(document.createTextNode(e))
                }
            }
        }
        ,
        951: (e, t, n) => {
            var r = n(171)
              , a = n(665);
            function i(e) {
                for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++)
                    t += "&args[]=" + encodeURIComponent(arguments[n]);
                return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
            }
            var o = new Set
              , s = {};
            function l(e, t) {
                u(e, t),
                u(e + "Capture", t)
            }
            function u(e, t) {
                for (s[e] = t,
                e = 0; e < t.length; e++)
                    o.add(t[e])
            }
            var c = !("undefined" == typeof window || void 0 === window.document || void 0 === window.document.createElement)
              , d = Object.prototype.hasOwnProperty
              , m = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/
              , f = {}
              , h = {};
            function p(e, t, n, r, a, i, o) {
                this.acceptsBooleans = 2 === t || 3 === t || 4 === t,
                this.attributeName = r,
                this.attributeNamespace = a,
                this.mustUseProperty = n,
                this.propertyName = e,
                this.type = t,
                this.sanitizeURL = i,
                this.removeEmptyString = o
            }
            var g = {};
            "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
                g[e] = new p(e,0,!1,e,null,!1,!1)
            }),
            [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
                var t = e[0];
                g[t] = new p(t,1,!1,e[1],null,!1,!1)
            }),
            ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
                g[e] = new p(e,2,!1,e.toLowerCase(),null,!1,!1)
            }),
            ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
                g[e] = new p(e,2,!1,e,null,!1,!1)
            }),
            "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
                g[e] = new p(e,3,!1,e.toLowerCase(),null,!1,!1)
            }),
            ["checked", "multiple", "muted", "selected"].forEach(function(e) {
                g[e] = new p(e,3,!0,e,null,!1,!1)
            }),
            ["capture", "download"].forEach(function(e) {
                g[e] = new p(e,4,!1,e,null,!1,!1)
            }),
            ["cols", "rows", "size", "span"].forEach(function(e) {
                g[e] = new p(e,6,!1,e,null,!1,!1)
            }),
            ["rowSpan", "start"].forEach(function(e) {
                g[e] = new p(e,5,!1,e.toLowerCase(),null,!1,!1)
            });
            var y = /[\-:]([a-z])/g;
            function b(e) {
                return e[1].toUpperCase()
            }
            function v(e, t, n, r) {
                var a = g.hasOwnProperty(t) ? g[t] : null;
                (null !== a ? 0 !== a.type : r || !(2 < t.length) || "o" !== t[0] && "O" !== t[0] || "n" !== t[1] && "N" !== t[1]) && (function(e, t, n, r) {
                    if (null == t || function(e, t, n, r) {
                        if (null !== n && 0 === n.type)
                            return !1;
                        switch (typeof t) {
                        case "function":
                        case "symbol":
                            return !0;
                        case "boolean":
                            return !r && (null !== n ? !n.acceptsBooleans : "data-" !== (e = e.toLowerCase().slice(0, 5)) && "aria-" !== e);
                        default:
                            return !1
                        }
                    }(e, t, n, r))
                        return !0;
                    if (r)
                        return !1;
                    if (null !== n)
                        switch (n.type) {
                        case 3:
                            return !t;
                        case 4:
                            return !1 === t;
                        case 5:
                            return isNaN(t);
                        case 6:
                            return isNaN(t) || 1 > t
                        }
                    return !1
                }(t, n, a, r) && (n = null),
                r || null === a ? function(e) {
                    return !!d.call(h, e) || !d.call(f, e) && (m.test(e) ? h[e] = !0 : (f[e] = !0,
                    !1))
                }(t) && (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : a.mustUseProperty ? e[a.propertyName] = null === n ? 3 !== a.type && "" : n : (t = a.attributeName,
                r = a.attributeNamespace,
                null === n ? e.removeAttribute(t) : (n = 3 === (a = a.type) || 4 === a && !0 === n ? "" : "" + n,
                r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
            }
            "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
                var t = e.replace(y, b);
                g[t] = new p(t,1,!1,e,null,!1,!1)
            }),
            "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
                var t = e.replace(y, b);
                g[t] = new p(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)
            }),
            ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
                var t = e.replace(y, b);
                g[t] = new p(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)
            }),
            ["tabIndex", "crossOrigin"].forEach(function(e) {
                g[e] = new p(e,1,!1,e.toLowerCase(),null,!1,!1)
            }),
            g.xlinkHref = new p("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),
            ["src", "href", "action", "formAction"].forEach(function(e) {
                g[e] = new p(e,1,!1,e.toLowerCase(),null,!0,!0)
            });
            var w = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
              , x = Symbol.for("react.element")
              , _ = Symbol.for("react.portal")
              , N = Symbol.for("react.fragment")
              , k = Symbol.for("react.strict_mode")
              , S = Symbol.for("react.profiler")
              , E = Symbol.for("react.provider")
              , P = Symbol.for("react.context")
              , C = Symbol.for("react.forward_ref")
              , T = Symbol.for("react.suspense")
              , M = Symbol.for("react.suspense_list")
              , A = Symbol.for("react.memo")
              , R = Symbol.for("react.lazy");
            Symbol.for("react.scope"),
            Symbol.for("react.debug_trace_mode");
            var D = Symbol.for("react.offscreen");
            Symbol.for("react.legacy_hidden"),
            Symbol.for("react.cache"),
            Symbol.for("react.tracing_marker");
            var L = Symbol.iterator;
            function O(e) {
                return null === e || "object" != typeof e ? null : "function" == typeof (e = L && e[L] || e["@@iterator"]) ? e : null
            }
            var j, z = Object.assign;
            function V(e) {
                if (void 0 === j)
                    try {
                        throw Error()
                    } catch (e) {
                        var t = e.stack.trim().match(/\n( *(at )?)/);
                        j = t && t[1] || ""
                    }
                return "\n" + j + e
            }
            var F = !1;
            function I(e, t) {
                if (!e || F)
                    return "";
                F = !0;
                var n = Error.prepareStackTrace;
                Error.prepareStackTrace = void 0;
                try {
                    if (t)
                        if (t = function() {
                            throw Error()
                        }
                        ,
                        Object.defineProperty(t.prototype, "props", {
                            set: function() {
                                throw Error()
                            }
                        }),
                        "object" == typeof Reflect && Reflect.construct) {
                            try {
                                Reflect.construct(t, [])
                            } catch (e) {
                                var r = e
                            }
                            Reflect.construct(e, [], t)
                        } else {
                            try {
                                t.call()
                            } catch (e) {
                                r = e
                            }
                            e.call(t.prototype)
                        }
                    else {
                        try {
                            throw Error()
                        } catch (e) {
                            r = e
                        }
                        e()
                    }
                } catch (t) {
                    if (t && r && "string" == typeof t.stack) {
                        for (var a = t.stack.split("\n"), i = r.stack.split("\n"), o = a.length - 1, s = i.length - 1; 1 <= o && 0 <= s && a[o] !== i[s]; )
                            s--;
                        for (; 1 <= o && 0 <= s; o--,
                        s--)
                            if (a[o] !== i[s]) {
                                if (1 !== o || 1 !== s)
                                    do {
                                        if (o--,
                                        0 > --s || a[o] !== i[s]) {
                                            var l = "\n" + a[o].replace(" at new ", " at ");
                                            return e.displayName && l.includes("<anonymous>") && (l = l.replace("<anonymous>", e.displayName)),
                                            l
                                        }
                                    } while (1 <= o && 0 <= s);
                                break
                            }
                    }
                } finally {
                    F = !1,
                    Error.prepareStackTrace = n
                }
                return (e = e ? e.displayName || e.name : "") ? V(e) : ""
            }
            function U(e) {
                switch (e.tag) {
                case 5:
                    return V(e.type);
                case 16:
                    return V("Lazy");
                case 13:
                    return V("Suspense");
                case 19:
                    return V("SuspenseList");
                case 0:
                case 2:
                case 15:
                    return I(e.type, !1);
                case 11:
                    return I(e.type.render, !1);
                case 1:
                    return I(e.type, !0);
                default:
                    return ""
                }
            }
            function B(e) {
                if (null == e)
                    return null;
                if ("function" == typeof e)
                    return e.displayName || e.name || null;
                if ("string" == typeof e)
                    return e;
                switch (e) {
                case N:
                    return "Fragment";
                case _:
                    return "Portal";
                case S:
                    return "Profiler";
                case k:
                    return "StrictMode";
                case T:
                    return "Suspense";
                case M:
                    return "SuspenseList"
                }
                if ("object" == typeof e)
                    switch (e.$$typeof) {
                    case P:
                        return (e.displayName || "Context") + ".Consumer";
                    case E:
                        return (e._context.displayName || "Context") + ".Provider";
                    case C:
                        var t = e.render;
                        return (e = e.displayName) || (e = "" !== (e = t.displayName || t.name || "") ? "ForwardRef(" + e + ")" : "ForwardRef"),
                        e;
                    case A:
                        return null !== (t = e.displayName || null) ? t : B(e.type) || "Memo";
                    case R:
                        t = e._payload,
                        e = e._init;
                        try {
                            return B(e(t))
                        } catch (e) {}
                    }
                return null
            }
            function $(e) {
                var t = e.type;
                switch (e.tag) {
                case 24:
                    return "Cache";
                case 9:
                    return (t.displayName || "Context") + ".Consumer";
                case 10:
                    return (t._context.displayName || "Context") + ".Provider";
                case 18:
                    return "DehydratedFragment";
                case 11:
                    return e = (e = t.render).displayName || e.name || "",
                    t.displayName || ("" !== e ? "ForwardRef(" + e + ")" : "ForwardRef");
                case 7:
                    return "Fragment";
                case 5:
                    return t;
                case 4:
                    return "Portal";
                case 3:
                    return "Root";
                case 6:
                    return "Text";
                case 16:
                    return B(t);
                case 8:
                    return t === k ? "StrictMode" : "Mode";
                case 22:
                    return "Offscreen";
                case 12:
                    return "Profiler";
                case 21:
                    return "Scope";
                case 13:
                    return "Suspense";
                case 19:
                    return "SuspenseList";
                case 25:
                    return "TracingMarker";
                case 1:
                case 0:
                case 17:
                case 2:
                case 14:
                case 15:
                    if ("function" == typeof t)
                        return t.displayName || t.name || null;
                    if ("string" == typeof t)
                        return t
                }
                return null
            }
            function W(e) {
                switch (typeof e) {
                case "boolean":
                case "number":
                case "string":
                case "undefined":
                case "object":
                    return e;
                default:
                    return ""
                }
            }
            function H(e) {
                var t = e.type;
                return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t)
            }
            function Y(e) {
                e._valueTracker || (e._valueTracker = function(e) {
                    var t = H(e) ? "checked" : "value"
                      , n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t)
                      , r = "" + e[t];
                    if (!e.hasOwnProperty(t) && void 0 !== n && "function" == typeof n.get && "function" == typeof n.set) {
                        var a = n.get
                          , i = n.set;
                        return Object.defineProperty(e, t, {
                            configurable: !0,
                            get: function() {
                                return a.call(this)
                            },
                            set: function(e) {
                                r = "" + e,
                                i.call(this, e)
                            }
                        }),
                        Object.defineProperty(e, t, {
                            enumerable: n.enumerable
                        }),
                        {
                            getValue: function() {
                                return r
                            },
                            setValue: function(e) {
                                r = "" + e
                            },
                            stopTracking: function() {
                                e._valueTracker = null,
                                delete e[t]
                            }
                        }
                    }
                }(e))
            }
            function K(e) {
                if (!e)
                    return !1;
                var t = e._valueTracker;
                if (!t)
                    return !0;
                var n = t.getValue()
                  , r = "";
                return e && (r = H(e) ? e.checked ? "true" : "false" : e.value),
                (e = r) !== n && (t.setValue(e),
                !0)
            }
            function Q(e) {
                if (void 0 === (e = e || ("undefined" != typeof document ? document : void 0)))
                    return null;
                try {
                    return e.activeElement || e.body
                } catch (t) {
                    return e.body
                }
            }
            function q(e, t) {
                var n = t.checked;
                return z({}, t, {
                    defaultChecked: void 0,
                    defaultValue: void 0,
                    value: void 0,
                    checked: null != n ? n : e._wrapperState.initialChecked
                })
            }
            function X(e, t) {
                var n = null == t.defaultValue ? "" : t.defaultValue
                  , r = null != t.checked ? t.checked : t.defaultChecked;
                n = W(null != t.value ? t.value : n),
                e._wrapperState = {
                    initialChecked: r,
                    initialValue: n,
                    controlled: "checkbox" === t.type || "radio" === t.type ? null != t.checked : null != t.value
                }
            }
            function G(e, t) {
                null != (t = t.checked) && v(e, "checked", t, !1)
            }
            function Z(e, t) {
                G(e, t);
                var n = W(t.value)
                  , r = t.type;
                if (null != n)
                    "number" === r ? (0 === n && "" === e.value || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
                else if ("submit" === r || "reset" === r)
                    return void e.removeAttribute("value");
                t.hasOwnProperty("value") ? ee(e, t.type, n) : t.hasOwnProperty("defaultValue") && ee(e, t.type, W(t.defaultValue)),
                null == t.checked && null != t.defaultChecked && (e.defaultChecked = !!t.defaultChecked)
            }
            function J(e, t, n) {
                if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
                    var r = t.type;
                    if (!("submit" !== r && "reset" !== r || void 0 !== t.value && null !== t.value))
                        return;
                    t = "" + e._wrapperState.initialValue,
                    n || t === e.value || (e.value = t),
                    e.defaultValue = t
                }
                "" !== (n = e.name) && (e.name = ""),
                e.defaultChecked = !!e._wrapperState.initialChecked,
                "" !== n && (e.name = n)
            }
            function ee(e, t, n) {
                "number" === t && Q(e.ownerDocument) === e || (null == n ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n))
            }
            var te = Array.isArray;
            function ne(e, t, n, r) {
                if (e = e.options,
                t) {
                    t = {};
                    for (var a = 0; a < n.length; a++)
                        t["$" + n[a]] = !0;
                    for (n = 0; n < e.length; n++)
                        a = t.hasOwnProperty("$" + e[n].value),
                        e[n].selected !== a && (e[n].selected = a),
                        a && r && (e[n].defaultSelected = !0)
                } else {
                    for (n = "" + W(n),
                    t = null,
                    a = 0; a < e.length; a++) {
                        if (e[a].value === n)
                            return e[a].selected = !0,
                            void (r && (e[a].defaultSelected = !0));
                        null !== t || e[a].disabled || (t = e[a])
                    }
                    null !== t && (t.selected = !0)
                }
            }
            function re(e, t) {
                if (null != t.dangerouslySetInnerHTML)
                    throw Error(i(91));
                return z({}, t, {
                    value: void 0,
                    defaultValue: void 0,
                    children: "" + e._wrapperState.initialValue
                })
            }
            function ae(e, t) {
                var n = t.value;
                if (null == n) {
                    if (n = t.children,
                    t = t.defaultValue,
                    null != n) {
                        if (null != t)
                            throw Error(i(92));
                        if (te(n)) {
                            if (1 < n.length)
                                throw Error(i(93));
                            n = n[0]
                        }
                        t = n
                    }
                    null == t && (t = ""),
                    n = t
                }
                e._wrapperState = {
                    initialValue: W(n)
                }
            }
            function ie(e, t) {
                var n = W(t.value)
                  , r = W(t.defaultValue);
                null != n && ((n = "" + n) !== e.value && (e.value = n),
                null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)),
                null != r && (e.defaultValue = "" + r)
            }
            function oe(e) {
                var t = e.textContent;
                t === e._wrapperState.initialValue && "" !== t && null !== t && (e.value = t)
            }
            function se(e) {
                switch (e) {
                case "svg":
                    return "http://www.w3.org/2000/svg";
                case "math":
                    return "http://www.w3.org/1998/Math/MathML";
                default:
                    return "http://www.w3.org/1999/xhtml"
                }
            }
            function le(e, t) {
                return null == e || "http://www.w3.org/1999/xhtml" === e ? se(t) : "http://www.w3.org/2000/svg" === e && "foreignObject" === t ? "http://www.w3.org/1999/xhtml" : e
            }
            var ue, ce, de = (ce = function(e, t) {
                if ("http://www.w3.org/2000/svg" !== e.namespaceURI || "innerHTML"in e)
                    e.innerHTML = t;
                else {
                    for ((ue = ue || document.createElement("div")).innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
                    t = ue.firstChild; e.firstChild; )
                        e.removeChild(e.firstChild);
                    for (; t.firstChild; )
                        e.appendChild(t.firstChild)
                }
            }
            ,
            "undefined" != typeof MSApp && MSApp.execUnsafeLocalFunction ? function(e, t, n, r) {
                MSApp.execUnsafeLocalFunction(function() {
                    return ce(e, t)
                })
            }
            : ce);
            function me(e, t) {
                if (t) {
                    var n = e.firstChild;
                    if (n && n === e.lastChild && 3 === n.nodeType)
                        return void (n.nodeValue = t)
                }
                e.textContent = t
            }
            var fe = {
                animationIterationCount: !0,
                aspectRatio: !0,
                borderImageOutset: !0,
                borderImageSlice: !0,
                borderImageWidth: !0,
                boxFlex: !0,
                boxFlexGroup: !0,
                boxOrdinalGroup: !0,
                columnCount: !0,
                columns: !0,
                flex: !0,
                flexGrow: !0,
                flexPositive: !0,
                flexShrink: !0,
                flexNegative: !0,
                flexOrder: !0,
                gridArea: !0,
                gridRow: !0,
                gridRowEnd: !0,
                gridRowSpan: !0,
                gridRowStart: !0,
                gridColumn: !0,
                gridColumnEnd: !0,
                gridColumnSpan: !0,
                gridColumnStart: !0,
                fontWeight: !0,
                lineClamp: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                tabSize: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0,
                fillOpacity: !0,
                floodOpacity: !0,
                stopOpacity: !0,
                strokeDasharray: !0,
                strokeDashoffset: !0,
                strokeMiterlimit: !0,
                strokeOpacity: !0,
                strokeWidth: !0
            }
              , he = ["Webkit", "ms", "Moz", "O"];
            function pe(e, t, n) {
                return null == t || "boolean" == typeof t || "" === t ? "" : n || "number" != typeof t || 0 === t || fe.hasOwnProperty(e) && fe[e] ? ("" + t).trim() : t + "px"
            }
            function ge(e, t) {
                for (var n in e = e.style,
                t)
                    if (t.hasOwnProperty(n)) {
                        var r = 0 === n.indexOf("--")
                          , a = pe(n, t[n], r);
                        "float" === n && (n = "cssFloat"),
                        r ? e.setProperty(n, a) : e[n] = a
                    }
            }
            Object.keys(fe).forEach(function(e) {
                he.forEach(function(t) {
                    t = t + e.charAt(0).toUpperCase() + e.substring(1),
                    fe[t] = fe[e]
                })
            });
            var ye = z({
                menuitem: !0
            }, {
                area: !0,
                base: !0,
                br: !0,
                col: !0,
                embed: !0,
                hr: !0,
                img: !0,
                input: !0,
                keygen: !0,
                link: !0,
                meta: !0,
                param: !0,
                source: !0,
                track: !0,
                wbr: !0
            });
            function be(e, t) {
                if (t) {
                    if (ye[e] && (null != t.children || null != t.dangerouslySetInnerHTML))
                        throw Error(i(137, e));
                    if (null != t.dangerouslySetInnerHTML) {
                        if (null != t.children)
                            throw Error(i(60));
                        if ("object" != typeof t.dangerouslySetInnerHTML || !("__html"in t.dangerouslySetInnerHTML))
                            throw Error(i(61))
                    }
                    if (null != t.style && "object" != typeof t.style)
                        throw Error(i(62))
                }
            }
            function ve(e, t) {
                if (-1 === e.indexOf("-"))
                    return "string" == typeof t.is;
                switch (e) {
                case "annotation-xml":
                case "color-profile":
                case "font-face":
                case "font-face-src":
                case "font-face-uri":
                case "font-face-format":
                case "font-face-name":
                case "missing-glyph":
                    return !1;
                default:
                    return !0
                }
            }
            var we = null;
            function xe(e) {
                return (e = e.target || e.srcElement || window).correspondingUseElement && (e = e.correspondingUseElement),
                3 === e.nodeType ? e.parentNode : e
            }
            var _e = null
              , Ne = null
              , ke = null;
            function Se(e) {
                if (e = va(e)) {
                    if ("function" != typeof _e)
                        throw Error(i(280));
                    var t = e.stateNode;
                    t && (t = xa(t),
                    _e(e.stateNode, e.type, t))
                }
            }
            function Ee(e) {
                Ne ? ke ? ke.push(e) : ke = [e] : Ne = e
            }
            function Pe() {
                if (Ne) {
                    var e = Ne
                      , t = ke;
                    if (ke = Ne = null,
                    Se(e),
                    t)
                        for (e = 0; e < t.length; e++)
                            Se(t[e])
                }
            }
            function Ce(e, t) {
                return e(t)
            }
            function Te() {}
            var Me = !1;
            function Ae(e, t, n) {
                if (Me)
                    return e(t, n);
                Me = !0;
                try {
                    return Ce(e, t, n)
                } finally {
                    Me = !1,
                    (null !== Ne || null !== ke) && (Te(),
                    Pe())
                }
            }
            function Re(e, t) {
                var n = e.stateNode;
                if (null === n)
                    return null;
                var r = xa(n);
                if (null === r)
                    return null;
                n = r[t];
                e: switch (t) {
                case "onClick":
                case "onClickCapture":
                case "onDoubleClick":
                case "onDoubleClickCapture":
                case "onMouseDown":
                case "onMouseDownCapture":
                case "onMouseMove":
                case "onMouseMoveCapture":
                case "onMouseUp":
                case "onMouseUpCapture":
                case "onMouseEnter":
                    (r = !r.disabled) || (r = !("button" === (e = e.type) || "input" === e || "select" === e || "textarea" === e)),
                    e = !r;
                    break e;
                default:
                    e = !1
                }
                if (e)
                    return null;
                if (n && "function" != typeof n)
                    throw Error(i(231, t, typeof n));
                return n
            }
            var De = !1;
            if (c)
                try {
                    var Le = {};
                    Object.defineProperty(Le, "passive", {
                        get: function() {
                            De = !0
                        }
                    }),
                    window.addEventListener("test", Le, Le),
                    window.removeEventListener("test", Le, Le)
                } catch (ce) {
                    De = !1
                }
            function Oe(e, t, n, r, a, i, o, s, l) {
                var u = Array.prototype.slice.call(arguments, 3);
                try {
                    t.apply(n, u)
                } catch (e) {
                    this.onError(e)
                }
            }
            var je = !1
              , ze = null
              , Ve = !1
              , Fe = null
              , Ie = {
                onError: function(e) {
                    je = !0,
                    ze = e
                }
            };
            function Ue(e, t, n, r, a, i, o, s, l) {
                je = !1,
                ze = null,
                Oe.apply(Ie, arguments)
            }
            function Be(e) {
                var t = e
                  , n = e;
                if (e.alternate)
                    for (; t.return; )
                        t = t.return;
                else {
                    e = t;
                    do {
                        !!(4098 & (t = e).flags) && (n = t.return),
                        e = t.return
                    } while (e)
                }
                return 3 === t.tag ? n : null
            }
            function $e(e) {
                if (13 === e.tag) {
                    var t = e.memoizedState;
                    if (null === t && null !== (e = e.alternate) && (t = e.memoizedState),
                    null !== t)
                        return t.dehydrated
                }
                return null
            }
            function We(e) {
                if (Be(e) !== e)
                    throw Error(i(188))
            }
            function He(e) {
                return null !== (e = function(e) {
                    var t = e.alternate;
                    if (!t) {
                        if (null === (t = Be(e)))
                            throw Error(i(188));
                        return t !== e ? null : e
                    }
                    for (var n = e, r = t; ; ) {
                        var a = n.return;
                        if (null === a)
                            break;
                        var o = a.alternate;
                        if (null === o) {
                            if (null !== (r = a.return)) {
                                n = r;
                                continue
                            }
                            break
                        }
                        if (a.child === o.child) {
                            for (o = a.child; o; ) {
                                if (o === n)
                                    return We(a),
                                    e;
                                if (o === r)
                                    return We(a),
                                    t;
                                o = o.sibling
                            }
                            throw Error(i(188))
                        }
                        if (n.return !== r.return)
                            n = a,
                            r = o;
                        else {
                            for (var s = !1, l = a.child; l; ) {
                                if (l === n) {
                                    s = !0,
                                    n = a,
                                    r = o;
                                    break
                                }
                                if (l === r) {
                                    s = !0,
                                    r = a,
                                    n = o;
                                    break
                                }
                                l = l.sibling
                            }
                            if (!s) {
                                for (l = o.child; l; ) {
                                    if (l === n) {
                                        s = !0,
                                        n = o,
                                        r = a;
                                        break
                                    }
                                    if (l === r) {
                                        s = !0,
                                        r = o,
                                        n = a;
                                        break
                                    }
                                    l = l.sibling
                                }
                                if (!s)
                                    throw Error(i(189))
                            }
                        }
                        if (n.alternate !== r)
                            throw Error(i(190))
                    }
                    if (3 !== n.tag)
                        throw Error(i(188));
                    return n.stateNode.current === n ? e : t
                }(e)) ? Ye(e) : null
            }
            function Ye(e) {
                if (5 === e.tag || 6 === e.tag)
                    return e;
                for (e = e.child; null !== e; ) {
                    var t = Ye(e);
                    if (null !== t)
                        return t;
                    e = e.sibling
                }
                return null
            }
            var Ke = a.unstable_scheduleCallback
              , Qe = a.unstable_cancelCallback
              , qe = a.unstable_shouldYield
              , Xe = a.unstable_requestPaint
              , Ge = a.unstable_now
              , Ze = a.unstable_getCurrentPriorityLevel
              , Je = a.unstable_ImmediatePriority
              , et = a.unstable_UserBlockingPriority
              , tt = a.unstable_NormalPriority
              , nt = a.unstable_LowPriority
              , rt = a.unstable_IdlePriority
              , at = null
              , it = null
              , ot = Math.clz32 ? Math.clz32 : function(e) {
                return 0 === (e >>>= 0) ? 32 : 31 - (st(e) / lt | 0) | 0
            }
              , st = Math.log
              , lt = Math.LN2
              , ut = 64
              , ct = 4194304;
            function dt(e) {
                switch (e & -e) {
                case 1:
                    return 1;
                case 2:
                    return 2;
                case 4:
                    return 4;
                case 8:
                    return 8;
                case 16:
                    return 16;
                case 32:
                    return 32;
                case 64:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                    return 4194240 & e;
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                case 67108864:
                    return 130023424 & e;
                case 134217728:
                    return 134217728;
                case 268435456:
                    return 268435456;
                case 536870912:
                    return 536870912;
                case 1073741824:
                    return 1073741824;
                default:
                    return e
                }
            }
            function mt(e, t) {
                var n = e.pendingLanes;
                if (0 === n)
                    return 0;
                var r = 0
                  , a = e.suspendedLanes
                  , i = e.pingedLanes
                  , o = 268435455 & n;
                if (0 !== o) {
                    var s = o & ~a;
                    0 !== s ? r = dt(s) : 0 !== (i &= o) && (r = dt(i))
                } else
                    0 !== (o = n & ~a) ? r = dt(o) : 0 !== i && (r = dt(i));
                if (0 === r)
                    return 0;
                if (0 !== t && t !== r && 0 === (t & a) && ((a = r & -r) >= (i = t & -t) || 16 === a && 4194240 & i))
                    return t;
                if (4 & r && (r |= 16 & n),
                0 !== (t = e.entangledLanes))
                    for (e = e.entanglements,
                    t &= r; 0 < t; )
                        a = 1 << (n = 31 - ot(t)),
                        r |= e[n],
                        t &= ~a;
                return r
            }
            function ft(e, t) {
                switch (e) {
                case 1:
                case 2:
                case 4:
                    return t + 250;
                case 8:
                case 16:
                case 32:
                case 64:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                    return t + 5e3;
                default:
                    return -1
                }
            }
            function ht(e) {
                return 0 != (e = -1073741825 & e.pendingLanes) ? e : 1073741824 & e ? 1073741824 : 0
            }
            function pt() {
                var e = ut;
                return !(4194240 & (ut <<= 1)) && (ut = 64),
                e
            }
            function gt(e) {
                for (var t = [], n = 0; 31 > n; n++)
                    t.push(e);
                return t
            }
            function yt(e, t, n) {
                e.pendingLanes |= t,
                536870912 !== t && (e.suspendedLanes = 0,
                e.pingedLanes = 0),
                (e = e.eventTimes)[t = 31 - ot(t)] = n
            }
            function bt(e, t) {
                var n = e.entangledLanes |= t;
                for (e = e.entanglements; n; ) {
                    var r = 31 - ot(n)
                      , a = 1 << r;
                    a & t | e[r] & t && (e[r] |= t),
                    n &= ~a
                }
            }
            var vt = 0;
            function wt(e) {
                return 1 < (e &= -e) ? 4 < e ? 268435455 & e ? 16 : 536870912 : 4 : 1
            }
            var xt, _t, Nt, kt, St, Et = !1, Pt = [], Ct = null, Tt = null, Mt = null, At = new Map, Rt = new Map, Dt = [], Lt = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
            function Ot(e, t) {
                switch (e) {
                case "focusin":
                case "focusout":
                    Ct = null;
                    break;
                case "dragenter":
                case "dragleave":
                    Tt = null;
                    break;
                case "mouseover":
                case "mouseout":
                    Mt = null;
                    break;
                case "pointerover":
                case "pointerout":
                    At.delete(t.pointerId);
                    break;
                case "gotpointercapture":
                case "lostpointercapture":
                    Rt.delete(t.pointerId)
                }
            }
            function jt(e, t, n, r, a, i) {
                return null === e || e.nativeEvent !== i ? (e = {
                    blockedOn: t,
                    domEventName: n,
                    eventSystemFlags: r,
                    nativeEvent: i,
                    targetContainers: [a]
                },
                null !== t && null !== (t = va(t)) && _t(t),
                e) : (e.eventSystemFlags |= r,
                t = e.targetContainers,
                null !== a && -1 === t.indexOf(a) && t.push(a),
                e)
            }
            function zt(e) {
                var t = ba(e.target);
                if (null !== t) {
                    var n = Be(t);
                    if (null !== n)
                        if (13 === (t = n.tag)) {
                            if (null !== (t = $e(n)))
                                return e.blockedOn = t,
                                void St(e.priority, function() {
                                    Nt(n)
                                })
                        } else if (3 === t && n.stateNode.current.memoizedState.isDehydrated)
                            return void (e.blockedOn = 3 === n.tag ? n.stateNode.containerInfo : null)
                }
                e.blockedOn = null
            }
            function Vt(e) {
                if (null !== e.blockedOn)
                    return !1;
                for (var t = e.targetContainers; 0 < t.length; ) {
                    var n = qt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
                    if (null !== n)
                        return null !== (t = va(n)) && _t(t),
                        e.blockedOn = n,
                        !1;
                    var r = new (n = e.nativeEvent).constructor(n.type,n);
                    we = r,
                    n.target.dispatchEvent(r),
                    we = null,
                    t.shift()
                }
                return !0
            }
            function Ft(e, t, n) {
                Vt(e) && n.delete(t)
            }
            function It() {
                Et = !1,
                null !== Ct && Vt(Ct) && (Ct = null),
                null !== Tt && Vt(Tt) && (Tt = null),
                null !== Mt && Vt(Mt) && (Mt = null),
                At.forEach(Ft),
                Rt.forEach(Ft)
            }
            function Ut(e, t) {
                e.blockedOn === t && (e.blockedOn = null,
                Et || (Et = !0,
                a.unstable_scheduleCallback(a.unstable_NormalPriority, It)))
            }
            function Bt(e) {
                function t(t) {
                    return Ut(t, e)
                }
                if (0 < Pt.length) {
                    Ut(Pt[0], e);
                    for (var n = 1; n < Pt.length; n++) {
                        var r = Pt[n];
                        r.blockedOn === e && (r.blockedOn = null)
                    }
                }
                for (null !== Ct && Ut(Ct, e),
                null !== Tt && Ut(Tt, e),
                null !== Mt && Ut(Mt, e),
                At.forEach(t),
                Rt.forEach(t),
                n = 0; n < Dt.length; n++)
                    (r = Dt[n]).blockedOn === e && (r.blockedOn = null);
                for (; 0 < Dt.length && null === (n = Dt[0]).blockedOn; )
                    zt(n),
                    null === n.blockedOn && Dt.shift()
            }
            var $t = w.ReactCurrentBatchConfig
              , Wt = !0;
            function Ht(e, t, n, r) {
                var a = vt
                  , i = $t.transition;
                $t.transition = null;
                try {
                    vt = 1,
                    Kt(e, t, n, r)
                } finally {
                    vt = a,
                    $t.transition = i
                }
            }
            function Yt(e, t, n, r) {
                var a = vt
                  , i = $t.transition;
                $t.transition = null;
                try {
                    vt = 4,
                    Kt(e, t, n, r)
                } finally {
                    vt = a,
                    $t.transition = i
                }
            }
            function Kt(e, t, n, r) {
                if (Wt) {
                    var a = qt(e, t, n, r);
                    if (null === a)
                        Wr(e, t, r, Qt, n),
                        Ot(e, r);
                    else if (function(e, t, n, r, a) {
                        switch (t) {
                        case "focusin":
                            return Ct = jt(Ct, e, t, n, r, a),
                            !0;
                        case "dragenter":
                            return Tt = jt(Tt, e, t, n, r, a),
                            !0;
                        case "mouseover":
                            return Mt = jt(Mt, e, t, n, r, a),
                            !0;
                        case "pointerover":
                            var i = a.pointerId;
                            return At.set(i, jt(At.get(i) || null, e, t, n, r, a)),
                            !0;
                        case "gotpointercapture":
                            return i = a.pointerId,
                            Rt.set(i, jt(Rt.get(i) || null, e, t, n, r, a)),
                            !0
                        }
                        return !1
                    }(a, e, t, n, r))
                        r.stopPropagation();
                    else if (Ot(e, r),
                    4 & t && -1 < Lt.indexOf(e)) {
                        for (; null !== a; ) {
                            var i = va(a);
                            if (null !== i && xt(i),
                            null === (i = qt(e, t, n, r)) && Wr(e, t, r, Qt, n),
                            i === a)
                                break;
                            a = i
                        }
                        null !== a && r.stopPropagation()
                    } else
                        Wr(e, t, r, null, n)
                }
            }
            var Qt = null;
            function qt(e, t, n, r) {
                if (Qt = null,
                null !== (e = ba(e = xe(r))))
                    if (null === (t = Be(e)))
                        e = null;
                    else if (13 === (n = t.tag)) {
                        if (null !== (e = $e(t)))
                            return e;
                        e = null
                    } else if (3 === n) {
                        if (t.stateNode.current.memoizedState.isDehydrated)
                            return 3 === t.tag ? t.stateNode.containerInfo : null;
                        e = null
                    } else
                        t !== e && (e = null);
                return Qt = e,
                null
            }
            function Xt(e) {
                switch (e) {
                case "cancel":
                case "click":
                case "close":
                case "contextmenu":
                case "copy":
                case "cut":
                case "auxclick":
                case "dblclick":
                case "dragend":
                case "dragstart":
                case "drop":
                case "focusin":
                case "focusout":
                case "input":
                case "invalid":
                case "keydown":
                case "keypress":
                case "keyup":
                case "mousedown":
                case "mouseup":
                case "paste":
                case "pause":
                case "play":
                case "pointercancel":
                case "pointerdown":
                case "pointerup":
                case "ratechange":
                case "reset":
                case "resize":
                case "seeked":
                case "submit":
                case "touchcancel":
                case "touchend":
                case "touchstart":
                case "volumechange":
                case "change":
                case "selectionchange":
                case "textInput":
                case "compositionstart":
                case "compositionend":
                case "compositionupdate":
                case "beforeblur":
                case "afterblur":
                case "beforeinput":
                case "blur":
                case "fullscreenchange":
                case "focus":
                case "hashchange":
                case "popstate":
                case "select":
                case "selectstart":
                    return 1;
                case "drag":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "mousemove":
                case "mouseout":
                case "mouseover":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "scroll":
                case "toggle":
                case "touchmove":
                case "wheel":
                case "mouseenter":
                case "mouseleave":
                case "pointerenter":
                case "pointerleave":
                    return 4;
                case "message":
                    switch (Ze()) {
                    case Je:
                        return 1;
                    case et:
                        return 4;
                    case tt:
                    case nt:
                        return 16;
                    case rt:
                        return 536870912;
                    default:
                        return 16
                    }
                default:
                    return 16
                }
            }
            var Gt = null
              , Zt = null
              , Jt = null;
            function en() {
                if (Jt)
                    return Jt;
                var e, t, n = Zt, r = n.length, a = "value"in Gt ? Gt.value : Gt.textContent, i = a.length;
                for (e = 0; e < r && n[e] === a[e]; e++)
                    ;
                var o = r - e;
                for (t = 1; t <= o && n[r - t] === a[i - t]; t++)
                    ;
                return Jt = a.slice(e, 1 < t ? 1 - t : void 0)
            }
            function tn(e) {
                var t = e.keyCode;
                return "charCode"in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : e = t,
                10 === e && (e = 13),
                32 <= e || 13 === e ? e : 0
            }
            function nn() {
                return !0
            }
            function rn() {
                return !1
            }
            function an(e) {
                function t(t, n, r, a, i) {
                    for (var o in this._reactName = t,
                    this._targetInst = r,
                    this.type = n,
                    this.nativeEvent = a,
                    this.target = i,
                    this.currentTarget = null,
                    e)
                        e.hasOwnProperty(o) && (t = e[o],
                        this[o] = t ? t(a) : a[o]);
                    return this.isDefaultPrevented = (null != a.defaultPrevented ? a.defaultPrevented : !1 === a.returnValue) ? nn : rn,
                    this.isPropagationStopped = rn,
                    this
                }
                return z(t.prototype, {
                    preventDefault: function() {
                        this.defaultPrevented = !0;
                        var e = this.nativeEvent;
                        e && (e.preventDefault ? e.preventDefault() : "unknown" != typeof e.returnValue && (e.returnValue = !1),
                        this.isDefaultPrevented = nn)
                    },
                    stopPropagation: function() {
                        var e = this.nativeEvent;
                        e && (e.stopPropagation ? e.stopPropagation() : "unknown" != typeof e.cancelBubble && (e.cancelBubble = !0),
                        this.isPropagationStopped = nn)
                    },
                    persist: function() {},
                    isPersistent: nn
                }),
                t
            }
            var on, sn, ln, un = {
                eventPhase: 0,
                bubbles: 0,
                cancelable: 0,
                timeStamp: function(e) {
                    return e.timeStamp || Date.now()
                },
                defaultPrevented: 0,
                isTrusted: 0
            }, cn = an(un), dn = z({}, un, {
                view: 0,
                detail: 0
            }), mn = an(dn), fn = z({}, dn, {
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                pageX: 0,
                pageY: 0,
                ctrlKey: 0,
                shiftKey: 0,
                altKey: 0,
                metaKey: 0,
                getModifierState: Sn,
                button: 0,
                buttons: 0,
                relatedTarget: function(e) {
                    return void 0 === e.relatedTarget ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget
                },
                movementX: function(e) {
                    return "movementX"in e ? e.movementX : (e !== ln && (ln && "mousemove" === e.type ? (on = e.screenX - ln.screenX,
                    sn = e.screenY - ln.screenY) : sn = on = 0,
                    ln = e),
                    on)
                },
                movementY: function(e) {
                    return "movementY"in e ? e.movementY : sn
                }
            }), hn = an(fn), pn = an(z({}, fn, {
                dataTransfer: 0
            })), gn = an(z({}, dn, {
                relatedTarget: 0
            })), yn = an(z({}, un, {
                animationName: 0,
                elapsedTime: 0,
                pseudoElement: 0
            })), bn = z({}, un, {
                clipboardData: function(e) {
                    return "clipboardData"in e ? e.clipboardData : window.clipboardData
                }
            }), vn = an(bn), wn = an(z({}, un, {
                data: 0
            })), xn = {
                Esc: "Escape",
                Spacebar: " ",
                Left: "ArrowLeft",
                Up: "ArrowUp",
                Right: "ArrowRight",
                Down: "ArrowDown",
                Del: "Delete",
                Win: "OS",
                Menu: "ContextMenu",
                Apps: "ContextMenu",
                Scroll: "ScrollLock",
                MozPrintableKey: "Unidentified"
            }, _n = {
                8: "Backspace",
                9: "Tab",
                12: "Clear",
                13: "Enter",
                16: "Shift",
                17: "Control",
                18: "Alt",
                19: "Pause",
                20: "CapsLock",
                27: "Escape",
                32: " ",
                33: "PageUp",
                34: "PageDown",
                35: "End",
                36: "Home",
                37: "ArrowLeft",
                38: "ArrowUp",
                39: "ArrowRight",
                40: "ArrowDown",
                45: "Insert",
                46: "Delete",
                112: "F1",
                113: "F2",
                114: "F3",
                115: "F4",
                116: "F5",
                117: "F6",
                118: "F7",
                119: "F8",
                120: "F9",
                121: "F10",
                122: "F11",
                123: "F12",
                144: "NumLock",
                145: "ScrollLock",
                224: "Meta"
            }, Nn = {
                Alt: "altKey",
                Control: "ctrlKey",
                Meta: "metaKey",
                Shift: "shiftKey"
            };
            function kn(e) {
                var t = this.nativeEvent;
                return t.getModifierState ? t.getModifierState(e) : !!(e = Nn[e]) && !!t[e]
            }
            function Sn() {
                return kn
            }
            var En = z({}, dn, {
                key: function(e) {
                    if (e.key) {
                        var t = xn[e.key] || e.key;
                        if ("Unidentified" !== t)
                            return t
                    }
                    return "keypress" === e.type ? 13 === (e = tn(e)) ? "Enter" : String.fromCharCode(e) : "keydown" === e.type || "keyup" === e.type ? _n[e.keyCode] || "Unidentified" : ""
                },
                code: 0,
                location: 0,
                ctrlKey: 0,
                shiftKey: 0,
                altKey: 0,
                metaKey: 0,
                repeat: 0,
                locale: 0,
                getModifierState: Sn,
                charCode: function(e) {
                    return "keypress" === e.type ? tn(e) : 0
                },
                keyCode: function(e) {
                    return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0
                },
                which: function(e) {
                    return "keypress" === e.type ? tn(e) : "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0
                }
            })
              , Pn = an(En)
              , Cn = an(z({}, fn, {
                pointerId: 0,
                width: 0,
                height: 0,
                pressure: 0,
                tangentialPressure: 0,
                tiltX: 0,
                tiltY: 0,
                twist: 0,
                pointerType: 0,
                isPrimary: 0
            }))
              , Tn = an(z({}, dn, {
                touches: 0,
                targetTouches: 0,
                changedTouches: 0,
                altKey: 0,
                metaKey: 0,
                ctrlKey: 0,
                shiftKey: 0,
                getModifierState: Sn
            }))
              , Mn = an(z({}, un, {
                propertyName: 0,
                elapsedTime: 0,
                pseudoElement: 0
            }))
              , An = z({}, fn, {
                deltaX: function(e) {
                    return "deltaX"in e ? e.deltaX : "wheelDeltaX"in e ? -e.wheelDeltaX : 0
                },
                deltaY: function(e) {
                    return "deltaY"in e ? e.deltaY : "wheelDeltaY"in e ? -e.wheelDeltaY : "wheelDelta"in e ? -e.wheelDelta : 0
                },
                deltaZ: 0,
                deltaMode: 0
            })
              , Rn = an(An)
              , Dn = [9, 13, 27, 32]
              , Ln = c && "CompositionEvent"in window
              , On = null;
            c && "documentMode"in document && (On = document.documentMode);
            var jn = c && "TextEvent"in window && !On
              , zn = c && (!Ln || On && 8 < On && 11 >= On)
              , Vn = String.fromCharCode(32)
              , Fn = !1;
            function In(e, t) {
                switch (e) {
                case "keyup":
                    return -1 !== Dn.indexOf(t.keyCode);
                case "keydown":
                    return 229 !== t.keyCode;
                case "keypress":
                case "mousedown":
                case "focusout":
                    return !0;
                default:
                    return !1
                }
            }
            function Un(e) {
                return "object" == typeof (e = e.detail) && "data"in e ? e.data : null
            }
            var Bn = !1
              , $n = {
                color: !0,
                date: !0,
                datetime: !0,
                "datetime-local": !0,
                email: !0,
                month: !0,
                number: !0,
                password: !0,
                range: !0,
                search: !0,
                tel: !0,
                text: !0,
                time: !0,
                url: !0,
                week: !0
            };
            function Wn(e) {
                var t = e && e.nodeName && e.nodeName.toLowerCase();
                return "input" === t ? !!$n[e.type] : "textarea" === t
            }
            function Hn(e, t, n, r) {
                Ee(r),
                0 < (t = Yr(t, "onChange")).length && (n = new cn("onChange","change",null,n,r),
                e.push({
                    event: n,
                    listeners: t
                }))
            }
            var Yn = null
              , Kn = null;
            function Qn(e) {
                Vr(e, 0)
            }
            function qn(e) {
                if (K(wa(e)))
                    return e
            }
            function Xn(e, t) {
                if ("change" === e)
                    return t
            }
            var Gn = !1;
            if (c) {
                var Zn;
                if (c) {
                    var Jn = "oninput"in document;
                    if (!Jn) {
                        var er = document.createElement("div");
                        er.setAttribute("oninput", "return;"),
                        Jn = "function" == typeof er.oninput
                    }
                    Zn = Jn
                } else
                    Zn = !1;
                Gn = Zn && (!document.documentMode || 9 < document.documentMode)
            }
            function tr() {
                Yn && (Yn.detachEvent("onpropertychange", nr),
                Kn = Yn = null)
            }
            function nr(e) {
                if ("value" === e.propertyName && qn(Kn)) {
                    var t = [];
                    Hn(t, Kn, e, xe(e)),
                    Ae(Qn, t)
                }
            }
            function rr(e, t, n) {
                "focusin" === e ? (tr(),
                Kn = n,
                (Yn = t).attachEvent("onpropertychange", nr)) : "focusout" === e && tr()
            }
            function ar(e) {
                if ("selectionchange" === e || "keyup" === e || "keydown" === e)
                    return qn(Kn)
            }
            function ir(e, t) {
                if ("click" === e)
                    return qn(t)
            }
            function or(e, t) {
                if ("input" === e || "change" === e)
                    return qn(t)
            }
            var sr = "function" == typeof Object.is ? Object.is : function(e, t) {
                return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t
            }
            ;
            function lr(e, t) {
                if (sr(e, t))
                    return !0;
                if ("object" != typeof e || null === e || "object" != typeof t || null === t)
                    return !1;
                var n = Object.keys(e)
                  , r = Object.keys(t);
                if (n.length !== r.length)
                    return !1;
                for (r = 0; r < n.length; r++) {
                    var a = n[r];
                    if (!d.call(t, a) || !sr(e[a], t[a]))
                        return !1
                }
                return !0
            }
            function ur(e) {
                for (; e && e.firstChild; )
                    e = e.firstChild;
                return e
            }
            function cr(e, t) {
                var n, r = ur(e);
                for (e = 0; r; ) {
                    if (3 === r.nodeType) {
                        if (n = e + r.textContent.length,
                        e <= t && n >= t)
                            return {
                                node: r,
                                offset: t - e
                            };
                        e = n
                    }
                    e: {
                        for (; r; ) {
                            if (r.nextSibling) {
                                r = r.nextSibling;
                                break e
                            }
                            r = r.parentNode
                        }
                        r = void 0
                    }
                    r = ur(r)
                }
            }
            function dr(e, t) {
                return !(!e || !t) && (e === t || (!e || 3 !== e.nodeType) && (t && 3 === t.nodeType ? dr(e, t.parentNode) : "contains"in e ? e.contains(t) : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t))))
            }
            function mr() {
                for (var e = window, t = Q(); t instanceof e.HTMLIFrameElement; ) {
                    try {
                        var n = "string" == typeof t.contentWindow.location.href
                    } catch (e) {
                        n = !1
                    }
                    if (!n)
                        break;
                    t = Q((e = t.contentWindow).document)
                }
                return t
            }
            function fr(e) {
                var t = e && e.nodeName && e.nodeName.toLowerCase();
                return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable)
            }
            function hr(e) {
                var t = mr()
                  , n = e.focusedElem
                  , r = e.selectionRange;
                if (t !== n && n && n.ownerDocument && dr(n.ownerDocument.documentElement, n)) {
                    if (null !== r && fr(n))
                        if (t = r.start,
                        void 0 === (e = r.end) && (e = t),
                        "selectionStart"in n)
                            n.selectionStart = t,
                            n.selectionEnd = Math.min(e, n.value.length);
                        else if ((e = (t = n.ownerDocument || document) && t.defaultView || window).getSelection) {
                            e = e.getSelection();
                            var a = n.textContent.length
                              , i = Math.min(r.start, a);
                            r = void 0 === r.end ? i : Math.min(r.end, a),
                            !e.extend && i > r && (a = r,
                            r = i,
                            i = a),
                            a = cr(n, i);
                            var o = cr(n, r);
                            a && o && (1 !== e.rangeCount || e.anchorNode !== a.node || e.anchorOffset !== a.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && ((t = t.createRange()).setStart(a.node, a.offset),
                            e.removeAllRanges(),
                            i > r ? (e.addRange(t),
                            e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset),
                            e.addRange(t)))
                        }
                    for (t = [],
                    e = n; e = e.parentNode; )
                        1 === e.nodeType && t.push({
                            element: e,
                            left: e.scrollLeft,
                            top: e.scrollTop
                        });
                    for ("function" == typeof n.focus && n.focus(),
                    n = 0; n < t.length; n++)
                        (e = t[n]).element.scrollLeft = e.left,
                        e.element.scrollTop = e.top
                }
            }
            var pr = c && "documentMode"in document && 11 >= document.documentMode
              , gr = null
              , yr = null
              , br = null
              , vr = !1;
            function wr(e, t, n) {
                var r = n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument;
                vr || null == gr || gr !== Q(r) || (r = "selectionStart"in (r = gr) && fr(r) ? {
                    start: r.selectionStart,
                    end: r.selectionEnd
                } : {
                    anchorNode: (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection()).anchorNode,
                    anchorOffset: r.anchorOffset,
                    focusNode: r.focusNode,
                    focusOffset: r.focusOffset
                },
                br && lr(br, r) || (br = r,
                0 < (r = Yr(yr, "onSelect")).length && (t = new cn("onSelect","select",null,t,n),
                e.push({
                    event: t,
                    listeners: r
                }),
                t.target = gr)))
            }
            function xr(e, t) {
                var n = {};
                return n[e.toLowerCase()] = t.toLowerCase(),
                n["Webkit" + e] = "webkit" + t,
                n["Moz" + e] = "moz" + t,
                n
            }
            var _r = {
                animationend: xr("Animation", "AnimationEnd"),
                animationiteration: xr("Animation", "AnimationIteration"),
                animationstart: xr("Animation", "AnimationStart"),
                transitionend: xr("Transition", "TransitionEnd")
            }
              , Nr = {}
              , kr = {};
            function Sr(e) {
                if (Nr[e])
                    return Nr[e];
                if (!_r[e])
                    return e;
                var t, n = _r[e];
                for (t in n)
                    if (n.hasOwnProperty(t) && t in kr)
                        return Nr[e] = n[t];
                return e
            }
            c && (kr = document.createElement("div").style,
            "AnimationEvent"in window || (delete _r.animationend.animation,
            delete _r.animationiteration.animation,
            delete _r.animationstart.animation),
            "TransitionEvent"in window || delete _r.transitionend.transition);
            var Er = Sr("animationend")
              , Pr = Sr("animationiteration")
              , Cr = Sr("animationstart")
              , Tr = Sr("transitionend")
              , Mr = new Map
              , Ar = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
            function Rr(e, t) {
                Mr.set(e, t),
                l(t, [e])
            }
            for (var Dr = 0; Dr < Ar.length; Dr++) {
                var Lr = Ar[Dr];
                Rr(Lr.toLowerCase(), "on" + (Lr[0].toUpperCase() + Lr.slice(1)))
            }
            Rr(Er, "onAnimationEnd"),
            Rr(Pr, "onAnimationIteration"),
            Rr(Cr, "onAnimationStart"),
            Rr("dblclick", "onDoubleClick"),
            Rr("focusin", "onFocus"),
            Rr("focusout", "onBlur"),
            Rr(Tr, "onTransitionEnd"),
            u("onMouseEnter", ["mouseout", "mouseover"]),
            u("onMouseLeave", ["mouseout", "mouseover"]),
            u("onPointerEnter", ["pointerout", "pointerover"]),
            u("onPointerLeave", ["pointerout", "pointerover"]),
            l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
            l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
            l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
            l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
            l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
            l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
            var Or = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
              , jr = new Set("cancel close invalid load scroll toggle".split(" ").concat(Or));
            function zr(e, t, n) {
                var r = e.type || "unknown-event";
                e.currentTarget = n,
                function(e, t, n, r, a, o, s, l, u) {
                    if (Ue.apply(this, arguments),
                    je) {
                        if (!je)
                            throw Error(i(198));
                        var c = ze;
                        je = !1,
                        ze = null,
                        Ve || (Ve = !0,
                        Fe = c)
                    }
                }(r, t, void 0, e),
                e.currentTarget = null
            }
            function Vr(e, t) {
                t = !!(4 & t);
                for (var n = 0; n < e.length; n++) {
                    var r = e[n]
                      , a = r.event;
                    r = r.listeners;
                    e: {
                        var i = void 0;
                        if (t)
                            for (var o = r.length - 1; 0 <= o; o--) {
                                var s = r[o]
                                  , l = s.instance
                                  , u = s.currentTarget;
                                if (s = s.listener,
                                l !== i && a.isPropagationStopped())
                                    break e;
                                zr(a, s, u),
                                i = l
                            }
                        else
                            for (o = 0; o < r.length; o++) {
                                if (l = (s = r[o]).instance,
                                u = s.currentTarget,
                                s = s.listener,
                                l !== i && a.isPropagationStopped())
                                    break e;
                                zr(a, s, u),
                                i = l
                            }
                    }
                }
                if (Ve)
                    throw e = Fe,
                    Ve = !1,
                    Fe = null,
                    e
            }
            function Fr(e, t) {
                var n = t[pa];
                void 0 === n && (n = t[pa] = new Set);
                var r = e + "__bubble";
                n.has(r) || ($r(t, e, 2, !1),
                n.add(r))
            }
            function Ir(e, t, n) {
                var r = 0;
                t && (r |= 4),
                $r(n, e, r, t)
            }
            var Ur = "_reactListening" + Math.random().toString(36).slice(2);
            function Br(e) {
                if (!e[Ur]) {
                    e[Ur] = !0,
                    o.forEach(function(t) {
                        "selectionchange" !== t && (jr.has(t) || Ir(t, !1, e),
                        Ir(t, !0, e))
                    });
                    var t = 9 === e.nodeType ? e : e.ownerDocument;
                    null === t || t[Ur] || (t[Ur] = !0,
                    Ir("selectionchange", !1, t))
                }
            }
            function $r(e, t, n, r) {
                switch (Xt(t)) {
                case 1:
                    var a = Ht;
                    break;
                case 4:
                    a = Yt;
                    break;
                default:
                    a = Kt
                }
                n = a.bind(null, t, n, e),
                a = void 0,
                !De || "touchstart" !== t && "touchmove" !== t && "wheel" !== t || (a = !0),
                r ? void 0 !== a ? e.addEventListener(t, n, {
                    capture: !0,
                    passive: a
                }) : e.addEventListener(t, n, !0) : void 0 !== a ? e.addEventListener(t, n, {
                    passive: a
                }) : e.addEventListener(t, n, !1)
            }
            function Wr(e, t, n, r, a) {
                var i = r;
                if (!(1 & t || 2 & t || null === r))
                    e: for (; ; ) {
                        if (null === r)
                            return;
                        var o = r.tag;
                        if (3 === o || 4 === o) {
                            var s = r.stateNode.containerInfo;
                            if (s === a || 8 === s.nodeType && s.parentNode === a)
                                break;
                            if (4 === o)
                                for (o = r.return; null !== o; ) {
                                    var l = o.tag;
                                    if ((3 === l || 4 === l) && ((l = o.stateNode.containerInfo) === a || 8 === l.nodeType && l.parentNode === a))
                                        return;
                                    o = o.return
                                }
                            for (; null !== s; ) {
                                if (null === (o = ba(s)))
                                    return;
                                if (5 === (l = o.tag) || 6 === l) {
                                    r = i = o;
                                    continue e
                                }
                                s = s.parentNode
                            }
                        }
                        r = r.return
                    }
                Ae(function() {
                    var r = i
                      , a = xe(n)
                      , o = [];
                    e: {
                        var s = Mr.get(e);
                        if (void 0 !== s) {
                            var l = cn
                              , u = e;
                            switch (e) {
                            case "keypress":
                                if (0 === tn(n))
                                    break e;
                            case "keydown":
                            case "keyup":
                                l = Pn;
                                break;
                            case "focusin":
                                u = "focus",
                                l = gn;
                                break;
                            case "focusout":
                                u = "blur",
                                l = gn;
                                break;
                            case "beforeblur":
                            case "afterblur":
                                l = gn;
                                break;
                            case "click":
                                if (2 === n.button)
                                    break e;
                            case "auxclick":
                            case "dblclick":
                            case "mousedown":
                            case "mousemove":
                            case "mouseup":
                            case "mouseout":
                            case "mouseover":
                            case "contextmenu":
                                l = hn;
                                break;
                            case "drag":
                            case "dragend":
                            case "dragenter":
                            case "dragexit":
                            case "dragleave":
                            case "dragover":
                            case "dragstart":
                            case "drop":
                                l = pn;
                                break;
                            case "touchcancel":
                            case "touchend":
                            case "touchmove":
                            case "touchstart":
                                l = Tn;
                                break;
                            case Er:
                            case Pr:
                            case Cr:
                                l = yn;
                                break;
                            case Tr:
                                l = Mn;
                                break;
                            case "scroll":
                                l = mn;
                                break;
                            case "wheel":
                                l = Rn;
                                break;
                            case "copy":
                            case "cut":
                            case "paste":
                                l = vn;
                                break;
                            case "gotpointercapture":
                            case "lostpointercapture":
                            case "pointercancel":
                            case "pointerdown":
                            case "pointermove":
                            case "pointerout":
                            case "pointerover":
                            case "pointerup":
                                l = Cn
                            }
                            var c = !!(4 & t)
                              , d = !c && "scroll" === e
                              , m = c ? null !== s ? s + "Capture" : null : s;
                            c = [];
                            for (var f, h = r; null !== h; ) {
                                var p = (f = h).stateNode;
                                if (5 === f.tag && null !== p && (f = p,
                                null !== m && null != (p = Re(h, m)) && c.push(Hr(h, p, f))),
                                d)
                                    break;
                                h = h.return
                            }
                            0 < c.length && (s = new l(s,u,null,n,a),
                            o.push({
                                event: s,
                                listeners: c
                            }))
                        }
                    }
                    if (!(7 & t)) {
                        if (l = "mouseout" === e || "pointerout" === e,
                        (!(s = "mouseover" === e || "pointerover" === e) || n === we || !(u = n.relatedTarget || n.fromElement) || !ba(u) && !u[ha]) && (l || s) && (s = a.window === a ? a : (s = a.ownerDocument) ? s.defaultView || s.parentWindow : window,
                        l ? (l = r,
                        null !== (u = (u = n.relatedTarget || n.toElement) ? ba(u) : null) && (u !== (d = Be(u)) || 5 !== u.tag && 6 !== u.tag) && (u = null)) : (l = null,
                        u = r),
                        l !== u)) {
                            if (c = hn,
                            p = "onMouseLeave",
                            m = "onMouseEnter",
                            h = "mouse",
                            "pointerout" !== e && "pointerover" !== e || (c = Cn,
                            p = "onPointerLeave",
                            m = "onPointerEnter",
                            h = "pointer"),
                            d = null == l ? s : wa(l),
                            f = null == u ? s : wa(u),
                            (s = new c(p,h + "leave",l,n,a)).target = d,
                            s.relatedTarget = f,
                            p = null,
                            ba(a) === r && ((c = new c(m,h + "enter",u,n,a)).target = f,
                            c.relatedTarget = d,
                            p = c),
                            d = p,
                            l && u)
                                e: {
                                    for (m = u,
                                    h = 0,
                                    f = c = l; f; f = Kr(f))
                                        h++;
                                    for (f = 0,
                                    p = m; p; p = Kr(p))
                                        f++;
                                    for (; 0 < h - f; )
                                        c = Kr(c),
                                        h--;
                                    for (; 0 < f - h; )
                                        m = Kr(m),
                                        f--;
                                    for (; h--; ) {
                                        if (c === m || null !== m && c === m.alternate)
                                            break e;
                                        c = Kr(c),
                                        m = Kr(m)
                                    }
                                    c = null
                                }
                            else
                                c = null;
                            null !== l && Qr(o, s, l, c, !1),
                            null !== u && null !== d && Qr(o, d, u, c, !0)
                        }
                        if ("select" === (l = (s = r ? wa(r) : window).nodeName && s.nodeName.toLowerCase()) || "input" === l && "file" === s.type)
                            var g = Xn;
                        else if (Wn(s))
                            if (Gn)
                                g = or;
                            else {
                                g = ar;
                                var y = rr
                            }
                        else
                            (l = s.nodeName) && "input" === l.toLowerCase() && ("checkbox" === s.type || "radio" === s.type) && (g = ir);
                        switch (g && (g = g(e, r)) ? Hn(o, g, n, a) : (y && y(e, s, r),
                        "focusout" === e && (y = s._wrapperState) && y.controlled && "number" === s.type && ee(s, "number", s.value)),
                        y = r ? wa(r) : window,
                        e) {
                        case "focusin":
                            (Wn(y) || "true" === y.contentEditable) && (gr = y,
                            yr = r,
                            br = null);
                            break;
                        case "focusout":
                            br = yr = gr = null;
                            break;
                        case "mousedown":
                            vr = !0;
                            break;
                        case "contextmenu":
                        case "mouseup":
                        case "dragend":
                            vr = !1,
                            wr(o, n, a);
                            break;
                        case "selectionchange":
                            if (pr)
                                break;
                        case "keydown":
                        case "keyup":
                            wr(o, n, a)
                        }
                        var b;
                        if (Ln)
                            e: {
                                switch (e) {
                                case "compositionstart":
                                    var v = "onCompositionStart";
                                    break e;
                                case "compositionend":
                                    v = "onCompositionEnd";
                                    break e;
                                case "compositionupdate":
                                    v = "onCompositionUpdate";
                                    break e
                                }
                                v = void 0
                            }
                        else
                            Bn ? In(e, n) && (v = "onCompositionEnd") : "keydown" === e && 229 === n.keyCode && (v = "onCompositionStart");
                        v && (zn && "ko" !== n.locale && (Bn || "onCompositionStart" !== v ? "onCompositionEnd" === v && Bn && (b = en()) : (Zt = "value"in (Gt = a) ? Gt.value : Gt.textContent,
                        Bn = !0)),
                        0 < (y = Yr(r, v)).length && (v = new wn(v,e,null,n,a),
                        o.push({
                            event: v,
                            listeners: y
                        }),
                        (b || null !== (b = Un(n))) && (v.data = b))),
                        (b = jn ? function(e, t) {
                            switch (e) {
                            case "compositionend":
                                return Un(t);
                            case "keypress":
                                return 32 !== t.which ? null : (Fn = !0,
                                Vn);
                            case "textInput":
                                return (e = t.data) === Vn && Fn ? null : e;
                            default:
                                return null
                            }
                        }(e, n) : function(e, t) {
                            if (Bn)
                                return "compositionend" === e || !Ln && In(e, t) ? (e = en(),
                                Jt = Zt = Gt = null,
                                Bn = !1,
                                e) : null;
                            switch (e) {
                            case "paste":
                            default:
                                return null;
                            case "keypress":
                                if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                                    if (t.char && 1 < t.char.length)
                                        return t.char;
                                    if (t.which)
                                        return String.fromCharCode(t.which)
                                }
                                return null;
                            case "compositionend":
                                return zn && "ko" !== t.locale ? null : t.data
                            }
                        }(e, n)) && 0 < (r = Yr(r, "onBeforeInput")).length && (a = new wn("onBeforeInput","beforeinput",null,n,a),
                        o.push({
                            event: a,
                            listeners: r
                        }),
                        a.data = b)
                    }
                    Vr(o, t)
                })
            }
            function Hr(e, t, n) {
                return {
                    instance: e,
                    listener: t,
                    currentTarget: n
                }
            }
            function Yr(e, t) {
                for (var n = t + "Capture", r = []; null !== e; ) {
                    var a = e
                      , i = a.stateNode;
                    5 === a.tag && null !== i && (a = i,
                    null != (i = Re(e, n)) && r.unshift(Hr(e, i, a)),
                    null != (i = Re(e, t)) && r.push(Hr(e, i, a))),
                    e = e.return
                }
                return r
            }
            function Kr(e) {
                if (null === e)
                    return null;
                do {
                    e = e.return
                } while (e && 5 !== e.tag);
                return e || null
            }
            function Qr(e, t, n, r, a) {
                for (var i = t._reactName, o = []; null !== n && n !== r; ) {
                    var s = n
                      , l = s.alternate
                      , u = s.stateNode;
                    if (null !== l && l === r)
                        break;
                    5 === s.tag && null !== u && (s = u,
                    a ? null != (l = Re(n, i)) && o.unshift(Hr(n, l, s)) : a || null != (l = Re(n, i)) && o.push(Hr(n, l, s))),
                    n = n.return
                }
                0 !== o.length && e.push({
                    event: t,
                    listeners: o
                })
            }
            var qr = /\r\n?/g
              , Xr = /\u0000|\uFFFD/g;
            function Gr(e) {
                return ("string" == typeof e ? e : "" + e).replace(qr, "\n").replace(Xr, "")
            }
            function Zr(e, t, n) {
                if (t = Gr(t),
                Gr(e) !== t && n)
                    throw Error(i(425))
            }
            function Jr() {}
            var ea = null
              , ta = null;
            function na(e, t) {
                return "textarea" === e || "noscript" === e || "string" == typeof t.children || "number" == typeof t.children || "object" == typeof t.dangerouslySetInnerHTML && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html
            }
            var ra = "function" == typeof setTimeout ? setTimeout : void 0
              , aa = "function" == typeof clearTimeout ? clearTimeout : void 0
              , ia = "function" == typeof Promise ? Promise : void 0
              , oa = "function" == typeof queueMicrotask ? queueMicrotask : void 0 !== ia ? function(e) {
                return ia.resolve(null).then(e).catch(sa)
            }
            : ra;
            function sa(e) {
                setTimeout(function() {
                    throw e
                })
            }
            function la(e, t) {
                var n = t
                  , r = 0;
                do {
                    var a = n.nextSibling;
                    if (e.removeChild(n),
                    a && 8 === a.nodeType)
                        if ("/$" === (n = a.data)) {
                            if (0 === r)
                                return e.removeChild(a),
                                void Bt(t);
                            r--
                        } else
                            "$" !== n && "$?" !== n && "$!" !== n || r++;
                    n = a
                } while (n);
                Bt(t)
            }
            function ua(e) {
                for (; null != e; e = e.nextSibling) {
                    var t = e.nodeType;
                    if (1 === t || 3 === t)
                        break;
                    if (8 === t) {
                        if ("$" === (t = e.data) || "$!" === t || "$?" === t)
                            break;
                        if ("/$" === t)
                            return null
                    }
                }
                return e
            }
            function ca(e) {
                e = e.previousSibling;
                for (var t = 0; e; ) {
                    if (8 === e.nodeType) {
                        var n = e.data;
                        if ("$" === n || "$!" === n || "$?" === n) {
                            if (0 === t)
                                return e;
                            t--
                        } else
                            "/$" === n && t++
                    }
                    e = e.previousSibling
                }
                return null
            }
            var da = Math.random().toString(36).slice(2)
              , ma = "__reactFiber$" + da
              , fa = "__reactProps$" + da
              , ha = "__reactContainer$" + da
              , pa = "__reactEvents$" + da
              , ga = "__reactListeners$" + da
              , ya = "__reactHandles$" + da;
            function ba(e) {
                var t = e[ma];
                if (t)
                    return t;
                for (var n = e.parentNode; n; ) {
                    if (t = n[ha] || n[ma]) {
                        if (n = t.alternate,
                        null !== t.child || null !== n && null !== n.child)
                            for (e = ca(e); null !== e; ) {
                                if (n = e[ma])
                                    return n;
                                e = ca(e)
                            }
                        return t
                    }
                    n = (e = n).parentNode
                }
                return null
            }
            function va(e) {
                return !(e = e[ma] || e[ha]) || 5 !== e.tag && 6 !== e.tag && 13 !== e.tag && 3 !== e.tag ? null : e
            }
            function wa(e) {
                if (5 === e.tag || 6 === e.tag)
                    return e.stateNode;
                throw Error(i(33))
            }
            function xa(e) {
                return e[fa] || null
            }
            var _a = []
              , Na = -1;
            function ka(e) {
                return {
                    current: e
                }
            }
            function Sa(e) {
                0 > Na || (e.current = _a[Na],
                _a[Na] = null,
                Na--)
            }
            function Ea(e, t) {
                Na++,
                _a[Na] = e.current,
                e.current = t
            }
            var Pa = {}
              , Ca = ka(Pa)
              , Ta = ka(!1)
              , Ma = Pa;
            function Aa(e, t) {
                var n = e.type.contextTypes;
                if (!n)
                    return Pa;
                var r = e.stateNode;
                if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
                    return r.__reactInternalMemoizedMaskedChildContext;
                var a, i = {};
                for (a in n)
                    i[a] = t[a];
                return r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t,
                e.__reactInternalMemoizedMaskedChildContext = i),
                i
            }
            function Ra(e) {
                return null != e.childContextTypes
            }
            function Da() {
                Sa(Ta),
                Sa(Ca)
            }
            function La(e, t, n) {
                if (Ca.current !== Pa)
                    throw Error(i(168));
                Ea(Ca, t),
                Ea(Ta, n)
            }
            function Oa(e, t, n) {
                var r = e.stateNode;
                if (t = t.childContextTypes,
                "function" != typeof r.getChildContext)
                    return n;
                for (var a in r = r.getChildContext())
                    if (!(a in t))
                        throw Error(i(108, $(e) || "Unknown", a));
                return z({}, n, r)
            }
            function ja(e) {
                return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Pa,
                Ma = Ca.current,
                Ea(Ca, e),
                Ea(Ta, Ta.current),
                !0
            }
            function za(e, t, n) {
                var r = e.stateNode;
                if (!r)
                    throw Error(i(169));
                n ? (e = Oa(e, t, Ma),
                r.__reactInternalMemoizedMergedChildContext = e,
                Sa(Ta),
                Sa(Ca),
                Ea(Ca, e)) : Sa(Ta),
                Ea(Ta, n)
            }
            var Va = null
              , Fa = !1
              , Ia = !1;
            function Ua(e) {
                null === Va ? Va = [e] : Va.push(e)
            }
            function Ba() {
                if (!Ia && null !== Va) {
                    Ia = !0;
                    var e = 0
                      , t = vt;
                    try {
                        var n = Va;
                        for (vt = 1; e < n.length; e++) {
                            var r = n[e];
                            do {
                                r = r(!0)
                            } while (null !== r)
                        }
                        Va = null,
                        Fa = !1
                    } catch (t) {
                        throw null !== Va && (Va = Va.slice(e + 1)),
                        Ke(Je, Ba),
                        t
                    } finally {
                        vt = t,
                        Ia = !1
                    }
                }
                return null
            }
            var $a = []
              , Wa = 0
              , Ha = null
              , Ya = 0
              , Ka = []
              , Qa = 0
              , qa = null
              , Xa = 1
              , Ga = "";
            function Za(e, t) {
                $a[Wa++] = Ya,
                $a[Wa++] = Ha,
                Ha = e,
                Ya = t
            }
            function Ja(e, t, n) {
                Ka[Qa++] = Xa,
                Ka[Qa++] = Ga,
                Ka[Qa++] = qa,
                qa = e;
                var r = Xa;
                e = Ga;
                var a = 32 - ot(r) - 1;
                r &= ~(1 << a),
                n += 1;
                var i = 32 - ot(t) + a;
                if (30 < i) {
                    var o = a - a % 5;
                    i = (r & (1 << o) - 1).toString(32),
                    r >>= o,
                    a -= o,
                    Xa = 1 << 32 - ot(t) + a | n << a | r,
                    Ga = i + e
                } else
                    Xa = 1 << i | n << a | r,
                    Ga = e
            }
            function ei(e) {
                null !== e.return && (Za(e, 1),
                Ja(e, 1, 0))
            }
            function ti(e) {
                for (; e === Ha; )
                    Ha = $a[--Wa],
                    $a[Wa] = null,
                    Ya = $a[--Wa],
                    $a[Wa] = null;
                for (; e === qa; )
                    qa = Ka[--Qa],
                    Ka[Qa] = null,
                    Ga = Ka[--Qa],
                    Ka[Qa] = null,
                    Xa = Ka[--Qa],
                    Ka[Qa] = null
            }
            var ni = null
              , ri = null
              , ai = !1
              , ii = null;
            function oi(e, t) {
                var n = Au(5, null, null, 0);
                n.elementType = "DELETED",
                n.stateNode = t,
                n.return = e,
                null === (t = e.deletions) ? (e.deletions = [n],
                e.flags |= 16) : t.push(n)
            }
            function si(e, t) {
                switch (e.tag) {
                case 5:
                    var n = e.type;
                    return null !== (t = 1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) && (e.stateNode = t,
                    ni = e,
                    ri = ua(t.firstChild),
                    !0);
                case 6:
                    return null !== (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) && (e.stateNode = t,
                    ni = e,
                    ri = null,
                    !0);
                case 13:
                    return null !== (t = 8 !== t.nodeType ? null : t) && (n = null !== qa ? {
                        id: Xa,
                        overflow: Ga
                    } : null,
                    e.memoizedState = {
                        dehydrated: t,
                        treeContext: n,
                        retryLane: 1073741824
                    },
                    (n = Au(18, null, null, 0)).stateNode = t,
                    n.return = e,
                    e.child = n,
                    ni = e,
                    ri = null,
                    !0);
                default:
                    return !1
                }
            }
            function li(e) {
                return !(!(1 & e.mode) || 128 & e.flags)
            }
            function ui(e) {
                if (ai) {
                    var t = ri;
                    if (t) {
                        var n = t;
                        if (!si(e, t)) {
                            if (li(e))
                                throw Error(i(418));
                            t = ua(n.nextSibling);
                            var r = ni;
                            t && si(e, t) ? oi(r, n) : (e.flags = -4097 & e.flags | 2,
                            ai = !1,
                            ni = e)
                        }
                    } else {
                        if (li(e))
                            throw Error(i(418));
                        e.flags = -4097 & e.flags | 2,
                        ai = !1,
                        ni = e
                    }
                }
            }
            function ci(e) {
                for (e = e.return; null !== e && 5 !== e.tag && 3 !== e.tag && 13 !== e.tag; )
                    e = e.return;
                ni = e
            }
            function di(e) {
                if (e !== ni)
                    return !1;
                if (!ai)
                    return ci(e),
                    ai = !0,
                    !1;
                var t;
                if ((t = 3 !== e.tag) && !(t = 5 !== e.tag) && (t = "head" !== (t = e.type) && "body" !== t && !na(e.type, e.memoizedProps)),
                t && (t = ri)) {
                    if (li(e))
                        throw mi(),
                        Error(i(418));
                    for (; t; )
                        oi(e, t),
                        t = ua(t.nextSibling)
                }
                if (ci(e),
                13 === e.tag) {
                    if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
                        throw Error(i(317));
                    e: {
                        for (e = e.nextSibling,
                        t = 0; e; ) {
                            if (8 === e.nodeType) {
                                var n = e.data;
                                if ("/$" === n) {
                                    if (0 === t) {
                                        ri = ua(e.nextSibling);
                                        break e
                                    }
                                    t--
                                } else
                                    "$" !== n && "$!" !== n && "$?" !== n || t++
                            }
                            e = e.nextSibling
                        }
                        ri = null
                    }
                } else
                    ri = ni ? ua(e.stateNode.nextSibling) : null;
                return !0
            }
            function mi() {
                for (var e = ri; e; )
                    e = ua(e.nextSibling)
            }
            function fi() {
                ri = ni = null,
                ai = !1
            }
            function hi(e) {
                null === ii ? ii = [e] : ii.push(e)
            }
            var pi = w.ReactCurrentBatchConfig;
            function gi(e, t, n) {
                if (null !== (e = n.ref) && "function" != typeof e && "object" != typeof e) {
                    if (n._owner) {
                        if (n = n._owner) {
                            if (1 !== n.tag)
                                throw Error(i(309));
                            var r = n.stateNode
                        }
                        if (!r)
                            throw Error(i(147, e));
                        var a = r
                          , o = "" + e;
                        return null !== t && null !== t.ref && "function" == typeof t.ref && t.ref._stringRef === o ? t.ref : (t = function(e) {
                            var t = a.refs;
                            null === e ? delete t[o] : t[o] = e
                        }
                        ,
                        t._stringRef = o,
                        t)
                    }
                    if ("string" != typeof e)
                        throw Error(i(284));
                    if (!n._owner)
                        throw Error(i(290, e))
                }
                return e
            }
            function yi(e, t) {
                throw e = Object.prototype.toString.call(t),
                Error(i(31, "[object Object]" === e ? "object with keys {" + Object.keys(t).join(", ") + "}" : e))
            }
            function bi(e) {
                return (0,
                e._init)(e._payload)
            }
            function vi(e) {
                function t(t, n) {
                    if (e) {
                        var r = t.deletions;
                        null === r ? (t.deletions = [n],
                        t.flags |= 16) : r.push(n)
                    }
                }
                function n(n, r) {
                    if (!e)
                        return null;
                    for (; null !== r; )
                        t(n, r),
                        r = r.sibling;
                    return null
                }
                function r(e, t) {
                    for (e = new Map; null !== t; )
                        null !== t.key ? e.set(t.key, t) : e.set(t.index, t),
                        t = t.sibling;
                    return e
                }
                function a(e, t) {
                    return (e = Du(e, t)).index = 0,
                    e.sibling = null,
                    e
                }
                function o(t, n, r) {
                    return t.index = r,
                    e ? null !== (r = t.alternate) ? (r = r.index) < n ? (t.flags |= 2,
                    n) : r : (t.flags |= 2,
                    n) : (t.flags |= 1048576,
                    n)
                }
                function s(t) {
                    return e && null === t.alternate && (t.flags |= 2),
                    t
                }
                function l(e, t, n, r) {
                    return null === t || 6 !== t.tag ? ((t = zu(n, e.mode, r)).return = e,
                    t) : ((t = a(t, n)).return = e,
                    t)
                }
                function u(e, t, n, r) {
                    var i = n.type;
                    return i === N ? d(e, t, n.props.children, r, n.key) : null !== t && (t.elementType === i || "object" == typeof i && null !== i && i.$$typeof === R && bi(i) === t.type) ? ((r = a(t, n.props)).ref = gi(e, t, n),
                    r.return = e,
                    r) : ((r = Lu(n.type, n.key, n.props, null, e.mode, r)).ref = gi(e, t, n),
                    r.return = e,
                    r)
                }
                function c(e, t, n, r) {
                    return null === t || 4 !== t.tag || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? ((t = Vu(n, e.mode, r)).return = e,
                    t) : ((t = a(t, n.children || [])).return = e,
                    t)
                }
                function d(e, t, n, r, i) {
                    return null === t || 7 !== t.tag ? ((t = Ou(n, e.mode, r, i)).return = e,
                    t) : ((t = a(t, n)).return = e,
                    t)
                }
                function m(e, t, n) {
                    if ("string" == typeof t && "" !== t || "number" == typeof t)
                        return (t = zu("" + t, e.mode, n)).return = e,
                        t;
                    if ("object" == typeof t && null !== t) {
                        switch (t.$$typeof) {
                        case x:
                            return (n = Lu(t.type, t.key, t.props, null, e.mode, n)).ref = gi(e, null, t),
                            n.return = e,
                            n;
                        case _:
                            return (t = Vu(t, e.mode, n)).return = e,
                            t;
                        case R:
                            return m(e, (0,
                            t._init)(t._payload), n)
                        }
                        if (te(t) || O(t))
                            return (t = Ou(t, e.mode, n, null)).return = e,
                            t;
                        yi(e, t)
                    }
                    return null
                }
                function f(e, t, n, r) {
                    var a = null !== t ? t.key : null;
                    if ("string" == typeof n && "" !== n || "number" == typeof n)
                        return null !== a ? null : l(e, t, "" + n, r);
                    if ("object" == typeof n && null !== n) {
                        switch (n.$$typeof) {
                        case x:
                            return n.key === a ? u(e, t, n, r) : null;
                        case _:
                            return n.key === a ? c(e, t, n, r) : null;
                        case R:
                            return f(e, t, (a = n._init)(n._payload), r)
                        }
                        if (te(n) || O(n))
                            return null !== a ? null : d(e, t, n, r, null);
                        yi(e, n)
                    }
                    return null
                }
                function h(e, t, n, r, a) {
                    if ("string" == typeof r && "" !== r || "number" == typeof r)
                        return l(t, e = e.get(n) || null, "" + r, a);
                    if ("object" == typeof r && null !== r) {
                        switch (r.$$typeof) {
                        case x:
                            return u(t, e = e.get(null === r.key ? n : r.key) || null, r, a);
                        case _:
                            return c(t, e = e.get(null === r.key ? n : r.key) || null, r, a);
                        case R:
                            return h(e, t, n, (0,
                            r._init)(r._payload), a)
                        }
                        if (te(r) || O(r))
                            return d(t, e = e.get(n) || null, r, a, null);
                        yi(t, r)
                    }
                    return null
                }
                function p(a, i, s, l) {
                    for (var u = null, c = null, d = i, p = i = 0, g = null; null !== d && p < s.length; p++) {
                        d.index > p ? (g = d,
                        d = null) : g = d.sibling;
                        var y = f(a, d, s[p], l);
                        if (null === y) {
                            null === d && (d = g);
                            break
                        }
                        e && d && null === y.alternate && t(a, d),
                        i = o(y, i, p),
                        null === c ? u = y : c.sibling = y,
                        c = y,
                        d = g
                    }
                    if (p === s.length)
                        return n(a, d),
                        ai && Za(a, p),
                        u;
                    if (null === d) {
                        for (; p < s.length; p++)
                            null !== (d = m(a, s[p], l)) && (i = o(d, i, p),
                            null === c ? u = d : c.sibling = d,
                            c = d);
                        return ai && Za(a, p),
                        u
                    }
                    for (d = r(a, d); p < s.length; p++)
                        null !== (g = h(d, a, p, s[p], l)) && (e && null !== g.alternate && d.delete(null === g.key ? p : g.key),
                        i = o(g, i, p),
                        null === c ? u = g : c.sibling = g,
                        c = g);
                    return e && d.forEach(function(e) {
                        return t(a, e)
                    }),
                    ai && Za(a, p),
                    u
                }
                function g(a, s, l, u) {
                    var c = O(l);
                    if ("function" != typeof c)
                        throw Error(i(150));
                    if (null == (l = c.call(l)))
                        throw Error(i(151));
                    for (var d = c = null, p = s, g = s = 0, y = null, b = l.next(); null !== p && !b.done; g++,
                    b = l.next()) {
                        p.index > g ? (y = p,
                        p = null) : y = p.sibling;
                        var v = f(a, p, b.value, u);
                        if (null === v) {
                            null === p && (p = y);
                            break
                        }
                        e && p && null === v.alternate && t(a, p),
                        s = o(v, s, g),
                        null === d ? c = v : d.sibling = v,
                        d = v,
                        p = y
                    }
                    if (b.done)
                        return n(a, p),
                        ai && Za(a, g),
                        c;
                    if (null === p) {
                        for (; !b.done; g++,
                        b = l.next())
                            null !== (b = m(a, b.value, u)) && (s = o(b, s, g),
                            null === d ? c = b : d.sibling = b,
                            d = b);
                        return ai && Za(a, g),
                        c
                    }
                    for (p = r(a, p); !b.done; g++,
                    b = l.next())
                        null !== (b = h(p, a, g, b.value, u)) && (e && null !== b.alternate && p.delete(null === b.key ? g : b.key),
                        s = o(b, s, g),
                        null === d ? c = b : d.sibling = b,
                        d = b);
                    return e && p.forEach(function(e) {
                        return t(a, e)
                    }),
                    ai && Za(a, g),
                    c
                }
                return function e(r, i, o, l) {
                    if ("object" == typeof o && null !== o && o.type === N && null === o.key && (o = o.props.children),
                    "object" == typeof o && null !== o) {
                        switch (o.$$typeof) {
                        case x:
                            e: {
                                for (var u = o.key, c = i; null !== c; ) {
                                    if (c.key === u) {
                                        if ((u = o.type) === N) {
                                            if (7 === c.tag) {
                                                n(r, c.sibling),
                                                (i = a(c, o.props.children)).return = r,
                                                r = i;
                                                break e
                                            }
                                        } else if (c.elementType === u || "object" == typeof u && null !== u && u.$$typeof === R && bi(u) === c.type) {
                                            n(r, c.sibling),
                                            (i = a(c, o.props)).ref = gi(r, c, o),
                                            i.return = r,
                                            r = i;
                                            break e
                                        }
                                        n(r, c);
                                        break
                                    }
                                    t(r, c),
                                    c = c.sibling
                                }
                                o.type === N ? ((i = Ou(o.props.children, r.mode, l, o.key)).return = r,
                                r = i) : ((l = Lu(o.type, o.key, o.props, null, r.mode, l)).ref = gi(r, i, o),
                                l.return = r,
                                r = l)
                            }
                            return s(r);
                        case _:
                            e: {
                                for (c = o.key; null !== i; ) {
                                    if (i.key === c) {
                                        if (4 === i.tag && i.stateNode.containerInfo === o.containerInfo && i.stateNode.implementation === o.implementation) {
                                            n(r, i.sibling),
                                            (i = a(i, o.children || [])).return = r,
                                            r = i;
                                            break e
                                        }
                                        n(r, i);
                                        break
                                    }
                                    t(r, i),
                                    i = i.sibling
                                }
                                (i = Vu(o, r.mode, l)).return = r,
                                r = i
                            }
                            return s(r);
                        case R:
                            return e(r, i, (c = o._init)(o._payload), l)
                        }
                        if (te(o))
                            return p(r, i, o, l);
                        if (O(o))
                            return g(r, i, o, l);
                        yi(r, o)
                    }
                    return "string" == typeof o && "" !== o || "number" == typeof o ? (o = "" + o,
                    null !== i && 6 === i.tag ? (n(r, i.sibling),
                    (i = a(i, o)).return = r,
                    r = i) : (n(r, i),
                    (i = zu(o, r.mode, l)).return = r,
                    r = i),
                    s(r)) : n(r, i)
                }
            }
            var wi = vi(!0)
              , xi = vi(!1)
              , _i = ka(null)
              , Ni = null
              , ki = null
              , Si = null;
            function Ei() {
                Si = ki = Ni = null
            }
            function Pi(e) {
                var t = _i.current;
                Sa(_i),
                e._currentValue = t
            }
            function Ci(e, t, n) {
                for (; null !== e; ) {
                    var r = e.alternate;
                    if ((e.childLanes & t) !== t ? (e.childLanes |= t,
                    null !== r && (r.childLanes |= t)) : null !== r && (r.childLanes & t) !== t && (r.childLanes |= t),
                    e === n)
                        break;
                    e = e.return
                }
            }
            function Ti(e, t) {
                Ni = e,
                Si = ki = null,
                null !== (e = e.dependencies) && null !== e.firstContext && (0 !== (e.lanes & t) && (vs = !0),
                e.firstContext = null)
            }
            function Mi(e) {
                var t = e._currentValue;
                if (Si !== e)
                    if (e = {
                        context: e,
                        memoizedValue: t,
                        next: null
                    },
                    null === ki) {
                        if (null === Ni)
                            throw Error(i(308));
                        ki = e,
                        Ni.dependencies = {
                            lanes: 0,
                            firstContext: e
                        }
                    } else
                        ki = ki.next = e;
                return t
            }
            var Ai = null;
            function Ri(e) {
                null === Ai ? Ai = [e] : Ai.push(e)
            }
            function Di(e, t, n, r) {
                var a = t.interleaved;
                return null === a ? (n.next = n,
                Ri(t)) : (n.next = a.next,
                a.next = n),
                t.interleaved = n,
                Li(e, r)
            }
            function Li(e, t) {
                e.lanes |= t;
                var n = e.alternate;
                for (null !== n && (n.lanes |= t),
                n = e,
                e = e.return; null !== e; )
                    e.childLanes |= t,
                    null !== (n = e.alternate) && (n.childLanes |= t),
                    n = e,
                    e = e.return;
                return 3 === n.tag ? n.stateNode : null
            }
            var Oi = !1;
            function ji(e) {
                e.updateQueue = {
                    baseState: e.memoizedState,
                    firstBaseUpdate: null,
                    lastBaseUpdate: null,
                    shared: {
                        pending: null,
                        interleaved: null,
                        lanes: 0
                    },
                    effects: null
                }
            }
            function zi(e, t) {
                e = e.updateQueue,
                t.updateQueue === e && (t.updateQueue = {
                    baseState: e.baseState,
                    firstBaseUpdate: e.firstBaseUpdate,
                    lastBaseUpdate: e.lastBaseUpdate,
                    shared: e.shared,
                    effects: e.effects
                })
            }
            function Vi(e, t) {
                return {
                    eventTime: e,
                    lane: t,
                    tag: 0,
                    payload: null,
                    callback: null,
                    next: null
                }
            }
            function Fi(e, t, n) {
                var r = e.updateQueue;
                if (null === r)
                    return null;
                if (r = r.shared,
                2 & Cl) {
                    var a = r.pending;
                    return null === a ? t.next = t : (t.next = a.next,
                    a.next = t),
                    r.pending = t,
                    Li(e, n)
                }
                return null === (a = r.interleaved) ? (t.next = t,
                Ri(r)) : (t.next = a.next,
                a.next = t),
                r.interleaved = t,
                Li(e, n)
            }
            function Ii(e, t, n) {
                if (null !== (t = t.updateQueue) && (t = t.shared,
                4194240 & n)) {
                    var r = t.lanes;
                    n |= r &= e.pendingLanes,
                    t.lanes = n,
                    bt(e, n)
                }
            }
            function Ui(e, t) {
                var n = e.updateQueue
                  , r = e.alternate;
                if (null !== r && n === (r = r.updateQueue)) {
                    var a = null
                      , i = null;
                    if (null !== (n = n.firstBaseUpdate)) {
                        do {
                            var o = {
                                eventTime: n.eventTime,
                                lane: n.lane,
                                tag: n.tag,
                                payload: n.payload,
                                callback: n.callback,
                                next: null
                            };
                            null === i ? a = i = o : i = i.next = o,
                            n = n.next
                        } while (null !== n);
                        null === i ? a = i = t : i = i.next = t
                    } else
                        a = i = t;
                    return n = {
                        baseState: r.baseState,
                        firstBaseUpdate: a,
                        lastBaseUpdate: i,
                        shared: r.shared,
                        effects: r.effects
                    },
                    void (e.updateQueue = n)
                }
                null === (e = n.lastBaseUpdate) ? n.firstBaseUpdate = t : e.next = t,
                n.lastBaseUpdate = t
            }
            function Bi(e, t, n, r) {
                var a = e.updateQueue;
                Oi = !1;
                var i = a.firstBaseUpdate
                  , o = a.lastBaseUpdate
                  , s = a.shared.pending;
                if (null !== s) {
                    a.shared.pending = null;
                    var l = s
                      , u = l.next;
                    l.next = null,
                    null === o ? i = u : o.next = u,
                    o = l;
                    var c = e.alternate;
                    null !== c && (s = (c = c.updateQueue).lastBaseUpdate) !== o && (null === s ? c.firstBaseUpdate = u : s.next = u,
                    c.lastBaseUpdate = l)
                }
                if (null !== i) {
                    var d = a.baseState;
                    for (o = 0,
                    c = u = l = null,
                    s = i; ; ) {
                        var m = s.lane
                          , f = s.eventTime;
                        if ((r & m) === m) {
                            null !== c && (c = c.next = {
                                eventTime: f,
                                lane: 0,
                                tag: s.tag,
                                payload: s.payload,
                                callback: s.callback,
                                next: null
                            });
                            e: {
                                var h = e
                                  , p = s;
                                switch (m = t,
                                f = n,
                                p.tag) {
                                case 1:
                                    if ("function" == typeof (h = p.payload)) {
                                        d = h.call(f, d, m);
                                        break e
                                    }
                                    d = h;
                                    break e;
                                case 3:
                                    h.flags = -65537 & h.flags | 128;
                                case 0:
                                    if (null == (m = "function" == typeof (h = p.payload) ? h.call(f, d, m) : h))
                                        break e;
                                    d = z({}, d, m);
                                    break e;
                                case 2:
                                    Oi = !0
                                }
                            }
                            null !== s.callback && 0 !== s.lane && (e.flags |= 64,
                            null === (m = a.effects) ? a.effects = [s] : m.push(s))
                        } else
                            f = {
                                eventTime: f,
                                lane: m,
                                tag: s.tag,
                                payload: s.payload,
                                callback: s.callback,
                                next: null
                            },
                            null === c ? (u = c = f,
                            l = d) : c = c.next = f,
                            o |= m;
                        if (null === (s = s.next)) {
                            if (null === (s = a.shared.pending))
                                break;
                            s = (m = s).next,
                            m.next = null,
                            a.lastBaseUpdate = m,
                            a.shared.pending = null
                        }
                    }
                    if (null === c && (l = d),
                    a.baseState = l,
                    a.firstBaseUpdate = u,
                    a.lastBaseUpdate = c,
                    null !== (t = a.shared.interleaved)) {
                        a = t;
                        do {
                            o |= a.lane,
                            a = a.next
                        } while (a !== t)
                    } else
                        null === i && (a.shared.lanes = 0);
                    jl |= o,
                    e.lanes = o,
                    e.memoizedState = d
                }
            }
            function $i(e, t, n) {
                if (e = t.effects,
                t.effects = null,
                null !== e)
                    for (t = 0; t < e.length; t++) {
                        var r = e[t]
                          , a = r.callback;
                        if (null !== a) {
                            if (r.callback = null,
                            r = n,
                            "function" != typeof a)
                                throw Error(i(191, a));
                            a.call(r)
                        }
                    }
            }
            var Wi = {}
              , Hi = ka(Wi)
              , Yi = ka(Wi)
              , Ki = ka(Wi);
            function Qi(e) {
                if (e === Wi)
                    throw Error(i(174));
                return e
            }
            function qi(e, t) {
                switch (Ea(Ki, t),
                Ea(Yi, e),
                Ea(Hi, Wi),
                e = t.nodeType) {
                case 9:
                case 11:
                    t = (t = t.documentElement) ? t.namespaceURI : le(null, "");
                    break;
                default:
                    t = le(t = (e = 8 === e ? t.parentNode : t).namespaceURI || null, e = e.tagName)
                }
                Sa(Hi),
                Ea(Hi, t)
            }
            function Xi() {
                Sa(Hi),
                Sa(Yi),
                Sa(Ki)
            }
            function Gi(e) {
                Qi(Ki.current);
                var t = Qi(Hi.current)
                  , n = le(t, e.type);
                t !== n && (Ea(Yi, e),
                Ea(Hi, n))
            }
            function Zi(e) {
                Yi.current === e && (Sa(Hi),
                Sa(Yi))
            }
            var Ji = ka(0);
            function eo(e) {
                for (var t = e; null !== t; ) {
                    if (13 === t.tag) {
                        var n = t.memoizedState;
                        if (null !== n && (null === (n = n.dehydrated) || "$?" === n.data || "$!" === n.data))
                            return t
                    } else if (19 === t.tag && void 0 !== t.memoizedProps.revealOrder) {
                        if (128 & t.flags)
                            return t
                    } else if (null !== t.child) {
                        t.child.return = t,
                        t = t.child;
                        continue
                    }
                    if (t === e)
                        break;
                    for (; null === t.sibling; ) {
                        if (null === t.return || t.return === e)
                            return null;
                        t = t.return
                    }
                    t.sibling.return = t.return,
                    t = t.sibling
                }
                return null
            }
            var to = [];
            function no() {
                for (var e = 0; e < to.length; e++)
                    to[e]._workInProgressVersionPrimary = null;
                to.length = 0
            }
            var ro = w.ReactCurrentDispatcher
              , ao = w.ReactCurrentBatchConfig
              , io = 0
              , oo = null
              , so = null
              , lo = null
              , uo = !1
              , co = !1
              , mo = 0
              , fo = 0;
            function ho() {
                throw Error(i(321))
            }
            function po(e, t) {
                if (null === t)
                    return !1;
                for (var n = 0; n < t.length && n < e.length; n++)
                    if (!sr(e[n], t[n]))
                        return !1;
                return !0
            }
            function go(e, t, n, r, a, o) {
                if (io = o,
                oo = t,
                t.memoizedState = null,
                t.updateQueue = null,
                t.lanes = 0,
                ro.current = null === e || null === e.memoizedState ? Jo : es,
                e = n(r, a),
                co) {
                    o = 0;
                    do {
                        if (co = !1,
                        mo = 0,
                        25 <= o)
                            throw Error(i(301));
                        o += 1,
                        lo = so = null,
                        t.updateQueue = null,
                        ro.current = ts,
                        e = n(r, a)
                    } while (co)
                }
                if (ro.current = Zo,
                t = null !== so && null !== so.next,
                io = 0,
                lo = so = oo = null,
                uo = !1,
                t)
                    throw Error(i(300));
                return e
            }
            function yo() {
                var e = 0 !== mo;
                return mo = 0,
                e
            }
            function bo() {
                var e = {
                    memoizedState: null,
                    baseState: null,
                    baseQueue: null,
                    queue: null,
                    next: null
                };
                return null === lo ? oo.memoizedState = lo = e : lo = lo.next = e,
                lo
            }
            function vo() {
                if (null === so) {
                    var e = oo.alternate;
                    e = null !== e ? e.memoizedState : null
                } else
                    e = so.next;
                var t = null === lo ? oo.memoizedState : lo.next;
                if (null !== t)
                    lo = t,
                    so = e;
                else {
                    if (null === e)
                        throw Error(i(310));
                    e = {
                        memoizedState: (so = e).memoizedState,
                        baseState: so.baseState,
                        baseQueue: so.baseQueue,
                        queue: so.queue,
                        next: null
                    },
                    null === lo ? oo.memoizedState = lo = e : lo = lo.next = e
                }
                return lo
            }
            function wo(e, t) {
                return "function" == typeof t ? t(e) : t
            }
            function xo(e) {
                var t = vo()
                  , n = t.queue;
                if (null === n)
                    throw Error(i(311));
                n.lastRenderedReducer = e;
                var r = so
                  , a = r.baseQueue
                  , o = n.pending;
                if (null !== o) {
                    if (null !== a) {
                        var s = a.next;
                        a.next = o.next,
                        o.next = s
                    }
                    r.baseQueue = a = o,
                    n.pending = null
                }
                if (null !== a) {
                    o = a.next,
                    r = r.baseState;
                    var l = s = null
                      , u = null
                      , c = o;
                    do {
                        var d = c.lane;
                        if ((io & d) === d)
                            null !== u && (u = u.next = {
                                lane: 0,
                                action: c.action,
                                hasEagerState: c.hasEagerState,
                                eagerState: c.eagerState,
                                next: null
                            }),
                            r = c.hasEagerState ? c.eagerState : e(r, c.action);
                        else {
                            var m = {
                                lane: d,
                                action: c.action,
                                hasEagerState: c.hasEagerState,
                                eagerState: c.eagerState,
                                next: null
                            };
                            null === u ? (l = u = m,
                            s = r) : u = u.next = m,
                            oo.lanes |= d,
                            jl |= d
                        }
                        c = c.next
                    } while (null !== c && c !== o);
                    null === u ? s = r : u.next = l,
                    sr(r, t.memoizedState) || (vs = !0),
                    t.memoizedState = r,
                    t.baseState = s,
                    t.baseQueue = u,
                    n.lastRenderedState = r
                }
                if (null !== (e = n.interleaved)) {
                    a = e;
                    do {
                        o = a.lane,
                        oo.lanes |= o,
                        jl |= o,
                        a = a.next
                    } while (a !== e)
                } else
                    null === a && (n.lanes = 0);
                return [t.memoizedState, n.dispatch]
            }
            function _o(e) {
                var t = vo()
                  , n = t.queue;
                if (null === n)
                    throw Error(i(311));
                n.lastRenderedReducer = e;
                var r = n.dispatch
                  , a = n.pending
                  , o = t.memoizedState;
                if (null !== a) {
                    n.pending = null;
                    var s = a = a.next;
                    do {
                        o = e(o, s.action),
                        s = s.next
                    } while (s !== a);
                    sr(o, t.memoizedState) || (vs = !0),
                    t.memoizedState = o,
                    null === t.baseQueue && (t.baseState = o),
                    n.lastRenderedState = o
                }
                return [o, r]
            }
            function No() {}
            function ko(e, t) {
                var n = oo
                  , r = vo()
                  , a = t()
                  , o = !sr(r.memoizedState, a);
                if (o && (r.memoizedState = a,
                vs = !0),
                r = r.queue,
                jo(Po.bind(null, n, r, e), [e]),
                r.getSnapshot !== t || o || null !== lo && 1 & lo.memoizedState.tag) {
                    if (n.flags |= 2048,
                    Ao(9, Eo.bind(null, n, r, a, t), void 0, null),
                    null === Tl)
                        throw Error(i(349));
                    30 & io || So(n, t, a)
                }
                return a
            }
            function So(e, t, n) {
                e.flags |= 16384,
                e = {
                    getSnapshot: t,
                    value: n
                },
                null === (t = oo.updateQueue) ? (t = {
                    lastEffect: null,
                    stores: null
                },
                oo.updateQueue = t,
                t.stores = [e]) : null === (n = t.stores) ? t.stores = [e] : n.push(e)
            }
            function Eo(e, t, n, r) {
                t.value = n,
                t.getSnapshot = r,
                Co(t) && To(e)
            }
            function Po(e, t, n) {
                return n(function() {
                    Co(t) && To(e)
                })
            }
            function Co(e) {
                var t = e.getSnapshot;
                e = e.value;
                try {
                    var n = t();
                    return !sr(e, n)
                } catch (e) {
                    return !0
                }
            }
            function To(e) {
                var t = Li(e, 1);
                null !== t && nu(t, e, 1, -1)
            }
            function Mo(e) {
                var t = bo();
                return "function" == typeof e && (e = e()),
                t.memoizedState = t.baseState = e,
                e = {
                    pending: null,
                    interleaved: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: wo,
                    lastRenderedState: e
                },
                t.queue = e,
                e = e.dispatch = Qo.bind(null, oo, e),
                [t.memoizedState, e]
            }
            function Ao(e, t, n, r) {
                return e = {
                    tag: e,
                    create: t,
                    destroy: n,
                    deps: r,
                    next: null
                },
                null === (t = oo.updateQueue) ? (t = {
                    lastEffect: null,
                    stores: null
                },
                oo.updateQueue = t,
                t.lastEffect = e.next = e) : null === (n = t.lastEffect) ? t.lastEffect = e.next = e : (r = n.next,
                n.next = e,
                e.next = r,
                t.lastEffect = e),
                e
            }
            function Ro() {
                return vo().memoizedState
            }
            function Do(e, t, n, r) {
                var a = bo();
                oo.flags |= e,
                a.memoizedState = Ao(1 | t, n, void 0, void 0 === r ? null : r)
            }
            function Lo(e, t, n, r) {
                var a = vo();
                r = void 0 === r ? null : r;
                var i = void 0;
                if (null !== so) {
                    var o = so.memoizedState;
                    if (i = o.destroy,
                    null !== r && po(r, o.deps))
                        return void (a.memoizedState = Ao(t, n, i, r))
                }
                oo.flags |= e,
                a.memoizedState = Ao(1 | t, n, i, r)
            }
            function Oo(e, t) {
                return Do(8390656, 8, e, t)
            }
            function jo(e, t) {
                return Lo(2048, 8, e, t)
            }
            function zo(e, t) {
                return Lo(4, 2, e, t)
            }
            function Vo(e, t) {
                return Lo(4, 4, e, t)
            }
            function Fo(e, t) {
                return "function" == typeof t ? (e = e(),
                t(e),
                function() {
                    t(null)
                }
                ) : null != t ? (e = e(),
                t.current = e,
                function() {
                    t.current = null
                }
                ) : void 0
            }
            function Io(e, t, n) {
                return n = null != n ? n.concat([e]) : null,
                Lo(4, 4, Fo.bind(null, t, e), n)
            }
            function Uo() {}
            function Bo(e, t) {
                var n = vo();
                t = void 0 === t ? null : t;
                var r = n.memoizedState;
                return null !== r && null !== t && po(t, r[1]) ? r[0] : (n.memoizedState = [e, t],
                e)
            }
            function $o(e, t) {
                var n = vo();
                t = void 0 === t ? null : t;
                var r = n.memoizedState;
                return null !== r && null !== t && po(t, r[1]) ? r[0] : (e = e(),
                n.memoizedState = [e, t],
                e)
            }
            function Wo(e, t, n) {
                return 21 & io ? (sr(n, t) || (n = pt(),
                oo.lanes |= n,
                jl |= n,
                e.baseState = !0),
                t) : (e.baseState && (e.baseState = !1,
                vs = !0),
                e.memoizedState = n)
            }
            function Ho(e, t) {
                var n = vt;
                vt = 0 !== n && 4 > n ? n : 4,
                e(!0);
                var r = ao.transition;
                ao.transition = {};
                try {
                    e(!1),
                    t()
                } finally {
                    vt = n,
                    ao.transition = r
                }
            }
            function Yo() {
                return vo().memoizedState
            }
            function Ko(e, t, n) {
                var r = tu(e);
                n = {
                    lane: r,
                    action: n,
                    hasEagerState: !1,
                    eagerState: null,
                    next: null
                },
                qo(e) ? Xo(t, n) : null !== (n = Di(e, t, n, r)) && (nu(n, e, r, eu()),
                Go(n, t, r))
            }
            function Qo(e, t, n) {
                var r = tu(e)
                  , a = {
                    lane: r,
                    action: n,
                    hasEagerState: !1,
                    eagerState: null,
                    next: null
                };
                if (qo(e))
                    Xo(t, a);
                else {
                    var i = e.alternate;
                    if (0 === e.lanes && (null === i || 0 === i.lanes) && null !== (i = t.lastRenderedReducer))
                        try {
                            var o = t.lastRenderedState
                              , s = i(o, n);
                            if (a.hasEagerState = !0,
                            a.eagerState = s,
                            sr(s, o)) {
                                var l = t.interleaved;
                                return null === l ? (a.next = a,
                                Ri(t)) : (a.next = l.next,
                                l.next = a),
                                void (t.interleaved = a)
                            }
                        } catch (e) {}
                    null !== (n = Di(e, t, a, r)) && (nu(n, e, r, a = eu()),
                    Go(n, t, r))
                }
            }
            function qo(e) {
                var t = e.alternate;
                return e === oo || null !== t && t === oo
            }
            function Xo(e, t) {
                co = uo = !0;
                var n = e.pending;
                null === n ? t.next = t : (t.next = n.next,
                n.next = t),
                e.pending = t
            }
            function Go(e, t, n) {
                if (4194240 & n) {
                    var r = t.lanes;
                    n |= r &= e.pendingLanes,
                    t.lanes = n,
                    bt(e, n)
                }
            }
            var Zo = {
                readContext: Mi,
                useCallback: ho,
                useContext: ho,
                useEffect: ho,
                useImperativeHandle: ho,
                useInsertionEffect: ho,
                useLayoutEffect: ho,
                useMemo: ho,
                useReducer: ho,
                useRef: ho,
                useState: ho,
                useDebugValue: ho,
                useDeferredValue: ho,
                useTransition: ho,
                useMutableSource: ho,
                useSyncExternalStore: ho,
                useId: ho,
                unstable_isNewReconciler: !1
            }
              , Jo = {
                readContext: Mi,
                useCallback: function(e, t) {
                    return bo().memoizedState = [e, void 0 === t ? null : t],
                    e
                },
                useContext: Mi,
                useEffect: Oo,
                useImperativeHandle: function(e, t, n) {
                    return n = null != n ? n.concat([e]) : null,
                    Do(4194308, 4, Fo.bind(null, t, e), n)
                },
                useLayoutEffect: function(e, t) {
                    return Do(4194308, 4, e, t)
                },
                useInsertionEffect: function(e, t) {
                    return Do(4, 2, e, t)
                },
                useMemo: function(e, t) {
                    var n = bo();
                    return t = void 0 === t ? null : t,
                    e = e(),
                    n.memoizedState = [e, t],
                    e
                },
                useReducer: function(e, t, n) {
                    var r = bo();
                    return t = void 0 !== n ? n(t) : t,
                    r.memoizedState = r.baseState = t,
                    e = {
                        pending: null,
                        interleaved: null,
                        lanes: 0,
                        dispatch: null,
                        lastRenderedReducer: e,
                        lastRenderedState: t
                    },
                    r.queue = e,
                    e = e.dispatch = Ko.bind(null, oo, e),
                    [r.memoizedState, e]
                },
                useRef: function(e) {
                    return e = {
                        current: e
                    },
                    bo().memoizedState = e
                },
                useState: Mo,
                useDebugValue: Uo,
                useDeferredValue: function(e) {
                    return bo().memoizedState = e
                },
                useTransition: function() {
                    var e = Mo(!1)
                      , t = e[0];
                    return e = Ho.bind(null, e[1]),
                    bo().memoizedState = e,
                    [t, e]
                },
                useMutableSource: function() {},
                useSyncExternalStore: function(e, t, n) {
                    var r = oo
                      , a = bo();
                    if (ai) {
                        if (void 0 === n)
                            throw Error(i(407));
                        n = n()
                    } else {
                        if (n = t(),
                        null === Tl)
                            throw Error(i(349));
                        30 & io || So(r, t, n)
                    }
                    a.memoizedState = n;
                    var o = {
                        value: n,
                        getSnapshot: t
                    };
                    return a.queue = o,
                    Oo(Po.bind(null, r, o, e), [e]),
                    r.flags |= 2048,
                    Ao(9, Eo.bind(null, r, o, n, t), void 0, null),
                    n
                },
                useId: function() {
                    var e = bo()
                      , t = Tl.identifierPrefix;
                    if (ai) {
                        var n = Ga;
                        t = ":" + t + "R" + (n = (Xa & ~(1 << 32 - ot(Xa) - 1)).toString(32) + n),
                        0 < (n = mo++) && (t += "H" + n.toString(32)),
                        t += ":"
                    } else
                        t = ":" + t + "r" + (n = fo++).toString(32) + ":";
                    return e.memoizedState = t
                },
                unstable_isNewReconciler: !1
            }
              , es = {
                readContext: Mi,
                useCallback: Bo,
                useContext: Mi,
                useEffect: jo,
                useImperativeHandle: Io,
                useInsertionEffect: zo,
                useLayoutEffect: Vo,
                useMemo: $o,
                useReducer: xo,
                useRef: Ro,
                useState: function() {
                    return xo(wo)
                },
                useDebugValue: Uo,
                useDeferredValue: function(e) {
                    return Wo(vo(), so.memoizedState, e)
                },
                useTransition: function() {
                    return [xo(wo)[0], vo().memoizedState]
                },
                useMutableSource: No,
                useSyncExternalStore: ko,
                useId: Yo,
                unstable_isNewReconciler: !1
            }
              , ts = {
                readContext: Mi,
                useCallback: Bo,
                useContext: Mi,
                useEffect: jo,
                useImperativeHandle: Io,
                useInsertionEffect: zo,
                useLayoutEffect: Vo,
                useMemo: $o,
                useReducer: _o,
                useRef: Ro,
                useState: function() {
                    return _o(wo)
                },
                useDebugValue: Uo,
                useDeferredValue: function(e) {
                    var t = vo();
                    return null === so ? t.memoizedState = e : Wo(t, so.memoizedState, e)
                },
                useTransition: function() {
                    return [_o(wo)[0], vo().memoizedState]
                },
                useMutableSource: No,
                useSyncExternalStore: ko,
                useId: Yo,
                unstable_isNewReconciler: !1
            };
            function ns(e, t) {
                if (e && e.defaultProps) {
                    for (var n in t = z({}, t),
                    e = e.defaultProps)
                        void 0 === t[n] && (t[n] = e[n]);
                    return t
                }
                return t
            }
            function rs(e, t, n, r) {
                n = null == (n = n(r, t = e.memoizedState)) ? t : z({}, t, n),
                e.memoizedState = n,
                0 === e.lanes && (e.updateQueue.baseState = n)
            }
            var as = {
                isMounted: function(e) {
                    return !!(e = e._reactInternals) && Be(e) === e
                },
                enqueueSetState: function(e, t, n) {
                    e = e._reactInternals;
                    var r = eu()
                      , a = tu(e)
                      , i = Vi(r, a);
                    i.payload = t,
                    null != n && (i.callback = n),
                    null !== (t = Fi(e, i, a)) && (nu(t, e, a, r),
                    Ii(t, e, a))
                },
                enqueueReplaceState: function(e, t, n) {
                    e = e._reactInternals;
                    var r = eu()
                      , a = tu(e)
                      , i = Vi(r, a);
                    i.tag = 1,
                    i.payload = t,
                    null != n && (i.callback = n),
                    null !== (t = Fi(e, i, a)) && (nu(t, e, a, r),
                    Ii(t, e, a))
                },
                enqueueForceUpdate: function(e, t) {
                    e = e._reactInternals;
                    var n = eu()
                      , r = tu(e)
                      , a = Vi(n, r);
                    a.tag = 2,
                    null != t && (a.callback = t),
                    null !== (t = Fi(e, a, r)) && (nu(t, e, r, n),
                    Ii(t, e, r))
                }
            };
            function is(e, t, n, r, a, i, o) {
                return "function" == typeof (e = e.stateNode).shouldComponentUpdate ? e.shouldComponentUpdate(r, i, o) : !(t.prototype && t.prototype.isPureReactComponent && lr(n, r) && lr(a, i))
            }
            function os(e, t, n) {
                var r = !1
                  , a = Pa
                  , i = t.contextType;
                return "object" == typeof i && null !== i ? i = Mi(i) : (a = Ra(t) ? Ma : Ca.current,
                i = (r = null != (r = t.contextTypes)) ? Aa(e, a) : Pa),
                t = new t(n,i),
                e.memoizedState = null !== t.state && void 0 !== t.state ? t.state : null,
                t.updater = as,
                e.stateNode = t,
                t._reactInternals = e,
                r && ((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = a,
                e.__reactInternalMemoizedMaskedChildContext = i),
                t
            }
            function ss(e, t, n, r) {
                e = t.state,
                "function" == typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r),
                "function" == typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, r),
                t.state !== e && as.enqueueReplaceState(t, t.state, null)
            }
            function ls(e, t, n, r) {
                var a = e.stateNode;
                a.props = n,
                a.state = e.memoizedState,
                a.refs = {},
                ji(e);
                var i = t.contextType;
                "object" == typeof i && null !== i ? a.context = Mi(i) : (i = Ra(t) ? Ma : Ca.current,
                a.context = Aa(e, i)),
                a.state = e.memoizedState,
                "function" == typeof (i = t.getDerivedStateFromProps) && (rs(e, t, i, n),
                a.state = e.memoizedState),
                "function" == typeof t.getDerivedStateFromProps || "function" == typeof a.getSnapshotBeforeUpdate || "function" != typeof a.UNSAFE_componentWillMount && "function" != typeof a.componentWillMount || (t = a.state,
                "function" == typeof a.componentWillMount && a.componentWillMount(),
                "function" == typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount(),
                t !== a.state && as.enqueueReplaceState(a, a.state, null),
                Bi(e, n, a, r),
                a.state = e.memoizedState),
                "function" == typeof a.componentDidMount && (e.flags |= 4194308)
            }
            function us(e, t) {
                try {
                    var n = ""
                      , r = t;
                    do {
                        n += U(r),
                        r = r.return
                    } while (r);
                    var a = n
                } catch (e) {
                    a = "\nError generating stack: " + e.message + "\n" + e.stack
                }
                return {
                    value: e,
                    source: t,
                    stack: a,
                    digest: null
                }
            }
            function cs(e, t, n) {
                return {
                    value: e,
                    source: null,
                    stack: null != n ? n : null,
                    digest: null != t ? t : null
                }
            }
            function ds(e, t) {
                try {
                    console.error(t.value)
                } catch (e) {
                    setTimeout(function() {
                        throw e
                    })
                }
            }
            var ms = "function" == typeof WeakMap ? WeakMap : Map;
            function fs(e, t, n) {
                (n = Vi(-1, n)).tag = 3,
                n.payload = {
                    element: null
                };
                var r = t.value;
                return n.callback = function() {
                    Wl || (Wl = !0,
                    Hl = r),
                    ds(0, t)
                }
                ,
                n
            }
            function hs(e, t, n) {
                (n = Vi(-1, n)).tag = 3;
                var r = e.type.getDerivedStateFromError;
                if ("function" == typeof r) {
                    var a = t.value;
                    n.payload = function() {
                        return r(a)
                    }
                    ,
                    n.callback = function() {
                        ds(0, t)
                    }
                }
                var i = e.stateNode;
                return null !== i && "function" == typeof i.componentDidCatch && (n.callback = function() {
                    ds(0, t),
                    "function" != typeof r && (null === Yl ? Yl = new Set([this]) : Yl.add(this));
                    var e = t.stack;
                    this.componentDidCatch(t.value, {
                        componentStack: null !== e ? e : ""
                    })
                }
                ),
                n
            }
            function ps(e, t, n) {
                var r = e.pingCache;
                if (null === r) {
                    r = e.pingCache = new ms;
                    var a = new Set;
                    r.set(t, a)
                } else
                    void 0 === (a = r.get(t)) && (a = new Set,
                    r.set(t, a));
                a.has(n) || (a.add(n),
                e = Su.bind(null, e, t, n),
                t.then(e, e))
            }
            function gs(e) {
                do {
                    var t;
                    if ((t = 13 === e.tag) && (t = null === (t = e.memoizedState) || null !== t.dehydrated),
                    t)
                        return e;
                    e = e.return
                } while (null !== e);
                return null
            }
            function ys(e, t, n, r, a) {
                return 1 & e.mode ? (e.flags |= 65536,
                e.lanes = a,
                e) : (e === t ? e.flags |= 65536 : (e.flags |= 128,
                n.flags |= 131072,
                n.flags &= -52805,
                1 === n.tag && (null === n.alternate ? n.tag = 17 : ((t = Vi(-1, 1)).tag = 2,
                Fi(n, t, 1))),
                n.lanes |= 1),
                e)
            }
            var bs = w.ReactCurrentOwner
              , vs = !1;
            function ws(e, t, n, r) {
                t.child = null === e ? xi(t, null, n, r) : wi(t, e.child, n, r)
            }
            function xs(e, t, n, r, a) {
                n = n.render;
                var i = t.ref;
                return Ti(t, a),
                r = go(e, t, n, r, i, a),
                n = yo(),
                null === e || vs ? (ai && n && ei(t),
                t.flags |= 1,
                ws(e, t, r, a),
                t.child) : (t.updateQueue = e.updateQueue,
                t.flags &= -2053,
                e.lanes &= ~a,
                Ws(e, t, a))
            }
            function _s(e, t, n, r, a) {
                if (null === e) {
                    var i = n.type;
                    return "function" != typeof i || Ru(i) || void 0 !== i.defaultProps || null !== n.compare || void 0 !== n.defaultProps ? ((e = Lu(n.type, null, r, t, t.mode, a)).ref = t.ref,
                    e.return = t,
                    t.child = e) : (t.tag = 15,
                    t.type = i,
                    Ns(e, t, i, r, a))
                }
                if (i = e.child,
                0 === (e.lanes & a)) {
                    var o = i.memoizedProps;
                    if ((n = null !== (n = n.compare) ? n : lr)(o, r) && e.ref === t.ref)
                        return Ws(e, t, a)
                }
                return t.flags |= 1,
                (e = Du(i, r)).ref = t.ref,
                e.return = t,
                t.child = e
            }
            function Ns(e, t, n, r, a) {
                if (null !== e) {
                    var i = e.memoizedProps;
                    if (lr(i, r) && e.ref === t.ref) {
                        if (vs = !1,
                        t.pendingProps = r = i,
                        0 === (e.lanes & a))
                            return t.lanes = e.lanes,
                            Ws(e, t, a);
                        131072 & e.flags && (vs = !0)
                    }
                }
                return Es(e, t, n, r, a)
            }
            function ks(e, t, n) {
                var r = t.pendingProps
                  , a = r.children
                  , i = null !== e ? e.memoizedState : null;
                if ("hidden" === r.mode)
                    if (1 & t.mode) {
                        if (!(1073741824 & n))
                            return e = null !== i ? i.baseLanes | n : n,
                            t.lanes = t.childLanes = 1073741824,
                            t.memoizedState = {
                                baseLanes: e,
                                cachePool: null,
                                transitions: null
                            },
                            t.updateQueue = null,
                            Ea(Dl, Rl),
                            Rl |= e,
                            null;
                        t.memoizedState = {
                            baseLanes: 0,
                            cachePool: null,
                            transitions: null
                        },
                        r = null !== i ? i.baseLanes : n,
                        Ea(Dl, Rl),
                        Rl |= r
                    } else
                        t.memoizedState = {
                            baseLanes: 0,
                            cachePool: null,
                            transitions: null
                        },
                        Ea(Dl, Rl),
                        Rl |= n;
                else
                    null !== i ? (r = i.baseLanes | n,
                    t.memoizedState = null) : r = n,
                    Ea(Dl, Rl),
                    Rl |= r;
                return ws(e, t, a, n),
                t.child
            }
            function Ss(e, t) {
                var n = t.ref;
                (null === e && null !== n || null !== e && e.ref !== n) && (t.flags |= 512,
                t.flags |= 2097152)
            }
            function Es(e, t, n, r, a) {
                var i = Ra(n) ? Ma : Ca.current;
                return i = Aa(t, i),
                Ti(t, a),
                n = go(e, t, n, r, i, a),
                r = yo(),
                null === e || vs ? (ai && r && ei(t),
                t.flags |= 1,
                ws(e, t, n, a),
                t.child) : (t.updateQueue = e.updateQueue,
                t.flags &= -2053,
                e.lanes &= ~a,
                Ws(e, t, a))
            }
            function Ps(e, t, n, r, a) {
                if (Ra(n)) {
                    var i = !0;
                    ja(t)
                } else
                    i = !1;
                if (Ti(t, a),
                null === t.stateNode)
                    $s(e, t),
                    os(t, n, r),
                    ls(t, n, r, a),
                    r = !0;
                else if (null === e) {
                    var o = t.stateNode
                      , s = t.memoizedProps;
                    o.props = s;
                    var l = o.context
                      , u = n.contextType;
                    u = "object" == typeof u && null !== u ? Mi(u) : Aa(t, u = Ra(n) ? Ma : Ca.current);
                    var c = n.getDerivedStateFromProps
                      , d = "function" == typeof c || "function" == typeof o.getSnapshotBeforeUpdate;
                    d || "function" != typeof o.UNSAFE_componentWillReceiveProps && "function" != typeof o.componentWillReceiveProps || (s !== r || l !== u) && ss(t, o, r, u),
                    Oi = !1;
                    var m = t.memoizedState;
                    o.state = m,
                    Bi(t, r, o, a),
                    l = t.memoizedState,
                    s !== r || m !== l || Ta.current || Oi ? ("function" == typeof c && (rs(t, n, c, r),
                    l = t.memoizedState),
                    (s = Oi || is(t, n, s, r, m, l, u)) ? (d || "function" != typeof o.UNSAFE_componentWillMount && "function" != typeof o.componentWillMount || ("function" == typeof o.componentWillMount && o.componentWillMount(),
                    "function" == typeof o.UNSAFE_componentWillMount && o.UNSAFE_componentWillMount()),
                    "function" == typeof o.componentDidMount && (t.flags |= 4194308)) : ("function" == typeof o.componentDidMount && (t.flags |= 4194308),
                    t.memoizedProps = r,
                    t.memoizedState = l),
                    o.props = r,
                    o.state = l,
                    o.context = u,
                    r = s) : ("function" == typeof o.componentDidMount && (t.flags |= 4194308),
                    r = !1)
                } else {
                    o = t.stateNode,
                    zi(e, t),
                    s = t.memoizedProps,
                    u = t.type === t.elementType ? s : ns(t.type, s),
                    o.props = u,
                    d = t.pendingProps,
                    m = o.context,
                    l = "object" == typeof (l = n.contextType) && null !== l ? Mi(l) : Aa(t, l = Ra(n) ? Ma : Ca.current);
                    var f = n.getDerivedStateFromProps;
                    (c = "function" == typeof f || "function" == typeof o.getSnapshotBeforeUpdate) || "function" != typeof o.UNSAFE_componentWillReceiveProps && "function" != typeof o.componentWillReceiveProps || (s !== d || m !== l) && ss(t, o, r, l),
                    Oi = !1,
                    m = t.memoizedState,
                    o.state = m,
                    Bi(t, r, o, a);
                    var h = t.memoizedState;
                    s !== d || m !== h || Ta.current || Oi ? ("function" == typeof f && (rs(t, n, f, r),
                    h = t.memoizedState),
                    (u = Oi || is(t, n, u, r, m, h, l) || !1) ? (c || "function" != typeof o.UNSAFE_componentWillUpdate && "function" != typeof o.componentWillUpdate || ("function" == typeof o.componentWillUpdate && o.componentWillUpdate(r, h, l),
                    "function" == typeof o.UNSAFE_componentWillUpdate && o.UNSAFE_componentWillUpdate(r, h, l)),
                    "function" == typeof o.componentDidUpdate && (t.flags |= 4),
                    "function" == typeof o.getSnapshotBeforeUpdate && (t.flags |= 1024)) : ("function" != typeof o.componentDidUpdate || s === e.memoizedProps && m === e.memoizedState || (t.flags |= 4),
                    "function" != typeof o.getSnapshotBeforeUpdate || s === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024),
                    t.memoizedProps = r,
                    t.memoizedState = h),
                    o.props = r,
                    o.state = h,
                    o.context = l,
                    r = u) : ("function" != typeof o.componentDidUpdate || s === e.memoizedProps && m === e.memoizedState || (t.flags |= 4),
                    "function" != typeof o.getSnapshotBeforeUpdate || s === e.memoizedProps && m === e.memoizedState || (t.flags |= 1024),
                    r = !1)
                }
                return Cs(e, t, n, r, i, a)
            }
            function Cs(e, t, n, r, a, i) {
                Ss(e, t);
                var o = !!(128 & t.flags);
                if (!r && !o)
                    return a && za(t, n, !1),
                    Ws(e, t, i);
                r = t.stateNode,
                bs.current = t;
                var s = o && "function" != typeof n.getDerivedStateFromError ? null : r.render();
                return t.flags |= 1,
                null !== e && o ? (t.child = wi(t, e.child, null, i),
                t.child = wi(t, null, s, i)) : ws(e, t, s, i),
                t.memoizedState = r.state,
                a && za(t, n, !0),
                t.child
            }
            function Ts(e) {
                var t = e.stateNode;
                t.pendingContext ? La(0, t.pendingContext, t.pendingContext !== t.context) : t.context && La(0, t.context, !1),
                qi(e, t.containerInfo)
            }
            function Ms(e, t, n, r, a) {
                return fi(),
                hi(a),
                t.flags |= 256,
                ws(e, t, n, r),
                t.child
            }
            var As, Rs, Ds, Ls, Os = {
                dehydrated: null,
                treeContext: null,
                retryLane: 0
            };
            function js(e) {
                return {
                    baseLanes: e,
                    cachePool: null,
                    transitions: null
                }
            }
            function zs(e, t, n) {
                var r, a = t.pendingProps, o = Ji.current, s = !1, l = !!(128 & t.flags);
                if ((r = l) || (r = (null === e || null !== e.memoizedState) && !!(2 & o)),
                r ? (s = !0,
                t.flags &= -129) : null !== e && null === e.memoizedState || (o |= 1),
                Ea(Ji, 1 & o),
                null === e)
                    return ui(t),
                    null !== (e = t.memoizedState) && null !== (e = e.dehydrated) ? (1 & t.mode ? "$!" === e.data ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1,
                    null) : (l = a.children,
                    e = a.fallback,
                    s ? (a = t.mode,
                    s = t.child,
                    l = {
                        mode: "hidden",
                        children: l
                    },
                    1 & a || null === s ? s = ju(l, a, 0, null) : (s.childLanes = 0,
                    s.pendingProps = l),
                    e = Ou(e, a, n, null),
                    s.return = t,
                    e.return = t,
                    s.sibling = e,
                    t.child = s,
                    t.child.memoizedState = js(n),
                    t.memoizedState = Os,
                    e) : Vs(t, l));
                if (null !== (o = e.memoizedState) && null !== (r = o.dehydrated))
                    return function(e, t, n, r, a, o, s) {
                        if (n)
                            return 256 & t.flags ? (t.flags &= -257,
                            Fs(e, t, s, r = cs(Error(i(422))))) : null !== t.memoizedState ? (t.child = e.child,
                            t.flags |= 128,
                            null) : (o = r.fallback,
                            a = t.mode,
                            r = ju({
                                mode: "visible",
                                children: r.children
                            }, a, 0, null),
                            (o = Ou(o, a, s, null)).flags |= 2,
                            r.return = t,
                            o.return = t,
                            r.sibling = o,
                            t.child = r,
                            1 & t.mode && wi(t, e.child, null, s),
                            t.child.memoizedState = js(s),
                            t.memoizedState = Os,
                            o);
                        if (!(1 & t.mode))
                            return Fs(e, t, s, null);
                        if ("$!" === a.data) {
                            if (r = a.nextSibling && a.nextSibling.dataset)
                                var l = r.dgst;
                            return r = l,
                            Fs(e, t, s, r = cs(o = Error(i(419)), r, void 0))
                        }
                        if (l = 0 !== (s & e.childLanes),
                        vs || l) {
                            if (null !== (r = Tl)) {
                                switch (s & -s) {
                                case 4:
                                    a = 2;
                                    break;
                                case 16:
                                    a = 8;
                                    break;
                                case 64:
                                case 128:
                                case 256:
                                case 512:
                                case 1024:
                                case 2048:
                                case 4096:
                                case 8192:
                                case 16384:
                                case 32768:
                                case 65536:
                                case 131072:
                                case 262144:
                                case 524288:
                                case 1048576:
                                case 2097152:
                                case 4194304:
                                case 8388608:
                                case 16777216:
                                case 33554432:
                                case 67108864:
                                    a = 32;
                                    break;
                                case 536870912:
                                    a = 268435456;
                                    break;
                                default:
                                    a = 0
                                }
                                0 !== (a = 0 !== (a & (r.suspendedLanes | s)) ? 0 : a) && a !== o.retryLane && (o.retryLane = a,
                                Li(e, a),
                                nu(r, e, a, -1))
                            }
                            return pu(),
                            Fs(e, t, s, r = cs(Error(i(421))))
                        }
                        return "$?" === a.data ? (t.flags |= 128,
                        t.child = e.child,
                        t = Pu.bind(null, e),
                        a._reactRetry = t,
                        null) : (e = o.treeContext,
                        ri = ua(a.nextSibling),
                        ni = t,
                        ai = !0,
                        ii = null,
                        null !== e && (Ka[Qa++] = Xa,
                        Ka[Qa++] = Ga,
                        Ka[Qa++] = qa,
                        Xa = e.id,
                        Ga = e.overflow,
                        qa = t),
                        (t = Vs(t, r.children)).flags |= 4096,
                        t)
                    }(e, t, l, a, r, o, n);
                if (s) {
                    s = a.fallback,
                    l = t.mode,
                    r = (o = e.child).sibling;
                    var u = {
                        mode: "hidden",
                        children: a.children
                    };
                    return 1 & l || t.child === o ? (a = Du(o, u)).subtreeFlags = 14680064 & o.subtreeFlags : ((a = t.child).childLanes = 0,
                    a.pendingProps = u,
                    t.deletions = null),
                    null !== r ? s = Du(r, s) : (s = Ou(s, l, n, null)).flags |= 2,
                    s.return = t,
                    a.return = t,
                    a.sibling = s,
                    t.child = a,
                    a = s,
                    s = t.child,
                    l = null === (l = e.child.memoizedState) ? js(n) : {
                        baseLanes: l.baseLanes | n,
                        cachePool: null,
                        transitions: l.transitions
                    },
                    s.memoizedState = l,
                    s.childLanes = e.childLanes & ~n,
                    t.memoizedState = Os,
                    a
                }
                return e = (s = e.child).sibling,
                a = Du(s, {
                    mode: "visible",
                    children: a.children
                }),
                !(1 & t.mode) && (a.lanes = n),
                a.return = t,
                a.sibling = null,
                null !== e && (null === (n = t.deletions) ? (t.deletions = [e],
                t.flags |= 16) : n.push(e)),
                t.child = a,
                t.memoizedState = null,
                a
            }
            function Vs(e, t) {
                return (t = ju({
                    mode: "visible",
                    children: t
                }, e.mode, 0, null)).return = e,
                e.child = t
            }
            function Fs(e, t, n, r) {
                return null !== r && hi(r),
                wi(t, e.child, null, n),
                (e = Vs(t, t.pendingProps.children)).flags |= 2,
                t.memoizedState = null,
                e
            }
            function Is(e, t, n) {
                e.lanes |= t;
                var r = e.alternate;
                null !== r && (r.lanes |= t),
                Ci(e.return, t, n)
            }
            function Us(e, t, n, r, a) {
                var i = e.memoizedState;
                null === i ? e.memoizedState = {
                    isBackwards: t,
                    rendering: null,
                    renderingStartTime: 0,
                    last: r,
                    tail: n,
                    tailMode: a
                } : (i.isBackwards = t,
                i.rendering = null,
                i.renderingStartTime = 0,
                i.last = r,
                i.tail = n,
                i.tailMode = a)
            }
            function Bs(e, t, n) {
                var r = t.pendingProps
                  , a = r.revealOrder
                  , i = r.tail;
                if (ws(e, t, r.children, n),
                2 & (r = Ji.current))
                    r = 1 & r | 2,
                    t.flags |= 128;
                else {
                    if (null !== e && 128 & e.flags)
                        e: for (e = t.child; null !== e; ) {
                            if (13 === e.tag)
                                null !== e.memoizedState && Is(e, n, t);
                            else if (19 === e.tag)
                                Is(e, n, t);
                            else if (null !== e.child) {
                                e.child.return = e,
                                e = e.child;
                                continue
                            }
                            if (e === t)
                                break e;
                            for (; null === e.sibling; ) {
                                if (null === e.return || e.return === t)
                                    break e;
                                e = e.return
                            }
                            e.sibling.return = e.return,
                            e = e.sibling
                        }
                    r &= 1
                }
                if (Ea(Ji, r),
                1 & t.mode)
                    switch (a) {
                    case "forwards":
                        for (n = t.child,
                        a = null; null !== n; )
                            null !== (e = n.alternate) && null === eo(e) && (a = n),
                            n = n.sibling;
                        null === (n = a) ? (a = t.child,
                        t.child = null) : (a = n.sibling,
                        n.sibling = null),
                        Us(t, !1, a, n, i);
                        break;
                    case "backwards":
                        for (n = null,
                        a = t.child,
                        t.child = null; null !== a; ) {
                            if (null !== (e = a.alternate) && null === eo(e)) {
                                t.child = a;
                                break
                            }
                            e = a.sibling,
                            a.sibling = n,
                            n = a,
                            a = e
                        }
                        Us(t, !0, n, null, i);
                        break;
                    case "together":
                        Us(t, !1, null, null, void 0);
                        break;
                    default:
                        t.memoizedState = null
                    }
                else
                    t.memoizedState = null;
                return t.child
            }
            function $s(e, t) {
                !(1 & t.mode) && null !== e && (e.alternate = null,
                t.alternate = null,
                t.flags |= 2)
            }
            function Ws(e, t, n) {
                if (null !== e && (t.dependencies = e.dependencies),
                jl |= t.lanes,
                0 === (n & t.childLanes))
                    return null;
                if (null !== e && t.child !== e.child)
                    throw Error(i(153));
                if (null !== t.child) {
                    for (n = Du(e = t.child, e.pendingProps),
                    t.child = n,
                    n.return = t; null !== e.sibling; )
                        e = e.sibling,
                        (n = n.sibling = Du(e, e.pendingProps)).return = t;
                    n.sibling = null
                }
                return t.child
            }
            function Hs(e, t) {
                if (!ai)
                    switch (e.tailMode) {
                    case "hidden":
                        t = e.tail;
                        for (var n = null; null !== t; )
                            null !== t.alternate && (n = t),
                            t = t.sibling;
                        null === n ? e.tail = null : n.sibling = null;
                        break;
                    case "collapsed":
                        n = e.tail;
                        for (var r = null; null !== n; )
                            null !== n.alternate && (r = n),
                            n = n.sibling;
                        null === r ? t || null === e.tail ? e.tail = null : e.tail.sibling = null : r.sibling = null
                    }
            }
            function Ys(e) {
                var t = null !== e.alternate && e.alternate.child === e.child
                  , n = 0
                  , r = 0;
                if (t)
                    for (var a = e.child; null !== a; )
                        n |= a.lanes | a.childLanes,
                        r |= 14680064 & a.subtreeFlags,
                        r |= 14680064 & a.flags,
                        a.return = e,
                        a = a.sibling;
                else
                    for (a = e.child; null !== a; )
                        n |= a.lanes | a.childLanes,
                        r |= a.subtreeFlags,
                        r |= a.flags,
                        a.return = e,
                        a = a.sibling;
                return e.subtreeFlags |= r,
                e.childLanes = n,
                t
            }
            function Ks(e, t, n) {
                var r = t.pendingProps;
                switch (ti(t),
                t.tag) {
                case 2:
                case 16:
                case 15:
                case 0:
                case 11:
                case 7:
                case 8:
                case 12:
                case 9:
                case 14:
                    return Ys(t),
                    null;
                case 1:
                case 17:
                    return Ra(t.type) && Da(),
                    Ys(t),
                    null;
                case 3:
                    return r = t.stateNode,
                    Xi(),
                    Sa(Ta),
                    Sa(Ca),
                    no(),
                    r.pendingContext && (r.context = r.pendingContext,
                    r.pendingContext = null),
                    null !== e && null !== e.child || (di(t) ? t.flags |= 4 : null === e || e.memoizedState.isDehydrated && !(256 & t.flags) || (t.flags |= 1024,
                    null !== ii && (ou(ii),
                    ii = null))),
                    Rs(e, t),
                    Ys(t),
                    null;
                case 5:
                    Zi(t);
                    var a = Qi(Ki.current);
                    if (n = t.type,
                    null !== e && null != t.stateNode)
                        Ds(e, t, n, r, a),
                        e.ref !== t.ref && (t.flags |= 512,
                        t.flags |= 2097152);
                    else {
                        if (!r) {
                            if (null === t.stateNode)
                                throw Error(i(166));
                            return Ys(t),
                            null
                        }
                        if (e = Qi(Hi.current),
                        di(t)) {
                            r = t.stateNode,
                            n = t.type;
                            var o = t.memoizedProps;
                            switch (r[ma] = t,
                            r[fa] = o,
                            e = !!(1 & t.mode),
                            n) {
                            case "dialog":
                                Fr("cancel", r),
                                Fr("close", r);
                                break;
                            case "iframe":
                            case "object":
                            case "embed":
                                Fr("load", r);
                                break;
                            case "video":
                            case "audio":
                                for (a = 0; a < Or.length; a++)
                                    Fr(Or[a], r);
                                break;
                            case "source":
                                Fr("error", r);
                                break;
                            case "img":
                            case "image":
                            case "link":
                                Fr("error", r),
                                Fr("load", r);
                                break;
                            case "details":
                                Fr("toggle", r);
                                break;
                            case "input":
                                X(r, o),
                                Fr("invalid", r);
                                break;
                            case "select":
                                r._wrapperState = {
                                    wasMultiple: !!o.multiple
                                },
                                Fr("invalid", r);
                                break;
                            case "textarea":
                                ae(r, o),
                                Fr("invalid", r)
                            }
                            for (var l in be(n, o),
                            a = null,
                            o)
                                if (o.hasOwnProperty(l)) {
                                    var u = o[l];
                                    "children" === l ? "string" == typeof u ? r.textContent !== u && (!0 !== o.suppressHydrationWarning && Zr(r.textContent, u, e),
                                    a = ["children", u]) : "number" == typeof u && r.textContent !== "" + u && (!0 !== o.suppressHydrationWarning && Zr(r.textContent, u, e),
                                    a = ["children", "" + u]) : s.hasOwnProperty(l) && null != u && "onScroll" === l && Fr("scroll", r)
                                }
                            switch (n) {
                            case "input":
                                Y(r),
                                J(r, o, !0);
                                break;
                            case "textarea":
                                Y(r),
                                oe(r);
                                break;
                            case "select":
                            case "option":
                                break;
                            default:
                                "function" == typeof o.onClick && (r.onclick = Jr)
                            }
                            r = a,
                            t.updateQueue = r,
                            null !== r && (t.flags |= 4)
                        } else {
                            l = 9 === a.nodeType ? a : a.ownerDocument,
                            "http://www.w3.org/1999/xhtml" === e && (e = se(n)),
                            "http://www.w3.org/1999/xhtml" === e ? "script" === n ? ((e = l.createElement("div")).innerHTML = "<script><\/script>",
                            e = e.removeChild(e.firstChild)) : "string" == typeof r.is ? e = l.createElement(n, {
                                is: r.is
                            }) : (e = l.createElement(n),
                            "select" === n && (l = e,
                            r.multiple ? l.multiple = !0 : r.size && (l.size = r.size))) : e = l.createElementNS(e, n),
                            e[ma] = t,
                            e[fa] = r,
                            As(e, t, !1, !1),
                            t.stateNode = e;
                            e: {
                                switch (l = ve(n, r),
                                n) {
                                case "dialog":
                                    Fr("cancel", e),
                                    Fr("close", e),
                                    a = r;
                                    break;
                                case "iframe":
                                case "object":
                                case "embed":
                                    Fr("load", e),
                                    a = r;
                                    break;
                                case "video":
                                case "audio":
                                    for (a = 0; a < Or.length; a++)
                                        Fr(Or[a], e);
                                    a = r;
                                    break;
                                case "source":
                                    Fr("error", e),
                                    a = r;
                                    break;
                                case "img":
                                case "image":
                                case "link":
                                    Fr("error", e),
                                    Fr("load", e),
                                    a = r;
                                    break;
                                case "details":
                                    Fr("toggle", e),
                                    a = r;
                                    break;
                                case "input":
                                    X(e, r),
                                    a = q(e, r),
                                    Fr("invalid", e);
                                    break;
                                case "option":
                                default:
                                    a = r;
                                    break;
                                case "select":
                                    e._wrapperState = {
                                        wasMultiple: !!r.multiple
                                    },
                                    a = z({}, r, {
                                        value: void 0
                                    }),
                                    Fr("invalid", e);
                                    break;
                                case "textarea":
                                    ae(e, r),
                                    a = re(e, r),
                                    Fr("invalid", e)
                                }
                                for (o in be(n, a),
                                u = a)
                                    if (u.hasOwnProperty(o)) {
                                        var c = u[o];
                                        "style" === o ? ge(e, c) : "dangerouslySetInnerHTML" === o ? null != (c = c ? c.__html : void 0) && de(e, c) : "children" === o ? "string" == typeof c ? ("textarea" !== n || "" !== c) && me(e, c) : "number" == typeof c && me(e, "" + c) : "suppressContentEditableWarning" !== o && "suppressHydrationWarning" !== o && "autoFocus" !== o && (s.hasOwnProperty(o) ? null != c && "onScroll" === o && Fr("scroll", e) : null != c && v(e, o, c, l))
                                    }
                                switch (n) {
                                case "input":
                                    Y(e),
                                    J(e, r, !1);
                                    break;
                                case "textarea":
                                    Y(e),
                                    oe(e);
                                    break;
                                case "option":
                                    null != r.value && e.setAttribute("value", "" + W(r.value));
                                    break;
                                case "select":
                                    e.multiple = !!r.multiple,
                                    null != (o = r.value) ? ne(e, !!r.multiple, o, !1) : null != r.defaultValue && ne(e, !!r.multiple, r.defaultValue, !0);
                                    break;
                                default:
                                    "function" == typeof a.onClick && (e.onclick = Jr)
                                }
                                switch (n) {
                                case "button":
                                case "input":
                                case "select":
                                case "textarea":
                                    r = !!r.autoFocus;
                                    break e;
                                case "img":
                                    r = !0;
                                    break e;
                                default:
                                    r = !1
                                }
                            }
                            r && (t.flags |= 4)
                        }
                        null !== t.ref && (t.flags |= 512,
                        t.flags |= 2097152)
                    }
                    return Ys(t),
                    null;
                case 6:
                    if (e && null != t.stateNode)
                        Ls(e, t, e.memoizedProps, r);
                    else {
                        if ("string" != typeof r && null === t.stateNode)
                            throw Error(i(166));
                        if (n = Qi(Ki.current),
                        Qi(Hi.current),
                        di(t)) {
                            if (r = t.stateNode,
                            n = t.memoizedProps,
                            r[ma] = t,
                            (o = r.nodeValue !== n) && null !== (e = ni))
                                switch (e.tag) {
                                case 3:
                                    Zr(r.nodeValue, n, !!(1 & e.mode));
                                    break;
                                case 5:
                                    !0 !== e.memoizedProps.suppressHydrationWarning && Zr(r.nodeValue, n, !!(1 & e.mode))
                                }
                            o && (t.flags |= 4)
                        } else
                            (r = (9 === n.nodeType ? n : n.ownerDocument).createTextNode(r))[ma] = t,
                            t.stateNode = r
                    }
                    return Ys(t),
                    null;
                case 13:
                    if (Sa(Ji),
                    r = t.memoizedState,
                    null === e || null !== e.memoizedState && null !== e.memoizedState.dehydrated) {
                        if (ai && null !== ri && 1 & t.mode && !(128 & t.flags))
                            mi(),
                            fi(),
                            t.flags |= 98560,
                            o = !1;
                        else if (o = di(t),
                        null !== r && null !== r.dehydrated) {
                            if (null === e) {
                                if (!o)
                                    throw Error(i(318));
                                if (!(o = null !== (o = t.memoizedState) ? o.dehydrated : null))
                                    throw Error(i(317));
                                o[ma] = t
                            } else
                                fi(),
                                !(128 & t.flags) && (t.memoizedState = null),
                                t.flags |= 4;
                            Ys(t),
                            o = !1
                        } else
                            null !== ii && (ou(ii),
                            ii = null),
                            o = !0;
                        if (!o)
                            return 65536 & t.flags ? t : null
                    }
                    return 128 & t.flags ? (t.lanes = n,
                    t) : ((r = null !== r) != (null !== e && null !== e.memoizedState) && r && (t.child.flags |= 8192,
                    1 & t.mode && (null === e || 1 & Ji.current ? 0 === Ll && (Ll = 3) : pu())),
                    null !== t.updateQueue && (t.flags |= 4),
                    Ys(t),
                    null);
                case 4:
                    return Xi(),
                    Rs(e, t),
                    null === e && Br(t.stateNode.containerInfo),
                    Ys(t),
                    null;
                case 10:
                    return Pi(t.type._context),
                    Ys(t),
                    null;
                case 19:
                    if (Sa(Ji),
                    null === (o = t.memoizedState))
                        return Ys(t),
                        null;
                    if (r = !!(128 & t.flags),
                    null === (l = o.rendering))
                        if (r)
                            Hs(o, !1);
                        else {
                            if (0 !== Ll || null !== e && 128 & e.flags)
                                for (e = t.child; null !== e; ) {
                                    if (null !== (l = eo(e))) {
                                        for (t.flags |= 128,
                                        Hs(o, !1),
                                        null !== (r = l.updateQueue) && (t.updateQueue = r,
                                        t.flags |= 4),
                                        t.subtreeFlags = 0,
                                        r = n,
                                        n = t.child; null !== n; )
                                            e = r,
                                            (o = n).flags &= 14680066,
                                            null === (l = o.alternate) ? (o.childLanes = 0,
                                            o.lanes = e,
                                            o.child = null,
                                            o.subtreeFlags = 0,
                                            o.memoizedProps = null,
                                            o.memoizedState = null,
                                            o.updateQueue = null,
                                            o.dependencies = null,
                                            o.stateNode = null) : (o.childLanes = l.childLanes,
                                            o.lanes = l.lanes,
                                            o.child = l.child,
                                            o.subtreeFlags = 0,
                                            o.deletions = null,
                                            o.memoizedProps = l.memoizedProps,
                                            o.memoizedState = l.memoizedState,
                                            o.updateQueue = l.updateQueue,
                                            o.type = l.type,
                                            e = l.dependencies,
                                            o.dependencies = null === e ? null : {
                                                lanes: e.lanes,
                                                firstContext: e.firstContext
                                            }),
                                            n = n.sibling;
                                        return Ea(Ji, 1 & Ji.current | 2),
                                        t.child
                                    }
                                    e = e.sibling
                                }
                            null !== o.tail && Ge() > Bl && (t.flags |= 128,
                            r = !0,
                            Hs(o, !1),
                            t.lanes = 4194304)
                        }
                    else {
                        if (!r)
                            if (null !== (e = eo(l))) {
                                if (t.flags |= 128,
                                r = !0,
                                null !== (n = e.updateQueue) && (t.updateQueue = n,
                                t.flags |= 4),
                                Hs(o, !0),
                                null === o.tail && "hidden" === o.tailMode && !l.alternate && !ai)
                                    return Ys(t),
                                    null
                            } else
                                2 * Ge() - o.renderingStartTime > Bl && 1073741824 !== n && (t.flags |= 128,
                                r = !0,
                                Hs(o, !1),
                                t.lanes = 4194304);
                        o.isBackwards ? (l.sibling = t.child,
                        t.child = l) : (null !== (n = o.last) ? n.sibling = l : t.child = l,
                        o.last = l)
                    }
                    return null !== o.tail ? (t = o.tail,
                    o.rendering = t,
                    o.tail = t.sibling,
                    o.renderingStartTime = Ge(),
                    t.sibling = null,
                    n = Ji.current,
                    Ea(Ji, r ? 1 & n | 2 : 1 & n),
                    t) : (Ys(t),
                    null);
                case 22:
                case 23:
                    return du(),
                    r = null !== t.memoizedState,
                    null !== e && null !== e.memoizedState !== r && (t.flags |= 8192),
                    r && 1 & t.mode ? !!(1073741824 & Rl) && (Ys(t),
                    6 & t.subtreeFlags && (t.flags |= 8192)) : Ys(t),
                    null;
                case 24:
                case 25:
                    return null
                }
                throw Error(i(156, t.tag))
            }
            function Qs(e, t) {
                switch (ti(t),
                t.tag) {
                case 1:
                    return Ra(t.type) && Da(),
                    65536 & (e = t.flags) ? (t.flags = -65537 & e | 128,
                    t) : null;
                case 3:
                    return Xi(),
                    Sa(Ta),
                    Sa(Ca),
                    no(),
                    65536 & (e = t.flags) && !(128 & e) ? (t.flags = -65537 & e | 128,
                    t) : null;
                case 5:
                    return Zi(t),
                    null;
                case 13:
                    if (Sa(Ji),
                    null !== (e = t.memoizedState) && null !== e.dehydrated) {
                        if (null === t.alternate)
                            throw Error(i(340));
                        fi()
                    }
                    return 65536 & (e = t.flags) ? (t.flags = -65537 & e | 128,
                    t) : null;
                case 19:
                    return Sa(Ji),
                    null;
                case 4:
                    return Xi(),
                    null;
                case 10:
                    return Pi(t.type._context),
                    null;
                case 22:
                case 23:
                    return du(),
                    null;
                default:
                    return null
                }
            }
            As = function(e, t) {
                for (var n = t.child; null !== n; ) {
                    if (5 === n.tag || 6 === n.tag)
                        e.appendChild(n.stateNode);
                    else if (4 !== n.tag && null !== n.child) {
                        n.child.return = n,
                        n = n.child;
                        continue
                    }
                    if (n === t)
                        break;
                    for (; null === n.sibling; ) {
                        if (null === n.return || n.return === t)
                            return;
                        n = n.return
                    }
                    n.sibling.return = n.return,
                    n = n.sibling
                }
            }
            ,
            Rs = function() {}
            ,
            Ds = function(e, t, n, r) {
                var a = e.memoizedProps;
                if (a !== r) {
                    e = t.stateNode,
                    Qi(Hi.current);
                    var i, o = null;
                    switch (n) {
                    case "input":
                        a = q(e, a),
                        r = q(e, r),
                        o = [];
                        break;
                    case "select":
                        a = z({}, a, {
                            value: void 0
                        }),
                        r = z({}, r, {
                            value: void 0
                        }),
                        o = [];
                        break;
                    case "textarea":
                        a = re(e, a),
                        r = re(e, r),
                        o = [];
                        break;
                    default:
                        "function" != typeof a.onClick && "function" == typeof r.onClick && (e.onclick = Jr)
                    }
                    for (c in be(n, r),
                    n = null,
                    a)
                        if (!r.hasOwnProperty(c) && a.hasOwnProperty(c) && null != a[c])
                            if ("style" === c) {
                                var l = a[c];
                                for (i in l)
                                    l.hasOwnProperty(i) && (n || (n = {}),
                                    n[i] = "")
                            } else
                                "dangerouslySetInnerHTML" !== c && "children" !== c && "suppressContentEditableWarning" !== c && "suppressHydrationWarning" !== c && "autoFocus" !== c && (s.hasOwnProperty(c) ? o || (o = []) : (o = o || []).push(c, null));
                    for (c in r) {
                        var u = r[c];
                        if (l = null != a ? a[c] : void 0,
                        r.hasOwnProperty(c) && u !== l && (null != u || null != l))
                            if ("style" === c)
                                if (l) {
                                    for (i in l)
                                        !l.hasOwnProperty(i) || u && u.hasOwnProperty(i) || (n || (n = {}),
                                        n[i] = "");
                                    for (i in u)
                                        u.hasOwnProperty(i) && l[i] !== u[i] && (n || (n = {}),
                                        n[i] = u[i])
                                } else
                                    n || (o || (o = []),
                                    o.push(c, n)),
                                    n = u;
                            else
                                "dangerouslySetInnerHTML" === c ? (u = u ? u.__html : void 0,
                                l = l ? l.__html : void 0,
                                null != u && l !== u && (o = o || []).push(c, u)) : "children" === c ? "string" != typeof u && "number" != typeof u || (o = o || []).push(c, "" + u) : "suppressContentEditableWarning" !== c && "suppressHydrationWarning" !== c && (s.hasOwnProperty(c) ? (null != u && "onScroll" === c && Fr("scroll", e),
                                o || l === u || (o = [])) : (o = o || []).push(c, u))
                    }
                    n && (o = o || []).push("style", n);
                    var c = o;
                    (t.updateQueue = c) && (t.flags |= 4)
                }
            }
            ,
            Ls = function(e, t, n, r) {
                n !== r && (t.flags |= 4)
            }
            ;
            var qs = !1
              , Xs = !1
              , Gs = "function" == typeof WeakSet ? WeakSet : Set
              , Zs = null;
            function Js(e, t) {
                var n = e.ref;
                if (null !== n)
                    if ("function" == typeof n)
                        try {
                            n(null)
                        } catch (n) {
                            ku(e, t, n)
                        }
                    else
                        n.current = null
            }
            function el(e, t, n) {
                try {
                    n()
                } catch (n) {
                    ku(e, t, n)
                }
            }
            var tl = !1;
            function nl(e, t, n) {
                var r = t.updateQueue;
                if (null !== (r = null !== r ? r.lastEffect : null)) {
                    var a = r = r.next;
                    do {
                        if ((a.tag & e) === e) {
                            var i = a.destroy;
                            a.destroy = void 0,
                            void 0 !== i && el(t, n, i)
                        }
                        a = a.next
                    } while (a !== r)
                }
            }
            function rl(e, t) {
                if (null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)) {
                    var n = t = t.next;
                    do {
                        if ((n.tag & e) === e) {
                            var r = n.create;
                            n.destroy = r()
                        }
                        n = n.next
                    } while (n !== t)
                }
            }
            function al(e) {
                var t = e.ref;
                if (null !== t) {
                    var n = e.stateNode;
                    e.tag,
                    e = n,
                    "function" == typeof t ? t(e) : t.current = e
                }
            }
            function il(e) {
                var t = e.alternate;
                null !== t && (e.alternate = null,
                il(t)),
                e.child = null,
                e.deletions = null,
                e.sibling = null,
                5 === e.tag && null !== (t = e.stateNode) && (delete t[ma],
                delete t[fa],
                delete t[pa],
                delete t[ga],
                delete t[ya]),
                e.stateNode = null,
                e.return = null,
                e.dependencies = null,
                e.memoizedProps = null,
                e.memoizedState = null,
                e.pendingProps = null,
                e.stateNode = null,
                e.updateQueue = null
            }
            function ol(e) {
                return 5 === e.tag || 3 === e.tag || 4 === e.tag
            }
            function sl(e) {
                e: for (; ; ) {
                    for (; null === e.sibling; ) {
                        if (null === e.return || ol(e.return))
                            return null;
                        e = e.return
                    }
                    for (e.sibling.return = e.return,
                    e = e.sibling; 5 !== e.tag && 6 !== e.tag && 18 !== e.tag; ) {
                        if (2 & e.flags)
                            continue e;
                        if (null === e.child || 4 === e.tag)
                            continue e;
                        e.child.return = e,
                        e = e.child
                    }
                    if (!(2 & e.flags))
                        return e.stateNode
                }
            }
            function ll(e, t, n) {
                var r = e.tag;
                if (5 === r || 6 === r)
                    e = e.stateNode,
                    t ? 8 === n.nodeType ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (8 === n.nodeType ? (t = n.parentNode).insertBefore(e, n) : (t = n).appendChild(e),
                    null != (n = n._reactRootContainer) || null !== t.onclick || (t.onclick = Jr));
                else if (4 !== r && null !== (e = e.child))
                    for (ll(e, t, n),
                    e = e.sibling; null !== e; )
                        ll(e, t, n),
                        e = e.sibling
            }
            function ul(e, t, n) {
                var r = e.tag;
                if (5 === r || 6 === r)
                    e = e.stateNode,
                    t ? n.insertBefore(e, t) : n.appendChild(e);
                else if (4 !== r && null !== (e = e.child))
                    for (ul(e, t, n),
                    e = e.sibling; null !== e; )
                        ul(e, t, n),
                        e = e.sibling
            }
            var cl = null
              , dl = !1;
            function ml(e, t, n) {
                for (n = n.child; null !== n; )
                    fl(e, t, n),
                    n = n.sibling
            }
            function fl(e, t, n) {
                if (it && "function" == typeof it.onCommitFiberUnmount)
                    try {
                        it.onCommitFiberUnmount(at, n)
                    } catch (e) {}
                switch (n.tag) {
                case 5:
                    Xs || Js(n, t);
                case 6:
                    var r = cl
                      , a = dl;
                    cl = null,
                    ml(e, t, n),
                    dl = a,
                    null !== (cl = r) && (dl ? (e = cl,
                    n = n.stateNode,
                    8 === e.nodeType ? e.parentNode.removeChild(n) : e.removeChild(n)) : cl.removeChild(n.stateNode));
                    break;
                case 18:
                    null !== cl && (dl ? (e = cl,
                    n = n.stateNode,
                    8 === e.nodeType ? la(e.parentNode, n) : 1 === e.nodeType && la(e, n),
                    Bt(e)) : la(cl, n.stateNode));
                    break;
                case 4:
                    r = cl,
                    a = dl,
                    cl = n.stateNode.containerInfo,
                    dl = !0,
                    ml(e, t, n),
                    cl = r,
                    dl = a;
                    break;
                case 0:
                case 11:
                case 14:
                case 15:
                    if (!Xs && null !== (r = n.updateQueue) && null !== (r = r.lastEffect)) {
                        a = r = r.next;
                        do {
                            var i = a
                              , o = i.destroy;
                            i = i.tag,
                            void 0 !== o && (2 & i || 4 & i) && el(n, t, o),
                            a = a.next
                        } while (a !== r)
                    }
                    ml(e, t, n);
                    break;
                case 1:
                    if (!Xs && (Js(n, t),
                    "function" == typeof (r = n.stateNode).componentWillUnmount))
                        try {
                            r.props = n.memoizedProps,
                            r.state = n.memoizedState,
                            r.componentWillUnmount()
                        } catch (e) {
                            ku(n, t, e)
                        }
                    ml(e, t, n);
                    break;
                case 21:
                    ml(e, t, n);
                    break;
                case 22:
                    1 & n.mode ? (Xs = (r = Xs) || null !== n.memoizedState,
                    ml(e, t, n),
                    Xs = r) : ml(e, t, n);
                    break;
                default:
                    ml(e, t, n)
                }
            }
            function hl(e) {
                var t = e.updateQueue;
                if (null !== t) {
                    e.updateQueue = null;
                    var n = e.stateNode;
                    null === n && (n = e.stateNode = new Gs),
                    t.forEach(function(t) {
                        var r = Cu.bind(null, e, t);
                        n.has(t) || (n.add(t),
                        t.then(r, r))
                    })
                }
            }
            function pl(e, t) {
                var n = t.deletions;
                if (null !== n)
                    for (var r = 0; r < n.length; r++) {
                        var a = n[r];
                        try {
                            var o = e
                              , s = t
                              , l = s;
                            e: for (; null !== l; ) {
                                switch (l.tag) {
                                case 5:
                                    cl = l.stateNode,
                                    dl = !1;
                                    break e;
                                case 3:
                                case 4:
                                    cl = l.stateNode.containerInfo,
                                    dl = !0;
                                    break e
                                }
                                l = l.return
                            }
                            if (null === cl)
                                throw Error(i(160));
                            fl(o, s, a),
                            cl = null,
                            dl = !1;
                            var u = a.alternate;
                            null !== u && (u.return = null),
                            a.return = null
                        } catch (e) {
                            ku(a, t, e)
                        }
                    }
                if (12854 & t.subtreeFlags)
                    for (t = t.child; null !== t; )
                        gl(t, e),
                        t = t.sibling
            }
            function gl(e, t) {
                var n = e.alternate
                  , r = e.flags;
                switch (e.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                    if (pl(t, e),
                    yl(e),
                    4 & r) {
                        try {
                            nl(3, e, e.return),
                            rl(3, e)
                        } catch (t) {
                            ku(e, e.return, t)
                        }
                        try {
                            nl(5, e, e.return)
                        } catch (t) {
                            ku(e, e.return, t)
                        }
                    }
                    break;
                case 1:
                    pl(t, e),
                    yl(e),
                    512 & r && null !== n && Js(n, n.return);
                    break;
                case 5:
                    if (pl(t, e),
                    yl(e),
                    512 & r && null !== n && Js(n, n.return),
                    32 & e.flags) {
                        var a = e.stateNode;
                        try {
                            me(a, "")
                        } catch (t) {
                            ku(e, e.return, t)
                        }
                    }
                    if (4 & r && null != (a = e.stateNode)) {
                        var o = e.memoizedProps
                          , s = null !== n ? n.memoizedProps : o
                          , l = e.type
                          , u = e.updateQueue;
                        if (e.updateQueue = null,
                        null !== u)
                            try {
                                "input" === l && "radio" === o.type && null != o.name && G(a, o),
                                ve(l, s);
                                var c = ve(l, o);
                                for (s = 0; s < u.length; s += 2) {
                                    var d = u[s]
                                      , m = u[s + 1];
                                    "style" === d ? ge(a, m) : "dangerouslySetInnerHTML" === d ? de(a, m) : "children" === d ? me(a, m) : v(a, d, m, c)
                                }
                                switch (l) {
                                case "input":
                                    Z(a, o);
                                    break;
                                case "textarea":
                                    ie(a, o);
                                    break;
                                case "select":
                                    var f = a._wrapperState.wasMultiple;
                                    a._wrapperState.wasMultiple = !!o.multiple;
                                    var h = o.value;
                                    null != h ? ne(a, !!o.multiple, h, !1) : f !== !!o.multiple && (null != o.defaultValue ? ne(a, !!o.multiple, o.defaultValue, !0) : ne(a, !!o.multiple, o.multiple ? [] : "", !1))
                                }
                                a[fa] = o
                            } catch (t) {
                                ku(e, e.return, t)
                            }
                    }
                    break;
                case 6:
                    if (pl(t, e),
                    yl(e),
                    4 & r) {
                        if (null === e.stateNode)
                            throw Error(i(162));
                        a = e.stateNode,
                        o = e.memoizedProps;
                        try {
                            a.nodeValue = o
                        } catch (t) {
                            ku(e, e.return, t)
                        }
                    }
                    break;
                case 3:
                    if (pl(t, e),
                    yl(e),
                    4 & r && null !== n && n.memoizedState.isDehydrated)
                        try {
                            Bt(t.containerInfo)
                        } catch (t) {
                            ku(e, e.return, t)
                        }
                    break;
                case 4:
                default:
                    pl(t, e),
                    yl(e);
                    break;
                case 13:
                    pl(t, e),
                    yl(e),
                    8192 & (a = e.child).flags && (o = null !== a.memoizedState,
                    a.stateNode.isHidden = o,
                    !o || null !== a.alternate && null !== a.alternate.memoizedState || (Ul = Ge())),
                    4 & r && hl(e);
                    break;
                case 22:
                    if (d = null !== n && null !== n.memoizedState,
                    1 & e.mode ? (Xs = (c = Xs) || d,
                    pl(t, e),
                    Xs = c) : pl(t, e),
                    yl(e),
                    8192 & r) {
                        if (c = null !== e.memoizedState,
                        (e.stateNode.isHidden = c) && !d && 1 & e.mode)
                            for (Zs = e,
                            d = e.child; null !== d; ) {
                                for (m = Zs = d; null !== Zs; ) {
                                    switch (h = (f = Zs).child,
                                    f.tag) {
                                    case 0:
                                    case 11:
                                    case 14:
                                    case 15:
                                        nl(4, f, f.return);
                                        break;
                                    case 1:
                                        Js(f, f.return);
                                        var p = f.stateNode;
                                        if ("function" == typeof p.componentWillUnmount) {
                                            r = f,
                                            n = f.return;
                                            try {
                                                t = r,
                                                p.props = t.memoizedProps,
                                                p.state = t.memoizedState,
                                                p.componentWillUnmount()
                                            } catch (e) {
                                                ku(r, n, e)
                                            }
                                        }
                                        break;
                                    case 5:
                                        Js(f, f.return);
                                        break;
                                    case 22:
                                        if (null !== f.memoizedState) {
                                            xl(m);
                                            continue
                                        }
                                    }
                                    null !== h ? (h.return = f,
                                    Zs = h) : xl(m)
                                }
                                d = d.sibling
                            }
                        e: for (d = null,
                        m = e; ; ) {
                            if (5 === m.tag) {
                                if (null === d) {
                                    d = m;
                                    try {
                                        a = m.stateNode,
                                        c ? "function" == typeof (o = a.style).setProperty ? o.setProperty("display", "none", "important") : o.display = "none" : (l = m.stateNode,
                                        s = null != (u = m.memoizedProps.style) && u.hasOwnProperty("display") ? u.display : null,
                                        l.style.display = pe("display", s))
                                    } catch (t) {
                                        ku(e, e.return, t)
                                    }
                                }
                            } else if (6 === m.tag) {
                                if (null === d)
                                    try {
                                        m.stateNode.nodeValue = c ? "" : m.memoizedProps
                                    } catch (t) {
                                        ku(e, e.return, t)
                                    }
                            } else if ((22 !== m.tag && 23 !== m.tag || null === m.memoizedState || m === e) && null !== m.child) {
                                m.child.return = m,
                                m = m.child;
                                continue
                            }
                            if (m === e)
                                break e;
                            for (; null === m.sibling; ) {
                                if (null === m.return || m.return === e)
                                    break e;
                                d === m && (d = null),
                                m = m.return
                            }
                            d === m && (d = null),
                            m.sibling.return = m.return,
                            m = m.sibling
                        }
                    }
                    break;
                case 19:
                    pl(t, e),
                    yl(e),
                    4 & r && hl(e);
                case 21:
                }
            }
            function yl(e) {
                var t = e.flags;
                if (2 & t) {
                    try {
                        e: {
                            for (var n = e.return; null !== n; ) {
                                if (ol(n)) {
                                    var r = n;
                                    break e
                                }
                                n = n.return
                            }
                            throw Error(i(160))
                        }
                        switch (r.tag) {
                        case 5:
                            var a = r.stateNode;
                            32 & r.flags && (me(a, ""),
                            r.flags &= -33),
                            ul(e, sl(e), a);
                            break;
                        case 3:
                        case 4:
                            var o = r.stateNode.containerInfo;
                            ll(e, sl(e), o);
                            break;
                        default:
                            throw Error(i(161))
                        }
                    } catch (t) {
                        ku(e, e.return, t)
                    }
                    e.flags &= -3
                }
                4096 & t && (e.flags &= -4097)
            }
            function bl(e, t, n) {
                Zs = e,
                vl(e, t, n)
            }
            function vl(e, t, n) {
                for (var r = !!(1 & e.mode); null !== Zs; ) {
                    var a = Zs
                      , i = a.child;
                    if (22 === a.tag && r) {
                        var o = null !== a.memoizedState || qs;
                        if (!o) {
                            var s = a.alternate
                              , l = null !== s && null !== s.memoizedState || Xs;
                            s = qs;
                            var u = Xs;
                            if (qs = o,
                            (Xs = l) && !u)
                                for (Zs = a; null !== Zs; )
                                    l = (o = Zs).child,
                                    22 === o.tag && null !== o.memoizedState ? _l(a) : null !== l ? (l.return = o,
                                    Zs = l) : _l(a);
                            for (; null !== i; )
                                Zs = i,
                                vl(i, t, n),
                                i = i.sibling;
                            Zs = a,
                            qs = s,
                            Xs = u
                        }
                        wl(e)
                    } else
                        8772 & a.subtreeFlags && null !== i ? (i.return = a,
                        Zs = i) : wl(e)
                }
            }
            function wl(e) {
                for (; null !== Zs; ) {
                    var t = Zs;
                    if (8772 & t.flags) {
                        var n = t.alternate;
                        try {
                            if (8772 & t.flags)
                                switch (t.tag) {
                                case 0:
                                case 11:
                                case 15:
                                    Xs || rl(5, t);
                                    break;
                                case 1:
                                    var r = t.stateNode;
                                    if (4 & t.flags && !Xs)
                                        if (null === n)
                                            r.componentDidMount();
                                        else {
                                            var a = t.elementType === t.type ? n.memoizedProps : ns(t.type, n.memoizedProps);
                                            r.componentDidUpdate(a, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate)
                                        }
                                    var o = t.updateQueue;
                                    null !== o && $i(t, o, r);
                                    break;
                                case 3:
                                    var s = t.updateQueue;
                                    if (null !== s) {
                                        if (n = null,
                                        null !== t.child)
                                            switch (t.child.tag) {
                                            case 5:
                                            case 1:
                                                n = t.child.stateNode
                                            }
                                        $i(t, s, n)
                                    }
                                    break;
                                case 5:
                                    var l = t.stateNode;
                                    if (null === n && 4 & t.flags) {
                                        n = l;
                                        var u = t.memoizedProps;
                                        switch (t.type) {
                                        case "button":
                                        case "input":
                                        case "select":
                                        case "textarea":
                                            u.autoFocus && n.focus();
                                            break;
                                        case "img":
                                            u.src && (n.src = u.src)
                                        }
                                    }
                                    break;
                                case 6:
                                case 4:
                                case 12:
                                case 19:
                                case 17:
                                case 21:
                                case 22:
                                case 23:
                                case 25:
                                    break;
                                case 13:
                                    if (null === t.memoizedState) {
                                        var c = t.alternate;
                                        if (null !== c) {
                                            var d = c.memoizedState;
                                            if (null !== d) {
                                                var m = d.dehydrated;
                                                null !== m && Bt(m)
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    throw Error(i(163))
                                }
                            Xs || 512 & t.flags && al(t)
                        } catch (e) {
                            ku(t, t.return, e)
                        }
                    }
                    if (t === e) {
                        Zs = null;
                        break
                    }
                    if (null !== (n = t.sibling)) {
                        n.return = t.return,
                        Zs = n;
                        break
                    }
                    Zs = t.return
                }
            }
            function xl(e) {
                for (; null !== Zs; ) {
                    var t = Zs;
                    if (t === e) {
                        Zs = null;
                        break
                    }
                    var n = t.sibling;
                    if (null !== n) {
                        n.return = t.return,
                        Zs = n;
                        break
                    }
                    Zs = t.return
                }
            }
            function _l(e) {
                for (; null !== Zs; ) {
                    var t = Zs;
                    try {
                        switch (t.tag) {
                        case 0:
                        case 11:
                        case 15:
                            var n = t.return;
                            try {
                                rl(4, t)
                            } catch (e) {
                                ku(t, n, e)
                            }
                            break;
                        case 1:
                            var r = t.stateNode;
                            if ("function" == typeof r.componentDidMount) {
                                var a = t.return;
                                try {
                                    r.componentDidMount()
                                } catch (e) {
                                    ku(t, a, e)
                                }
                            }
                            var i = t.return;
                            try {
                                al(t)
                            } catch (e) {
                                ku(t, i, e)
                            }
                            break;
                        case 5:
                            var o = t.return;
                            try {
                                al(t)
                            } catch (e) {
                                ku(t, o, e)
                            }
                        }
                    } catch (e) {
                        ku(t, t.return, e)
                    }
                    if (t === e) {
                        Zs = null;
                        break
                    }
                    var s = t.sibling;
                    if (null !== s) {
                        s.return = t.return,
                        Zs = s;
                        break
                    }
                    Zs = t.return
                }
            }
            var Nl, kl = Math.ceil, Sl = w.ReactCurrentDispatcher, El = w.ReactCurrentOwner, Pl = w.ReactCurrentBatchConfig, Cl = 0, Tl = null, Ml = null, Al = 0, Rl = 0, Dl = ka(0), Ll = 0, Ol = null, jl = 0, zl = 0, Vl = 0, Fl = null, Il = null, Ul = 0, Bl = 1 / 0, $l = null, Wl = !1, Hl = null, Yl = null, Kl = !1, Ql = null, ql = 0, Xl = 0, Gl = null, Zl = -1, Jl = 0;
            function eu() {
                return 6 & Cl ? Ge() : -1 !== Zl ? Zl : Zl = Ge()
            }
            function tu(e) {
                return 1 & e.mode ? 2 & Cl && 0 !== Al ? Al & -Al : null !== pi.transition ? (0 === Jl && (Jl = pt()),
                Jl) : 0 !== (e = vt) ? e : e = void 0 === (e = window.event) ? 16 : Xt(e.type) : 1
            }
            function nu(e, t, n, r) {
                if (50 < Xl)
                    throw Xl = 0,
                    Gl = null,
                    Error(i(185));
                yt(e, n, r),
                2 & Cl && e === Tl || (e === Tl && (!(2 & Cl) && (zl |= n),
                4 === Ll && su(e, Al)),
                ru(e, r),
                1 === n && 0 === Cl && !(1 & t.mode) && (Bl = Ge() + 500,
                Fa && Ba()))
            }
            function ru(e, t) {
                var n = e.callbackNode;
                !function(e, t) {
                    for (var n = e.suspendedLanes, r = e.pingedLanes, a = e.expirationTimes, i = e.pendingLanes; 0 < i; ) {
                        var o = 31 - ot(i)
                          , s = 1 << o
                          , l = a[o];
                        -1 === l ? 0 !== (s & n) && 0 === (s & r) || (a[o] = ft(s, t)) : l <= t && (e.expiredLanes |= s),
                        i &= ~s
                    }
                }(e, t);
                var r = mt(e, e === Tl ? Al : 0);
                if (0 === r)
                    null !== n && Qe(n),
                    e.callbackNode = null,
                    e.callbackPriority = 0;
                else if (t = r & -r,
                e.callbackPriority !== t) {
                    if (null != n && Qe(n),
                    1 === t)
                        0 === e.tag ? function(e) {
                            Fa = !0,
                            Ua(e)
                        }(lu.bind(null, e)) : Ua(lu.bind(null, e)),
                        oa(function() {
                            !(6 & Cl) && Ba()
                        }),
                        n = null;
                    else {
                        switch (wt(r)) {
                        case 1:
                            n = Je;
                            break;
                        case 4:
                            n = et;
                            break;
                        case 16:
                        default:
                            n = tt;
                            break;
                        case 536870912:
                            n = rt
                        }
                        n = Tu(n, au.bind(null, e))
                    }
                    e.callbackPriority = t,
                    e.callbackNode = n
                }
            }
            function au(e, t) {
                if (Zl = -1,
                Jl = 0,
                6 & Cl)
                    throw Error(i(327));
                var n = e.callbackNode;
                if (_u() && e.callbackNode !== n)
                    return null;
                var r = mt(e, e === Tl ? Al : 0);
                if (0 === r)
                    return null;
                if (30 & r || 0 !== (r & e.expiredLanes) || t)
                    t = gu(e, r);
                else {
                    t = r;
                    var a = Cl;
                    Cl |= 2;
                    var o = hu();
                    for (Tl === e && Al === t || ($l = null,
                    Bl = Ge() + 500,
                    mu(e, t)); ; )
                        try {
                            bu();
                            break
                        } catch (t) {
                            fu(e, t)
                        }
                    Ei(),
                    Sl.current = o,
                    Cl = a,
                    null !== Ml ? t = 0 : (Tl = null,
                    Al = 0,
                    t = Ll)
                }
                if (0 !== t) {
                    if (2 === t && 0 !== (a = ht(e)) && (r = a,
                    t = iu(e, a)),
                    1 === t)
                        throw n = Ol,
                        mu(e, 0),
                        su(e, r),
                        ru(e, Ge()),
                        n;
                    if (6 === t)
                        su(e, r);
                    else {
                        if (a = e.current.alternate,
                        !(30 & r || function(e) {
                            for (var t = e; ; ) {
                                if (16384 & t.flags) {
                                    var n = t.updateQueue;
                                    if (null !== n && null !== (n = n.stores))
                                        for (var r = 0; r < n.length; r++) {
                                            var a = n[r]
                                              , i = a.getSnapshot;
                                            a = a.value;
                                            try {
                                                if (!sr(i(), a))
                                                    return !1
                                            } catch (e) {
                                                return !1
                                            }
                                        }
                                }
                                if (n = t.child,
                                16384 & t.subtreeFlags && null !== n)
                                    n.return = t,
                                    t = n;
                                else {
                                    if (t === e)
                                        break;
                                    for (; null === t.sibling; ) {
                                        if (null === t.return || t.return === e)
                                            return !0;
                                        t = t.return
                                    }
                                    t.sibling.return = t.return,
                                    t = t.sibling
                                }
                            }
                            return !0
                        }(a) || (t = gu(e, r),
                        2 === t && (o = ht(e),
                        0 !== o && (r = o,
                        t = iu(e, o))),
                        1 !== t)))
                            throw n = Ol,
                            mu(e, 0),
                            su(e, r),
                            ru(e, Ge()),
                            n;
                        switch (e.finishedWork = a,
                        e.finishedLanes = r,
                        t) {
                        case 0:
                        case 1:
                            throw Error(i(345));
                        case 2:
                        case 5:
                            xu(e, Il, $l);
                            break;
                        case 3:
                            if (su(e, r),
                            (130023424 & r) === r && 10 < (t = Ul + 500 - Ge())) {
                                if (0 !== mt(e, 0))
                                    break;
                                if (((a = e.suspendedLanes) & r) !== r) {
                                    eu(),
                                    e.pingedLanes |= e.suspendedLanes & a;
                                    break
                                }
                                e.timeoutHandle = ra(xu.bind(null, e, Il, $l), t);
                                break
                            }
                            xu(e, Il, $l);
                            break;
                        case 4:
                            if (su(e, r),
                            (4194240 & r) === r)
                                break;
                            for (t = e.eventTimes,
                            a = -1; 0 < r; ) {
                                var s = 31 - ot(r);
                                o = 1 << s,
                                (s = t[s]) > a && (a = s),
                                r &= ~o
                            }
                            if (r = a,
                            10 < (r = (120 > (r = Ge() - r) ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * kl(r / 1960)) - r)) {
                                e.timeoutHandle = ra(xu.bind(null, e, Il, $l), r);
                                break
                            }
                            xu(e, Il, $l);
                            break;
                        default:
                            throw Error(i(329))
                        }
                    }
                }
                return ru(e, Ge()),
                e.callbackNode === n ? au.bind(null, e) : null
            }
            function iu(e, t) {
                var n = Fl;
                return e.current.memoizedState.isDehydrated && (mu(e, t).flags |= 256),
                2 !== (e = gu(e, t)) && (t = Il,
                Il = n,
                null !== t && ou(t)),
                e
            }
            function ou(e) {
                null === Il ? Il = e : Il.push.apply(Il, e)
            }
            function su(e, t) {
                for (t &= ~Vl,
                t &= ~zl,
                e.suspendedLanes |= t,
                e.pingedLanes &= ~t,
                e = e.expirationTimes; 0 < t; ) {
                    var n = 31 - ot(t)
                      , r = 1 << n;
                    e[n] = -1,
                    t &= ~r
                }
            }
            function lu(e) {
                if (6 & Cl)
                    throw Error(i(327));
                _u();
                var t = mt(e, 0);
                if (!(1 & t))
                    return ru(e, Ge()),
                    null;
                var n = gu(e, t);
                if (0 !== e.tag && 2 === n) {
                    var r = ht(e);
                    0 !== r && (t = r,
                    n = iu(e, r))
                }
                if (1 === n)
                    throw n = Ol,
                    mu(e, 0),
                    su(e, t),
                    ru(e, Ge()),
                    n;
                if (6 === n)
                    throw Error(i(345));
                return e.finishedWork = e.current.alternate,
                e.finishedLanes = t,
                xu(e, Il, $l),
                ru(e, Ge()),
                null
            }
            function uu(e, t) {
                var n = Cl;
                Cl |= 1;
                try {
                    return e(t)
                } finally {
                    0 === (Cl = n) && (Bl = Ge() + 500,
                    Fa && Ba())
                }
            }
            function cu(e) {
                null !== Ql && 0 === Ql.tag && !(6 & Cl) && _u();
                var t = Cl;
                Cl |= 1;
                var n = Pl.transition
                  , r = vt;
                try {
                    if (Pl.transition = null,
                    vt = 1,
                    e)
                        return e()
                } finally {
                    vt = r,
                    Pl.transition = n,
                    !(6 & (Cl = t)) && Ba()
                }
            }
            function du() {
                Rl = Dl.current,
                Sa(Dl)
            }
            function mu(e, t) {
                e.finishedWork = null,
                e.finishedLanes = 0;
                var n = e.timeoutHandle;
                if (-1 !== n && (e.timeoutHandle = -1,
                aa(n)),
                null !== Ml)
                    for (n = Ml.return; null !== n; ) {
                        var r = n;
                        switch (ti(r),
                        r.tag) {
                        case 1:
                            null != (r = r.type.childContextTypes) && Da();
                            break;
                        case 3:
                            Xi(),
                            Sa(Ta),
                            Sa(Ca),
                            no();
                            break;
                        case 5:
                            Zi(r);
                            break;
                        case 4:
                            Xi();
                            break;
                        case 13:
                        case 19:
                            Sa(Ji);
                            break;
                        case 10:
                            Pi(r.type._context);
                            break;
                        case 22:
                        case 23:
                            du()
                        }
                        n = n.return
                    }
                if (Tl = e,
                Ml = e = Du(e.current, null),
                Al = Rl = t,
                Ll = 0,
                Ol = null,
                Vl = zl = jl = 0,
                Il = Fl = null,
                null !== Ai) {
                    for (t = 0; t < Ai.length; t++)
                        if (null !== (r = (n = Ai[t]).interleaved)) {
                            n.interleaved = null;
                            var a = r.next
                              , i = n.pending;
                            if (null !== i) {
                                var o = i.next;
                                i.next = a,
                                r.next = o
                            }
                            n.pending = r
                        }
                    Ai = null
                }
                return e
            }
            function fu(e, t) {
                for (; ; ) {
                    var n = Ml;
                    try {
                        if (Ei(),
                        ro.current = Zo,
                        uo) {
                            for (var r = oo.memoizedState; null !== r; ) {
                                var a = r.queue;
                                null !== a && (a.pending = null),
                                r = r.next
                            }
                            uo = !1
                        }
                        if (io = 0,
                        lo = so = oo = null,
                        co = !1,
                        mo = 0,
                        El.current = null,
                        null === n || null === n.return) {
                            Ll = 1,
                            Ol = t,
                            Ml = null;
                            break
                        }
                        e: {
                            var o = e
                              , s = n.return
                              , l = n
                              , u = t;
                            if (t = Al,
                            l.flags |= 32768,
                            null !== u && "object" == typeof u && "function" == typeof u.then) {
                                var c = u
                                  , d = l
                                  , m = d.tag;
                                if (!(1 & d.mode || 0 !== m && 11 !== m && 15 !== m)) {
                                    var f = d.alternate;
                                    f ? (d.updateQueue = f.updateQueue,
                                    d.memoizedState = f.memoizedState,
                                    d.lanes = f.lanes) : (d.updateQueue = null,
                                    d.memoizedState = null)
                                }
                                var h = gs(s);
                                if (null !== h) {
                                    h.flags &= -257,
                                    ys(h, s, l, 0, t),
                                    1 & h.mode && ps(o, c, t),
                                    u = c;
                                    var p = (t = h).updateQueue;
                                    if (null === p) {
                                        var g = new Set;
                                        g.add(u),
                                        t.updateQueue = g
                                    } else
                                        p.add(u);
                                    break e
                                }
                                if (!(1 & t)) {
                                    ps(o, c, t),
                                    pu();
                                    break e
                                }
                                u = Error(i(426))
                            } else if (ai && 1 & l.mode) {
                                var y = gs(s);
                                if (null !== y) {
                                    !(65536 & y.flags) && (y.flags |= 256),
                                    ys(y, s, l, 0, t),
                                    hi(us(u, l));
                                    break e
                                }
                            }
                            o = u = us(u, l),
                            4 !== Ll && (Ll = 2),
                            null === Fl ? Fl = [o] : Fl.push(o),
                            o = s;
                            do {
                                switch (o.tag) {
                                case 3:
                                    o.flags |= 65536,
                                    t &= -t,
                                    o.lanes |= t,
                                    Ui(o, fs(0, u, t));
                                    break e;
                                case 1:
                                    l = u;
                                    var b = o.type
                                      , v = o.stateNode;
                                    if (!(128 & o.flags || "function" != typeof b.getDerivedStateFromError && (null === v || "function" != typeof v.componentDidCatch || null !== Yl && Yl.has(v)))) {
                                        o.flags |= 65536,
                                        t &= -t,
                                        o.lanes |= t,
                                        Ui(o, hs(o, l, t));
                                        break e
                                    }
                                }
                                o = o.return
                            } while (null !== o)
                        }
                        wu(n)
                    } catch (e) {
                        t = e,
                        Ml === n && null !== n && (Ml = n = n.return);
                        continue
                    }
                    break
                }
            }
            function hu() {
                var e = Sl.current;
                return Sl.current = Zo,
                null === e ? Zo : e
            }
            function pu() {
                0 !== Ll && 3 !== Ll && 2 !== Ll || (Ll = 4),
                null === Tl || !(268435455 & jl) && !(268435455 & zl) || su(Tl, Al)
            }
            function gu(e, t) {
                var n = Cl;
                Cl |= 2;
                var r = hu();
                for (Tl === e && Al === t || ($l = null,
                mu(e, t)); ; )
                    try {
                        yu();
                        break
                    } catch (t) {
                        fu(e, t)
                    }
                if (Ei(),
                Cl = n,
                Sl.current = r,
                null !== Ml)
                    throw Error(i(261));
                return Tl = null,
                Al = 0,
                Ll
            }
            function yu() {
                for (; null !== Ml; )
                    vu(Ml)
            }
            function bu() {
                for (; null !== Ml && !qe(); )
                    vu(Ml)
            }
            function vu(e) {
                var t = Nl(e.alternate, e, Rl);
                e.memoizedProps = e.pendingProps,
                null === t ? wu(e) : Ml = t,
                El.current = null
            }
            function wu(e) {
                var t = e;
                do {
                    var n = t.alternate;
                    if (e = t.return,
                    32768 & t.flags) {
                        if (null !== (n = Qs(n, t)))
                            return n.flags &= 32767,
                            void (Ml = n);
                        if (null === e)
                            return Ll = 6,
                            void (Ml = null);
                        e.flags |= 32768,
                        e.subtreeFlags = 0,
                        e.deletions = null
                    } else if (null !== (n = Ks(n, t, Rl)))
                        return void (Ml = n);
                    if (null !== (t = t.sibling))
                        return void (Ml = t);
                    Ml = t = e
                } while (null !== t);
                0 === Ll && (Ll = 5)
            }
            function xu(e, t, n) {
                var r = vt
                  , a = Pl.transition;
                try {
                    Pl.transition = null,
                    vt = 1,
                    function(e, t, n, r) {
                        do {
                            _u()
                        } while (null !== Ql);
                        if (6 & Cl)
                            throw Error(i(327));
                        n = e.finishedWork;
                        var a = e.finishedLanes;
                        if (null === n)
                            return null;
                        if (e.finishedWork = null,
                        e.finishedLanes = 0,
                        n === e.current)
                            throw Error(i(177));
                        e.callbackNode = null,
                        e.callbackPriority = 0;
                        var o = n.lanes | n.childLanes;
                        if (function(e, t) {
                            var n = e.pendingLanes & ~t;
                            e.pendingLanes = t,
                            e.suspendedLanes = 0,
                            e.pingedLanes = 0,
                            e.expiredLanes &= t,
                            e.mutableReadLanes &= t,
                            e.entangledLanes &= t,
                            t = e.entanglements;
                            var r = e.eventTimes;
                            for (e = e.expirationTimes; 0 < n; ) {
                                var a = 31 - ot(n)
                                  , i = 1 << a;
                                t[a] = 0,
                                r[a] = -1,
                                e[a] = -1,
                                n &= ~i
                            }
                        }(e, o),
                        e === Tl && (Ml = Tl = null,
                        Al = 0),
                        !(2064 & n.subtreeFlags) && !(2064 & n.flags) || Kl || (Kl = !0,
                        Tu(tt, function() {
                            return _u(),
                            null
                        })),
                        o = !!(15990 & n.flags),
                        15990 & n.subtreeFlags || o) {
                            o = Pl.transition,
                            Pl.transition = null;
                            var s = vt;
                            vt = 1;
                            var l = Cl;
                            Cl |= 4,
                            El.current = null,
                            function(e, t) {
                                if (ea = Wt,
                                fr(e = mr())) {
                                    if ("selectionStart"in e)
                                        var n = {
                                            start: e.selectionStart,
                                            end: e.selectionEnd
                                        };
                                    else
                                        e: {
                                            var r = (n = (n = e.ownerDocument) && n.defaultView || window).getSelection && n.getSelection();
                                            if (r && 0 !== r.rangeCount) {
                                                n = r.anchorNode;
                                                var a = r.anchorOffset
                                                  , o = r.focusNode;
                                                r = r.focusOffset;
                                                try {
                                                    n.nodeType,
                                                    o.nodeType
                                                } catch (e) {
                                                    n = null;
                                                    break e
                                                }
                                                var s = 0
                                                  , l = -1
                                                  , u = -1
                                                  , c = 0
                                                  , d = 0
                                                  , m = e
                                                  , f = null;
                                                t: for (; ; ) {
                                                    for (var h; m !== n || 0 !== a && 3 !== m.nodeType || (l = s + a),
                                                    m !== o || 0 !== r && 3 !== m.nodeType || (u = s + r),
                                                    3 === m.nodeType && (s += m.nodeValue.length),
                                                    null !== (h = m.firstChild); )
                                                        f = m,
                                                        m = h;
                                                    for (; ; ) {
                                                        if (m === e)
                                                            break t;
                                                        if (f === n && ++c === a && (l = s),
                                                        f === o && ++d === r && (u = s),
                                                        null !== (h = m.nextSibling))
                                                            break;
                                                        f = (m = f).parentNode
                                                    }
                                                    m = h
                                                }
                                                n = -1 === l || -1 === u ? null : {
                                                    start: l,
                                                    end: u
                                                }
                                            } else
                                                n = null
                                        }
                                    n = n || {
                                        start: 0,
                                        end: 0
                                    }
                                } else
                                    n = null;
                                for (ta = {
                                    focusedElem: e,
                                    selectionRange: n
                                },
                                Wt = !1,
                                Zs = t; null !== Zs; )
                                    if (e = (t = Zs).child,
                                    1028 & t.subtreeFlags && null !== e)
                                        e.return = t,
                                        Zs = e;
                                    else
                                        for (; null !== Zs; ) {
                                            t = Zs;
                                            try {
                                                var p = t.alternate;
                                                if (1024 & t.flags)
                                                    switch (t.tag) {
                                                    case 0:
                                                    case 11:
                                                    case 15:
                                                    case 5:
                                                    case 6:
                                                    case 4:
                                                    case 17:
                                                        break;
                                                    case 1:
                                                        if (null !== p) {
                                                            var g = p.memoizedProps
                                                              , y = p.memoizedState
                                                              , b = t.stateNode
                                                              , v = b.getSnapshotBeforeUpdate(t.elementType === t.type ? g : ns(t.type, g), y);
                                                            b.__reactInternalSnapshotBeforeUpdate = v
                                                        }
                                                        break;
                                                    case 3:
                                                        var w = t.stateNode.containerInfo;
                                                        1 === w.nodeType ? w.textContent = "" : 9 === w.nodeType && w.documentElement && w.removeChild(w.documentElement);
                                                        break;
                                                    default:
                                                        throw Error(i(163))
                                                    }
                                            } catch (e) {
                                                ku(t, t.return, e)
                                            }
                                            if (null !== (e = t.sibling)) {
                                                e.return = t.return,
                                                Zs = e;
                                                break
                                            }
                                            Zs = t.return
                                        }
                                p = tl,
                                tl = !1
                            }(e, n),
                            gl(n, e),
                            hr(ta),
                            Wt = !!ea,
                            ta = ea = null,
                            e.current = n,
                            bl(n, e, a),
                            Xe(),
                            Cl = l,
                            vt = s,
                            Pl.transition = o
                        } else
                            e.current = n;
                        if (Kl && (Kl = !1,
                        Ql = e,
                        ql = a),
                        0 === (o = e.pendingLanes) && (Yl = null),
                        function(e) {
                            if (it && "function" == typeof it.onCommitFiberRoot)
                                try {
                                    it.onCommitFiberRoot(at, e, void 0, !(128 & ~e.current.flags))
                                } catch (e) {}
                        }(n.stateNode),
                        ru(e, Ge()),
                        null !== t)
                            for (r = e.onRecoverableError,
                            n = 0; n < t.length; n++)
                                r((a = t[n]).value, {
                                    componentStack: a.stack,
                                    digest: a.digest
                                });
                        if (Wl)
                            throw Wl = !1,
                            e = Hl,
                            Hl = null,
                            e;
                        !!(1 & ql) && 0 !== e.tag && _u(),
                        1 & (o = e.pendingLanes) ? e === Gl ? Xl++ : (Xl = 0,
                        Gl = e) : Xl = 0,
                        Ba()
                    }(e, t, n, r)
                } finally {
                    Pl.transition = a,
                    vt = r
                }
                return null
            }
            function _u() {
                if (null !== Ql) {
                    var e = wt(ql)
                      , t = Pl.transition
                      , n = vt;
                    try {
                        if (Pl.transition = null,
                        vt = 16 > e ? 16 : e,
                        null === Ql)
                            var r = !1;
                        else {
                            if (e = Ql,
                            Ql = null,
                            ql = 0,
                            6 & Cl)
                                throw Error(i(331));
                            var a = Cl;
                            for (Cl |= 4,
                            Zs = e.current; null !== Zs; ) {
                                var o = Zs
                                  , s = o.child;
                                if (16 & Zs.flags) {
                                    var l = o.deletions;
                                    if (null !== l) {
                                        for (var u = 0; u < l.length; u++) {
                                            var c = l[u];
                                            for (Zs = c; null !== Zs; ) {
                                                var d = Zs;
                                                switch (d.tag) {
                                                case 0:
                                                case 11:
                                                case 15:
                                                    nl(8, d, o)
                                                }
                                                var m = d.child;
                                                if (null !== m)
                                                    m.return = d,
                                                    Zs = m;
                                                else
                                                    for (; null !== Zs; ) {
                                                        var f = (d = Zs).sibling
                                                          , h = d.return;
                                                        if (il(d),
                                                        d === c) {
                                                            Zs = null;
                                                            break
                                                        }
                                                        if (null !== f) {
                                                            f.return = h,
                                                            Zs = f;
                                                            break
                                                        }
                                                        Zs = h
                                                    }
                                            }
                                        }
                                        var p = o.alternate;
                                        if (null !== p) {
                                            var g = p.child;
                                            if (null !== g) {
                                                p.child = null;
                                                do {
                                                    var y = g.sibling;
                                                    g.sibling = null,
                                                    g = y
                                                } while (null !== g)
                                            }
                                        }
                                        Zs = o
                                    }
                                }
                                if (2064 & o.subtreeFlags && null !== s)
                                    s.return = o,
                                    Zs = s;
                                else
                                    e: for (; null !== Zs; ) {
                                        if (2048 & (o = Zs).flags)
                                            switch (o.tag) {
                                            case 0:
                                            case 11:
                                            case 15:
                                                nl(9, o, o.return)
                                            }
                                        var b = o.sibling;
                                        if (null !== b) {
                                            b.return = o.return,
                                            Zs = b;
                                            break e
                                        }
                                        Zs = o.return
                                    }
                            }
                            var v = e.current;
                            for (Zs = v; null !== Zs; ) {
                                var w = (s = Zs).child;
                                if (2064 & s.subtreeFlags && null !== w)
                                    w.return = s,
                                    Zs = w;
                                else
                                    e: for (s = v; null !== Zs; ) {
                                        if (2048 & (l = Zs).flags)
                                            try {
                                                switch (l.tag) {
                                                case 0:
                                                case 11:
                                                case 15:
                                                    rl(9, l)
                                                }
                                            } catch (e) {
                                                ku(l, l.return, e)
                                            }
                                        if (l === s) {
                                            Zs = null;
                                            break e
                                        }
                                        var x = l.sibling;
                                        if (null !== x) {
                                            x.return = l.return,
                                            Zs = x;
                                            break e
                                        }
                                        Zs = l.return
                                    }
                            }
                            if (Cl = a,
                            Ba(),
                            it && "function" == typeof it.onPostCommitFiberRoot)
                                try {
                                    it.onPostCommitFiberRoot(at, e)
                                } catch (e) {}
                            r = !0
                        }
                        return r
                    } finally {
                        vt = n,
                        Pl.transition = t
                    }
                }
                return !1
            }
            function Nu(e, t, n) {
                e = Fi(e, t = fs(0, t = us(n, t), 1), 1),
                t = eu(),
                null !== e && (yt(e, 1, t),
                ru(e, t))
            }
            function ku(e, t, n) {
                if (3 === e.tag)
                    Nu(e, e, n);
                else
                    for (; null !== t; ) {
                        if (3 === t.tag) {
                            Nu(t, e, n);
                            break
                        }
                        if (1 === t.tag) {
                            var r = t.stateNode;
                            if ("function" == typeof t.type.getDerivedStateFromError || "function" == typeof r.componentDidCatch && (null === Yl || !Yl.has(r))) {
                                t = Fi(t, e = hs(t, e = us(n, e), 1), 1),
                                e = eu(),
                                null !== t && (yt(t, 1, e),
                                ru(t, e));
                                break
                            }
                        }
                        t = t.return
                    }
            }
            function Su(e, t, n) {
                var r = e.pingCache;
                null !== r && r.delete(t),
                t = eu(),
                e.pingedLanes |= e.suspendedLanes & n,
                Tl === e && (Al & n) === n && (4 === Ll || 3 === Ll && (130023424 & Al) === Al && 500 > Ge() - Ul ? mu(e, 0) : Vl |= n),
                ru(e, t)
            }
            function Eu(e, t) {
                0 === t && (1 & e.mode ? (t = ct,
                !(130023424 & (ct <<= 1)) && (ct = 4194304)) : t = 1);
                var n = eu();
                null !== (e = Li(e, t)) && (yt(e, t, n),
                ru(e, n))
            }
            function Pu(e) {
                var t = e.memoizedState
                  , n = 0;
                null !== t && (n = t.retryLane),
                Eu(e, n)
            }
            function Cu(e, t) {
                var n = 0;
                switch (e.tag) {
                case 13:
                    var r = e.stateNode
                      , a = e.memoizedState;
                    null !== a && (n = a.retryLane);
                    break;
                case 19:
                    r = e.stateNode;
                    break;
                default:
                    throw Error(i(314))
                }
                null !== r && r.delete(t),
                Eu(e, n)
            }
            function Tu(e, t) {
                return Ke(e, t)
            }
            function Mu(e, t, n, r) {
                this.tag = e,
                this.key = n,
                this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
                this.index = 0,
                this.ref = null,
                this.pendingProps = t,
                this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
                this.mode = r,
                this.subtreeFlags = this.flags = 0,
                this.deletions = null,
                this.childLanes = this.lanes = 0,
                this.alternate = null
            }
            function Au(e, t, n, r) {
                return new Mu(e,t,n,r)
            }
            function Ru(e) {
                return !(!(e = e.prototype) || !e.isReactComponent)
            }
            function Du(e, t) {
                var n = e.alternate;
                return null === n ? ((n = Au(e.tag, t, e.key, e.mode)).elementType = e.elementType,
                n.type = e.type,
                n.stateNode = e.stateNode,
                n.alternate = e,
                e.alternate = n) : (n.pendingProps = t,
                n.type = e.type,
                n.flags = 0,
                n.subtreeFlags = 0,
                n.deletions = null),
                n.flags = 14680064 & e.flags,
                n.childLanes = e.childLanes,
                n.lanes = e.lanes,
                n.child = e.child,
                n.memoizedProps = e.memoizedProps,
                n.memoizedState = e.memoizedState,
                n.updateQueue = e.updateQueue,
                t = e.dependencies,
                n.dependencies = null === t ? null : {
                    lanes: t.lanes,
                    firstContext: t.firstContext
                },
                n.sibling = e.sibling,
                n.index = e.index,
                n.ref = e.ref,
                n
            }
            function Lu(e, t, n, r, a, o) {
                var s = 2;
                if (r = e,
                "function" == typeof e)
                    Ru(e) && (s = 1);
                else if ("string" == typeof e)
                    s = 5;
                else
                    e: switch (e) {
                    case N:
                        return Ou(n.children, a, o, t);
                    case k:
                        s = 8,
                        a |= 8;
                        break;
                    case S:
                        return (e = Au(12, n, t, 2 | a)).elementType = S,
                        e.lanes = o,
                        e;
                    case T:
                        return (e = Au(13, n, t, a)).elementType = T,
                        e.lanes = o,
                        e;
                    case M:
                        return (e = Au(19, n, t, a)).elementType = M,
                        e.lanes = o,
                        e;
                    case D:
                        return ju(n, a, o, t);
                    default:
                        if ("object" == typeof e && null !== e)
                            switch (e.$$typeof) {
                            case E:
                                s = 10;
                                break e;
                            case P:
                                s = 9;
                                break e;
                            case C:
                                s = 11;
                                break e;
                            case A:
                                s = 14;
                                break e;
                            case R:
                                s = 16,
                                r = null;
                                break e
                            }
                        throw Error(i(130, null == e ? e : typeof e, ""))
                    }
                return (t = Au(s, n, t, a)).elementType = e,
                t.type = r,
                t.lanes = o,
                t
            }
            function Ou(e, t, n, r) {
                return (e = Au(7, e, r, t)).lanes = n,
                e
            }
            function ju(e, t, n, r) {
                return (e = Au(22, e, r, t)).elementType = D,
                e.lanes = n,
                e.stateNode = {
                    isHidden: !1
                },
                e
            }
            function zu(e, t, n) {
                return (e = Au(6, e, null, t)).lanes = n,
                e
            }
            function Vu(e, t, n) {
                return (t = Au(4, null !== e.children ? e.children : [], e.key, t)).lanes = n,
                t.stateNode = {
                    containerInfo: e.containerInfo,
                    pendingChildren: null,
                    implementation: e.implementation
                },
                t
            }
            function Fu(e, t, n, r, a) {
                this.tag = t,
                this.containerInfo = e,
                this.finishedWork = this.pingCache = this.current = this.pendingChildren = null,
                this.timeoutHandle = -1,
                this.callbackNode = this.pendingContext = this.context = null,
                this.callbackPriority = 0,
                this.eventTimes = gt(0),
                this.expirationTimes = gt(-1),
                this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
                this.entanglements = gt(0),
                this.identifierPrefix = r,
                this.onRecoverableError = a,
                this.mutableSourceEagerHydrationData = null
            }
            function Iu(e, t, n, r, a, i, o, s, l) {
                return e = new Fu(e,t,n,s,l),
                1 === t ? (t = 1,
                !0 === i && (t |= 8)) : t = 0,
                i = Au(3, null, null, t),
                e.current = i,
                i.stateNode = e,
                i.memoizedState = {
                    element: r,
                    isDehydrated: n,
                    cache: null,
                    transitions: null,
                    pendingSuspenseBoundaries: null
                },
                ji(i),
                e
            }
            function Uu(e) {
                if (!e)
                    return Pa;
                e: {
                    if (Be(e = e._reactInternals) !== e || 1 !== e.tag)
                        throw Error(i(170));
                    var t = e;
                    do {
                        switch (t.tag) {
                        case 3:
                            t = t.stateNode.context;
                            break e;
                        case 1:
                            if (Ra(t.type)) {
                                t = t.stateNode.__reactInternalMemoizedMergedChildContext;
                                break e
                            }
                        }
                        t = t.return
                    } while (null !== t);
                    throw Error(i(171))
                }
                if (1 === e.tag) {
                    var n = e.type;
                    if (Ra(n))
                        return Oa(e, n, t)
                }
                return t
            }
            function Bu(e, t, n, r, a, i, o, s, l) {
                return (e = Iu(n, r, !0, e, 0, i, 0, s, l)).context = Uu(null),
                n = e.current,
                (i = Vi(r = eu(), a = tu(n))).callback = null != t ? t : null,
                Fi(n, i, a),
                e.current.lanes = a,
                yt(e, a, r),
                ru(e, r),
                e
            }
            function $u(e, t, n, r) {
                var a = t.current
                  , i = eu()
                  , o = tu(a);
                return n = Uu(n),
                null === t.context ? t.context = n : t.pendingContext = n,
                (t = Vi(i, o)).payload = {
                    element: e
                },
                null !== (r = void 0 === r ? null : r) && (t.callback = r),
                null !== (e = Fi(a, t, o)) && (nu(e, a, o, i),
                Ii(e, a, o)),
                o
            }
            function Wu(e) {
                return (e = e.current).child ? (e.child.tag,
                e.child.stateNode) : null
            }
            function Hu(e, t) {
                if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
                    var n = e.retryLane;
                    e.retryLane = 0 !== n && n < t ? n : t
                }
            }
            function Yu(e, t) {
                Hu(e, t),
                (e = e.alternate) && Hu(e, t)
            }
            Nl = function(e, t, n) {
                if (null !== e)
                    if (e.memoizedProps !== t.pendingProps || Ta.current)
                        vs = !0;
                    else {
                        if (0 === (e.lanes & n) && !(128 & t.flags))
                            return vs = !1,
                            function(e, t, n) {
                                switch (t.tag) {
                                case 3:
                                    Ts(t),
                                    fi();
                                    break;
                                case 5:
                                    Gi(t);
                                    break;
                                case 1:
                                    Ra(t.type) && ja(t);
                                    break;
                                case 4:
                                    qi(t, t.stateNode.containerInfo);
                                    break;
                                case 10:
                                    var r = t.type._context
                                      , a = t.memoizedProps.value;
                                    Ea(_i, r._currentValue),
                                    r._currentValue = a;
                                    break;
                                case 13:
                                    if (null !== (r = t.memoizedState))
                                        return null !== r.dehydrated ? (Ea(Ji, 1 & Ji.current),
                                        t.flags |= 128,
                                        null) : 0 !== (n & t.child.childLanes) ? zs(e, t, n) : (Ea(Ji, 1 & Ji.current),
                                        null !== (e = Ws(e, t, n)) ? e.sibling : null);
                                    Ea(Ji, 1 & Ji.current);
                                    break;
                                case 19:
                                    if (r = 0 !== (n & t.childLanes),
                                    128 & e.flags) {
                                        if (r)
                                            return Bs(e, t, n);
                                        t.flags |= 128
                                    }
                                    if (null !== (a = t.memoizedState) && (a.rendering = null,
                                    a.tail = null,
                                    a.lastEffect = null),
                                    Ea(Ji, Ji.current),
                                    r)
                                        break;
                                    return null;
                                case 22:
                                case 23:
                                    return t.lanes = 0,
                                    ks(e, t, n)
                                }
                                return Ws(e, t, n)
                            }(e, t, n);
                        vs = !!(131072 & e.flags)
                    }
                else
                    vs = !1,
                    ai && 1048576 & t.flags && Ja(t, Ya, t.index);
                switch (t.lanes = 0,
                t.tag) {
                case 2:
                    var r = t.type;
                    $s(e, t),
                    e = t.pendingProps;
                    var a = Aa(t, Ca.current);
                    Ti(t, n),
                    a = go(null, t, r, e, a, n);
                    var o = yo();
                    return t.flags |= 1,
                    "object" == typeof a && null !== a && "function" == typeof a.render && void 0 === a.$$typeof ? (t.tag = 1,
                    t.memoizedState = null,
                    t.updateQueue = null,
                    Ra(r) ? (o = !0,
                    ja(t)) : o = !1,
                    t.memoizedState = null !== a.state && void 0 !== a.state ? a.state : null,
                    ji(t),
                    a.updater = as,
                    t.stateNode = a,
                    a._reactInternals = t,
                    ls(t, r, e, n),
                    t = Cs(null, t, r, !0, o, n)) : (t.tag = 0,
                    ai && o && ei(t),
                    ws(null, t, a, n),
                    t = t.child),
                    t;
                case 16:
                    r = t.elementType;
                    e: {
                        switch ($s(e, t),
                        e = t.pendingProps,
                        r = (a = r._init)(r._payload),
                        t.type = r,
                        a = t.tag = function(e) {
                            if ("function" == typeof e)
                                return Ru(e) ? 1 : 0;
                            if (null != e) {
                                if ((e = e.$$typeof) === C)
                                    return 11;
                                if (e === A)
                                    return 14
                            }
                            return 2
                        }(r),
                        e = ns(r, e),
                        a) {
                        case 0:
                            t = Es(null, t, r, e, n);
                            break e;
                        case 1:
                            t = Ps(null, t, r, e, n);
                            break e;
                        case 11:
                            t = xs(null, t, r, e, n);
                            break e;
                        case 14:
                            t = _s(null, t, r, ns(r.type, e), n);
                            break e
                        }
                        throw Error(i(306, r, ""))
                    }
                    return t;
                case 0:
                    return r = t.type,
                    a = t.pendingProps,
                    Es(e, t, r, a = t.elementType === r ? a : ns(r, a), n);
                case 1:
                    return r = t.type,
                    a = t.pendingProps,
                    Ps(e, t, r, a = t.elementType === r ? a : ns(r, a), n);
                case 3:
                    e: {
                        if (Ts(t),
                        null === e)
                            throw Error(i(387));
                        r = t.pendingProps,
                        a = (o = t.memoizedState).element,
                        zi(e, t),
                        Bi(t, r, null, n);
                        var s = t.memoizedState;
                        if (r = s.element,
                        o.isDehydrated) {
                            if (o = {
                                element: r,
                                isDehydrated: !1,
                                cache: s.cache,
                                pendingSuspenseBoundaries: s.pendingSuspenseBoundaries,
                                transitions: s.transitions
                            },
                            t.updateQueue.baseState = o,
                            t.memoizedState = o,
                            256 & t.flags) {
                                t = Ms(e, t, r, n, a = us(Error(i(423)), t));
                                break e
                            }
                            if (r !== a) {
                                t = Ms(e, t, r, n, a = us(Error(i(424)), t));
                                break e
                            }
                            for (ri = ua(t.stateNode.containerInfo.firstChild),
                            ni = t,
                            ai = !0,
                            ii = null,
                            n = xi(t, null, r, n),
                            t.child = n; n; )
                                n.flags = -3 & n.flags | 4096,
                                n = n.sibling
                        } else {
                            if (fi(),
                            r === a) {
                                t = Ws(e, t, n);
                                break e
                            }
                            ws(e, t, r, n)
                        }
                        t = t.child
                    }
                    return t;
                case 5:
                    return Gi(t),
                    null === e && ui(t),
                    r = t.type,
                    a = t.pendingProps,
                    o = null !== e ? e.memoizedProps : null,
                    s = a.children,
                    na(r, a) ? s = null : null !== o && na(r, o) && (t.flags |= 32),
                    Ss(e, t),
                    ws(e, t, s, n),
                    t.child;
                case 6:
                    return null === e && ui(t),
                    null;
                case 13:
                    return zs(e, t, n);
                case 4:
                    return qi(t, t.stateNode.containerInfo),
                    r = t.pendingProps,
                    null === e ? t.child = wi(t, null, r, n) : ws(e, t, r, n),
                    t.child;
                case 11:
                    return r = t.type,
                    a = t.pendingProps,
                    xs(e, t, r, a = t.elementType === r ? a : ns(r, a), n);
                case 7:
                    return ws(e, t, t.pendingProps, n),
                    t.child;
                case 8:
                case 12:
                    return ws(e, t, t.pendingProps.children, n),
                    t.child;
                case 10:
                    e: {
                        if (r = t.type._context,
                        a = t.pendingProps,
                        o = t.memoizedProps,
                        s = a.value,
                        Ea(_i, r._currentValue),
                        r._currentValue = s,
                        null !== o)
                            if (sr(o.value, s)) {
                                if (o.children === a.children && !Ta.current) {
                                    t = Ws(e, t, n);
                                    break e
                                }
                            } else
                                for (null !== (o = t.child) && (o.return = t); null !== o; ) {
                                    var l = o.dependencies;
                                    if (null !== l) {
                                        s = o.child;
                                        for (var u = l.firstContext; null !== u; ) {
                                            if (u.context === r) {
                                                if (1 === o.tag) {
                                                    (u = Vi(-1, n & -n)).tag = 2;
                                                    var c = o.updateQueue;
                                                    if (null !== c) {
                                                        var d = (c = c.shared).pending;
                                                        null === d ? u.next = u : (u.next = d.next,
                                                        d.next = u),
                                                        c.pending = u
                                                    }
                                                }
                                                o.lanes |= n,
                                                null !== (u = o.alternate) && (u.lanes |= n),
                                                Ci(o.return, n, t),
                                                l.lanes |= n;
                                                break
                                            }
                                            u = u.next
                                        }
                                    } else if (10 === o.tag)
                                        s = o.type === t.type ? null : o.child;
                                    else if (18 === o.tag) {
                                        if (null === (s = o.return))
                                            throw Error(i(341));
                                        s.lanes |= n,
                                        null !== (l = s.alternate) && (l.lanes |= n),
                                        Ci(s, n, t),
                                        s = o.sibling
                                    } else
                                        s = o.child;
                                    if (null !== s)
                                        s.return = o;
                                    else
                                        for (s = o; null !== s; ) {
                                            if (s === t) {
                                                s = null;
                                                break
                                            }
                                            if (null !== (o = s.sibling)) {
                                                o.return = s.return,
                                                s = o;
                                                break
                                            }
                                            s = s.return
                                        }
                                    o = s
                                }
                        ws(e, t, a.children, n),
                        t = t.child
                    }
                    return t;
                case 9:
                    return a = t.type,
                    r = t.pendingProps.children,
                    Ti(t, n),
                    r = r(a = Mi(a)),
                    t.flags |= 1,
                    ws(e, t, r, n),
                    t.child;
                case 14:
                    return a = ns(r = t.type, t.pendingProps),
                    _s(e, t, r, a = ns(r.type, a), n);
                case 15:
                    return Ns(e, t, t.type, t.pendingProps, n);
                case 17:
                    return r = t.type,
                    a = t.pendingProps,
                    a = t.elementType === r ? a : ns(r, a),
                    $s(e, t),
                    t.tag = 1,
                    Ra(r) ? (e = !0,
                    ja(t)) : e = !1,
                    Ti(t, n),
                    os(t, r, a),
                    ls(t, r, a, n),
                    Cs(null, t, r, !0, e, n);
                case 19:
                    return Bs(e, t, n);
                case 22:
                    return ks(e, t, n)
                }
                throw Error(i(156, t.tag))
            }
            ;
            var Ku = "function" == typeof reportError ? reportError : function(e) {
                console.error(e)
            }
            ;
            function Qu(e) {
                this._internalRoot = e
            }
            function qu(e) {
                this._internalRoot = e
            }
            function Xu(e) {
                return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType)
            }
            function Gu(e) {
                return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType && (8 !== e.nodeType || " react-mount-point-unstable " !== e.nodeValue))
            }
            function Zu() {}
            function Ju(e, t, n, r, a) {
                var i = n._reactRootContainer;
                if (i) {
                    var o = i;
                    if ("function" == typeof a) {
                        var s = a;
                        a = function() {
                            var e = Wu(o);
                            s.call(e)
                        }
                    }
                    $u(t, o, e, a)
                } else
                    o = function(e, t, n, r, a) {
                        if (a) {
                            if ("function" == typeof r) {
                                var i = r;
                                r = function() {
                                    var e = Wu(o);
                                    i.call(e)
                                }
                            }
                            var o = Bu(t, r, e, 0, null, !1, 0, "", Zu);
                            return e._reactRootContainer = o,
                            e[ha] = o.current,
                            Br(8 === e.nodeType ? e.parentNode : e),
                            cu(),
                            o
                        }
                        for (; a = e.lastChild; )
                            e.removeChild(a);
                        if ("function" == typeof r) {
                            var s = r;
                            r = function() {
                                var e = Wu(l);
                                s.call(e)
                            }
                        }
                        var l = Iu(e, 0, !1, null, 0, !1, 0, "", Zu);
                        return e._reactRootContainer = l,
                        e[ha] = l.current,
                        Br(8 === e.nodeType ? e.parentNode : e),
                        cu(function() {
                            $u(t, l, n, r)
                        }),
                        l
                    }(n, t, e, a, r);
                return Wu(o)
            }
            qu.prototype.render = Qu.prototype.render = function(e) {
                var t = this._internalRoot;
                if (null === t)
                    throw Error(i(409));
                $u(e, t, null, null)
            }
            ,
            qu.prototype.unmount = Qu.prototype.unmount = function() {
                var e = this._internalRoot;
                if (null !== e) {
                    this._internalRoot = null;
                    var t = e.containerInfo;
                    cu(function() {
                        $u(null, e, null, null)
                    }),
                    t[ha] = null
                }
            }
            ,
            qu.prototype.unstable_scheduleHydration = function(e) {
                if (e) {
                    var t = kt();
                    e = {
                        blockedOn: null,
                        target: e,
                        priority: t
                    };
                    for (var n = 0; n < Dt.length && 0 !== t && t < Dt[n].priority; n++)
                        ;
                    Dt.splice(n, 0, e),
                    0 === n && zt(e)
                }
            }
            ,
            xt = function(e) {
                switch (e.tag) {
                case 3:
                    var t = e.stateNode;
                    if (t.current.memoizedState.isDehydrated) {
                        var n = dt(t.pendingLanes);
                        0 !== n && (bt(t, 1 | n),
                        ru(t, Ge()),
                        !(6 & Cl) && (Bl = Ge() + 500,
                        Ba()))
                    }
                    break;
                case 13:
                    cu(function() {
                        var t = Li(e, 1);
                        if (null !== t) {
                            var n = eu();
                            nu(t, e, 1, n)
                        }
                    }),
                    Yu(e, 1)
                }
            }
            ,
            _t = function(e) {
                if (13 === e.tag) {
                    var t = Li(e, 134217728);
                    null !== t && nu(t, e, 134217728, eu()),
                    Yu(e, 134217728)
                }
            }
            ,
            Nt = function(e) {
                if (13 === e.tag) {
                    var t = tu(e)
                      , n = Li(e, t);
                    null !== n && nu(n, e, t, eu()),
                    Yu(e, t)
                }
            }
            ,
            kt = function() {
                return vt
            }
            ,
            St = function(e, t) {
                var n = vt;
                try {
                    return vt = e,
                    t()
                } finally {
                    vt = n
                }
            }
            ,
            _e = function(e, t, n) {
                switch (t) {
                case "input":
                    if (Z(e, n),
                    t = n.name,
                    "radio" === n.type && null != t) {
                        for (n = e; n.parentNode; )
                            n = n.parentNode;
                        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'),
                        t = 0; t < n.length; t++) {
                            var r = n[t];
                            if (r !== e && r.form === e.form) {
                                var a = xa(r);
                                if (!a)
                                    throw Error(i(90));
                                K(r),
                                Z(r, a)
                            }
                        }
                    }
                    break;
                case "textarea":
                    ie(e, n);
                    break;
                case "select":
                    null != (t = n.value) && ne(e, !!n.multiple, t, !1)
                }
            }
            ,
            Ce = uu,
            Te = cu;
            var ec = {
                usingClientEntryPoint: !1,
                Events: [va, wa, xa, Ee, Pe, uu]
            }
              , tc = {
                findFiberByHostInstance: ba,
                bundleType: 0,
                version: "18.3.1",
                rendererPackageName: "react-dom"
            }
              , nc = {
                bundleType: tc.bundleType,
                version: tc.version,
                rendererPackageName: tc.rendererPackageName,
                rendererConfig: tc.rendererConfig,
                overrideHookState: null,
                overrideHookStateDeletePath: null,
                overrideHookStateRenamePath: null,
                overrideProps: null,
                overridePropsDeletePath: null,
                overridePropsRenamePath: null,
                setErrorHandler: null,
                setSuspenseHandler: null,
                scheduleUpdate: null,
                currentDispatcherRef: w.ReactCurrentDispatcher,
                findHostInstanceByFiber: function(e) {
                    return null === (e = He(e)) ? null : e.stateNode
                },
                findFiberByHostInstance: tc.findFiberByHostInstance || function() {
                    return null
                }
                ,
                findHostInstancesForRefresh: null,
                scheduleRefresh: null,
                scheduleRoot: null,
                setRefreshHandler: null,
                getCurrentFiber: null,
                reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
            };
            if ("undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
                var rc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
                if (!rc.isDisabled && rc.supportsFiber)
                    try {
                        at = rc.inject(nc),
                        it = rc
                    } catch (ce) {}
            }
            t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ec,
            t.createPortal = function(e, t) {
                var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
                if (!Xu(t))
                    throw Error(i(200));
                return function(e, t, n) {
                    var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
                    return {
                        $$typeof: _,
                        key: null == r ? null : "" + r,
                        children: e,
                        containerInfo: t,
                        implementation: n
                    }
                }(e, t, null, n)
            }
            ,
            t.createRoot = function(e, t) {
                if (!Xu(e))
                    throw Error(i(299));
                var n = !1
                  , r = ""
                  , a = Ku;
                return null != t && (!0 === t.unstable_strictMode && (n = !0),
                void 0 !== t.identifierPrefix && (r = t.identifierPrefix),
                void 0 !== t.onRecoverableError && (a = t.onRecoverableError)),
                t = Iu(e, 1, !1, null, 0, n, 0, r, a),
                e[ha] = t.current,
                Br(8 === e.nodeType ? e.parentNode : e),
                new Qu(t)
            }
            ,
            t.findDOMNode = function(e) {
                if (null == e)
                    return null;
                if (1 === e.nodeType)
                    return e;
                var t = e._reactInternals;
                if (void 0 === t) {
                    if ("function" == typeof e.render)
                        throw Error(i(188));
                    throw e = Object.keys(e).join(","),
                    Error(i(268, e))
                }
                return null === (e = He(t)) ? null : e.stateNode
            }
            ,
            t.flushSync = function(e) {
                return cu(e)
            }
            ,
            t.hydrate = function(e, t, n) {
                if (!Gu(t))
                    throw Error(i(200));
                return Ju(null, e, t, !0, n)
            }
            ,
            t.hydrateRoot = function(e, t, n) {
                if (!Xu(e))
                    throw Error(i(405));
                var r = null != n && n.hydratedSources || null
                  , a = !1
                  , o = ""
                  , s = Ku;
                if (null != n && (!0 === n.unstable_strictMode && (a = !0),
                void 0 !== n.identifierPrefix && (o = n.identifierPrefix),
                void 0 !== n.onRecoverableError && (s = n.onRecoverableError)),
                t = Bu(t, null, e, 1, null != n ? n : null, a, 0, o, s),
                e[ha] = t.current,
                Br(e),
                r)
                    for (e = 0; e < r.length; e++)
                        a = (a = (n = r[e])._getVersion)(n._source),
                        null == t.mutableSourceEagerHydrationData ? t.mutableSourceEagerHydrationData = [n, a] : t.mutableSourceEagerHydrationData.push(n, a);
                return new qu(t)
            }
            ,
            t.render = function(e, t, n) {
                if (!Gu(t))
                    throw Error(i(200));
                return Ju(null, e, t, !1, n)
            }
            ,
            t.unmountComponentAtNode = function(e) {
                if (!Gu(e))
                    throw Error(i(40));
                return !!e._reactRootContainer && (cu(function() {
                    Ju(null, null, e, !1, function() {
                        e._reactRootContainer = null,
                        e[ha] = null
                    })
                }),
                !0)
            }
            ,
            t.unstable_batchedUpdates = uu,
            t.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
                if (!Gu(n))
                    throw Error(i(200));
                if (null == e || void 0 === e._reactInternals)
                    throw Error(i(38));
                return Ju(e, t, n, !1, r)
            }
            ,
            t.version = "18.3.1-next-f1338f8080-20240426"
        }
    }, r = {};
    function a(e) {
        var t = r[e];
        if (void 0 !== t)
            return t.exports;
        var i = r[e] = {
            id: e,
            exports: {}
        };
        return n[e](i, i.exports, a),
        i.exports
    }
    a.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return a.d(t, {
            a: t
        }),
        t
    }
    ,
    t = Object.getPrototypeOf ? e => Object.getPrototypeOf(e) : e => e.__proto__,
    a.t = function(n, r) {
        if (1 & r && (n = this(n)),
        8 & r)
            return n;
        if ("object" == typeof n && n) {
            if (4 & r && n.__esModule)
                return n;
            if (16 & r && "function" == typeof n.then)
                return n
        }
        var i = Object.create(null);
        a.r(i);
        var o = {};
        e = e || [null, t({}), t([]), t(t)];
        for (var s = 2 & r && n; ("object" == typeof s || "function" == typeof s) && !~e.indexOf(s); s = t(s))
            Object.getOwnPropertyNames(s).forEach(e => o[e] = () => n[e]);
        return o.default = () => n,
        a.d(i, o),
        i
    }
    ,
    a.d = (e, t) => {
        for (var n in t)
            a.o(t, n) && !a.o(e, n) && Object.defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            })
    }
    ,
    a.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    a.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    a.nc = void 0;
    var i, o = a(171), s = a.t(o, 2), l = a(594), u = a(353), c = a.t(u, 2);
    function d() {
        return d = Object.assign ? Object.assign.bind() : function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ,
        d.apply(this, arguments)
    }
    !function(e) {
        e.Pop = "POP",
        e.Push = "PUSH",
        e.Replace = "REPLACE"
    }(i || (i = {}));
    const m = "popstate";
    function f(e, t) {
        if (!1 === e || null == e)
            throw new Error(t)
    }
    function h(e, t) {
        if (!e) {
            "undefined" != typeof console && console.warn(t);
            try {
                throw new Error(t)
            } catch (e) {}
        }
    }
    function p(e, t) {
        return {
            usr: e.state,
            key: e.key,
            idx: t
        }
    }
    function g(e, t, n, r) {
        return void 0 === n && (n = null),
        d({
            pathname: "string" == typeof e ? e : e.pathname,
            search: "",
            hash: ""
        }, "string" == typeof t ? b(t) : t, {
            state: n,
            key: t && t.key || r || Math.random().toString(36).substr(2, 8)
        })
    }
    function y(e) {
        let {pathname: t="/", search: n="", hash: r=""} = e;
        return n && "?" !== n && (t += "?" === n.charAt(0) ? n : "?" + n),
        r && "#" !== r && (t += "#" === r.charAt(0) ? r : "#" + r),
        t
    }
    function b(e) {
        let t = {};
        if (e) {
            let n = e.indexOf("#");
            n >= 0 && (t.hash = e.substr(n),
            e = e.substr(0, n));
            let r = e.indexOf("?");
            r >= 0 && (t.search = e.substr(r),
            e = e.substr(0, r)),
            e && (t.pathname = e)
        }
        return t
    }
    var v;
    function w(e, t, n) {
        return void 0 === n && (n = "/"),
        function(e, t, n, r) {
            let a = L(("string" == typeof t ? b(t) : t).pathname || "/", n);
            if (null == a)
                return null;
            let i = x(e);
            !function(e) {
                e.sort( (e, t) => e.score !== t.score ? t.score - e.score : function(e, t) {
                    return e.length === t.length && e.slice(0, -1).every( (e, n) => e === t[n]) ? e[e.length - 1] - t[t.length - 1] : 0
                }(e.routesMeta.map(e => e.childrenIndex), t.routesMeta.map(e => e.childrenIndex)))
            }(i);
            let o = null;
            for (let e = 0; null == o && e < i.length; ++e) {
                let t = D(a);
                o = A(i[e], t, r)
            }
            return o
        }(e, t, n, !1)
    }
    function x(e, t, n, r) {
        void 0 === t && (t = []),
        void 0 === n && (n = []),
        void 0 === r && (r = "");
        let a = (e, a, i) => {
            let o = {
                relativePath: void 0 === i ? e.path || "" : i,
                caseSensitive: !0 === e.caseSensitive,
                childrenIndex: a,
                route: e
            };
            o.relativePath.startsWith("/") && (f(o.relativePath.startsWith(r), 'Absolute route path "' + o.relativePath + '" nested under path "' + r + '" is not valid. An absolute child route path must start with the combined path of all its parent routes.'),
            o.relativePath = o.relativePath.slice(r.length));
            let s = j([r, o.relativePath])
              , l = n.concat(o);
            e.children && e.children.length > 0 && (f(!0 !== e.index, 'Index routes must not have child routes. Please remove all child routes from route path "' + s + '".'),
            x(e.children, t, l, s)),
            (null != e.path || e.index) && t.push({
                path: s,
                score: M(s, e.index),
                routesMeta: l
            })
        }
        ;
        return e.forEach( (e, t) => {
            var n;
            if ("" !== e.path && null != (n = e.path) && n.includes("?"))
                for (let n of _(e.path))
                    a(e, t, n);
            else
                a(e, t)
        }
        ),
        t
    }
    function _(e) {
        let t = e.split("/");
        if (0 === t.length)
            return [];
        let[n,...r] = t
          , a = n.endsWith("?")
          , i = n.replace(/\?$/, "");
        if (0 === r.length)
            return a ? [i, ""] : [i];
        let o = _(r.join("/"))
          , s = [];
        return s.push(...o.map(e => "" === e ? i : [i, e].join("/"))),
        a && s.push(...o),
        s.map(t => e.startsWith("/") && "" === t ? "/" : t)
    }
    !function(e) {
        e.data = "data",
        e.deferred = "deferred",
        e.redirect = "redirect",
        e.error = "error"
    }(v || (v = {})),
    new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
    const N = /^:[\w-]+$/
      , k = 3
      , S = 2
      , E = 1
      , P = 10
      , C = -2
      , T = e => "*" === e;
    function M(e, t) {
        let n = e.split("/")
          , r = n.length;
        return n.some(T) && (r += C),
        t && (r += S),
        n.filter(e => !T(e)).reduce( (e, t) => e + (N.test(t) ? k : "" === t ? E : P), r)
    }
    function A(e, t, n) {
        void 0 === n && (n = !1);
        let {routesMeta: r} = e
          , a = {}
          , i = "/"
          , o = [];
        for (let e = 0; e < r.length; ++e) {
            let s = r[e]
              , l = e === r.length - 1
              , u = "/" === i ? t : t.slice(i.length) || "/"
              , c = R({
                path: s.relativePath,
                caseSensitive: s.caseSensitive,
                end: l
            }, u)
              , d = s.route;
            if (!c && l && n && !r[r.length - 1].route.index && (c = R({
                path: s.relativePath,
                caseSensitive: s.caseSensitive,
                end: !1
            }, u)),
            !c)
                return null;
            Object.assign(a, c.params),
            o.push({
                params: a,
                pathname: j([i, c.pathname]),
                pathnameBase: z(j([i, c.pathnameBase])),
                route: d
            }),
            "/" !== c.pathnameBase && (i = j([i, c.pathnameBase]))
        }
        return o
    }
    function R(e, t) {
        "string" == typeof e && (e = {
            path: e,
            caseSensitive: !1,
            end: !0
        });
        let[n,r] = function(e, t, n) {
            void 0 === t && (t = !1),
            void 0 === n && (n = !0),
            h("*" === e || !e.endsWith("*") || e.endsWith("/*"), 'Route path "' + e + '" will be treated as if it were "' + e.replace(/\*$/, "/*") + '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "' + e.replace(/\*$/, "/*") + '".');
            let r = []
              , a = "^" + e.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (e, t, n) => (r.push({
                paramName: t,
                isOptional: null != n
            }),
            n ? "/?([^\\/]+)?" : "/([^\\/]+)"));
            return e.endsWith("*") ? (r.push({
                paramName: "*"
            }),
            a += "*" === e || "/*" === e ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : n ? a += "\\/*$" : "" !== e && "/" !== e && (a += "(?:(?=\\/|$))"),
            [new RegExp(a,t ? void 0 : "i"), r]
        }(e.path, e.caseSensitive, e.end)
          , a = t.match(n);
        if (!a)
            return null;
        let i = a[0]
          , o = i.replace(/(.)\/+$/, "$1")
          , s = a.slice(1)
          , l = r.reduce( (e, t, n) => {
            let {paramName: r, isOptional: a} = t;
            if ("*" === r) {
                let e = s[n] || "";
                o = i.slice(0, i.length - e.length).replace(/(.)\/+$/, "$1")
            }
            const l = s[n];
            return e[r] = a && !l ? void 0 : (l || "").replace(/%2F/g, "/"),
            e
        }
        , {});
        return {
            params: l,
            pathname: i,
            pathnameBase: o,
            pattern: e
        }
    }
    function D(e) {
        try {
            return e.split("/").map(e => decodeURIComponent(e).replace(/\//g, "%2F")).join("/")
        } catch (t) {
            return h(!1, 'The URL path "' + e + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding (' + t + ")."),
            e
        }
    }
    function L(e, t) {
        if ("/" === t)
            return e;
        if (!e.toLowerCase().startsWith(t.toLowerCase()))
            return null;
        let n = t.endsWith("/") ? t.length - 1 : t.length
          , r = e.charAt(n);
        return r && "/" !== r ? null : e.slice(n) || "/"
    }
    function O(e, t, n, r) {
        return "Cannot include a '" + e + "' character in a manually specified `to." + t + "` field [" + JSON.stringify(r) + "].  Please separate it out to the `to." + n + '` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'
    }
    const j = e => e.join("/").replace(/\/\/+/g, "/")
      , z = e => e.replace(/\/+$/, "").replace(/^\/*/, "/")
      , V = e => e && "?" !== e ? e.startsWith("?") ? e : "?" + e : ""
      , F = e => e && "#" !== e ? e.startsWith("#") ? e : "#" + e : "";
    Error;
    const I = ["post", "put", "patch", "delete"]
      , U = (new Set(I),
    ["get", ...I]);
    function B() {
        return B = Object.assign ? Object.assign.bind() : function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r])
            }
            return e
        }
        ,
        B.apply(this, arguments)
    }
    new Set(U),
    new Set([301, 302, 303, 307, 308]),
    new Set([307, 308]),
    Symbol("deferred");
    const $ = o.createContext(null)
      , W = o.createContext(null)
      , H = o.createContext(null)
      , Y = o.createContext(null)
      , K = o.createContext({
        outlet: null,
        matches: [],
        isDataRoute: !1
    })
      , Q = o.createContext(null);
    function q() {
        return null != o.useContext(Y)
    }
    function X() {
        return q() || f(!1),
        o.useContext(Y).location
    }
    function G(e) {
        o.useContext(H).static || o.useLayoutEffect(e)
    }
    function Z() {
        let {isDataRoute: e} = o.useContext(K);
        return e ? function() {
            let {router: e} = function() {
                let e = o.useContext($);
                return e || f(!1),
                e
            }(ae.UseNavigateStable)
              , t = oe(ie.UseNavigateStable)
              , n = o.useRef(!1);
            G( () => {
                n.current = !0
            }
            );
            let r = o.useCallback(function(r, a) {
                void 0 === a && (a = {}),
                n.current && ("number" == typeof r ? e.navigate(r) : e.navigate(r, B({
                    fromRouteId: t
                }, a)))
            }, [e, t]);
            return r
        }() : function() {
            q() || f(!1);
            let e = o.useContext($)
              , {basename: t, future: n, navigator: r} = o.useContext(H)
              , {matches: a} = o.useContext(K)
              , {pathname: i} = X()
              , s = JSON.stringify(function(e, t) {
                let n = function(e) {
                    return e.filter( (e, t) => 0 === t || e.route.path && e.route.path.length > 0)
                }(e);
                return t ? n.map( (e, t) => t === n.length - 1 ? e.pathname : e.pathnameBase) : n.map(e => e.pathnameBase)
            }(a, n.v7_relativeSplatPath))
              , l = o.useRef(!1);
            G( () => {
                l.current = !0
            }
            );
            let u = o.useCallback(function(n, a) {
                if (void 0 === a && (a = {}),
                !l.current)
                    return;
                if ("number" == typeof n)
                    return void r.go(n);
                let o = function(e, t, n, r) {
                    let a;
                    void 0 === r && (r = !1),
                    "string" == typeof e ? a = b(e) : (a = d({}, e),
                    f(!a.pathname || !a.pathname.includes("?"), O("?", "pathname", "search", a)),
                    f(!a.pathname || !a.pathname.includes("#"), O("#", "pathname", "hash", a)),
                    f(!a.search || !a.search.includes("#"), O("#", "search", "hash", a)));
                    let i, o = "" === e || "" === a.pathname, s = o ? "/" : a.pathname;
                    if (null == s)
                        i = n;
                    else {
                        let e = t.length - 1;
                        if (!r && s.startsWith("..")) {
                            let t = s.split("/");
                            for (; ".." === t[0]; )
                                t.shift(),
                                e -= 1;
                            a.pathname = t.join("/")
                        }
                        i = e >= 0 ? t[e] : "/"
                    }
                    let l = function(e, t) {
                        void 0 === t && (t = "/");
                        let {pathname: n, search: r="", hash: a=""} = "string" == typeof e ? b(e) : e
                          , i = n ? n.startsWith("/") ? n : function(e, t) {
                            let n = t.replace(/\/+$/, "").split("/");
                            return e.split("/").forEach(e => {
                                ".." === e ? n.length > 1 && n.pop() : "." !== e && n.push(e)
                            }
                            ),
                            n.length > 1 ? n.join("/") : "/"
                        }(n, t) : t;
                        return {
                            pathname: i,
                            search: V(r),
                            hash: F(a)
                        }
                    }(a, i)
                      , u = s && "/" !== s && s.endsWith("/")
                      , c = (o || "." === s) && n.endsWith("/");
                    return l.pathname.endsWith("/") || !u && !c || (l.pathname += "/"),
                    l
                }(n, JSON.parse(s), i, "path" === a.relative);
                null == e && "/" !== t && (o.pathname = "/" === o.pathname ? t : j([t, o.pathname])),
                (a.replace ? r.replace : r.push)(o, a.state, a)
            }, [t, r, s, i, e]);
            return u
        }()
    }
    function J(e, t, n, r) {
        q() || f(!1);
        let {navigator: a} = o.useContext(H)
          , {matches: s} = o.useContext(K)
          , l = s[s.length - 1]
          , u = l ? l.params : {}
          , c = (l && l.pathname,
        l ? l.pathnameBase : "/");
        l && l.route;
        let d, m = X();
        if (t) {
            var h;
            let e = "string" == typeof t ? b(t) : t;
            "/" === c || (null == (h = e.pathname) ? void 0 : h.startsWith(c)) || f(!1),
            d = e
        } else
            d = m;
        let p = d.pathname || "/"
          , g = p;
        if ("/" !== c) {
            let e = c.replace(/^\//, "").split("/");
            g = "/" + p.replace(/^\//, "").split("/").slice(e.length).join("/")
        }
        let y = w(e, {
            pathname: g
        })
          , v = function(e, t, n, r) {
            var a;
            if (void 0 === t && (t = []),
            void 0 === n && (n = null),
            void 0 === r && (r = null),
            null == e) {
                var i;
                if (!n)
                    return null;
                if (n.errors)
                    e = n.matches;
                else {
                    if (!(null != (i = r) && i.v7_partialHydration && 0 === t.length && !n.initialized && n.matches.length > 0))
                        return null;
                    e = n.matches
                }
            }
            let s = e
              , l = null == (a = n) ? void 0 : a.errors;
            if (null != l) {
                let e = s.findIndex(e => e.route.id && void 0 !== (null == l ? void 0 : l[e.route.id]));
                e >= 0 || f(!1),
                s = s.slice(0, Math.min(s.length, e + 1))
            }
            let u = !1
              , c = -1;
            if (n && r && r.v7_partialHydration)
                for (let e = 0; e < s.length; e++) {
                    let t = s[e];
                    if ((t.route.HydrateFallback || t.route.hydrateFallbackElement) && (c = e),
                    t.route.id) {
                        let {loaderData: e, errors: r} = n
                          , a = t.route.loader && void 0 === e[t.route.id] && (!r || void 0 === r[t.route.id]);
                        if (t.route.lazy || a) {
                            u = !0,
                            s = c >= 0 ? s.slice(0, c + 1) : [s[0]];
                            break
                        }
                    }
                }
            return s.reduceRight( (e, r, a) => {
                let i, d = !1, m = null, f = null;
                var h;
                n && (i = l && r.route.id ? l[r.route.id] : void 0,
                m = r.route.errorElement || te,
                u && (c < 0 && 0 === a ? (se[h = "route-fallback"] || (se[h] = !0),
                d = !0,
                f = null) : c === a && (d = !0,
                f = r.route.hydrateFallbackElement || null)));
                let p = t.concat(s.slice(0, a + 1))
                  , g = () => {
                    let t;
                    return t = i ? m : d ? f : r.route.Component ? o.createElement(r.route.Component, null) : r.route.element ? r.route.element : e,
                    o.createElement(re, {
                        match: r,
                        routeContext: {
                            outlet: e,
                            matches: p,
                            isDataRoute: null != n
                        },
                        children: t
                    })
                }
                ;
                return n && (r.route.ErrorBoundary || r.route.errorElement || 0 === a) ? o.createElement(ne, {
                    location: n.location,
                    revalidation: n.revalidation,
                    component: m,
                    error: i,
                    children: g(),
                    routeContext: {
                        outlet: null,
                        matches: p,
                        isDataRoute: !0
                    }
                }) : g()
            }
            , null)
        }(y && y.map(e => Object.assign({}, e, {
            params: Object.assign({}, u, e.params),
            pathname: j([c, a.encodeLocation ? a.encodeLocation(e.pathname).pathname : e.pathname]),
            pathnameBase: "/" === e.pathnameBase ? c : j([c, a.encodeLocation ? a.encodeLocation(e.pathnameBase).pathname : e.pathnameBase])
        })), s, n, r);
        return t && v ? o.createElement(Y.Provider, {
            value: {
                location: B({
                    pathname: "/",
                    search: "",
                    hash: "",
                    state: null,
                    key: "default"
                }, d),
                navigationType: i.Pop
            }
        }, v) : v
    }
    function ee() {
        let e = function() {
            var e;
            let t = o.useContext(Q)
              , n = function() {
                let e = o.useContext(W);
                return e || f(!1),
                e
            }(ie.UseRouteError)
              , r = oe(ie.UseRouteError);
            return void 0 !== t ? t : null == (e = n.errors) ? void 0 : e[r]
        }()
          , t = function(e) {
            return null != e && "number" == typeof e.status && "string" == typeof e.statusText && "boolean" == typeof e.internal && "data"in e
        }(e) ? e.status + " " + e.statusText : e instanceof Error ? e.message : JSON.stringify(e)
          , n = e instanceof Error ? e.stack : null
          , r = {
            padding: "0.5rem",
            backgroundColor: "rgba(200,200,200, 0.5)"
        };
        return o.createElement(o.Fragment, null, o.createElement("h2", null, "Unexpected Application Error!"), o.createElement("h3", {
            style: {
                fontStyle: "italic"
            }
        }, t), n ? o.createElement("pre", {
            style: r
        }, n) : null, null)
    }
    const te = o.createElement(ee, null);
    class ne extends o.Component {
        constructor(e) {
            super(e),
            this.state = {
                location: e.location,
                revalidation: e.revalidation,
                error: e.error
            }
        }
        static getDerivedStateFromError(e) {
            return {
                error: e
            }
        }
        static getDerivedStateFromProps(e, t) {
            return t.location !== e.location || "idle" !== t.revalidation && "idle" === e.revalidation ? {
                error: e.error,
                location: e.location,
                revalidation: e.revalidation
            } : {
                error: void 0 !== e.error ? e.error : t.error,
                location: t.location,
                revalidation: e.revalidation || t.revalidation
            }
        }
        componentDidCatch(e, t) {
            console.error("React Router caught the following error during render", e, t)
        }
        render() {
            return void 0 !== this.state.error ? o.createElement(K.Provider, {
                value: this.props.routeContext
            }, o.createElement(Q.Provider, {
                value: this.state.error,
                children: this.props.component
            })) : this.props.children
        }
    }
    function re(e) {
        let {routeContext: t, match: n, children: r} = e
          , a = o.useContext($);
        return a && a.static && a.staticContext && (n.route.errorElement || n.route.ErrorBoundary) && (a.staticContext._deepestRenderedBoundaryId = n.route.id),
        o.createElement(K.Provider, {
            value: t
        }, r)
    }
    var ae = function(e) {
        return e.UseBlocker = "useBlocker",
        e.UseRevalidator = "useRevalidator",
        e.UseNavigateStable = "useNavigate",
        e
    }(ae || {})
      , ie = function(e) {
        return e.UseBlocker = "useBlocker",
        e.UseLoaderData = "useLoaderData",
        e.UseActionData = "useActionData",
        e.UseRouteError = "useRouteError",
        e.UseNavigation = "useNavigation",
        e.UseRouteLoaderData = "useRouteLoaderData",
        e.UseMatches = "useMatches",
        e.UseRevalidator = "useRevalidator",
        e.UseNavigateStable = "useNavigate",
        e.UseRouteId = "useRouteId",
        e
    }(ie || {});
    function oe(e) {
        let t = function() {
            let e = o.useContext(K);
            return e || f(!1),
            e
        }()
          , n = t.matches[t.matches.length - 1];
        return n.route.id || f(!1),
        n.route.id
    }
    const se = {};
    function le(e) {
        f(!1)
    }
    function ue(e) {
        let {basename: t="/", children: n=null, location: r, navigationType: a=i.Pop, navigator: s, static: l=!1, future: u} = e;
        q() && f(!1);
        let c = t.replace(/^\/*/, "/")
          , d = o.useMemo( () => ({
            basename: c,
            navigator: s,
            static: l,
            future: B({
                v7_relativeSplatPath: !1
            }, u)
        }), [c, u, s, l]);
        "string" == typeof r && (r = b(r));
        let {pathname: m="/", search: h="", hash: p="", state: g=null, key: y="default"} = r
          , v = o.useMemo( () => {
            let e = L(m, c);
            return null == e ? null : {
                location: {
                    pathname: e,
                    search: h,
                    hash: p,
                    state: g,
                    key: y
                },
                navigationType: a
            }
        }
        , [c, m, h, p, g, y, a]);
        return null == v ? null : o.createElement(H.Provider, {
            value: d
        }, o.createElement(Y.Provider, {
            children: n,
            value: v
        }))
    }
    function ce(e) {
        let {children: t, location: n} = e;
        return J(de(t), n)
    }
    function de(e, t) {
        void 0 === t && (t = []);
        let n = [];
        return o.Children.forEach(e, (e, r) => {
            if (!o.isValidElement(e))
                return;
            let a = [...t, r];
            if (e.type === o.Fragment)
                return void n.push.apply(n, de(e.props.children, a));
            e.type !== le && f(!1),
            e.props.index && e.props.children && f(!1);
            let i = {
                id: e.props.id || a.join("-"),
                caseSensitive: e.props.caseSensitive,
                element: e.props.element,
                Component: e.props.Component,
                index: e.props.index,
                path: e.props.path,
                loader: e.props.loader,
                action: e.props.action,
                errorElement: e.props.errorElement,
                ErrorBoundary: e.props.ErrorBoundary,
                hasErrorBoundary: null != e.props.ErrorBoundary || null != e.props.errorElement,
                shouldRevalidate: e.props.shouldRevalidate,
                handle: e.props.handle,
                lazy: e.props.lazy
            };
            e.props.children && (i.children = de(e.props.children, a)),
            n.push(i)
        }
        ),
        n
    }
    s.startTransition,
    new Promise( () => {}
    ),
    o.Component,
    new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
    try {
        window.__reactRouterVersion = "6"
    } catch (e) {}
    new Map;
    const me = s.startTransition;
    function fe(e) {
        let {basename: t, children: n, future: r, window: a} = e
          , s = o.useRef();
        null == s.current && (s.current = function(e) {
            return void 0 === e && (e = {}),
            function(e, t, n, r) {
                void 0 === r && (r = {});
                let {window: a=document.defaultView, v5Compat: o=!1} = r
                  , s = a.history
                  , l = i.Pop
                  , u = null
                  , c = h();
                function h() {
                    return (s.state || {
                        idx: null
                    }).idx
                }
                function b() {
                    l = i.Pop;
                    let e = h()
                      , t = null == e ? null : e - c;
                    c = e,
                    u && u({
                        action: l,
                        location: w.location,
                        delta: t
                    })
                }
                function v(e) {
                    let t = "null" !== a.location.origin ? a.location.origin : a.location.href
                      , n = "string" == typeof e ? e : y(e);
                    return n = n.replace(/ $/, "%20"),
                    f(t, "No window.location.(origin|href) available to create URL for href: " + n),
                    new URL(n,t)
                }
                null == c && (c = 0,
                s.replaceState(d({}, s.state, {
                    idx: c
                }), ""));
                let w = {
                    get action() {
                        return l
                    },
                    get location() {
                        return e(a, s)
                    },
                    listen(e) {
                        if (u)
                            throw new Error("A history only accepts one active listener");
                        return a.addEventListener(m, b),
                        u = e,
                        () => {
                            a.removeEventListener(m, b),
                            u = null
                        }
                    },
                    createHref: e => t(a, e),
                    createURL: v,
                    encodeLocation(e) {
                        let t = v(e);
                        return {
                            pathname: t.pathname,
                            search: t.search,
                            hash: t.hash
                        }
                    },
                    push: function(e, t) {
                        l = i.Push;
                        let r = g(w.location, e, t);
                        n && n(r, e),
                        c = h() + 1;
                        let d = p(r, c)
                          , m = w.createHref(r);
                        try {
                            s.pushState(d, "", m)
                        } catch (e) {
                            if (e instanceof DOMException && "DataCloneError" === e.name)
                                throw e;
                            a.location.assign(m)
                        }
                        o && u && u({
                            action: l,
                            location: w.location,
                            delta: 1
                        })
                    },
                    replace: function(e, t) {
                        l = i.Replace;
                        let r = g(w.location, e, t);
                        n && n(r, e),
                        c = h();
                        let a = p(r, c)
                          , d = w.createHref(r);
                        s.replaceState(a, "", d),
                        o && u && u({
                            action: l,
                            location: w.location,
                            delta: 0
                        })
                    },
                    go: e => s.go(e)
                };
                return w
            }(function(e, t) {
                let {pathname: n="/", search: r="", hash: a=""} = b(e.location.hash.substr(1));
                return n.startsWith("/") || n.startsWith(".") || (n = "/" + n),
                g("", {
                    pathname: n,
                    search: r,
                    hash: a
                }, t.state && t.state.usr || null, t.state && t.state.key || "default")
            }, function(e, t) {
                let n = e.document.querySelector("base")
                  , r = "";
                if (n && n.getAttribute("href")) {
                    let t = e.location.href
                      , n = t.indexOf("#");
                    r = -1 === n ? t : t.slice(0, n)
                }
                return r + "#" + ("string" == typeof t ? t : y(t))
            }, function(e, t) {
                h("/" === e.pathname.charAt(0), "relative pathnames are not supported in hash history.push(" + JSON.stringify(t) + ")")
            }, e)
        }({
            window: a,
            v5Compat: !0
        }));
        let l = s.current
          , [u,c] = o.useState({
            action: l.action,
            location: l.location
        })
          , {v7_startTransition: v} = r || {}
          , w = o.useCallback(e => {
            v && me ? me( () => c(e)) : c(e)
        }
        , [c, v]);
        return o.useLayoutEffect( () => l.listen(w), [l, w]),
        o.useEffect( () => {
            return null == (e = r) || e.v7_startTransition,
            void 0 === (null == e ? void 0 : e.v7_relativeSplatPath) && (!t || t.v7_relativeSplatPath),
            void (t && (t.v7_fetcherPersist,
            t.v7_normalizeFormMethod,
            t.v7_partialHydration,
            t.v7_skipActionErrorRevalidation));
            var e, t
        }
        , [r]),
        o.createElement(ue, {
            basename: t,
            children: n,
            location: u.location,
            navigationType: u.action,
            navigator: l,
            future: r
        })
    }
    var he, pe;
    c.flushSync,
    s.useId,
    "undefined" != typeof window && void 0 !== window.document && window.document.createElement,
    function(e) {
        e.UseScrollRestoration = "useScrollRestoration",
        e.UseSubmit = "useSubmit",
        e.UseSubmitFetcher = "useSubmitFetcher",
        e.UseFetcher = "useFetcher",
        e.useViewTransitionState = "useViewTransitionState"
    }(he || (he = {})),
    function(e) {
        e.UseFetcher = "useFetcher",
        e.UseFetchers = "useFetchers",
        e.UseScrollRestoration = "useScrollRestoration"
    }(pe || (pe = {}));
    const ge = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"]
      , ye = ( () => new Set(ge))()
      , be = e => 180 * e / Math.PI
      , ve = e => {
        const t = be(Math.atan2(e[1], e[0]));
        return xe(t)
    }
      , we = {
        x: 4,
        y: 5,
        translateX: 4,
        translateY: 5,
        scaleX: 0,
        scaleY: 3,
        scale: e => (Math.abs(e[0]) + Math.abs(e[3])) / 2,
        rotate: ve,
        rotateZ: ve,
        skewX: e => be(Math.atan(e[1])),
        skewY: e => be(Math.atan(e[2])),
        skew: e => (Math.abs(e[1]) + Math.abs(e[2])) / 2
    }
      , xe = e => ((e %= 360) < 0 && (e += 360),
    e)
      , _e = e => Math.sqrt(e[0] * e[0] + e[1] * e[1])
      , Ne = e => Math.sqrt(e[4] * e[4] + e[5] * e[5])
      , ke = {
        x: 12,
        y: 13,
        z: 14,
        translateX: 12,
        translateY: 13,
        translateZ: 14,
        scaleX: _e,
        scaleY: Ne,
        scale: e => (_e(e) + Ne(e)) / 2,
        rotateX: e => xe(be(Math.atan2(e[6], e[5]))),
        rotateY: e => xe(be(Math.atan2(-e[2], e[0]))),
        rotateZ: ve,
        rotate: ve,
        skewX: e => be(Math.atan(e[4])),
        skewY: e => be(Math.atan(e[1])),
        skew: e => (Math.abs(e[1]) + Math.abs(e[4])) / 2
    };
    function Se(e) {
        return e.includes("scale") ? 1 : 0
    }
    function Ee(e, t) {
        if (!e || "none" === e)
            return Se(t);
        const n = e.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
        let r, a;
        if (n)
            r = ke,
            a = n;
        else {
            const t = e.match(/^matrix\(([-\d.e\s,]+)\)$/u);
            r = we,
            a = t
        }
        if (!a)
            return Se(t);
        const i = r[t]
          , o = a[1].split(",").map(Pe);
        return "function" == typeof i ? i(o) : o[i]
    }
    function Pe(e) {
        return parseFloat(e.trim())
    }
    const Ce = e => t => "string" == typeof t && t.startsWith(e)
      , Te = Ce("--")
      , Me = Ce("var(--")
      , Ae = e => !!Me(e) && Re.test(e.split("/*")[0].trim())
      , Re = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
    function De({top: e, left: t, right: n, bottom: r}) {
        return {
            x: {
                min: t,
                max: n
            },
            y: {
                min: e,
                max: r
            }
        }
    }
    const Le = (e, t, n) => e + (t - e) * n;
    function Oe(e) {
        return void 0 === e || 1 === e
    }
    function je({scale: e, scaleX: t, scaleY: n}) {
        return !Oe(e) || !Oe(t) || !Oe(n)
    }
    function ze(e) {
        return je(e) || Ve(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY
    }
    function Ve(e) {
        return Fe(e.x) || Fe(e.y)
    }
    function Fe(e) {
        return e && "0%" !== e
    }
    function Ie(e, t, n) {
        return n + t * (e - n)
    }
    function Ue(e, t, n, r, a) {
        return void 0 !== a && (e = Ie(e, a, r)),
        Ie(e, n, r) + t
    }
    function Be(e, t=0, n=1, r, a) {
        e.min = Ue(e.min, t, n, r, a),
        e.max = Ue(e.max, t, n, r, a)
    }
    function $e(e, {x: t, y: n}) {
        Be(e.x, t.translate, t.scale, t.originPoint),
        Be(e.y, n.translate, n.scale, n.originPoint)
    }
    const We = .999999999999
      , He = 1.0000000000001;
    function Ye(e, t) {
        e.min = e.min + t,
        e.max = e.max + t
    }
    function Ke(e, t, n, r, a=.5) {
        Be(e, t, n, Le(e.min, e.max, a), r)
    }
    function Qe(e, t) {
        Ke(e.x, t.x, t.scaleX, t.scale, t.originX),
        Ke(e.y, t.y, t.scaleY, t.scale, t.originY)
    }
    function qe(e, t) {
        return De(function(e, t) {
            if (!t)
                return e;
            const n = t({
                x: e.left,
                y: e.top
            })
              , r = t({
                x: e.right,
                y: e.bottom
            });
            return {
                top: n.y,
                left: n.x,
                bottom: r.y,
                right: r.x
            }
        }(e.getBoundingClientRect(), t))
    }
    const Xe = new Set(["width", "height", "top", "left", "right", "bottom", ...ge])
      , Ge = (e, t, n) => n > t ? t : n < e ? e : n
      , Ze = {
        test: e => "number" == typeof e,
        parse: parseFloat,
        transform: e => e
    }
      , Je = {
        ...Ze,
        transform: e => Ge(0, 1, e)
    }
      , et = {
        ...Ze,
        default: 1
    }
      , tt = e => ({
        test: t => "string" == typeof t && t.endsWith(e) && 1 === t.split(" ").length,
        parse: parseFloat,
        transform: t => `${t}${e}`
    })
      , nt = tt("deg")
      , rt = tt("%")
      , at = tt("px")
      , it = tt("vh")
      , ot = tt("vw")
      , st = ( () => ({
        ...rt,
        parse: e => rt.parse(e) / 100,
        transform: e => rt.transform(100 * e)
    }))()
      , lt = e => t => t.test(e)
      , ut = [Ze, at, rt, nt, ot, it, {
        test: e => "auto" === e,
        parse: e => e
    }]
      , ct = e => ut.find(lt(e))
      , dt = e => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e)
      , mt = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
    function ft(e, t, n=1) {
        const [r,a] = function(e) {
            const t = mt.exec(e);
            if (!t)
                return [, ];
            const [,n,r,a] = t;
            return [`--${n ?? r}`, a]
        }(e);
        if (!r)
            return;
        const i = window.getComputedStyle(t).getPropertyValue(r);
        if (i) {
            const e = i.trim();
            return dt(e) ? parseFloat(e) : e
        }
        return Ae(a) ? ft(a, t, n + 1) : a
    }
    const ht = e => e === Ze || e === at
      , pt = new Set(["x", "y", "z"])
      , gt = ge.filter(e => !pt.has(e))
      , yt = {
        width: ({x: e}, {paddingLeft: t="0", paddingRight: n="0"}) => e.max - e.min - parseFloat(t) - parseFloat(n),
        height: ({y: e}, {paddingTop: t="0", paddingBottom: n="0"}) => e.max - e.min - parseFloat(t) - parseFloat(n),
        top: (e, {top: t}) => parseFloat(t),
        left: (e, {left: t}) => parseFloat(t),
        bottom: ({y: e}, {top: t}) => parseFloat(t) + (e.max - e.min),
        right: ({x: e}, {left: t}) => parseFloat(t) + (e.max - e.min),
        x: (e, {transform: t}) => Ee(t, "x"),
        y: (e, {transform: t}) => Ee(t, "y")
    };
    yt.translateX = yt.x,
    yt.translateY = yt.y;
    const bt = e => e
      , vt = {}
      , wt = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"]
      , xt = {
        value: null,
        addProjectionMetrics: null
    };
    function _t(e, t) {
        let n = !1
          , r = !0;
        const a = {
            delta: 0,
            timestamp: 0,
            isProcessing: !1
        }
          , i = () => n = !0
          , o = wt.reduce( (e, n) => (e[n] = function(e, t) {
            let n = new Set
              , r = new Set
              , a = !1
              , i = !1;
            const o = new WeakSet;
            let s = {
                delta: 0,
                timestamp: 0,
                isProcessing: !1
            }
              , l = 0;
            function u(t) {
                o.has(t) && (c.schedule(t),
                e()),
                l++,
                t(s)
            }
            const c = {
                schedule: (e, t=!1, i=!1) => {
                    const s = i && a ? n : r;
                    return t && o.add(e),
                    s.has(e) || s.add(e),
                    e
                }
                ,
                cancel: e => {
                    r.delete(e),
                    o.delete(e)
                }
                ,
                process: e => {
                    s = e,
                    a ? i = !0 : (a = !0,
                    [n,r] = [r, n],
                    n.forEach(u),
                    t && xt.value && xt.value.frameloop[t].push(l),
                    l = 0,
                    n.clear(),
                    a = !1,
                    i && (i = !1,
                    c.process(e)))
                }
            };
            return c
        }(i, t ? n : void 0),
        e), {})
          , {setup: s, read: l, resolveKeyframes: u, preUpdate: c, update: d, preRender: m, render: f, postRender: h} = o
          , p = () => {
            const i = vt.useManualTiming ? a.timestamp : performance.now();
            n = !1,
            vt.useManualTiming || (a.delta = r ? 1e3 / 60 : Math.max(Math.min(i - a.timestamp, 40), 1)),
            a.timestamp = i,
            a.isProcessing = !0,
            s.process(a),
            l.process(a),
            u.process(a),
            c.process(a),
            d.process(a),
            m.process(a),
            f.process(a),
            h.process(a),
            a.isProcessing = !1,
            n && t && (r = !1,
            e(p))
        }
        ;
        return {
            schedule: wt.reduce( (t, i) => {
                const s = o[i];
                return t[i] = (t, i=!1, o=!1) => (n || (n = !0,
                r = !0,
                a.isProcessing || e(p)),
                s.schedule(t, i, o)),
                t
            }
            , {}),
            cancel: e => {
                for (let t = 0; t < wt.length; t++)
                    o[wt[t]].cancel(e)
            }
            ,
            state: a,
            steps: o
        }
    }
    const {schedule: Nt, cancel: kt, state: St, steps: Et} = _t("undefined" != typeof requestAnimationFrame ? requestAnimationFrame : bt, !0)
      , Pt = new Set;
    let Ct = !1
      , Tt = !1
      , Mt = !1;
    function At() {
        if (Tt) {
            const e = Array.from(Pt).filter(e => e.needsMeasurement)
              , t = new Set(e.map(e => e.element))
              , n = new Map;
            t.forEach(e => {
                const t = function(e) {
                    const t = [];
                    return gt.forEach(n => {
                        const r = e.getValue(n);
                        void 0 !== r && (t.push([n, r.get()]),
                        r.set(n.startsWith("scale") ? 1 : 0))
                    }
                    ),
                    t
                }(e);
                t.length && (n.set(e, t),
                e.render())
            }
            ),
            e.forEach(e => e.measureInitialState()),
            t.forEach(e => {
                e.render();
                const t = n.get(e);
                t && t.forEach( ([t,n]) => {
                    e.getValue(t)?.set(n)
                }
                )
            }
            ),
            e.forEach(e => e.measureEndState()),
            e.forEach(e => {
                void 0 !== e.suspendedScrollY && window.scrollTo(0, e.suspendedScrollY)
            }
            )
        }
        Tt = !1,
        Ct = !1,
        Pt.forEach(e => e.complete(Mt)),
        Pt.clear()
    }
    function Rt() {
        Pt.forEach(e => {
            e.readKeyframes(),
            e.needsMeasurement && (Tt = !0)
        }
        )
    }
    class Dt {
        constructor(e, t, n, r, a, i=!1) {
            this.state = "pending",
            this.isAsync = !1,
            this.needsMeasurement = !1,
            this.unresolvedKeyframes = [...e],
            this.onComplete = t,
            this.name = n,
            this.motionValue = r,
            this.element = a,
            this.isAsync = i
        }
        scheduleResolve() {
            this.state = "scheduled",
            this.isAsync ? (Pt.add(this),
            Ct || (Ct = !0,
            Nt.read(Rt),
            Nt.resolveKeyframes(At))) : (this.readKeyframes(),
            this.complete())
        }
        readKeyframes() {
            const {unresolvedKeyframes: e, name: t, element: n, motionValue: r} = this;
            if (null === e[0]) {
                const a = r?.get()
                  , i = e[e.length - 1];
                if (void 0 !== a)
                    e[0] = a;
                else if (n && t) {
                    const r = n.readValue(t, i);
                    null != r && (e[0] = r)
                }
                void 0 === e[0] && (e[0] = i),
                r && void 0 === a && r.set(e[0])
            }
            !function(e) {
                for (let t = 1; t < e.length; t++)
                    e[t] ?? (e[t] = e[t - 1])
            }(e)
        }
        setFinalKeyframe() {}
        measureInitialState() {}
        renderEndStyles() {}
        measureEndState() {}
        complete(e=!1) {
            this.state = "complete",
            this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e),
            Pt.delete(this)
        }
        cancel() {
            "scheduled" === this.state && (Pt.delete(this),
            this.state = "pending")
        }
        resume() {
            "pending" === this.state && this.scheduleResolve()
        }
    }
    const Lt = e => /^0[^.\s]+$/u.test(e);
    function Ot(e) {
        return "number" == typeof e ? 0 === e : null === e || "none" === e || "0" === e || Lt(e)
    }
    const jt = e => Math.round(1e5 * e) / 1e5
      , zt = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu
      , Vt = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu
      , Ft = (e, t) => n => Boolean("string" == typeof n && Vt.test(n) && n.startsWith(e) || t && !function(e) {
        return null == e
    }(n) && Object.prototype.hasOwnProperty.call(n, t))
      , It = (e, t, n) => r => {
        if ("string" != typeof r)
            return r;
        const [a,i,o,s] = r.match(zt);
        return {
            [e]: parseFloat(a),
            [t]: parseFloat(i),
            [n]: parseFloat(o),
            alpha: void 0 !== s ? parseFloat(s) : 1
        }
    }
      , Ut = {
        ...Ze,
        transform: e => Math.round((e => Ge(0, 255, e))(e))
    }
      , Bt = {
        test: Ft("rgb", "red"),
        parse: It("red", "green", "blue"),
        transform: ({red: e, green: t, blue: n, alpha: r=1}) => "rgba(" + Ut.transform(e) + ", " + Ut.transform(t) + ", " + Ut.transform(n) + ", " + jt(Je.transform(r)) + ")"
    }
      , $t = {
        test: Ft("#"),
        parse: function(e) {
            let t = ""
              , n = ""
              , r = ""
              , a = "";
            return e.length > 5 ? (t = e.substring(1, 3),
            n = e.substring(3, 5),
            r = e.substring(5, 7),
            a = e.substring(7, 9)) : (t = e.substring(1, 2),
            n = e.substring(2, 3),
            r = e.substring(3, 4),
            a = e.substring(4, 5),
            t += t,
            n += n,
            r += r,
            a += a),
            {
                red: parseInt(t, 16),
                green: parseInt(n, 16),
                blue: parseInt(r, 16),
                alpha: a ? parseInt(a, 16) / 255 : 1
            }
        },
        transform: Bt.transform
    }
      , Wt = {
        test: Ft("hsl", "hue"),
        parse: It("hue", "saturation", "lightness"),
        transform: ({hue: e, saturation: t, lightness: n, alpha: r=1}) => "hsla(" + Math.round(e) + ", " + rt.transform(jt(t)) + ", " + rt.transform(jt(n)) + ", " + jt(Je.transform(r)) + ")"
    }
      , Ht = {
        test: e => Bt.test(e) || $t.test(e) || Wt.test(e),
        parse: e => Bt.test(e) ? Bt.parse(e) : Wt.test(e) ? Wt.parse(e) : $t.parse(e),
        transform: e => "string" == typeof e ? e : e.hasOwnProperty("red") ? Bt.transform(e) : Wt.transform(e),
        getAnimatableNone: e => {
            const t = Ht.parse(e);
            return t.alpha = 0,
            Ht.transform(t)
        }
    }
      , Yt = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu
      , Kt = "number"
      , Qt = "color"
      , qt = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
    function Xt(e) {
        const t = e.toString()
          , n = []
          , r = {
            color: [],
            number: [],
            var: []
        }
          , a = [];
        let i = 0;
        const o = t.replace(qt, e => (Ht.test(e) ? (r.color.push(i),
        a.push(Qt),
        n.push(Ht.parse(e))) : e.startsWith("var(") ? (r.var.push(i),
        a.push("var"),
        n.push(e)) : (r.number.push(i),
        a.push(Kt),
        n.push(parseFloat(e))),
        ++i,
        "${}")).split("${}");
        return {
            values: n,
            split: o,
            indexes: r,
            types: a
        }
    }
    function Gt(e) {
        return Xt(e).values
    }
    function Zt(e) {
        const {split: t, types: n} = Xt(e)
          , r = t.length;
        return e => {
            let a = "";
            for (let i = 0; i < r; i++)
                if (a += t[i],
                void 0 !== e[i]) {
                    const t = n[i];
                    a += t === Kt ? jt(e[i]) : t === Qt ? Ht.transform(e[i]) : e[i]
                }
            return a
        }
    }
    const Jt = e => "number" == typeof e ? 0 : Ht.test(e) ? Ht.getAnimatableNone(e) : e
      , en = {
        test: function(e) {
            return isNaN(e) && "string" == typeof e && (e.match(zt)?.length || 0) + (e.match(Yt)?.length || 0) > 0
        },
        parse: Gt,
        createTransformer: Zt,
        getAnimatableNone: function(e) {
            const t = Gt(e);
            return Zt(e)(t.map(Jt))
        }
    }
      , tn = new Set(["brightness", "contrast", "saturate", "opacity"]);
    function nn(e) {
        const [t,n] = e.slice(0, -1).split("(");
        if ("drop-shadow" === t)
            return e;
        const [r] = n.match(zt) || [];
        if (!r)
            return e;
        const a = n.replace(r, "");
        let i = tn.has(t) ? 1 : 0;
        return r !== n && (i *= 100),
        t + "(" + i + a + ")"
    }
    const rn = /\b([a-z-]*)\(.*?\)/gu
      , an = {
        ...en,
        getAnimatableNone: e => {
            const t = e.match(rn);
            return t ? t.map(nn).join(" ") : e
        }
    }
      , on = {
        ...Ze,
        transform: Math.round
    }
      , sn = {
        borderWidth: at,
        borderTopWidth: at,
        borderRightWidth: at,
        borderBottomWidth: at,
        borderLeftWidth: at,
        borderRadius: at,
        radius: at,
        borderTopLeftRadius: at,
        borderTopRightRadius: at,
        borderBottomRightRadius: at,
        borderBottomLeftRadius: at,
        width: at,
        maxWidth: at,
        height: at,
        maxHeight: at,
        top: at,
        right: at,
        bottom: at,
        left: at,
        padding: at,
        paddingTop: at,
        paddingRight: at,
        paddingBottom: at,
        paddingLeft: at,
        margin: at,
        marginTop: at,
        marginRight: at,
        marginBottom: at,
        marginLeft: at,
        backgroundPositionX: at,
        backgroundPositionY: at,
        rotate: nt,
        rotateX: nt,
        rotateY: nt,
        rotateZ: nt,
        scale: et,
        scaleX: et,
        scaleY: et,
        scaleZ: et,
        skew: nt,
        skewX: nt,
        skewY: nt,
        distance: at,
        translateX: at,
        translateY: at,
        translateZ: at,
        x: at,
        y: at,
        z: at,
        perspective: at,
        transformPerspective: at,
        opacity: Je,
        originX: st,
        originY: st,
        originZ: at,
        zIndex: on,
        fillOpacity: Je,
        strokeOpacity: Je,
        numOctaves: on
    }
      , ln = {
        ...sn,
        color: Ht,
        backgroundColor: Ht,
        outlineColor: Ht,
        fill: Ht,
        stroke: Ht,
        borderColor: Ht,
        borderTopColor: Ht,
        borderRightColor: Ht,
        borderBottomColor: Ht,
        borderLeftColor: Ht,
        filter: an,
        WebkitFilter: an
    }
      , un = e => ln[e];
    function cn(e, t) {
        let n = un(e);
        return n !== an && (n = en),
        n.getAnimatableNone ? n.getAnimatableNone(t) : void 0
    }
    const dn = new Set(["auto", "none", "0"]);
    class mn extends Dt {
        constructor(e, t, n, r, a) {
            super(e, t, n, r, a, !0)
        }
        readKeyframes() {
            const {unresolvedKeyframes: e, element: t, name: n} = this;
            if (!t || !t.current)
                return;
            super.readKeyframes();
            for (let n = 0; n < e.length; n++) {
                let r = e[n];
                if ("string" == typeof r && (r = r.trim(),
                Ae(r))) {
                    const a = ft(r, t.current);
                    void 0 !== a && (e[n] = a),
                    n === e.length - 1 && (this.finalKeyframe = r)
                }
            }
            if (this.resolveNoneKeyframes(),
            !Xe.has(n) || 2 !== e.length)
                return;
            const [r,a] = e
              , i = ct(r)
              , o = ct(a);
            if (i !== o)
                if (ht(i) && ht(o))
                    for (let t = 0; t < e.length; t++) {
                        const n = e[t];
                        "string" == typeof n && (e[t] = parseFloat(n))
                    }
                else
                    yt[n] && (this.needsMeasurement = !0)
        }
        resolveNoneKeyframes() {
            const {unresolvedKeyframes: e, name: t} = this
              , n = [];
            for (let t = 0; t < e.length; t++)
                (null === e[t] || Ot(e[t])) && n.push(t);
            n.length && function(e, t, n) {
                let r, a = 0;
                for (; a < e.length && !r; ) {
                    const t = e[a];
                    "string" == typeof t && !dn.has(t) && Xt(t).values.length && (r = e[a]),
                    a++
                }
                if (r && n)
                    for (const a of t)
                        e[a] = cn(n, r)
            }(e, n, t)
        }
        measureInitialState() {
            const {element: e, unresolvedKeyframes: t, name: n} = this;
            if (!e || !e.current)
                return;
            "height" === n && (this.suspendedScrollY = window.pageYOffset),
            this.measuredOrigin = yt[n](e.measureViewportBox(), window.getComputedStyle(e.current)),
            t[0] = this.measuredOrigin;
            const r = t[t.length - 1];
            void 0 !== r && e.getValue(n, r).jump(r, !1)
        }
        measureEndState() {
            const {element: e, name: t, unresolvedKeyframes: n} = this;
            if (!e || !e.current)
                return;
            const r = e.getValue(t);
            r && r.jump(this.measuredOrigin, !1);
            const a = n.length - 1
              , i = n[a];
            n[a] = yt[t](e.measureViewportBox(), window.getComputedStyle(e.current)),
            null !== i && void 0 === this.finalKeyframe && (this.finalKeyframe = i),
            this.removedTransforms?.length && this.removedTransforms.forEach( ([t,n]) => {
                e.getValue(t).set(n)
            }
            ),
            this.resolveNoneKeyframes()
        }
    }
    const fn = e => Boolean(e && e.getVelocity);
    let hn;
    function pn() {
        hn = void 0
    }
    const gn = {
        now: () => (void 0 === hn && gn.set(St.isProcessing || vt.useManualTiming ? St.timestamp : performance.now()),
        hn),
        set: e => {
            hn = e,
            queueMicrotask(pn)
        }
    };
    function yn(e, t) {
        -1 === e.indexOf(t) && e.push(t)
    }
    function bn(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1)
    }
    class vn {
        constructor() {
            this.subscriptions = []
        }
        add(e) {
            return yn(this.subscriptions, e),
            () => bn(this.subscriptions, e)
        }
        notify(e, t, n) {
            const r = this.subscriptions.length;
            if (r)
                if (1 === r)
                    this.subscriptions[0](e, t, n);
                else
                    for (let a = 0; a < r; a++) {
                        const r = this.subscriptions[a];
                        r && r(e, t, n)
                    }
        }
        getSize() {
            return this.subscriptions.length
        }
        clear() {
            this.subscriptions.length = 0
        }
    }
    function wn(e, t) {
        return t ? e * (1e3 / t) : 0
    }
    const xn = {
        current: void 0
    };
    class _n {
        constructor(e, t={}) {
            this.canTrackVelocity = null,
            this.events = {},
            this.updateAndNotify = e => {
                const t = gn.now();
                if (this.updatedAt !== t && this.setPrevFrameValue(),
                this.prev = this.current,
                this.setCurrent(e),
                this.current !== this.prev && (this.events.change?.notify(this.current),
                this.dependents))
                    for (const e of this.dependents)
                        e.dirty()
            }
            ,
            this.hasAnimated = !1,
            this.setCurrent(e),
            this.owner = t.owner
        }
        setCurrent(e) {
            var t;
            this.current = e,
            this.updatedAt = gn.now(),
            null === this.canTrackVelocity && void 0 !== e && (this.canTrackVelocity = (t = this.current,
            !isNaN(parseFloat(t))))
        }
        setPrevFrameValue(e=this.current) {
            this.prevFrameValue = e,
            this.prevUpdatedAt = this.updatedAt
        }
        onChange(e) {
            return this.on("change", e)
        }
        on(e, t) {
            this.events[e] || (this.events[e] = new vn);
            const n = this.events[e].add(t);
            return "change" === e ? () => {
                n(),
                Nt.read( () => {
                    this.events.change.getSize() || this.stop()
                }
                )
            }
            : n
        }
        clearListeners() {
            for (const e in this.events)
                this.events[e].clear()
        }
        attach(e, t) {
            this.passiveEffect = e,
            this.stopPassiveEffect = t
        }
        set(e) {
            this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e)
        }
        setWithVelocity(e, t, n) {
            this.set(t),
            this.prev = void 0,
            this.prevFrameValue = e,
            this.prevUpdatedAt = this.updatedAt - n
        }
        jump(e, t=!0) {
            this.updateAndNotify(e),
            this.prev = e,
            this.prevUpdatedAt = this.prevFrameValue = void 0,
            t && this.stop(),
            this.stopPassiveEffect && this.stopPassiveEffect()
        }
        dirty() {
            this.events.change?.notify(this.current)
        }
        addDependent(e) {
            this.dependents || (this.dependents = new Set),
            this.dependents.add(e)
        }
        removeDependent(e) {
            this.dependents && this.dependents.delete(e)
        }
        get() {
            return xn.current && xn.current.push(this),
            this.current
        }
        getPrevious() {
            return this.prev
        }
        getVelocity() {
            const e = gn.now();
            if (!this.canTrackVelocity || void 0 === this.prevFrameValue || e - this.updatedAt > 30)
                return 0;
            const t = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
            return wn(parseFloat(this.current) - parseFloat(this.prevFrameValue), t)
        }
        start(e) {
            return this.stop(),
            new Promise(t => {
                this.hasAnimated = !0,
                this.animation = e(t),
                this.events.animationStart && this.events.animationStart.notify()
            }
            ).then( () => {
                this.events.animationComplete && this.events.animationComplete.notify(),
                this.clearAnimation()
            }
            )
        }
        stop() {
            this.animation && (this.animation.stop(),
            this.events.animationCancel && this.events.animationCancel.notify()),
            this.clearAnimation()
        }
        isAnimating() {
            return !!this.animation
        }
        clearAnimation() {
            delete this.animation
        }
        destroy() {
            this.dependents?.clear(),
            this.events.destroy?.notify(),
            this.clearListeners(),
            this.stop(),
            this.stopPassiveEffect && this.stopPassiveEffect()
        }
    }
    function Nn(e, t) {
        return new _n(e,t)
    }
    const kn = [...ut, Ht, en]
      , {schedule: Sn, cancel: En} = _t(queueMicrotask, !1)
      , Pn = {
        animation: ["animate", "variants", "whileHover", "whileTap", "exit", "whileInView", "whileFocus", "whileDrag"],
        exit: ["exit"],
        drag: ["drag", "dragControls"],
        focus: ["whileFocus"],
        hover: ["whileHover", "onHoverStart", "onHoverEnd"],
        tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
        pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
        inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
        layout: ["layout", "layoutId"]
    }
      , Cn = {};
    for (const e in Pn)
        Cn[e] = {
            isEnabled: t => Pn[e].some(e => !!t[e])
        };
    const Tn = () => ({
        x: {
            min: 0,
            max: 0
        },
        y: {
            min: 0,
            max: 0
        }
    })
      , Mn = "undefined" != typeof window
      , An = {
        current: null
    }
      , Rn = {
        current: !1
    }
      , Dn = new WeakMap;
    function Ln(e) {
        return null !== e && "object" == typeof e && "function" == typeof e.start
    }
    function On(e) {
        return "string" == typeof e || Array.isArray(e)
    }
    const jn = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"]
      , zn = ["initial", ...jn];
    function Vn(e) {
        return Ln(e.animate) || zn.some(t => On(e[t]))
    }
    function Fn(e) {
        return Boolean(Vn(e) || e.variants)
    }
    function In(e) {
        const t = [{}, {}];
        return e?.values.forEach( (e, n) => {
            t[0][n] = e.get(),
            t[1][n] = e.getVelocity()
        }
        ),
        t
    }
    function Un(e, t, n, r) {
        if ("function" == typeof t) {
            const [a,i] = In(r);
            t = t(void 0 !== n ? n : e.custom, a, i)
        }
        if ("string" == typeof t && (t = e.variants && e.variants[t]),
        "function" == typeof t) {
            const [a,i] = In(r);
            t = t(void 0 !== n ? n : e.custom, a, i)
        }
        return t
    }
    const Bn = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"];
    class $n {
        scrapeMotionValuesFromProps(e, t, n) {
            return {}
        }
        constructor({parent: e, props: t, presenceContext: n, reducedMotionConfig: r, blockInitialAnimation: a, visualState: i}, o={}) {
            this.current = null,
            this.children = new Set,
            this.isVariantNode = !1,
            this.isControllingVariants = !1,
            this.shouldReduceMotion = null,
            this.values = new Map,
            this.KeyframeResolver = Dt,
            this.features = {},
            this.valueSubscriptions = new Map,
            this.prevMotionValues = {},
            this.events = {},
            this.propEventSubscriptions = {},
            this.notifyUpdate = () => this.notify("Update", this.latestValues),
            this.render = () => {
                this.current && (this.triggerBuild(),
                this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
            }
            ,
            this.renderScheduledAt = 0,
            this.scheduleRender = () => {
                const e = gn.now();
                this.renderScheduledAt < e && (this.renderScheduledAt = e,
                Nt.render(this.render, !1, !0))
            }
            ;
            const {latestValues: s, renderState: l} = i;
            this.latestValues = s,
            this.baseTarget = {
                ...s
            },
            this.initialValues = t.initial ? {
                ...s
            } : {},
            this.renderState = l,
            this.parent = e,
            this.props = t,
            this.presenceContext = n,
            this.depth = e ? e.depth + 1 : 0,
            this.reducedMotionConfig = r,
            this.options = o,
            this.blockInitialAnimation = Boolean(a),
            this.isControllingVariants = Vn(t),
            this.isVariantNode = Fn(t),
            this.isVariantNode && (this.variantChildren = new Set),
            this.manuallyAnimateOnMount = Boolean(e && e.current);
            const {willChange: u, ...c} = this.scrapeMotionValuesFromProps(t, {}, this);
            for (const e in c) {
                const t = c[e];
                void 0 !== s[e] && fn(t) && t.set(s[e])
            }
        }
        mount(e) {
            this.current = e,
            Dn.set(e, this),
            this.projection && !this.projection.instance && this.projection.mount(e),
            this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)),
            this.values.forEach( (e, t) => this.bindToMotionValue(t, e)),
            Rn.current || function() {
                if (Rn.current = !0,
                Mn)
                    if (window.matchMedia) {
                        const e = window.matchMedia("(prefers-reduced-motion)")
                          , t = () => An.current = e.matches;
                        e.addEventListener("change", t),
                        t()
                    } else
                        An.current = !1
            }(),
            this.shouldReduceMotion = "never" !== this.reducedMotionConfig && ("always" === this.reducedMotionConfig || An.current),
            this.parent?.addChild(this),
            this.update(this.props, this.presenceContext)
        }
        unmount() {
            this.projection && this.projection.unmount(),
            kt(this.notifyUpdate),
            kt(this.render),
            this.valueSubscriptions.forEach(e => e()),
            this.valueSubscriptions.clear(),
            this.removeFromVariantTree && this.removeFromVariantTree(),
            this.parent?.removeChild(this);
            for (const e in this.events)
                this.events[e].clear();
            for (const e in this.features) {
                const t = this.features[e];
                t && (t.unmount(),
                t.isMounted = !1)
            }
            this.current = null
        }
        addChild(e) {
            this.children.add(e),
            this.enteringChildren ?? (this.enteringChildren = new Set),
            this.enteringChildren.add(e)
        }
        removeChild(e) {
            this.children.delete(e),
            this.enteringChildren && this.enteringChildren.delete(e)
        }
        bindToMotionValue(e, t) {
            this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
            const n = ye.has(e);
            n && this.onBindTransform && this.onBindTransform();
            const r = t.on("change", t => {
                this.latestValues[e] = t,
                this.props.onUpdate && Nt.preRender(this.notifyUpdate),
                n && this.projection && (this.projection.isTransformDirty = !0),
                this.scheduleRender()
            }
            );
            let a;
            window.MotionCheckAppearSync && (a = window.MotionCheckAppearSync(this, e, t)),
            this.valueSubscriptions.set(e, () => {
                r(),
                a && a(),
                t.owner && t.stop()
            }
            )
        }
        sortNodePosition(e) {
            return this.current && this.sortInstanceNodePosition && this.type === e.type ? this.sortInstanceNodePosition(this.current, e.current) : 0
        }
        updateFeatures() {
            let e = "animation";
            for (e in Cn) {
                const t = Cn[e];
                if (!t)
                    continue;
                const {isEnabled: n, Feature: r} = t;
                if (!this.features[e] && r && n(this.props) && (this.features[e] = new r(this)),
                this.features[e]) {
                    const t = this.features[e];
                    t.isMounted ? t.update() : (t.mount(),
                    t.isMounted = !0)
                }
            }
        }
        triggerBuild() {
            this.build(this.renderState, this.latestValues, this.props)
        }
        measureViewportBox() {
            return this.current ? this.measureInstanceViewportBox(this.current, this.props) : {
                x: {
                    min: 0,
                    max: 0
                },
                y: {
                    min: 0,
                    max: 0
                }
            }
        }
        getStaticValue(e) {
            return this.latestValues[e]
        }
        setStaticValue(e, t) {
            this.latestValues[e] = t
        }
        update(e, t) {
            (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
            this.prevProps = this.props,
            this.props = e,
            this.prevPresenceContext = this.presenceContext,
            this.presenceContext = t;
            for (let t = 0; t < Bn.length; t++) {
                const n = Bn[t];
                this.propEventSubscriptions[n] && (this.propEventSubscriptions[n](),
                delete this.propEventSubscriptions[n]);
                const r = e["on" + n];
                r && (this.propEventSubscriptions[n] = this.on(n, r))
            }
            this.prevMotionValues = function(e, t, n) {
                for (const r in t) {
                    const a = t[r]
                      , i = n[r];
                    if (fn(a))
                        e.addValue(r, a);
                    else if (fn(i))
                        e.addValue(r, Nn(a, {
                            owner: e
                        }));
                    else if (i !== a)
                        if (e.hasValue(r)) {
                            const t = e.getValue(r);
                            !0 === t.liveStyle ? t.jump(a) : t.hasAnimated || t.set(a)
                        } else {
                            const t = e.getStaticValue(r);
                            e.addValue(r, Nn(void 0 !== t ? t : a, {
                                owner: e
                            }))
                        }
                }
                for (const r in n)
                    void 0 === t[r] && e.removeValue(r);
                return t
            }(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues),
            this.handleChildMotionValue && this.handleChildMotionValue()
        }
        getProps() {
            return this.props
        }
        getVariant(e) {
            return this.props.variants ? this.props.variants[e] : void 0
        }
        getDefaultTransition() {
            return this.props.transition
        }
        getTransformPagePoint() {
            return this.props.transformPagePoint
        }
        getClosestVariantNode() {
            return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0
        }
        addVariantChild(e) {
            const t = this.getClosestVariantNode();
            if (t)
                return t.variantChildren && t.variantChildren.add(e),
                () => t.variantChildren.delete(e)
        }
        addValue(e, t) {
            const n = this.values.get(e);
            t !== n && (n && this.removeValue(e),
            this.bindToMotionValue(e, t),
            this.values.set(e, t),
            this.latestValues[e] = t.get())
        }
        removeValue(e) {
            this.values.delete(e);
            const t = this.valueSubscriptions.get(e);
            t && (t(),
            this.valueSubscriptions.delete(e)),
            delete this.latestValues[e],
            this.removeValueFromRenderState(e, this.renderState)
        }
        hasValue(e) {
            return this.values.has(e)
        }
        getValue(e, t) {
            if (this.props.values && this.props.values[e])
                return this.props.values[e];
            let n = this.values.get(e);
            return void 0 === n && void 0 !== t && (n = Nn(null === t ? void 0 : t, {
                owner: this
            }),
            this.addValue(e, n)),
            n
        }
        readValue(e, t) {
            let n = void 0 === this.latestValues[e] && this.current ? this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options) : this.latestValues[e];
            var r;
            return null != n && ("string" == typeof n && (dt(n) || Lt(n)) ? n = parseFloat(n) : (r = n,
            !kn.find(lt(r)) && en.test(t) && (n = cn(e, t))),
            this.setBaseTarget(e, fn(n) ? n.get() : n)),
            fn(n) ? n.get() : n
        }
        setBaseTarget(e, t) {
            this.baseTarget[e] = t
        }
        getBaseTarget(e) {
            const {initial: t} = this.props;
            let n;
            if ("string" == typeof t || "object" == typeof t) {
                const r = Un(this.props, t, this.presenceContext?.custom);
                r && (n = r[e])
            }
            if (t && void 0 !== n)
                return n;
            const r = this.getBaseTargetFromProps(this.props, e);
            return void 0 === r || fn(r) ? void 0 !== this.initialValues[e] && void 0 === n ? void 0 : this.baseTarget[e] : r
        }
        on(e, t) {
            return this.events[e] || (this.events[e] = new vn),
            this.events[e].add(t)
        }
        notify(e, ...t) {
            this.events[e] && this.events[e].notify(...t)
        }
        scheduleRenderMicrotask() {
            Sn.render(this.render)
        }
    }
    class Wn extends $n {
        constructor() {
            super(...arguments),
            this.KeyframeResolver = mn
        }
        sortInstanceNodePosition(e, t) {
            return 2 & e.compareDocumentPosition(t) ? 1 : -1
        }
        getBaseTargetFromProps(e, t) {
            return e.style ? e.style[t] : void 0
        }
        removeValueFromRenderState(e, {vars: t, style: n}) {
            delete t[e],
            delete n[e]
        }
        handleChildMotionValue() {
            this.childSubscription && (this.childSubscription(),
            delete this.childSubscription);
            const {children: e} = this.props;
            fn(e) && (this.childSubscription = e.on("change", e => {
                this.current && (this.current.textContent = `${e}`)
            }
            ))
        }
    }
    const Hn = (e, t) => t && "number" == typeof e ? t.transform(e) : e
      , Yn = {
        x: "translateX",
        y: "translateY",
        z: "translateZ",
        transformPerspective: "perspective"
    }
      , Kn = ge.length;
    function Qn(e, t, n) {
        const {style: r, vars: a, transformOrigin: i} = e;
        let o = !1
          , s = !1;
        for (const e in t) {
            const n = t[e];
            if (ye.has(e))
                o = !0;
            else if (Te(e))
                a[e] = n;
            else {
                const t = Hn(n, sn[e]);
                e.startsWith("origin") ? (s = !0,
                i[e] = t) : r[e] = t
            }
        }
        if (t.transform || (o || n ? r.transform = function(e, t, n) {
            let r = ""
              , a = !0;
            for (let i = 0; i < Kn; i++) {
                const o = ge[i]
                  , s = e[o];
                if (void 0 === s)
                    continue;
                let l = !0;
                if (l = "number" == typeof s ? s === (o.startsWith("scale") ? 1 : 0) : 0 === parseFloat(s),
                !l || n) {
                    const e = Hn(s, sn[o]);
                    l || (a = !1,
                    r += `${Yn[o] || o}(${e}) `),
                    n && (t[o] = e)
                }
            }
            return r = r.trim(),
            n ? r = n(t, a ? "" : r) : a && (r = "none"),
            r
        }(t, e.transform, n) : r.transform && (r.transform = "none")),
        s) {
            const {originX: e="50%", originY: t="50%", originZ: n=0} = i;
            r.transformOrigin = `${e} ${t} ${n}`
        }
    }
    function qn(e, {style: t, vars: n}, r, a) {
        const i = e.style;
        let o;
        for (o in t)
            i[o] = t[o];
        for (o in a?.applyProjectionStyles(i, r),
        n)
            i.setProperty(o, n[o])
    }
    const Xn = {};
    function Gn(e, {layout: t, layoutId: n}) {
        return ye.has(e) || e.startsWith("origin") || (t || void 0 !== n) && (!!Xn[e] || "opacity" === e)
    }
    function Zn(e, t, n) {
        const {style: r} = e
          , a = {};
        for (const i in r)
            (fn(r[i]) || t.style && fn(t.style[i]) || Gn(i, e) || void 0 !== n?.getValue(i)?.liveStyle) && (a[i] = r[i]);
        return a
    }
    class Jn extends Wn {
        constructor() {
            super(...arguments),
            this.type = "html",
            this.renderInstance = qn
        }
        readValueFromInstance(e, t) {
            if (ye.has(t))
                return this.projection?.isProjecting ? Se(t) : ( (e, t) => {
                    const {transform: n="none"} = getComputedStyle(e);
                    return Ee(n, t)
                }
                )(e, t);
            {
                const r = (n = e,
                window.getComputedStyle(n))
                  , a = (Te(t) ? r.getPropertyValue(t) : r[t]) || 0;
                return "string" == typeof a ? a.trim() : a
            }
            var n
        }
        measureInstanceViewportBox(e, {transformPagePoint: t}) {
            return qe(e, t)
        }
        build(e, t, n) {
            Qn(e, t, n.transformTemplate)
        }
        scrapeMotionValuesFromProps(e, t, n) {
            return Zn(e, t, n)
        }
    }
    const er = e => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase()
      , tr = {
        offset: "stroke-dashoffset",
        array: "stroke-dasharray"
    }
      , nr = {
        offset: "strokeDashoffset",
        array: "strokeDasharray"
    };
    function rr(e, {attrX: t, attrY: n, attrScale: r, pathLength: a, pathSpacing: i=1, pathOffset: o=0, ...s}, l, u, c) {
        if (Qn(e, s, u),
        l)
            return void (e.style.viewBox && (e.attrs.viewBox = e.style.viewBox));
        e.attrs = e.style,
        e.style = {};
        const {attrs: d, style: m} = e;
        d.transform && (m.transform = d.transform,
        delete d.transform),
        (m.transform || d.transformOrigin) && (m.transformOrigin = d.transformOrigin ?? "50% 50%",
        delete d.transformOrigin),
        m.transform && (m.transformBox = c?.transformBox ?? "fill-box",
        delete d.transformBox),
        void 0 !== t && (d.x = t),
        void 0 !== n && (d.y = n),
        void 0 !== r && (d.scale = r),
        void 0 !== a && function(e, t, n=1, r=0, a=!0) {
            e.pathLength = 1;
            const i = a ? tr : nr;
            e[i.offset] = at.transform(-r);
            const o = at.transform(t)
              , s = at.transform(n);
            e[i.array] = `${o} ${s}`
        }(d, a, i, o, !1)
    }
    const ar = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"])
      , ir = e => "string" == typeof e && "svg" === e.toLowerCase();
    function or(e, t, n) {
        const r = Zn(e, t, n);
        for (const n in e)
            (fn(e[n]) || fn(t[n])) && (r[-1 !== ge.indexOf(n) ? "attr" + n.charAt(0).toUpperCase() + n.substring(1) : n] = e[n]);
        return r
    }
    class sr extends Wn {
        constructor() {
            super(...arguments),
            this.type = "svg",
            this.isSVGTag = !1,
            this.measureInstanceViewportBox = Tn
        }
        getBaseTargetFromProps(e, t) {
            return e[t]
        }
        readValueFromInstance(e, t) {
            if (ye.has(t)) {
                const e = un(t);
                return e && e.default || 0
            }
            return t = ar.has(t) ? t : er(t),
            e.getAttribute(t)
        }
        scrapeMotionValuesFromProps(e, t, n) {
            return or(e, t, n)
        }
        build(e, t, n) {
            rr(e, t, this.isSVGTag, n.transformTemplate, n.style)
        }
        renderInstance(e, t, n, r) {
            !function(e, t, n, r) {
                qn(e, t, void 0, r);
                for (const n in t.attrs)
                    e.setAttribute(ar.has(n) ? n : er(n), t.attrs[n])
            }(e, t, 0, r)
        }
        mount(e) {
            this.isSVGTag = ir(e.tagName),
            super.mount(e)
        }
    }
    const lr = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];
    function ur(e) {
        return "string" == typeof e && !e.includes("-") && !!(lr.indexOf(e) > -1 || /[A-Z]/u.test(e))
    }
    const cr = (e, t) => ur(e) ? new sr(t) : new Jn(t,{
        allowProjection: e !== o.Fragment
    });
    var dr = a(552);
    const mr = (0,
    o.createContext)({})
      , fr = (0,
    o.createContext)({
        strict: !1
    })
      , hr = (0,
    o.createContext)({
        transformPagePoint: e => e,
        isStatic: !1,
        reducedMotion: "never"
    })
      , pr = (0,
    o.createContext)({});
    function gr(e) {
        return Array.isArray(e) ? e.join(" ") : e
    }
    function yr(e, t, n) {
        for (const r in t)
            fn(t[r]) || Gn(r, n) || (e[r] = t[r])
    }
    function br(e, t) {
        const n = {}
          , r = function(e, t) {
            const n = {};
            return yr(n, e.style || {}, e),
            Object.assign(n, function({transformTemplate: e}, t) {
                return (0,
                o.useMemo)( () => {
                    const n = {
                        style: {},
                        transform: {},
                        transformOrigin: {},
                        vars: {}
                    };
                    return Qn(n, t, e),
                    Object.assign({}, n.vars, n.style)
                }
                , [t])
            }(e, t)),
            n
        }(e, t);
        return e.drag && !1 !== e.dragListener && (n.draggable = !1,
        r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none",
        r.touchAction = !0 === e.drag ? "none" : "pan-" + ("x" === e.drag ? "y" : "x")),
        void 0 === e.tabIndex && (e.onTap || e.onTapStart || e.whileTap) && (n.tabIndex = 0),
        n.style = r,
        n
    }
    function vr(e, t, n, r) {
        const a = (0,
        o.useMemo)( () => {
            const n = {
                style: {},
                transform: {},
                transformOrigin: {},
                vars: {},
                attrs: {}
            };
            return rr(n, t, ir(r), e.transformTemplate, e.style),
            {
                ...n.attrs,
                style: {
                    ...n.style
                }
            }
        }
        , [t]);
        if (e.style) {
            const t = {};
            yr(t, e.style, e),
            a.style = {
                ...t,
                ...a.style
            }
        }
        return a
    }
    const wr = new Set(["animate", "exit", "variants", "initial", "style", "values", "variants", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "ignoreStrict", "viewport"]);
    function xr(e) {
        return e.startsWith("while") || e.startsWith("drag") && "draggable" !== e || e.startsWith("layout") || e.startsWith("onTap") || e.startsWith("onPan") || e.startsWith("onLayout") || wr.has(e)
    }
    let _r = e => !xr(e);
    try {
        "function" == typeof (Nr = require("@emotion/is-prop-valid").default) && (_r = e => e.startsWith("on") ? !xr(e) : Nr(e))
    } catch {}
    var Nr;
    function kr(e, t, n, {latestValues: r}, a, i=!1) {
        const s = (ur(e) ? vr : br)(t, r, a, e)
          , l = function(e, t, n) {
            const r = {};
            for (const a in e)
                "values" === a && "object" == typeof e.values || (_r(a) || !0 === n && xr(a) || !t && !xr(a) || e.draggable && a.startsWith("onDrag")) && (r[a] = e[a]);
            return r
        }(t, "string" == typeof e, i)
          , u = e !== o.Fragment ? {
            ...l,
            ...s,
            ref: n
        } : {}
          , {children: c} = t
          , d = (0,
        o.useMemo)( () => fn(c) ? c.get() : c, [c]);
        return (0,
        o.createElement)(e, {
            ...u,
            children: d
        })
    }
    const Sr = (0,
    o.createContext)(null);
    function Er(e) {
        return fn(e) ? e.get() : e
    }
    function Pr(e, t, n, r) {
        const a = {}
          , i = r(e, {});
        for (const e in i)
            a[e] = Er(i[e]);
        let {initial: o, animate: s} = e;
        const l = Vn(e)
          , u = Fn(e);
        t && u && !l && !1 !== e.inherit && (void 0 === o && (o = t.initial),
        void 0 === s && (s = t.animate));
        let c = !!n && !1 === n.initial;
        c = c || !1 === o;
        const d = c ? s : o;
        if (d && "boolean" != typeof d && !Ln(d)) {
            const t = Array.isArray(d) ? d : [d];
            for (let n = 0; n < t.length; n++) {
                const r = Un(e, t[n]);
                if (r) {
                    const {transitionEnd: e, transition: t, ...n} = r;
                    for (const e in n) {
                        let t = n[e];
                        Array.isArray(t) && (t = t[c ? t.length - 1 : 0]),
                        null !== t && (a[e] = t)
                    }
                    for (const t in e)
                        a[t] = e[t]
                }
            }
        }
        return a
    }
    const Cr = e => (t, n) => {
        const r = (0,
        o.useContext)(pr)
          , a = (0,
        o.useContext)(Sr)
          , i = () => function({scrapeMotionValuesFromProps: e, createRenderState: t}, n, r, a) {
            return {
                latestValues: Pr(n, r, a, e),
                renderState: t()
            }
        }(e, t, r, a);
        return n ? i() : function(e) {
            const t = (0,
            o.useRef)(null);
            return null === t.current && (t.current = e()),
            t.current
        }(i)
    }
      , Tr = Cr({
        scrapeMotionValuesFromProps: Zn,
        createRenderState: () => ({
            style: {},
            transform: {},
            transformOrigin: {},
            vars: {}
        })
    })
      , Mr = Cr({
        scrapeMotionValuesFromProps: or,
        createRenderState: () => ({
            style: {},
            transform: {},
            transformOrigin: {},
            vars: {},
            attrs: {}
        })
    })
      , Ar = Symbol.for("motionComponentSymbol");
    function Rr(e) {
        return e && "object" == typeof e && Object.prototype.hasOwnProperty.call(e, "current")
    }
    function Dr(e, t, n) {
        return (0,
        o.useCallback)(r => {
            r && e.onMount && e.onMount(r),
            t && (r ? t.mount(r) : t.unmount()),
            n && ("function" == typeof n ? n(r) : Rr(n) && (n.current = r))
        }
        , [t])
    }
    const Lr = "data-" + er("framerAppearId")
      , Or = (0,
    o.createContext)({})
      , jr = Mn ? o.useLayoutEffect : o.useEffect;
    function zr(e, t, n, r, a) {
        const {visualElement: i} = (0,
        o.useContext)(pr)
          , s = (0,
        o.useContext)(fr)
          , l = (0,
        o.useContext)(Sr)
          , u = (0,
        o.useContext)(hr).reducedMotion
          , c = (0,
        o.useRef)(null);
        r = r || s.renderer,
        !c.current && r && (c.current = r(e, {
            visualState: t,
            parent: i,
            props: n,
            presenceContext: l,
            blockInitialAnimation: !!l && !1 === l.initial,
            reducedMotionConfig: u
        }));
        const d = c.current
          , m = (0,
        o.useContext)(Or);
        !d || d.projection || !a || "html" !== d.type && "svg" !== d.type || function(e, t, n, r) {
            const {layoutId: a, layout: i, drag: o, dragConstraints: s, layoutScroll: l, layoutRoot: u, layoutCrossfade: c} = t;
            e.projection = new n(e.latestValues,t["data-framer-portal-id"] ? void 0 : Vr(e.parent)),
            e.projection.setOptions({
                layoutId: a,
                layout: i,
                alwaysMeasureLayout: Boolean(o) || s && Rr(s),
                visualElement: e,
                animationType: "string" == typeof i ? i : "both",
                initialPromotionConfig: r,
                crossfade: c,
                layoutScroll: l,
                layoutRoot: u
            })
        }(c.current, n, a, m);
        const f = (0,
        o.useRef)(!1);
        (0,
        o.useInsertionEffect)( () => {
            d && f.current && d.update(n, l)
        }
        );
        const h = n[Lr]
          , p = (0,
        o.useRef)(Boolean(h) && !window.MotionHandoffIsComplete?.(h) && window.MotionHasOptimisedAnimation?.(h));
        return jr( () => {
            d && (f.current = !0,
            window.MotionIsMounted = !0,
            d.updateFeatures(),
            d.scheduleRenderMicrotask(),
            p.current && d.animationState && d.animationState.animateChanges())
        }
        ),
        (0,
        o.useEffect)( () => {
            d && (!p.current && d.animationState && d.animationState.animateChanges(),
            p.current && (queueMicrotask( () => {
                window.MotionHandoffMarkAsComplete?.(h)
            }
            ),
            p.current = !1),
            d.enteringChildren = void 0)
        }
        ),
        d
    }
    function Vr(e) {
        if (e)
            return !1 !== e.options.allowProjection ? e.projection : Vr(e.parent)
    }
    function Fr(e, {forwardMotionProps: t=!1}={}, n, r) {
        n && function(e) {
            for (const t in e)
                Cn[t] = {
                    ...Cn[t],
                    ...e[t]
                }
        }(n);
        const a = ur(e) ? Mr : Tr;
        function i(n, i) {
            let s;
            const l = {
                ...(0,
                o.useContext)(hr),
                ...n,
                layoutId: Ir(n)
            }
              , {isStatic: u} = l
              , c = function(e) {
                const {initial: t, animate: n} = function(e, t) {
                    if (Vn(e)) {
                        const {initial: t, animate: n} = e;
                        return {
                            initial: !1 === t || On(t) ? t : void 0,
                            animate: On(n) ? n : void 0
                        }
                    }
                    return !1 !== e.inherit ? t : {}
                }(e, (0,
                o.useContext)(pr));
                return (0,
                o.useMemo)( () => ({
                    initial: t,
                    animate: n
                }), [gr(t), gr(n)])
            }(n)
              , d = a(n, u);
            if (!u && Mn) {
                (0,
                o.useContext)(fr).strict;
                const t = function(e) {
                    const {drag: t, layout: n} = Cn;
                    if (!t && !n)
                        return {};
                    const r = {
                        ...t,
                        ...n
                    };
                    return {
                        MeasureLayout: t?.isEnabled(e) || n?.isEnabled(e) ? r.MeasureLayout : void 0,
                        ProjectionNode: r.ProjectionNode
                    }
                }(l);
                s = t.MeasureLayout,
                c.visualElement = zr(e, d, l, r, t.ProjectionNode)
            }
            return (0,
            dr.jsxs)(pr.Provider, {
                value: c,
                children: [s && c.visualElement ? (0,
                dr.jsx)(s, {
                    visualElement: c.visualElement,
                    ...l
                }) : null, kr(e, n, Dr(d, c.visualElement, i), d, u, t)]
            })
        }
        i.displayName = `motion.${"string" == typeof e ? e : `create(${e.displayName ?? e.name ?? ""})`}`;
        const s = (0,
        o.forwardRef)(i);
        return s[Ar] = e,
        s
    }
    function Ir({layoutId: e}) {
        const t = (0,
        o.useContext)(mr).id;
        return t && void 0 !== e ? t + "-" + e : e
    }
    function Ur(e, t) {
        if ("undefined" == typeof Proxy)
            return Fr;
        const n = new Map
          , r = (n, r) => Fr(n, r, e, t);
        return new Proxy( (e, t) => r(e, t),{
            get: (a, i) => "create" === i ? r : (n.has(i) || n.set(i, Fr(i, void 0, e, t)),
            n.get(i))
        })
    }
    function Br(e, t, n) {
        const r = e.getProps();
        return Un(r, t, void 0 !== n ? n : r.custom, e)
    }
    function $r(e, t) {
        return e?.[t] ?? e?.default ?? e
    }
    const Wr = e => Array.isArray(e);
    function Hr(e, t, n) {
        e.hasValue(t) ? e.getValue(t).set(n) : e.addValue(t, Nn(n))
    }
    function Yr(e) {
        return Wr(e) ? e[e.length - 1] || 0 : e
    }
    function Kr(e, t) {
        const n = e.getValue("willChange");
        if (r = n,
        Boolean(fn(r) && r.add))
            return n.add(t);
        if (!n && vt.WillChange) {
            const n = new vt.WillChange("auto");
            e.addValue("willChange", n),
            n.add(t)
        }
        var r
    }
    function Qr(e) {
        return e.props[Lr]
    }
    function qr(e) {
        e.duration = 0,
        e.type = "keyframes"
    }
    const Xr = (e, t) => n => t(e(n))
      , Gr = (...e) => e.reduce(Xr)
      , Zr = e => 1e3 * e
      , Jr = e => e / 1e3
      , ea = {
        layout: 0,
        mainThread: 0,
        waapi: 0
    };
    function ta(e, t, n) {
        return n < 0 && (n += 1),
        n > 1 && (n -= 1),
        n < 1 / 6 ? e + 6 * (t - e) * n : n < .5 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
    }
    function na(e, t) {
        return n => n > 0 ? t : e
    }
    const ra = (e, t, n) => {
        const r = e * e
          , a = n * (t * t - r) + r;
        return a < 0 ? 0 : Math.sqrt(a)
    }
      , aa = [$t, Bt, Wt];
    function ia(e) {
        const t = (n = e,
        aa.find(e => e.test(n)));
        var n;
        if (Boolean(t),
        !Boolean(t))
            return !1;
        let r = t.parse(e);
        return t === Wt && (r = function({hue: e, saturation: t, lightness: n, alpha: r}) {
            e /= 360,
            n /= 100;
            let a = 0
              , i = 0
              , o = 0;
            if (t /= 100) {
                const r = n < .5 ? n * (1 + t) : n + t - n * t
                  , s = 2 * n - r;
                a = ta(s, r, e + 1 / 3),
                i = ta(s, r, e),
                o = ta(s, r, e - 1 / 3)
            } else
                a = i = o = n;
            return {
                red: Math.round(255 * a),
                green: Math.round(255 * i),
                blue: Math.round(255 * o),
                alpha: r
            }
        }(r)),
        r
    }
    const oa = (e, t) => {
        const n = ia(e)
          , r = ia(t);
        if (!n || !r)
            return na(e, t);
        const a = {
            ...n
        };
        return e => (a.red = ra(n.red, r.red, e),
        a.green = ra(n.green, r.green, e),
        a.blue = ra(n.blue, r.blue, e),
        a.alpha = Le(n.alpha, r.alpha, e),
        Bt.transform(a))
    }
      , sa = new Set(["none", "hidden"]);
    function la(e, t) {
        return n => Le(e, t, n)
    }
    function ua(e) {
        return "number" == typeof e ? la : "string" == typeof e ? Ae(e) ? na : Ht.test(e) ? oa : ma : Array.isArray(e) ? ca : "object" == typeof e ? Ht.test(e) ? oa : da : na
    }
    function ca(e, t) {
        const n = [...e]
          , r = n.length
          , a = e.map( (e, n) => ua(e)(e, t[n]));
        return e => {
            for (let t = 0; t < r; t++)
                n[t] = a[t](e);
            return n
        }
    }
    function da(e, t) {
        const n = {
            ...e,
            ...t
        }
          , r = {};
        for (const a in n)
            void 0 !== e[a] && void 0 !== t[a] && (r[a] = ua(e[a])(e[a], t[a]));
        return e => {
            for (const t in r)
                n[t] = r[t](e);
            return n
        }
    }
    const ma = (e, t) => {
        const n = en.createTransformer(t)
          , r = Xt(e)
          , a = Xt(t);
        return r.indexes.var.length === a.indexes.var.length && r.indexes.color.length === a.indexes.color.length && r.indexes.number.length >= a.indexes.number.length ? sa.has(e) && !a.values.length || sa.has(t) && !r.values.length ? function(e, t) {
            return sa.has(e) ? n => n <= 0 ? e : t : n => n >= 1 ? t : e
        }(e, t) : Gr(ca(function(e, t) {
            const n = []
              , r = {
                color: 0,
                var: 0,
                number: 0
            };
            for (let a = 0; a < t.values.length; a++) {
                const i = t.types[a]
                  , o = e.indexes[i][r[i]]
                  , s = e.values[o] ?? 0;
                n[a] = s,
                r[i]++
            }
            return n
        }(r, a), a.values), n) : na(e, t)
    }
    ;
    function fa(e, t, n) {
        return "number" == typeof e && "number" == typeof t && "number" == typeof n ? Le(e, t, n) : ua(e)(e, t)
    }
    const ha = e => {
        const t = ({timestamp: t}) => e(t);
        return {
            start: (e=!0) => Nt.update(t, e),
            stop: () => kt(t),
            now: () => St.isProcessing ? St.timestamp : gn.now()
        }
    }
      , pa = (e, t, n=10) => {
        let r = "";
        const a = Math.max(Math.round(t / n), 2);
        for (let t = 0; t < a; t++)
            r += Math.round(1e4 * e(t / (a - 1))) / 1e4 + ", ";
        return `linear(${r.substring(0, r.length - 2)})`
    }
      , ga = 2e4;
    function ya(e) {
        let t = 0
          , n = e.next(t);
        for (; !n.done && t < ga; )
            t += 50,
            n = e.next(t);
        return t >= ga ? 1 / 0 : t
    }
    function ba(e, t, n) {
        const r = Math.max(t - 5, 0);
        return wn(n - e(r), t - r)
    }
    const va = .01
      , wa = 2
      , xa = .005
      , _a = .5;
    const Na = 12;
    function ka(e, t) {
        return e * Math.sqrt(1 - t * t)
    }
    const Sa = ["duration", "bounce"]
      , Ea = ["stiffness", "damping", "mass"];
    function Pa(e, t) {
        return t.some(t => void 0 !== e[t])
    }
    function Ca(e=.3, t=.3) {
        const n = "object" != typeof e ? {
            visualDuration: e,
            keyframes: [0, 1],
            bounce: t
        } : e;
        let {restSpeed: r, restDelta: a} = n;
        const i = n.keyframes[0]
          , o = n.keyframes[n.keyframes.length - 1]
          , s = {
            done: !1,
            value: i
        }
          , {stiffness: l, damping: u, mass: c, duration: d, velocity: m, isResolvedFromDuration: f} = function(e) {
            let t = {
                velocity: 0,
                stiffness: 100,
                damping: 10,
                mass: 1,
                isResolvedFromDuration: !1,
                ...e
            };
            if (!Pa(e, Ea) && Pa(e, Sa))
                if (e.visualDuration) {
                    const n = e.visualDuration
                      , r = 2 * Math.PI / (1.2 * n)
                      , a = r * r
                      , i = 2 * Ge(.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(a);
                    t = {
                        ...t,
                        mass: 1,
                        stiffness: a,
                        damping: i
                    }
                } else {
                    const n = function({duration: e=800, bounce: t=.3, velocity: n=0, mass: r=1}) {
                        let a, i;
                        Zr(10);
                        let o = 1 - t;
                        o = Ge(.05, 1, o),
                        e = Ge(.01, 10, Jr(e)),
                        o < 1 ? (a = t => {
                            const r = t * o
                              , a = r * e;
                            return .001 - (r - n) / ka(t, o) * Math.exp(-a)
                        }
                        ,
                        i = t => {
                            const r = t * o * e
                              , i = r * n + n
                              , s = Math.pow(o, 2) * Math.pow(t, 2) * e
                              , l = Math.exp(-r)
                              , u = ka(Math.pow(t, 2), o);
                            return (.001 - a(t) > 0 ? -1 : 1) * ((i - s) * l) / u
                        }
                        ) : (a = t => Math.exp(-t * e) * ((t - n) * e + 1) - .001,
                        i = t => Math.exp(-t * e) * (e * e * (n - t)));
                        const s = function(e, t, n) {
                            let r = n;
                            for (let n = 1; n < Na; n++)
                                r -= e(r) / t(r);
                            return r
                        }(a, i, 5 / e);
                        if (e = Zr(e),
                        isNaN(s))
                            return {
                                stiffness: 100,
                                damping: 10,
                                duration: e
                            };
                        {
                            const t = Math.pow(s, 2) * r;
                            return {
                                stiffness: t,
                                damping: 2 * o * Math.sqrt(r * t),
                                duration: e
                            }
                        }
                    }(e);
                    t = {
                        ...t,
                        ...n,
                        mass: 1
                    },
                    t.isResolvedFromDuration = !0
                }
            return t
        }({
            ...n,
            velocity: -Jr(n.velocity || 0)
        })
          , h = m || 0
          , p = u / (2 * Math.sqrt(l * c))
          , g = o - i
          , y = Jr(Math.sqrt(l / c))
          , b = Math.abs(g) < 5;
        let v;
        if (r || (r = b ? va : wa),
        a || (a = b ? xa : _a),
        p < 1) {
            const e = ka(y, p);
            v = t => {
                const n = Math.exp(-p * y * t);
                return o - n * ((h + p * y * g) / e * Math.sin(e * t) + g * Math.cos(e * t))
            }
        } else if (1 === p)
            v = e => o - Math.exp(-y * e) * (g + (h + y * g) * e);
        else {
            const e = y * Math.sqrt(p * p - 1);
            v = t => {
                const n = Math.exp(-p * y * t)
                  , r = Math.min(e * t, 300);
                return o - n * ((h + p * y * g) * Math.sinh(r) + e * g * Math.cosh(r)) / e
            }
        }
        const w = {
            calculatedDuration: f && d || null,
            next: e => {
                const t = v(e);
                if (f)
                    s.done = e >= d;
                else {
                    let n = 0 === e ? h : 0;
                    p < 1 && (n = 0 === e ? Zr(h) : ba(v, e, t));
                    const i = Math.abs(n) <= r
                      , l = Math.abs(o - t) <= a;
                    s.done = i && l
                }
                return s.value = s.done ? o : t,
                s
            }
            ,
            toString: () => {
                const e = Math.min(ya(w), ga)
                  , t = pa(t => w.next(e * t).value, e, 30);
                return e + "ms " + t
            }
            ,
            toTransition: () => {}
        };
        return w
    }
    function Ta({keyframes: e, velocity: t=0, power: n=.8, timeConstant: r=325, bounceDamping: a=10, bounceStiffness: i=500, modifyTarget: o, min: s, max: l, restDelta: u=.5, restSpeed: c}) {
        const d = e[0]
          , m = {
            done: !1,
            value: d
        }
          , f = e => void 0 === s ? l : void 0 === l || Math.abs(s - e) < Math.abs(l - e) ? s : l;
        let h = n * t;
        const p = d + h
          , g = void 0 === o ? p : o(p);
        g !== p && (h = g - d);
        const y = e => -h * Math.exp(-e / r)
          , b = e => g + y(e)
          , v = e => {
            const t = y(e)
              , n = b(e);
            m.done = Math.abs(t) <= u,
            m.value = m.done ? g : n
        }
        ;
        let w, x;
        const _ = e => {
            var t;
            t = m.value,
            (void 0 !== s && t < s || void 0 !== l && t > l) && (w = e,
            x = Ca({
                keyframes: [m.value, f(m.value)],
                velocity: ba(b, e, m.value),
                damping: a,
                stiffness: i,
                restDelta: u,
                restSpeed: c
            }))
        }
        ;
        return _(0),
        {
            calculatedDuration: null,
            next: e => {
                let t = !1;
                return x || void 0 !== w || (t = !0,
                v(e),
                _(e)),
                void 0 !== w && e >= w ? x.next(e - w) : (!t && v(e),
                m)
            }
        }
    }
    Ca.applyToOptions = e => {
        const t = function(e, t=100, n) {
            const r = n({
                ...e,
                keyframes: [0, t]
            })
              , a = Math.min(ya(r), ga);
            return {
                type: "keyframes",
                ease: e => r.next(a * e).value / t,
                duration: Jr(a)
            }
        }(e, 100, Ca);
        return e.ease = t.ease,
        e.duration = Zr(t.duration),
        e.type = "keyframes",
        e
    }
    ;
    const Ma = (e, t, n) => (((1 - 3 * n + 3 * t) * e + (3 * n - 6 * t)) * e + 3 * t) * e;
    function Aa(e, t, n, r) {
        if (e === t && n === r)
            return bt;
        return a => 0 === a || 1 === a ? a : Ma(function(e, t, n, r, a) {
            let i, o, s = 0;
            do {
                o = t + (n - t) / 2,
                i = Ma(o, r, a) - e,
                i > 0 ? n = o : t = o
            } while (Math.abs(i) > 1e-7 && ++s < 12);
            return o
        }(a, 0, 1, e, n), t, r)
    }
    const Ra = Aa(.42, 0, 1, 1)
      , Da = Aa(0, 0, .58, 1)
      , La = Aa(.42, 0, .58, 1)
      , Oa = e => t => t <= .5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2
      , ja = e => t => 1 - e(1 - t)
      , za = Aa(.33, 1.53, .69, .99)
      , Va = ja(za)
      , Fa = Oa(Va)
      , Ia = e => (e *= 2) < 1 ? .5 * Va(e) : .5 * (2 - Math.pow(2, -10 * (e - 1)))
      , Ua = e => 1 - Math.sin(Math.acos(e))
      , Ba = ja(Ua)
      , $a = Oa(Ua)
      , Wa = e => Array.isArray(e) && "number" == typeof e[0]
      , Ha = {
        linear: bt,
        easeIn: Ra,
        easeInOut: La,
        easeOut: Da,
        circIn: Ua,
        circInOut: $a,
        circOut: Ba,
        backIn: Va,
        backInOut: Fa,
        backOut: za,
        anticipate: Ia
    }
      , Ya = e => {
        if (Wa(e)) {
            e.length;
            const [t,n,r,a] = e;
            return Aa(t, n, r, a)
        }
        return "string" == typeof e ? Ha[e] : e
    }
      , Ka = (e, t, n) => {
        const r = t - e;
        return 0 === r ? 1 : (n - e) / r
    }
    ;
    function Qa({duration: e=300, keyframes: t, times: n, ease: r="easeInOut"}) {
        const a = (e => Array.isArray(e) && "number" != typeof e[0])(r) ? r.map(Ya) : Ya(r)
          , i = {
            done: !1,
            value: t[0]
        }
          , o = function(e, t) {
            return e.map(e => e * t)
        }(n && n.length === t.length ? n : function(e) {
            const t = [0];
            return function(e, t) {
                const n = e[e.length - 1];
                for (let r = 1; r <= t; r++) {
                    const a = Ka(0, t, r);
                    e.push(Le(n, 1, a))
                }
            }(t, e.length - 1),
            t
        }(t), e)
          , s = function(e, t, {clamp: n=!0, ease: r, mixer: a}={}) {
            const i = e.length;
            if (t.length,
            1 === i)
                return () => t[0];
            if (2 === i && t[0] === t[1])
                return () => t[1];
            const o = e[0] === e[1];
            e[0] > e[i - 1] && (e = [...e].reverse(),
            t = [...t].reverse());
            const s = function(e, t, n) {
                const r = []
                  , a = n || vt.mix || fa
                  , i = e.length - 1;
                for (let n = 0; n < i; n++) {
                    let i = a(e[n], e[n + 1]);
                    if (t) {
                        const e = Array.isArray(t) ? t[n] || bt : t;
                        i = Gr(e, i)
                    }
                    r.push(i)
                }
                return r
            }(t, r, a)
              , l = s.length
              , u = n => {
                if (o && n < e[0])
                    return t[0];
                let r = 0;
                if (l > 1)
                    for (; r < e.length - 2 && !(n < e[r + 1]); r++)
                        ;
                const a = Ka(e[r], e[r + 1], n);
                return s[r](a)
            }
            ;
            return n ? t => u(Ge(e[0], e[i - 1], t)) : u
        }(o, t, {
            ease: Array.isArray(a) ? a : (l = t,
            u = a,
            l.map( () => u || La).splice(0, l.length - 1))
        });
        var l, u;
        return {
            calculatedDuration: e,
            next: t => (i.value = s(t),
            i.done = t >= e,
            i)
        }
    }
    const qa = e => null !== e;
    function Xa(e, {repeat: t, repeatType: n="loop"}, r, a=1) {
        const i = e.filter(qa)
          , o = a < 0 || t && "loop" !== n && t % 2 == 1 ? 0 : i.length - 1;
        return o && void 0 !== r ? r : i[o]
    }
    const Ga = {
        decay: Ta,
        inertia: Ta,
        tween: Qa,
        keyframes: Qa,
        spring: Ca
    };
    function Za(e) {
        "string" == typeof e.type && (e.type = Ga[e.type])
    }
    class Ja {
        constructor() {
            this.updateFinished()
        }
        get finished() {
            return this._finished
        }
        updateFinished() {
            this._finished = new Promise(e => {
                this.resolve = e
            }
            )
        }
        notifyFinished() {
            this.resolve()
        }
        then(e, t) {
            return this.finished.then(e, t)
        }
    }
    const ei = e => e / 100;
    class ti extends Ja {
        constructor(e) {
            super(),
            this.state = "idle",
            this.startTime = null,
            this.isStopped = !1,
            this.currentTime = 0,
            this.holdTime = null,
            this.playbackSpeed = 1,
            this.stop = () => {
                const {motionValue: e} = this.options;
                e && e.updatedAt !== gn.now() && this.tick(gn.now()),
                this.isStopped = !0,
                "idle" !== this.state && (this.teardown(),
                this.options.onStop?.())
            }
            ,
            ea.mainThread++,
            this.options = e,
            this.initAnimation(),
            this.play(),
            !1 === e.autoplay && this.pause()
        }
        initAnimation() {
            const {options: e} = this;
            Za(e);
            const {type: t=Qa, repeat: n=0, repeatDelay: r=0, repeatType: a, velocity: i=0} = e;
            let {keyframes: o} = e;
            const s = t || Qa;
            s !== Qa && "number" != typeof o[0] && (this.mixKeyframes = Gr(ei, fa(o[0], o[1])),
            o = [0, 100]);
            const l = s({
                ...e,
                keyframes: o
            });
            "mirror" === a && (this.mirroredGenerator = s({
                ...e,
                keyframes: [...o].reverse(),
                velocity: -i
            })),
            null === l.calculatedDuration && (l.calculatedDuration = ya(l));
            const {calculatedDuration: u} = l;
            this.calculatedDuration = u,
            this.resolvedDuration = u + r,
            this.totalDuration = this.resolvedDuration * (n + 1) - r,
            this.generator = l
        }
        updateTime(e) {
            const t = Math.round(e - this.startTime) * this.playbackSpeed;
            null !== this.holdTime ? this.currentTime = this.holdTime : this.currentTime = t
        }
        tick(e, t=!1) {
            const {generator: n, totalDuration: r, mixKeyframes: a, mirroredGenerator: i, resolvedDuration: o, calculatedDuration: s} = this;
            if (null === this.startTime)
                return n.next(0);
            const {delay: l=0, keyframes: u, repeat: c, repeatType: d, repeatDelay: m, type: f, onUpdate: h, finalKeyframe: p} = this.options;
            this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - r / this.speed, this.startTime)),
            t ? this.currentTime = e : this.updateTime(e);
            const g = this.currentTime - l * (this.playbackSpeed >= 0 ? 1 : -1)
              , y = this.playbackSpeed >= 0 ? g < 0 : g > r;
            this.currentTime = Math.max(g, 0),
            "finished" === this.state && null === this.holdTime && (this.currentTime = r);
            let b = this.currentTime
              , v = n;
            if (c) {
                const e = Math.min(this.currentTime, r) / o;
                let t = Math.floor(e)
                  , n = e % 1;
                !n && e >= 1 && (n = 1),
                1 === n && t--,
                t = Math.min(t, c + 1),
                Boolean(t % 2) && ("reverse" === d ? (n = 1 - n,
                m && (n -= m / o)) : "mirror" === d && (v = i)),
                b = Ge(0, 1, n) * o
            }
            const w = y ? {
                done: !1,
                value: u[0]
            } : v.next(b);
            a && (w.value = a(w.value));
            let {done: x} = w;
            y || null === s || (x = this.playbackSpeed >= 0 ? this.currentTime >= r : this.currentTime <= 0);
            const _ = null === this.holdTime && ("finished" === this.state || "running" === this.state && x);
            return _ && f !== Ta && (w.value = Xa(u, this.options, p, this.speed)),
            h && h(w.value),
            _ && this.finish(),
            w
        }
        then(e, t) {
            return this.finished.then(e, t)
        }
        get duration() {
            return Jr(this.calculatedDuration)
        }
        get iterationDuration() {
            const {delay: e=0} = this.options || {};
            return this.duration + Jr(e)
        }
        get time() {
            return Jr(this.currentTime)
        }
        set time(e) {
            e = Zr(e),
            this.currentTime = e,
            null === this.startTime || null !== this.holdTime || 0 === this.playbackSpeed ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed),
            this.driver?.start(!1)
        }
        get speed() {
            return this.playbackSpeed
        }
        set speed(e) {
            this.updateTime(gn.now());
            const t = this.playbackSpeed !== e;
            this.playbackSpeed = e,
            t && (this.time = Jr(this.currentTime))
        }
        play() {
            if (this.isStopped)
                return;
            const {driver: e=ha, startTime: t} = this.options;
            this.driver || (this.driver = e(e => this.tick(e))),
            this.options.onPlay?.();
            const n = this.driver.now();
            "finished" === this.state ? (this.updateFinished(),
            this.startTime = n) : null !== this.holdTime ? this.startTime = n - this.holdTime : this.startTime || (this.startTime = t ?? n),
            "finished" === this.state && this.speed < 0 && (this.startTime += this.calculatedDuration),
            this.holdTime = null,
            this.state = "running",
            this.driver.start()
        }
        pause() {
            this.state = "paused",
            this.updateTime(gn.now()),
            this.holdTime = this.currentTime
        }
        complete() {
            "running" !== this.state && this.play(),
            this.state = "finished",
            this.holdTime = null
        }
        finish() {
            this.notifyFinished(),
            this.teardown(),
            this.state = "finished",
            this.options.onComplete?.()
        }
        cancel() {
            this.holdTime = null,
            this.startTime = 0,
            this.tick(0),
            this.teardown(),
            this.options.onCancel?.()
        }
        teardown() {
            this.state = "idle",
            this.stopDriver(),
            this.startTime = this.holdTime = null,
            ea.mainThread--
        }
        stopDriver() {
            this.driver && (this.driver.stop(),
            this.driver = void 0)
        }
        sample(e) {
            return this.startTime = 0,
            this.tick(e, !0)
        }
        attachTimeline(e) {
            return this.options.allowFlatten && (this.options.type = "keyframes",
            this.options.ease = "linear",
            this.initAnimation()),
            this.driver?.stop(),
            e.observe(this)
        }
    }
    function ni(e) {
        let t;
        return () => (void 0 === t && (t = e()),
        t)
    }
    const ri = ni( () => void 0 !== window.ScrollTimeline)
      , ai = {};
    function ii(e, t) {
        const n = ni(e);
        return () => ai[t] ?? n()
    }
    const oi = ii( () => {
        try {
            document.createElement("div").animate({
                opacity: 0
            }, {
                easing: "linear(0, 1)"
            })
        } catch (e) {
            return !1
        }
        return !0
    }
    , "linearEasing")
      , si = ([e,t,n,r]) => `cubic-bezier(${e}, ${t}, ${n}, ${r})`
      , li = {
        linear: "linear",
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
        circIn: si([0, .65, .55, 1]),
        circOut: si([.55, 0, 1, .45]),
        backIn: si([.31, .01, .66, -.59]),
        backOut: si([.33, 1.53, .69, .99])
    };
    function ui(e, t) {
        return e ? "function" == typeof e ? oi() ? pa(e, t) : "ease-out" : Wa(e) ? si(e) : Array.isArray(e) ? e.map(e => ui(e, t) || li.easeOut) : li[e] : void 0
    }
    function ci(e, t, n, {delay: r=0, duration: a=300, repeat: i=0, repeatType: o="loop", ease: s="easeOut", times: l}={}, u=void 0) {
        const c = {
            [t]: n
        };
        l && (c.offset = l);
        const d = ui(s, a);
        Array.isArray(d) && (c.easing = d),
        xt.value && ea.waapi++;
        const m = {
            delay: r,
            duration: a,
            easing: Array.isArray(d) ? "linear" : d,
            fill: "both",
            iterations: i + 1,
            direction: "reverse" === o ? "alternate" : "normal"
        };
        u && (m.pseudoElement = u);
        const f = e.animate(c, m);
        return xt.value && f.finished.finally( () => {
            ea.waapi--
        }
        ),
        f
    }
    function di(e) {
        return "function" == typeof e && "applyToOptions"in e
    }
    class mi extends Ja {
        constructor(e) {
            if (super(),
            this.finishedTime = null,
            this.isStopped = !1,
            !e)
                return;
            const {element: t, name: n, keyframes: r, pseudoElement: a, allowFlatten: i=!1, finalKeyframe: o, onComplete: s} = e;
            this.isPseudoElement = Boolean(a),
            this.allowFlatten = i,
            this.options = e,
            e.type;
            const l = function({type: e, ...t}) {
                return di(e) && oi() ? e.applyToOptions(t) : (t.duration ?? (t.duration = 300),
                t.ease ?? (t.ease = "easeOut"),
                t)
            }(e);
            this.animation = ci(t, n, r, l, a),
            !1 === l.autoplay && this.animation.pause(),
            this.animation.onfinish = () => {
                if (this.finishedTime = this.time,
                !a) {
                    const e = Xa(r, this.options, o, this.speed);
                    this.updateMotionValue ? this.updateMotionValue(e) : function(e, t, n) {
                        (e => e.startsWith("--"))(t) ? e.style.setProperty(t, n) : e.style[t] = n
                    }(t, n, e),
                    this.animation.cancel()
                }
                s?.(),
                this.notifyFinished()
            }
        }
        play() {
            this.isStopped || (this.animation.play(),
            "finished" === this.state && this.updateFinished())
        }
        pause() {
            this.animation.pause()
        }
        complete() {
            this.animation.finish?.()
        }
        cancel() {
            try {
                this.animation.cancel()
            } catch (e) {}
        }
        stop() {
            if (this.isStopped)
                return;
            this.isStopped = !0;
            const {state: e} = this;
            "idle" !== e && "finished" !== e && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
            this.isPseudoElement || this.cancel())
        }
        commitStyles() {
            this.isPseudoElement || this.animation.commitStyles?.()
        }
        get duration() {
            const e = this.animation.effect?.getComputedTiming?.().duration || 0;
            return Jr(Number(e))
        }
        get iterationDuration() {
            const {delay: e=0} = this.options || {};
            return this.duration + Jr(e)
        }
        get time() {
            return Jr(Number(this.animation.currentTime) || 0)
        }
        set time(e) {
            this.finishedTime = null,
            this.animation.currentTime = Zr(e)
        }
        get speed() {
            return this.animation.playbackRate
        }
        set speed(e) {
            e < 0 && (this.finishedTime = null),
            this.animation.playbackRate = e
        }
        get state() {
            return null !== this.finishedTime ? "finished" : this.animation.playState
        }
        get startTime() {
            return Number(this.animation.startTime)
        }
        set startTime(e) {
            this.animation.startTime = e
        }
        attachTimeline({timeline: e, observe: t}) {
            return this.allowFlatten && this.animation.effect?.updateTiming({
                easing: "linear"
            }),
            this.animation.onfinish = null,
            e && ri() ? (this.animation.timeline = e,
            bt) : t(this)
        }
    }
    const fi = {
        anticipate: Ia,
        backInOut: Fa,
        circInOut: $a
    };
    class hi extends mi {
        constructor(e) {
            var t;
            "string" == typeof (t = e).ease && t.ease in fi && (t.ease = fi[t.ease]),
            Za(e),
            super(e),
            e.startTime && (this.startTime = e.startTime),
            this.options = e
        }
        updateMotionValue(e) {
            const {motionValue: t, onUpdate: n, onComplete: r, element: a, ...i} = this.options;
            if (!t)
                return;
            if (void 0 !== e)
                return void t.set(e);
            const o = new ti({
                ...i,
                autoplay: !1
            })
              , s = Zr(this.finishedTime ?? this.time);
            t.setWithVelocity(o.sample(s - 10).value, o.sample(s).value, 10),
            o.stop()
        }
    }
    const pi = (e, t) => !("zIndex" === t || "number" != typeof e && !Array.isArray(e) && ("string" != typeof e || !en.test(e) && "0" !== e || e.startsWith("url(")))
      , gi = new Set(["opacity", "clipPath", "filter", "transform"])
      , yi = ni( () => Object.hasOwnProperty.call(Element.prototype, "animate"));
    class bi extends Ja {
        constructor({autoplay: e=!0, delay: t=0, type: n="keyframes", repeat: r=0, repeatDelay: a=0, repeatType: i="loop", keyframes: o, name: s, motionValue: l, element: u, ...c}) {
            super(),
            this.stop = () => {
                this._animation && (this._animation.stop(),
                this.stopTimeline?.()),
                this.keyframeResolver?.cancel()
            }
            ,
            this.createdAt = gn.now();
            const d = {
                autoplay: e,
                delay: t,
                type: n,
                repeat: r,
                repeatDelay: a,
                repeatType: i,
                name: s,
                motionValue: l,
                element: u,
                ...c
            }
              , m = u?.KeyframeResolver || Dt;
            this.keyframeResolver = new m(o, (e, t, n) => this.onKeyframesResolved(e, t, d, !n),s,l,u),
            this.keyframeResolver?.scheduleResolve()
        }
        onKeyframesResolved(e, t, n, r) {
            this.keyframeResolver = void 0;
            const {name: a, type: i, velocity: o, delay: s, isHandoff: l, onUpdate: u} = n;
            this.resolvedAt = gn.now(),
            function(e, t, n, r) {
                const a = e[0];
                if (null === a)
                    return !1;
                if ("display" === t || "visibility" === t)
                    return !0;
                const i = e[e.length - 1]
                  , o = pi(a, t)
                  , s = pi(i, t);
                return !(!o || !s) && (function(e) {
                    const t = e[0];
                    if (1 === e.length)
                        return !0;
                    for (let n = 0; n < e.length; n++)
                        if (e[n] !== t)
                            return !0
                }(e) || ("spring" === n || di(n)) && r)
            }(e, a, i, o) || (!vt.instantAnimations && s || u?.(Xa(e, n, t)),
            e[0] = e[e.length - 1],
            qr(n),
            n.repeat = 0);
            const c = {
                startTime: r ? this.resolvedAt && this.resolvedAt - this.createdAt > 40 ? this.resolvedAt : this.createdAt : void 0,
                finalKeyframe: t,
                ...n,
                keyframes: e
            }
              , d = !l && function(e) {
                const {motionValue: t, name: n, repeatDelay: r, repeatType: a, damping: i, type: o} = e
                  , s = t?.owner?.current;
                if (!(s instanceof HTMLElement))
                    return !1;
                const {onUpdate: l, transformTemplate: u} = t.owner.getProps();
                return yi() && n && gi.has(n) && ("transform" !== n || !u) && !l && !r && "mirror" !== a && 0 !== i && "inertia" !== o
            }(c) ? new hi({
                ...c,
                element: c.motionValue.owner.current
            }) : new ti(c);
            d.finished.then( () => this.notifyFinished()).catch(bt),
            this.pendingTimeline && (this.stopTimeline = d.attachTimeline(this.pendingTimeline),
            this.pendingTimeline = void 0),
            this._animation = d
        }
        get finished() {
            return this._animation ? this.animation.finished : this._finished
        }
        then(e, t) {
            return this.finished.finally(e).then( () => {}
            )
        }
        get animation() {
            return this._animation || (this.keyframeResolver?.resume(),
            Mt = !0,
            Rt(),
            At(),
            Mt = !1),
            this._animation
        }
        get duration() {
            return this.animation.duration
        }
        get iterationDuration() {
            return this.animation.iterationDuration
        }
        get time() {
            return this.animation.time
        }
        set time(e) {
            this.animation.time = e
        }
        get speed() {
            return this.animation.speed
        }
        get state() {
            return this.animation.state
        }
        set speed(e) {
            this.animation.speed = e
        }
        get startTime() {
            return this.animation.startTime
        }
        attachTimeline(e) {
            return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e,
            () => this.stop()
        }
        play() {
            this.animation.play()
        }
        pause() {
            this.animation.pause()
        }
        complete() {
            this.animation.complete()
        }
        cancel() {
            this._animation && this.animation.cancel(),
            this.keyframeResolver?.cancel()
        }
    }
    const vi = e => null !== e
      , wi = {
        type: "spring",
        stiffness: 500,
        damping: 25,
        restSpeed: 10
    }
      , xi = {
        type: "keyframes",
        duration: .8
    }
      , _i = {
        type: "keyframes",
        ease: [.25, .1, .35, 1],
        duration: .3
    }
      , Ni = (e, t, n, r={}, a, i) => o => {
        const s = $r(r, e) || {}
          , l = s.delay || r.delay || 0;
        let {elapsed: u=0} = r;
        u -= Zr(l);
        const c = {
            keyframes: Array.isArray(n) ? n : [null, n],
            ease: "easeOut",
            velocity: t.getVelocity(),
            ...s,
            delay: -u,
            onUpdate: e => {
                t.set(e),
                s.onUpdate && s.onUpdate(e)
            }
            ,
            onComplete: () => {
                o(),
                s.onComplete && s.onComplete()
            }
            ,
            name: e,
            motionValue: t,
            element: i ? void 0 : a
        };
        (function({when: e, delay: t, delayChildren: n, staggerChildren: r, staggerDirection: a, repeat: i, repeatType: o, repeatDelay: s, from: l, elapsed: u, ...c}) {
            return !!Object.keys(c).length
        }
        )(s) || Object.assign(c, ( (e, {keyframes: t}) => t.length > 2 ? xi : ye.has(e) ? e.startsWith("scale") ? {
            type: "spring",
            stiffness: 550,
            damping: 0 === t[1] ? 2 * Math.sqrt(550) : 30,
            restSpeed: 10
        } : wi : _i)(e, c)),
        c.duration && (c.duration = Zr(c.duration)),
        c.repeatDelay && (c.repeatDelay = Zr(c.repeatDelay)),
        void 0 !== c.from && (c.keyframes[0] = c.from);
        let d = !1;
        if ((!1 === c.type || 0 === c.duration && !c.repeatDelay) && (qr(c),
        0 === c.delay && (d = !0)),
        (vt.instantAnimations || vt.skipAnimations) && (d = !0,
        qr(c),
        c.delay = 0),
        c.allowFlatten = !s.type && !s.ease,
        d && !i && void 0 !== t.get()) {
            const e = function(e, {repeat: t, repeatType: n="loop"}, r) {
                const a = e.filter(vi)
                  , i = t && "loop" !== n && t % 2 == 1 ? 0 : a.length - 1;
                return i && void 0 !== r ? r : a[i]
            }(c.keyframes, s);
            if (void 0 !== e)
                return void Nt.update( () => {
                    c.onUpdate(e),
                    c.onComplete()
                }
                )
        }
        return s.isSync ? new ti(c) : new bi(c)
    }
    ;
    function ki({protectedKeys: e, needsAnimating: t}, n) {
        const r = e.hasOwnProperty(n) && !0 !== t[n];
        return t[n] = !1,
        r
    }
    function Si(e, t, {delay: n=0, transitionOverride: r, type: a}={}) {
        let {transition: i=e.getDefaultTransition(), transitionEnd: o, ...s} = t;
        r && (i = r);
        const l = []
          , u = a && e.animationState && e.animationState.getState()[a];
        for (const t in s) {
            const r = e.getValue(t, e.latestValues[t] ?? null)
              , a = s[t];
            if (void 0 === a || u && ki(u, t))
                continue;
            const o = {
                delay: n,
                ...$r(i || {}, t)
            }
              , c = r.get();
            if (void 0 !== c && !r.isAnimating && !Array.isArray(a) && a === c && !o.velocity)
                continue;
            let d = !1;
            if (window.MotionHandoffAnimation) {
                const n = Qr(e);
                if (n) {
                    const e = window.MotionHandoffAnimation(n, t, Nt);
                    null !== e && (o.startTime = e,
                    d = !0)
                }
            }
            Kr(e, t),
            r.start(Ni(t, r, a, e.shouldReduceMotion && Xe.has(t) ? {
                type: !1
            } : o, e, d));
            const m = r.animation;
            m && l.push(m)
        }
        return o && Promise.all(l).then( () => {
            Nt.update( () => {
                o && function(e, t) {
                    const n = Br(e, t);
                    let {transitionEnd: r={}, transition: a={}, ...i} = n || {};
                    i = {
                        ...i,
                        ...r
                    };
                    for (const t in i)
                        Hr(e, t, Yr(i[t]))
                }(e, o)
            }
            )
        }
        ),
        l
    }
    function Ei(e, t, n, r=0, a=1) {
        const i = Array.from(e).sort( (e, t) => e.sortNodePosition(t)).indexOf(t)
          , o = e.size
          , s = (o - 1) * r;
        return "function" == typeof n ? n(i, o) : 1 === a ? i * r : s - i * r
    }
    function Pi(e, t, n={}) {
        const r = Br(e, t, "exit" === n.type ? e.presenceContext?.custom : void 0);
        let {transition: a=e.getDefaultTransition() || {}} = r || {};
        n.transitionOverride && (a = n.transitionOverride);
        const i = r ? () => Promise.all(Si(e, r, n)) : () => Promise.resolve()
          , o = e.variantChildren && e.variantChildren.size ? (r=0) => {
            const {delayChildren: i=0, staggerChildren: o, staggerDirection: s} = a;
            return function(e, t, n=0, r=0, a=0, i=1, o) {
                const s = [];
                for (const l of e.variantChildren)
                    l.notify("AnimationStart", t),
                    s.push(Pi(l, t, {
                        ...o,
                        delay: n + ("function" == typeof r ? 0 : r) + Ei(e.variantChildren, l, r, a, i)
                    }).then( () => l.notify("AnimationComplete", t)));
                return Promise.all(s)
            }(e, t, r, i, o, s, n)
        }
        : () => Promise.resolve()
          , {when: s} = a;
        if (s) {
            const [e,t] = "beforeChildren" === s ? [i, o] : [o, i];
            return e().then( () => t())
        }
        return Promise.all([i(), o(n.delay)])
    }
    function Ci(e, t) {
        if (!Array.isArray(t))
            return !1;
        const n = t.length;
        if (n !== e.length)
            return !1;
        for (let r = 0; r < n; r++)
            if (t[r] !== e[r])
                return !1;
        return !0
    }
    const Ti = zn.length;
    function Mi(e) {
        if (!e)
            return;
        if (!e.isControllingVariants) {
            const t = e.parent && Mi(e.parent) || {};
            return void 0 !== e.props.initial && (t.initial = e.props.initial),
            t
        }
        const t = {};
        for (let n = 0; n < Ti; n++) {
            const r = zn[n]
              , a = e.props[r];
            (On(a) || !1 === a) && (t[r] = a)
        }
        return t
    }
    const Ai = [...jn].reverse()
      , Ri = jn.length;
    function Di(e) {
        let t = function(e) {
            return t => Promise.all(t.map( ({animation: t, options: n}) => function(e, t, n={}) {
                let r;
                if (e.notify("AnimationStart", t),
                Array.isArray(t)) {
                    const a = t.map(t => Pi(e, t, n));
                    r = Promise.all(a)
                } else if ("string" == typeof t)
                    r = Pi(e, t, n);
                else {
                    const a = "function" == typeof t ? Br(e, t, n.custom) : t;
                    r = Promise.all(Si(e, a, n))
                }
                return r.then( () => {
                    e.notify("AnimationComplete", t)
                }
                )
            }(e, t, n)))
        }(e)
          , n = ji()
          , r = !0;
        const a = t => (n, r) => {
            const a = Br(e, r, "exit" === t ? e.presenceContext?.custom : void 0);
            if (a) {
                const {transition: e, transitionEnd: t, ...r} = a;
                n = {
                    ...n,
                    ...r,
                    ...t
                }
            }
            return n
        }
        ;
        function i(i) {
            const {props: o} = e
              , s = Mi(e.parent) || {}
              , l = []
              , u = new Set;
            let c = {}
              , d = 1 / 0;
            for (let t = 0; t < Ri; t++) {
                const m = Ai[t]
                  , f = n[m]
                  , h = void 0 !== o[m] ? o[m] : s[m]
                  , p = On(h)
                  , g = m === i ? f.isActive : null;
                !1 === g && (d = t);
                let y = h === s[m] && h !== o[m] && p;
                if (y && r && e.manuallyAnimateOnMount && (y = !1),
                f.protectedKeys = {
                    ...c
                },
                !f.isActive && null === g || !h && !f.prevProp || Ln(h) || "boolean" == typeof h)
                    continue;
                const b = Li(f.prevProp, h);
                let v = b || m === i && f.isActive && !y && p || t > d && p
                  , w = !1;
                const x = Array.isArray(h) ? h : [h];
                let _ = x.reduce(a(m), {});
                !1 === g && (_ = {});
                const {prevResolvedValues: N={}} = f
                  , k = {
                    ...N,
                    ..._
                }
                  , S = t => {
                    v = !0,
                    u.has(t) && (w = !0,
                    u.delete(t)),
                    f.needsAnimating[t] = !0;
                    const n = e.getValue(t);
                    n && (n.liveStyle = !1)
                }
                ;
                for (const e in k) {
                    const t = _[e]
                      , n = N[e];
                    if (c.hasOwnProperty(e))
                        continue;
                    let r = !1;
                    r = Wr(t) && Wr(n) ? !Ci(t, n) : t !== n,
                    r ? null != t ? S(e) : u.add(e) : void 0 !== t && u.has(e) ? S(e) : f.protectedKeys[e] = !0
                }
                f.prevProp = h,
                f.prevResolvedValues = _,
                f.isActive && (c = {
                    ...c,
                    ..._
                }),
                r && e.blockInitialAnimation && (v = !1);
                const E = y && b;
                v && (!E || w) && l.push(...x.map(t => {
                    const n = {
                        type: m
                    };
                    if ("string" == typeof t && r && !E && e.manuallyAnimateOnMount && e.parent) {
                        const {parent: r} = e
                          , a = Br(r, t);
                        if (r.enteringChildren && a) {
                            const {delayChildren: t} = a.transition || {};
                            n.delay = Ei(r.enteringChildren, e, t)
                        }
                    }
                    return {
                        animation: t,
                        options: n
                    }
                }
                ))
            }
            if (u.size) {
                const t = {};
                if ("boolean" != typeof o.initial) {
                    const n = Br(e, Array.isArray(o.initial) ? o.initial[0] : o.initial);
                    n && n.transition && (t.transition = n.transition)
                }
                u.forEach(n => {
                    const r = e.getBaseTarget(n)
                      , a = e.getValue(n);
                    a && (a.liveStyle = !0),
                    t[n] = r ?? null
                }
                ),
                l.push({
                    animation: t
                })
            }
            let m = Boolean(l.length);
            return !r || !1 !== o.initial && o.initial !== o.animate || e.manuallyAnimateOnMount || (m = !1),
            r = !1,
            m ? t(l) : Promise.resolve()
        }
        return {
            animateChanges: i,
            setActive: function(t, r) {
                if (n[t].isActive === r)
                    return Promise.resolve();
                e.variantChildren?.forEach(e => e.animationState?.setActive(t, r)),
                n[t].isActive = r;
                const a = i(t);
                for (const e in n)
                    n[e].protectedKeys = {};
                return a
            },
            setAnimateFunction: function(n) {
                t = n(e)
            },
            getState: () => n,
            reset: () => {
                n = ji()
            }
        }
    }
    function Li(e, t) {
        return "string" == typeof t ? t !== e : !!Array.isArray(t) && !Ci(t, e)
    }
    function Oi(e=!1) {
        return {
            isActive: e,
            protectedKeys: {},
            needsAnimating: {},
            prevResolvedValues: {}
        }
    }
    function ji() {
        return {
            animate: Oi(!0),
            whileInView: Oi(),
            whileHover: Oi(),
            whileTap: Oi(),
            whileDrag: Oi(),
            whileFocus: Oi(),
            exit: Oi()
        }
    }
    class zi {
        constructor(e) {
            this.isMounted = !1,
            this.node = e
        }
        update() {}
    }
    let Vi = 0;
    const Fi = {
        animation: {
            Feature: class extends zi {
                constructor(e) {
                    super(e),
                    e.animationState || (e.animationState = Di(e))
                }
                updateAnimationControlsSubscription() {
                    const {animate: e} = this.node.getProps();
                    Ln(e) && (this.unmountControls = e.subscribe(this.node))
                }
                mount() {
                    this.updateAnimationControlsSubscription()
                }
                update() {
                    const {animate: e} = this.node.getProps()
                      , {animate: t} = this.node.prevProps || {};
                    e !== t && this.updateAnimationControlsSubscription()
                }
                unmount() {
                    this.node.animationState.reset(),
                    this.unmountControls?.()
                }
            }
        },
        exit: {
            Feature: class extends zi {
                constructor() {
                    super(...arguments),
                    this.id = Vi++
                }
                update() {
                    if (!this.node.presenceContext)
                        return;
                    const {isPresent: e, onExitComplete: t} = this.node.presenceContext
                      , {isPresent: n} = this.node.prevPresenceContext || {};
                    if (!this.node.animationState || e === n)
                        return;
                    const r = this.node.animationState.setActive("exit", !e);
                    t && !e && r.then( () => {
                        t(this.id)
                    }
                    )
                }
                mount() {
                    const {register: e, onExitComplete: t} = this.node.presenceContext || {};
                    t && t(this.id),
                    e && (this.unmount = e(this.id))
                }
                unmount() {}
            }
        }
    }
      , Ii = {
        x: !1,
        y: !1
    };
    function Ui() {
        return Ii.x || Ii.y
    }
    function Bi(e, t, n, r={
        passive: !0
    }) {
        return e.addEventListener(t, n, r),
        () => e.removeEventListener(t, n)
    }
    const $i = e => "mouse" === e.pointerType ? "number" != typeof e.button || e.button <= 0 : !1 !== e.isPrimary;
    function Wi(e) {
        return {
            point: {
                x: e.pageX,
                y: e.pageY
            }
        }
    }
    function Hi(e, t, n, r) {
        return Bi(e, t, (e => t => $i(t) && e(t, Wi(t)))(n), r)
    }
    function Yi(e) {
        return e.max - e.min
    }
    function Ki(e, t, n, r=.5) {
        e.origin = r,
        e.originPoint = Le(t.min, t.max, e.origin),
        e.scale = Yi(n) / Yi(t),
        e.translate = Le(n.min, n.max, e.origin) - e.originPoint,
        (e.scale >= .9999 && e.scale <= 1.0001 || isNaN(e.scale)) && (e.scale = 1),
        (e.translate >= -.01 && e.translate <= .01 || isNaN(e.translate)) && (e.translate = 0)
    }
    function Qi(e, t, n, r) {
        Ki(e.x, t.x, n.x, r ? r.originX : void 0),
        Ki(e.y, t.y, n.y, r ? r.originY : void 0)
    }
    function qi(e, t, n) {
        e.min = n.min + t.min,
        e.max = e.min + Yi(t)
    }
    function Xi(e, t, n) {
        e.min = t.min - n.min,
        e.max = e.min + Yi(t)
    }
    function Gi(e, t, n) {
        Xi(e.x, t.x, n.x),
        Xi(e.y, t.y, n.y)
    }
    function Zi(e) {
        return [e("x"), e("y")]
    }
    const Ji = ({current: e}) => e ? e.ownerDocument.defaultView : null
      , eo = (e, t) => Math.abs(e - t);
    class to {
        constructor(e, t, {transformPagePoint: n, contextWindow: r=window, dragSnapToOrigin: a=!1, distanceThreshold: i=3}={}) {
            if (this.startEvent = null,
            this.lastMoveEvent = null,
            this.lastMoveEventInfo = null,
            this.handlers = {},
            this.contextWindow = window,
            this.updatePoint = () => {
                if (!this.lastMoveEvent || !this.lastMoveEventInfo)
                    return;
                const e = ao(this.lastMoveEventInfo, this.history)
                  , t = null !== this.startEvent
                  , n = function(e, t) {
                    const n = eo(e.x, t.x)
                      , r = eo(e.y, t.y);
                    return Math.sqrt(n ** 2 + r ** 2)
                }(e.offset, {
                    x: 0,
                    y: 0
                }) >= this.distanceThreshold;
                if (!t && !n)
                    return;
                const {point: r} = e
                  , {timestamp: a} = St;
                this.history.push({
                    ...r,
                    timestamp: a
                });
                const {onStart: i, onMove: o} = this.handlers;
                t || (i && i(this.lastMoveEvent, e),
                this.startEvent = this.lastMoveEvent),
                o && o(this.lastMoveEvent, e)
            }
            ,
            this.handlePointerMove = (e, t) => {
                this.lastMoveEvent = e,
                this.lastMoveEventInfo = no(t, this.transformPagePoint),
                Nt.update(this.updatePoint, !0)
            }
            ,
            this.handlePointerUp = (e, t) => {
                this.end();
                const {onEnd: n, onSessionEnd: r, resumeAnimation: a} = this.handlers;
                if (this.dragSnapToOrigin && a && a(),
                !this.lastMoveEvent || !this.lastMoveEventInfo)
                    return;
                const i = ao("pointercancel" === e.type ? this.lastMoveEventInfo : no(t, this.transformPagePoint), this.history);
                this.startEvent && n && n(e, i),
                r && r(e, i)
            }
            ,
            !$i(e))
                return;
            this.dragSnapToOrigin = a,
            this.handlers = t,
            this.transformPagePoint = n,
            this.distanceThreshold = i,
            this.contextWindow = r || window;
            const o = no(Wi(e), this.transformPagePoint)
              , {point: s} = o
              , {timestamp: l} = St;
            this.history = [{
                ...s,
                timestamp: l
            }];
            const {onSessionStart: u} = t;
            u && u(e, ao(o, this.history)),
            this.removeListeners = Gr(Hi(this.contextWindow, "pointermove", this.handlePointerMove), Hi(this.contextWindow, "pointerup", this.handlePointerUp), Hi(this.contextWindow, "pointercancel", this.handlePointerUp))
        }
        updateHandlers(e) {
            this.handlers = e
        }
        end() {
            this.removeListeners && this.removeListeners(),
            kt(this.updatePoint)
        }
    }
    function no(e, t) {
        return t ? {
            point: t(e.point)
        } : e
    }
    function ro(e, t) {
        return {
            x: e.x - t.x,
            y: e.y - t.y
        }
    }
    function ao({point: e}, t) {
        return {
            point: e,
            delta: ro(e, oo(t)),
            offset: ro(e, io(t)),
            velocity: so(t, .1)
        }
    }
    function io(e) {
        return e[0]
    }
    function oo(e) {
        return e[e.length - 1]
    }
    function so(e, t) {
        if (e.length < 2)
            return {
                x: 0,
                y: 0
            };
        let n = e.length - 1
          , r = null;
        const a = oo(e);
        for (; n >= 0 && (r = e[n],
        !(a.timestamp - r.timestamp > Zr(t))); )
            n--;
        if (!r)
            return {
                x: 0,
                y: 0
            };
        const i = Jr(a.timestamp - r.timestamp);
        if (0 === i)
            return {
                x: 0,
                y: 0
            };
        const o = {
            x: (a.x - r.x) / i,
            y: (a.y - r.y) / i
        };
        return o.x === 1 / 0 && (o.x = 0),
        o.y === 1 / 0 && (o.y = 0),
        o
    }
    function lo(e, t, n) {
        return {
            min: void 0 !== t ? e.min + t : void 0,
            max: void 0 !== n ? e.max + n - (e.max - e.min) : void 0
        }
    }
    function uo(e, t) {
        let n = t.min - e.min
          , r = t.max - e.max;
        return t.max - t.min < e.max - e.min && ([n,r] = [r, n]),
        {
            min: n,
            max: r
        }
    }
    const co = .35;
    function mo(e, t, n) {
        return {
            min: fo(e, t),
            max: fo(e, n)
        }
    }
    function fo(e, t) {
        return "number" == typeof e ? e : e[t] || 0
    }
    const ho = new WeakMap;
    class po {
        constructor(e) {
            this.openDragLock = null,
            this.isDragging = !1,
            this.currentDirection = null,
            this.originPoint = {
                x: 0,
                y: 0
            },
            this.constraints = !1,
            this.hasMutatedConstraints = !1,
            this.elastic = {
                x: {
                    min: 0,
                    max: 0
                },
                y: {
                    min: 0,
                    max: 0
                }
            },
            this.latestPointerEvent = null,
            this.latestPanInfo = null,
            this.visualElement = e
        }
        start(e, {snapToCursor: t=!1, distanceThreshold: n}={}) {
            const {presenceContext: r} = this.visualElement;
            if (r && !1 === r.isPresent)
                return;
            const {dragSnapToOrigin: a} = this.getProps();
            this.panSession = new to(e,{
                onSessionStart: e => {
                    const {dragSnapToOrigin: n} = this.getProps();
                    n ? this.pauseAnimation() : this.stopAnimation(),
                    t && this.snapToCursor(Wi(e).point)
                }
                ,
                onStart: (e, t) => {
                    const {drag: n, dragPropagation: r, onDragStart: a} = this.getProps();
                    if (n && !r && (this.openDragLock && this.openDragLock(),
                    this.openDragLock = "x" === (i = n) || "y" === i ? Ii[i] ? null : (Ii[i] = !0,
                    () => {
                        Ii[i] = !1
                    }
                    ) : Ii.x || Ii.y ? null : (Ii.x = Ii.y = !0,
                    () => {
                        Ii.x = Ii.y = !1
                    }
                    ),
                    !this.openDragLock))
                        return;
                    var i;
                    this.latestPointerEvent = e,
                    this.latestPanInfo = t,
                    this.isDragging = !0,
                    this.currentDirection = null,
                    this.resolveConstraints(),
                    this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0,
                    this.visualElement.projection.target = void 0),
                    Zi(e => {
                        let t = this.getAxisMotionValue(e).get() || 0;
                        if (rt.test(t)) {
                            const {projection: n} = this.visualElement;
                            if (n && n.layout) {
                                const r = n.layout.layoutBox[e];
                                r && (t = Yi(r) * (parseFloat(t) / 100))
                            }
                        }
                        this.originPoint[e] = t
                    }
                    ),
                    a && Nt.postRender( () => a(e, t)),
                    Kr(this.visualElement, "transform");
                    const {animationState: o} = this.visualElement;
                    o && o.setActive("whileDrag", !0)
                }
                ,
                onMove: (e, t) => {
                    this.latestPointerEvent = e,
                    this.latestPanInfo = t;
                    const {dragPropagation: n, dragDirectionLock: r, onDirectionLock: a, onDrag: i} = this.getProps();
                    if (!n && !this.openDragLock)
                        return;
                    const {offset: o} = t;
                    if (r && null === this.currentDirection)
                        return this.currentDirection = function(e, t=10) {
                            let n = null;
                            return Math.abs(e.y) > t ? n = "y" : Math.abs(e.x) > t && (n = "x"),
                            n
                        }(o),
                        void (null !== this.currentDirection && a && a(this.currentDirection));
                    this.updateAxis("x", t.point, o),
                    this.updateAxis("y", t.point, o),
                    this.visualElement.render(),
                    i && i(e, t)
                }
                ,
                onSessionEnd: (e, t) => {
                    this.latestPointerEvent = e,
                    this.latestPanInfo = t,
                    this.stop(e, t),
                    this.latestPointerEvent = null,
                    this.latestPanInfo = null
                }
                ,
                resumeAnimation: () => Zi(e => "paused" === this.getAnimationState(e) && this.getAxisMotionValue(e).animation?.play())
            },{
                transformPagePoint: this.visualElement.getTransformPagePoint(),
                dragSnapToOrigin: a,
                distanceThreshold: n,
                contextWindow: Ji(this.visualElement)
            })
        }
        stop(e, t) {
            const n = e || this.latestPointerEvent
              , r = t || this.latestPanInfo
              , a = this.isDragging;
            if (this.cancel(),
            !a || !r || !n)
                return;
            const {velocity: i} = r;
            this.startAnimation(i);
            const {onDragEnd: o} = this.getProps();
            o && Nt.postRender( () => o(n, r))
        }
        cancel() {
            this.isDragging = !1;
            const {projection: e, animationState: t} = this.visualElement;
            e && (e.isAnimationBlocked = !1),
            this.panSession && this.panSession.end(),
            this.panSession = void 0;
            const {dragPropagation: n} = this.getProps();
            !n && this.openDragLock && (this.openDragLock(),
            this.openDragLock = null),
            t && t.setActive("whileDrag", !1)
        }
        updateAxis(e, t, n) {
            const {drag: r} = this.getProps();
            if (!n || !go(e, r, this.currentDirection))
                return;
            const a = this.getAxisMotionValue(e);
            let i = this.originPoint[e] + n[e];
            this.constraints && this.constraints[e] && (i = function(e, {min: t, max: n}, r) {
                return void 0 !== t && e < t ? e = r ? Le(t, e, r.min) : Math.max(e, t) : void 0 !== n && e > n && (e = r ? Le(n, e, r.max) : Math.min(e, n)),
                e
            }(i, this.constraints[e], this.elastic[e])),
            a.set(i)
        }
        resolveConstraints() {
            const {dragConstraints: e, dragElastic: t} = this.getProps()
              , n = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : this.visualElement.projection?.layout
              , r = this.constraints;
            e && Rr(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : this.constraints = !(!e || !n) && function(e, {top: t, left: n, bottom: r, right: a}) {
                return {
                    x: lo(e.x, n, a),
                    y: lo(e.y, t, r)
                }
            }(n.layoutBox, e),
            this.elastic = function(e=co) {
                return !1 === e ? e = 0 : !0 === e && (e = co),
                {
                    x: mo(e, "left", "right"),
                    y: mo(e, "top", "bottom")
                }
            }(t),
            r !== this.constraints && n && this.constraints && !this.hasMutatedConstraints && Zi(e => {
                !1 !== this.constraints && this.getAxisMotionValue(e) && (this.constraints[e] = function(e, t) {
                    const n = {};
                    return void 0 !== t.min && (n.min = t.min - e.min),
                    void 0 !== t.max && (n.max = t.max - e.min),
                    n
                }(n.layoutBox[e], this.constraints[e]))
            }
            )
        }
        resolveRefConstraints() {
            const {dragConstraints: e, onMeasureDragConstraints: t} = this.getProps();
            if (!e || !Rr(e))
                return !1;
            const n = e.current
              , {projection: r} = this.visualElement;
            if (!r || !r.layout)
                return !1;
            const a = function(e, t, n) {
                const r = qe(e, n)
                  , {scroll: a} = t;
                return a && (Ye(r.x, a.offset.x),
                Ye(r.y, a.offset.y)),
                r
            }(n, r.root, this.visualElement.getTransformPagePoint());
            let i = function(e, t) {
                return {
                    x: uo(e.x, t.x),
                    y: uo(e.y, t.y)
                }
            }(r.layout.layoutBox, a);
            if (t) {
                const e = t(function({x: e, y: t}) {
                    return {
                        top: t.min,
                        right: e.max,
                        bottom: t.max,
                        left: e.min
                    }
                }(i));
                this.hasMutatedConstraints = !!e,
                e && (i = De(e))
            }
            return i
        }
        startAnimation(e) {
            const {drag: t, dragMomentum: n, dragElastic: r, dragTransition: a, dragSnapToOrigin: i, onDragTransitionEnd: o} = this.getProps()
              , s = this.constraints || {}
              , l = Zi(o => {
                if (!go(o, t, this.currentDirection))
                    return;
                let l = s && s[o] || {};
                i && (l = {
                    min: 0,
                    max: 0
                });
                const u = r ? 200 : 1e6
                  , c = r ? 40 : 1e7
                  , d = {
                    type: "inertia",
                    velocity: n ? e[o] : 0,
                    bounceStiffness: u,
                    bounceDamping: c,
                    timeConstant: 750,
                    restDelta: 1,
                    restSpeed: 10,
                    ...a,
                    ...l
                };
                return this.startAxisValueAnimation(o, d)
            }
            );
            return Promise.all(l).then(o)
        }
        startAxisValueAnimation(e, t) {
            const n = this.getAxisMotionValue(e);
            return Kr(this.visualElement, e),
            n.start(Ni(e, n, 0, t, this.visualElement, !1))
        }
        stopAnimation() {
            Zi(e => this.getAxisMotionValue(e).stop())
        }
        pauseAnimation() {
            Zi(e => this.getAxisMotionValue(e).animation?.pause())
        }
        getAnimationState(e) {
            return this.getAxisMotionValue(e).animation?.state
        }
        getAxisMotionValue(e) {
            const t = `_drag${e.toUpperCase()}`
              , n = this.visualElement.getProps();
            return n[t] || this.visualElement.getValue(e, (n.initial ? n.initial[e] : void 0) || 0)
        }
        snapToCursor(e) {
            Zi(t => {
                const {drag: n} = this.getProps();
                if (!go(t, n, this.currentDirection))
                    return;
                const {projection: r} = this.visualElement
                  , a = this.getAxisMotionValue(t);
                if (r && r.layout) {
                    const {min: n, max: i} = r.layout.layoutBox[t];
                    a.set(e[t] - Le(n, i, .5))
                }
            }
            )
        }
        scalePositionWithinConstraints() {
            if (!this.visualElement.current)
                return;
            const {drag: e, dragConstraints: t} = this.getProps()
              , {projection: n} = this.visualElement;
            if (!Rr(t) || !n || !this.constraints)
                return;
            this.stopAnimation();
            const r = {
                x: 0,
                y: 0
            };
            Zi(e => {
                const t = this.getAxisMotionValue(e);
                if (t && !1 !== this.constraints) {
                    const n = t.get();
                    r[e] = function(e, t) {
                        let n = .5;
                        const r = Yi(e)
                          , a = Yi(t);
                        return a > r ? n = Ka(t.min, t.max - r, e.min) : r > a && (n = Ka(e.min, e.max - a, t.min)),
                        Ge(0, 1, n)
                    }({
                        min: n,
                        max: n
                    }, this.constraints[e])
                }
            }
            );
            const {transformTemplate: a} = this.visualElement.getProps();
            this.visualElement.current.style.transform = a ? a({}, "") : "none",
            n.root && n.root.updateScroll(),
            n.updateLayout(),
            this.resolveConstraints(),
            Zi(t => {
                if (!go(t, e, null))
                    return;
                const n = this.getAxisMotionValue(t)
                  , {min: a, max: i} = this.constraints[t];
                n.set(Le(a, i, r[t]))
            }
            )
        }
        addListeners() {
            if (!this.visualElement.current)
                return;
            ho.set(this.visualElement, this);
            const e = Hi(this.visualElement.current, "pointerdown", e => {
                const {drag: t, dragListener: n=!0} = this.getProps();
                t && n && this.start(e)
            }
            )
              , t = () => {
                const {dragConstraints: e} = this.getProps();
                Rr(e) && e.current && (this.constraints = this.resolveRefConstraints())
            }
              , {projection: n} = this.visualElement
              , r = n.addEventListener("measure", t);
            n && !n.layout && (n.root && n.root.updateScroll(),
            n.updateLayout()),
            Nt.read(t);
            const a = Bi(window, "resize", () => this.scalePositionWithinConstraints())
              , i = n.addEventListener("didUpdate", ({delta: e, hasLayoutChanged: t}) => {
                this.isDragging && t && (Zi(t => {
                    const n = this.getAxisMotionValue(t);
                    n && (this.originPoint[t] += e[t].translate,
                    n.set(n.get() + e[t].translate))
                }
                ),
                this.visualElement.render())
            }
            );
            return () => {
                a(),
                e(),
                r(),
                i && i()
            }
        }
        getProps() {
            const e = this.visualElement.getProps()
              , {drag: t=!1, dragDirectionLock: n=!1, dragPropagation: r=!1, dragConstraints: a=!1, dragElastic: i=co, dragMomentum: o=!0} = e;
            return {
                ...e,
                drag: t,
                dragDirectionLock: n,
                dragPropagation: r,
                dragConstraints: a,
                dragElastic: i,
                dragMomentum: o
            }
        }
    }
    function go(e, t, n) {
        return !(!0 !== t && t !== e || null !== n && n !== e)
    }
    const yo = e => (t, n) => {
        e && Nt.postRender( () => e(t, n))
    }
      , bo = {
        hasAnimatedSinceResize: !0,
        hasEverUpdated: !1
    };
    function vo(e, t) {
        return t.max === t.min ? 0 : e / (t.max - t.min) * 100
    }
    const wo = {
        correct: (e, t) => {
            if (!t.target)
                return e;
            if ("string" == typeof e) {
                if (!at.test(e))
                    return e;
                e = parseFloat(e)
            }
            return `${vo(e, t.target.x)}% ${vo(e, t.target.y)}%`
        }
    }
      , xo = {
        correct: (e, {treeScale: t, projectionDelta: n}) => {
            const r = e
              , a = en.parse(e);
            if (a.length > 5)
                return r;
            const i = en.createTransformer(e)
              , o = "number" != typeof a[0] ? 1 : 0
              , s = n.x.scale * t.x
              , l = n.y.scale * t.y;
            a[0 + o] /= s,
            a[1 + o] /= l;
            const u = Le(s, l, .5);
            return "number" == typeof a[2 + o] && (a[2 + o] /= u),
            "number" == typeof a[3 + o] && (a[3 + o] /= u),
            i(a)
        }
    };
    let _o = !1;
    class No extends o.Component {
        componentDidMount() {
            const {visualElement: e, layoutGroup: t, switchLayoutGroup: n, layoutId: r} = this.props
              , {projection: a} = e;
            !function(e) {
                for (const t in e)
                    Xn[t] = e[t],
                    Te(t) && (Xn[t].isCSSVariable = !0)
            }(So),
            a && (t.group && t.group.add(a),
            n && n.register && r && n.register(a),
            _o && a.root.didUpdate(),
            a.addEventListener("animationComplete", () => {
                this.safeToRemove()
            }
            ),
            a.setOptions({
                ...a.options,
                onExitComplete: () => this.safeToRemove()
            })),
            bo.hasEverUpdated = !0
        }
        getSnapshotBeforeUpdate(e) {
            const {layoutDependency: t, visualElement: n, drag: r, isPresent: a} = this.props
              , {projection: i} = n;
            return i ? (i.isPresent = a,
            _o = !0,
            r || e.layoutDependency !== t || void 0 === t || e.isPresent !== a ? i.willUpdate() : this.safeToRemove(),
            e.isPresent !== a && (a ? i.promote() : i.relegate() || Nt.postRender( () => {
                const e = i.getStack();
                e && e.members.length || this.safeToRemove()
            }
            )),
            null) : null
        }
        componentDidUpdate() {
            const {projection: e} = this.props.visualElement;
            e && (e.root.didUpdate(),
            Sn.postRender( () => {
                !e.currentAnimation && e.isLead() && this.safeToRemove()
            }
            ))
        }
        componentWillUnmount() {
            const {visualElement: e, layoutGroup: t, switchLayoutGroup: n} = this.props
              , {projection: r} = e;
            _o = !0,
            r && (r.scheduleCheckAfterUnmount(),
            t && t.group && t.group.remove(r),
            n && n.deregister && n.deregister(r))
        }
        safeToRemove() {
            const {safeToRemove: e} = this.props;
            e && e()
        }
        render() {
            return null
        }
    }
    function ko(e) {
        const [t,n] = function(e=!0) {
            const t = (0,
            o.useContext)(Sr);
            if (null === t)
                return [!0, null];
            const {isPresent: n, onExitComplete: r, register: a} = t
              , i = (0,
            o.useId)();
            (0,
            o.useEffect)( () => {
                if (e)
                    return a(i)
            }
            , [e]);
            const s = (0,
            o.useCallback)( () => e && r && r(i), [i, r, e]);
            return !n && r ? [!1, s] : [!0]
        }()
          , r = (0,
        o.useContext)(mr);
        return (0,
        dr.jsx)(No, {
            ...e,
            layoutGroup: r,
            switchLayoutGroup: (0,
            o.useContext)(Or),
            isPresent: t,
            safeToRemove: n
        })
    }
    const So = {
        borderRadius: {
            ...wo,
            applyTo: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]
        },
        borderTopLeftRadius: wo,
        borderTopRightRadius: wo,
        borderBottomLeftRadius: wo,
        borderBottomRightRadius: wo,
        boxShadow: xo
    };
    function Eo(e) {
        return "object" == typeof e && null !== e
    }
    function Po(e) {
        return Eo(e) && "ownerSVGElement"in e
    }
    const Co = (e, t) => e.depth - t.depth;
    class To {
        constructor() {
            this.children = [],
            this.isDirty = !1
        }
        add(e) {
            yn(this.children, e),
            this.isDirty = !0
        }
        remove(e) {
            bn(this.children, e),
            this.isDirty = !0
        }
        forEach(e) {
            this.isDirty && this.children.sort(Co),
            this.isDirty = !1,
            this.children.forEach(e)
        }
    }
    const Mo = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"]
      , Ao = Mo.length
      , Ro = e => "string" == typeof e ? parseFloat(e) : e
      , Do = e => "number" == typeof e || at.test(e);
    function Lo(e, t) {
        return void 0 !== e[t] ? e[t] : e.borderRadius
    }
    const Oo = zo(0, .5, Ba)
      , jo = zo(.5, .95, bt);
    function zo(e, t, n) {
        return r => r < e ? 0 : r > t ? 1 : n(Ka(e, t, r))
    }
    function Vo(e, t) {
        e.min = t.min,
        e.max = t.max
    }
    function Fo(e, t) {
        Vo(e.x, t.x),
        Vo(e.y, t.y)
    }
    function Io(e, t) {
        e.translate = t.translate,
        e.scale = t.scale,
        e.originPoint = t.originPoint,
        e.origin = t.origin
    }
    function Uo(e, t, n, r, a) {
        return e = Ie(e -= t, 1 / n, r),
        void 0 !== a && (e = Ie(e, 1 / a, r)),
        e
    }
    function Bo(e, t, [n,r,a], i, o) {
        !function(e, t=0, n=1, r=.5, a, i=e, o=e) {
            if (rt.test(t) && (t = parseFloat(t),
            t = Le(o.min, o.max, t / 100) - o.min),
            "number" != typeof t)
                return;
            let s = Le(i.min, i.max, r);
            e === i && (s -= t),
            e.min = Uo(e.min, t, n, s, a),
            e.max = Uo(e.max, t, n, s, a)
        }(e, t[n], t[r], t[a], t.scale, i, o)
    }
    const $o = ["x", "scaleX", "originX"]
      , Wo = ["y", "scaleY", "originY"];
    function Ho(e, t, n, r) {
        Bo(e.x, t, $o, n ? n.x : void 0, r ? r.x : void 0),
        Bo(e.y, t, Wo, n ? n.y : void 0, r ? r.y : void 0)
    }
    function Yo(e) {
        return 0 === e.translate && 1 === e.scale
    }
    function Ko(e) {
        return Yo(e.x) && Yo(e.y)
    }
    function Qo(e, t) {
        return e.min === t.min && e.max === t.max
    }
    function qo(e, t) {
        return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max)
    }
    function Xo(e, t) {
        return qo(e.x, t.x) && qo(e.y, t.y)
    }
    function Go(e) {
        return Yi(e.x) / Yi(e.y)
    }
    function Zo(e, t) {
        return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint
    }
    class Jo {
        constructor() {
            this.members = []
        }
        add(e) {
            yn(this.members, e),
            e.scheduleRender()
        }
        remove(e) {
            if (bn(this.members, e),
            e === this.prevLead && (this.prevLead = void 0),
            e === this.lead) {
                const e = this.members[this.members.length - 1];
                e && this.promote(e)
            }
        }
        relegate(e) {
            const t = this.members.findIndex(t => e === t);
            if (0 === t)
                return !1;
            let n;
            for (let e = t; e >= 0; e--) {
                const t = this.members[e];
                if (!1 !== t.isPresent) {
                    n = t;
                    break
                }
            }
            return !!n && (this.promote(n),
            !0)
        }
        promote(e, t) {
            const n = this.lead;
            if (e !== n && (this.prevLead = n,
            this.lead = e,
            e.show(),
            n)) {
                n.instance && n.scheduleRender(),
                e.scheduleRender(),
                e.resumeFrom = n,
                t && (e.resumeFrom.preserveOpacity = !0),
                n.snapshot && (e.snapshot = n.snapshot,
                e.snapshot.latestValues = n.animationValues || n.latestValues),
                e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
                const {crossfade: r} = e.options;
                !1 === r && n.hide()
            }
        }
        exitAnimationComplete() {
            this.members.forEach(e => {
                const {options: t, resumingFrom: n} = e;
                t.onExitComplete && t.onExitComplete(),
                n && n.options.onExitComplete && n.options.onExitComplete()
            }
            )
        }
        scheduleRender() {
            this.members.forEach(e => {
                e.instance && e.scheduleRender(!1)
            }
            )
        }
        removeLeadSnapshot() {
            this.lead && this.lead.snapshot && (this.lead.snapshot = void 0)
        }
    }
    const es = {
        nodes: 0,
        calculatedTargetDeltas: 0,
        calculatedProjections: 0
    }
      , ts = ["", "X", "Y", "Z"];
    let ns = 0;
    function rs(e, t, n, r) {
        const {latestValues: a} = t;
        a[e] && (n[e] = a[e],
        t.setStaticValue(e, 0),
        r && (r[e] = 0))
    }
    function as(e) {
        if (e.hasCheckedOptimisedAppear = !0,
        e.root === e)
            return;
        const {visualElement: t} = e.options;
        if (!t)
            return;
        const n = Qr(t);
        if (window.MotionHasOptimisedAnimation(n, "transform")) {
            const {layout: t, layoutId: r} = e.options;
            window.MotionCancelOptimisedAnimation(n, "transform", Nt, !(t || r))
        }
        const {parent: r} = e;
        r && !r.hasCheckedOptimisedAppear && as(r)
    }
    function is({attachResizeListener: e, defaultParent: t, measureScroll: n, checkIsScrollRoot: r, resetTransform: a}) {
        return class {
            constructor(e={}, n=t?.()) {
                this.id = ns++,
                this.animationId = 0,
                this.animationCommitId = 0,
                this.children = new Set,
                this.options = {},
                this.isTreeAnimating = !1,
                this.isAnimationBlocked = !1,
                this.isLayoutDirty = !1,
                this.isProjectionDirty = !1,
                this.isSharedProjectionDirty = !1,
                this.isTransformDirty = !1,
                this.updateManuallyBlocked = !1,
                this.updateBlockedByResize = !1,
                this.isUpdating = !1,
                this.isSVG = !1,
                this.needsReset = !1,
                this.shouldResetTransform = !1,
                this.hasCheckedOptimisedAppear = !1,
                this.treeScale = {
                    x: 1,
                    y: 1
                },
                this.eventHandlers = new Map,
                this.hasTreeAnimated = !1,
                this.updateScheduled = !1,
                this.scheduleUpdate = () => this.update(),
                this.projectionUpdateScheduled = !1,
                this.checkUpdateFailed = () => {
                    this.isUpdating && (this.isUpdating = !1,
                    this.clearAllSnapshots())
                }
                ,
                this.updateProjection = () => {
                    this.projectionUpdateScheduled = !1,
                    xt.value && (es.nodes = es.calculatedTargetDeltas = es.calculatedProjections = 0),
                    this.nodes.forEach(ls),
                    this.nodes.forEach(ps),
                    this.nodes.forEach(gs),
                    this.nodes.forEach(us),
                    xt.addProjectionMetrics && xt.addProjectionMetrics(es)
                }
                ,
                this.resolvedRelativeTargetAt = 0,
                this.hasProjected = !1,
                this.isVisible = !0,
                this.animationProgress = 0,
                this.sharedNodes = new Map,
                this.latestValues = e,
                this.root = n ? n.root || n : this,
                this.path = n ? [...n.path, n] : [],
                this.parent = n,
                this.depth = n ? n.depth + 1 : 0;
                for (let e = 0; e < this.path.length; e++)
                    this.path[e].shouldResetTransform = !0;
                this.root === this && (this.nodes = new To)
            }
            addEventListener(e, t) {
                return this.eventHandlers.has(e) || this.eventHandlers.set(e, new vn),
                this.eventHandlers.get(e).add(t)
            }
            notifyListeners(e, ...t) {
                const n = this.eventHandlers.get(e);
                n && n.notify(...t)
            }
            hasListeners(e) {
                return this.eventHandlers.has(e)
            }
            mount(t) {
                if (this.instance)
                    return;
                var n;
                this.isSVG = Po(t) && !(Po(n = t) && "svg" === n.tagName),
                this.instance = t;
                const {layoutId: r, layout: a, visualElement: i} = this.options;
                if (i && !i.current && i.mount(t),
                this.root.nodes.add(this),
                this.parent && this.parent.children.add(this),
                this.root.hasTreeAnimated && (a || r) && (this.isLayoutDirty = !0),
                e) {
                    let n, r = 0;
                    const a = () => this.root.updateBlockedByResize = !1;
                    Nt.read( () => {
                        r = window.innerWidth
                    }
                    ),
                    e(t, () => {
                        const e = window.innerWidth;
                        e !== r && (r = e,
                        this.root.updateBlockedByResize = !0,
                        n && n(),
                        n = function(e, t) {
                            const n = gn.now()
                              , r = ({timestamp: a}) => {
                                const i = a - n;
                                i >= t && (kt(r),
                                e(i - t))
                            }
                            ;
                            return Nt.setup(r, !0),
                            () => kt(r)
                        }(a, 250),
                        bo.hasAnimatedSinceResize && (bo.hasAnimatedSinceResize = !1,
                        this.nodes.forEach(hs)))
                    }
                    )
                }
                r && this.root.registerSharedNode(r, this),
                !1 !== this.options.animate && i && (r || a) && this.addEventListener("didUpdate", ({delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: n, layout: r}) => {
                    if (this.isTreeAnimationBlocked())
                        return this.target = void 0,
                        void (this.relativeTarget = void 0);
                    const a = this.options.transition || i.getDefaultTransition() || _s
                      , {onLayoutAnimationStart: o, onLayoutAnimationComplete: s} = i.getProps()
                      , l = !this.targetLayout || !Xo(this.targetLayout, r)
                      , u = !t && n;
                    if (this.options.layoutRoot || this.resumeFrom || u || t && (l || !this.currentAnimation)) {
                        this.resumeFrom && (this.resumingFrom = this.resumeFrom,
                        this.resumingFrom.resumingFrom = void 0);
                        const t = {
                            ...$r(a, "layout"),
                            onPlay: o,
                            onComplete: s
                        };
                        (i.shouldReduceMotion || this.options.layoutRoot) && (t.delay = 0,
                        t.type = !1),
                        this.startAnimation(t),
                        this.setAnimationOrigin(e, u)
                    } else
                        t || hs(this),
                        this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                    this.targetLayout = r
                }
                )
            }
            unmount() {
                this.options.layoutId && this.willUpdate(),
                this.root.nodes.remove(this);
                const e = this.getStack();
                e && e.remove(this),
                this.parent && this.parent.children.delete(this),
                this.instance = void 0,
                this.eventHandlers.clear(),
                kt(this.updateProjection)
            }
            blockUpdate() {
                this.updateManuallyBlocked = !0
            }
            unblockUpdate() {
                this.updateManuallyBlocked = !1
            }
            isUpdateBlocked() {
                return this.updateManuallyBlocked || this.updateBlockedByResize
            }
            isTreeAnimationBlocked() {
                return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1
            }
            startUpdate() {
                this.isUpdateBlocked() || (this.isUpdating = !0,
                this.nodes && this.nodes.forEach(ys),
                this.animationId++)
            }
            getTransformTemplate() {
                const {visualElement: e} = this.options;
                return e && e.getProps().transformTemplate
            }
            willUpdate(e=!0) {
                if (this.root.hasTreeAnimated = !0,
                this.root.isUpdateBlocked())
                    return void (this.options.onExitComplete && this.options.onExitComplete());
                if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && as(this),
                !this.root.isUpdating && this.root.startUpdate(),
                this.isLayoutDirty)
                    return;
                this.isLayoutDirty = !0;
                for (let e = 0; e < this.path.length; e++) {
                    const t = this.path[e];
                    t.shouldResetTransform = !0,
                    t.updateScroll("snapshot"),
                    t.options.layoutRoot && t.willUpdate(!1)
                }
                const {layoutId: t, layout: n} = this.options;
                if (void 0 === t && !n)
                    return;
                const r = this.getTransformTemplate();
                this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0,
                this.updateSnapshot(),
                e && this.notifyListeners("willUpdate")
            }
            update() {
                if (this.updateScheduled = !1,
                this.isUpdateBlocked())
                    return this.unblockUpdate(),
                    this.clearAllSnapshots(),
                    void this.nodes.forEach(ds);
                if (this.animationId <= this.animationCommitId)
                    return void this.nodes.forEach(ms);
                this.animationCommitId = this.animationId,
                this.isUpdating ? (this.isUpdating = !1,
                this.nodes.forEach(fs),
                this.nodes.forEach(os),
                this.nodes.forEach(ss)) : this.nodes.forEach(ms),
                this.clearAllSnapshots();
                const e = gn.now();
                St.delta = Ge(0, 1e3 / 60, e - St.timestamp),
                St.timestamp = e,
                St.isProcessing = !0,
                Et.update.process(St),
                Et.preRender.process(St),
                Et.render.process(St),
                St.isProcessing = !1
            }
            didUpdate() {
                this.updateScheduled || (this.updateScheduled = !0,
                Sn.read(this.scheduleUpdate))
            }
            clearAllSnapshots() {
                this.nodes.forEach(cs),
                this.sharedNodes.forEach(bs)
            }
            scheduleUpdateProjection() {
                this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0,
                Nt.preRender(this.updateProjection, !1, !0))
            }
            scheduleCheckAfterUnmount() {
                Nt.postRender( () => {
                    this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
                }
                )
            }
            updateSnapshot() {
                !this.snapshot && this.instance && (this.snapshot = this.measure(),
                !this.snapshot || Yi(this.snapshot.measuredBox.x) || Yi(this.snapshot.measuredBox.y) || (this.snapshot = void 0))
            }
            updateLayout() {
                if (!this.instance)
                    return;
                if (this.updateScroll(),
                !(this.options.alwaysMeasureLayout && this.isLead() || this.isLayoutDirty))
                    return;
                if (this.resumeFrom && !this.resumeFrom.instance)
                    for (let e = 0; e < this.path.length; e++)
                        this.path[e].updateScroll();
                const e = this.layout;
                this.layout = this.measure(!1),
                this.layoutCorrected = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                },
                this.isLayoutDirty = !1,
                this.projectionDelta = void 0,
                this.notifyListeners("measure", this.layout.layoutBox);
                const {visualElement: t} = this.options;
                t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0)
            }
            updateScroll(e="measure") {
                let t = Boolean(this.options.layoutScroll && this.instance);
                if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1),
                t && this.instance) {
                    const t = r(this.instance);
                    this.scroll = {
                        animationId: this.root.animationId,
                        phase: e,
                        isRoot: t,
                        offset: n(this.instance),
                        wasRoot: this.scroll ? this.scroll.isRoot : t
                    }
                }
            }
            resetTransform() {
                if (!a)
                    return;
                const e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout
                  , t = this.projectionDelta && !Ko(this.projectionDelta)
                  , n = this.getTransformTemplate()
                  , r = n ? n(this.latestValues, "") : void 0
                  , i = r !== this.prevTransformTemplateValue;
                e && this.instance && (t || ze(this.latestValues) || i) && (a(this.instance, r),
                this.shouldResetTransform = !1,
                this.scheduleRender())
            }
            measure(e=!0) {
                const t = this.measurePageBox();
                let n = this.removeElementScroll(t);
                var r;
                return e && (n = this.removeTransform(n)),
                Ss((r = n).x),
                Ss(r.y),
                {
                    animationId: this.root.animationId,
                    measuredBox: t,
                    layoutBox: n,
                    latestValues: {},
                    source: this.id
                }
            }
            measurePageBox() {
                const {visualElement: e} = this.options;
                if (!e)
                    return {
                        x: {
                            min: 0,
                            max: 0
                        },
                        y: {
                            min: 0,
                            max: 0
                        }
                    };
                const t = e.measureViewportBox();
                if (!this.scroll?.wasRoot && !this.path.some(Ps)) {
                    const {scroll: e} = this.root;
                    e && (Ye(t.x, e.offset.x),
                    Ye(t.y, e.offset.y))
                }
                return t
            }
            removeElementScroll(e) {
                const t = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                };
                if (Fo(t, e),
                this.scroll?.wasRoot)
                    return t;
                for (let n = 0; n < this.path.length; n++) {
                    const r = this.path[n]
                      , {scroll: a, options: i} = r;
                    r !== this.root && a && i.layoutScroll && (a.wasRoot && Fo(t, e),
                    Ye(t.x, a.offset.x),
                    Ye(t.y, a.offset.y))
                }
                return t
            }
            applyTransform(e, t=!1) {
                const n = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                };
                Fo(n, e);
                for (let e = 0; e < this.path.length; e++) {
                    const r = this.path[e];
                    !t && r.options.layoutScroll && r.scroll && r !== r.root && Qe(n, {
                        x: -r.scroll.offset.x,
                        y: -r.scroll.offset.y
                    }),
                    ze(r.latestValues) && Qe(n, r.latestValues)
                }
                return ze(this.latestValues) && Qe(n, this.latestValues),
                n
            }
            removeTransform(e) {
                const t = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                };
                Fo(t, e);
                for (let e = 0; e < this.path.length; e++) {
                    const n = this.path[e];
                    if (!n.instance)
                        continue;
                    if (!ze(n.latestValues))
                        continue;
                    je(n.latestValues) && n.updateSnapshot();
                    const r = Tn();
                    Fo(r, n.measurePageBox()),
                    Ho(t, n.latestValues, n.snapshot ? n.snapshot.layoutBox : void 0, r)
                }
                return ze(this.latestValues) && Ho(t, this.latestValues),
                t
            }
            setTargetDelta(e) {
                this.targetDelta = e,
                this.root.scheduleUpdateProjection(),
                this.isProjectionDirty = !0
            }
            setOptions(e) {
                this.options = {
                    ...this.options,
                    ...e,
                    crossfade: void 0 === e.crossfade || e.crossfade
                }
            }
            clearMeasurements() {
                this.scroll = void 0,
                this.layout = void 0,
                this.snapshot = void 0,
                this.prevTransformTemplateValue = void 0,
                this.targetDelta = void 0,
                this.target = void 0,
                this.isLayoutDirty = !1
            }
            forceRelativeParentToResolveTarget() {
                this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== St.timestamp && this.relativeParent.resolveTargetDelta(!0)
            }
            resolveTargetDelta(e=!1) {
                const t = this.getLead();
                this.isProjectionDirty || (this.isProjectionDirty = t.isProjectionDirty),
                this.isTransformDirty || (this.isTransformDirty = t.isTransformDirty),
                this.isSharedProjectionDirty || (this.isSharedProjectionDirty = t.isSharedProjectionDirty);
                const n = Boolean(this.resumingFrom) || this !== t;
                if (!(e || n && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
                    return;
                const {layout: r, layoutId: a} = this.options;
                if (this.layout && (r || a)) {
                    if (this.resolvedRelativeTargetAt = St.timestamp,
                    !this.targetDelta && !this.relativeTarget) {
                        const e = this.getClosestProjectingParent();
                        e && e.layout && 1 !== this.animationProgress ? (this.relativeParent = e,
                        this.forceRelativeParentToResolveTarget(),
                        this.relativeTarget = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        },
                        this.relativeTargetOrigin = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        },
                        Gi(this.relativeTargetOrigin, this.layout.layoutBox, e.layout.layoutBox),
                        Fo(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                    }
                    if (this.relativeTarget || this.targetDelta) {
                        var i, o, s;
                        if (this.target || (this.target = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        },
                        this.targetWithTransforms = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        }),
                        this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(),
                        i = this.target,
                        o = this.relativeTarget,
                        s = this.relativeParent.target,
                        qi(i.x, o.x, s.x),
                        qi(i.y, o.y, s.y)) : this.targetDelta ? (Boolean(this.resumingFrom) ? this.target = this.applyTransform(this.layout.layoutBox) : Fo(this.target, this.layout.layoutBox),
                        $e(this.target, this.targetDelta)) : Fo(this.target, this.layout.layoutBox),
                        this.attemptToResolveRelativeTarget) {
                            this.attemptToResolveRelativeTarget = !1;
                            const e = this.getClosestProjectingParent();
                            e && Boolean(e.resumingFrom) === Boolean(this.resumingFrom) && !e.options.layoutScroll && e.target && 1 !== this.animationProgress ? (this.relativeParent = e,
                            this.forceRelativeParentToResolveTarget(),
                            this.relativeTarget = {
                                x: {
                                    min: 0,
                                    max: 0
                                },
                                y: {
                                    min: 0,
                                    max: 0
                                }
                            },
                            this.relativeTargetOrigin = {
                                x: {
                                    min: 0,
                                    max: 0
                                },
                                y: {
                                    min: 0,
                                    max: 0
                                }
                            },
                            Gi(this.relativeTargetOrigin, this.target, e.target),
                            Fo(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0
                        }
                        xt.value && es.calculatedTargetDeltas++
                    }
                }
            }
            getClosestProjectingParent() {
                if (this.parent && !je(this.parent.latestValues) && !Ve(this.parent.latestValues))
                    return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent()
            }
            isProjecting() {
                return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
            }
            calcProjection() {
                const e = this.getLead()
                  , t = Boolean(this.resumingFrom) || this !== e;
                let n = !0;
                if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (n = !1),
                t && (this.isSharedProjectionDirty || this.isTransformDirty) && (n = !1),
                this.resolvedRelativeTargetAt === St.timestamp && (n = !1),
                n)
                    return;
                const {layout: r, layoutId: a} = this.options;
                if (this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation),
                this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
                !this.layout || !r && !a)
                    return;
                Fo(this.layoutCorrected, this.layout.layoutBox);
                const i = this.treeScale.x
                  , o = this.treeScale.y;
                !function(e, t, n, r=!1) {
                    const a = n.length;
                    if (!a)
                        return;
                    let i, o;
                    t.x = t.y = 1;
                    for (let s = 0; s < a; s++) {
                        i = n[s],
                        o = i.projectionDelta;
                        const {visualElement: a} = i.options;
                        a && a.props.style && "contents" === a.props.style.display || (r && i.options.layoutScroll && i.scroll && i !== i.root && Qe(e, {
                            x: -i.scroll.offset.x,
                            y: -i.scroll.offset.y
                        }),
                        o && (t.x *= o.x.scale,
                        t.y *= o.y.scale,
                        $e(e, o)),
                        r && ze(i.latestValues) && Qe(e, i.latestValues))
                    }
                    t.x < He && t.x > We && (t.x = 1),
                    t.y < He && t.y > We && (t.y = 1)
                }(this.layoutCorrected, this.treeScale, this.path, t),
                !e.layout || e.target || 1 === this.treeScale.x && 1 === this.treeScale.y || (e.target = e.layout.layoutBox,
                e.targetWithTransforms = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                });
                const {target: s} = e;
                s ? (this.projectionDelta && this.prevProjectionDelta ? (Io(this.prevProjectionDelta.x, this.projectionDelta.x),
                Io(this.prevProjectionDelta.y, this.projectionDelta.y)) : this.createProjectionDeltas(),
                Qi(this.projectionDelta, this.layoutCorrected, s, this.latestValues),
                this.treeScale.x === i && this.treeScale.y === o && Zo(this.projectionDelta.x, this.prevProjectionDelta.x) && Zo(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0,
                this.scheduleRender(),
                this.notifyListeners("projectionUpdate", s)),
                xt.value && es.calculatedProjections++) : this.prevProjectionDelta && (this.createProjectionDeltas(),
                this.scheduleRender())
            }
            hide() {
                this.isVisible = !1
            }
            show() {
                this.isVisible = !0
            }
            scheduleRender(e=!0) {
                if (this.options.visualElement?.scheduleRender(),
                e) {
                    const e = this.getStack();
                    e && e.scheduleRender()
                }
                this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
            }
            createProjectionDeltas() {
                this.prevProjectionDelta = {
                    x: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    },
                    y: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    }
                },
                this.projectionDelta = {
                    x: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    },
                    y: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    }
                },
                this.projectionDeltaWithTransform = {
                    x: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    },
                    y: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    }
                }
            }
            setAnimationOrigin(e, t=!1) {
                const n = this.snapshot
                  , r = n ? n.latestValues : {}
                  , a = {
                    ...this.latestValues
                }
                  , i = {
                    x: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    },
                    y: {
                        translate: 0,
                        scale: 1,
                        origin: 0,
                        originPoint: 0
                    }
                };
                this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0),
                this.attemptToResolveRelativeTarget = !t;
                const o = {
                    x: {
                        min: 0,
                        max: 0
                    },
                    y: {
                        min: 0,
                        max: 0
                    }
                }
                  , s = (n ? n.source : void 0) !== (this.layout ? this.layout.source : void 0)
                  , l = this.getStack()
                  , u = !l || l.members.length <= 1
                  , c = Boolean(s && !u && !0 === this.options.crossfade && !this.path.some(xs));
                let d;
                this.animationProgress = 0,
                this.mixTargetDelta = t => {
                    const n = t / 1e3;
                    var l, m, f, h, p, g;
                    vs(i.x, e.x, n),
                    vs(i.y, e.y, n),
                    this.setTargetDelta(i),
                    this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Gi(o, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
                    f = this.relativeTarget,
                    h = this.relativeTargetOrigin,
                    p = o,
                    g = n,
                    ws(f.x, h.x, p.x, g),
                    ws(f.y, h.y, p.y, g),
                    d && (l = this.relativeTarget,
                    m = d,
                    Qo(l.x, m.x) && Qo(l.y, m.y)) && (this.isProjectionDirty = !1),
                    d || (d = {
                        x: {
                            min: 0,
                            max: 0
                        },
                        y: {
                            min: 0,
                            max: 0
                        }
                    }),
                    Fo(d, this.relativeTarget)),
                    s && (this.animationValues = a,
                    function(e, t, n, r, a, i) {
                        a ? (e.opacity = Le(0, n.opacity ?? 1, Oo(r)),
                        e.opacityExit = Le(t.opacity ?? 1, 0, jo(r))) : i && (e.opacity = Le(t.opacity ?? 1, n.opacity ?? 1, r));
                        for (let a = 0; a < Ao; a++) {
                            const i = `border${Mo[a]}Radius`;
                            let o = Lo(t, i)
                              , s = Lo(n, i);
                            void 0 === o && void 0 === s || (o || (o = 0),
                            s || (s = 0),
                            0 === o || 0 === s || Do(o) === Do(s) ? (e[i] = Math.max(Le(Ro(o), Ro(s), r), 0),
                            (rt.test(s) || rt.test(o)) && (e[i] += "%")) : e[i] = s)
                        }
                        (t.rotate || n.rotate) && (e.rotate = Le(t.rotate || 0, n.rotate || 0, r))
                    }(a, r, this.latestValues, n, c, u)),
                    this.root.scheduleUpdateProjection(),
                    this.scheduleRender(),
                    this.animationProgress = n
                }
                ,
                this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0)
            }
            startAnimation(e) {
                this.notifyListeners("animationStart"),
                this.currentAnimation?.stop(),
                this.resumingFrom?.currentAnimation?.stop(),
                this.pendingAnimation && (kt(this.pendingAnimation),
                this.pendingAnimation = void 0),
                this.pendingAnimation = Nt.update( () => {
                    bo.hasAnimatedSinceResize = !0,
                    ea.layout++,
                    this.motionValue || (this.motionValue = Nn(0)),
                    this.currentAnimation = function(e, t, n) {
                        const r = fn(e) ? e : Nn(e);
                        return r.start(Ni("", r, [0, 1e3], n)),
                        r.animation
                    }(this.motionValue, 0, {
                        ...e,
                        velocity: 0,
                        isSync: !0,
                        onUpdate: t => {
                            this.mixTargetDelta(t),
                            e.onUpdate && e.onUpdate(t)
                        }
                        ,
                        onStop: () => {
                            ea.layout--
                        }
                        ,
                        onComplete: () => {
                            ea.layout--,
                            e.onComplete && e.onComplete(),
                            this.completeAnimation()
                        }
                    }),
                    this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
                    this.pendingAnimation = void 0
                }
                )
            }
            completeAnimation() {
                this.resumingFrom && (this.resumingFrom.currentAnimation = void 0,
                this.resumingFrom.preserveOpacity = void 0);
                const e = this.getStack();
                e && e.exitAnimationComplete(),
                this.resumingFrom = this.currentAnimation = this.animationValues = void 0,
                this.notifyListeners("animationComplete")
            }
            finishAnimation() {
                this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(1e3),
                this.currentAnimation.stop()),
                this.completeAnimation()
            }
            applyTransformsToTarget() {
                const e = this.getLead();
                let {targetWithTransforms: t, target: n, layout: r, latestValues: a} = e;
                if (t && n && r) {
                    if (this !== e && this.layout && r && Es(this.options.animationType, this.layout.layoutBox, r.layoutBox)) {
                        n = this.target || {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        };
                        const t = Yi(this.layout.layoutBox.x);
                        n.x.min = e.target.x.min,
                        n.x.max = n.x.min + t;
                        const r = Yi(this.layout.layoutBox.y);
                        n.y.min = e.target.y.min,
                        n.y.max = n.y.min + r
                    }
                    Fo(t, n),
                    Qe(t, a),
                    Qi(this.projectionDeltaWithTransform, this.layoutCorrected, t, a)
                }
            }
            registerSharedNode(e, t) {
                this.sharedNodes.has(e) || this.sharedNodes.set(e, new Jo),
                this.sharedNodes.get(e).add(t);
                const n = t.options.initialPromotionConfig;
                t.promote({
                    transition: n ? n.transition : void 0,
                    preserveFollowOpacity: n && n.shouldPreserveFollowOpacity ? n.shouldPreserveFollowOpacity(t) : void 0
                })
            }
            isLead() {
                const e = this.getStack();
                return !e || e.lead === this
            }
            getLead() {
                const {layoutId: e} = this.options;
                return e && this.getStack()?.lead || this
            }
            getPrevLead() {
                const {layoutId: e} = this.options;
                return e ? this.getStack()?.prevLead : void 0
            }
            getStack() {
                const {layoutId: e} = this.options;
                if (e)
                    return this.root.sharedNodes.get(e)
            }
            promote({needsReset: e, transition: t, preserveFollowOpacity: n}={}) {
                const r = this.getStack();
                r && r.promote(this, n),
                e && (this.projectionDelta = void 0,
                this.needsReset = !0),
                t && this.setOptions({
                    transition: t
                })
            }
            relegate() {
                const e = this.getStack();
                return !!e && e.relegate(this)
            }
            resetSkewAndRotation() {
                const {visualElement: e} = this.options;
                if (!e)
                    return;
                let t = !1;
                const {latestValues: n} = e;
                if ((n.z || n.rotate || n.rotateX || n.rotateY || n.rotateZ || n.skewX || n.skewY) && (t = !0),
                !t)
                    return;
                const r = {};
                n.z && rs("z", e, r, this.animationValues);
                for (let t = 0; t < ts.length; t++)
                    rs(`rotate${ts[t]}`, e, r, this.animationValues),
                    rs(`skew${ts[t]}`, e, r, this.animationValues);
                e.render();
                for (const t in r)
                    e.setStaticValue(t, r[t]),
                    this.animationValues && (this.animationValues[t] = r[t]);
                e.scheduleRender()
            }
            applyProjectionStyles(e, t) {
                if (!this.instance || this.isSVG)
                    return;
                if (!this.isVisible)
                    return void (e.visibility = "hidden");
                const n = this.getTransformTemplate();
                if (this.needsReset)
                    return this.needsReset = !1,
                    e.visibility = "",
                    e.opacity = "",
                    e.pointerEvents = Er(t?.pointerEvents) || "",
                    void (e.transform = n ? n(this.latestValues, "") : "none");
                const r = this.getLead();
                if (!this.projectionDelta || !this.layout || !r.target)
                    return this.options.layoutId && (e.opacity = void 0 !== this.latestValues.opacity ? this.latestValues.opacity : 1,
                    e.pointerEvents = Er(t?.pointerEvents) || ""),
                    void (this.hasProjected && !ze(this.latestValues) && (e.transform = n ? n({}, "") : "none",
                    this.hasProjected = !1));
                e.visibility = "";
                const a = r.animationValues || r.latestValues;
                this.applyTransformsToTarget();
                let i = function(e, t, n) {
                    let r = "";
                    const a = e.x.translate / t.x
                      , i = e.y.translate / t.y
                      , o = n?.z || 0;
                    if ((a || i || o) && (r = `translate3d(${a}px, ${i}px, ${o}px) `),
                    1 === t.x && 1 === t.y || (r += `scale(${1 / t.x}, ${1 / t.y}) `),
                    n) {
                        const {transformPerspective: e, rotate: t, rotateX: a, rotateY: i, skewX: o, skewY: s} = n;
                        e && (r = `perspective(${e}px) ${r}`),
                        t && (r += `rotate(${t}deg) `),
                        a && (r += `rotateX(${a}deg) `),
                        i && (r += `rotateY(${i}deg) `),
                        o && (r += `skewX(${o}deg) `),
                        s && (r += `skewY(${s}deg) `)
                    }
                    const s = e.x.scale * t.x
                      , l = e.y.scale * t.y;
                    return 1 === s && 1 === l || (r += `scale(${s}, ${l})`),
                    r || "none"
                }(this.projectionDeltaWithTransform, this.treeScale, a);
                n && (i = n(a, i)),
                e.transform = i;
                const {x: o, y: s} = this.projectionDelta;
                e.transformOrigin = `${100 * o.origin}% ${100 * s.origin}% 0`,
                r.animationValues ? e.opacity = r === this ? a.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : a.opacityExit : e.opacity = r === this ? void 0 !== a.opacity ? a.opacity : "" : void 0 !== a.opacityExit ? a.opacityExit : 0;
                for (const t in Xn) {
                    if (void 0 === a[t])
                        continue;
                    const {correct: n, applyTo: o, isCSSVariable: s} = Xn[t]
                      , l = "none" === i ? a[t] : n(a[t], r);
                    if (o) {
                        const t = o.length;
                        for (let n = 0; n < t; n++)
                            e[o[n]] = l
                    } else
                        s ? this.options.visualElement.renderState.vars[t] = l : e[t] = l
                }
                this.options.layoutId && (e.pointerEvents = r === this ? Er(t?.pointerEvents) || "" : "none")
            }
            clearSnapshot() {
                this.resumeFrom = this.snapshot = void 0
            }
            resetTree() {
                this.root.nodes.forEach(e => e.currentAnimation?.stop()),
                this.root.nodes.forEach(ds),
                this.root.sharedNodes.clear()
            }
        }
    }
    function os(e) {
        e.updateLayout()
    }
    function ss(e) {
        const t = e.resumeFrom?.snapshot || e.snapshot;
        if (e.isLead() && e.layout && t && e.hasListeners("didUpdate")) {
            const {layoutBox: n, measuredBox: r} = e.layout
              , {animationType: a} = e.options
              , i = t.source !== e.layout.source;
            "size" === a ? Zi(e => {
                const r = i ? t.measuredBox[e] : t.layoutBox[e]
                  , a = Yi(r);
                r.min = n[e].min,
                r.max = r.min + a
            }
            ) : Es(a, t.layoutBox, n) && Zi(r => {
                const a = i ? t.measuredBox[r] : t.layoutBox[r]
                  , o = Yi(n[r]);
                a.max = a.min + o,
                e.relativeTarget && !e.currentAnimation && (e.isProjectionDirty = !0,
                e.relativeTarget[r].max = e.relativeTarget[r].min + o)
            }
            );
            const o = {
                x: {
                    translate: 0,
                    scale: 1,
                    origin: 0,
                    originPoint: 0
                },
                y: {
                    translate: 0,
                    scale: 1,
                    origin: 0,
                    originPoint: 0
                }
            };
            Qi(o, n, t.layoutBox);
            const s = {
                x: {
                    translate: 0,
                    scale: 1,
                    origin: 0,
                    originPoint: 0
                },
                y: {
                    translate: 0,
                    scale: 1,
                    origin: 0,
                    originPoint: 0
                }
            };
            i ? Qi(s, e.applyTransform(r, !0), t.measuredBox) : Qi(s, n, t.layoutBox);
            const l = !Ko(o);
            let u = !1;
            if (!e.resumeFrom) {
                const r = e.getClosestProjectingParent();
                if (r && !r.resumeFrom) {
                    const {snapshot: a, layout: i} = r;
                    if (a && i) {
                        const o = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        };
                        Gi(o, t.layoutBox, a.layoutBox);
                        const s = {
                            x: {
                                min: 0,
                                max: 0
                            },
                            y: {
                                min: 0,
                                max: 0
                            }
                        };
                        Gi(s, n, i.layoutBox),
                        Xo(o, s) || (u = !0),
                        r.options.layoutRoot && (e.relativeTarget = s,
                        e.relativeTargetOrigin = o,
                        e.relativeParent = r)
                    }
                }
            }
            e.notifyListeners("didUpdate", {
                layout: n,
                snapshot: t,
                delta: s,
                layoutDelta: o,
                hasLayoutChanged: l,
                hasRelativeLayoutChanged: u
            })
        } else if (e.isLead()) {
            const {onExitComplete: t} = e.options;
            t && t()
        }
        e.options.transition = void 0
    }
    function ls(e) {
        xt.value && es.nodes++,
        e.parent && (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
        e.isSharedProjectionDirty || (e.isSharedProjectionDirty = Boolean(e.isProjectionDirty || e.parent.isProjectionDirty || e.parent.isSharedProjectionDirty)),
        e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty))
    }
    function us(e) {
        e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1
    }
    function cs(e) {
        e.clearSnapshot()
    }
    function ds(e) {
        e.clearMeasurements()
    }
    function ms(e) {
        e.isLayoutDirty = !1
    }
    function fs(e) {
        const {visualElement: t} = e.options;
        t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"),
        e.resetTransform()
    }
    function hs(e) {
        e.finishAnimation(),
        e.targetDelta = e.relativeTarget = e.target = void 0,
        e.isProjectionDirty = !0
    }
    function ps(e) {
        e.resolveTargetDelta()
    }
    function gs(e) {
        e.calcProjection()
    }
    function ys(e) {
        e.resetSkewAndRotation()
    }
    function bs(e) {
        e.removeLeadSnapshot()
    }
    function vs(e, t, n) {
        e.translate = Le(t.translate, 0, n),
        e.scale = Le(t.scale, 1, n),
        e.origin = t.origin,
        e.originPoint = t.originPoint
    }
    function ws(e, t, n, r) {
        e.min = Le(t.min, n.min, r),
        e.max = Le(t.max, n.max, r)
    }
    function xs(e) {
        return e.animationValues && void 0 !== e.animationValues.opacityExit
    }
    const _s = {
        duration: .45,
        ease: [.4, 0, .1, 1]
    }
      , Ns = e => "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e)
      , ks = Ns("applewebkit/") && !Ns("chrome/") ? Math.round : bt;
    function Ss(e) {
        e.min = ks(e.min),
        e.max = ks(e.max)
    }
    function Es(e, t, n) {
        return "position" === e || "preserve-aspect" === e && (r = Go(t),
        a = Go(n),
        !(Math.abs(r - a) <= .2));
        var r, a
    }
    function Ps(e) {
        return e !== e.root && e.scroll?.wasRoot
    }
    const Cs = is({
        attachResizeListener: (e, t) => Bi(e, "resize", t),
        measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body.scrollLeft,
            y: document.documentElement.scrollTop || document.body.scrollTop
        }),
        checkIsScrollRoot: () => !0
    })
      , Ts = {
        current: void 0
    }
      , Ms = is({
        measureScroll: e => ({
            x: e.scrollLeft,
            y: e.scrollTop
        }),
        defaultParent: () => {
            if (!Ts.current) {
                const e = new Cs({});
                e.mount(window),
                e.setOptions({
                    layoutScroll: !0
                }),
                Ts.current = e
            }
            return Ts.current
        }
        ,
        resetTransform: (e, t) => {
            e.style.transform = void 0 !== t ? t : "none"
        }
        ,
        checkIsScrollRoot: e => Boolean("fixed" === window.getComputedStyle(e).position)
    })
      , As = {
        pan: {
            Feature: class extends zi {
                constructor() {
                    super(...arguments),
                    this.removePointerDownListener = bt
                }
                onPointerDown(e) {
                    this.session = new to(e,this.createPanHandlers(),{
                        transformPagePoint: this.node.getTransformPagePoint(),
                        contextWindow: Ji(this.node)
                    })
                }
                createPanHandlers() {
                    const {onPanSessionStart: e, onPanStart: t, onPan: n, onPanEnd: r} = this.node.getProps();
                    return {
                        onSessionStart: yo(e),
                        onStart: yo(t),
                        onMove: n,
                        onEnd: (e, t) => {
                            delete this.session,
                            r && Nt.postRender( () => r(e, t))
                        }
                    }
                }
                mount() {
                    this.removePointerDownListener = Hi(this.node.current, "pointerdown", e => this.onPointerDown(e))
                }
                update() {
                    this.session && this.session.updateHandlers(this.createPanHandlers())
                }
                unmount() {
                    this.removePointerDownListener(),
                    this.session && this.session.end()
                }
            }
        },
        drag: {
            Feature: class extends zi {
                constructor(e) {
                    super(e),
                    this.removeGroupControls = bt,
                    this.removeListeners = bt,
                    this.controls = new po(e)
                }
                mount() {
                    const {dragControls: e} = this.node.getProps();
                    e && (this.removeGroupControls = e.subscribe(this.controls)),
                    this.removeListeners = this.controls.addListeners() || bt
                }
                unmount() {
                    this.removeGroupControls(),
                    this.removeListeners()
                }
            }
            ,
            ProjectionNode: Ms,
            MeasureLayout: ko
        }
    };
    function Rs(e, t) {
        const n = function(e) {
            if (e instanceof EventTarget)
                return [e];
            if ("string" == typeof e) {
                let t = document;
                const n = t.querySelectorAll(e);
                return n ? Array.from(n) : []
            }
            return Array.from(e)
        }(e)
          , r = new AbortController;
        return [n, {
            passive: !0,
            ...t,
            signal: r.signal
        }, () => r.abort()]
    }
    function Ds(e) {
        return !("touch" === e.pointerType || Ui())
    }
    function Ls(e, t, n) {
        const {props: r} = e;
        e.animationState && r.whileHover && e.animationState.setActive("whileHover", "Start" === n);
        const a = r["onHover" + n];
        a && Nt.postRender( () => a(t, Wi(t)))
    }
    const Os = (e, t) => !!t && (e === t || Os(e, t.parentElement))
      , js = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"])
      , zs = new WeakSet;
    function Vs(e) {
        return t => {
            "Enter" === t.key && e(t)
        }
    }
    function Fs(e, t) {
        e.dispatchEvent(new PointerEvent("pointer" + t,{
            isPrimary: !0,
            bubbles: !0
        }))
    }
    function Is(e) {
        return $i(e) && !Ui()
    }
    function Us(e, t, n) {
        const {props: r} = e;
        if (e.current instanceof HTMLButtonElement && e.current.disabled)
            return;
        e.animationState && r.whileTap && e.animationState.setActive("whileTap", "Start" === n);
        const a = r["onTap" + ("End" === n ? "" : n)];
        a && Nt.postRender( () => a(t, Wi(t)))
    }
    const Bs = new WeakMap
      , $s = new WeakMap
      , Ws = e => {
        const t = Bs.get(e.target);
        t && t(e)
    }
      , Hs = e => {
        e.forEach(Ws)
    }
    ;
    const Ys = {
        some: 0,
        all: 1
    }
      , Ks = {
        inView: {
            Feature: class extends zi {
                constructor() {
                    super(...arguments),
                    this.hasEnteredView = !1,
                    this.isInView = !1
                }
                startObserver() {
                    this.unmount();
                    const {viewport: e={}} = this.node.getProps()
                      , {root: t, margin: n, amount: r="some", once: a} = e
                      , i = {
                        root: t ? t.current : void 0,
                        rootMargin: n,
                        threshold: "number" == typeof r ? r : Ys[r]
                    };
                    return function(e, t, n) {
                        const r = function({root: e, ...t}) {
                            const n = e || document;
                            $s.has(n) || $s.set(n, {});
                            const r = $s.get(n)
                              , a = JSON.stringify(t);
                            return r[a] || (r[a] = new IntersectionObserver(Hs,{
                                root: e,
                                ...t
                            })),
                            r[a]
                        }(t);
                        return Bs.set(e, n),
                        r.observe(e),
                        () => {
                            Bs.delete(e),
                            r.unobserve(e)
                        }
                    }(this.node.current, i, e => {
                        const {isIntersecting: t} = e;
                        if (this.isInView === t)
                            return;
                        if (this.isInView = t,
                        a && !t && this.hasEnteredView)
                            return;
                        t && (this.hasEnteredView = !0),
                        this.node.animationState && this.node.animationState.setActive("whileInView", t);
                        const {onViewportEnter: n, onViewportLeave: r} = this.node.getProps()
                          , i = t ? n : r;
                        i && i(e)
                    }
                    )
                }
                mount() {
                    this.startObserver()
                }
                update() {
                    if ("undefined" == typeof IntersectionObserver)
                        return;
                    const {props: e, prevProps: t} = this.node;
                    ["amount", "margin", "root"].some(function({viewport: e={}}, {viewport: t={}}={}) {
                        return n => e[n] !== t[n]
                    }(e, t)) && this.startObserver()
                }
                unmount() {}
            }
        },
        tap: {
            Feature: class extends zi {
                mount() {
                    const {current: e} = this.node;
                    e && (this.unmount = function(e, t, n={}) {
                        const [r,a,i] = Rs(e, n)
                          , o = e => {
                            const r = e.currentTarget;
                            if (!Is(e))
                                return;
                            zs.add(r);
                            const i = t(r, e)
                              , o = (e, t) => {
                                window.removeEventListener("pointerup", s),
                                window.removeEventListener("pointercancel", l),
                                zs.has(r) && zs.delete(r),
                                Is(e) && "function" == typeof i && i(e, {
                                    success: t
                                })
                            }
                              , s = e => {
                                o(e, r === window || r === document || n.useGlobalTarget || Os(r, e.target))
                            }
                              , l = e => {
                                o(e, !1)
                            }
                            ;
                            window.addEventListener("pointerup", s, a),
                            window.addEventListener("pointercancel", l, a)
                        }
                        ;
                        return r.forEach(e => {
                            var t;
                            (n.useGlobalTarget ? window : e).addEventListener("pointerdown", o, a),
                            Eo(t = e) && "offsetHeight"in t && (e.addEventListener("focus", e => ( (e, t) => {
                                const n = e.currentTarget;
                                if (!n)
                                    return;
                                const r = Vs( () => {
                                    if (zs.has(n))
                                        return;
                                    Fs(n, "down");
                                    const e = Vs( () => {
                                        Fs(n, "up")
                                    }
                                    );
                                    n.addEventListener("keyup", e, t),
                                    n.addEventListener("blur", () => Fs(n, "cancel"), t)
                                }
                                );
                                n.addEventListener("keydown", r, t),
                                n.addEventListener("blur", () => n.removeEventListener("keydown", r), t)
                            }
                            )(e, a)),
                            function(e) {
                                return js.has(e.tagName) || -1 !== e.tabIndex
                            }(e) || e.hasAttribute("tabindex") || (e.tabIndex = 0))
                        }
                        ),
                        i
                    }(e, (e, t) => (Us(this.node, t, "Start"),
                    (e, {success: t}) => Us(this.node, e, t ? "End" : "Cancel")), {
                        useGlobalTarget: this.node.props.globalTapTarget
                    }))
                }
                unmount() {}
            }
        },
        focus: {
            Feature: class extends zi {
                constructor() {
                    super(...arguments),
                    this.isActive = !1
                }
                onFocus() {
                    let e = !1;
                    try {
                        e = this.node.current.matches(":focus-visible")
                    } catch (t) {
                        e = !0
                    }
                    e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0),
                    this.isActive = !0)
                }
                onBlur() {
                    this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1),
                    this.isActive = !1)
                }
                mount() {
                    this.unmount = Gr(Bi(this.node.current, "focus", () => this.onFocus()), Bi(this.node.current, "blur", () => this.onBlur()))
                }
                unmount() {}
            }
        },
        hover: {
            Feature: class extends zi {
                mount() {
                    const {current: e} = this.node;
                    e && (this.unmount = function(e, t, n={}) {
                        const [r,a,i] = Rs(e, n)
                          , o = e => {
                            if (!Ds(e))
                                return;
                            const {target: n} = e
                              , r = t(n, e);
                            if ("function" != typeof r || !n)
                                return;
                            const i = e => {
                                Ds(e) && (r(e),
                                n.removeEventListener("pointerleave", i))
                            }
                            ;
                            n.addEventListener("pointerleave", i, a)
                        }
                        ;
                        return r.forEach(e => {
                            e.addEventListener("pointerenter", o, a)
                        }
                        ),
                        i
                    }(e, (e, t) => (Ls(this.node, t, "Start"),
                    e => Ls(this.node, e, "End"))))
                }
                unmount() {}
            }
        }
    }
      , Qs = Ur({
        ...Fi,
        ...Ks,
        ...As,
        layout: {
            ProjectionNode: Ms,
            MeasureLayout: ko
        }
    }, cr);
    var qs = "/home/project/src/pages/HomePage.jsx";
    const Xs = function() {
        var e = Z();
        return o.createElement("div", {
            className: "min-h-screen flex items-center justify-center p-4",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 9,
                columnNumber: 5
            }
        }, o.createElement("div", {
            className: "max-w-4xl mx-auto text-center",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 10,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 30
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: .8
            },
            className: "glass-card p-8 md:p-12",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 11,
                columnNumber: 9
            }
        }, o.createElement(Qs.div, {
            initial: {
                scale: .8
            },
            animate: {
                scale: 1
            },
            transition: {
                delay: .2,
                duration: .6
            },
            className: "mb-8",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 17,
                columnNumber: 11
            }
        }, o.createElement("i", {
            className: "fas fa-yin-yang text-6xl text-purple-400 mb-4",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 23,
                columnNumber: 13
            }
        }), o.createElement("h1", {
            className: "text-4xl md:text-6xl font-bold gradient-text mb-4",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 24,
                columnNumber: 13
            }
        }, "紫微命盘"), o.createElement("p", {
            className: "text-xl text-white/80 mb-2",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 27,
                columnNumber: 13
            }
        }, "专业级紫微斗数AI分析工具"), o.createElement("p", {
            className: "text-lg text-white/60",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 30,
                columnNumber: 13
            }
        }, "精准排盘 · 深度解读 · 可解释AI")), o.createElement(Qs.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            transition: {
                delay: .6,
                duration: .6
            },
            className: "grid md:grid-cols-3 gap-6 mb-8",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 35,
                columnNumber: 11
            }
        }, o.createElement("div", {
            className: "glass-card p-6",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 41,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-calendar-alt text-3xl text-blue-400 mb-3",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 42,
                columnNumber: 15
            }
        }), o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-2",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 43,
                columnNumber: 15
            }
        }, "精准排盘"), o.createElement("p", {
            className: "text-white/70 text-sm",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 44,
                columnNumber: 15
            }
        }, "支持阴历/阳历、真太阳时校正，确保排盘准确性")), o.createElement("div", {
            className: "glass-card p-6",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 48,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-brain text-3xl text-purple-400 mb-3",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 49,
                columnNumber: 15
            }
        }), o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-2",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 50,
                columnNumber: 15
            }
        }, "AI解读"), o.createElement("p", {
            className: "text-white/70 text-sm",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 51,
                columnNumber: 15
            }
        }, "基于经典命理理论，聚焦财官情感深度分析")), o.createElement("div", {
            className: "glass-card p-6",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 55,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-lightbulb text-3xl text-yellow-400 mb-3",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 56,
                columnNumber: 15
            }
        }), o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-2",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 57,
                columnNumber: 15
            }
        }, "可解释"), o.createElement("p", {
            className: "text-white/70 text-sm",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 58,
                columnNumber: 15
            }
        }, "每条结论可追溯推演过程，非玄学术语堆砌"))), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: .8,
                duration: .6
            },
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 64,
                columnNumber: 11
            }
        }, o.createElement("button", {
            onClick: function() {
                return e("/input")
            },
            className: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 69,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-star mr-2",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 73,
                columnNumber: 15
            }
        }), "开始排盘")), o.createElement(Qs.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            transition: {
                delay: 1,
                duration: .6
            },
            className: "mt-8 text-white/50 text-sm",
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 78,
                columnNumber: 11
            }
        }, o.createElement("p", {
            __self: this,
            __source: {
                fileName: qs,
                lineNumber: 84,
                columnNumber: 13
            }
        }, "基于《紫微斗数全书》等经典理论 · 仅供娱乐与自我认知参考")))))
    };
    var Gs = [{
        name: "北京",
        longitude: 116.4074,
        latitude: 39.9042
    }, {
        name: "上海",
        longitude: 121.4737,
        latitude: 31.2304
    }, {
        name: "广州",
        longitude: 113.2644,
        latitude: 23.1291
    }, {
        name: "深圳",
        longitude: 114.0579,
        latitude: 22.5431
    }, {
        name: "杭州",
        longitude: 120.1551,
        latitude: 30.2741
    }, {
        name: "南京",
        longitude: 118.7969,
        latitude: 32.0603
    }, {
        name: "武汉",
        longitude: 114.3054,
        latitude: 30.5928
    }, {
        name: "成都",
        longitude: 104.0665,
        latitude: 30.5723
    }, {
        name: "重庆",
        longitude: 106.5516,
        latitude: 29.563
    }, {
        name: "天津",
        longitude: 117.1901,
        latitude: 39.1235
    }, {
        name: "西安",
        longitude: 108.9402,
        latitude: 34.3416
    }, {
        name: "沈阳",
        longitude: 123.4315,
        latitude: 41.8057
    }, {
        name: "青岛",
        longitude: 120.3826,
        latitude: 36.0671
    }, {
        name: "大连",
        longitude: 121.6147,
        latitude: 38.914
    }, {
        name: "厦门",
        longitude: 118.1689,
        latitude: 24.4797
    }, {
        name: "苏州",
        longitude: 120.6197,
        latitude: 31.3158
    }, {
        name: "宁波",
        longitude: 121.544,
        latitude: 29.8683
    }, {
        name: "无锡",
        longitude: 120.3019,
        latitude: 31.5747
    }, {
        name: "佛山",
        longitude: 113.122,
        latitude: 23.0291
    }, {
        name: "东莞",
        longitude: 113.7518,
        latitude: 23.0489
    }, {
        name: "长沙",
        longitude: 112.9388,
        latitude: 28.2282
    }, {
        name: "郑州",
        longitude: 113.6254,
        latitude: 34.7466
    }, {
        name: "济南",
        longitude: 117.1205,
        latitude: 36.6519
    }, {
        name: "哈尔滨",
        longitude: 126.5358,
        latitude: 45.8023
    }, {
        name: "福州",
        longitude: 119.3063,
        latitude: 26.0745
    }, {
        name: "昆明",
        longitude: 102.8329,
        latitude: 25.0389
    }, {
        name: "南昌",
        longitude: 115.8921,
        latitude: 28.6765
    }, {
        name: "石家庄",
        longitude: 114.5149,
        latitude: 38.0428
    }, {
        name: "长春",
        longitude: 125.3245,
        latitude: 43.8171
    }, {
        name: "合肥",
        longitude: 117.2272,
        latitude: 31.8206
    }, {
        name: "太原",
        longitude: 112.5489,
        latitude: 37.8706
    }, {
        name: "南宁",
        longitude: 108.3669,
        latitude: 22.817
    }, {
        name: "贵阳",
        longitude: 106.7135,
        latitude: 26.5783
    }, {
        name: "海口",
        longitude: 110.3312,
        latitude: 20.0311
    }, {
        name: "兰州",
        longitude: 103.8236,
        latitude: 36.0581
    }, {
        name: "银川",
        longitude: 106.2309,
        latitude: 38.4872
    }, {
        name: "西宁",
        longitude: 101.7782,
        latitude: 36.6171
    }, {
        name: "乌鲁木齐",
        longitude: 87.6177,
        latitude: 43.7928
    }, {
        name: "拉萨",
        longitude: 91.1322,
        latitude: 29.6544
    }, {
        name: "呼和浩特",
        longitude: 111.7519,
        latitude: 40.8414
    }];
    function Zs(e) {
        return Zs = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ,
        Zs(e)
    }
    var Js = "/home/project/src/components/BirthInfoForm.jsx";
    function el(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t && (r = r.filter(function(t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable
            })),
            n.push.apply(n, r)
        }
        return n
    }
    function tl(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2 ? el(Object(n), !0).forEach(function(t) {
                nl(e, t, n[t])
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : el(Object(n)).forEach(function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
            })
        }
        return e
    }
    function nl(e, t, n) {
        return (t = function(e) {
            var t = function(e) {
                if ("object" != Zs(e) || !e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(e, "string");
                    if ("object" != Zs(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return String(e)
            }(e);
            return "symbol" == Zs(t) ? t : t + ""
        }(t))in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n,
        e
    }
    function rl(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != n) {
                var r, a, i, o, s = [], l = !0, u = !1;
                try {
                    if (i = (n = n.call(e)).next,
                    0 === t) {
                        if (Object(n) !== n)
                            return;
                        l = !1
                    } else
                        for (; !(l = (r = i.call(n)).done) && (s.push(r.value),
                        s.length !== t); l = !0)
                            ;
                } catch (e) {
                    u = !0,
                    a = e
                } finally {
                    try {
                        if (!l && null != n.return && (o = n.return(),
                        Object(o) !== o))
                            return
                    } finally {
                        if (u)
                            throw a
                    }
                }
                return s
            }
        }(e, t) || function(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return al(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? al(e, t) : void 0
            }
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function al(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    const il = function(e) {
        var t = this
          , n = e.onSubmit
          , r = rl((0,
        o.useState)({
            dateType: "solar",
            year: "",
            month: "",
            day: "",
            hour: "",
            minute: "",
            city: "",
            gender: "male"
        }), 2)
          , a = r[0]
          , i = r[1]
          , s = rl((0,
        o.useState)({}), 2)
          , l = s[0]
          , u = s[1]
          , c = function(e, t) {
            i(function(n) {
                return tl(tl({}, n), {}, nl({}, e, t))
            }),
            l[e] && u(function(t) {
                return tl(tl({}, t), {}, nl({}, e, ""))
            })
        }
          , d = (new Date).getFullYear()
          , m = Array.from({
            length: 131
        }, function(e, t) {
            return d - t
        })
          , f = Array.from({
            length: 12
        }, function(e, t) {
            return t + 1
        })
          , h = Array.from({
            length: 31
        }, function(e, t) {
            return t + 1
        })
          , p = Array.from({
            length: 24
        }, function(e, t) {
            return t
        })
          , g = Array.from({
            length: 60
        }, function(e, t) {
            return t
        });
        return o.createElement("form", {
            onSubmit: function(e) {
                var t;
                e.preventDefault(),
                t = {},
                (!a.year || a.year < 1900 || a.year > 2030) && (t.year = "请输入有效年份(1900-2030)"),
                (!a.month || a.month < 1 || a.month > 12) && (t.month = "请输入有效月份(1-12)"),
                (!a.day || a.day < 1 || a.day > 31) && (t.day = "请输入有效日期(1-31)"),
                (!a.hour || a.hour < 0 || a.hour > 23) && (t.hour = "请输入有效小时(0-23)"),
                (!a.minute || a.minute < 0 || a.minute > 59) && (t.minute = "请输入有效分钟(0-59)"),
                a.city || (t.city = "请选择出生城市"),
                u(t),
                0 === Object.keys(t).length && n(a)
            },
            className: "space-y-6",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 74,
                columnNumber: 5
            }
        }, o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 76,
                columnNumber: 7
            }
        }, o.createElement("label", {
            className: "block text-white font-semibold mb-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 77,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-calendar mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 78,
                columnNumber: 11
            }
        }), "日期类型"), o.createElement("div", {
            className: "flex space-x-4",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 81,
                columnNumber: 9
            }
        }, o.createElement("button", {
            type: "button",
            onClick: function() {
                return c("dateType", "solar")
            },
            className: "flex-1 py-3 px-4 rounded-lg border transition-all ".concat("solar" === a.dateType ? "bg-purple-500 border-purple-400 text-white" : "bg-white/10 border-white/30 text-white/70 hover:bg-white/20"),
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 82,
                columnNumber: 11
            }
        }, "阳历（公历）"), o.createElement("button", {
            type: "button",
            onClick: function() {
                return c("dateType", "lunar")
            },
            className: "flex-1 py-3 px-4 rounded-lg border transition-all ".concat("lunar" === a.dateType ? "bg-purple-500 border-purple-400 text-white" : "bg-white/10 border-white/30 text-white/70 hover:bg-white/20"),
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 93,
                columnNumber: 11
            }
        }, "阴历（农历）"))), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 108,
                columnNumber: 7
            }
        }, o.createElement("label", {
            className: "block text-white font-semibold mb-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 109,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-calendar-day mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 110,
                columnNumber: 11
            }
        }), "出生日期 ", "lunar" === a.dateType && o.createElement("span", {
            className: "text-yellow-400",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 111,
                columnNumber: 50
            }
        }, "（农历）")), o.createElement("div", {
            className: "grid grid-cols-3 gap-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 113,
                columnNumber: 9
            }
        }, o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 114,
                columnNumber: 11
            }
        }, o.createElement("select", {
            value: a.year,
            onChange: function(e) {
                return c("year", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 115,
                columnNumber: 13
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 120,
                columnNumber: 15
            }
        }, "年"), m.map(function(e) {
            return o.createElement("option", {
                key: e,
                value: e,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 122,
                    columnNumber: 17
                }
            }, e, "年")
        })), l.year && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 127,
                columnNumber: 29
            }
        }, l.year)), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 129,
                columnNumber: 11
            }
        }, o.createElement("select", {
            value: a.month,
            onChange: function(e) {
                return c("month", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 130,
                columnNumber: 13
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 135,
                columnNumber: 15
            }
        }, "月"), f.map(function(e) {
            return o.createElement("option", {
                key: e,
                value: e,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 137,
                    columnNumber: 17
                }
            }, e, "月")
        })), l.month && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 142,
                columnNumber: 30
            }
        }, l.month)), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 144,
                columnNumber: 11
            }
        }, o.createElement("select", {
            value: a.day,
            onChange: function(e) {
                return c("day", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 145,
                columnNumber: 13
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 150,
                columnNumber: 15
            }
        }, "日"), h.map(function(e) {
            return o.createElement("option", {
                key: e,
                value: e,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 152,
                    columnNumber: 17
                }
            }, e, "日")
        })), l.day && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 157,
                columnNumber: 28
            }
        }, l.day)))), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 163,
                columnNumber: 7
            }
        }, o.createElement("label", {
            className: "block text-white font-semibold mb-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 164,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-clock mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 165,
                columnNumber: 11
            }
        }), "出生时间"), o.createElement("div", {
            className: "grid grid-cols-2 gap-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 168,
                columnNumber: 9
            }
        }, o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 169,
                columnNumber: 11
            }
        }, o.createElement("select", {
            value: a.hour,
            onChange: function(e) {
                return c("hour", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 170,
                columnNumber: 13
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 175,
                columnNumber: 15
            }
        }, "时"), p.map(function(e) {
            return o.createElement("option", {
                key: e,
                value: e,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 177,
                    columnNumber: 17
                }
            }, e.toString().padStart(2, "0"), "时")
        })), l.hour && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 182,
                columnNumber: 29
            }
        }, l.hour)), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 184,
                columnNumber: 11
            }
        }, o.createElement("select", {
            value: a.minute,
            onChange: function(e) {
                return c("minute", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 185,
                columnNumber: 13
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 190,
                columnNumber: 15
            }
        }, "分"), g.map(function(e) {
            return o.createElement("option", {
                key: e,
                value: e,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 192,
                    columnNumber: 17
                }
            }, e.toString().padStart(2, "0"), "分")
        })), l.minute && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 197,
                columnNumber: 31
            }
        }, l.minute)))), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 203,
                columnNumber: 7
            }
        }, o.createElement("label", {
            className: "block text-white font-semibold mb-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 204,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-map-marker-alt mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 205,
                columnNumber: 11
            }
        }), "出生地点"), o.createElement("select", {
            value: a.city,
            onChange: function(e) {
                return c("city", e.target.value)
            },
            className: "w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:border-purple-400 focus:outline-none",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 208,
                columnNumber: 9
            }
        }, o.createElement("option", {
            value: "",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 213,
                columnNumber: 11
            }
        }, "请选择城市"), Gs.map(function(e) {
            return o.createElement("option", {
                key: e.name,
                value: e.name,
                className: "bg-gray-800",
                __self: t,
                __source: {
                    fileName: Js,
                    lineNumber: 215,
                    columnNumber: 13
                }
            }, e.name)
        })), l.city && o.createElement("p", {
            className: "text-red-400 text-xs mt-1",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 220,
                columnNumber: 25
            }
        }, l.city)), o.createElement("div", {
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 224,
                columnNumber: 7
            }
        }, o.createElement("label", {
            className: "block text-white font-semibold mb-3",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 225,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-user mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 226,
                columnNumber: 11
            }
        }), "性别"), o.createElement("div", {
            className: "flex space-x-4",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 229,
                columnNumber: 9
            }
        }, o.createElement("button", {
            type: "button",
            onClick: function() {
                return c("gender", "male")
            },
            className: "flex-1 py-3 px-4 rounded-lg border transition-all ".concat("male" === a.gender ? "bg-blue-500 border-blue-400 text-white" : "bg-white/10 border-white/30 text-white/70 hover:bg-white/20"),
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 230,
                columnNumber: 11
            }
        }, o.createElement("i", {
            className: "fas fa-mars mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 239,
                columnNumber: 13
            }
        }), "男"), o.createElement("button", {
            type: "button",
            onClick: function() {
                return c("gender", "female")
            },
            className: "flex-1 py-3 px-4 rounded-lg border transition-all ".concat("female" === a.gender ? "bg-pink-500 border-pink-400 text-white" : "bg-white/10 border-white/30 text-white/70 hover:bg-white/20"),
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 242,
                columnNumber: 11
            }
        }, o.createElement("i", {
            className: "fas fa-venus mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 251,
                columnNumber: 13
            }
        }), "女"))), o.createElement(Qs.button, {
            type: "submit",
            whileHover: {
                scale: 1.02
            },
            whileTap: {
                scale: .98
            },
            className: "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 258,
                columnNumber: 7
            }
        }, o.createElement("i", {
            className: "fas fa-magic mr-2",
            __self: this,
            __source: {
                fileName: Js,
                lineNumber: 264,
                columnNumber: 9
            }
        }), "生成命盘"))
    };
    var ol = "/home/project/src/pages/InputPage.jsx";
    function sl(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    const ll = function() {
        var e, t, n = Z(), r = (e = (0,
        o.useState)(null),
        t = 2,
        function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != n) {
                var r, a, i, o, s = [], l = !0, u = !1;
                try {
                    if (i = (n = n.call(e)).next,
                    0 === t) {
                        if (Object(n) !== n)
                            return;
                        l = !1
                    } else
                        for (; !(l = (r = i.call(n)).done) && (s.push(r.value),
                        s.length !== t); l = !0)
                            ;
                } catch (e) {
                    u = !0,
                    a = e
                } finally {
                    try {
                        if (!l && null != n.return && (o = n.return(),
                        Object(o) !== o))
                            return
                    } finally {
                        if (u)
                            throw a
                    }
                }
                return s
            }
        }(e, t) || function(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return sl(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? sl(e, t) : void 0
            }
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()), a = (r[0],
        r[1]);
        return o.createElement("div", {
            className: "min-h-screen p-4",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 18,
                columnNumber: 5
            }
        }, o.createElement("div", {
            className: "max-w-2xl mx-auto",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 19,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 30
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                duration: .6
            },
            className: "glass-card p-6 md:p-8",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 20,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "text-center mb-8",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 26,
                columnNumber: 11
            }
        }, o.createElement("button", {
            onClick: function() {
                return n("/")
            },
            className: "absolute top-4 left-4 text-white/70 hover:text-white transition-colors",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 27,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-arrow-left text-xl",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 31,
                columnNumber: 15
            }
        })), o.createElement("h1", {
            className: "text-3xl font-bold gradient-text mb-2",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 33,
                columnNumber: 13
            }
        }, "输入出生信息"), o.createElement("p", {
            className: "text-white/70",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 36,
                columnNumber: 13
            }
        }, "请准确填写以下信息，确保排盘精准")), o.createElement(il, {
            onSubmit: function(e) {
                a(e),
                localStorage.setItem("birthInfo", JSON.stringify(e)),
                n("/chart")
            },
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 41,
                columnNumber: 11
            }
        }), o.createElement("div", {
            className: "mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 43,
                columnNumber: 11
            }
        }, o.createElement("div", {
            className: "flex items-start space-x-2",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 44,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-info-circle text-yellow-400 mt-1",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 45,
                columnNumber: 15
            }
        }), o.createElement("div", {
            className: "text-sm text-white/80",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 46,
                columnNumber: 15
            }
        }, o.createElement("p", {
            className: "font-semibold mb-1",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 47,
                columnNumber: 17
            }
        }, "温馨提示："), o.createElement("ul", {
            className: "space-y-1 text-xs",
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 48,
                columnNumber: 17
            }
        }, o.createElement("li", {
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 49,
                columnNumber: 19
            }
        }, "• 出生时间越精确，排盘结果越准确"), o.createElement("li", {
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 50,
                columnNumber: 19
            }
        }, "• 系统将自动进行真太阳时校正"), o.createElement("li", {
            __self: this,
            __source: {
                fileName: ol,
                lineNumber: 51,
                columnNumber: 19
            }
        }, "• 您的信息仅用于排盘，不会上传服务器"))))))))
    };
    var ul = "/home/project/src/components/ZiweiChart.jsx";
    function cl(e) {
        return cl = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        }
        : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        }
        ,
        cl(e)
    }
    function dl(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t && (r = r.filter(function(t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable
            })),
            n.push.apply(n, r)
        }
        return n
    }
    function ml(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2 ? dl(Object(n), !0).forEach(function(t) {
                fl(e, t, n[t])
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : dl(Object(n)).forEach(function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
            })
        }
        return e
    }
    function fl(e, t, n) {
        return (t = function(e) {
            var t = function(e) {
                if ("object" != cl(e) || !e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var n = t.call(e, "string");
                    if ("object" != cl(n))
                        return n;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return String(e)
            }(e);
            return "symbol" == cl(t) ? t : t + ""
        }(t))in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n,
        e
    }
    const hl = function(e) {
        var t = this
          , n = e.chartData
          , r = e.onPalaceClick
          , a = e.selectedPalace
          , i = {
            ming: "命宫",
            xiongdi: "兄弟",
            fuqi: "夫妻",
            zinv: "子女",
            caibo: "财帛",
            jie: "疾厄",
            qianyi: "迁移",
            jiaoyou: "交友",
            shiye: "事业",
            tianzhai: "田宅",
            fude: "福德",
            fumu: "父母"
        };
        return o.createElement("div", {
            className: "w-full max-w-4xl mx-auto",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 89,
                columnNumber: 5
            }
        }, o.createElement("div", {
            className: "ziwei-grid",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 90,
                columnNumber: 7
            }
        }, ["ming", "xiongdi", "fuqi", "zinv", "caibo", "jie", "qianyi", "jiaoyou", "shiye", "tianzhai", "fude", "fumu"].map(function(e, s) {
            return function(e, s) {
                var l = n.palaces[e]
                  , u = (null == a ? void 0 : a.key) === e;
                return o.createElement(Qs.div, {
                    key: e,
                    initial: {
                        opacity: 0,
                        scale: .8
                    },
                    animate: {
                        opacity: 1,
                        scale: 1
                    },
                    transition: {
                        delay: .1 * s
                    },
                    className: "palace-cell palace-position-".concat(s + 1, " ").concat(u ? "active" : ""),
                    onClick: function() {
                        return r(ml(ml({}, l), {}, {
                            key: e,
                            name: i[e]
                        }))
                    },
                    __self: t,
                    __source: {
                        fileName: ul,
                        lineNumber: 31,
                        columnNumber: 7
                    }
                }, o.createElement("div", {
                    className: "absolute top-1 left-1 text-xs font-semibold text-purple-300",
                    __self: t,
                    __source: {
                        fileName: ul,
                        lineNumber: 40,
                        columnNumber: 9
                    }
                }, i[e]), o.createElement("div", {
                    className: "absolute top-1 right-1 text-xs text-white/60",
                    __self: t,
                    __source: {
                        fileName: ul,
                        lineNumber: 45,
                        columnNumber: 9
                    }
                }, l.earthlyBranch), o.createElement("div", {
                    className: "mt-4 space-y-1",
                    __self: t,
                    __source: {
                        fileName: ul,
                        lineNumber: 50,
                        columnNumber: 9
                    }
                }, l.stars.major.map(function(e, n) {
                    return o.createElement("div", {
                        key: n,
                        className: "star-major text-sm",
                        __self: t,
                        __source: {
                            fileName: ul,
                            lineNumber: 53,
                            columnNumber: 13
                        }
                    }, e)
                }), l.stars.minor.slice(0, 3).map(function(e, n) {
                    return o.createElement("div", {
                        key: n,
                        className: "star-minor text-xs",
                        __self: t,
                        __source: {
                            fileName: ul,
                            lineNumber: 60,
                            columnNumber: 13
                        }
                    }, e)
                }), l.stars.hua.map(function(e, n) {
                    return o.createElement("div", {
                        key: n,
                        className: "text-xs font-semibold ".concat(e.includes("禄") ? "star-hua-lu" : e.includes("权") ? "star-hua-quan" : e.includes("科") ? "star-hua-ke" : "star-hua-ji"),
                        __self: t,
                        __source: {
                            fileName: ul,
                            lineNumber: 67,
                            columnNumber: 13
                        }
                    }, e)
                })), l.stars.minor.length > 3 && o.createElement("div", {
                    className: "absolute bottom-1 right-1 text-xs text-white/40",
                    __self: t,
                    __source: {
                        fileName: ul,
                        lineNumber: 80,
                        columnNumber: 11
                    }
                }, "+", l.stars.minor.length - 3))
            }(e, s)
        }), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                scale: .9
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            transition: {
                delay: .5
            },
            className: "center-info",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 94,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "text-center",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 100,
                columnNumber: 11
            }
        }, o.createElement("i", {
            className: "fas fa-yin-yang text-4xl text-purple-400 mb-2",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 101,
                columnNumber: 13
            }
        }), o.createElement("h3", {
            className: "text-lg font-bold gradient-text mb-1",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 102,
                columnNumber: 13
            }
        }, "紫微命盘"), o.createElement("p", {
            className: "text-white/60 text-sm",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 103,
                columnNumber: 13
            }
        }, "male" === n.birthInfo.gender ? "乾造" : "坤造"), o.createElement("p", {
            className: "text-white/50 text-xs mt-2",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 106,
                columnNumber: 13
            }
        }, n.birthInfo.year, "年", n.birthInfo.month, "月", n.birthInfo.day, "日"), o.createElement("p", {
            className: "text-white/50 text-xs",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 109,
                columnNumber: 13
            }
        }, n.birthInfo.hour, "时", n.birthInfo.minute, "分")))), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: 1
            },
            className: "mt-4 text-center",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 117,
                columnNumber: 7
            }
        }, o.createElement("p", {
            className: "text-white/50 text-sm",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 123,
                columnNumber: 9
            }
        }, o.createElement("i", {
            className: "fas fa-hand-pointer mr-1",
            __self: this,
            __source: {
                fileName: ul,
                lineNumber: 124,
                columnNumber: 11
            }
        }), "点击宫位查看详细星曜信息")))
    };
    var pl = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
      , gl = ["紫微", "天机", "太阳", "武曲", "天同", "廉贞", "天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]
      , yl = ["文昌", "文曲", "左辅", "右弼", "天魁", "天钺", "擎羊", "陀罗", "火星", "铃星", "天空", "地劫", "禄存", "天马", "红鸾", "天喜", "孤辰", "寡宿"]
      , bl = ["化禄", "化权", "化科", "化忌"];
    function vl(e) {
        var t = Gs.find(function(t) {
            return t.name === e.city
        });
        if (!t)
            return {
                hour: e.hour,
                minute: e.minute
            };
        var n = 4 * (t.longitude - 120)
          , r = 60 * e.hour + parseInt(e.minute) + n
          , a = Math.floor(r / 60)
          , i = r % 60;
        return a < 0 && (a += 24),
        a >= 24 && (a -= 24),
        i < 0 && (i += 60),
        {
            hour: a,
            minute: i
        }
    }
    var wl = "/home/project/src/pages/ChartPage.jsx";
    function xl(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != n) {
                var r, a, i, o, s = [], l = !0, u = !1;
                try {
                    if (i = (n = n.call(e)).next,
                    0 === t) {
                        if (Object(n) !== n)
                            return;
                        l = !1
                    } else
                        for (; !(l = (r = i.call(n)).done) && (s.push(r.value),
                        s.length !== t); l = !0)
                            ;
                } catch (e) {
                    u = !0,
                    a = e
                } finally {
                    try {
                        if (!l && null != n.return && (o = n.return(),
                        Object(o) !== o))
                            return
                    } finally {
                        if (u)
                            throw a
                    }
                }
                return s
            }
        }(e, t) || function(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return _l(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _l(e, t) : void 0
            }
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function _l(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    const Nl = function() {
        var e = this
          , t = Z()
          , n = xl((0,
        o.useState)(null), 2)
          , r = n[0]
          , a = n[1]
          , i = xl((0,
        o.useState)(null), 2)
          , s = i[0]
          , l = i[1]
          , u = xl((0,
        o.useState)(!0), 2)
          , c = u[0]
          , d = u[1]
          , m = xl((0,
        o.useState)(null), 2)
          , f = m[0]
          , h = m[1];
        (0,
        o.useEffect)(function() {
            var e = localStorage.getItem("birthInfo");
            if (e) {
                var n = JSON.parse(e);
                a(n),
                setTimeout(function() {
                    var e = function(e) {
                        var t = function(e) {
                            var t = vl(e);
                            return (parseInt(e.month) - 1 + Math.floor(t.hour / 2)) % 12
                        }(e)
                          , n = function(e) {
                            var t = {}
                              , n = ["ming", "xiongdi", "fuqi", "zinv", "caibo", "jie", "qianyi", "jiaoyou", "shiye", "tianzhai", "fude", "fumu"];
                            return n.forEach(function(n, r) {
                                var a = (e + r) % 12;
                                t[n] = {
                                    earthlyBranch: pl[a],
                                    stars: {
                                        major: [],
                                        minor: [],
                                        hua: []
                                    }
                                }
                            }),
                            [].concat(gl).sort(function() {
                                return Math.random() - .5
                            }).forEach(function(e, r) {
                                var a = r % n.length
                                  , i = n[a];
                                t[i].stars.major.push(e)
                            }),
                            [].concat(yl).sort(function() {
                                return Math.random() - .5
                            }).forEach(function(e, r) {
                                var a = r % n.length
                                  , i = n[a];
                                t[i].stars.minor.push(e)
                            }),
                            [].concat(bl).sort(function() {
                                return Math.random() - .5
                            }).forEach(function(e, r) {
                                var a = r % n.length
                                  , i = n[a];
                                t[i].stars.hua.push(e)
                            }),
                            t
                        }(t);
                        return {
                            birthInfo: e,
                            mingGongIndex: t,
                            palaces: n,
                            trueSolarTime: vl(e),
                            generatedAt: (new Date).toISOString()
                        }
                    }(n);
                    l(e),
                    d(!1)
                }, 1500)
            } else
                t("/input")
        }, [t]);
        var p = function() {
            t("/analysis")
        };
        return c ? o.createElement("div", {
            className: "min-h-screen flex items-center justify-center",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 42,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            className: "text-center",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 43,
                columnNumber: 9
            }
        }, o.createElement(Qs.div, {
            animate: {
                rotate: 360
            },
            transition: {
                duration: 2,
                repeat: 1 / 0,
                ease: "linear"
            },
            className: "w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 48,
                columnNumber: 11
            }
        }), o.createElement("h2", {
            className: "text-2xl font-bold text-white mb-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 53,
                columnNumber: 11
            }
        }, "正在排盘中..."), o.createElement("p", {
            className: "text-white/70",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 54,
                columnNumber: 11
            }
        }, "计算星曜位置，生成专属命盘"))) : o.createElement("div", {
            className: "min-h-screen p-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 61,
                columnNumber: 5
            }
        }, o.createElement("div", {
            className: "max-w-6xl mx-auto",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 62,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: -20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "glass-card p-4 mb-6",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 64,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "flex items-center justify-between",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 69,
                columnNumber: 11
            }
        }, o.createElement("button", {
            onClick: function() {
                return t("/input")
            },
            className: "text-white/70 hover:text-white transition-colors",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 70,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-arrow-left text-xl mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 74,
                columnNumber: 15
            }
        }), "重新输入"), o.createElement("div", {
            className: "text-center",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 77,
                columnNumber: 13
            }
        }, o.createElement("h1", {
            className: "text-2xl font-bold gradient-text",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 78,
                columnNumber: 15
            }
        }, "紫微命盘"), r && o.createElement("p", {
            className: "text-white/70 text-sm",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 80,
                columnNumber: 17
            }
        }, "male" === r.gender ? "男" : "女", " ·", r.year, "年", r.month, "月", r.day, "日", r.hour, ":", r.minute.toString().padStart(2, "0"), " ·", r.city)), o.createElement("button", {
            onClick: p,
            className: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 88,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-chart-line mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 92,
                columnNumber: 15
            }
        }), "AI分析"))), o.createElement("div", {
            className: "grid lg:grid-cols-3 gap-6",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 98,
                columnNumber: 9
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                scale: .9
            },
            animate: {
                opacity: 1,
                scale: 1
            },
            transition: {
                delay: .2
            },
            className: "lg:col-span-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 100,
                columnNumber: 11
            }
        }, o.createElement("div", {
            className: "glass-card p-6",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 106,
                columnNumber: 13
            }
        }, o.createElement("h2", {
            className: "text-xl font-bold text-white mb-4 text-center",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 107,
                columnNumber: 15
            }
        }, "本命盘"), s && o.createElement(hl, {
            chartData: s,
            onPalaceClick: function(e) {
                h(e)
            },
            selectedPalace: f,
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 111,
                columnNumber: 17
            }
        }))), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                x: 20
            },
            animate: {
                opacity: 1,
                x: 0
            },
            transition: {
                delay: .4
            },
            className: "space-y-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 121,
                columnNumber: 11
            }
        }, o.createElement("div", {
            className: "glass-card p-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 128,
                columnNumber: 13
            }
        }, o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-3",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 129,
                columnNumber: 15
            }
        }, o.createElement("i", {
            className: "fas fa-info-circle mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 130,
                columnNumber: 17
            }
        }), "宫位详情"), f ? o.createElement("div", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 134,
                columnNumber: 17
            }
        }, o.createElement("h4", {
            className: "text-purple-400 font-semibold mb-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 135,
                columnNumber: 19
            }
        }, f.name), o.createElement("div", {
            className: "space-y-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 138,
                columnNumber: 19
            }
        }, f.stars.major.length > 0 && o.createElement("div", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 140,
                columnNumber: 23
            }
        }, o.createElement("p", {
            className: "text-white/70 text-sm mb-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 141,
                columnNumber: 25
            }
        }, "主星："), o.createElement("div", {
            className: "flex flex-wrap gap-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 142,
                columnNumber: 25
            }
        }, f.stars.major.map(function(t, n) {
            return o.createElement("span", {
                key: n,
                className: "star-major text-sm px-2 py-1 bg-yellow-500/20 rounded",
                __self: e,
                __source: {
                    fileName: wl,
                    lineNumber: 144,
                    columnNumber: 29
                }
            }, t)
        }))), f.stars.minor.length > 0 && o.createElement("div", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 152,
                columnNumber: 23
            }
        }, o.createElement("p", {
            className: "text-white/70 text-sm mb-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 153,
                columnNumber: 25
            }
        }, "辅星："), o.createElement("div", {
            className: "flex flex-wrap gap-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 154,
                columnNumber: 25
            }
        }, f.stars.minor.map(function(t, n) {
            return o.createElement("span", {
                key: n,
                className: "star-minor text-xs px-2 py-1 bg-blue-500/20 rounded",
                __self: e,
                __source: {
                    fileName: wl,
                    lineNumber: 156,
                    columnNumber: 29
                }
            }, t)
        }))), f.stars.hua.length > 0 && o.createElement("div", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 164,
                columnNumber: 23
            }
        }, o.createElement("p", {
            className: "text-white/70 text-sm mb-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 165,
                columnNumber: 25
            }
        }, "四化："), o.createElement("div", {
            className: "flex flex-wrap gap-1",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 166,
                columnNumber: 25
            }
        }, f.stars.hua.map(function(t, n) {
            return o.createElement("span", {
                key: n,
                className: "text-xs px-2 py-1 rounded ".concat(t.includes("禄") ? "star-hua-lu bg-green-500/20" : t.includes("权") ? "star-hua-quan bg-red-500/20" : t.includes("科") ? "star-hua-ke bg-blue-500/20" : "star-hua-ji bg-gray-500/20"),
                __self: e,
                __source: {
                    fileName: wl,
                    lineNumber: 168,
                    columnNumber: 29
                }
            }, t)
        }))))) : o.createElement("p", {
            className: "text-white/50 text-sm",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 183,
                columnNumber: 17
            }
        }, "点击命盘中的宫位查看详情")), o.createElement("div", {
            className: "glass-card p-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 188,
                columnNumber: 13
            }
        }, o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-3",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 189,
                columnNumber: 15
            }
        }, o.createElement("i", {
            className: "fas fa-book mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 190,
                columnNumber: 17
            }
        }), "命盘说明"), o.createElement("div", {
            className: "space-y-2 text-sm text-white/70",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 193,
                columnNumber: 15
            }
        }, o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 194,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-major",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 195,
                columnNumber: 19
            }
        }, "★"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 196,
                columnNumber: 19
            }
        }, "主星（十四正曜）")), o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 198,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-minor",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 199,
                columnNumber: 19
            }
        }, "●"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 200,
                columnNumber: 19
            }
        }, "辅星（六吉六煞等）")), o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 202,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-hua-lu",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 203,
                columnNumber: 19
            }
        }, "禄"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 204,
                columnNumber: 19
            }
        }, "化禄（财富）")), o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 206,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-hua-quan",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 207,
                columnNumber: 19
            }
        }, "权"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 208,
                columnNumber: 19
            }
        }, "化权（权力）")), o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 210,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-hua-ke",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 211,
                columnNumber: 19
            }
        }, "科"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 212,
                columnNumber: 19
            }
        }, "化科（名声）")), o.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 214,
                columnNumber: 17
            }
        }, o.createElement("span", {
            className: "star-hua-ji",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 215,
                columnNumber: 19
            }
        }, "忌"), o.createElement("span", {
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 216,
                columnNumber: 19
            }
        }, "化忌（阻碍）")))), o.createElement("div", {
            className: "glass-card p-4",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 222,
                columnNumber: 13
            }
        }, o.createElement("h3", {
            className: "text-lg font-semibold text-white mb-3",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 223,
                columnNumber: 15
            }
        }, o.createElement("i", {
            className: "fas fa-lightning-bolt mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 224,
                columnNumber: 17
            }
        }), "快速分析"), o.createElement("button", {
            onClick: p,
            className: "w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 227,
                columnNumber: 15
            }
        }, o.createElement("i", {
            className: "fas fa-brain mr-2",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 231,
                columnNumber: 17
            }
        }), "获取AI深度解读"), o.createElement("p", {
            className: "text-white/50 text-xs mt-2 text-center",
            __self: this,
            __source: {
                fileName: wl,
                lineNumber: 234,
                columnNumber: 15
            }
        }, "基于经典理论，聚焦财官情感分析"))))))
    };
    var kl = "/home/project/src/pages/AnalysisPage.jsx";
    function Sl(e, t) {
        return function(e) {
            if (Array.isArray(e))
                return e
        }(e) || function(e, t) {
            var n = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
            if (null != n) {
                var r, a, i, o, s = [], l = !0, u = !1;
                try {
                    if (i = (n = n.call(e)).next,
                    0 === t) {
                        if (Object(n) !== n)
                            return;
                        l = !1
                    } else
                        for (; !(l = (r = i.call(n)).done) && (s.push(r.value),
                        s.length !== t); l = !0)
                            ;
                } catch (e) {
                    u = !0,
                    a = e
                } finally {
                    try {
                        if (!l && null != n.return && (o = n.return(),
                        Object(o) !== o))
                            return
                    } finally {
                        if (u)
                            throw a
                    }
                }
                return s
            }
        }(e, t) || function(e, t) {
            if (e) {
                if ("string" == typeof e)
                    return El(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return "Object" === n && e.constructor && (n = e.constructor.name),
                "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? El(e, t) : void 0
            }
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }
    function El(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++)
            r[n] = e[n];
        return r
    }
    const Pl = function() {
        var e = this
          , t = Z()
          , n = Sl((0,
        o.useState)(null), 2)
          , r = (n[0],
        n[1])
          , a = Sl((0,
        o.useState)(null), 2)
          , i = a[0]
          , s = a[1]
          , l = Sl((0,
        o.useState)(!0), 2)
          , u = l[0]
          , c = l[1]
          , d = Sl((0,
        o.useState)("wealth"), 2)
          , m = d[0]
          , f = d[1];
        return (0,
        o.useEffect)(function() {
            var e = localStorage.getItem("birthInfo");
            e ? setTimeout(function() {
                var t = JSON.parse(e);
                r(t),
                s({
                    wealth: {
                        sections: [{
                            title: "事业格局分析",
                            icon: "fas fa-briefcase",
                            content: [{
                                subtitle: "职业发展方向",
                                description: "命宫主星显示您适合从事管理类或专业技术工作，具备领导潜质。建议选择大型机构或稳定行业发展，避免频繁跳槽。",
                                logic: '依据：命宫见紫微星，《全书》云："紫微为帝星，主贵不主富，宜居庙旺之地"，适合管理岗位。'
                            }, {
                                subtitle: "事业发展时机",
                                description: "30-40岁为事业黄金期，此时大限走财官旺地，利于升职加薪。2025-2027年流年运势较佳，可把握机会。",
                                logic: "依据：大限行至官禄宫，流年天梁化科，主名声显达，事业有成。"
                            }]
                        }, {
                            title: "财富潜力评估",
                            icon: "fas fa-chart-line",
                            content: [{
                                subtitle: "财富获得方式",
                                description: "您的财富主要来源于稳定工作收入，不宜投机取巧。理财方面偏保守，适合长期投资，如基金定投、房产等。",
                                logic: '依据：财帛宫见武曲星，主正财，《斗数秘钞》云："武曲守财帛，财源由正道"。'
                            }, {
                                subtitle: "投资理财建议",
                                description: "避免高风险投资，如股票短线操作、期货等。建议分散投资，以稳健增值为主。注意防范朋友借贷风险。",
                                logic: "依据：财帛宫有陀罗同宫，主财务纠纷，需谨慎理财，避免借贷。"
                            }]
                        }, {
                            title: "贵人助力分析",
                            icon: "fas fa-handshake",
                            content: [{
                                subtitle: "贵人方位与特征",
                                description: "您的贵人多来自东南方向，年长或有权威的人士。在工作中容易得到上级赏识，建议主动展示能力。",
                                logic: "依据：天魁星在巳宫，主贵人在东南方，多为年长权威人士。"
                            }, {
                                subtitle: "合作发展机会",
                                description: "适合与人合作创业或投资，但需选择可靠伙伴。避免独自承担过大风险，借力发展更为有利。",
                                logic: "依据：命宫无正曜，借对宫天同太阴，主善于合作，不宜独立创业。"
                            }]
                        }],
                        summary: ["事业发展宜选择稳定行业，发挥管理才能", "财富积累以正财为主，避免投机取巧", "善用贵人助力，合作发展更有优势", "30-40岁为财官运势最佳时期，需把握机会"]
                    },
                    emotion: {
                        sections: [{
                            title: "婚姻特质分析",
                            icon: "fas fa-ring",
                            content: [{
                                subtitle: "配偶特征",
                                description: "您的配偶性格温和体贴，具有包容心，可能从事教育、医疗或服务行业。感情发展较为平稳，少有激烈冲突。",
                                logic: '依据：夫妻宫天同化禄，《全书》云："天同主和谐，化禄主情深"，配偶温和，感情融洽。'
                            }, {
                                subtitle: "婚姻模式",
                                description: "您在婚姻中扮演主导角色，配偶较为依赖。建议多沟通交流，避免过于强势，给对方足够的空间和尊重。",
                                logic: "依据：命宫强于夫妻宫，主在婚姻中占主导地位，需注意平衡。"
                            }]
                        }, {
                            title: "恋爱时机预测",
                            icon: "fas fa-calendar-heart",
                            content: [{
                                subtitle: "最佳恋爱时期",
                                description: "2026年红鸾星动，为恋爱结婚的最佳时机。单身者容易遇到心仪对象，已婚者感情升温，可考虑添丁。",
                                logic: "依据：2026年流年红鸾入命，主桃花运旺，利于婚恋。"
                            }, {
                                subtitle: "感情发展节奏",
                                description: "您的感情发展较为稳定，不喜欢过于激烈的恋爱方式。建议循序渐进，通过日常相处加深了解。",
                                logic: "依据：夫妻宫主星稳定，无煞星冲破，主感情发展平稳。"
                            }]
                        }, {
                            title: "人际关系模式",
                            icon: "fas fa-users",
                            content: [{
                                subtitle: "社交特点",
                                description: "您在人际交往中较为谨慎，朋友不多但质量较高。容易与志同道合的人建立深厚友谊，但需防范小人。",
                                logic: "依据：交友宫见擎羊，主朋友中有是非，需谨慎交友，防范借贷纠纷。"
                            }, {
                                subtitle: "人际改善建议",
                                description: "建议主动参与社交活动，扩大交友圈。在与人交往时保持真诚，但涉及金钱往来需格外谨慎。",
                                logic: "依据：迁移宫吉星较多，主外出有利，宜多参与社交活动。"
                            }]
                        }],
                        summary: ["配偶性格温和，感情发展稳定和谐", "2026年为恋爱结婚最佳时机，需把握机会", "人际交往宜质不宜量，谨慎选择朋友", "沟通时避免过于强势，多给对方理解和包容"]
                    }
                }),
                c(!1)
            }, 2e3) : t("/input")
        }, [t]),
        u ? o.createElement("div", {
            className: "min-h-screen flex items-center justify-center",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 32,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            className: "text-center",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 33,
                columnNumber: 9
            }
        }, o.createElement(Qs.div, {
            animate: {
                rotate: 360
            },
            transition: {
                duration: 2,
                repeat: 1 / 0,
                ease: "linear"
            },
            className: "w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 38,
                columnNumber: 11
            }
        }), o.createElement("h2", {
            className: "text-2xl font-bold text-white mb-2",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 43,
                columnNumber: 11
            }
        }, "AI分析中..."), o.createElement("p", {
            className: "text-white/70",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 44,
                columnNumber: 11
            }
        }, "基于经典理论，深度解读命盘"))) : o.createElement("div", {
            className: "min-h-screen p-4",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 56,
                columnNumber: 5
            }
        }, o.createElement("div", {
            className: "max-w-4xl mx-auto",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 57,
                columnNumber: 7
            }
        }, o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: -20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            className: "glass-card p-4 mb-6",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 59,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "flex items-center justify-between",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 64,
                columnNumber: 11
            }
        }, o.createElement("button", {
            onClick: function() {
                return t("/chart")
            },
            className: "text-white/70 hover:text-white transition-colors",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 65,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-arrow-left text-xl mr-2",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 69,
                columnNumber: 15
            }
        }), "返回命盘"), o.createElement("div", {
            className: "text-center",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 72,
                columnNumber: 13
            }
        }, o.createElement("h1", {
            className: "text-2xl font-bold gradient-text",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 73,
                columnNumber: 15
            }
        }, "AI深度分析"), o.createElement("p", {
            className: "text-white/70 text-sm",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 74,
                columnNumber: 15
            }
        }, "基于《紫微斗数全书》等经典理论")), o.createElement("button", {
            onClick: function() {},
            className: "text-white/70 hover:text-white transition-colors",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 76,
                columnNumber: 13
            }
        }, o.createElement("i", {
            className: "fas fa-share-alt text-xl",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 80,
                columnNumber: 15
            }
        })))), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: .2
            },
            className: "glass-card p-1 mb-6",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 86,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "flex space-x-1",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 92,
                columnNumber: 11
            }
        }, [{
            key: "wealth",
            name: "财官分析",
            icon: "fas fa-coins"
        }, {
            key: "emotion",
            name: "情感分析",
            icon: "fas fa-heart"
        }].map(function(t) {
            return o.createElement("button", {
                key: t.key,
                onClick: function() {
                    return f(t.key)
                },
                className: "flex-1 py-3 px-4 rounded-lg transition-all ".concat(m === t.key ? "bg-purple-500 text-white shadow-lg" : "text-white/70 hover:text-white hover:bg-white/10"),
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 94,
                    columnNumber: 15
                }
            }, o.createElement("i", {
                className: "".concat(t.icon, " mr-2"),
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 103,
                    columnNumber: 17
                }
            }), t.name)
        }))), o.createElement(Qs.div, {
            key: m,
            initial: {
                opacity: 0,
                x: 20
            },
            animate: {
                opacity: 1,
                x: 0
            },
            transition: {
                duration: .3
            },
            className: "space-y-6",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 111,
                columnNumber: 9
            }
        }, i && i[m] && o.createElement(o.Fragment, null, i[m].sections.map(function(t, n) {
            return o.createElement(Qs.div, {
                key: n,
                initial: {
                    opacity: 0,
                    y: 20
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    delay: .1 * n
                },
                className: "glass-card p-6",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 121,
                    columnNumber: 17
                }
            }, o.createElement("div", {
                className: "flex items-center mb-4",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 128,
                    columnNumber: 19
                }
            }, o.createElement("i", {
                className: "".concat(t.icon, " text-2xl text-purple-400 mr-3"),
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 129,
                    columnNumber: 21
                }
            }), o.createElement("h2", {
                className: "text-xl font-bold text-white",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 130,
                    columnNumber: 21
                }
            }, t.title)), o.createElement("div", {
                className: "space-y-4",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 133,
                    columnNumber: 19
                }
            }, t.content.map(function(t, n) {
                return o.createElement("div", {
                    key: n,
                    className: "border-l-4 border-purple-400/50 pl-4",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 135,
                        columnNumber: 23
                    }
                }, o.createElement("h3", {
                    className: "font-semibold text-white mb-2",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 136,
                        columnNumber: 25
                    }
                }, t.subtitle), o.createElement("p", {
                    className: "text-white/80 mb-2",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 137,
                        columnNumber: 25
                    }
                }, t.description), t.logic && o.createElement("details", {
                    className: "mt-2",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 140,
                        columnNumber: 27
                    }
                }, o.createElement("summary", {
                    className: "text-purple-300 text-sm cursor-pointer hover:text-purple-200",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 141,
                        columnNumber: 29
                    }
                }, o.createElement("i", {
                    className: "fas fa-lightbulb mr-1",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 142,
                        columnNumber: 31
                    }
                }), "查看推演逻辑"), o.createElement("div", {
                    className: "mt-2 p-3 bg-white/5 rounded-lg border border-white/10",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 145,
                        columnNumber: 29
                    }
                }, o.createElement("p", {
                    className: "text-white/70 text-sm",
                    __self: e,
                    __source: {
                        fileName: kl,
                        lineNumber: 146,
                        columnNumber: 31
                    }
                }, t.logic))))
            })))
        }), o.createElement(Qs.div, {
            initial: {
                opacity: 0,
                y: 20
            },
            animate: {
                opacity: 1,
                y: 0
            },
            transition: {
                delay: .5
            },
            className: "glass-card p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 157,
                columnNumber: 15
            }
        }, o.createElement("div", {
            className: "flex items-center mb-4",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 163,
                columnNumber: 17
            }
        }, o.createElement("i", {
            className: "fas fa-star text-2xl text-yellow-400 mr-3",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 164,
                columnNumber: 19
            }
        }), o.createElement("h2", {
            className: "text-xl font-bold text-white",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 165,
                columnNumber: 19
            }
        }, "总结建议")), o.createElement("div", {
            className: "space-y-3",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 167,
                columnNumber: 17
            }
        }, i[m].summary.map(function(t, n) {
            return o.createElement("div", {
                key: n,
                className: "flex items-start space-x-3",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 169,
                    columnNumber: 21
                }
            }, o.createElement("i", {
                className: "fas fa-check-circle text-green-400 mt-1",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 170,
                    columnNumber: 23
                }
            }), o.createElement("p", {
                className: "text-white/90",
                __self: e,
                __source: {
                    fileName: kl,
                    lineNumber: 171,
                    columnNumber: 23
                }
            }, t))
        }))))), o.createElement(Qs.div, {
            initial: {
                opacity: 0
            },
            animate: {
                opacity: 1
            },
            transition: {
                delay: .8
            },
            className: "mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 181,
                columnNumber: 9
            }
        }, o.createElement("div", {
            className: "flex items-start space-x-2",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 187,
                columnNumber: 11
            }
        }, o.createElement("i", {
            className: "fas fa-exclamation-triangle text-yellow-400 mt-1",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 188,
                columnNumber: 13
            }
        }), o.createElement("div", {
            className: "text-sm text-white/80",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 189,
                columnNumber: 13
            }
        }, o.createElement("p", {
            className: "font-semibold mb-1",
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 190,
                columnNumber: 15
            }
        }, "免责声明"), o.createElement("p", {
            __self: this,
            __source: {
                fileName: kl,
                lineNumber: 191,
                columnNumber: 15
            }
        }, "本工具基于传统文化理论，仅供娱乐与自我认知参考，不构成任何决策建议。人生路径由个人努力与选择决定，请理性对待分析结果。"))))))
    };
    var Cl = "/home/project/src/App.jsx";
    const Tl = function() {
        return o.createElement("div", {
            className: "min-h-screen",
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 10,
                columnNumber: 5
            }
        }, o.createElement(ce, {
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 11,
                columnNumber: 7
            }
        }, o.createElement(le, {
            path: "/",
            element: o.createElement(Xs, {
                __self: this,
                __source: {
                    fileName: Cl,
                    lineNumber: 12,
                    columnNumber: 34
                }
            }),
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 12,
                columnNumber: 9
            }
        }), o.createElement(le, {
            path: "/input",
            element: o.createElement(ll, {
                __self: this,
                __source: {
                    fileName: Cl,
                    lineNumber: 13,
                    columnNumber: 39
                }
            }),
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 13,
                columnNumber: 9
            }
        }), o.createElement(le, {
            path: "/chart",
            element: o.createElement(Nl, {
                __self: this,
                __source: {
                    fileName: Cl,
                    lineNumber: 14,
                    columnNumber: 39
                }
            }),
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 14,
                columnNumber: 9
            }
        }), o.createElement(le, {
            path: "/analysis",
            element: o.createElement(Pl, {
                __self: this,
                __source: {
                    fileName: Cl,
                    lineNumber: 15,
                    columnNumber: 42
                }
            }),
            __self: this,
            __source: {
                fileName: Cl,
                lineNumber: 15,
                columnNumber: 9
            }
        })))
    };
    var Ml = a(230)
      , Al = a.n(Ml)
      , Rl = a(823)
      , Dl = a.n(Rl)
      , Ll = a(317)
      , Ol = a.n(Ll)
      , jl = a(38)
      , zl = a.n(jl)
      , Vl = a(762)
      , Fl = a.n(Vl)
      , Il = a(935)
      , Ul = a.n(Il)
      , Bl = a(673)
      , $l = {};
    $l.styleTagTransform = Ul(),
    $l.setAttributes = zl(),
    $l.insert = Ol().bind(null, "head"),
    $l.domAPI = Dl(),
    $l.insertStyleElement = Fl(),
    Al()(Bl.A, $l),
    Bl.A && Bl.A.locals && Bl.A.locals;
    var Wl = "/home/project/src/index.jsx";
    l.createRoot(document.getElementById("root")).render(o.createElement(o.StrictMode, {
        __self: void 0,
        __source: {
            fileName: Wl,
            lineNumber: 9,
            columnNumber: 3
        }
    }, o.createElement(fe, {
        __self: void 0,
        __source: {
            fileName: Wl,
            lineNumber: 10,
            columnNumber: 5
        }
    }, o.createElement(Tl, {
        __self: void 0,
        __source: {
            fileName: Wl,
            lineNumber: 11,
            columnNumber: 7
        }
    }))))
}
)();
