//@ts-check
// Eval money types

import {
    assertDefined
} from "./utils.js";

import {
    AssetClass,
    Value
} from "./helios-data.js";

import {
    DataEntity,
    FuncType,
    GenericType
} from "./eval-common.js";

/**
 * @typedef {import("./eval-common.js").DataType} DataType
 */

import { 
    BoolType,
    ByteArrayType,
    IntType,
    StringType,
    genCommonInstanceMembers,
    genCommonTypeMembers
} from "./eval-primitives.js";

import {
    MapType$
} from "./eval-containers.js";

import { 
    MintingPolicyHashType
} from "./eval-hashes.js";

/**
 * Builtin AssetClass type
 * @package
 * @type {DataType}
 */
export var AssetClassType = new GenericType({
    name: "AssetClass",
    offChainType: AssetClass,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        mph: MintingPolicyHashType,
        token_name: ByteArrayType
    }),
    genTypeMembers: (self) => {
        const selfInstance = new DataEntity(assertDefined(self.asDataType));

        return {
            ...genCommonTypeMembers(self),
            ADA: selfInstance,
            new: new FuncType([MintingPolicyHashType, ByteArrayType], self)
        }
    }
});


/**
 * Builtin money Value type
 * @package
 * @type {DataType}
 */
export var ValueType = new GenericType({
    name: "Value",
    offChainType: Value,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        contains: new FuncType([self], BoolType),
        contains_policy: new FuncType([MintingPolicyHashType], BoolType),
        get: new FuncType([AssetClassType], IntType),
        get_assets: new FuncType([], ValueType),
        get_lovelace: new FuncType([], IntType),
        get_policy: new FuncType([MintingPolicyHashType], MapType$(ByteArrayType, IntType)),
        get_safe: new FuncType([AssetClassType], IntType),
        is_zero: new FuncType([], BoolType),
        show: new FuncType([], StringType),
        to_map: new FuncType([], MapType$(MintingPolicyHashType, MapType$(ByteArrayType, IntType)))
    }),
    genTypeMembers: (self) => {
        const selfInstance = new DataEntity(assertDefined(self.asDataType));

        return {
            ...genCommonTypeMembers(self),
            __add: new FuncType([self, self], self),
            __div: new FuncType([self, IntType], ValueType),
            __geq: new FuncType([self, ValueType], BoolType),
            __gt: new FuncType([self, ValueType], BoolType),
            __leq: new FuncType([self, ValueType], BoolType),
            __lt: new FuncType([self, ValueType], BoolType),
            __mul: new FuncType([self, IntType], ValueType),
            __sub: new FuncType([self, self], self),
            from_map: new FuncType([MapType$(MintingPolicyHashType, MapType$(ByteArrayType, IntType))], self),
            lovelace: new FuncType([IntType], self),
            new: new FuncType([AssetClassType, IntType], self),
            ZERO: selfInstance
        }
    }
});