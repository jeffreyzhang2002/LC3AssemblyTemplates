import {validateArgs} from "./Utils";
import LC3pp from "./LC3pp";

const LC3 = new Map();

function AND_converter(data) {

    const error = validateArgs(data, 3, `${data.tokens[0]} [REG] [REG] [REG|LIT]`, ["CMD", "REG", "REG", ["REG", "LIT"]]);
    if(error) { return error; }

    return `${data.tokens[0]} ${data.tokens[1]}, ${data.tokens[2]}, ${data.tokens[3]}`
}

function ADD_converter(data) {

    const error = validateArgs(data, 4, "ADD [DEST] [SRC] [SRC/LIT]",
        ["CMD", "REG", "REG", ["REG", "LIT"]]);
    if(error) { return error; }

    if(!+data.tokens[3] || (+data.tokens[3] <= 15 && +data.tokens[3] >= -16) ) {
        return `ADD ${data.tokens[1]}, ${data.tokens[2]}, ${data.tokens[3]}`
    } else  {
        let amount;
        let output = `;; ======${data.line}======\n`

        if(+data.tokens[3] > 0) {
            output += `ADD ${data.tokens[1]}, ${data.tokens[2]}, 15\n`;

            for(amount = +data.tokens[3] - 15; amount - 15 >= 0; amount -= 15)
                output += `ADD ${data.tokens[1]}, ${data.tokens[1]}, 15\n`;

            if(amount > 0)
                output += `ADD ${data.tokens[1]}, ${data.tokens[1]}, ${amount}\n`;

        } else {
            output += `ADD ${data.tokens[1]}, ${data.tokens[2]}, -16\n`;

            for(amount = +data.tokens[3] + 16; amount + 16 <= 0; amount += 16)
                output += `ADD ${data.tokens[1]}, ${data.tokens[1]}, -16\n`;

            if(amount < 0)
                output += `ADD ${data.tokens[1]}, ${data.tokens[1]}, ${amount}\n`;
        }

        output += `;; ======${"=".repeat(data.line.length)}======\n`;
        return output;
    }
}

function NOT_converter(data) {
    const error = validateArgs(data, 2, `${data.tokens[0]} [REG] [REG]`, ["CMD", "REG", "REG"]);
    if(error) { return error; }

    return `${data.tokens[0]} ${data.tokens[1]}, ${data.tokens[2]}`
}

function BR_converter(data) {
    const error = validateArgs(data, 2, `${data.tokens[0]} [LABEL]`, ["CMD", "LABEL"]);
    if(error) { return error; }

    return `${data.tokens[0]} ${data.tokens[1]}`
}

function JMP_converter(data) {
    const error = validateArgs(data, 2, `${data.tokens[0]} [LABEL]`, ["CMD", "REG"]);
    if(error) { return error; }

    return `${data.tokens[0]} ${data.tokens[1]}`
}

function LEA_converter(data) {
    const error = validateArgs(data, 3, `${data.tokens[0]} [REG] [LABEL]`, ["CMD", "REG", "LAB"]);
    if(error) { return error }

    return `${data.tokens[0]} ${data.tokens[1]}, ${data.tokens[2]}`
}

function LDR_converter(data) {
    const error = validateArgs(data, 4, `${data.tokens[0]} [REG] [REG] [LIT]`,
        ["CMD", "REG", "REG", "LIT"]);
    if(error) { return error }

    return `${data.tokens[0]} ${data.tokens[1]}, ${data.tokens[2]}, ${data.tokens[3]}`
}

function TRAP_converter(data) {
    const error = validateArgs(data, 2, `${data.tokens[0]} [LABEL]`, ["CMD", "LIT"]);
    if(error) { return error; }

    return `${data.tokens[0]} ${data.tokens[1]}`
}

LC3.set("AND",  AND_converter);
LC3.set("ADD",  ADD_converter);
LC3.set("NOT",  NOT_converter);

LC3.set("BR",   BR_converter );
LC3.set("BRN",  BR_converter);
LC3.set("BRZ",  BR_converter);
LC3.set("BRP",  BR_converter);
LC3.set("BRNZ", BR_converter);
LC3.set("BRZP", BR_converter);
LC3.set("BRNP", BR_converter);
LC3.set("BRNZP",BR_converter);

LC3.set("JMP",  JMP_converter);
LC3.set("JSR",  BR_converter);
LC3.set("JSSR", JMP_converter);

LC3.set("LD",  LEA_converter);
LC3.set("LDI", LEA_converter);
LC3.set("LDR", LDR_converter);
LC3.set("LEA", LEA_converter);

LC3.set("ST",  LEA_converter);
LC3.set("STI", LEA_converter);
LC3.set("STR", LDR_converter);

LC3.set("TRAP", TRAP_converter);

LC3pp.set("LABEL", (data) => {
    const error = validateArgs(data, 2, "LABEL [LABEL]", ["CMD", "LAB"]);
    if(error) {return error; }

    return `${data.tokens[1]}`;
})

LC3pp.set(".ORIG", (data) => {
    return data.line;
})

LC3pp.set(".BLKW", (data) => {
    return data.line;
})

LC3pp.set(".END", (data) => {
    return data.line;
})

LC3pp.set(".FILL", (data) => {
    return data.line;
})

LC3pp.set(".STRINGZ", (data) => {
    return data.line;
})


export default LC3;
