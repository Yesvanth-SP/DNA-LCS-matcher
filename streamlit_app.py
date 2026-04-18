from __future__ import annotations

from pathlib import Path

import streamlit as st

from agent import WaterJugAgent, WaterJugRequest
from main import format_path
from visualization import build_state_space_graph, export_state_space_to_dot, graph_to_dot


st.set_page_config(
    page_title="Water Jug ADK Agent",
    page_icon="AI",
    layout="wide",
)

st.title("Water Jug Problem Solver")
st.caption("Localhost ADK-style agent app")

with st.sidebar:
    st.subheader("Agent Workflow")
    st.write("1. Collect task input")
    st.write("2. Authenticate with `API_KEY`")
    st.write("3. Choose BFS or DFS")
    st.write("4. Solve via state space search")
    st.write("5. Return path and graph")

st.write("Enter the problem details below and run the agent from this localhost page.")

with st.form("water_jug_form"):
    jug1_capacity = st.number_input("Jug1 capacity", min_value=1, step=1, value=4)
    jug2_capacity = st.number_input("Jug2 capacity", min_value=1, step=1, value=3)
    target_amount = st.number_input("Target amount", min_value=0, step=1, value=2)
    algorithm = st.selectbox("Search algorithm", ["BFS", "DFS"])
    submitted = st.form_submit_button("Run Agent")

if submitted:
    try:
        agent = WaterJugAgent()
        request = WaterJugRequest(
            jug1_capacity=int(jug1_capacity),
            jug2_capacity=int(jug2_capacity),
            target_amount=int(target_amount),
            algorithm=algorithm.lower(),
        )
        execution = agent.run(request)
        result = execution.result

        graph = build_state_space_graph(int(jug1_capacity), int(jug2_capacity))
        graph_path = export_state_space_to_dot(graph, result.path)
        dot_text = graph_to_dot(graph, result.path)
        api_key_display = f"{agent.api_key[:2]}{'*' * max(len(agent.api_key) - 2, 0)}"

        top_left, top_right = st.columns([1, 1])

        with top_left:
            st.subheader("Agent Summary")
            st.write(f"Authenticated with API key: `{api_key_display}`")
            st.write(f"Algorithm: `{result.algorithm}`")
            st.write(f"Status: {result.message}")
            st.write(f"Visited states: `{result.visited_count}`")
            st.write(f"Number of steps: `{len(result.path)}`")
            st.write(f"Goal state: `{result.goal_state}`")
            st.write(f"Path taken: `{format_path(result.path)}`")

        with top_right:
            st.subheader("ADK-Style Stages")
            for step in execution.steps:
                st.markdown(f"**{step.stage.title()}**: {step.detail}")

        st.subheader("State Transitions")
        if result.path:
            for index, step in enumerate(result.path, start=1):
                st.write(f"{index}. {step.action}: {step.from_state} -> {step.to_state}")
        else:
            st.write("No transition steps were needed or no solution was found.")

        st.subheader("State Space Exploration Order")
        if result.explored_order:
            st.code(" -> ".join(str(state) for state in result.explored_order))
        else:
            st.write("No states explored.")

        st.subheader("State Space Graph")
        st.graphviz_chart(dot_text)
        st.caption(f"DOT file saved to `{Path(graph_path).resolve()}`")

    except ValueError as error:
        st.error(str(error))
    except Exception as error:
        st.exception(error)
