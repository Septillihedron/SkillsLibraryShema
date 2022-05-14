import { EffectModes, ConditionModes } from "./PreprocessedSchema";
import { MonoTypeObject } from "./utils";

export {
	Schema, 
	Hero, Skill, Trigger, Condition, Effect, 
	Types, IfThenRefrence, 
	Property,
	SkillDefinition, ConditionDefinition, EffectDefinition
}

class Schema {

	readonly $schema = "http://json-schema.org/schema";
	readonly type = "object"
	readonly additionalProperties = false
	readonly minProperties = 1
	readonly patternProperties = {
		".*": {
			$ref: "#/definitions/hero"
		}
	}
	readonly definitions = {
		hero: new Hero(),
		skill: new Skill(),
		trigger: new Trigger(),
		condition: new Condition(),
		effect: new Effect()
	}
	readonly skills: MonoTypeObject<SkillDefinition> = {}
	readonly conditions: MonoTypeObject<ConditionDefinition> = {}
	readonly effects: MonoTypeObject<EffectDefinition> = {}

}

class Hero {
	readonly description = "Hero name"
	readonly type = "object"
	readonly additionalProperties = false
	readonly properties = {
		colouredName: {
			description: "The coloured name that will appear ingame",
			type: "string"
		},
		description: {
			description: "The description of the hero",
			type: "string"
		},
		skills: {
			description: "The list of skill that the hero has",
			type: "object",
			additionalProperties: false,
			patternProperties: {
				".*": {
					$ref: "#/definitions/skill"
				}
			}
		}
	}
}

class Types {
	readonly description: string
	static readonly type = "string"
	readonly enum: string[] = []

	addType(name: string): void {
		this.enum.push(name)
	}

	constructor(description: string) {
		this.description = description
	}
}

class IfThenRefrence {
	if: {properties: {type: {const: string}} | {skill: {const: string}}}
	then: {$ref: string}

	constructor(type: string, name: string) {
		this.if = {properties: type == "skill"? {skill:{const: name}} : {type: {const: name}}}
		this.then = {$ref: `#/${type}s/${name}`}
	}

}

class Skill {
	static readonly description = "A skill"
	static readonly type = "object"
	readonly properties = { skill: new Types("The type of the skill") }
	static readonly required = ["skill"]
	readonly allOf : IfThenRefrence[] = []

	addSkill(name: string): void {
		this.properties.skill.addType(name)
		this.allOf.push(new IfThenRefrence("skill", name))
	}
}

class Trigger {
	static readonly description = "The skill trigger"
	static readonly type = "object"
	readonly properties = {
		// type: new Types("The type of trigger"),
		type: {
			description: "The type of trigger",
			type: "string"
		},
		conditions: {
			description: "The list of conditions",
			type: "object",
			patternProperties: {
			".*": {
					$ref: "#/definitions/condition"
				}
			}
		}
	}
	static readonly required = ["type"]

	// addType(name: string): void {
	// 	this.properties.skill.addType(name)
	// 	this.allOf.push(new IfThenRefrence("skill", name))
	// }
}

class Condition {
	static readonly type = "object"
	static readonly additionalProperties = true
	readonly properties = {
		type: new Types("The type of the condition"),
		mode: {
			description: "The condition mode",
			type: "string"
		}
	}
	static readonly required = ["type", "mode"]
	readonly allOf: IfThenRefrence[] = []

	addType(name: string): void {
		this.properties.type.addType(name)
		this.allOf.push(new IfThenRefrence("condition", name))
	}
}

class Effect {
	static readonly type = "object"
	static readonly additionalProperties = true
	readonly properties = {
		type: new Types("The type of the effect"),
		mode: {
			description: "The effect mode",
			type: "string"
		}
	}
	static readonly required = ["type", "mode"]
	readonly allOf: IfThenRefrence[] = []

	addType(name: string): void {
		this.properties.type.addType(name)
		this.allOf.push(new IfThenRefrence("effect", name))
	}
}

type Property = {
	
}

class SkillDefinition {
	readonly properties: {
		skill: true,
		[key: string]: Property | boolean
	}
	required?: string[]
	static readonly additionalProperties = true

	constructor() {
		this.properties = { skill: true }
		this.required = []
	}

	addProperty(name: string, property: Property, required?: true): void {
		this.properties[name] = property
		if (required) {
			if (this.required === undefined) this.required = []
			this.required.push(name)
		}
	}

}

class ConditionDefinition {
	readonly properties: {
		type: true,
		mode?: {enum: ConditionModes[]},
		[key: string]: Property | boolean | undefined
	}
	required?: string[]
	static readonly additionalProperties = false
	
	constructor(modes: ConditionModes[]) {
		this.properties = { type: true, mode: { enum: modes } }
	}

	addProperty(name: string, property: Property, required?: true): void {
		this.properties[name] = property
		if (required) {
			if (this.required === undefined) this.required = []
			this.required.push(name)
		}
	}
}

class EffectDefinition {
	readonly properties: {
		type: true,
		mode?: {enum: EffectModes[]},
		[key: string]: Property | boolean | undefined
	}
	required?: string[]
	static readonly additionalProperties = false

	constructor(modes: EffectModes[]) {
		this.properties = { type: true, mode: { enum: modes } }
	}

	addProperty(name: string, property: Property, required?: true): void {
		this.properties[name] = property
		if (required) {
			if (this.required === undefined) this.required = []
			this.required.push(name)
		}
	}
}
