package com.example.backend.util;

import java.util.regex.Pattern;

public class PasswordValidator {

    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?`~]");

    public static boolean isValid(String password) {
        if (password == null || password.length() < 8) return false;
        if (!UPPERCASE.matcher(password).find()) return false;
        if (!LOWERCASE.matcher(password).find()) return false;
        if (!DIGIT.matcher(password).find()) return false;
        if (!SPECIAL.matcher(password).find()) return false;
        return true;
    }

    public static String getRequirements() {
        return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
}
