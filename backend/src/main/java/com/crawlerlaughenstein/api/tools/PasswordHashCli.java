package com.crawlerlaughenstein.api.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * There's no self-service registration endpoint by design (see docs/adr/0003), so new
 * accounts are added by hand. Run this to get a hash to paste into a SQL insert or a new
 * Flyway migration:
 *   mvn -q exec:java -Dexec.mainClass=com.crawlerlaughenstein.api.tools.PasswordHashCli -Dexec.args="somepassword"
 */
public final class PasswordHashCli {

    private PasswordHashCli() {
    }

    public static void main(String[] args) {
        if (args.length != 1) {
            System.err.println("Usage: PasswordHashCli <plaintext-password>");
            System.exit(1);
        }
        System.out.println(new BCryptPasswordEncoder().encode(args[0]));
    }
}
