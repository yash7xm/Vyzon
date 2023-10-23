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
      default:
        return '';
    }
  }

  BlockStatement(body) {
    return '{\n' + this.StatementsList(body).join('\n') + '\n}';
  }

  EmptyStatement() {
    return `;`;
  }

  VariableStatement(declarations) {
    return declarations.map((statement) => this.VariableDeclarations(statement)).join('\n');
  }

  VariableDeclarations(node) {
    let id = node.id.name;
    let init = node.init !== null ? this.Expression(node.init) : 0;

    return `let ${id} = ${init};`;
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
      // Handle other expression types if needed.
      default:
        return '';
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

  Identifier(node) {
    return node.name;
  }
}

module.exports = { Generator };
