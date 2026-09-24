-- Rotates the password hashes for the seed dev/test accounts (dm1, player1).
-- The original V2 migration committed its plaintext passwords directly into this
-- repo, which is public on GitHub -- that exposed them to anyone. This migration
-- invalidates those old passwords by replacing the hashes; it does not create or
-- remove any accounts.
--
-- The new plaintext passwords are NOT committed anywhere in this repo. They were
-- shared with the repo owner directly. To rotate again in the future, generate a
-- new hash with the PasswordHashCli tool (see backend/README "Adding a user") and
-- add another migration the same way -- never commit a plaintext password again.
UPDATE users SET password_hash = '$2a$10$zUqXS1LZouowqryPd8qQI.9oZrWkPxF7vu4wMTJomdG1KWcT7V9Ie' WHERE username = 'dm1';
UPDATE users SET password_hash = '$2a$10$BV4OBYBxlrWSymqID04vWejS/An5e4cvPZ7HGzePbzbf22r7Wm1O2' WHERE username = 'player1';
