class Generator {
  constructor() {
    this._code = '';
  }

  generate(node) {
    this._code = this.StatementsList(node).join('\n');
    return this._code;
  }

  StatementsList(body) {
    return body.map((statement) => this.Statement(statement));
  }

  Statement(node) {
    switch (node.type) {
      case 'ExpressionStatement':
        return this.ExpressionStatement(node.expression) + ';';
      case 'BlockStatement':
        return this.BlockStatement(node.body);
      case 'VariableStatement':
        return this.VariableStatement(node.declarations);
      case 'EmptyStatement':
        return this.EmptyStatement();
      case 'IfStatement':
        return this.IfStatement(node);
      case 'WhileStatement':
        return this.WhileStatement(node);
      case 'DoWhileStatement':
        return this.DoWhileStatement(node);
      case 'ForStatement':
        return this.ForStatement(node);
      case 'FunctionDeclatration':
        return this.FunctionDeclatration(node);
      case 'ReturnStatement':
        return this.ReturnStatement(node.argument);
      default:
        return '';
    }
  }

  BlockStatement(body) {
    return '\n' + this.StatementsList(body).join('\n') + '\n';
  }

  EmptyStatement() {
    return `;`;
  }

  VariableStatement(declarations) {
    return `let ` + declarations.map((statement) => this.VariableDeclarations(statement)).join(',') + `;`;
  }

  VariableDeclarations(node) {
    let id = node.id.name;
    let init = node.init !== null ? this.Expression(node.init) : 0;

    return `${id} = ${init}`;
  }

  IfStatement(node) {
    let test = this.Expression(node.test);
    let consequent = this.Statement(node.consequent);
    let alternate = this.ElseStatement(node.alternate);
    return `if (${test}) {\n  ${consequent}\n}${alternate}`;
  }

  ElseStatement(node) {
    if (node == null) return '';
    let alternate = this.Statement(node);
    return `else ${alternate}`;
  }

  WhileStatement(node) {
    let test = this.Expression(node.test);
    let body = this.Statement(node.body);

    return `while(${test}) {\n ${body} \n}`
  }

  DoWhileStatement(node) {
    let body = this.Statement(node.body);
    let test = this.Expression(node.test);

    return `do {\n ${body} \n} \n while(${test});`;
  }

  ForStatement(node) {
    let init = node.init != null ? this.InitForStatement(node.init) : '';
    let test = node.test != null ? this.Expression(node.test) : '';
    let update = node.update != null ? this.Expression(node.update) : '';
    let body = this.Statement(node.body);

    if (init[init.length - 1] != ';') init += ';'

    return `for(${init} ${test}; ${update}){\n ${body} \n}`
  }

  InitForStatement(node) {
    switch (node.type) {
      case ('VariableStatement'):
        return this.VariableStatement(node.declarations);
      default:
        return this.Expression(node);
    }
  }

  FunctionDeclatration(node) {
    let name = this.Identifier(node.name);
    let params = this.FunctionParamsList(node.params);
    let body = this.BlockStatement(node.body.body);

    return `function ${name} (${params}) {\n ${body} \n}`;
  }

  FunctionParamsList(params) {
    return params.map((param) => this.Identifier(param)).join(',');
  }

  ReturnStatement(node) {
    let argument = node != null ? this.Expression(node) : '';

    return `return ${argument};`;
  }

  ExpressionStatement(expression) {
    return this.Expression(expression);
  }

  Expression(expression) {
    switch (expression.type) {
      case 'NumericLiteral':
        return this.NumericLiteral(expression);
      case 'StringLiteral':
        return this.StringLiteral(expression);
      case 'BooleanLiteral':
        return this.BooleanLiteral(expression);
      case 'Identifier':
        return this.Identifier(expression);
      case 'BinaryExpression':
        return this.BinaryExpression(expression);
      case 'AssignmentExpression':
        return this.AssignmentExpression(expression);
      case 'ConditionalExpression':
        return this.ConditionalExpression(expression);
      case 'LogicalORExpression':
      case 'LogicalANDExpression':
        return this.BinaryExpression(expression);
      case 'UnaryExpression':
        return this.UnaryExpression(expression);
      case 'MemberExpression':
        return this.MemberExpression(expression);
      default:
        return '';
    }
  }

  MemberExpression(node) {
    let object = this.Expression(node.object);
    let property = null;
    if (node.computed) {
      property = this.Expression(node.property);
      return `${object}[${property}]`
    }
    else {
      property = this.Identifier(node.property);
      return `${object}.${property}`
    }
    
  }

  ConditionalExpression(node) {
    const test = this.Expression(node.test);
    const consequent = this.Expression(node.consequent);
    const alternate = this.Expression(node.alternate);
    return `${test} ? ${consequent} : ${alternate}`;
  }

  AssignmentExpression(node) {
    const left = this.Expression(node.left);
    const right = this.Expression(node.right);
    const operator = node.operator;
    return `${left} ${operator} ${right}`;
  }

  BinaryExpression(node) {
    const left = this.Expression(node.left);
    const right = this.Expression(node.right);
    const operator = node.operator;
    return `(${left} ${operator} ${right})`;
  }

  UnaryExpression(node) {
    const operator = node.operator;
    const argument = this.Expression(node.argument);
    return `${operator}${argument}`;
  }

  NumericLiteral(node) {
    return node.value.toString();
  }

  StringLiteral(node) {
    return `"${node.value}"`;
  }

  BooleanLiteral(node) {
    return `${node.value}`;
  }

  Identifier(node) {
    return node.name;
  }
}

module.exports = { Generator };
