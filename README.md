# Water Jug Problem Solver

This project solves the Water Jug Problem using state space search and now includes a real Google ADK module so you can run it with ADK commands such as `adk web`.

## Folder Structure

```text
.
|-- agent.py
|-- config.py
|-- main.py
|-- search.py
|-- streamlit_app.py
|-- visualization.py
|-- water_jug_agent/
|   |-- __init__.py
|   |-- agent.py
|   `-- tools.py
|-- .env.example
`-- README.md
```

## Features

- Solves the Water Jug Problem using:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
- Represents each state as `(x, y)`
- Supports all required operations:
  - Fill Jug1
  - Fill Jug2
  - Empty Jug1
  - Empty Jug2
  - Pour Jug1 -> Jug2
  - Pour Jug2 -> Jug1
- Avoids repeated states with a visited set
- Shows state space exploration order
- Prints the final path and number of steps
- Simulates agent authentication using `API_KEY`
- Runs on localhost with a Python-based Streamlit web app
- Includes a real Google ADK agent module
- Exports a state space graph as a Graphviz `.dot` file

## How the Agent Works

1. `streamlit_app.py` collects user input from the localhost web page.
2. `WaterJugAgent` in `agent.py` loads and validates `API_KEY`.
3. The agent chooses BFS or DFS.
4. The selected search method in `search.py` explores the state space.
5. `visualization.py` builds the full reachable state graph and highlights the solution path.
6. The app returns the agent workflow, transition path, and graph.

## Setup

Create a `.env` file in the project root:

```env
API_KEY=demo_key_12345
GOOGLE_API_KEY=demo_key_12345
```

You can also set `API_KEY` directly in your shell instead of using `.env`. The ADK module will automatically copy `API_KEY` into `GOOGLE_API_KEY` if `GOOGLE_API_KEY` is not already set.

## Dependencies

Install required packages:

```bash
pip install -r requirements.txt
```

## Run

### ADK Web UI (Recommended)

Run the real ADK module in localhost web mode:

```bash
adk web .
```

Then open the `water_jug_agent` app in the ADK web UI.

### ADK CLI

Run the ADK agent in terminal mode:

```bash
adk run water_jug_agent
```

Run both commands from the project folder:

```text
C:\Users\Yesvanth\OneDrive\Documents\New project
```

### Web Interface (Recommended)

Run the localhost app:

```bash
python main.py --web
```

Then open your browser and go to: http://localhost:8501

You can also run Streamlit directly:

```bash
streamlit run streamlit_app.py
```

### Command Line Interface

Run interactively in the terminal:

```bash
python main.py
```

After each run, the program also creates:

```text
state_space.dot
```

If you have Graphviz installed, you can render it with:

```bash
dot -Tpng state_space.dot -o state_space.png
```

## Localhost UI

The localhost page lets you:

- enter jug capacities and target amount
- choose BFS or DFS
- run the ADK-style agent workflow
- view state transitions
- inspect the exploration order
- render the state space graph in the browser

## ADK Module

The ADK package is [water_jug_agent/agent.py](C:\Users\Yesvanth\OneDrive\Documents\New%20project\water_jug_agent\agent.py). It exports `root_agent`, which is the required ADK entrypoint.

The main tool is [water_jug_agent/tools.py](C:\Users\Yesvanth\OneDrive\Documents\New%20project\water_jug_agent\tools.py), which:

- authenticates using `API_KEY`
- runs BFS or DFS
- avoids repeated states
- exports `state_space.dot`
- returns all steps and the final path to the ADK agent

## Notes

- BFS usually finds the shortest solution in terms of number of transitions.
- DFS is included to demonstrate a second state space search strategy.
- The generated graph contains all reachable states from `(0, 0)`.
- Nodes and edges in green belong to the solution path found by the selected algorithm.
- The web app uses Streamlit, so you do not need to create or edit HTML template files.
- For real ADK usage, use `adk web` or `adk run water_jug_agent`.
