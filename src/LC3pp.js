import {
    convertCompare,
    invertCompare,
    validateArgs,
    transform, incrementLabelCount, getLabelCount, alias,
} from "./Utils";
import LC3 from "./LC3";

const LC3pp = new Map();

LC3pp.set("HELP", (data) => {return ";; https://github.com/jeffreyzhang2002/LC3AssemblyTemplates/blob/master/README.md"})

LC3pp.set("DEBUG", (data) => {return ";; https://wchargin.com/lc3web/#"})

LC3pp.set("GOTO", (data) => {
    const error = validateArgs(data, 2, "GOTO [DEST] [LABEL]", ["CMD", "LABEL"]);
    if(error) {return error;}

    return `BRNZP ${data.tokens[1]}`;
})

LC3pp.set("MULT", (data)=> {
    const error = validateArgs(data, 4, "MULT [DEST] [SRC] [LIT]",
        ["CMD", "REG", "REG", "LIT"]);
    if(error) { return error; }

    if(data.tokens[1] == data.tokens[2]) {
        return ";; REGISTER CAN NOT BE THE SAME"
    }

    let output = `;; ======${data.line}======\n`
               + `AND ${data.tokens[1]}, ${data.tokens[1]}, 0\n`;

    for(let i = +data.tokens[3]; i > 0; i--) {
        output += `ADD ${data.tokens[1]}, ${data.tokens[1]}, ${data.tokens[2]}\n`
    }

    output += ";; ======" + "=".repeat(data.line.length) + "======\n";
    return output;
})

LC3pp.set("SUB", (data) => {
    const error = validateArgs(data, 4, "SUB [DEST] [SRC] [SRC/LIT]",
        ["CMD", "REG", "REG", ["REG", "LIT"]]);
    if(error) { return error; }

    if(!+data.tokens[3] || (+data.tokens[3] <= 15 && +data.tokens[3] >= -16) ) {
        return `;; ======${data.line}======\n`
            +  `NOT ${data.tokens[3]}, ${data.tokens[3]}\n`
            +  `ADD ${data.tokens[3]}, ${data.tokens[3]}, 1\n`
            +  `ADD ${data.tokens[1]}, ${data.tokens[2]}, ${data.tokens[3]}\n`
            +  `NOT ${data.tokens[3]}, ${data.tokens[3]}\n`
            +  `ADD ${data.tokens[3]}, ${data.tokens[3]}, 1\n`
            +   ";; ======" + "=".repeat(data.line.length) + "======";
    } else  {
        let amount;
        let output = `;; ======${data.line}======\n`

        data.tokens[3] = -+data.tokens[3];

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
})

LC3pp.set("MOV", (data) => {

    const error = validateArgs(data, 3, "MOV [DEST_REG] [SRC_REG]",
        ["CMD", "REG", "REG"])
    if(error) { return error }

    return `ADD ${data.tokens[1]}, ${data.tokens[2]}, 0 ;;${data.tokens[1]} = ${data.tokens[2]}`
})

LC3pp.set("OR", (data) => {

    const error = validateArgs(data, 4, "OR [REG] [REG] [REG]",
        ["CMD", "REG", "REG", "REG"])
    if(error) { return error }

    return `;; ======${data.line}======\n`
        +  `NOT ${data.tokens[2]}, ${data.tokens[2]}\n`
        +  `NOT ${data.tokens[3]}, ${data.tokens[3]}\n`
        +  `AND ${data.tokens[1]}, ${data.tokens[2]}, ${data.tokens[3]}\n`
        +  `NOT ${data.tokens[1]}, ${data.tokens[1]}\n`
        +  `NOT ${data.tokens[2]}, ${data.tokens[2]}\n`
        +  `NOT ${data.tokens[3]}, ${data.tokens[3]}\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;

})

LC3pp.set("IF", (data) => {
    const error = validateArgs(data, 5, "IF [REG] (CMP) [REG] [DEL] ?{}",
        ["CMD", "REG", "CMP", "REG", "REG"])
    if(error) { return error }

    const body = data.children.length? transform(data.children[0]) : ";; CODE IF TRUE\n"
    return `;; ======${data.line}======\n`
        +  ";; Setting NZP WITH 2's Complement\n"
        +  `NOT ${data.tokens[4]}, ${data.tokens[3]}\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[4]}, 1\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[1]}, ${data.tokens[4]}\n`
        +  `${convertCompare(invertCompare(data.tokens[2]))} END_IF_${getLabelCount()}\n\n`
        +  `${body}\n`
        +  `END_IF_${incrementLabelCount()}\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("IFELSE", (data) => {
    const error = validateArgs(data, 5, "IF [REG] (CMP) [REG] [DEL] ?{}",
        ["CMD", "REG", "CMP", "REG", "REG"])
    if(error) { return error }

    const truebody = data.children.length? transform(data.children[0]) : ";; CODE IF TRUE\n"
    const falsebody = data.children.length == 2? transform(data.children[1]) : ";; CODE IF FALSE\n"

    return `;; ======${data.line}======\n`
        +  ";; Setting NZP WITH 2's Complement\n"
        +  `NOT ${data.tokens[4]}, ${data.tokens[3]}\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[4]}, 1\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[1]}, ${data.tokens[4]}\n`
        +  `${convertCompare(invertCompare(data.tokens[2]))} ELSE_${getLabelCount()}\n\n`
        +  `${truebody}\n`
        +  `BRNZP END_IF_${getLabelCount()}\n`
        +  `ELSE_${getLabelCount()}\n\n`
        +  `${falsebody}\n`
        +  `END_IF_${incrementLabelCount()}\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("WHILE", (data) => {
    const error = validateArgs(data, 5, "WHILE [REG] (CMP) [REG] [DEL] ?{}",
        ["CMD", "REG", "CMP", "REG", "REG"])
    if(error) { return error }

    const body = data.children.length? transform(data.children[0]) : ";; CODE IF TRUE\n"
    return `;; ======${data.line}======\n`
        +  ";; Setting NZP WITH 2's Complement\n"
        +  `BEGIN_WHILE_${getLabelCount()}\n`
        +  `NOT ${data.tokens[4]}, ${data.tokens[3]}\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[4]}, 1\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[1]}, ${data.tokens[4]}\n`
        +  `${convertCompare(invertCompare(data.tokens[2]))} END_WHILE_${getLabelCount()}\n\n`
        +  `${body}\n`
        +   `BRNZP BEGIN_WHILE_${getLabelCount()}\n`
        +  `END_WHILE_${incrementLabelCount()}\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("DOWHILE", (data) => {
    const error = validateArgs(data, 5, "DOWHILE [REG] (CMP) [REG] [DEL] ?{}",
        ["CMD", "REG", "CMP", "REG", "REG"])
    if(error) { return error }

    const body = data.children.length? transform(data.children[0]) : ";; CODE IF TRUE\n"
    return `;; ======${data.line}======\n`
        +  `BEGIN_DO_WHILE_${getLabelCount()}\n`
        +  `${body}\n`
        +  ";; Setting NZP WITH 2's Complement\n"
        +  `NOT ${data.tokens[4]}, ${data.tokens[3]}\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[4]}, 1\n`
        +  `ADD ${data.tokens[4]}, ${data.tokens[1]}, ${data.tokens[4]}\n`
        +  `${convertCompare(invertCompare(data.tokens[2]))} BEGIN_DO_WHILE_${incrementLabelCount()}\n\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("BUILDSTACK", (data) => {

    const error = validateArgs(data, 1, "BUILDSTACK ?(#LOCAL VAR)",
        ["CMD"])
    if(error) { return error }

    return `;; ======${data.line}======\n`
        +  "ADD R6, R6, -4 \n"
        +  "STR R7, R6, #2 \n"
        +  "STR R5, R6, #1 \n"
        +  "ADD R5, R6, #0 \n"
        +  `ADD R6, R6, -${((+data.tokens[1]) > 1? (+data.tokens[1]) : 1) + 4}\n`
        +  "STR R0, R6, #4\n"
        +  "STR R1, R6, #3\n"
        +  "STR R2, R6, #2\n"
        +  "STR R3, R6, #1\n"
        +  "STR R4, R6, #0\n"
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("TEARSTACK", (data) => {

    const error = validateArgs(data, 2, "TEARSTACK [RETURN REG]",
        ["CMD", "REG"])
    if(error) { return error }

    return `;; ======${data.line}======\n`
        +  `STR ${data.tokens[1]}, R5, #3\n`
        +  "LDR R4, R6, #0\n"
        +  "LDR R3, R6, #1\n"
        +  "LDR R2, R6, #2\n"
        +  "LDR R1, R6, #3\n"
        +  "LDR R0, R6, #4\n"
        +  "ADD R6, R5, #0\n"
        +  "LDR R5, R6, #1\n"
        +  "LDR R7, R6, #2\n"
        +  "ADD R6, R6, #3\n"
        +  "RET\n"
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("CALL", (data) => {

    const error = validateArgs(data, 3, "CALL [REG] [LABEL] ?[REG...]",
        ["CMD", "REG", "LABEL"])
    if(error) { return error }


    const argCount = data.tokens.length - 3;

    let output = `;; ======${data.line}======\n` +
                 `ADD R6, R6, -${argCount}\n`

    let j = 0;
    for(let i = 3; i < data.tokens.length; i++) {
        const reg = alias.get(data.tokens[i]);
        if(!reg)
            return `;; UNEXPECTED VAL => ${data.tokens[i]}`

        output += `STR ${reg}, R6, ${j++}\n`
    }

    output += `JSR ${data.tokens[2]}\n`
            + `LDR ${data.tokens[1]}, R6, 0\n`
            + `ADD R6, R6, ${argCount + 1}\n`
            +  `;; ======${"=".repeat(data.line.length)}======\n`;
    return output;
})

LC3pp.set("ARG", (data) => {
    const error = validateArgs(data, 3, "ARG [REG] [LIT]",
        ["CMD", "REG", "LIT"])
    if(error) { return error }

    return `LDR ${data.tokens[1]}, R5, ${+data.tokens[2] + 3}   ;; ${data.tokens[1]} = ARG ${+data.tokens[2] + 3}`;
})

LC3pp.set("DEREF", (data) => {

    const error = validateArgs(data, 2, "DEREF [REG]",
        ["CMD", "REG"])
    if(error) { return error }

    return `LDR ${data.tokens[1]}, ${data.tokens[1]}, 0`
})

LC3pp.set("SET", (data) => {
    const error = validateArgs(data, 3, "SET [REG] [LIT]",
        ["CMD", "REG", "LIT"])
    if(error) { return error; }

    let body = "";
    if(+data.tokens[2] != "0") {
       body = LC3.get("ADD")({line: `ADD R1 R1 ${+data.tokens[2]}`, tokens: ["ADD", "R1", "R1", +data.tokens[2]], children: undefined})
    }

    return `;; ======${data.line}======\n`
        +  `AND ${data.tokens[1]}, ${data.tokens[1]}, 0\n`
        +  `${body}\n`
        +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("LV", (data) => {
    const error = validateArgs(data, 3, "LV [REG|LIT] [LIT|REG]", ["CMD", ["REG", "LIT"], ["REG", "LIT"]]);
    if(error) {return error; }

    if(data.tokens[1][0] == "R" && data.tokens[2][0] == "R" || +data.tokens[1] && +data.tokens[2]) {
        return `;; ERR MUST BE LV [REG] [LIT] or LV [LIT] [REG]`;
    }

    let cmd = `STR ${data.tokens[2]}, R5, ${-(data.tokens[1] - 1)}\n`;
    if(data.tokens[1][0] == "R") {
        cmd = `LDR ${data.tokens[1]}, R5, ${-(data.tokens[2] - 1)}\n`;
    }

    return `;; ======${data.line}======\n`
    +  cmd
    +  `;; ======${"=".repeat(data.line.length)}======\n`;
})

LC3pp.set("CLR", (data) => {
    const error = validateArgs(data, 2, "CLR [REG]", ["CMD", "REG"]);
    if(error) {return error; }

    return `AND ${data.tokens[1]}, ${data.tokens[1]}, 0`
})

LC3pp.set("TYPEDEF", (data) => {
    const error = validateArgs(data, 3, "TYPEDEF [REG] [LABEL]", ["CMD", "REG", "LAB"]);
    if(error) {return error; }

    alias.set(data.tokens[2], data.tokens[1]);

    return `;; ${data.tokens[2]} is ${data.tokens[1]}`
})

LC3pp.set("ARR", (data) => {
    const error = validateArgs(data, 3, "ARR [REG] [REG|LABEL] [LIT]", ["CMD", "REG", ["REG","LABEL"], "LIT"]);
    if(error) {return error; }

    let output = `;; ======${data.line}======\n`;

    if (!data.tokens[2][0] == "R" || !+data.tokens[2][1])
        output += `LEA ${data.tokens[1]}, ${data.tokens[2]}\n`;

    return output + `LDR ${data.tokens[1]}, ${data.tokens[1]}, ${data.tokens[3]}\n` + `;; ======${"=".repeat(data.line.length)}======\n`;
})

export default LC3pp;
