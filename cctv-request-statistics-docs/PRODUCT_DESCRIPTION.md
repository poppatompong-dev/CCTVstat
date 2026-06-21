# CCTVStat Product Description / PRD

CCTVStat is an internal web application for municipal staff to record and analyze statistics for CCTV footage viewing requests. The official request process still relies on paper forms; this system helps staff create a short reference number, categorize each request, optionally attach supporting documents, and generate reports.

## Target Users

Primary users are municipal officers who receive, record, search, update, and report CCTV viewing requests. The app is designed for quick use on desktop, tablet, and mobile devices.

## Core User Flows

### 1. Login

Users access the system through a shared password gate. Unauthenticated users are redirected to the login page. After entering the correct shared password, users are taken to the dashboard.

### 2. Dashboard

The dashboard shows summary metrics such as total requests, requests this month, requests with attachments, latest request number, and requests that should be followed up. Users can navigate to add a new request, view reports, or open request lists.

### 3. Create Request

Users create a new CCTV request by entering only the required statistical fields:

- request date
- requester type
- category
- status

Optional fields include location and notes. The system previews the next likely request number, but the real request number is confirmed only after saving. Request numbers follow the Thai fiscal year format, such as `C69-0001`.

The main request form should render before non-critical assistive data is ready. Smart defaults and location autocomplete load after the form is visible so staff can start working immediately, especially on Vercel/Neon cold starts.

### 4. Search, Filter, and Edit Requests

Users can search by request number or location and filter by date range, requester type, category, status, or quick views such as this month, follow-up, and found footage. Users can edit request details, intentionally correct request numbers for backfill/correction cases, and soft-delete records.

### 5. Attachments

After a request is created, users can optionally upload supporting evidence such as request forms, police reports, official letters, images, or Word/PDF documents. Users can select multiple files per upload action, preview selected files, and review uploaded files in a thumbnail/gallery layout. Attachments are stored privately and downloaded through the application.

### 6. Master Data Management

Users can manage requester types, categories, statuses, and evidence types. Items can be added, renamed, reordered with a drag handle, activated, or deactivated. New items are appended automatically; users never type a sort-order number. Dropping an item saves the complete order immediately, while a failed save restores the previous order. Inactive items remain readable for historical records.

### 7. Reports and Exports

Users can generate reports by date range and filters. Reports include totals, category breakdowns, requester type breakdowns, status breakdowns, monthly trends, found-rate insights, detailed request tables, Excel export, print-to-PDF view, and backup export.

The reports page should provide immediate shell/loading feedback while aggregate queries are running, instead of keeping the previous screen visually frozen.

## Important Product Rules

- The app is a statistics and record-keeping tool, not a full case-management system.
- The paper request form remains the official document.
- Request numbers must not be reused, even after soft deletion.
- Request number correction is allowed only when intentional and valid.
- The `CYY-NNNN` prefix must match the Thai fiscal year derived from the request date.
- File attachment is optional and must not block quick request recording.
- The app should avoid collecting unnecessary personal information.
- Smart features must remain assistive and non-blocking.

## Key Test Scenarios

- Unauthenticated access redirects to login.
- Correct password allows login.
- Incorrect password shows an error.
- Dashboard loads after login.
- Creating a request generates the correct fiscal-year request number.
- Editing general request data does not automatically change the request number.
- Invalid request number formats are rejected.
- Request numbers with mismatched fiscal years are rejected.
- Duplicate request numbers are rejected.
- Soft-deleted requests are hidden from normal lists and reports.
- Master data save returns users to the correct settings page.
- Dragging master data saves a contiguous, duplicate-free order immediately; a failed save restores the previous order.
- Attachments can be uploaded, listed, downloaded, and deleted when Blob credentials are configured.
- Multiple attachments can be uploaded in one action, with file count and per-file size limits.
- Image attachments show thumbnails, and document attachments show clear file-type cards.
- Save, upload, delete, and confirmation flows provide visible modal/pending feedback.
- Reports and exports respect filters.
- Quick filters show the expected request subsets.
- Local development login works on `127.0.0.1:3001`.
- Request creation and reports show fast shell/loading feedback before slower assistive or aggregate data finishes loading.

## Current Status

The MVP application code is complete for local testing. Lint and production build pass. Local dashboard, request list, request creation page, reports, performance instrumentation, perceived-performance loading states, and attachment UX have been verified at build/smoke-test level. Remaining work before real trial usage is deployment/runtime validation on Vercel with real environment variables, Neon PostgreSQL, and Vercel Blob.
