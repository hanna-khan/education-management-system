<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>You're invited</title>
</head>
<body style="margin:0;padding:0;background:#F8F7FC;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3D3558;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F7FC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #E8E4F4;box-shadow:0 18px 50px -28px rgba(107,88,246,0.35);">
          <tr>
            <td style="background:linear-gradient(135deg,#6B58F6,#8C4AF2);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    @if(!empty($logoUrl))
                      <img src="{{ $logoUrl }}" alt="{{ $institution?->name }}" width="48" height="48" style="display:block;border-radius:12px;background:#fff;object-fit:cover;">
                    @else
                      <div style="width:48px;height:48px;border-radius:12px;background:rgba(255,255,255,0.18);color:#fff;font-weight:700;font-size:16px;line-height:48px;text-align:center;">
                        {{ $institution?->logo_initials ?? 'Z' }}
                      </div>
                    @endif
                  </td>
                  <td align="right" style="color:rgba(255,255,255,0.9);font-size:13px;font-weight:600;">
                    Zendrock EMS
                  </td>
                </tr>
              </table>
              <h1 style="margin:24px 0 8px;font-size:26px;line-height:1.25;color:#ffffff;font-weight:700;">
                You're invited to {{ $institution?->name ?? 'join the team' }}
              </h1>
              <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(255,255,255,0.88);">
                {{ $inviterName }} invited you to create your account and get started.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F4F2FB;border-radius:16px;margin-bottom:22px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B58F6;font-weight:700;">Your role</p>
                    <p style="margin:0 0 14px;font-size:18px;font-weight:700;color:#3D3558;">{{ $roleLabel }}</p>
                    @if(count($campuses ?? []) > 0)
                      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B58F6;font-weight:700;">Campus</p>
                      <p style="margin:0;font-size:14px;color:#3D3558;">{{ implode(', ', $campuses) }}</p>
                    @endif
                    <p style="margin:14px 0 0;font-size:13px;color:#8B86A3;">
                      Signed in with <strong style="color:#3D3558;">{{ $invitation->email }}</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 22px;font-size:15px;line-height:1.65;color:#5B5474;">
                Set your password and join your campus workspace. This takes less than a minute.
              </p>

              <table cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 22px;">
                <tr>
                  <td style="border-radius:12px;background:linear-gradient(135deg,#6B58F6,#8C4AF2);">
                    <a href="{{ $inviteUrl }}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;">
                      Accept invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:12px;color:#8B86A3;">
                Link expires {{ optional($invitation->expires_at)->format('M j, Y \a\t g:i A') }}.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#8B86A3;word-break:break-all;">
                Or paste this link in your browser:<br>
                <a href="{{ $inviteUrl }}" style="color:#6B58F6;">{{ $inviteUrl }}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px 28px;border-top:1px solid #F0EDF7;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#8B86A3;">
                © {{ date('Y') }} {{ $institution?->name ?? 'Zendrock EMS' }}. Sent securely by Zendrock Education Management System.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
