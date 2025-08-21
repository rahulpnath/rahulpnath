---
title: Setting Up Dual 4K Monitors - Dell P2715Q and Dell U2718Q
slug: setting-up-multiple-monitors
date_published: 2019-04-03T00:00:00.000Z
date_updated: 2019-04-03T00:00:00.000Z
tags: Productivity
excerpt: Setting up two 4k monitors for home office.
---

![Dual 4k](__GHOST_URL__/content/images/dual_monitor.jpg)
Last week I added another 27' 4k monitor to my home office. It's been a while since I have been thinking of having an extra monitor just for the fun of it and seeing if it has any benefits. I had a [Dell P2715Q](https://www.amazon.com/Dell-Monitor-P2715Q-27-Inch-LED-Lit/dp/B00PC9HFO8) for over a year and was looking to get another one of the same models. However, looks like Dell has stopped this model and was not available at any place in Australia.  The recommended alternative is [Dell U2718Q](https://www.amazon.com/DELL-Screen-LED-Lit-Monitor-U2718Q/dp/B073VYVX5S/), which is a 27' 4k but with thinner bezels. I also like the color and appearance of the new monitor.

I have monitors in the below order with my laptop on the left (which I mostly leave closed for the moment), the new Dell U2718Q in the center (main working display) and the U2718Q on the right (slightly angled in).
![Dual monitor layout](__GHOST_URL__/content/images/dual_monitor_layout.jpg)
### Surface Pro and Dual 4k

My daily work machine is a Surface Pro i7 Model 1796 which has a Mini DisplayPort for outputting the video. With just one Dell monitor connecting it to the Surface was easy and worked great at 60Hz. The only way to connect an extra display off the Surface Pro is to either Daisy Chain the Monitors or have a dock/USB device with more display ports.

The Dell P2715Q does support daisy chaining the monitor; the U2718Q does not. But since there are only two monitors we only need one of the monitors to support MST and also the graphics card on your laptop. MST needs to explicitly enabled on the monitor settings (Menu -> Display -> MST -> Primary). Check out the [User's Guide](https://cdn.cnetcontent.com/a6/3a/a63a60d9-e04e-4eee-bba0-58e8fcd4371f.pdf) for more details, Assume this is because it puts the monitor into 30Hz as opposed to the default 60Hz. a

> Daisy Chaining is straightforward - Output from the laptop goes to the input of the first (in my case P2715Q as only that supports MST), and from the video out of that connect to input on U2718Q.

![Dell MST](__GHOST_URL__/content/images/dual_monitor_mst.jpg)
> ***However note that with MST turned on both the primary and the secondary monitor will be set to 30Hz at 4k resolution.***

**MST Modes**

**Off**: Default mode - 4k2k 60Hz with MST function Disabled.
**Primary**: Set as primary mode at 4K2K 30Hz with MST (DP out) enabled.
**Secondary**: Set as secondary mode at 4K2K 30Hz with MST (DP out) disabled.

You can confirm the display settings from the 'View advanced display info' from the start menu (Windows 10). The Surface Pro runs at 60Hz while the other two monitors are running at 30Hz.
![](__GHOST_URL__/content/images/dual_monitor_surface_display_settings.jpg)![](__GHOST_URL__/content/images/dual_monitor_p2715q_display_settings.jpg)![](__GHOST_URL__/content/images/dual_monitor_u2718q_display_settings.jpg)
I have come across other people mentioning they have had success connecting one 4k from the surface display port and another one from the Surface dock, [both running at 60Hz](https://www.petri.com/run-two-4k-monitors-surface). However, I am not so keen on getting a dock specific to a device.

{{< tweet 1111501024781467648 >}}

There are some options from [Targus](https://www.targus.com/au/docking-stations) and a few other brands, but all are a bit costly. For a full blow list of options on connecting a Surface Pro with multiple monitors check out this [blog post](https://dancharblog.wordpress.com/2018/04/28/surface-book-2-core-i7-with-dual-triple-monitors/).

I have been **working on 30Hz** for the past one week and not finding many issues with it. Primarily my work involves text-based interfaces and not much of videos or image editing. Because of this, I don't see much difference running on a 30Hz. But given a chance, I would like to bump up the experience to work on 60Hz, but that would mean shelling out some extra dollars and getting a dual 4k dock or switching my work machine to my MacBook Pro.

### MacBook Pro (2015)

I have a MacBook Pro (2015) model that I don't use much these days. Even though it is a bit older, it has much [more ports and connectivity](https://support.apple.com/kb/SP719?locale=en_US) than the Surface Pro. It supports two Thunderbolt 2 ports both runs at 60Hz on 4k. It also has an additional HDMI port but supports 4k only at a 30Hz.
![Mac book pro dual 4k](__GHOST_URL__/content/images/dual_monitor_mac.jpg)
If I find much trouble with 4k on 30Hz, I will consider switching over to the MacBook, rather than getting an external dock. Overall having added in an extra monitor does help a lot. The primary monitor usually has Visual Studio or Code, and the second one has Chrome, Teams, Spotify, etc. running. I might consider adding a monitor arm at some time to make arrangement cleaner, but that's something for later!
