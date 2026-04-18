from __future__ import annotations

import os
from pathlib import Path
from typing import Dict


def load_env_file(env_path: str = ".env") -> Dict[str, str]:
    loaded_values: Dict[str, str] = {}
    path = Path(env_path)

    if not path.exists():
        return loaded_values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value
        loaded_values[key] = value

    return loaded_values


def get_api_key() -> str:
    load_env_file()
    api_key = os.getenv("API_KEY", "").strip()
    if not api_key:
        raise ValueError(
            "Missing API_KEY. Set it in your environment or create a .env file with API_KEY=your_key_here."
        )
    return api_key


def ensure_adk_model_key() -> str:
    load_env_file()
    api_key = get_api_key()

    # ADK commonly looks for GOOGLE_API_KEY when using Gemini models.
    if not os.getenv("GOOGLE_API_KEY", "").strip():
        os.environ["GOOGLE_API_KEY"] = api_key

    return os.environ["GOOGLE_API_KEY"]
