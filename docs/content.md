# MagicBridge site: finalized copy

Sourced from the approved deck (`..\magicbridge-diy\docs\presentation`). No em dashes.
The box is a sealed product: never name the internals.

**Product:** MagicBridge, a small box you plug into a second computer to see and control it,
live, from any browser, invisibly. **$549, one-time.**
**One-liner:** See and control your other computer from any browser in your house, and that computer can’t tell anything is there.
**Tagline:** The invisible remote control for a computer you own.

## 1 · Hero
Eyebrow: FOR HARDWARE YOU OWN
Headline: Full control of your machine. From anywhere. Invisible.
Sub: A small box you plug into your other computer. See its screen and take over, live, from any browser in your house, and that computer can’t tell anything is there.
CTA: $549 · once

## 2 · Problem
- It’s out of reach. The machine is in another room, or has no screen or keyboard plugged in at all.
- You don’t want to install anything. Remote-control apps put software on it. That’s extra weight, and something it can detect.
- You don’t want it to know. Store-bought boxes announce themselves. The machine sees a strange new device forever.
Close line: MagicBridge fixes all three. Private, yours for one price, and completely invisible to that computer.

## 3 · The Reveal ⭐ (signature moment)
Setup (what the target computer sees): an ordinary wireless mouse and keyboard receiver · just a plain monitor · a normal PC on the network · a person typing.
Payoff line: To your computer, it’s just a monitor and a keyboard.
Truth (what’s really there): a full remote-control box, hidden in plain sight · it records the screen · a disguised network identity · logs that vanish, plus an encrypted vault.
Chips: Fake USB ID · Fake monitor ID · Disguised on the network · No logs left behind · Human-like typing.

## 4 · How it works (3 steps)
1. Plug in two cables. One carries the other computer’s screen into the box. One makes the box act as its keyboard and mouse.
2. It puts on a disguise. It looks like an ordinary wireless mouse and keyboard, plus a plain monitor. The computer sees nothing odd.
3. Open one web page. On your own laptop, same WiFi, nothing to install. Move your mouse and its cursor moves. Type and it types.
Foot: No software on the other computer. Nothing for it to detect.

## 5 · What sets it apart (6)
- Invisible to the target. It dresses up as an ordinary mouse and monitor, so the other computer never flags a control box. The other devices here can’t do this.
- Sets up from your phone. First run, it makes its own MagicBridge-Setup WiFi. Join from your phone, pick your home network, done. No cable, no screen.
- Wake it, then use it. Power the other computer on from the same page with Wake-on-LAN, or set a wake schedule so it is already up when you need it.
- Connects only when in use. Between sessions it can unplug its own keyboard and mouse from the target, so nothing is attached while you’re away.
- Fixes itself. Plug it in and it sets up its own video and disguise. If WiFi or power blips mid-session, it reconnects on its own.
- Type and paste across. An on-screen keyboard for keys your laptop can’t send, saved clips, key-sequence macros, and paste a password or block of text straight onto the other machine.

## 5b · Control room (newer capabilities)
- A jiggler that runs itself. Keep the target awake with tiny nudges, and tell it when to start and stop: after a set time, at a clock time, or on a repeating daily window. It uses the device’s own clock, shows the timezone, and survives a restart or a power cut.
- See who is connected, and end it. Every open session shows its address, browser and how long it has been there, with a button to disconnect any of them. Your own session is marked so you can’t cut yourself off.
- Picture that gives way to control. On a weak connection it eases the picture back a step so your keyboard and mouse stay sharp, then returns when the line is clean. It never goes sharper than the setting you picked, and a reboot returns to your choice, not a degraded one.
- Lock it behind two factors. Password, plus a 6-digit code when you switch it on, with recovery codes you save once. Signing out ends remembered logins everywhere.
- Run more than one. Name each device so your tabs are easy to tell apart, and keep your own list of units in one launcher page. The name is yours alone: it never reaches the identity the other computer sees.
- Updates in plain words. The update panel lists what changed in language you can act on, not developer shorthand.

## 6 · Specs & speed (sealed, no hardware names)
- 1080p · Full-HD picture
- 50 fps · frames every second, smooth
- ~9 ms · delay on home WiFi, feels live
- ~27 ms · control delay measured over a real remote link
Flow: the other computer’s screen → the MagicBridge box (sees the screen, sends your control) → your browser.
Value points: Feels instant (live video, not a slideshow) · Private (stays on your own network) · Simple (two cables and a web page) · Self-setup (from your phone, no cable).
NOTE (honesty): don’t claim fastest (PiKVM/JetKVM do 1080p60). The video bitrate control is inert on this hardware; quality is set by frame interval, so never advertise a bitrate dial.

## 6b · Remote & protected (Tailscale + the security stack)
Headline: Reach it from anywhere. Nobody else can.
Eyebrow: Included, nothing extra to buy.

Remote access: Tailscale is built in. Turn it on once and your box joins a private network only your devices can see, so you can take over from a hotel, an office, or a phone on mobile data exactly as you would from the next room.
Path: You (any browser, anywhere) → private link (encrypted, direct to your box) → the box (on your network, at home) → the target (sees a monitor and a keyboard).
Note: No ports opened on your router, and no cloud service in the middle holding your screen. The picture and your keystrokes travel straight between your devices.

Six layers between it and everyone else:
1. A password on the page. The control page will not open without it, and the admin side keeps its own separate password.
2. A second factor. Add a 6-digit code from your authenticator app, with recovery codes you save once. Signing out ends remembered logins everywhere.
3. Lock it to your private network. Turn on private-network-only access and the box stops answering anything else, even on your own WiFi.
4. Kick anyone off. Every live session shows its address, browser and how long it has been connected, with one button to disconnect it.
5. Encrypted where it rests. Its settings and secrets are held encrypted on the device, unlocked only as it starts.
6. Logs that never land. Sign-ins and connection history live in memory and are gone on restart. Your WiFi name is never written to storage.

NOTE (sealed product): describe these by what they DO. Never name the encryption scheme, the in-memory log mechanism, or any path. Do not claim rivals lack remote access, several also support Tailscale.

## 7 · Trust
Locked down, and for a computer you own.
- Nothing phones home. No account to create, no cloud service to depend on, and no telemetry. The box works the same if it never reaches the wider internet again.
- Stays on your network. The screen and controls never leave your home. There’s no cloud server for anyone else to reach. Away from home, it comes with you securely over Tailscale.
- Stays on your network. The screen and your controls travel between your own devices. There is no server in the middle holding a copy.
- It’s for YOUR machine. Built to run a second computer you own, privately. Not to watch someone else’s.

## 8 · Comparison (factual)
Columns: Private (no cloud) · Smooth 1080p · Wi-Fi setup from phone · Mouse jiggler · Unplugs when idle · STEALTH (can’t be detected).
Legend: ✓ yes · ~ limited or add-on · ✕ no.
- MagicBridge:      ✓ ✓ ✓ ✓ ✓ ★
- PiKVM:            ✓ ✓ ✕ ✓ ✕ ✕
- TinyPilot:        ✓ ~ ✕ ~ ✕ ✕
- JetKVM:           ✓ ✓ ✕ ✓ ✕ ✕
- StarTech IP-KVM:  ✓ ✕ ✕ ✕ ✕ ✕
Punchline: Plenty of good boxes. Only one the other computer can’t tell is there.
NOTE (honesty): jigglers are common (do not claim exclusive); PiKVM/JetKVM do 1080p60 (don’t claim fastest). MagicBridge alone wins stealth, Wi-Fi phone setup, and unplugs-when-idle.

## 9 · Ready today (positive; do NOT list "not yet" audio/file-transfer)
- Works on any computer. Windows, Mac, or Linux, and even a machine with no operating system yet. To it, the box is just a monitor and mouse.
- Even when it’s stuck. Drive it through a restart, into the BIOS, or when the screen is frozen, exactly when you can’t reach it any other way.
- Use it from anywhere. On your home network, or securely over the internet with built-in Tailscale.
- Reconnects on its own. If WiFi or power blips mid-session, it comes right back without you touching it.
- Wake it from cold. Power the target on remotely, or on a schedule, so it is ready before you are.
- Grows with you. Run several units, name each one, and keep your own list of them in one launcher page.

## 10 · Pricing / Close
One price. No subscriptions, ever. **$549, one-time.**
- Free updates. New features and fixes as they land, at no extra charge.
- Full support. I help you set it up and keep it running. You’re not on your own.
- No lock-in. Nothing phones home. Run it entirely on your own network, forever.
Positioning line: You pay once for the only remote box the other computer can’t see. Commercial KVMs cost this much or more, then bill you every month.
Close: The invisible remote control for a computer you own.
