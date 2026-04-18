from __future__ import annotations

import re
from collections.abc import AsyncGenerator
from typing import Optional

from google.adk.agents import BaseAgent, InvocationContext
from google.adk.events import Event
from google.genai import types

from .tools import solve_water_jug


def _extract_text_from_event(event: Event) -> str:
    content = getattr(event, "content", None)
    if content is None:
        return ""

    parts = getattr(content, "parts", None) or []
    text_fragments: list[str] = []
    for part in parts:
        text_value = getattr(part, "text", None)
        if text_value:
            text_fragments.append(text_value)
    return " ".join(text_fragments).strip()


def _latest_user_message(ctx: InvocationContext) -> str:
    events = getattr(ctx.session, "events", []) or []
    for event in reversed(events):
        author = str(getattr(event, "author", "")).lower()
        if author == "user":
            text = _extract_text_from_event(event)
            if text:
                return text
    return ""


def _extract_number(pattern: str, text: str) -> Optional[int]:
    match = re.search(pattern, text, re.IGNORECASE)
    if not match:
        return None
    return int(match.group(1))


def _extract_algorithm(text: str) -> str:
    match = re.search(r"\b(bfs|dfs)\b", text, re.IGNORECASE)
    return match.group(1).lower() if match else "bfs"


def _parse_request(text: str) -> tuple[Optional[int], Optional[int], Optional[int], str]:
    jug1 = _extract_number(r"jug\s*1(?:\s*capacity)?\s*[:=]?\s*(\d+)", text)
    if jug1 is None:
        jug1 = _extract_number(r"jug1(?:\s*capacity)?\s*[:=]?\s*(\d+)", text)

    jug2 = _extract_number(r"jug\s*2(?:\s*capacity)?\s*[:=]?\s*(\d+)", text)
    if jug2 is None:
        jug2 = _extract_number(r"jug2(?:\s*capacity)?\s*[:=]?\s*(\d+)", text)

    target = _extract_number(r"target(?:\s*amount)?\s*[:=]?\s*(\d+)", text)
    algorithm = _extract_algorithm(text)
    return jug1, jug2, target, algorithm


def _format_response(data: dict) -> str:
    lines = [
        "Water Jug Problem Solved",
        f"Algorithm: {data['algorithm']}",
        f"Status: {data['status']}",
        f"Authenticated: {data['api_key_preview']}",
        f"Visited states: {data['visited_states']}",
        f"Number of steps: {data['number_of_steps']}",
        f"Path taken: {data['path_taken']}",
        f"Goal state: {data['goal_state']}",
        "",
        "Agent workflow:",
    ]
    lines.extend(data["agent_workflow"])
    lines.append("")
    lines.append("State transitions:")
    lines.extend(data["steps"])
    lines.append("")
    lines.append("State exploration order:")
    lines.append(" -> ".join(data["exploration_order"]) if data["exploration_order"] else "No states explored.")
    lines.append("")
    lines.append(f"Graph file: {data['graph_file']}")
    return "\n".join(lines)


class WaterJugDeterministicAgent(BaseAgent):
    name: str = "water_jug_agent"
    description: str = "Deterministically solves water jug requests without requiring an LLM quota."

    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        user_text = _latest_user_message(ctx)
        jug1, jug2, target, algorithm = _parse_request(user_text)

        if jug1 is None or jug2 is None or target is None:
            help_text = (
                "Send the request like this:\n"
                "Solve the water jug problem with Jug1 capacity 4, Jug2 capacity 3, target amount 2 using BFS."
            )
            yield Event(
                author=self.name,
                content=types.Content(parts=[types.Part(text=help_text)]),
            )
            return

        try:
            result = solve_water_jug(
                jug1_capacity=jug1,
                jug2_capacity=jug2,
                target_amount=target,
                algorithm=algorithm,
            )
            response_text = _format_response(result)
        except Exception as error:
            response_text = f"Failed to solve the problem: {error}"

        yield Event(
            author=self.name,
            content=types.Content(parts=[types.Part(text=response_text)]),
        )


root_agent = WaterJugDeterministicAgent()
