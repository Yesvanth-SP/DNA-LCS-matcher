from __future__ import annotations

from collections import deque
from pathlib import Path
from typing import Dict, List, Set, Tuple

from search import State, Transition, generate_next_states


def build_state_space_graph(jug1_capacity: int, jug2_capacity: int) -> Dict[State, List[Tuple[str, State]]]:
    start: State = (0, 0)
    graph: Dict[State, List[Tuple[str, State]]] = {}
    visited: Set[State] = {start}
    queue = deque([start])

    while queue:
        current = queue.popleft()
        neighbors: List[Tuple[str, State]] = []

        for action, next_state in generate_next_states(current, jug1_capacity, jug2_capacity):
            if next_state == current:
                continue
            neighbors.append((action, next_state))
            if next_state not in visited:
                visited.add(next_state)
                queue.append(next_state)

        graph[current] = neighbors

    return graph


def export_state_space_to_dot(
    graph: Dict[State, List[Tuple[str, State]]],
    solution_path: List[Transition],
    output_path: str = "state_space.dot",
) -> Path:
    path = Path(output_path)
    path.write_text(graph_to_dot(graph, solution_path), encoding="utf-8")
    return path


def graph_to_dot(
    graph: Dict[State, List[Tuple[str, State]]],
    solution_path: List[Transition],
) -> str:
    solution_edges = {(step.from_state, step.to_state) for step in solution_path}
    solution_nodes = {step.from_state for step in solution_path} | {step.to_state for step in solution_path}

    lines = [
        "digraph WaterJugStateSpace {",
        '    rankdir=LR;',
        '    labelloc="t";',
        '    label="Water Jug Problem State Space";',
        '    node [shape=circle, style=filled, fillcolor="white", color="gray35", fontname="Helvetica"];',
        '    edge [color="gray55", fontname="Helvetica"];',
    ]

    for state in sorted(graph.keys()):
        fillcolor = "palegreen" if state in solution_nodes else "white"
        color = "forestgreen" if state in solution_nodes else "gray35"
        penwidth = "2" if state in solution_nodes else "1"
        lines.append(
            f'    "{state}" [fillcolor="{fillcolor}", color="{color}", penwidth={penwidth}];'
        )

    for source, edges in sorted(graph.items()):
        for action, target in edges:
            color = "forestgreen" if (source, target) in solution_edges else "gray55"
            penwidth = "2" if (source, target) in solution_edges else "1"
            lines.append(
                f'    "{source}" -> "{target}" [label="{action}", color="{color}", penwidth={penwidth}];'
            )

    lines.append("}")
    return "\n".join(lines) + "\n"
