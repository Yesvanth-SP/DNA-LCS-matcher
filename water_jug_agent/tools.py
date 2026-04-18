from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

from config import get_api_key
from search import SearchResult, Transition, bfs_search, dfs_search
from visualization import build_state_space_graph, export_state_space_to_dot


def _mask_api_key(api_key: str) -> str:
    return f"{api_key[:2]}{'*' * max(len(api_key) - 2, 0)}"


def _format_path(path: List[Transition]) -> str:
    if not path:
        return "(0, 0)"

    states = [str(path[0].from_state)]
    states.extend(str(step.to_state) for step in path)
    return " -> ".join(states)


def _format_transitions(path: List[Transition]) -> List[str]:
    if not path:
        return ["No transition steps were needed or no solution was found."]

    return [
        f"{index}. {step.action}: {step.from_state} -> {step.to_state}"
        for index, step in enumerate(path, start=1)
    ]


def _build_response(result: SearchResult, graph_path: Path) -> Dict[str, Any]:
    api_key = get_api_key()
    return {
        "authenticated": True,
        "api_key_preview": _mask_api_key(api_key),
        "algorithm": result.algorithm,
        "status": result.message,
        "success": result.success,
        "goal_state": str(result.goal_state) if result.goal_state is not None else None,
        "visited_states": result.visited_count,
        "exploration_order": [str(state) for state in result.explored_order],
        "steps": _format_transitions(result.path),
        "number_of_steps": len(result.path),
        "path_taken": _format_path(result.path),
        "graph_file": str(graph_path.resolve()),
        "agent_workflow": [
            "1. Input accepted",
            "2. API_KEY authenticated",
            f"3. {result.algorithm} selected",
            "4. State space search executed",
            "5. State graph exported",
        ],
    }


def solve_water_jug(
    jug1_capacity: int,
    jug2_capacity: int,
    target_amount: int,
    algorithm: str = "bfs",
) -> Dict[str, Any]:
    """Solve the Water Jug Problem and return the state transitions and graph details.

    Args:
        jug1_capacity: Capacity of Jug1.
        jug2_capacity: Capacity of Jug2.
        target_amount: Target amount of water to measure.
        algorithm: Search algorithm to use. Supported values are "bfs" and "dfs".
    """
    normalized = algorithm.strip().lower()
    solvers = {"bfs": bfs_search, "dfs": dfs_search}

    if normalized not in solvers:
        raise ValueError("Unsupported algorithm. Use 'bfs' or 'dfs'.")

    api_key = get_api_key()
    if len(api_key) < 4:
        raise ValueError("API_KEY is present but looks invalid.")

    result = solvers[normalized](jug1_capacity, jug2_capacity, target_amount)
    graph = build_state_space_graph(jug1_capacity, jug2_capacity)
    graph_path = export_state_space_to_dot(graph, result.path, output_path="state_space.dot")

    return _build_response(result, graph_path)
