// Test to ensure the library compiles correctly
pub fn hello_world() -> String {
    "Bitnob API Demo in Rust!".to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hello_world() {
        let result = hello_world();
        assert_eq!(result, "Bitnob API Demo in Rust!");
    }
}