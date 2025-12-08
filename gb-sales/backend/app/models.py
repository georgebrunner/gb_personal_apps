from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class Vertical(str, Enum):
    LIFE = "life"
    BUILD = "build"
    LEGAL = "legal"


class ChecklistItem(str, Enum):
    INITIAL_MEETING = "initial_meeting"
    NDA = "nda"
    DATA_INTAKE_PROPOSAL = "data_intake_proposal"
    PITCH_DECK = "pitch_deck"
    CLOSING_MEETING = "closing_meeting"
    # BANT
    BUDGET = "budget"
    AUTHORITY = "authority"
    NEED = "need"
    TIMELINE = "timeline"
    # ROI
    PROVE_ROI = "prove_roi"


class ChecklistItemStatus(BaseModel):
    item: ChecklistItem
    completed: bool = False
    completed_at: Optional[str] = None
    notes: Optional[str] = None


class Prospect(BaseModel):
    id: Optional[str] = None
    name: str
    vertical: Optional[Vertical] = None
    checklist: List[ChecklistItemStatus] = []
    status: Optional[str] = "active"  # active, won, lost
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ProspectCreate(BaseModel):
    name: str
    vertical: Optional[Vertical] = None
    notes: Optional[str] = None


class ChecklistUpdate(BaseModel):
    item: ChecklistItem
    completed: bool
    notes: Optional[str] = None
