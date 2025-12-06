from datetime import date, timedelta
from . import storage


def calculate_streak(practice_dates: list[date]) -> int:
    """Calculate current consecutive practice day streak."""
    if not practice_dates:
        return 0

    sorted_dates = sorted(set(practice_dates), reverse=True)
    today = date.today()

    # Must have practiced today or yesterday to have active streak
    if sorted_dates[0] < today - timedelta(days=1):
        return 0

    streak = 1
    for i in range(len(sorted_dates) - 1):
        if sorted_dates[i] - sorted_dates[i + 1] == timedelta(days=1):
            streak += 1
        else:
            break

    return streak


def calculate_longest_streak(practice_dates: list[date]) -> int:
    """Calculate the longest streak ever."""
    if not practice_dates:
        return 0

    sorted_dates = sorted(set(practice_dates))
    if len(sorted_dates) == 1:
        return 1

    longest = 1
    current = 1

    for i in range(1, len(sorted_dates)):
        if sorted_dates[i] - sorted_dates[i - 1] == timedelta(days=1):
            current += 1
            longest = max(longest, current)
        else:
            current = 1

    return longest


def get_stats() -> dict:
    """Calculate all practice statistics."""
    practice_dates = storage.get_all_practice_dates()
    all_sessions = storage.get_all_practice_sessions(limit=365)  # Get up to a year

    today = date.today()
    week_start = today - timedelta(days=today.weekday())  # Monday
    month_start = today.replace(day=1)

    # Calculate totals
    total_minutes = sum(s.get("duration_minutes", 0) for s in all_sessions)

    # This week
    week_dates = [d for d in practice_dates if d >= week_start]
    week_sessions = [s for s in all_sessions
                     if s.get("date") and s["date"] >= week_start.isoformat()]
    week_minutes = sum(s.get("duration_minutes", 0) for s in week_sessions)

    # This month
    month_dates = [d for d in practice_dates if d >= month_start]
    month_sessions = [s for s in all_sessions
                      if s.get("date") and s["date"] >= month_start.isoformat()]
    month_minutes = sum(s.get("duration_minutes", 0) for s in month_sessions)

    return {
        "current_streak": calculate_streak(practice_dates),
        "longest_streak": calculate_longest_streak(practice_dates),
        "total_practice_minutes": total_minutes,
        "practice_days_this_week": len(set(week_dates)),
        "practice_days_this_month": len(set(month_dates)),
        "minutes_this_week": week_minutes,
        "minutes_this_month": month_minutes,
        "total_sessions": len(all_sessions),
        "total_practice_days": len(set(practice_dates))
    }
