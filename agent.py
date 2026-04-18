from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict

from config import get_api_key
from search import SearchResult, bfs_search, dfs_search


@dataclass
class WaterJugRequest:
    jug1_capacity: int
    jug2_capacity: int
    target_amount: int
    algorithm: str


@dataclass
class AgentStep:
    stage: str
    detail: str


@dataclass
class AgentExecution:
    request: WaterJugRequest
    result: SearchResult
    steps: list[AgentStep]


class WaterJugAgent:
    def __init__(self) -> None:
        self.api_key = get_api_key()
        self.authenticated = False
        self.algorithms: Dict[str, Callable[[int, int, int], SearchResult]] = {
            "bfs": bfs_search,
            "dfs": dfs_search,
        }

    def authenticate(self) -> None:
        # Simulate an agent authenticating before it can use tools.
        if len(self.api_key) < 4:
            raise ValueError("API_KEY is present but looks invalid.")
        self.authenticated = True

    def choose_algorithm(self, algorithm_name: str) -> Callable[[int, int, int], SearchResult]:
        normalized = algorithm_name.strip().lower()
        if normalized not in self.algorithms:
            raise ValueError("Unsupported algorithm. Choose BFS or DFS.")
        return self.algorithms[normalized]

    def solve(self, request: WaterJugRequest) -> SearchResult:
        if not self.authenticated:
            self.authenticate()

        solver = self.choose_algorithm(request.algorithm)
        return solver(request.jug1_capacity, request.jug2_capacity, request.target_amount)

    def run(self, request: WaterJugRequest) -> AgentExecution:
        steps = [
            AgentStep("input", "Accepted jug capacities, target amount, and search strategy."),
            AgentStep("authentication", "Validated API_KEY before using search tools."),
        ]

        if not self.authenticated:
            self.authenticate()

        solver = self.choose_algorithm(request.algorithm)
        steps.append(AgentStep("planning", f"Selected {request.algorithm.upper()} as the search policy."))

        result = solver(request.jug1_capacity, request.jug2_capacity, request.target_amount)
        steps.append(
            AgentStep(
                "execution",
                f"Explored {result.visited_count} states and {'found' if result.success else 'did not find'} a solution.",
            )
        )
        steps.append(AgentStep("response", "Prepared state transitions, final path, and graph output for the user."))

        return AgentExecution(request=request, result=result, steps=steps)
