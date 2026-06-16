# Reject request number fiscal year mismatch

When a request number is manually corrected or imported for backfill, the `CYY` portion must match the Thai fiscal year derived from `request_date`. The app will reject mismatches with a clear validation message instead of allowing a warning-only save, because mismatched request numbers would make fiscal-year reporting unreliable.

