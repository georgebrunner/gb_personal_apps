"""
Local file storage for GB Personal apps.
"""

import json
from pathlib import Path
from typing import Optional, List


class Storage:
    """Local file system storage."""

    def __init__(self, app_name: str, base_path: str = None):
        """
        Initialize storage for a specific app.

        Args:
            app_name: Name of the app (e.g., 'health', 'guitar', 'food')
            base_path: Base path for storage
        """
        self.app_name = app_name
        if base_path:
            self.data_dir = Path(base_path)
        else:
            # Default: relative to the backend directory
            self.data_dir = Path(__file__).parent.parent.parent / f"gb-{app_name}" / "data"

    def _get_path(self, key: str) -> Path:
        """Convert key to file path."""
        return self.data_dir / key

    def _ensure_dir(self, path: Path) -> None:
        """Ensure parent directory exists."""
        path.parent.mkdir(parents=True, exist_ok=True)

    def read_json(self, key: str) -> Optional[dict | list]:
        """Read a JSON file."""
        path = self._get_path(key)
        if not path.exists():
            return None
        with open(path, "r") as f:
            return json.load(f)

    def write_json(self, key: str, data: dict | list) -> None:
        """Write a JSON file."""
        path = self._get_path(key)
        self._ensure_dir(path)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def delete(self, key: str) -> bool:
        """Delete a file."""
        path = self._get_path(key)
        if path.exists():
            path.unlink()
            return True
        return False

    def list_keys(self, prefix: str = "", suffix: str = ".json") -> List[str]:
        """List all keys matching prefix and suffix."""
        self._ensure_dir(self.data_dir / "dummy")
        results = []
        search_dir = self.data_dir / prefix if prefix else self.data_dir

        if not search_dir.exists():
            return []

        for path in search_dir.rglob(f"*{suffix}"):
            # Convert to relative key
            rel_path = path.relative_to(self.data_dir)
            results.append(str(rel_path).replace("\\", "/"))

        return sorted(results)

    def exists(self, key: str) -> bool:
        """Check if a key exists."""
        return self._get_path(key).exists()


def get_storage(app_name: str, base_path: str = None) -> Storage:
    """Get storage for an app."""
    return Storage(app_name, base_path)
