# Careers / job application fixes

Found and fixed while wiring up the Careers pages in `new-ignite-nursing-website`
(on the `feat/forms-collections` branch), then ported here to `main` since
these bugs live in shared code and affect every site using this package.

## 1. Re-applying never wrote the new CV to disk

**File:** `src/admin/server-actions/careers.ts`, `getOrCreateJobApplication`

When someone applied a second time for the same job with the same email (the
"update an existing application" path), the code deleted the old CV file and
updated the database record to point at a new filename — but never actually
wrote the new file to disk. The application record ended up pointing at a CV
that never existed, so anything reading it (the admin UI, the assessment
email attachment) would fail or 404.

**Fix:** call `createCVFile()` on the update path too, before updating the
record.

## 2. CV writes/deletes weren't awaited (race condition)

**File:** `src/admin/server-actions/careers.ts`, `createCVFile` / `deleteCVFile`

Both functions were `async` but used the callback form of `fs.writeFile` /
`fs.unlink` without wrapping or awaiting the callback — the function resolved
as soon as the synchronous part finished, not when the file operation
actually completed. Callers awaiting these functions (application submission,
redirect to the assessment page) could proceed before the file was actually
on disk, causing intermittent "file not found" failures under load.

**Fix:** use `fs.promises.writeFile` / `fs.promises.unlink` and `await` them
properly.

## 3. Assessment page 404s for every open job with questions (inverted condition)

**File:** `src/pages/careers/assessment.tsx`

```ts
if (!job || !job.job_questions || isJobOpenForApplications(job as JobPosting)) {
  return notFound();
}
```

`isJobOpenForApplications` returns `true` when the job **is** open. This
condition 404s exactly when it's true — i.e. whenever the job is open, which
is the normal case. Any job posting with `job_questions` configured would
send the applicant straight to a 404 the moment they tried to continue past
the initial form. `detail.tsx` uses the same helper correctly, negated
(`!isJobOpenForApplications(job)`), which is what exposed the mismatch.

**Fix:** negate the condition — `!isJobOpenForApplications(job as JobPosting)`.

## 4. CV upload dropzone had a malformed `accept` prop

**File:** `src/components/forms/carrers/application.tsx`

```tsx
accept={{
  docs: [".pdf", "doc", ".docx"],
}}
```

`react-dropzone`'s `accept` option must be a map of **MIME type → extensions**
(e.g. `{ "application/pdf": [".pdf"] }`). `{ docs: [...] }` isn't a valid MIME
type, so the accept filter didn't work as intended — legitimate PDF/DOC/DOCX
files could get rejected client-side (shown via `RejectionFiles`) even though
the server-side validation (`file_types` in `careers.ts`) accepts them fine.

**Fix:** use proper MIME-type keys, and added `.odt` (`application/vnd.oasis.
opendocument.text`) to match what the backend already accepts:

```tsx
accept={{
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.oasis.opendocument.text": [".odt"],
}}
```

## 5. Careers filters section imported a nonexistent asset path

**File:** `src/sections/careers/filters.tsx`

```ts
import bgPattern from "assets/get-in-touch/pattern.png";
```

Bare `assets/...` import with no `@elvora/` prefix. The file actually lives
at `src/assets/get-in-touch/pattern.png` inside this package (and is imported
correctly elsewhere, e.g. `components/forms/carrers/application.tsx`, as
`@elvora/assets/get-in-touch/pattern.png`). Without a matching `assets/*` path
alias in a consuming app, this import fails to resolve at build time —
breaking the entire careers list page (which renders `CareersPageFilters`).

**Fix:** `@elvora/assets/get-in-touch/pattern.png`.

## Not fixed here (pre-existing gaps, out of scope)

- `application.tsx` links to `/terms-and-conditions/` and the privacy policy
  route (`baseRoutes.termsAndConditions.root` / `baseRoutes.privacyPolicy.
  root`) — whether those pages exist depends on the consuming app. Not a
  package bug.
- `getCvFilename`'s `absolute` parameter was dead code (both branches
  returned the same value) — removed as part of fix #1/#2's cleanup, no
  behavioural change since `BASE_DIR` already equals `process.cwd()`.

## Also in this change: `Services` collection

`ignite-nursing-website` had a `services` Payload collection (backing its
`/services` section — agency staffing, complex care, respite care, etc.)
vendored directly into a local copy of this package rather than merged
upstream, so it only ever existed on that one site's checkout. Ported here
(`src/admin/collections/Services/`, migration
`20260901_145444_services`) so it's available from `main` like everything
else, instead of living only as an un-mergeable local fork.
