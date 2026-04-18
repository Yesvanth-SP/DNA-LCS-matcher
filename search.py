from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from typing import Deque, Dict, Iterable, List, Optional, Set, Tuple


State = Tuple[int, int]


@dataclass(frozen=True)
class Transition:
    action: str
    from_state: State
    to_state: State


@dataclass
class SearchResult:
    algorithm: str
    success: bool
    goal_state: Optional[State]
    path: List[Transition]
    explored_order: List[State]
    visited_count: int
    message: str


def is_goal(state: State, target: int) -> bool:
    return state[0] == target or state[1] == target


def generate_next_states(state: State, jug1_capacity: int, jug2_capacity: int) -> Iterable[Tuple[str, State]]:
    jug1, jug2 = state

    yield "Fill Jug1", (jug1_capacity, jug2)
    yield "Fill Jug2", (jug1, jug2_capacity)
    yield "Empty Jug1", (0, jug2)
    yield "Empty Jug2", (jug1, 0)

    pour_to_jug2 = min(jug1, jug2_capacity - jug2)
    yield "Pour Jug1 -> Jug2", (jug1 - pour_to_jug2, jug2 + pour_to_jug2)

    pour_to_jug1 = min(jug2, jug1_capacity - jug1)
    yield "Pour Jug2 -> Jug1", (jug1 + pour_to_jug1, jug2 - pour_to_jug1)


def _build_path(parent_map: Dict[State, Tuple[Optional[State], Optional[str]]], goal_state: State) -> List[Transition]:
    path: List[Transition] = []
    current = goal_state

    while True:
        parent_state, action = parent_map[current]
        if parent_state is None or action is None:
            break
        path.append(Transition(action=action, from_state=parent_state, to_state=current))
        current = parent_state

    path.reverse()
    return path


def _validate_inputs(jug1_capacity: int, jug2_capacity: int, target: int) -> Optional[str]:
    if jug1_capacity <= 0 or jug2_capacity <= 0:
        return "Jug capacities must both be greater than 0."
    if target < 0:
        return "Target amount cannot be negative."
    if target > max(jug1_capacity, jug2_capacity):
        return "Target amount must fit in at least one jug."
    return None


def bfs_search(jug1_capacity: int, jug2_capacity: int, target: int) -> SearchResult:
    error = _validate_inputs(jug1_capacity, jug2_capacity, target)
    if error:
        return SearchResult("BFS", False, None, [], [], 0, error)

    start: State = (0, 0)
    queue: Deque[State] = deque([start])
    visited: Set[State] = {start}
    explored_order: List[State] = []
    parent_map: Dict[State, Tuple[Optional[State], Optional[str]]] = {start: (None, None)}

    while queue:
        current = queue.popleft()
        explored_order.append(current)

        if is_goal(current, target):
            path = _build_path(parent_map, current)
            return SearchResult(
                algorithm="BFS",
                success=True,
                goal_state=current,
                path=path,
                explored_order=explored_order,
                visited_count=len(visited),
                message="Goal reached using Breadth-First Search.",
            )

        for action, next_state in generate_next_states(current, jug1_capacity, jug2_capacity):
            if next_state in visited:
                continue

            visited.add(next_state)
            parent_map[next_state] = (current, action)
            queue.append(next_state)

    return SearchResult(
        algorithm="BFS",
        success=False,
        goal_state=None,
        path=[],
        explored_order=explored_order,
        visited_count=len(visited),
        message="No solution found using Breadth-First Search.",
    )


def dfs_search(jug1_capacity: int, jug2_capacity: int, target: int) -> SearchResult:
    error = _validate_inputs(jug1_capacity, jug2_capacity, target)
    if error:
        return SearchResult("DFS", False, None, [], [], 0, error)

    start: State = (0, 0)
    stack: List[State] = [start]
    visited: Set[State] = {start}
    explored_order: List[State] = []
    parent_map: Dict[State, Tuple[Optional[State], Optional[str]]] = {start: (None, None)}

    while stack:
        current = stack.pop()
        explored_order.append(current)

        if is_goal(current, target):
            path = _build_path(parent_map, current)
            return SearchResult(
                algorithm="DFS",
                success=True,
                goal_state=current,
                path=path,
                explored_order=explored_order,
                visited_count=len(visited),
                message="Goal reached using Depth-First Search.",
            )

        next_moves = list(generate_next_states(current, jug1_capacity, jug2_capacity))
        for action, next_state in reversed(next_moves):
            if next_state in visited:
                continue

            visited.add(next_state)
            parent_map[next_state] = (current, action)
            stack.append(next_state)

    return SearchResult(
        algorithm="DFS",
        success=False,
        goal_state=None,
        path=[],
        explored_order=explored_order,
        visited_count=len(visited),
        message="No solution found using Depth-First Search.",
    )
