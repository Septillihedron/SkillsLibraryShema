import { StringRecord } from "./utils"

export {
	Schema,  
	PropertyMap,
	PropertyTypes,   
	Property, 

	Mode, Item, 
}

interface Schema {
	triggers: StringRecord<Item>
	conditions: StringRecord<Item>
	effects: StringRecord<Item>

	particleShapes: StringRecord<Item>
	entityData: StringRecord<Item>

	skills: StringRecord<Item>

	damagemodifiers: StringRecord<Item>
	rewards: StringRecord<Item>
	
	distributions: StringRecord<Item>

	types: StringRecord<Property>
}

interface Descriptable {
	description: string
}

type PropertyMap = StringRecord<Property>

type Plugins = "Superheroes" | "SuperheroesPlusUltra" | "EnchantedBosses" | "EnchantedCombat"

type Mode = "SELF" | "OTHER" | "LOCATION" | "ITEM" | "ALL"
interface Item extends Descriptable {
	properties?: PropertyMap
	supportedModes?: Mode[]
	requireMode: boolean
	exclusiveTo?: Plugins
}

type PropertyStringTypes = "string" | "range" | "comparison" | "operation" | "entity" | "block" | "item" | "enchantment" | "potion" | "biome" | "world" | "equipmentSlot" | "attribute" | "sound" | "condition" | "effect"
type PropertyTypes = PropertyStringTypes | "array" | "object" | "record" | "string" | "number" | "integer" | "boolean"
type PropertyType = PropertyTypes | PropertyTypes[]

type PropertiesMap = {
	key: { type: PropertyType } & Descriptable
	value: Property
}

interface Property extends Descriptable {
	default?: any
	required: boolean
	type: PropertyType
	min?: number
	max?: number
	items?: PropertyType | Property
	recordItem?: PropertyTypes
	properties?: PropertyMap
	patternProperties?: PropertyMap
	propertiesMap?: PropertiesMap
	requireEnum?: boolean
	enum?: any[]
	pattern?: string
}
