from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from typing import List

from agent import AgentExecution, WaterJugAgent, WaterJugRequest
from search import SearchResult, Transition
from visualization import build_state_space_graph, export_state_space_to_dot


def format_path(path: List[Transition]) -> str:
    if not path:
        return "(0, 0)"

    states = [str(path[0].from_state)]
    states.extend(str(step.to_state) for step in path)
    return " -> ".join(states)


def print_result(result: SearchResult) -> None:
    print(f"\nAlgorithm: {result.algorithm}")
    print(f"Status: {result.message}")
    print(f"Visited states: {result.visited_count}")
    print("State space exploration order:")
    print(" -> ".join(str(state) for state in result.explored_order) if result.explored_order else "No states explored.")

    if not result.success:
        return

    print("\nSteps from initial state to goal:")
    if not result.path:
        print("Initial state is already the goal: (0, 0)")
    else:
        for index, step in enumerate(result.path, start=1):
            print(f"{index}. {step.action}: {step.from_state} -> {step.to_state}")

    print(f"\nNumber of steps: {len(result.path)}")
    print(f"Path taken: {format_path(result.path)}")
    print(f"Goal state: {result.goal_state}")


def write_visualization(jug1_capacity: int, jug2_capacity: int, result: SearchResult) -> Path:
    graph = build_state_space_graph(jug1_capacity, jug2_capacity)
    return export_state_space_to_dot(graph, result.path)


def read_positive_integer(prompt: str) -> int:
    while True:
        raw_value = input(prompt).strip()
        try:
            value = int(raw_value)
        except ValueError:
            print("Please enter a valid integer.")
            continue

        if value < 0:
            print("Please enter a non-negative integer.")
            continue

        return value


def read_algorithm() -> str:
    while True:
        choice = input("Choose algorithm (BFS/DFS): ").strip().lower()
        if choice in {"bfs", "dfs"}:
            return choice
        print("Please type BFS or DFS.")


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] == '--web':
        run_web_app()
    else:
        run_cli()


def run_cli() -> None:
    print("Water Jug Problem Solver")
    print("AI Agent Workflow Demo (ADK-style Architecture)")
    print("Use --web flag to run as web server")

    jug1_capacity = read_positive_integer("Enter Jug1 capacity: ")
    jug2_capacity = read_positive_integer("Enter Jug2 capacity: ")
    target_amount = read_positive_integer("Enter target amount: ")
    algorithm = read_algorithm()

    try:
        agent = WaterJugAgent()
        request = WaterJugRequest(
            jug1_capacity=jug1_capacity,
            jug2_capacity=jug2_capacity,
            target_amount=target_amount,
            algorithm=algorithm,
        )
        execution = agent.run(request)
    except ValueError as error:
        print(f"\nConfiguration error: {error}")
        return

    result = execution.result
    print(f"\nAgent authenticated with API key: {agent.api_key[:2]}{'*' * max(len(agent.api_key) - 2, 0)}")
    print_result(result)

    graph_path = write_visualization(jug1_capacity, jug2_capacity, result)
    print(f"State space graph saved to: {graph_path.resolve()}")
    print("Open the DOT file with Graphviz to view the visualization.")


def run_web_app() -> None:
    app_path = Path(__file__).with_name("streamlit_app.py")
    if not app_path.exists():
        print("Error: streamlit_app.py was not found.")
        sys.exit(1)

    print("Starting localhost ADK-style web app...")
    print("The browser page will collect the inputs.")
    print("Open http://localhost:8501 if it does not open automatically.")

    command = [
        sys.executable,
        "-m",
        "streamlit",
        "run",
        str(app_path),
        "--server.headless=true",
        "--browser.gatherUsageStats=false",
    ]
    raise SystemExit(subprocess.call(command))


if __name__ == "__main__":
    main()
