# LC3 ASSEMBLY TEMPLATES

GITHUB PAGES LINK: https://jeffreyzhang2002.github.io/LC3AssemblyTemplates/

**Disclamer: Use at your own risk. Generated LC3 code may have unforseen bugs**

## USE

LC3 assembly is a pain to program and debug in so I created so higher language constructs that will automatically be converted into LC3 assembly. 

To use the code, simply right commands on the left panel, and the LC3 assembly code should be generated on the right panel. 

Please note the generated code is not guaranteed to work for all cases. For example `LDR R1 R2 100000` will no be generated correctly because the offset is way to big. Certain instructions like `ADD` has been modified to take in very large numbers. `ADD R1 R2 100` will automatically be converted into a series of addition instructions.

## Custom LC3 Commands


|  #  | Command | Description | EXAMPLE | C |
| --- | --- | --- | --- | --- |
|1.|`SUB`|Subtracts two Register|`SUB R1, R2, R3`| `R1 = R2 - R3`|
|2.|`SUB`|Subtracts literal|`SUB R1, R2, 100`| `R1 = R2 - 100`|
|3.|`BUILDSTACK`| Builds the stack with 1 or more local variable|`BUILDSTACK` or `BUILDSTACK 1` or `BUILDSTACK 3`| `None`|
|4.|`TEARSTACK`| Tears the stack and returns value|`TEARSTACK R1` R1 holds return value| `return R1`|
|5.|`IF`| Generates I statment without else| `IF R1 < R2 R3` R3 is destroyed |`if(R1 < R2){}`|
|6.|`IFELSE`| Generates If else statment| `IFELSE R1 < R2 R3` R3 is destroyed |`if(R1 < R2){} else{}`|
|7.|`WHILE`| Generates while leep| `WHILE R1 < R2 R3` R3 is destroyed |`while(R1 < R2){}`|
|8.|`DOWHILE`| Generates do while leep| `DOWHILE R1 < R2 R3` R3 is destroyed |`do{} while(R1 < R2)`|
|9.|`CALL`| Call a function| `CALL R1 FUNCT R2 R3` R1 is return R2, R3 are args |`R1 = FUNCT(R2, R3);`|
|10.|`MOV`| moves variable | `MOV R1 R2` | `R1 = R2`|
|11.|`ARG`| gets argument from stack | `ARG R1 1`| `none`|
|12.|`LV`| gets local variable from stack | `LV R1 1` OR `LV 1 R`| `none`|
|13.|`CLR`| clears a register | `CLR R1`| `R1 = 0`|
|14.|`Set`| set register to value | `SET R1 10`| `R1 = 10`|
|15.|`DEREF`| dereferences memory | `DEREF R2 R1`| `R2 = *R1`|
|16.|`TYPEDEF`| names a register (experimental) | `TYPEDEF R1 TEST`| `none`|

If statments and while statments can also take a code block below
```
IF R1 < R2 R3
{

}

IFELSE R1 < R2 R3
{
  ;; IF True block
}
{
  ;; ELSE block
}

WHILE R1 < R2 R3
{

}
```

Valid Comparisons are `<, <=, >, >=, ==, !=`

## Notes
1. Comma between arguments are optional. They will automatically be put in
2. No Guarentee the code generated will work. For example, LDR R1 R2 10000000 will not work because the number is too large.
3. Currently only works with decimal numbers can be passed as an argument
4. \#, x, b, o can not be placed if front of numbers

## Built In LC3 commands

### LC3 commands
``TODO``

### Psudo commands
| # | Command | Description | Example|
| --- | --- | --- | --- |
|1.| `.ORIG`|Takes in an memory address|`.ORIG X300` |
|3.|`.FILL`|Fill memory with value|`.FILL 21`|
|4.|`.BLKW`|Allocate Block of memory|`.BLKW 100` |
|5.|`.STRINGZ`| Set a null terminated string literal |`.STRINGZ "Hello World"`|
|6.|`.END`|End of code|`.END`|

## License
MIT LICENSE

## ISSUES
Please use the issues tab if there is any problem with the code
