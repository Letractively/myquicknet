/**
 * newType
 * @package MyQuickNet
 * @version 2.1
 * @copyright (c) 2012 MyQuickNet Development Group
 * @license http://opensource.org/licenses/MIT
 */
/**
 *
 */
var _ = {};
var base = {};
var my = {};
var self = {};
var shared = {};
var newType;

(function (global) {
    'use strict';
    var newTypeNamespace = 'com.googlecode.myquicknet.base';
    var newTypeTypeFullName = newTypeNamespace.toString() + '.NewType';

    var NewType = function () {
        this._Object = {};
        this['_' + newTypeTypeFullName.toString()] = {};
    };

    NewType._Object = {};
    NewType._Function = {};
    NewType.prototype = {};

    NewType.prototype._ = function () {
        var my = this['_' + newTypeTypeFullName.toString()];
        my.stack = [];
        return this;
    };

    NewType.prototype._backup = function () {
        var my = this['_' + newTypeTypeFullName.toString()];
        my.stack.push(global._);
        my.stack.push(global.base);
        my.stack.push(global.my);
        my.stack.push(global.self);
        my.stack.push(global.shared);
    };

    NewType.prototype._backupImportNames = function (importNames) {
        var i, importNamesCount;
        var my = this['_' + newTypeTypeFullName.toString()];
        importNamesCount = importNames.length;

        for (i = 0; i < importNamesCount; ++i) {
            my.stack.push(global[importNames[i]]);
        }
    };

    NewType.prototype._decorateMethod = function (method) {
        var my = this['_' + newTypeTypeFullName.toString()];
        var v_ = my._;
        var vBase = my.base;
        var vImportFullNames = my.importFullNames;
        var vImportNames = my.importNames;
        var vMethod = method;
        var vFullName = my.fullName.toString();
        var vNewType = this;
        var vSelf = my.self;
        var vShared = my.shared;

        return function () {
            var i, importNamesCount, r;
            vNewType._backup();
            vNewType._backupImportNames(vImportNames);
            global._ = v_;
            global.base = (vBase && vBase.prototype) ? vBase.prototype : null;
            global.my = this['_' + vFullName];
            global.self = vSelf;
            global.shared = vShared;
            importNamesCount = vImportNames.length;

            for (i = 0; i < importNamesCount; ++i) {
                global[vImportNames[i]] = vNewType.getTypeFromFullName(vImportFullNames[i]);
            }

            r = vMethod.apply(this, arguments);
            vNewType._restoreImportNames(vImportNames);
            vNewType._restore();
            return r;
        };
    };

    NewType.prototype._decorateSharedMethod = function (method) {
        var my = this['_' + newTypeTypeFullName.toString()];
        var v_ = my._;
        var vBase = my.base;
        var vImportFullNames = my.importFullNames;
        var vImportNames = my.importNames;
        var vMethod = method;
        var vNewType = this;
        var vSelf = my.self;
        var vShared = my.shared;

        return function () {
            var i, importNamesCount, r;
            vNewType._backup();
            vNewType._backupImportNames(vImportNames);
            global._ = v_;
            global.base = (vBase && vBase.shared) ? vBase.shared : null;
            global.my = null;
            global.self = vSelf;
            global.shared = vShared;
            importNamesCount = vImportNames.length;

            for (i = 0; i < importNamesCount; ++i) {
                global[vImportNames[i]] = vNewType.getTypeFromFullName(vImportFullNames[i]);
            }

            r = vMethod.apply(this, arguments);
            vNewType._restoreImportNames(vImportNames);
            vNewType._restore();
            return r;
        };
    };

    NewType.prototype._defCore = function () {
        var _;
        var my = this['_' + newTypeTypeFullName.toString()];
        _ = my._;

        if (my.base) {
            _[my.name] = (function (vBase, v_, vName, vFullName) {
                return function () {
                    var propertyName;
                    vBase.call(this);
                    this['_' + vFullName] = {};

                    for (propertyName in v_[vName].prototype) {
                        if ((typeof v_[vName].prototype[propertyName] === 'object') && (propertyName.charAt(0) === '_')) {
                            this[propertyName] = v_[vName].prototype[propertyName];
                        }
                    }
                };
            }(my.base, _, my.name, my.fullName));

            _[my.name].prototype = new (my.base)();
        } else {
            _[my.name] = (function (v_, vName, vFullName) {
                return function () {
                    var propertyName;
                    this._Object = {};
                    this['_' + vFullName] = {};

                    for (propertyName in v_[vName].prototype) {
                        if ((typeof v_[vName].prototype[propertyName] === 'object') && (propertyName.charAt(0) === '_')) {
                            this[propertyName] = v_[vName].prototype[propertyName];
                        }
                    }
                };
            }(_, my.name, my.fullName));

            _[my.name].prototype = {};
        }

        _[my.name]._Object = {};
        _[my.name]._Function = {};
        my.self = _[my.name];
    };

    NewType.prototype._defImports = function (imports) {
        var i, imports2, importsCount, importsItem, importFullName, importFullNameSplits, importName;
        var my = this['_' + newTypeTypeFullName.toString()];
        imports2 = {};
        importsCount = imports.length;

        for (i = 0; i < importsCount; ++i) {
            importsItem = imports[i];
            importFullName = importsItem[0].toString();

            if (importsItem.length < 2) {
                importFullNameSplits = importFullName.toString().split('.');
                importName = importFullNameSplits[importFullNameSplits.length - 1].toString();
            } else {
                importName = importsItem[1].toString();
            }

            imports2[importName] = importFullName.toString();
        }

        my.importNames = [];
        my.importFullNames = [];
        i = 0;

        for (importName in imports2) {
            if (typeof imports2[importName] === 'string') {
                my.importNames[i] = importName.toString();
                my.importFullNames[i] = imports2[importName].toString();
                ++i;
            }
        }
    };

    NewType.prototype._restore = function () {
        var my = this['_' + newTypeTypeFullName.toString()];
        global.shared = my.stack.pop();
        global.self = my.stack.pop();
        global.my = my.stack.pop();
        global.base = my.stack.pop();
        global._ = my.stack.pop();
    };

    NewType.prototype._restoreImportNames = function (importNames) {
        var i, importNamesCount;
        var my = this['_' + newTypeTypeFullName.toString()];
        importNamesCount = importNames.length;

        for (i = importNamesCount - 1; i >= 0; --i) {
            global[importNames[i]] = my.stack.pop();
        }
    };

    NewType.prototype.def = function (args) {
        var _, F, i, interfacesCount, interfaceName, methodName, namespaceSplits, namespaceSplitsCount;
        var my = this['_' + newTypeTypeFullName.toString()];

        if (args.hasOwnProperty('namespace')) {
            my.namespace = args.namespace.toString();
            _ = global;
            namespaceSplits = my.namespace.toString().split('.');
            namespaceSplitsCount = namespaceSplits.length;

            for (i = 0; i < namespaceSplitsCount; ++i) {
                if (!_.hasOwnProperty(namespaceSplits[i])) {
                    _[namespaceSplits[i]] = {};
                }

                _ = _[namespaceSplits[i]];
            }
        } else {
            my.namespace = '';
            _ = global;
        }

        my._ = _;
        my.name = args.name.toString();

        if (my.namespace === '') {
            my.fullName = my.name.toString();
        } else {
            my.fullName = my.namespace.toString() + '.' + my.name.toString();
        }

        if (typeof args.base === 'string') {
            my.base = this.getTypeFromFullName(args.base);
        } else {
            my.base = args.base || null;
        }

        my.interfaces = args.interfaces || [];
        this._defImports(args.imports || []);
        my.methods = args.methods || {};
        my.shared = args.shared || {};
        my.sharedMethods = args.sharedMethods || {};
        this._defCore();
        interfacesCount = my.interfaces.length;
        interfaceName = '';

        for (i = 0; i < interfacesCount; ++i) {
            if (typeof my.interfaces[i] === 'string') {
                interfaceName = my.interfaces[i].toString();
            } else {
                interfaceName = this.getTypeFullName(my.interfaces[i]).toString();
            }

            _[my.name].prototype['_' + interfaceName.toString()] = {};
        }

        for (methodName in my.methods) {
            if (typeof my.methods[methodName] === 'function') {
                _[my.name].prototype[methodName] = this._decorateMethod(my.methods[methodName]);
            }
        }

        if (my.base) {
            F = function () {};
            F.prototype = my.base.shared;
            _[my.name].shared = new F();
        } else {
            _[my.name].shared = {};
        }

        for (methodName in my.sharedMethods) {
            if (typeof my.sharedMethods[methodName] === 'function') {
                _[my.name].shared[methodName] = this._decorateSharedMethod(my.sharedMethods[methodName]);
            }
        }

        _[my.name]._Function.typeFullName = my.fullName.toString();
        _[my.name]._Function.typeName = my.name.toString();
    };

    NewType.prototype.getTypeFromFullName = function (fullName) {
        var fullNameSplits, fullNameSplitsCount, i, type;
        fullName = fullName.toString();
        type = global;
        fullNameSplits = fullName.toString().split('.');
        fullNameSplitsCount = fullNameSplits.length;

        for (i = 0; i < fullNameSplitsCount; ++i) {
            if (type.hasOwnProperty(fullNameSplits[i])) {
                type = type[fullNameSplits[i]];
            } else {
                throw new ReferenceError(fullName.toString() + ' not found.');
            }
        }

        return type;
    };

    NewType.prototype.getTypeFullName = function (object) {
        var typeFullName;
        typeFullName = null;

        if (object && object.hasOwnProperty('_Function')) {
            if (object._Function.hasOwnProperty('typeFullName')) {
                if (typeof object._Function.typeFullName === 'string') {
                    typeFullName = object._Function.typeFullName.toString();
                }
            }
        }

        return typeFullName;
    };

    NewType.prototype.getTypeName = function (object) {
        var typeName;
        typeName = null;

        if (object && object.hasOwnProperty('_Function')) {
            if (object._Function.hasOwnProperty('typeName')) {
                if (typeof object._Function.typeName === 'string') {
                    typeName = object._Function.typeName.toString();
                }
            }
        }

        return typeName;
    };

    NewType.prototype.isInstance = function (object, type) {
        var typeFullName;

        if (typeof type === 'string') {
            typeFullName = type.toString();
        } else {
            if (object instanceof type) {
                return true;
            }

            typeFullName = this.getTypeFullName(type).toString();

            if (typeFullName === null) {
                return false;
            }
        }

        return object.hasOwnProperty('_' + typeFullName);
    };

    NewType.shared = {};
    NewType._Function.typeFullName = newTypeTypeFullName.toString();
    NewType._Function.typeName = 'NewType';

    (function () {
        var _, i, namespaceSplits, namespaceSplitsCount;
        _ = global;
        namespaceSplits = newTypeNamespace.toString().split('.');
        namespaceSplitsCount = namespaceSplits.length;

        for (i = 0; i < namespaceSplitsCount; ++i) {
            if (!_.hasOwnProperty(namespaceSplits[i])) {
                _[namespaceSplits[i]] = {};
            }

            _ = _[namespaceSplits[i]];
        }

        _.NewType = NewType;
    }());

    global.newType = new global.com.googlecode.myquicknet.base.NewType();
    global.newType._();
}(this));