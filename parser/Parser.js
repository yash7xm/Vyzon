const { Tokenizer } = require("./Tokenizer.js");

class Parser {
    constructor() {
        this._string = "";
        this._tokenizer = new Tokenizer();
        this._lookahead = null;
        this._prevToken = null;
    }

    parse(string) {
        this._string = string;
        this._tokenizer.init(this._string);

        this._lookahead = this._tokenizer.getNextToken();
        this._prevToken = null;

        return this.Program();
    }

    Program() {
        const start = this._lookahead ? this._lookahead : { line: 1, column: 1, offset: 0 };
        const body = this.StatementList();

        return this._node(
            start,
            {
                type: "Program",
                body,
            },
            this._prevToken ?? start
        );
    }

    StatementList(stopLookAhead = null) {
        const statementList = [];

        if (
            this._lookahead == null ||
            this._lookahead.type === stopLookAhead
        ) {
            return statementList;
        }

        statementList.push(this.Statement());
        while (
            this._lookahead != null &&
            this._lookahead.type !== stopLookAhead
        ) {
            statementList.push(this.Statement());
        }

        return statementList;
    }

    Statement() {
        if (this._lookahead == null) {
            throw this._syntaxError("Unexpected end of input", this._prevToken);
        }

        switch (this._lookahead.type) {
            case "{":
                return this.BlockStatement();
            case ";":
                return this.EmptyStatement();
            case "let":
                return this.VariableStatement();
            case "if":
                return this.IfStatement();
            case "def":
                return this.FucntionDeclaration();
            case "return":
                return this.ReturnStatement();
            case "class":
                return this.ClassDeclaration();
            case "while":
            case "do":
            case "for":
                return this.IterationStatement();
            case "module":
                return this.ModuleStatement();
            case "import":
                return this.ImportStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    ImportStatement() {
        const startToken = this._lookahead;
        this._eat("import");
        const name = this.Identifier();

        return this._node(startToken, {
            type: "ImportStatement",
            name,
        });
    }

    ModuleStatement() {
        const startToken = this._lookahead;
        this._eat("module");
        const name = this.Identifier();
        const body = this.BlockStatement();

        return this._node(startToken, {
            type: "ModuleDeclaration",
            name,
            body,
        });
    }

    BlockStatement() {
        const startToken = this._lookahead;
        this._eat("{");
        const body =
            this._lookahead.type !== "}" ? this.StatementList("}") : [];
        this._eat("}");
        return this._node(startToken, {
            type: "BlockStatement",
            body,
        });
    }

    EmptyStatement() {
        const startToken = this._lookahead;
        this._eat(";");
        return this._node(startToken, {
            type: "EmptyStatement",
        });
    }

    VariableStatement() {
        const variableStatement = this.VariableStatementInit();
        this._eat(";");

        return variableStatement;
    }

    VariableStatementInit() {
        const startToken = this._lookahead;
        this._eat("let");
        const declarations = this.VariableDeclarationList();

        return this._node(startToken, {
            type: "VariableStatement",
            declarations,
        });
    }

    VariableDeclarationList() {
        const declarations = [];

        do {
            declarations.push(this.VariableDeclaration());
        } while (this._lookahead.type === "," && this._eat(","));

        return declarations;
    }

    VariableDeclaration() {
        const startToken = this._lookahead;
        const id = this.Identifier();

        const init =
            this._lookahead.type !== ";" && this._lookahead.type !== ","
                ? this.VariableInitilizer()
                : null;

        return this._node(startToken, {
            type: "VariableDeclaration",
            id,
            init,
        });
    }

    VariableInitilizer() {
        this._eat("SIMPLE_ASSIGN");
        return this.AssignmentExpression();
    }

    // IfStatement() {
    //     this._eat('if');
    //     this._eat('(');
    //     const test = this.Expression();
    //     this._eat(')');
    //     const consequent = this.Statement();

    //     let alternate = null;

    //     if (this._lookahead != null && this._lookahead.type === 'else') {
    //         this._eat('else');
    //         alternate = this.Statement();
    //     }

    //     return {
    //         type: 'IfStatement',
    //         test,
    //         consequent,
    //         alternate,
    //     }
    // }

    IfStatement() {
        const startToken = this._lookahead;
        this._eat("if");
        this._eat("(");
        const test = this.Expression();
        this._eat(")");
        const consequent = this.Statement();

        let alternate = null;

        alternate =
            this._lookahead != null ? this._CheckElifOrElseStatement() : null;

        return this._node(startToken, {
            type: "IfStatement",
            test,
            consequent,
            alternate,
        });
    }

    _CheckElifOrElseStatement() {
        if (this._lookahead == null) {
            return null;
        }

        switch (this._lookahead.type) {
            case "elif":
                return this.ElifStatement();
            case "else":
                return this.ElseStatement();
            default:
                return null;
        }
    }

    ElifStatement() {
        const startToken = this._lookahead;
        this._eat("elif");
        this._eat("(");
        const test = this.Expression();
        this._eat(")");
        const consequent = this.Statement();

        let alternate = null;
        alternate =
            this._lookahead != null ? this._CheckElifOrElseStatement() : null;

        return this._node(startToken, {
            type: "IfStatement",
            test,
            consequent,
            alternate,
        });
    }

    ElseStatement() {
        this._eat("else");
        return this.Statement();
    }

    IterationStatement() {
        if (this._lookahead == null) {
            return null;
        }

        switch (this._lookahead.type) {
            case "while":
                return this.WhileStatement();
            case "do":
                return this.DoWhileStatement();
            case "for":
                return this.ForStatement();
            default:
                return null;
        }
    }

    WhileStatement() {
        const startToken = this._lookahead;
        this._eat("while");
        this._eat("(");
        let test = this.Expression();
        this._eat(")");
        let body = this.Statement();

        return this._node(startToken, {
            type: "WhileStatement",
            test,
            body,
        });
    }

    DoWhileStatement() {
        const startToken = this._lookahead;
        this._eat("do");
        let body = this.Statement();
        this._eat("while");
        this._eat("(");
        let test = this.Expression();
        this._eat(")");
        this._eat(";");

        return this._node(startToken, {
            type: "DoWhileStatement",
            body,
            test,
        });
    }

    ForStatement() {
        const startToken = this._lookahead;
        this._eat("for");
        this._eat("(");

        let init =
            this._lookahead.type !== ";" ? this.InitForStatement() : null;
        this._eat(";");

        let test = this._lookahead.type !== ";" ? this.Expression() : null;
        this._eat(";");

        let update = this._lookahead.type !== ")" ? this.Expression() : null;
        this._eat(")");

        let body = this.Statement();

        return this._node(startToken, {
            type: "ForStatement",
            init,
            test,
            update,
            body,
        });
    }

    InitForStatement() {
        if (this._lookahead.type === "let") {
            return this.VariableStatementInit();
        }
        return this.Expression();
    }

    FucntionDeclaration() {
        const startToken = this._lookahead;
        this._eat("def");
        const name = this.Identifier();

        this._eat("(");
        const params =
            this._lookahead.type !== ")" ? this.FormalParameterList() : [];
        this._eat(")");

        const body = this.BlockStatement();

        return this._node(startToken, {
            type: "FunctionDeclaration",
            name,
            params,
            body,
        });
    }

    FormalParameterList() {
        let params = [];
        do {
            params.push(this.Identifier());
        } while (this._lookahead.type === "," && this._eat(","));

        return params;
    }

    ReturnStatement() {
        const startToken = this._lookahead;
        this._eat("return");
        let argument = this._lookahead.type !== ";" ? this.Expression() : null;
        this._eat(";");
        return this._node(startToken, {
            type: "ReturnStatement",
            argument,
        });
    }

    ClassDeclaration() {
        const startToken = this._lookahead;
        this._eat("class");
        const id = this.Identifier();

        const superClass =
            this._lookahead.type === "extends" ? this.ClassExtends() : null;

        const body = this.BlockStatement();

        return this._node(startToken, {
            type: "ClassDeclaration",
            id,
            superClass,
            body,
        });
    }

    ClassExtends() {
        this._eat("extends");
        return this.Identifier();
    }

    ExpressionStatement() {
        const startToken = this._lookahead;
        const expression = this.Expression();
        this._eat(";");
        return this._node(startToken, {
            type: "ExpressionStatement",
            expression,
        });
    }

    Expression() {
        return this.AssignmentExpression();
    }

    AssignmentExpression() {
        let left = this.ConditionalExpression();

        while (
            this._lookahead != null &&
            this._isAssignmentOperator(this._lookahead.type)
        ) {
            const operator = this.AssignmentOperator().value;
            const right = this.AssignmentExpression();

            return this._nodeFromNodes(left, right, {
                type: "AssignmentExpression",
                operator,
                left: this._checkValidAssignmentTarget(left),
                right,
            });
        }

        return left;
    }

    ConditionalExpression() {
        let test = this.LogicalORExpression();
        if (this._lookahead != null && this._lookahead.type === "?") this._eat("?");
        else return test;
        let consequent = this.Expression();
        this._eat(":");
        let alternate = this.Expression();

        return this._nodeFromNodes(test, alternate, {
            type: "ConditionalExpression",
            test,
            consequent,
            alternate,
        });
    }

    LogicalORExpression() {
        let left = this.LogicalANDExpression();

        while (this._lookahead != null && this._lookahead.type === "LOGICAL_OR") {
            const operator = this._eat("LOGICAL_OR").value;
            const right = this.LogicalANDExpression();

            left = this._nodeFromNodes(left, right, {
                type: "LogicalORExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    LogicalANDExpression() {
        let left = this.EqualityExpression();

        while (this._lookahead != null && this._lookahead.type === "LOGICAL_AND") {
            const operator = this._eat("LOGICAL_AND").value;
            const right = this.EqualityExpression();

            left = this._nodeFromNodes(left, right, {
                type: "LogicalANDExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    EqualityExpression() {
        let left = this.RelationalExpression();

        while (
            this._lookahead != null &&
            this._lookahead.type === "EQUALITY_OPERATOR"
        ) {
            const operator = this._eat("EQUALITY_OPERATOR").value;
            const right = this.RelationalExpression();

            left = this._nodeFromNodes(left, right, {
                type: "BinaryExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    RelationalExpression() {
        let left = this.AdditiveExpression();

        while (
            this._lookahead != null &&
            this._lookahead.type == "RELATIONAL_OPERATOR"
        ) {
            const operator = this._eat("RELATIONAL_OPERATOR").value;
            const right = this.AdditiveExpression();

            left = this._nodeFromNodes(left, right, {
                type: "BinaryExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    AdditiveExpression() {
        let left = this.ModuloExpreesion();

        while (
            this._lookahead != null &&
            this._lookahead.type === "ADDITIVE_OPERATOR"
        ) {
            const operator = this._eat("ADDITIVE_OPERATOR").value;
            const right = this.ModuloExpreesion();
            left = this._nodeFromNodes(left, right, {
                type: "BinaryExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    ModuloExpreesion() {
        let left = this.MultipicativeExpression();

        while (
            this._lookahead != null &&
            this._lookahead.type === "MODULO_OPERATOR"
        ) {
            const operator = this._eat("MODULO_OPERATOR").value;
            const right = this.MultipicativeExpression();
            left = this._nodeFromNodes(left, right, {
                type: "BinaryExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    MultipicativeExpression() {
        let left = this.UnaryExpression();

        while (
            this._lookahead != null &&
            this._lookahead.type === "MULTIPLICATIVE_OPERATOR"
        ) {
            const operator = this._eat("MULTIPLICATIVE_OPERATOR").value;
            const right = this.UnaryExpression();
            left = this._nodeFromNodes(left, right, {
                type: "BinaryExpression",
                operator,
                left,
                right,
            });
        }

        return left;
    }

    UnaryExpression() {
        let operator;
        if (this._lookahead == null) {
            throw this._syntaxError("Unexpected end of input", this._prevToken);
        }

        switch (this._lookahead.type) {
            case "ADDITIVE_OPERATOR":
                operator = this._eat("ADDITIVE_OPERATOR").value;
                break;
            case "LOGICAL_NOT":
                operator = this._eat("LOGICAL_NOT").value;
                break;
        }

        if (operator != null) {
            return this._node(this._prevToken, {
                type: "UnaryExpression",
                operator,
                argument: this.UnaryExpression(),
            });
        }

        return this.LeftHandSideExpression();
    }

    LeftHandSideExpression() {
        return this.CallMemberExpression();
    }

    CallMemberExpression() {
        if (this._lookahead != null && this._lookahead.type === "super") {
            return this._CallExpression(this.Super());
        }

        const member = this.MemberExpression();

        if (this._lookahead != null && this._lookahead.type === "(") {
            return this._CallExpression(member);
        }

        return member;
    }

    _CallExpression(calle) {
        let callExpression = this._nodeFromNodes(calle, calle, {
            type: "CallExpression",
            calle,
            arguments: this.Arguments(),
        });

        callExpression.loc.end = this._clonePosition(this._prevToken.loc.end);

        if (this._lookahead != null && this._lookahead.type === "(") {
            callExpression = this._CallExpression(callExpression);
        }

        return callExpression;
    }

    Arguments() {
        this._eat("(");
        const argumentList =
            this._lookahead != null && this._lookahead.type !== ")"
                ? this.ArgumentsList()
                : [];
        this._eat(")");

        return argumentList;
    }

    ArgumentsList() {
        const argumentList = [];
        do {
            argumentList.push(this.AssignmentExpression());
        } while (
            this._lookahead != null &&
            this._lookahead.type === "," &&
            this._eat(",")
        );

        return argumentList;
    }

    MemberExpression() {
        let object = this.PrimaryExpression();

        while (
            this._lookahead != null &&
            (this._lookahead.type === "." || this._lookahead.type === "[")
        ) {
            if (this._lookahead.type === ".") {
                this._eat(".");
                const property = this.Identifier();
                object = this._nodeFromNodes(object, property, {
                    type: "MemberExpression",
                    computed: false,
                    object,
                    property,
                });
            } else {
                this._eat("[");
                const property = this.Expression();
                this._eat("]");
                object = this._nodeFromNodes(object, property, {
                    type: "MemberExpression",
                    computed: true,
                    object,
                    property,
                });
                object.loc.end = this._clonePosition(this._prevToken.loc.end);
            }
        }

        return object;
    }

    PrimaryExpression() {
        if (this._lookahead == null) {
            throw this._syntaxError("Unexpected end of input", this._prevToken);
        }

        if (this._isLiteral(this._lookahead.type)) {
            return this.Literal();
        }
        switch (this._lookahead.type) {
            case "IDENTIFIER":
                return this.Identifier();
            case "(":
                return this.ParethesizedExpression();
            case "this":
                return this.ThisExpression();
            case "new":
                return this.NewExpression();
            default:
                throw this._syntaxError(
                    `Unexpected primary expression`,
                    this._lookahead
                );
        }
    }

    ThisExpression() {
        const token = this._eat("this");
        return this._node(token, {
            type: "ThisExpression",
        });
    }

    Super() {
        const token = this._eat("super");
        return this._node(token, {
            type: "Super",
        });
    }

    NewExpression() {
        const startToken = this._lookahead;
        this._eat("new");
        return this._node(startToken, {
            type: "NewExpression",
            callee: this.MemberExpression(),
            arguments: this.Arguments(),
        });
    }

    ParethesizedExpression() {
        this._eat("(");
        const expression = this.Expression();
        this._eat(")");
        return expression;
    }

    _isAssignmentOperator(node) {
        return node === "SIMPLE_ASSIGN" || node === "COMPLEX_ASSIGN";
    }

    AssignmentOperator() {
        if (this._lookahead != null && this._lookahead.type === "SIMPLE_ASSIGN") {
            return this._eat("SIMPLE_ASSIGN");
        }
        return this._eat("COMPLEX_ASSIGN");
    }

    _checkValidAssignmentTarget(node) {
        if (node.type === "Identifier" || node.type === "MemberExpression") {
            return node;
        }

        throw this._syntaxError(
            "Invalid left-hand side in assignment expression",
            node
        );
    }

    Identifier() {
        const token = this._eat("IDENTIFIER");
        return this._node(token, {
            type: "Identifier",
            name: token.value,
        });
    }

    _isLiteral(tokenType) {
        return (
            tokenType === "NUMBER" ||
            tokenType === "STRING" ||
            tokenType === "true" ||
            tokenType === "false" ||
            tokenType === "null"
        );
    }

    Literal() {
        if (this._lookahead == null) {
            throw this._syntaxError("Unexpected end of input", this._prevToken);
        }

        switch (this._lookahead.type) {
            case "NUMBER":
                return this.NumericLiteral();
            case "STRING":
                return this.StringLiteral();
            case "true":
                return this.BooleanLiteral(true);
            case "false":
                return this.BooleanLiteral(false);
            case "null":
                return this.NullLiteral();
        }
        throw this._syntaxError(
            `Literal: unexpected literal production.`,
            this._lookahead
        );
    }

    NumericLiteral() {
        const token = this._eat("NUMBER");
        return this._node(token, {
            type: "NumericLiteral",
            value: Number(token.value),
        });
    }

    StringLiteral() {
        const token = this._eat("STRING");
        return this._node(token, {
            type: "StringLiteral",
            value: token.value.slice(1, -1),
        });
    }

    BooleanLiteral(value) {
        const token = this._eat(value ? "true" : "false");
        return this._node(token, {
            type: "BooleanLiteral",
            value,
        });
    }

    NullLiteral() {
        const token = this._eat("null");
        return this._node(token, {
            type: "NullLiteral",
            value: null,
        });
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if (token == null) {
            throw this._syntaxError(
                `Unexpected end of input, expected: "${tokenType}"`,
                this._prevToken ? this._prevToken.loc.end : null
            );
        }

        if (token.type !== tokenType) {
            throw this._syntaxError(
                `Unexpected token: "${token.value}", expected: "${tokenType}"`,
                token
            );
        }

        this._lookahead = this._tokenizer.getNextToken();
        this._prevToken = token;

        return token;
    }

    _node(startTokenOrLoc, node, endTokenOrLoc = this._prevToken) {
        return {
            ...node,
            loc: {
                start: this._extractStart(startTokenOrLoc),
                end: this._extractEnd(endTokenOrLoc ?? startTokenOrLoc),
            },
        };
    }

    _nodeFromNodes(startNode, endNode, node) {
        return {
            ...node,
            loc: {
                start: this._clonePosition(startNode.loc.start),
                end: this._clonePosition(endNode.loc.end),
            },
        };
    }

    _extractStart(tokenOrLoc) {
        const loc = tokenOrLoc && tokenOrLoc.loc ? tokenOrLoc.loc.start : tokenOrLoc;
        return this._clonePosition(loc);
    }

    _extractEnd(tokenOrLoc) {
        const loc = tokenOrLoc && tokenOrLoc.loc ? tokenOrLoc.loc.end : tokenOrLoc;
        return this._clonePosition(loc);
    }

    _clonePosition(position) {
        return position
            ? {
                  line: position.line,
                  column: position.column,
                  offset: position.offset,
              }
            : null;
    }

    _syntaxError(message, tokenOrLoc) {
        const loc = tokenOrLoc && tokenOrLoc.loc ? tokenOrLoc.loc.start : tokenOrLoc;
        const suffix = loc
            ? ` at line ${loc.line}, column ${loc.column}`
            : "";
        return new SyntaxError(`${message}${suffix}`);
    }
}

module.exports = { Parser };
