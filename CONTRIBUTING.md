# Contributing to the Dashboard

Contributions to the Dashboard include code, documentation, answering user questions, running the project's infrastructure, and advocating for all types of users.

The project welcomes all contributions from anyone willing to work in good faith with other contributors and the community. No contribution is too small, and all contributions are valued.

The project has an open governance model. Individuals making significant and valuable contributions are made committers and given commit-access to the project.

## Contents

* [Code of Conduct](#code-of-conduct)
* [Issues](#issues)
* [Pull Requests](#pull-requests)
* [Current Initiatives](#current-initiatives)
* [Developer's Certificate of Origin 1.1](#developers-certificate-of-origin-11)

## Code of Conduct

The project has a [Code of Conduct](/CODE_OF_CONDUCT.md) to which all contributors must adhere.

## Issues

You have several templates available:

* [Asking for General Help](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/new?assignees=&labels=&projects=&template=other.md&title=)
* [Request a New Feature](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/new?assignees=&labels=feature-request&projects=&template=feature_request.md&title=)
* [Report a Bug](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBUG%5D)
* [Other](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/new?assignees=&labels=&projects=&template=other.md&title=)

## Pull Requests

Here are some recommendations for creating PRs in this project.

Creating a high-quality Pull Request (PR) helps maintainers review your contribution efficiently and ensures it aligns with the project's standards. Follow these steps to make your PR outstanding:

### 1. Understand the Project's Guidelines

- **Read the [Contributing Guidelines](CONTRIBUTING.md):** Check for any specific requirements for this project.
- **Follow the [Code of Conduct](CODE_OF_CONDUCT.md):** Ensure respectful communication and behavior.

### 2. Before You Start

- **Create an Issue (if required):** Link your PR to an issue if it addresses a bug or feature request.
- **Sync with the Main Branch:** Update your fork or branch with the latest changes to avoid conflicts.
- **Focus Your Work:** Address one issue or feature per PR.
- **Ensure the Work Is Expected:** Avoid submitting a PR when there is an ongoing discussion on the topic, as this might require you to make significant changes.
- **Avoid Duplications:** Check open PRs to avoid duplications.

### 3. Writing the Code

- **Follow Coding Standards:** Use [Standard](https://standardjs.com/) and refer to [the linter commands](/README.md#linting) to resolve any issues.
- **Write Tests:** Add or update tests to cover your changes. Check [the testing section](/README.md#testing).
- **Keep Changes Minimal:** Avoid unrelated changes or large rewrites, as this will make your PR hard to review. We prefer many small PRs rather than one large PR.

### 4. Writing the PR

- **Descriptive Title:** Use a clear and concise title that summarizes the change.
- **Detailed Description:** Include the following in the description:
  - **What:** Explain what the PR does.
  - **Why:** Describe why the change is necessary.
  - **How:** Summarize how you implemented the change.
  - **Related Issue:** Link any relevant issues (e.g., `Closes #123`).
- **Screenshots/Logs (if applicable):** Provide evidence of your changes for visual or functional updates.

### 5. Review Checklist

Before submitting your PR:
- [ ] Code is linted and passes all style checks.
- [ ] Tests are added, updated, and pass.
- [ ] Documentation is updated (if applicable).
- [ ] The branch is up-to-date with the main branch.
- [ ] Commit messages are clear and follow the project's guidelines.

### 6. Submit and Engage

- **Submit the PR:** Push your branch and open the PR using the project's preferred platform (e.g., GitHub).
- **Review Automated Comments:** Pipelines in this project might auto-suggest changes or additional steps based on the submitted changes. Please review them.
- **Check CI Results:** This project includes a CI pipeline that will check your PR for linting, tests, migrations, and more. Please review the logs in case of errors.
- **Engage with Feedback:** Respond promptly to reviewer comments and make necessary updates.
- **Be Patient:** Reviewers may take time to go through your PR.
- **Ask for Help Anytime:** Contributing to an open-source project might be challenging. Please share any concerns or ask for clarifications when needed. We are here to help you.

By following these steps, you'll create a high-quality PR that is easier to review and more likely to be accepted. Thank you for contributing!

## Current Initiatives

Here you can find the best ways to make meaningful contributions to the project.

### Add Compliance Checks

We are looking for contributors to implement compliance checks in the Dashboard. Here is a process to achieve this:

1. Check the open issues related to [compliance checks](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues?q=sort%3Aupdated-desc+is%3Aissue+label%3Acompliance-checks+is%3Aopen). Focus on issues with a title following this pattern: `Add Compliance check: *`, such as [Add Compliance check: githubOrgMFA](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/43).

2. Engage in the conversation and request to lead or contribute to the implementation. A key part of this process is defining a way to implement the compliance check (e.g., data usage, alerting criteria, etc.).

3. Start development by completing the following tasks:

#### Development Steps

- **1. Define a Good Implementation ([Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues/43#issuecomment-2524594504)):**
  - Read the documentation (guidelines, best practices, etc.).
  - Brainstorm the implementation details (logic, alerts, tasks, validations, edge cases, etc.).
  - Reach an agreement on the implementation details before starting.

- **2. Update Check Record ([Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/55eaac59920a5229ef9eeaf859943578a66d1aeb)):**
  - Update the `compliance_checks` row with fields like `how_to_url`, `implementation_status`, `implementation_type`, and `implementation_details_reference`.
  - Test migration scripts using `npm run db:migrate` and `npm run db:rollback`.
  - Update the database schema with `npm run db:generate-schema`.

- **3. Implement the Business Logic ([Validator Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/44c41d119f0daefb7b2e496ba35d5ab65bcc319b) and [Check Example](https://github.com/secure-dashboards/openjs-foundation-dashboard/commit/6f1e16129ee0d01a1b9b536cd2dc6090b048b71f)):**
  - Add the specific validator in `src/checks/validators/index.js`.
  - Add the check logic in `src/checks/complianceChecks`.
  - Ensure the check is applicable to the organization (`isCheckApplicableToProjectCategory`).
  - Calculate `severity` accurately (`getSeverityFromPriorityGroup`).
  - Update relevant database tables (`compliance_checks_alerts`, `compliance_checks_tasks`, `compliance_checks_results`).

- **4. Ensure It Works as Expected:**
  - Add unit tests for the validator check.
  - Add integration test cases for the check.
  - Verify all tests pass.
  - Run `check run --name {check_code_name}` and verify database changes. Update the seed script if necessary (`npm run db:seed`).

- **5. Update the Website ([Example](https://github.com/secure-dashboards/openjs-security-program-standards/pull/9)):**
  - Review content at `https://openjs-security-program-standards.netlify.app/details/{check_code_name}`.
  - Create a PR to include check calculation details and mitigation information.

### Other

Any issue labeled [help wanted](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) or [good first issue](https://github.com/secure-dashboards/openjs-foundation-dashboard/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) is a great opportunity to help the project.

## Developer's Certificate of Origin 1.1


```text
By making a contribution to this project, I certify that:

 (a) The contribution was created in whole or in part by me and I
     have the right to submit it under the open source license
     indicated in the file; or

 (b) The contribution is based upon previous work that, to the best
     of my knowledge, is covered under an appropriate open source
     license and I have the right under that license to submit that
     work with modifications, whether created in whole or in part
     by me, under the same open source license (unless I am
     permitted to submit under a different license), as indicated
     in the file; or

 (c) The contribution was provided directly to me by some other
     person who certified (a), (b) or (c) and I have not modified
     it.

 (d) I understand and agree that this project and the contribution
     are public and that a record of the contribution (including all
     personal information I submit with it, including my sign-off) is
     maintained indefinitely and may be redistributed consistent with
     this project or the open source license(s) involved.
```