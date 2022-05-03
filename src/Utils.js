import LC3 from "./LC3";
import LC3pp from "./LC3pp";

export const alias = new Map();
export const reserved = new Set()
export let labelCount = 0;

function resetAlias() {
    alias.clear()
    alias.set("R0", "R0");
    alias.set("R1", "R1");
    alias.set("R2", "R2");
    alias.set("R3", "R3");
    alias.set("R4", "R4");
    alias.set("R5", "R5");
    alias.set("R6", "R6");
    alias.set("R7", "R7");
}

export function parser(content) {
    const lines = content.toUpperCase().split("\n");
    return _parser(lines, 0)[1]
}

function _parser(lines, index) {
    let asmTree = [];

    while(index < lines.length) {

        const line = lines[index].trim();

        if(line === "}") {
            return [index + 1, asmTree]
        } else if(line === "{") {
            const result = _parser(lines, index + 1)
            asmTree.at(-1)["children"].push(result[1])
            index = result[0];
        } else {
            asmTree.push({line: line, children: [], tokens: line.split(/,\s|\s|,/)})
            index++;
        }
    }

    return [index, asmTree];
}

export function transform(asmTree) {

    labelCount = 0;
    resetAlias();
    let output = ""

    for(let i = 0; i < asmTree.length; i++) {

        if(!asmTree[i].line || asmTree[i].line.startsWith(";")) {
            output += `${asmTree[i].line}\n`;
            continue;
        }

        const converter = LC3.get(asmTree[i].tokens[0]) || LC3pp.get(asmTree[i].tokens[0])

        if(!converter) {
            output += `;; UNKNOWN CMD => ${asmTree[i].line}\n`
        } else {
            output += converter(asmTree[i]) + "\n";
        }
    }

    return output;
}

export function invertCompare(cmp) {
    switch (cmp) {
        case "==":
            return "!=";
        case "<":
            return ">=";
        case ">":
            return "<=";
        case "<=":
            return ">";
        case ">=":
            return "<";
    }
}

export function convertCompare(cmp) {
    switch (cmp) {
        case "<":
            return "BRN";
        case ">":
            return "BRP";
        case "==":
            return "BRZ";
        case "!=":
            return "BRNP";
        case "<=":
            return "BRNZ";
        case ">=":
            return "BRNP";
    }
}

function convertArgs(data, index, action) {
    switch (action) {
        case "REG":
            data.tokens[index] = alias.get(data.tokens[index]) || data.tokens[index];
            return !alias.has(data.tokens[index]);

        case "CMP":
            return ![">", "<", ">=", "<=", "==", "!="].includes(data.tokens[index]);

        case "LIT":
            return !Number.isInteger(+data.tokens[index]);

        case "LAB":
        case "LABEL":
            return +data.tokens[index] || alias.has(data.tokens[index]);

        case "CMD":
            return false;
    }
}

export function validateArgs(data, argv, correct, template) {
    if(data.tokens.length < argv) {
        return `;; ARG COUNT ERR! EXPECTED: ${correct} GOT ${data.line}\n`;
    }

    top: for(let i = 1; i < template.length; i++) {
        if(Array.isArray(template[i])) {
            for(let j = 0; j < template[i].length; j++)
                if(!convertArgs(data, i, template[i][j]))
                    continue top;

            return `;; UNEXPECTED VAL => ${data.tokens[i]}`
        } else {
            if(convertArgs(data, i, template[i])) {
                return `;; UNEXPECTED VAL => ${data.tokens[i]}`
            }
        }
    }
}

export function getLabelCount() {
    return labelCount;
}

export function incrementLabelCount() {
    let temp = labelCount;
    labelCount++;
    return temp;
}
