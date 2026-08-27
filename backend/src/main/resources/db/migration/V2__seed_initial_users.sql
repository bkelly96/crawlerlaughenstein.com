-- Initial dev/test accounts. There is no self-service registration by design (docs/adr/0003) --
-- new accounts are added by hand; see backend/README section "Adding a user" for how to
-- generate a password hash for additional accounts.
--
-- CHANGE THESE PASSWORDS before using this outside a local dev environment.
--   dm1     / ChangeMe123!DM
--   player1 / ChangeMe123!Player
INSERT INTO users (id, username, email, password_hash, role) VALUES
    (gen_random_uuid(), 'dm1', 'dm1@example.com', '$2a$10$vOY1W1zy7o77930e7/0N1e5c6enGYqnX8dNerbhBl8EtfXR54nJGK', 'DM'),
    (gen_random_uuid(), 'player1', 'player1@example.com', '$2a$10$Fuu41xukWLb3Kqln8lAXl.7pV8jXi7YYLwRosu6G5YYnfGWG.NdZu', 'PLAYER');
