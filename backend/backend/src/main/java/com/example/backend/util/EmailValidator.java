package com.example.backend.util;

import javax.naming.directory.*;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;
import java.util.regex.Pattern;

public class EmailValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final List<String> TEMP_DOMAINS = Arrays.asList(
        "temp-mail.org", "tempmail.com", "tmpmail.org", "tmpemails.com",
        "10minutemail.com", "10minutemail.net", "10minemail.com",
        "guerrillamail.com", "guerrillamail.net", "guerrillamail.org",
        "mailinator.com", "mailinator.net", "mailinator.org",
        "yopmail.com", "yopmail.net", "yopmail.fr",
        "throwawaymail.com", "throwawaymail.net",
        "getairmail.com", "getairmail.net",
        "mailnesia.com", "mailnesia.net",
        "burnermail.io", "burnermail.net",
        "fakeinbox.com", "fakeinbox.net",
        "sharklasers.com", "sharklasers.net",
        "getnada.com", "getnada.net",
        "tempinbox.com", "tempinbox.net",
        "dispostable.com", "dispostable.net",
        "mohmal.com", "mohmal.net",
        "mailcatch.com", "mailcatch.net"
    );

    public static boolean isValid(String email) {
        if (email == null || email.isBlank()) return false;
        if (!EMAIL_PATTERN.matcher(email).matches()) return false;

        String domain = email.substring(email.indexOf('@') + 1).toLowerCase();
        return !TEMP_DOMAINS.contains(domain);
    }
}
