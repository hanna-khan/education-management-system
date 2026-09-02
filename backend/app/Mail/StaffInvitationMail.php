<?php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StaffInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invitation $invitation,
        public string $inviteUrl,
        public string $roleLabel,
        public string $inviterName,
    ) {}

    public function envelope(): Envelope
    {
        $school = $this->invitation->institution?->name ?? 'your institution';

        return new Envelope(
            subject: "You're invited to join {$school} on Zendrock EMS",
        );
    }

    public function content(): Content
    {
        $campuses = \App\Models\Campus::whereIn('id', $this->invitation->campus_ids ?? [])
            ->pluck('name')
            ->all();

        $logoPath = $this->invitation->institution?->logo_url;
        $logoUrl = $logoPath
            ? (str_starts_with($logoPath, 'http') ? $logoPath : url(\Illuminate\Support\Facades\Storage::url($logoPath)))
            : null;

        return new Content(
            html: 'emails.staff-invitation',
            with: [
                'invitation' => $this->invitation,
                'inviteUrl' => $this->inviteUrl,
                'roleLabel' => $this->roleLabel,
                'inviterName' => $this->inviterName,
                'institution' => $this->invitation->institution,
                'campuses' => $campuses,
                'logoUrl' => $logoUrl,
            ],
        );
    }
}
