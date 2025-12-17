"""
Shared storage module that works with both local files and S3.
Automatically uses S3 when running in Lambda (USE_S3=true), otherwise uses local files.
"""

from .base import Storage, get_storage

__all__ = ["Storage", "get_storage"]
