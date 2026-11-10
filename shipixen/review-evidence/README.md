# Review evidence

This ledger is the durable record of a submission review. It is not a product-quality score.

Each record is bound to one pull request, head SHA, product, category, and calendar date. The id is the SHA-256 of those fields, so running the check again on the same day updates that record instead of creating a second one. A later date, a new head, or another category is a different review.

Machine checks may say `pass`, `fail`, `needs-human`, or `pending-trusted-generation`. They always leave `visualReview` as `pending`. A person sets that to `accepted` or `rejected` after looking at the product site. A later machine run keeps that decision and any human notes.

`actions` records work such as a website screenshot. Claiming an action twice for the same record does nothing the second time, so an unattended run cannot repeat it.

Fork CI writes an evidence artifact from the trusted copy of these scripts. It does not commit the ledger and it does not launch a browser. Screenshot capture belongs to the trusted generator after a maintainer accepts the README change.

The live ledger starts empty. Past editions under `shipixen/archive/` are not review records and are not rewritten by this check.
