package com.maverick.auth_app.helpers;

import java.util.UUID;

public class UserHelper {
    public static UUID parseToUUID(String id) {
        return UUID.fromString(id);
    }
}
