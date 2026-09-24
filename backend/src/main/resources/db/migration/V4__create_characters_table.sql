CREATE TABLE characters (
    id UUID PRIMARY KEY,
    player_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    body JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_characters_player_id ON characters(player_id);
