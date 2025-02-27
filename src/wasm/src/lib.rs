

use std::fmt::Display;

use wasm_bindgen::prelude::*;

#[derive(Debug, PartialEq, Clone)]
enum Token {
    Number(f64),
    Operator(char),
    LeftParen,
    RightParen,
    Comma,
    Log,
}

impl Display for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Token::Number(n) => write!(f, "{}", n),
            Token::Operator(op) => write!(f, "{}", op),
            Token::LeftParen => write!(f, "("),
            Token::RightParen => write!(f, ")"),
            Token::Comma => write!(f, ","),
            Token::Log => write!(f, "log"),
        }
    }
    
}

struct Lexer {
    input: Vec<char>,
    position: usize,
}

impl Lexer {
    fn new(input: &str) -> Self {
        Lexer {
            input: input.chars().collect(),
            position: 0,
        }
    }

    fn peek(&self) -> Option<char> {
        self.input.get(self.position).cloned()
    }

    fn advance(&mut self) {
        self.position += 1;
    }

    fn skip_whitespace(&mut self) {
        while self.peek().map_or(false, |c| c.is_whitespace()) {
            self.advance();
        }
    }

    fn tokenize(&mut self) -> Result<Vec<Token>, String> {
        let mut tokens = Vec::new();
        self.skip_whitespace();

        while let Some(c) = self.peek() {
            self.skip_whitespace();

            if c.is_digit(10) || c == '.' {
                let mut num_str = String::new();
                while let Some(c) = self.peek() {
                    if c.is_digit(10) || c == '.' {
                        num_str.push(c);
                        self.advance();
                    } else {
                        break;
                    }
                }

                let num = num_str.parse::<f64>().map_err(|_| format!(
                    "Hmm... '{}' doesn't look like a valid number. Did you accidentally type something extra?",
                    num_str
                ))?;
                tokens.push(Token::Number(num));
            } else if "+-*/^".contains(c) {
                tokens.push(Token::Operator(c));
                self.advance();
            } else if c == '(' {
                tokens.push(Token::LeftParen);
                self.advance();
            } else if c == ')' {
                tokens.push(Token::RightParen);
                self.advance();
            } else if c == ',' {
                tokens.push(Token::Comma);
                self.advance();
            } else if self.input[self.position..].starts_with(&['l', 'o', 'g']) {
                tokens.push(Token::Log);
                self.position += 3;
            } else {
                return Err(format!(
                    "I don't understand '{}'. This calculator only supports numbers and operators like +, -, *, /, ^, log.",
                    c
                ));
            }

            self.skip_whitespace();
        }

        Ok(tokens)
    }
}

struct Parser {
    tokens: std::iter::Peekable<std::vec::IntoIter<Token>>,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Parser {
            tokens: tokens.into_iter().peekable(),
        }
    }

    fn parse_expression(&mut self) -> Result<f64, String> {
        let result = self.parse_addition()?;
    
        if let Some(token) = self.tokens.peek() {
            return Err(format!(
                "Hmm... I see a '{}' hanging around at the end. Did you accidentally add something extra?",
                token
            ));
        }
    
        Ok(result)
    }
    
    
    

    fn parse_addition(&mut self) -> Result<f64, String> {
        let mut left = self.parse_multiplication()?;

        while let Some(Token::Operator(op)) = self.tokens.peek().cloned() {
            if op == '+' || op == '-' {
                self.tokens.next();
                let right = self.parse_multiplication()?;
                left = if op == '+' {
                    left + right
                } else {
                    left - right
                };
            } else {
                break;
            }
        }

        Ok(left)
    }

    fn parse_multiplication(&mut self) -> Result<f64, String> {
        let mut left = self.parse_exponentiation()?;

        while let Some(Token::Operator(op)) = self.tokens.peek().cloned() {
            if op == '*' || op == '/' {
                self.tokens.next();
                let right = self.parse_exponentiation()?;
                if op == '/' && right == 0.0 {
                    return Err(
                        "Oops! You can't divide by zero. Try a different denominator.".to_string(),
                    );
                }
                left = if op == '*' {
                    left * right
                } else {
                    left / right
                };
            } else {
                break;
            }
        }

        Ok(left)
    }

    fn parse_exponentiation(&mut self) -> Result<f64, String> {
        let base = self.parse_unary()?;

        if let Some(Token::Operator('^')) = self.tokens.peek() {
            self.tokens.next();
            let exponent = self.parse_exponentiation()?;
            return Ok(base.powf(exponent));
        }

        Ok(base)
    }

    fn parse_unary(&mut self) -> Result<f64, String> {
        if let Some(Token::Operator('-')) = self.tokens.peek() {
            self.tokens.next();
            return Ok(-self.parse_unary()?);
        }

        self.parse_log()
    }

    fn parse_log(&mut self) -> Result<f64, String> {
        if let Some(Token::Log) = self.tokens.peek() {
            self.tokens.next();

            if self.tokens.next() != Some(Token::LeftParen) {
                return Err(
                    "It looks like you used 'log' without parentheses. Try 'log(base, value)'."
                        .to_string(),
                );
            }

            let base = self.parse_expression()?;

            if self.tokens.next() != Some(Token::Comma) {
                return Err(
                    "Oops! 'log' needs a comma between base and value. Example: log(2, 8)."
                        .to_string(),
                );
            }

            let value = self.parse_expression()?;

            if self.tokens.next() != Some(Token::RightParen) {
                return Err(
                    "You forgot to close the parentheses in 'log'. Try adding a ')'.".to_string(),
                );
            }

            if base <= 0.0 || base == 1.0 || value <= 0.0 {
                return Err("Logarithm error: The base must be > 0 and not equal to 1, and the value must be > 0.".to_string());
            }

            return Ok(value.ln() / base.ln());
        }

        self.parse_primary()
    }

    fn parse_primary(&mut self) -> Result<f64, String> {
        if let Some(token) = self.tokens.next() {
            match token {
                Token::Number(n) => Ok(n),
    
                Token::LeftParen => {
                    let expr = self.parse_addition()?;
                    if let Some(Token::RightParen) = self.tokens.next() {
                        Ok(expr)
                    } else {
                        Err("Oops! You opened a '(' but forgot to close it. Try adding a ')'.".to_string())
                    }
                }
    
                Token::RightParen => Err("Hmm... looks like there's an extra ')' here. Did you forget to open one first?".to_string()),
    
                _ => Err(format!(
                    "Hmm... I wasn't expecting '{}' here. Maybe check your expression?",
                    token
                )),
            }
        } else {
            Err("Your expression seems unfinished. Did you forget something at the end?".to_string())
        }
    }
    
}

#[wasm_bindgen]
pub fn calculate(expression: &str) -> Result<f64, JsValue> {
    let mut lexer = Lexer::new(expression);
    let tokens = lexer
        .tokenize()
        .map_err(|e| JsValue::from_str(e.as_str()))?;

    let mut parser = Parser::new(tokens);
    parser
        .parse_expression()
        .map_err(|e| JsValue::from_str(e.as_str()))
}
