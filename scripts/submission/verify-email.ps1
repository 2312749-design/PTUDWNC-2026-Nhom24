#requires -Version 7.4
param([Parameter(Mandatory)][string]$RunDirectory)
$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$run=[IO.Path]::GetFullPath($RunDirectory)
if (-not $run.StartsWith((Join-Path $root 'artifacts')+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) { throw 'Expected isolated run.' }
$config=Join-Path $run 'compose.private.json'
$compose=Get-Content -LiteralPath $config -Raw | ConvertFrom-Json -AsHashtable
$mailbox='cbmailtest'+[guid]::NewGuid().ToString('N').Substring(0,8)
$network=$compose.networks.default.name
$override=Join-Path $run 'email.override.json'
@{services=@{api=@{environment=@{Email__Enabled='true';Email__Host=$mailbox;Email__Port='1025';Email__EnableSsl='false';Email__FromAddress='noreply@culinary.test'}}}} |
    ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $override
function Wait-Ready {
    for($i=0;$i -lt 90;$i++) { try { if((Invoke-WebRequest http://localhost:25152/health/ready -TimeoutSec 3 -SkipHttpErrorCheck).StatusCode -eq 200){return} }catch{}; Start-Sleep -Seconds 1 }
    throw 'API not ready.'
}
function Post-Api($path,$body) {
    Invoke-WebRequest -Uri "http://localhost:25152/api/v1/$path" -Method Post -ContentType 'application/json' -Body ($body|ConvertTo-Json -Compress) -SkipHttpErrorCheck
}
try {
    docker run -d --rm --name $mailbox --network $network -p 127.0.0.1:28025:8025 mailhog/mailhog:v1.0.1 | Out-Null
    if($LASTEXITCODE -ne 0){throw 'MailHog did not start.'}
    docker compose -f $config -f $override up -d --no-deps api
    Wait-Ready
    $username='mail'+[guid]::NewGuid().ToString('N').Substring(0,14)
    $email="$username@example.invalid"; $password='Email!'+[guid]::NewGuid().ToString('N')+'A9'
    $registered=Post-Api 'auth/register' @{displayName='Email verification';username=$username;email=$email;password=$password;confirmPassword=$password;captchaQuestion='8 + 5';captchaAnswer='13'}
    if($registered.StatusCode -notin @(200,201)){throw 'Test registration failed.'}
    $forgot=Post-Api 'auth/forgot-password' @{email=$email}
    if($forgot.StatusCode -ne 200){throw 'Forgot password request failed.'}
    $token=$null; $messageCount=0
    for($i=0;$i -lt 45;$i++) {
        $messages=Invoke-RestMethod http://localhost:28025/api/v2/messages
        $ours=@($messages.items | Where-Object { $_.To.Mailbox -contains $username })
        $messageCount=$ours.Count
        foreach($message in $ours){
            $body=[string]$message.Content.Body
            if($message.Content.Headers.'Content-Transfer-Encoding' -contains 'base64'){$body=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($body))}
            if($message.Content.Headers.'Content-Transfer-Encoding' -contains 'quoted-printable') {
                $body=$body -replace '=\r?\n',''
                $body=[regex]::Replace($body,'=([0-9A-Fa-f]{2})',{param($match) [char][Convert]::ToInt32($match.Groups[1].Value,16)})
            }
            if($body -match 'reset-password\?token=([^"<>\s]+)'){$token=[Net.WebUtility]::HtmlDecode($Matches[1])}
        }
        if($token -and $messageCount -ge 2){break}
        Start-Sleep -Seconds 1
    }
    if(-not $token -or $messageCount -lt 2){throw 'Expected both welcome and password-reset email in MailHog.'}
    $newPassword='Changed!'+[guid]::NewGuid().ToString('N')+'B8'
    $resetBody=@{token=[uri]::UnescapeDataString($token);newPassword=$newPassword;confirmPassword=$newPassword}
    $reset=Post-Api 'auth/reset-password' $resetBody
    if($reset.StatusCode -ne 200){throw 'Reset using the received email token failed.'}
    $replay=Post-Api 'auth/reset-password' $resetBody
    if($replay.StatusCode -eq 200){throw 'Reset token was reusable.'}
    $login=Post-Api 'auth/login' @{username=$username;password=$newPassword}
    if($login.StatusCode -ne 200){throw 'New password login failed.'}
    @{passed=$true;welcomeAndResetReceived=$true;messageCount=$messageCount;resetSucceeded=$true;tokenReplayRejected=$true;newPasswordLogin=$true;scope='Local SMTP transport and MailHog; not production mailbox delivery.'} |
        ConvertTo-Json | Set-Content -LiteralPath (Join-Path $root 'artifacts/email-verification.json')
    Write-Host 'PASS: welcome email, reset email, token use/replay and new-password login through local SMTP.'
} finally {
    docker compose -f $config up -d --no-deps api
    Wait-Ready
    docker stop $mailbox | Out-Null
}
