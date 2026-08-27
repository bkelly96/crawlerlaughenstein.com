-- Initial dev/test accounts. There is no self-service registration by design (docs/adr/0003) --
-- new accounts are added by hand; see backend/README section "Adding a user" for how to
-- generate a password hash for additional accounts.
--
-- CHANGE THESE PASSWORDS before using this outside a local dev environment.
--   dm1     / ***REMOVED***
--   player1 / ***REMOVED***
INSERT INTO users (id, username, email, password_hash, role) VALUES
    (gen_random_uuid(), 'dm1', 'dm1@example.com', '***REMOVED***', 'DM'),
    (gen_random_uuid(), 'player1', 'player1@example.com', '***REMOVED***', 'PLAYER');
