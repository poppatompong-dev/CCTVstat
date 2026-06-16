# Use soft delete for requests

Requests will use soft delete instead of hard delete so historical request numbers, reports, and backfill/import work remain auditable. Deleted requests are hidden from normal search/report totals by default, but their numbers stay reserved and can be reviewed or restored later if needed.

