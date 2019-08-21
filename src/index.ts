import * as fs from "fs";
import * as yaml from "js-yaml";

interface ITranslation {
    key: string;
    references: string[];
}

function extractUnityTranslations(files: string[], variables: string[]): ITranslation[] {
    const translations: { [key: string]: ITranslation } = {};

    for (const file of files) {
        // Prepare Unity YAML to be properly parsed (Unity YAML is not valid YAML)
        let input = fs.readFileSync(file, "utf8");
        input = input.replace(/^--- !u!.+$/gm, "---");

        // Split YAML per document
        const documents = input.split(/^---/m);

        // Parse everything
        for (let i = 1; i < documents.length; ++i) {
            const document = "---" + documents[i];

            // Calculate offset from beginning of the document
            let offset = 0;
            for (let j = 0; j < i; ++j) {
                offset += documents[j].split("\n").length - 1;
            }

            // Parse YAML
            const parsed = yaml.safeLoad(document);
            for (const key of Object.keys(parsed)) {
                const obj = parsed[key];
                for (const variable of variables) {
                    if (variable in obj) {
                        // Find line number
                        const index = document.indexOf(variable + ":");
                        let line = offset;
                        if (index >= 0) {
                            line += document.substr(0, index).split("\n").length;
                        }

                        // Invalid text values
                        if (typeof obj[variable] !== "string") {
                            // tslint:disable-next-line:no-console
                            console.warn(`Invalid text value '${obj[variable]}' in '${file}:${line}'`);
                            continue;
                        }

                        // Add or update translation
                        const text = obj[variable].trim();
                        const ref = file + ":" + line;
                        if (text in translations) {
                            translations[text].references.push(ref);
                        } else {
                            translations[text] = { key: text, references: [ref] };
                        }
                    }
                }
            }
        }
    }

    return Object.values(translations);
}

function escapePotString(str: string): string {
    return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\t/g, "\\t")
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
}

export default function xgettextUnity(files: string[], variables: string[], outputFile: string) {
    const translations = extractUnityTranslations(files, variables);

    let pot = "";
    for (const translation of translations) {
        if (pot.length > 0) {
            pot += "\n";
        }
        if (translation.references && translation.references.length > 0) {
            pot += "#: " + translation.references.join(" ") + "\n";
        }
        pot += `msgid "${escapePotString(translation.key)}"\nmsgstr ""\n`;
    }

    fs.writeFileSync(outputFile, pot);
}
