//@ts-check
// Eval primitive types

import {
	Bool,
	ByteArray,
	HString,
	HInt
} from "./helios-data.js";

import {
    FuncType,
    GenericType
} from "./eval-common.js";

/**
 * @typedef {import("./eval-common.js").DataType} DataType
 */

/**
 * @typedef {import("./eval-common.js").Type} Type
 */

/**
 * @typedef {import("./eval-common.js").InstanceMembers} InstanceMembers
 */

/**
 * @typedef {import("./eval-common.js").TypeMembers} TypeMembers
 */

/**
 * @package
 * @param {Type} type
 * @returns {InstanceMembers}
 */
export function genCommonInstanceMembers(type) {
    return {
        serialize: new FuncType([], ByteArrayType),
    }
}

/**
 * @package
 * @param {Type} type
 * @returns {TypeMembers}
 */
export function genCommonTypeMembers(type) {
    return {
        __eq:      new FuncType([type, type], BoolType),
        __neq:     new FuncType([type, type], BoolType),
        from_data: new FuncType([RawDataType], type),
        __to_data: new FuncType([type], RawDataType),
    }
}

/**
 * Builtin bool type
 * @package
 * @type {DataType}
 */
export const BoolType = new GenericType({
    name: "Bool",
    offChainType: Bool,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        show:      new FuncType([], StringType),
        to_int:    new FuncType([], IntType),
        trace:     new FuncType([StringType], self)
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self),
        __and:     new FuncType([self, self], self),
        __neq:     new FuncType([self, self], self),
        __not:     new FuncType([self], self),
        __or:      new FuncType([self, self], self),
        and:       new FuncType([new FuncType([], self), new FuncType([], self)], self),
        or:        new FuncType([new FuncType([], self), new FuncType([], self)], self)
    })
});

/**
 * Builtin bytearray type
 * @package
 * @type {DataType}
 */
export const ByteArrayType = new GenericType({
    name: "ByteArray",
    offChainType: ByteArray,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        blake2b: new FuncType([], self),
        decode_utf8: new FuncType([], StringType),
        ends_with: new FuncType([self], BoolType),
        length: IntType,
        prepend: new FuncType([IntType], self),
        sha2: new FuncType([], self),
        sha3: new FuncType([], self),
        show: new FuncType([], StringType),
        slice: new FuncType([IntType, IntType], self),
        starts_with: new FuncType([self], BoolType),
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self),
        __add: new FuncType([self, self], self),
        __geq: new FuncType([self, self], BoolType),
        __gt: new FuncType([self, self], BoolType),
        __leq: new FuncType([self, self], BoolType),
        __lt: new FuncType([self, self], BoolType)
    })
});

/**
 * @package
 * @type {DataType}
 */
export const IntType = new GenericType({
    name: "Int",
    offChainType: HInt,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        abs: new FuncType([], self),
        bound: new FuncType([self, self], self),
        bound_max: new FuncType([self], self),
        bound_min: new FuncType([self], self),
        decode_zigzag: new FuncType([], self),
        encode_zigzag: new FuncType([], self),
        show: new FuncType([], StringType),
        to_base58: new FuncType([], StringType),
        to_big_endian: new FuncType([], ByteArrayType),
        to_bool: new FuncType([], BoolType),
        to_hex: new FuncType([], StringType),
        to_little_endian: new FuncType([], ByteArrayType),
        to_real: new FuncType([], RealType)
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self),
        __add: new FuncType([self, self], self),
        __add1: new FuncType([self, RealType], RealType),
        __div: new FuncType([self, self], self),
        __div1: new FuncType([self, RealType], RealType),
        __geq: new FuncType([self, self], BoolType),
        __gt: new FuncType([self, self], BoolType),
        __leq: new FuncType([self, self], BoolType),
        __lt: new FuncType([self, self], BoolType),
        __mod: new FuncType([self, self], self),
        __mul: new FuncType([self, self], self),
        __mul1: new FuncType([self, RealType], RealType),
        __neg: new FuncType([self], self),
        __pos: new FuncType([self], self),
        __sub: new FuncType([self, self], self),
        __sub1: new FuncType([self, RealType], RealType),
        from_base58: new FuncType([StringType], self),
        from_big_endian: new FuncType([ByteArrayType], self),
        from_little_endian: new FuncType([ByteArrayType], self),
        max: new FuncType([self, self], self),
        min: new FuncType([self, self], self),
        parse: new FuncType([StringType], self),
        sqrt: new FuncType([self], self)
    })
});

/**
 * Type of external data that must be cast/type-checked before using
 * Not named 'Data' in Js because it's too generic
 * @package
 * @type {DataType}
 */
export const RawDataType = new GenericType({
    name: "Data",
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        tag: IntType
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self)
    })
});

/**
 * Builtin Real fixed point number type
 * @package
 * @type {DataType}
 */
export const RealType = new GenericType({
    name: "Real",
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        abs: new FuncType([], self),
        ceil: new FuncType([], IntType),
        floor: new FuncType([], IntType),
        round: new FuncType([], IntType),
        show: new FuncType([], StringType),
        trunc: new FuncType([], IntType)
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self),
        __add: new FuncType([self, self], self),
        __add1: new FuncType([self, IntType], self),
        __div: new FuncType([self, self], self),
        __div1: new FuncType([self, IntType], self),
        __eq1: new FuncType([self, IntType], BoolType),
        __geq: new FuncType([self, self], BoolType),
        __geq1: new FuncType([self, IntType], BoolType),
        __gt: new FuncType([self, self], BoolType),
        __gt1: new FuncType([self, IntType], BoolType),
        __leq: new FuncType([self, self], BoolType),
        __leq1: new FuncType([self, IntType], BoolType),
        __lt: new FuncType([self, self], BoolType),
        __lt1: new FuncType([self, IntType], BoolType),
        __mul: new FuncType([self, self], self),
        __mul1: new FuncType([self, IntType], self),
        __neg: new FuncType([self], self),
        __neq1: new FuncType([self, IntType], BoolType),
        __pos: new FuncType([self], self),
        __sub: new FuncType([self, self], self),
        __sub1: new FuncType([self, IntType], self),
        sqrt: new FuncType([self], self)
    })
});

/**
 * Builtin string type
 * @package
 * @type {DataType}
 */
export const StringType = new GenericType({
    name: "String",
    offChainType: HString,
    genInstanceMembers: (self) => ({
        ...genCommonInstanceMembers(self),
        encode_utf8: new FuncType([], ByteArrayType),
        ends_with: new FuncType([self], BoolType),
        starts_with: new FuncType([self], BoolType)
    }),
    genTypeMembers: (self) => ({
        ...genCommonTypeMembers(self),
        __add: new FuncType([self, self], self)
    })
});