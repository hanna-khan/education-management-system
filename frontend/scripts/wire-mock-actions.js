const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src", "modules");

function ensureImport(src, importLine) {
  if (src.includes("mock-action")) return src;
  if (src.includes('from "@/components/ui/button"')) {
    return src.replace(
      /import \{ Button \} from "@\/components\/ui\/button";/,
      `import { Button } from "@/components/ui/button";\n${importLine}`,
    );
  }
  // insert after "use client"
  return src.replace('"use client";\n', `"use client";\n\n${importLine}\n`);
}

const IMPORT = 'import { MockActionButton, MockToastButton, MOCK_FORMS } from "@/components/shared/mock-action";';

function write(rel, transform) {
  const file = path.join(root, rel);
  let s = fs.readFileSync(file, "utf8");
  s = ensureImport(s, IMPORT);
  s = transform(s);
  fs.writeFileSync(file, s);
  console.log("patched", rel);
}

write("applications/pages.tsx", (s) => {
  s = s.replace(
    `actions={
        <Button size="sm">
          <Plus className="size-4" />
          New application
        </Button>
      }`,
    `actions={
        <MockActionButton
          label="New application"
          title="New application"
          description="Submit a service request (demo)."
          fields={MOCK_FORMS.application}
          submitLabel="Submit"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    `<div className="flex gap-2">
            <Button size="sm" variant="outline">
              Request changes
            </Button>
            <Button size="sm" variant="destructive">
              <XCircle className="size-4" />
              Reject
            </Button>
            <Button size="sm">
              <CheckCircle className="size-4" />
              Approve
            </Button>
          </div>`,
    `<div className="flex gap-2">
            <MockActionButton
              label="Request changes"
              title="Request changes"
              description="Ask the applicant to update their submission (demo)."
              fields={[{ name: "comment", label: "Comment", type: "textarea", required: true }]}
              submitLabel="Send request"
              variant="outline"
            />
            <MockActionButton
              label="Reject"
              title="Reject application"
              description="Reject this application (demo)."
              fields={[{ name: "reason", label: "Reason", type: "textarea", required: true }]}
              submitLabel="Reject"
              variant="destructive"
              icon={<XCircle className="size-4" />}
              successMessage="Application rejected (demo)."
            />
            <MockActionButton
              label="Approve"
              title="Approve application"
              description="Approve this application (demo)."
              confirmOnly
              submitLabel="Approve"
              icon={<CheckCircle className="size-4" />}
              successMessage="Application approved (demo)."
            />
          </div>`,
  );
  return s;
});

write("hr/pages.tsx", (s) => {
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<UserPlus className="size-4" \/>\s*Add employee\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Add employee"
          fields={MOCK_FORMS.employee}
          submitLabel="Create employee"
          icon={<UserPlus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Add employee\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Add employee"
          fields={MOCK_FORMS.employee}
          submitLabel="Create employee"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Apply leave\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Apply leave"
          fields={MOCK_FORMS.leave}
          submitLabel="Submit leave"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Banknote className="size-4" \/>\s*Run payroll\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Run payroll"
          title="Run payroll"
          description="Process payroll for the current period (demo)."
          confirmOnly
          submitLabel="Run payroll"
          icon={<Banknote className="size-4" />}
          successMessage="Payroll run started (demo)."
        />
      }`,
  );
  return s;
});

write("fees/pages.tsx", (s) => {
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Generate invoice\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Generate invoice"
          fields={MOCK_FORMS.invoice}
          submitLabel="Generate"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    `<Button size="sm" variant="outline">
          Export ledger
        </Button>`,
    `<MockToastButton label="Export ledger" message="Ledger exported (demo)." />`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*New invoice\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="New invoice"
          fields={MOCK_FORMS.invoice}
          submitLabel="Create invoice"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Receipt className="size-4" \/>\s*Record payment\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Record payment"
          fields={MOCK_FORMS.payment}
          submitLabel="Record"
          icon={<Receipt className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<GraduationCap className="size-4" \/>\s*New application\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="New application"
          title="Scholarship application"
          fields={MOCK_FORMS.application}
          submitLabel="Submit"
          icon={<GraduationCap className="size-4" />}
        />
      }`,
  );
  return s;
});

write("exams/pages.tsx", (s) => {
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Schedule exam\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Schedule exam"
          fields={MOCK_FORMS.exam}
          submitLabel="Schedule"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    `<Button size="sm" variant="outline">
          Export schedule
        </Button>`,
    `<MockToastButton label="Export schedule" message="Exam schedule exported (demo)." />`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Import marks\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Import marks"
          title="Import marks"
          description="Upload marks file (demo)."
          fields={MOCK_FORMS.document}
          submitLabel="Import"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    `<Button size="sm" variant="outline">
          Download transcript
        </Button>`,
    `<MockToastButton label="Download transcript" message="Transcript download started (demo)." />`,
  );
  return s;
});

write("communication/pages.tsx", (s) => {
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Plus className="size-4" \/>\s*Create notice\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Create notice"
          fields={MOCK_FORMS.notice}
          submitLabel="Publish"
          icon={<Plus className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Bell className="size-4" \/>\s*Send notification\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Send notification"
          title="Send notification"
          fields={[
            { name: "channel", label: "Channel", type: "select", options: ["In-app", "Email", "SMS"], required: true },
            { name: "audience", label: "Audience", type: "select", options: ["All", "Students", "Teachers", "Parents"], required: true },
            { name: "message", label: "Message", type: "textarea", required: true },
          ]}
          submitLabel="Send"
          icon={<Bell className="size-4" />}
        />
      }`,
  );
  return s;
});

write("documents/pages.tsx", (s) => {
  s = s.replace(
    /actions=\{\s*<Button size="sm">\s*<Upload className="size-4" \/>\s*Upload document\s*<\/Button>\s*\}/,
    `actions={
        <MockActionButton
          label="Upload document"
          fields={MOCK_FORMS.document}
          submitLabel="Upload"
          icon={<Upload className="size-4" />}
        />
      }`,
  );
  s = s.replace(
    `<Button variant="outline" size="sm">
            <Plus className="size-4" />
            New folder
          </Button>`,
    `<MockActionButton
            label="New folder"
            title="New folder"
            fields={[{ name: "name", label: "Folder name", required: true }]}
            submitLabel="Create"
            variant="outline"
            icon={<Plus className="size-4" />}
          />`,
  );
  return s;
});

write("reports/pages.tsx", (s) => {
  s = s.replace(
    `<Button size="sm">
          <Download className="size-4" />
          Export all
        </Button>`,
    `<MockToastButton label="Export all" message="Reports export started (demo)." icon={<Download className="size-4" />} />`,
  );
  return s;
});

write("settings/pages.tsx", (s) => {
  s = s.replace(/actions=\{<Button size="sm">Save changes<\/Button>\}/g, `actions={<MockToastButton label="Save changes" message="Settings saved (demo)." size="sm" variant="default" />}`);
  s = s.replace(/actions=\{<Button size="sm">Apply branding<\/Button>\}/, `actions={<MockToastButton label="Apply branding" message="Branding applied (demo)." size="sm" variant="default" />}`);
  // multi-line Save changes
  s = s.replace(
    /actions=\{\s*<Button size="sm">Save changes<\/Button>\s*\}/g,
    `actions={<MockToastButton label="Save changes" message="Settings saved (demo)." size="sm" variant="default" />}`,
  );
  s = s.replace(
    `<Button size="sm">
          <Users className="size-4" />
          Invite user
        </Button>`,
    `<MockActionButton
          label="Invite user"
          fields={MOCK_FORMS.userInvite}
          submitLabel="Send invite"
          icon={<Users className="size-4" />}
        />`,
  );
  s = s.replace(
    `<Button size="sm">
          <Shield className="size-4" />
          Create role
        </Button>`,
    `<MockActionButton
          label="Create role"
          fields={[
            { name: "name", label: "Role name", required: true },
            { name: "permissions", label: "Permissions summary", type: "textarea", placeholder: "e.g. manage students, view fees" },
          ]}
          submitLabel="Create"
          icon={<Shield className="size-4" />}
        />`,
  );
  return s;
});

write("platform/pages.tsx", (s) => {
  s = s.replace(
    `actions={<Button variant="outline" size="sm">Export logs</Button>}`,
    `actions={<MockToastButton label="Export logs" message="Audit logs exported (demo)." />}`,
  );
  s = s.replace(
    `actions={<Button size="sm"><Settings className="size-4" />Save changes</Button>}`,
    `actions={<MockToastButton label="Save changes" message="Platform settings saved (demo)." size="sm" variant="default" icon={<Settings className="size-4" />} />}`,
  );
  return s;
});

console.log("done");
