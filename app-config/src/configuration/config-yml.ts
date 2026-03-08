import {z} from "zod"
import {readFileSync} from "node:fs"
import {join} from "node:path"
import * as yaml from "js-yaml"

const YAML_CONFIG_FILENAME = "config.yml"

const schema = z.object({
    PORT: z.coerce.number(),
    DATABASE: z.object({
        USER: z.string(),
        PASSWORD: z.string()
    })
})

export type EnvYaml = z.infer<typeof schema>

export const configYml = () => {
    const fileContent = readFileSync(join(__dirname, "../..", YAML_CONFIG_FILENAME), "utf-8")

    const response = yaml.load(fileContent) as EnvYaml

    const parsedConfig = schema.safeParse(response)

    console.log("parsedConfig", parsedConfig)

    if (!parsedConfig.success) {
        console.error("Error parsing YAML config:", parsedConfig.error)
        throw new Error("Invalid YAML configuration")
    }

    return parsedConfig.data
    //return schema.parse(response)
}