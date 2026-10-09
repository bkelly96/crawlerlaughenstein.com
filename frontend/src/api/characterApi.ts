import { apiFetch } from "./client";
import type { CharacterSheet } from "../types/character";

export interface CharacterSummary {
  id: string;
  name: string;
  level: number;
}

type CharacterBody = Omit<CharacterSheet, "id" | "name" | "level" | "version">;

/** Wire format mirrors the characters table: real columns plus a JSON `body` (docs/adr/0008). */
interface CharacterResponse {
  id: string;
  name: string;
  level: number;
  version: number;
  body: CharacterBody;
}

function fromResponse({ body, ...columns }: CharacterResponse): CharacterSheet {
  return { ...body, ...columns };
}

export function listCharacters(): Promise<CharacterSummary[]> {
  return apiFetch<CharacterSummary[]>("/api/characters");
}

export async function getCharacter(id: string): Promise<CharacterSheet> {
  return fromResponse(await apiFetch<CharacterResponse>(`/api/characters/${id}`));
}

/** Rejects with ApiError status 409 if the character was saved elsewhere since `version`. */
export async function saveCharacter(character: CharacterSheet): Promise<CharacterSheet> {
  const { id, name, level, version, ...body } = character;
  const response = await apiFetch<CharacterResponse>(`/api/characters/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, level, version, body }),
  });
  return fromResponse(response);
}
