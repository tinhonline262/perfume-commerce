package com.perfume.ecommerce.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class VnPaySecurityUtilTest {

    @Test
    void whenHashingValidData_thenReturnsCorrectHash() {
        String key = "testkey";
        String data = "testdata";
        String hash = VnPaySecurityUtil.hmacSHA512(key, data);
        assertNotNull(hash);
        assertFalse(hash.isEmpty());
        assertEquals("6ea37ddf2cc797175f80b2a9d618c7bc7015db5e1176b6d5f7de2f954d760778c6ab99e82c589b2787fc546b346903f71cba8bfd6006e890cd7ff6cd798b3687", hash);
    }
}
