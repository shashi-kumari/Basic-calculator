function input(inp) {
	if (inp === '=') {
		document.getElementById('result').value = evaluate();
		return;
	}
	var allowedChars = /[0-9+\-*\/.]/;
	if (allowedChars.test(inp)) {
		document.getElementById('result').value += inp;
	}
}
function clearInput() {
	document.getElementById('result').value = '';
}
function isValidCharacter(event) {
	var charCode = event.which || event.keyCode;
	var charStr = String.fromCharCode(charCode);
	var pattern = /[0-9+\-*\/=.]/;
	return pattern.test(charStr);
}
function evaluate() {
	let expression = document.getElementById('result').value;
	let tokens = expression.split('');

	let values = [];

	let ops = [];

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i] == ' ') {
			continue;
		}

		// Current token is a number,
		// push it to stack for numbers
		if (tokens[i] >= '0' && tokens[i] <= '9') {
			let sbuf = "";

			// There may be more than
			// one digits in number
			while (i < tokens.length &&
				tokens[i] >= '0' &&
				tokens[i] <= '9') {
				sbuf = sbuf + tokens[i++];
			}
			values.push(parseInt(sbuf, 10));

			// Right now the i points to
			// the character next to the digit,
			// since the for loop also increases
			// the i, we would skip one
			// token position; we need to
			// decrease the value of i by 1 to
			// correct the offset.
			i--;
		}

		// Current token is an opening
		// brace, push it to 'ops'
		else if (tokens[i] == '(') {
			ops.push(tokens[i]);
		}

		// Closing brace encountered,
		// solve entire brace
		else if (tokens[i] == ')') {
			while (ops[ops.length - 1] != '(') {
				values.push(applyOp(ops.pop(),
					values.pop(),
					values.pop()));
			}
			ops.pop();
		}

		// Current token is an operator.
		else if (tokens[i] == '+' ||
			tokens[i] == '-' ||
			tokens[i] == '*' ||
			tokens[i] == '/') {

			// While top of 'ops' has same
			// or greater precedence to current
			// token, which is an operator.
			// Apply operator on top of 'ops'
			// to top two elements in values stack
			while (ops.length > 0 &&
				hasPrecedence(tokens[i],
					ops[ops.length - 1])) {
				values.push(applyOp(ops.pop(),
					values.pop(),
					values.pop()));
			}

			// Push current token to 'ops'.
			ops.push(tokens[i]);
		}
	}

	while (ops.length > 0) {
		values.push(applyOp(ops.pop(),
			values.pop(),
			values.pop()));
	}

	return values.pop();
}
function hasPrecedence(op1, op2) {
	if (op2 == '(' || op2 == ')') {
		return false;
	}
	if ((op1 == '*' || op1 == '/') &&
		(op2 == '+' || op2 == '-')) {
		return false;
	}
	else {
		return true;
	}
}
function applyOp(op, b, a) {
	switch (op) {
		case '/':
			if (b == 0) {
				document.write("Cannot divide by zero");
				return NaN;
			}
			return parseFloat(a / b);
		case '*':
			return a * b;
		case '+':
			return a + b;
		case '-':
			return a - b;
	}
	return 0;
}

// document.write(evaluate("10 + 2 * 6") + "</br>");
// document.write(evaluate("100 * 2 + 12") + "</br>");
// document.write(evaluate("100 * ( 2 + 12 )") + "</br>");
// document.write(evaluate("100 * ( 2 + 12 ) / 14") + "</br>");


