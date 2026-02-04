const RUNTIME_PUBLIC_PATH = "server/chunks/ssr/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/_next/";
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        // This is invoked when a module is merged into another module, thus it wasn't invoked via
        // instantiateModule and the cache entry wasn't created yet.
        module = createModuleObject(id);
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    const hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    const queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let moduleId = chunkModules[i];
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Each chunk item has a 'primary id' and optional additional ids. If the primary id is already
        // present we know all the additional ids are also present, so we don't need to check.
        if (!moduleFactories.has(moduleId)) {
            const moduleFactoryFn = chunkModules[end];
            applyModuleFactoryName(moduleFactoryFn);
            newModuleId?.(moduleId);
            for(; i < end; i++){
                moduleId = chunkModules[i];
                moduleFactories.set(moduleId, moduleFactoryFn);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
/// <reference path="../shared-node/base-externals-utils.ts" />
/// <reference path="../shared-node/node-externals-utils.ts" />
/// <reference path="../shared-node/node-wasm-utils.ts" />
var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    return SourceType;
}(SourceType || {});
process.env.TURBOPACK = '1';
const nodeContextPrototype = Context.prototype;
const url = require('url');
const moduleFactories = new Map();
nodeContextPrototype.M = moduleFactories;
const moduleCache = Object.create(null);
nodeContextPrototype.c = moduleCache;
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
nodeContextPrototype.R = resolvePathFromModule;
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (cause) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        const error = new Error(errorMessage, {
            cause
        });
        error.name = 'ChunkLoadError';
        throw error;
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (cause) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            const error = new Error(errorMessage, {
                cause
            });
            error.name = 'ChunkLoadError';
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(error);
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
function loadWebAssembly(chunkPath, _edgeModule, imports) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return instantiateWebAssemblyFromPath(resolved, imports);
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return compileWebAssemblyFromPath(resolved);
}
contextPrototype.u = loadWebAssemblyModule;
function getWorkerBlobURL(_chunks) {
    throw new Error('Worker blobs are not implemented yet for Node.js');
}
nodeContextPrototype.b = getWorkerBlobURL;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        let instantiationReason;
        switch(sourceType){
            case 0:
                instantiationReason = `as a runtime entry of chunk ${sourceData}`;
                break;
            case 1:
                instantiationReason = `because it was required from module ${sourceData}`;
                break;
            default:
                invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
        }
        throw new Error(`Module ${id} was instantiated ${instantiationReason}, but the module factory is not available.`);
    }
    const module1 = createModuleObject(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, 1, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, 0, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/1e120_lucide-react_dist_esm_icons_f99ce5ff._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/1e120_lucide-react_dist_esm_icons_f99ce5ff._.js");
      case "server/chunks/ssr/[root-of-the-server]__209761f1._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__209761f1._.js");
      case "server/chunks/ssr/[root-of-the-server]__2f88d31d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2f88d31d._.js");
      case "server/chunks/ssr/[root-of-the-server]__42004c41._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__42004c41._.js");
      case "server/chunks/ssr/[root-of-the-server]__6883c37b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6883c37b._.js");
      case "server/chunks/ssr/[root-of-the-server]__c51022d0._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c51022d0._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_3ae12d5c._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_3ae12d5c._.js");
      case "server/chunks/ssr/_ac5af9ee._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_ac5af9ee._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js");
      case "server/chunks/ssr/b2b3e_next_dist_4b02c7dd._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_4b02c7dd._.js");
      case "server/chunks/ssr/b2b3e_next_dist_7034df8a._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_7034df8a._.js");
      case "server/chunks/ssr/b2b3e_next_dist_9c8211a5._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_9c8211a5._.js");
      case "server/chunks/ssr/b2b3e_next_dist_a3e468bb._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_a3e468bb._.js");
      case "server/chunks/ssr/b2b3e_next_dist_ac1a4b10._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_ac1a4b10._.js");
      case "server/chunks/ssr/b2b3e_next_dist_cff157d3._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_cff157d3._.js");
      case "server/chunks/ssr/b2b3e_next_dist_client_components_20c7a49a._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_client_components_20c7a49a._.js");
      case "server/chunks/ssr/b2b3e_next_dist_esm_3f7918f8._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_esm_3f7918f8._.js");
      case "server/chunks/ssr/b2b3e_next_dist_esm_build_templates_app-page_41016a36.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_esm_build_templates_app-page_41016a36.js");
      case "server/chunks/ssr/node_modules__pnpm_00113467._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules__pnpm_00113467._.js");
      case "server/chunks/ssr/src_app_0db9afea._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_0db9afea._.js");
      case "server/chunks/ssr/src_app_error_tsx_22278d09._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_error_tsx_22278d09._.js");
      case "server/chunks/ssr/src_app_error_tsx_ef715cc8._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_error_tsx_ef715cc8._.js");
      case "server/chunks/ssr/src_app_loading_tsx_7fa31b7f._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_app_loading_tsx_7fa31b7f._.js");
      case "server/chunks/ssr/[root-of-the-server]__0e6c4051._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0e6c4051._.js");
      case "server/chunks/ssr/[root-of-the-server]__703a23be._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__703a23be._.js");
      case "server/chunks/ssr/[root-of-the-server]__82a7f166._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__82a7f166._.js");
      case "server/chunks/ssr/[root-of-the-server]__b3e0126b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b3e0126b._.js");
      case "server/chunks/ssr/_1465cb33._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_1465cb33._.js");
      case "server/chunks/ssr/_next-internal_server_app_410_page_actions_411a730a.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_410_page_actions_411a730a.js");
      case "server/chunks/ssr/b2b3e_next_dist_client_components_builtin_global-error_e9f28481.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_client_components_builtin_global-error_e9f28481.js");
      case "server/chunks/ssr/b2b3e_next_dist_client_components_builtin_unauthorized_cfd039bd.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_client_components_builtin_unauthorized_cfd039bd.js");
      case "server/chunks/ssr/[root-of-the-server]__5334965b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5334965b._.js");
      case "server/chunks/ssr/[root-of-the-server]__c2e77390._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c2e77390._.js");
      case "server/chunks/ssr/[root-of-the-server]__cc4de3f4._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__cc4de3f4._.js");
      case "server/chunks/ssr/[root-of-the-server]__f7db9aa7._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f7db9aa7._.js");
      case "server/chunks/ssr/_1670b4fd._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_1670b4fd._.js");
      case "server/chunks/ssr/_73b28dad._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_73b28dad._.js");
      case "server/chunks/ssr/_a6b01103._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_a6b01103._.js");
      case "server/chunks/ssr/_aee8fb3d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_aee8fb3d._.js");
      case "server/chunks/ssr/_cd58355a._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_cd58355a._.js");
      case "server/chunks/ssr/_next-internal_server_app_[category]_[slug]_page_actions_aa92c043.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_[category]_[slug]_page_actions_aa92c043.js");
      case "server/chunks/ssr/b2b3e_next_dist_cfa03fd9._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_cfa03fd9._.js");
      case "server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_5c50a3ab.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_5c50a3ab.js");
      case "server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_6c4fa724.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_6c4fa724.js");
      case "server/chunks/ssr/node_modules__pnpm_a7ebaa85._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules__pnpm_a7ebaa85._.js");
      case "server/chunks/ssr/src_components_72d8f3ad._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_72d8f3ad._.js");
      case "server/chunks/ssr/src_components_tools_GratuityCalculator_tsx_0c2bafed._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_tools_GratuityCalculator_tsx_0c2bafed._.js");
      case "server/chunks/ssr/src_components_tools_ZakatCalculator_tsx_f46faf2c._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_tools_ZakatCalculator_tsx_f46faf2c._.js");
      case "server/chunks/ssr/src_e64d62c4._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_e64d62c4._.js");
      case "server/chunks/ssr/[root-of-the-server]__fce6939d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__fce6939d._.js");
      case "server/chunks/ssr/_34fb7d8a._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_34fb7d8a._.js");
      case "server/chunks/ssr/_next-internal_server_app_[category]_page_actions_551cd49d.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_[category]_page_actions_551cd49d.js");
      case "server/chunks/ssr/[root-of-the-server]__3eacc2f6._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3eacc2f6._.js");
      case "server/chunks/ssr/[root-of-the-server]__52c8ca07._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__52c8ca07._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js");
      case "server/chunks/ssr/b2b3e_next_dist_2681d9bc._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/b2b3e_next_dist_2681d9bc._.js");
      case "server/chunks/ssr/[root-of-the-server]__1d904cfb._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1d904cfb._.js");
      case "server/chunks/ssr/_61606249._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_61606249._.js");
      case "server/chunks/ssr/_next-internal_server_app_about-us_page_actions_5f40c926.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_about-us_page_actions_5f40c926.js");
      case "server/chunks/ssr/[root-of-the-server]__1257c4c6._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1257c4c6._.js");
      case "server/chunks/ssr/_397dc780._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_397dc780._.js");
      case "server/chunks/ssr/_next-internal_server_app_affiliate-disclosure_page_actions_a0cf82ca.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_affiliate-disclosure_page_actions_a0cf82ca.js");
      case "server/chunks/[externals]__ce1f1b0d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[externals]__ce1f1b0d._.js");
      case "server/chunks/[root-of-the-server]__8705c286._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__8705c286._.js");
      case "server/chunks/[root-of-the-server]__8dbc969b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__8dbc969b._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_next-internal_server_app_api_subscribe_route_actions_fadc59a9.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_api_subscribe_route_actions_fadc59a9.js");
      case "server/chunks/ssr/[root-of-the-server]__be493b4f._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__be493b4f._.js");
      case "server/chunks/ssr/_4894f650._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_4894f650._.js");
      case "server/chunks/ssr/_next-internal_server_app_contact-us_page_actions_0b8d5d9e.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_contact-us_page_actions_0b8d5d9e.js");
      case "server/chunks/ssr/[root-of-the-server]__c6fb89eb._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c6fb89eb._.js");
      case "server/chunks/ssr/_21acb088._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_21acb088._.js");
      case "server/chunks/ssr/_next-internal_server_app_cookies-policy_page_actions_f8c396c9.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_cookies-policy_page_actions_f8c396c9.js");
      case "server/chunks/ssr/[root-of-the-server]__2ccd5114._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2ccd5114._.js");
      case "server/chunks/ssr/_3f0e3dcd._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_3f0e3dcd._.js");
      case "server/chunks/ssr/_a5f28275._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_a5f28275._.js");
      case "server/chunks/ssr/_a85f35e7._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_a85f35e7._.js");
      case "server/chunks/ssr/_next-internal_server_app_deals_page_actions_5f1868d2.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_deals_page_actions_5f1868d2.js");
      case "server/chunks/ssr/[root-of-the-server]__2bfd848c._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2bfd848c._.js");
      case "server/chunks/ssr/_e2ff8502._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_e2ff8502._.js");
      case "server/chunks/ssr/_next-internal_server_app_disclaimer_page_actions_89d408dd.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_disclaimer_page_actions_89d408dd.js");
      case "server/chunks/[root-of-the-server]__e116af24._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__e116af24._.js");
      case "server/chunks/_next-internal_server_app_icon_svg_route_actions_d76bbd00.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_icon_svg_route_actions_d76bbd00.js");
      case "server/chunks/ssr/[root-of-the-server]__aef06f5b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__aef06f5b._.js");
      case "server/chunks/ssr/_09603c01._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_09603c01._.js");
      case "server/chunks/ssr/_c65e6553._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_c65e6553._.js");
      case "server/chunks/ssr/_next-internal_server_app_page_actions_39d4fc33.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_page_actions_39d4fc33.js");
      case "server/chunks/ssr/src_9605dc77._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_9605dc77._.js");
      case "server/chunks/ssr/[root-of-the-server]__01aeef78._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__01aeef78._.js");
      case "server/chunks/ssr/_16c4ec86._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_16c4ec86._.js");
      case "server/chunks/ssr/_next-internal_server_app_privacy-policy_page_actions_74da7ed0.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_privacy-policy_page_actions_74da7ed0.js");
      case "server/chunks/ssr/[root-of-the-server]__53eb0da1._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__53eb0da1._.js");
      case "server/chunks/ssr/_baa6fb36._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_baa6fb36._.js");
      case "server/chunks/ssr/_next-internal_server_app_ramadan-2026_page_actions_311dd3b2.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_ramadan-2026_page_actions_311dd3b2.js");
      case "server/chunks/ssr/src_596b0b0d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_596b0b0d._.js");
      case "server/chunks/ssr/src_components_RamadanCountdown_tsx_987594fa._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/src_components_RamadanCountdown_tsx_987594fa._.js");
      case "server/chunks/ssr/[root-of-the-server]__7c03b492._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__7c03b492._.js");
      case "server/chunks/ssr/[root-of-the-server]__e197affa._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e197affa._.js");
      case "server/chunks/ssr/_3d208ea1._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_3d208ea1._.js");
      case "server/chunks/ssr/_495d3365._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_495d3365._.js");
      case "server/chunks/ssr/_next-internal_server_app_reviews_[slug]_page_actions_00e91ddb.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_reviews_[slug]_page_actions_00e91ddb.js");
      case "server/chunks/ssr/[root-of-the-server]__93d1769a._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__93d1769a._.js");
      case "server/chunks/ssr/_f16a0722._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_f16a0722._.js");
      case "server/chunks/ssr/_next-internal_server_app_reviews_page_actions_8d9ae2bf.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_reviews_page_actions_8d9ae2bf.js");
      case "server/chunks/[root-of-the-server]__7ac03023._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__7ac03023._.js");
      case "server/chunks/_next-internal_server_app_robots_txt_route_actions_9118e90f.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_robots_txt_route_actions_9118e90f.js");
      case "server/chunks/[root-of-the-server]__e653ca13._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__e653ca13._.js");
      case "server/chunks/[root-of-the-server]__f960539d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__f960539d._.js");
      case "server/chunks/_next-internal_server_app_sitemap_xml_route_actions_12658ace.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_sitemap_xml_route_actions_12658ace.js");
      case "server/chunks/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_bf6f6cbf.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/e46c0_@sanity_client_dist__chunks-es_stegaEncodeSourceMap_bf6f6cbf.js");
      case "server/chunks/node_modules__pnpm_ff3e38fd._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/node_modules__pnpm_ff3e38fd._.js");
      case "server/chunks/ssr/[root-of-the-server]__bb27c03c._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bb27c03c._.js");
      case "server/chunks/ssr/_10afcd41._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_10afcd41._.js");
      case "server/chunks/ssr/_670d3dbe._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_670d3dbe._.js");
      case "server/chunks/ssr/_next-internal_server_app_subscribe_page_actions_a387d33a.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_subscribe_page_actions_a387d33a.js");
      case "server/chunks/ssr/[root-of-the-server]__adfe1521._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__adfe1521._.js");
      case "server/chunks/ssr/_183e0850._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_183e0850._.js");
      case "server/chunks/ssr/_next-internal_server_app_terms-and-conditions_page_actions_3a1ebde5.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_terms-and-conditions_page_actions_3a1ebde5.js");
      case "server/chunks/ssr/[root-of-the-server]__dcb42a5b._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__dcb42a5b._.js");
      case "server/chunks/ssr/_12414d2d._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_12414d2d._.js");
      case "server/chunks/ssr/_next-internal_server_app_thank-you_page_actions_fc670010.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_thank-you_page_actions_fc670010.js");
      case "server/chunks/ssr/[root-of-the-server]__9bd0c072._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9bd0c072._.js");
      case "server/chunks/ssr/_9a3fb141._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_9a3fb141._.js");
      case "server/chunks/ssr/_next-internal_server_app_top-ten_[slug]_page_actions_5295a192.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_top-ten_[slug]_page_actions_5295a192.js");
      case "server/chunks/ssr/[root-of-the-server]__0ebb6b48._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__0ebb6b48._.js");
      case "server/chunks/ssr/_8bc6abad._.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_8bc6abad._.js");
      case "server/chunks/ssr/_next-internal_server_app_top-ten_page_actions_4cf71002.js": return require("/Users/ameer/Web-Projects/toptenuae/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_top-ten_page_actions_4cf71002.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }
